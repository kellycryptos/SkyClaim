/**
 * Solana SVM x402 Micropayment Client (Pay.sh & Telegraph SVM scheme)
 * Handles 402 Payment Required challenges on Solana Devnet/Mainnet
 * with Zero-Config Sandbox Resilience fallback.
 * 
 * Target Networks:
 * - Solana Devnet: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
 * - Circle Devnet USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
 * - Telegraph Node: https://devnode.telegraphprotocol.com
 */

export interface SolanaPaymentCapture {
  signature?: string;
  txHash?: string;
  rawHeader?: string;
}

export const SOLANA_DEVNET_CAIP2 = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
export const SOLANA_DEVNET_USDC = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

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
      const val = json["signature"] ?? json["tx"] ?? json["transaction"] ?? json["tx_hash"];
      if (typeof val === "string") return val;
    } catch {
      // Raw base58 Solana signature string regex (usually 64 to 88 chars)
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
      import("@x402/svm"),
      import("@solana/kit"),
      import("@scure/base"),
    ]);

    const { wrapFetchWithPaymentFromConfig } = x402Fetch;
    const { ExactSvmScheme, SOLANA_DEVNET_CAIP2, USDC_DEVNET_ADDRESS } = x402Svm;
    const { createKeyPairSignerFromBytes } = solanaKit;
    const { base58 } = scureBase;

    const signer = await createKeyPairSignerFromBytes(base58.decode(solKey));

    return wrapFetchWithPaymentFromConfig(fetch, {
      schemes: [
        {
          network: SOLANA_DEVNET_CAIP2,
          client: new ExactSvmScheme(signer),
        },
      ],
      spendControls: {
        allowedAssets: [
          {
            network: SOLANA_DEVNET_CAIP2,
            asset: USDC_DEVNET_ADDRESS,
            maxAmountPerPayment: "260000",
          },
        ],
      },
    }) as typeof fetch;
  } catch (err) {
    console.warn("[x402-SVM] Failed to initialize Solana payment fetch, falling back to plain fetch:", (err as Error).message);
    return fetch;
  }
}
