export type ClaimVerdict =
  | "APPROVED_FOR_CLAIM"
  | "INELIGIBLE_ON_TIME"
  | "FAIL_CLOSED_WEATHER_CONFLICT";

export type ExecutionMode = "LIVE" | "SIMULATED";

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
  mode: ExecutionMode;
}

export interface FlightDisruptionTelemetry {
  flightNumber: string;
  flightDate: string;
  carrier: string;
  origin: string; // IATA (e.g. LHR, JFK, CDG)
  destination: string; // IATA (e.g. JFK, LAX, ORD)
  distanceKm: number;
  scheduledArrival: string;
  actualArrival: string;
  delayMinutes: number;
  delayCategory: "MECHANICAL_OPERATIONAL" | "ON_TIME" | "WEATHER_IMPACTED";
  rawStatus: string;
}

export interface WeatherScreening {
  hasSevereStormAlert: boolean;
  stormDetails: string;
  sourceAuthority: string; // e.g. MET Norway / NOAA NWS
  extraordinaryCircumstancesRisk: "NONE" | "LOW" | "HIGH_AIRLINE_DEFENSE";
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
  mode: ExecutionMode; // "LIVE" | "SIMULATED"
  verdict: ClaimVerdict;
  verdictRationale: string;
  statutoryRegulation: "EU261" | "UK261" | "US_DOT" | "NONE";
  eligibleCompensation: string;
  compensationAmountEur: number;
  flight: FlightDisruptionTelemetry;
  weather: WeatherScreening;
  receipts: {
    transitMiner: TelegraphReceipt;
    weatherMiner: TelegraphReceipt;
  };
  consensus: {
    rule1DelayMet: boolean;
    rule2WeatherClear: boolean;
    rule3FailClosedTriggered: boolean;
    minerAgreement: boolean;
  };
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
  flightNumber: string;
  flightDate: string;
  title: string;
  route: string;
  carrier: string;
  expectedVerdict: ClaimVerdict;
  summary: string;
}
