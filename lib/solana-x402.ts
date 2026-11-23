/**
 * Solana SVM x402 Micropayment Client (Pay.sh & Telegraph SVM scheme)
 * Handles 402 Payment Required challenges on Solana Devnet/Mainnet
 * with Zero-Config Sandbox Resilience fallback.
 */

export interface SolanaPaymentCapture {
  signature?: string;
  txHash?: string;
  rawHeader?: string;
}

export function extractSolanaTxSignature(settleHeader: string): string | undefined {
  if (!settleHeader) return undefined;
  
  const candidates = [settleHeader];
  try {
    candidates.push(Buffer.from(settleHeader, "base64").toString("utf8"));
  } catch {
    // ignore
  }

  for (const candidate of candidates) {
    try {
      const json = JSON.parse(candidate) as Record<string, unknown>;
      const val = json["signature"] ?? json["tx"] ?? json["transaction"];
      if (typeof val === "string") return val;
    } catch {
      // Raw base58 Solana signature string regex (usually 87-88 chars)
      if (/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(candidate.trim())) {
        return candidate.trim();
      }
    }
  }

  return undefined;
}

export async function createSolanaPaymentFetch(): Promise<typeof fetch> {
  const solKey = process.env.SOLANA_PRIVATE_KEY?.trim();
  if (!solKey) {
    // Zero-config sandbox resilience: return plain fetch if no wallet configured
    return fetch;
  }

  try {
    const [x402Fetch, x402Svm, solanaKit, scureBase] = await Promise.all([
      import("@x402/fetch"),
      import("@x402/svm/exact/client"),
      import("@solana/kit"),
      import("@scure/base"),
    ]);

    const { x402Client, wrapFetchWithPayment } = x402Fetch;
    const { registerExactSvmScheme } = x402Svm;
    const { createKeyPairSignerFromBytes } = solanaKit;
    const { base58 } = scureBase;

    const client = new x402Client();
    const signer = await createKeyPairSignerFromBytes(base58.decode(solKey));
    registerExactSvmScheme(client, { signer });

    return wrapFetchWithPayment(fetch, client) as typeof fetch;
  } catch (err) {
    console.warn("[x402-SVM] Failed to initialize Solana payment fetch, falling back to plain fetch:", (err as Error).message);
    return fetch;
  }
}
