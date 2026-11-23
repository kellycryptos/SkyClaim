export type ClaimVerdict =
  | "ELIGIBLE_FOR_CLAIM"
  | "INELIGIBLE"
  | "FAIL_CLOSED_WEATHER"
  | "INSUFFICIENT_EVIDENCE";

export type ClaimRecommendation =
  | "DRAFT_CLAIM_READY"
  | "NO_PURCHASE_BELOW_THRESHOLD"
  | "HIGH_REJECTION_RISK"
  | "INSUFFICIENT_DATA";

export type DataBadge = "LIVE" | "SIMULATED" | "FIXTURE";
export type FlightDataTag = "FIXTURE" | "LIVE" | "SIMULATED";
export type WeatherDataTag = "LIVE" | "SIMULATED" | "FIXTURE";

export interface PublicLedgerEntry {
  id: string;
  flightNumber: string;
  carrier: string;
  operatingCarrier: string;
  marketingCarrier?: string;
  route: string;
  delayText: string;
  verdict: ClaimVerdict;
  recommendation: ClaimRecommendation;
  recommendationText: string;
  compensationRange: string;
  costUsd: number;
  txHash?: string;
  basescanUrl?: string;
  minerName?: string;
  signalHash?: string;
  timestamp: string;
  badge: DataBadge;
  badgeNote?: string;
  isContested?: boolean;
}

export interface TelegraphReceipt {
  intent: string;
  minerId: string;
  minerName: string;
  networkRank: number;
  servedRank?: number;
  confidence: number;
  latencyMs: number;
  costUsd: number;
  txHash: string;
  basescanUrl: string;
  signalHash: string;
  timestamp: string;
  settled: boolean;
  weatherTag: WeatherDataTag;
  paymentMethod?: string;
  rawDetails?: string;
  rawReceiptJson?: string;
  findings?: any;
  fieldStatus?: any;
}

export interface FlightDisruptionTelemetry {
  flightNumber: string;
  isHypothetical: boolean;
  flightDate: string;
  carrier: string;
  operatingCarrier: string;
  marketingCarrier?: string;
  isOperatingCarrierEUUK: boolean;
  operatingCarrierExclusionReason?: string;
  origin: string; // e.g. JFK, ORD, BOS (US Departure)
  destination: string; // e.g. LHR, CDG, FRA (Europe)
  distanceKm: number;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  arrivalDelayMinutes: number; // Statutory basis for EU261
  delayCategory: "MECHANICAL_OPERATIONAL" | "ON_TIME" | "WEATHER_IMPACTED";
  rawStatus: string;
  tag: FlightDataTag;
}

export interface SecondaryCrossCheck {
  source: string;
  status: "CONSISTENT" | "DISCREPANCY" | "BYPASS" | "STATION_REPORT";
  departureFltCat?: string; // VFR, MVFR, IFR, LIFR
  arrivalFltCat?: string;
  details: string;
  confidence: number;
}

export interface WeatherScreening {
  departureAirport: string;
  departureWeather: string;
  hasSevereDepartureAlert: boolean;
  arrivalAirport: string;
  arrivalWeather: string;
  hasSevereArrivalAlert: boolean;
  bothCorridorsClear: boolean;
  coverageNote: string;
  hasSevereStormAlert: boolean; // Backwards compatible: true if dep OR arr has severe alert
  stormDetails: string;
  sourceAuthority: string;
  secondaryCrossCheck: SecondaryCrossCheck;
  extraordinaryCircumstancesRisk: "NONE" | "HIGH_AIRLINE_DEFENSE";
  isInconclusive?: boolean;
  tag: WeatherDataTag;
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
  caseNumber?: 1 | 2 | 3;
  caseTitle: string;
  caseCopy: string;
  badge: DataBadge;
  badgeNote: string;
  verdict: ClaimVerdict;
  verdictRationale: string;
  recommendation: ClaimRecommendation;
  recommendationText: string;
  statutoryRegulation: "EU261" | "UK261" | "NONE";
  statutoryDelayBasis: string; // "Arrival delay at final destination (EU261 Court of Justice standard)"
  eligibleCompensationRange: string; // e.g. "€300 – €600 (to be checked under Art. 7(2))"
  compensationNote: string;
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
  isHypothetical: boolean;
  flightDate: string;
  title: string;
  route: string;
  carrier: string;
  operatingCarrier: string;
  marketingCarrier?: string;
  isOperatingCarrierEUUK: boolean;
  operatingCarrierExclusionReason?: string;
  arrivalDelayMinutes: number;
  badge: DataBadge;
  expectedVerdict: ClaimVerdict;
  eligibleCompensationRange: string;
  exactCopy: string;
}
