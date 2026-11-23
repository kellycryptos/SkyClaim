export type SettlementVerdict =
  | "SETTLEMENT_AUTHORIZED"
  | "FAIL_CLOSED_SANCTIONS"
  | "FAIL_CLOSED_RESERVE_DISCREPANCY"
  | "FAIL_CLOSED_RESTRICTED_ASSET"
  | "INSUFFICIENT_TELEMETRY";

export type SettlementCategory =
  | "INSTITUTIONAL_TRANSFER"
  | "RWA_REDEMPTION"
  | "AGENT_COMMERCE";

export type DataBadge = "LIVE" | "SIMULATED" | "FIXTURE";

export interface CounterpartyEntity {
  name: string;
  lei: string;
  jurisdiction: string;
  solanaAddress: string;
  sanctionsStatus: "CLEAN" | "FLAGGED" | "BLOCKED";
  kybStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
  riskScore: number; // 0-100 (lower is safer)
}

export interface RwaAssetProfile {
  tokenSymbol: string;
  tokenMint: string;
  issuer: string;
  onChainSupply: number;
  offChainReservesUsd: number;
  reserveRatioPercent: number;
  custodianBank: string;
  lastAttestationDate: string;
  attestationStatus: "FULLY_BACKED" | "DISCREPANCY_FLAGGED" | "PENDING_AUDIT";
}

export interface TelegraphSolanaReceipt {
  intent: string;
  minerId: string;
  minerName: string;
  networkRank: number;
  servedRank?: number;
  confidence: number;
  latencyMs: number;
  costUsd: number;
  paymentRail: "Pay.sh / Solana USDC" | "Base Sepolia EIP-712" | "GLEIF Registry / SVM Scheme";
  signature?: string;
  explorerUrl?: string;
  signalHash: string;
  timestamp: string;
  settled: boolean;
  badge: DataBadge;
  findingsSummary: string;
}

export interface SecondaryRegistryCrossCheck {
  registrySource: string;
  status: "CONFIRMED_MATCH" | "DISCREPANCY" | "BYPASS";
  matchedId: string;
  notes: string;
  confidence: number;
}

export interface InstitutionalSettlementResult {
  settlementId: string;
  timestamp: string;
  category: SettlementCategory;
  verdict: SettlementVerdict;
  verdictTitle: string;
  transferAmountUsd: number;
  tokenSymbol: string;
  sourceAccount: string;
  destinationAccount: string;
  counterparty: CounterpartyEntity;
  rwaProfile?: RwaAssetProfile;
  telegraphReceipts: TelegraphSolanaReceipt[];
  secondaryCheck: SecondaryRegistryCrossCheck;
  settlementDossier: string;
  badge: DataBadge;
  badgeNote?: string;
  totalCostUsd: number;
  payShSupported: boolean;
  circuitBreakerEngaged: boolean;
}

export interface SettlementPreset {
  id: string;
  title: string;
  subtitle: string;
  category: SettlementCategory;
  amountUsd: number;
  tokenSymbol: string;
  sourceAccount: string;
  destinationAccount: string;
  counterpartyName: string;
  expectedVerdict: SettlementVerdict;
  description: string;
}
