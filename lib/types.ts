export type ListingVerdict = 'APPROVED' | 'CONDITIONAL' | 'REJECTED';

export type IntentName =
  | 'SMART_CONTRACT_AUDIT'
  | 'SANCTIONS_SCREENING_MATCH'
  | 'ONCHAIN_METRIC_VERIFY'
  | 'SOCIAL_BOT_DETECTION'
  | 'SECURITY_REVIEW';

export interface TelegraphReceipt {
  intent: IntentName;
  minerId: string;
  minerName: string;
  networkRank: number;
  confidence: number;
  latencyMs: number;
  costUsd: number;
  txHash: string;
  basescanUrl: string;
  signalHash: string;
  timestamp: string;
  settled: boolean;
}

export interface IntentAuditResult {
  intent: IntentName;
  label: string;
  category: 'contract' | 'compliance' | 'liquidity' | 'social' | 'security';
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0-100 (higher means riskier)
  findings: string[];
  receipt: TelegraphReceipt;
  rawResponse?: any;
}

export interface ListingRiskMemo {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  timestamp: string;
  evaluatedBy: string;
  overallRiskScore: number; // 0-100
  verdict: ListingVerdict;
  verdictRationale: string;
  totalCostUsd: number;
  totalLatencyMs: number;
  mode: 'LIVE_TELEGRAPH_NETWORK' | 'SANDBOX_DEMO_FIXTURE';
  results: Record<IntentName, IntentAuditResult>;
  accounting: {
    queriesFired: number;
    receiptsVerified: number;
    settlementChain: string;
    settlementToken: string;
    payerAddress: string;
    diamondContract: string;
  };
}
