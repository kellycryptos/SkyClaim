export type ClaimVerdict =
  | "CLAIM_LOOKS_VIABLE"
  | "DELAY_TOO_SHORT"
  | "WEATHER_RISK";

export type ClaimRecommendation =
  | "DRAFT_CLAIM_READY"
  | "NO_PURCHASE_BELOW_THRESHOLD"
  | "HIGH_REJECTION_RISK";

export type FlightDataTag = "FIXTURE" | "LIVE";
export type WeatherDataTag = "LIVE" | "RECORDED" | "SIMULATED";

export interface PublicLedgerEntry {
  id: string;
  flightNumber: string;
  carrier: string;
  route: string;
  delayText: string;
  verdict: ClaimVerdict;
  recommendation: ClaimRecommendation;
  recommendationText: string;
  compensationEur: number;
  costUsd: number;
  txHash: string;
  basescanUrl: string;
  timestamp: string;
  flightTag: FlightDataTag;
  weatherTag: WeatherDataTag;
}

export interface TelegraphReceipt {
  intent: string;
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
  weatherTag: WeatherDataTag;
  recordedDate?: string;
  rawDetails?: string;
}

export interface FlightDisruptionTelemetry {
  flightNumber: string;
  flightDate: string;
  carrier: string;
  origin: string; // e.g. JFK, ORD, BOS (US Departure)
  destination: string; // e.g. LHR, CDG, FRA (Europe)
  distanceKm: number;
  scheduledDeparture: string;
  actualDeparture: string;
  delayMinutes: number;
  delayCategory: "MECHANICAL_OPERATIONAL" | "ON_TIME" | "WEATHER_IMPACTED";
  rawStatus: string;
  tag: FlightDataTag;
}

export interface WeatherScreening {
  departureAirport: string;
  hasSevereStormAlert: boolean;
  stormDetails: string;
  sourceAuthority: string;
  extraordinaryCircumstancesRisk: "NONE" | "HIGH_AIRLINE_DEFENSE";
  tag: WeatherDataTag;
  recordedDate?: string;
}

export interface BudgetGuardInfo {
  perRequestCapUsd: number;
  dailySpendCapUsd: number;
  currentDailySpendUsd: number;
  rateLimitRemaining: number;
}

export interface SkyClaimResult {
  claimId: string;
  timestamp: string;
  caseNumber: 1 | 2 | 3;
  caseTitle: string;
  caseCopy: string;
  verdict: ClaimVerdict;
  verdictRationale: string;
  recommendation: ClaimRecommendation;
  recommendationText: string;
  statutoryRegulation: "EU261" | "UK261" | "NONE";
  eligibleCompensation: string;
  compensationAmountEur: number;
  flight: FlightDisruptionTelemetry;
  weather: WeatherScreening;
  receipt?: TelegraphReceipt;
  totalCostUsd: number;
  totalLatencyMs: number;
  draftClaimLetter: string;
  budgetGuard: BudgetGuardInfo;
  accounting: {
    queriesFired: number;
    receiptsVerified: number;
    settlementChain: string;
    settlementToken: string;
    diamondContract: string;
    payerAddress: string;
  };
}

export interface PresetScenario {
  id: string;
  caseNumber: 1 | 2 | 3;
  flightNumber: string;
  flightDate: string;
  title: string;
  route: string;
  carrier: string;
  delayMinutes: number;
  expectedVerdict: ClaimVerdict;
  exactCopy: string;
}
