import { ethers } from "ethers";

export interface X402Accept {
  scheme: string;
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra?: { name?: string; version?: string; [k: string]: unknown };
}

export interface X402Challenge {
  x402Version: number;
  error?: string;
  resource?: { url: string; description?: string; mimeType?: string };
  accepts: X402Accept[];
}

export function decodeChallenge(header: string): X402Challenge {
  return JSON.parse(Buffer.from(header, "base64").toString("utf8"));
}

export interface SignedPayment {
  header: string; // base64 PAYMENT-SIGNATURE value
  authorization: {
    from: string;
    to: string;
    value: string;
    validAfter: string;
    validBefore: string;
    nonce: string;
  };
  accept: X402Accept;
}

/**
 * Signs the EVM (eip155:84532) option of a 402 challenge with an ethers wallet.
 * Uses gasless EIP-3009 TransferWithAuthorization (EIP-712 typed data).
 */
export async function signPayment(
  challenge: X402Challenge,
  wallet: ethers.Wallet,
  targetChainId: number = 84532
): Promise<SignedPayment> {
  const accept = challenge.accepts.find((a) => a.network === `eip155:${targetChainId}`);
  if (!accept) {
    throw new Error(`No eip155:${targetChainId} payment option found in 402 challenge`);
  }

  const now = Math.floor(Date.now() / 1000);
  const authorization = {
    from: ethers.getAddress(wallet.address),
    to: ethers.getAddress(accept.payTo),
    value: accept.amount,
    validAfter: String(now - 30),
    validBefore: String(now + Math.max(accept.maxTimeoutSeconds ?? 60, 300)),
    nonce: ethers.hexlify(ethers.randomBytes(32)),
  };

  const domain = {
    name: accept.extra?.name ?? "USDC",
    version: accept.extra?.version ?? "2",
    chainId: targetChainId,
    verifyingContract: ethers.getAddress(accept.asset),
  };

  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  const signature = await wallet.signTypedData(domain, types, {
    from: authorization.from,
    to: authorization.to,
    value: BigInt(authorization.value),
    validAfter: BigInt(authorization.validAfter),
    validBefore: BigInt(authorization.validBefore),
    nonce: authorization.nonce,
  });

  const payload = {
    x402Version: 2,
    scheme: "exact",
    network: accept.network,
    accepted: accept,
    payload: { signature, authorization },
    extensions: {},
  };

  return {
    header: Buffer.from(JSON.stringify(payload)).toString("base64"),
    authorization,
    accept,
  };
}

export interface X402FetchResult {
  response: Response;
  paid: boolean;
  payment?: SignedPayment;
}

/**
 * Executes an HTTP fetch handling x402 challenge negotiation transparently.
 */
export async function fetchWithX402Payment(
  url: string,
  options: RequestInit,
  wallet?: ethers.Wallet,
  chainId: number = 84532
): Promise<X402FetchResult> {
  // First attempt: unauthenticated request
  const firstRes = await fetch(url, options);

  if (firstRes.status !== 402) {
    return { response: firstRes, paid: false };
  }

  const challengeHeader = firstRes.headers.get("Payment-Required");
  if (!challengeHeader) {
    throw new Error("HTTP 402 received without Payment-Required challenge header");
  }

  if (!wallet) {
    throw new Error("HTTP 402 Payment Required: No wallet provided to sign payment authorization");
  }

  // Parse challenge & sign payment
  const challenge = decodeChallenge(challengeHeader);
  const payment = await signPayment(challenge, wallet, chainId);

  // Retry with signed authorization header
  const headers = new Headers(options.headers || {});
  headers.set("PAYMENT-SIGNATURE", payment.header);

  const secondRes = await fetch(url, {
    ...options,
    headers,
  });

  return {
    response: secondRes,
    paid: true,
    payment,
  };
}
