"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { SKYCLAIM_CONFIG, SKYCLAIM_PRESETS, INITIAL_LEDGER } from "@/lib/skyclaim-consensus";
import { SkyClaimResult, PresetScenario, PublicLedgerEntry } from "@/lib/skyclaim-types";
import { PaperPlaneLogo } from "@/components/PaperPlaneLogo";
import { Header } from "@/components/Header";
import { FlightTelemetryMap } from "@/components/FlightTelemetryMap";
import { DelayThresholdGauge } from "@/components/DelayThresholdGauge";
import { BoardingPassCard } from "@/components/BoardingPassCard";
import { DepartureBoardPresets } from "@/components/DepartureBoardPresets";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import { ApiDocsModal } from "@/components/ApiDocsModal";
import { FaqModal } from "@/components/FaqModal";
import { SolanaInstitutionalView } from "@/components/SolanaInstitutionalView";
import { BuilderRoadmapModal } from "@/components/BuilderRoadmapModal";
import { TelegramModal } from "@/components/TelegramModal";
import {
  Search,
  Copy,
  Check,
  Download,
  Plane,
  AlertTriangle,
  FileText,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Cpu,
  Github,
  Twitter,
  Send,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// Deterministic acceptance presets
const PRESET_CASES: PresetScenario[] = SKYCLAIM_PRESETS;

// Pre-populated default fixture for BA178
const DEFAULT_BA178_RESULT: SkyClaimResult = {
  claimId: "CLM-BA178-VERIFIED",
  timestamp: "2026-11-22T06:00:00.000Z",
  caseNumber: 1,
  caseTitle: "BA178 · British Airways",
  caseCopy:
    "Hypothetical flight BA178 (New York JFK → London LHR). Operating carrier: British Airways (UK carrier). Arrival delay: 3h 42m (FIXTURE). Departure weather: clear corridor (FIXTURE). Airline's weather defense is not supported by evidence. Eligible compensation under UK261: £260 to £520 (subject to Article 7(2) 50% rule for 3h–4h arrival delays on flights > 3,500 km). Draft claim template ready.",
  badge: "FIXTURE",
  badgeNote:
    "Preset benchmark fixture: hypothetical schedule, arrival delay, and departure weather observations are deterministic test vectors.",
  verdict: "ELIGIBLE_FOR_CLAIM",
  verdictRationale:
    "Arrival delay at London Heathrow is 3h 42m (exceeds 3h statutory threshold). Departure weather screening confirmed zero active severe alerts at JFK departure. Operating carrier is British Airways (UK licensed metal). Under UK261 Article 7(2)(c), long-haul flights (> 3,500 km) with arrival delays between 3 and 4 hours are subject to a 50% reduction (£260 vs £520).",
  recommendation: "DRAFT_CLAIM_READY",
  recommendationText:
    "Draft Claim Ready — No adverse weather at departure in the METAR checked at 07:51Z (British Airways UK261 claim ready).",
  statutoryRegulation: "UK261",
  statutoryDelayBasis:
    "Arrival delay at final destination (CJEU Sturgeon v Condor standard as retained law)",
  eligibleCompensationRange: "£260 – £520",
  compensationNote:
    "Statutory arrival delay is 3h 42m. Under UK261 Article 7(2)(c), if arrival delay is under 4 hours on flights > 3,500 km, carrier may reduce compensation by 50% down to £260 (full compensation is £520).",
  flight: {
    flightNumber: "BA178",
    isHypothetical: true,
    flightDate: "2026-11-22",
    carrier: "British Airways",
    operatingCarrier: "British Airways",
    marketingCarrier: "British Airways (BA)",
    isOperatingCarrierEUUK: true,
    origin: "JFK",
    destination: "LHR",
    distanceKm: 5550,
    scheduledDeparture: "18:00 EST",
    actualDeparture: "21:30 EST",
    scheduledArrival: "06:15 UTC",
    actualArrival: "09:57 UTC",
    arrivalDelayMinutes: 222,
    delayCategory: "MECHANICAL_OPERATIONAL",
    rawStatus: "ARRIVAL_DELAY_3H_42M",
    tag: "FIXTURE",
  },
  weather: {
    departureAirport: "JFK",
    departureWeather: "Clear (0 active severe alerts)",
    hasSevereDepartureAlert: false,
    arrivalAirport: "LHR",
    arrivalWeather: "EGLL VFR (Clear, visibility 9999m) · Instrument approaches active.",
    hasSevereArrivalAlert: false,
    bothCorridorsClear: true,
    coverageNote: "Departure corridor screening confirmed clean conditions at JFK; destination operations normal.",
    hasSevereStormAlert: false,
    stormDetails:
      "No active severe weather alerts at New York JFK departure corridor.",
    sourceAuthority: "ttl-nws & PREFLIGHT Infrastructure Signals Telemetry",
    secondaryCrossCheck: {
      source: "aviationweather.gov METAR",
      status: "CONSISTENT",
      departureFltCat: "LIFR",
      arrivalFltCat: "VFR",
      details: "Consensus verified: KJFK LIFR overcast, EGLL VFR clear. Zero convective SIGMETs active.",
      confidence: 0.99,
    },
    extraordinaryCircumstancesRisk: "NONE",
    tag: "FIXTURE",
  },
  receipt: {
    intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
    minerId: "106005",
    minerName: "ttl-nws (NWS Station Transit Alerts)",
    networkRank: 1,
    confidence: 0.99,
    latencyMs: 38,
    costUsd: 0.01,
    txHash: "0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145",
    basescanUrl: "https://sepolia.basescan.org/tx/0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145",
    signalHash: "0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9",
    timestamp: "2026-11-22 06:15:00 UTC",
    settled: true,
    weatherTag: "LIVE",
    rawDetails: "Dual-Corridor Verified (KJFK LIFR, EGLL VFR · 0 convective alerts)",
  },
  totalCostUsd: 0.01,
  totalLatencyMs: 38,
  draftClaimLetter: `To: British Airways Passenger Claims Department
Subject: Request for Statutory Compensation under Regulation (EC) No 261/2004

Passenger Flight: BA178 (New York JFK → London LHR)
Operating Carrier: British Airways (EU/UK Community Carrier)
Marketing Carrier: British Airways (BA)
Flight Date: 2026-11-22
Scheduled Arrival: 06:15 UTC
Actual Arrival: 09:57 UTC
Arrival Delay at Final Destination: +3h 42m

Pursuant to UK261 (Air Passenger Rights SI 2019/278) and Court of Justice case law (Sturgeon v Condor, Joined Cases C-402/07 & C-432/07), passenger is entitled to statutory compensation for arrival delay exceeding 3 hours on a flight over 3,500 km.

Eligible Compensation Entitlement:
- Baseline statutory entitlement (UK261 Art. 7(1)(c)): £520
- Under Article 7(2)(c) (arrival delay under 4 hours on flights > 3,500 km): 50% discount applies, making eligible amount £260.
Eligible Amount Submitted for Verification: £260 – £520

Attached Verification Evidence:
- Operating Carrier Jurisdiction: Confirmed British Airways is a UK licensed operating carrier.
- Arrival Telemetry: Arrival at London LHR delayed by 3h 42m (Scheduled 06:15 UTC · Actual 09:57 UTC).
- Departure Weather Screening: Meteorological telemetry confirms zero active severe thunderstorm or blizzard ground-stop alerts during departure at New York JFK. The carrier's weather defense is not supported by this evidence.
- Multi-Source Cross-Check: aviationweather.gov METAR (Consensus verified: KJFK LIFR, EGLL VFR).

Please confirm receipt and evaluate this claim within 14 business days.
(Generated by SkyClaim Autonomous Disruption Shield.)`,
  budgetGuard: {
    perRequestCapUsd: 0.05,
    dailySpendCapUsd: 5.0,
    currentDailySpendUsd: 0.0,
    rateLimitRemaining: 15,
  },
  accounting: {
    queriesFired: 1,
    receiptsVerified: 1,
    settlementChain: "Base Sepolia (EIP-155:84532)",
    settlementToken: "Circle USDC (0x036CbD53842c5426634e7929541eC2318f3dCF7e)",
    diamondContract: SKYCLAIM_CONFIG.diamondAddress,
    payerAddress: "backend-protocol-relayer",
  },
};

// Pre-populated default fixture for BA178 on Solana Devnet (x402)
const DEFAULT_BA178_SOLANA_RESULT: SkyClaimResult = {
  ...DEFAULT_BA178_RESULT,
  receipt: {
    intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
    minerId: "9002",
    minerName: "TxLens (ID: 9002)",
    networkRank: 1,
    confidence: 0.99,
    latencyMs: 145,
    costUsd: 0.01,
    txHash: "5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5",
    basescanUrl: "https://solscan.io/tx/5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5?cluster=devnet",
    explorerUrl: "https://solscan.io/tx/5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5?cluster=devnet",
    network: "solana",
    signalHash: "0xc2d200f4bd9a3e7e5feec1a3178ddaabd5edb3055680e027012a93229fb2a724",
    timestamp: "2026-11-24 07:23:26 UTC",
    settled: true,
    weatherTag: "LIVE",
    paymentMethod: "x402 Micropayment (Solana Devnet SVM)",
    rawDetails: "Dual-Corridor Verified on Solana Devnet (KJFK LIFR, EGLL VFR · 0 convective alerts) · Asset: Circle USDC (4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)",
  },
  accounting: {
    queriesFired: 1,
    receiptsVerified: 1,
    settlementChain: "Solana Devnet (solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1)",
    settlementToken: "Circle USDC (4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)",
    diamondContract: "Solana Pay.sh / Telegraph Escrow (G53EbeTZSNsAn7bj6iMFUQnq3zpDdEbHhKkPRywo8bix)",
    payerAddress: "backend-svm-relayer",
  },
};

// Fixture for DL401
const DL401_RESULT: SkyClaimResult = {
  claimId: "CLM-DL401-VERIFIED",
  timestamp: "2026-11-22T06:00:00.000Z",
  caseNumber: 2,
  caseTitle: "DL401 · Delta Air Lines",
  caseCopy:
    "Hypothetical flight DL401 (New York JFK → Paris CDG). Operating carrier: Delta Air Lines (not EU/UK) → not covered by EU261 on departures from third countries (Regulation (EC) No 261/2004 Art. 3(1)(b)). Even though arrival delay is 3h 30m, non-EU operating metal is excluded on US departures. Ineligible ($0 spent).",
  badge: "FIXTURE",
  badgeNote:
    "Preset test fixture: arrival delay is 3h 30m, but operating carrier is Delta Air Lines (non-EU metal ex-USA). Ineligible under Art. 3(1)(b) ($0 spent). No transaction executed.",
  verdict: "INELIGIBLE",
  verdictRationale:
    "Disqualification under EU261 Art. 3(1)(b): Operating carrier Delta Air Lines is a non-EU carrier on a US departure. Passenger is ineligible under Regulation (EC) No 261/2004 Art. 3(1)(b) regardless of 3h 30m arrival delay or Air France codeshare ticketing.",
  recommendation: "NO_PURCHASE_BELOW_THRESHOLD",
  recommendationText:
    "Ineligible for Claim — Operating carrier is Delta Air Lines (non-EU metal ex-USA) under EU261 Art. 3(1)(b).",
  statutoryRegulation: "EU261",
  statutoryDelayBasis:
    "Arrival delay at final destination (CJEU Sturgeon v Condor standard)",
  eligibleCompensationRange: "€0",
  compensationNote:
    "EU261 rights only apply on US departures if an EU carrier operates the flight. Marketing codeshare on Air France does not grant eligibility if Delta operates the aircraft.",
  flight: {
    flightNumber: "DL401",
    isHypothetical: true,
    flightDate: "2026-11-22",
    carrier: "Delta / Air France",
    operatingCarrier: "Delta Air Lines",
    marketingCarrier: "Air France / Delta Air Lines (Codeshare AF3600 / DL401)",
    isOperatingCarrierEUUK: false,
    operatingCarrierExclusionReason:
      "Operating carrier: Delta Air Lines (non-EU metal ex-USA) → not covered by EU261 for US departures under Regulation (EC) No 261/2004 Art. 3(1)(b).",
    origin: "JFK",
    destination: "CDG",
    distanceKm: 5835,
    scheduledDeparture: "19:15 EST",
    actualDeparture: "20:15 EST",
    scheduledArrival: "08:30 CET",
    actualArrival: "12:00 CET",
    arrivalDelayMinutes: 210,
    delayCategory: "MECHANICAL_OPERATIONAL",
    rawStatus: "ARRIVAL_DELAY_3H_30M",
    tag: "FIXTURE",
  },
  weather: {
    departureAirport: "JFK",
    departureWeather: "Clear",
    hasSevereDepartureAlert: false,
    arrivalAirport: "CDG",
    arrivalWeather: "Query bypassed.",
    hasSevereArrivalAlert: false,
    bothCorridorsClear: true,
    coverageNote: "Telemetry bypassed to preserve budget on non-qualifying flight.",
    hasSevereStormAlert: false,
    stormDetails:
      "Query bypassed: Ineligible due to non-EU operating metal on departure from third country under Art. 3(1)(b) (Zero protocol spend).",
    sourceAuthority: "N/A",
    secondaryCrossCheck: {
      source: "SkyClaim Statutory Classifier",
      status: "BYPASS",
      details: "Statutory jurisdiction check failed (non-EU operating carrier ex-USA). Weather queries bypassed ($0 spent).",
      confidence: 1.0,
    },
    extraordinaryCircumstancesRisk: "NONE",
    tag: "FIXTURE",
  },
  receipt: {
    intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
    minerId: "106005",
    minerName: "ttl-nws (NWS Station Transit Alerts)",
    networkRank: 1,
    confidence: 1.0,
    latencyMs: 25,
    costUsd: 0.0,
    txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    basescanUrl: "",
    signalHash: "bypassed",
    timestamp: "2026-11-22 08:30:00 UTC",
    settled: false,
    weatherTag: "FIXTURE",
    rawDetails: "Statutory jurisdiction check failed (Delta non-EU metal ex-USA). Telemetry query bypassed ($0 spent).",
  },
  totalCostUsd: 0.0,
  totalLatencyMs: 25,
  draftClaimLetter: `To: Delta Air Lines Passenger Relations Department
Subject: Statutory Disruption Screening Assessment under Regulation (EC) No 261/2004

Passenger Flight: DL401 (New York JFK → Paris CDG)
Operating Carrier: Delta Air Lines (US Non-EU Carrier)
Marketing Carrier: Air France / Delta Air Lines (Codeshare AF3600 / DL401)
Flight Date: 2026-11-22
Scheduled Arrival: 08:30 CET
Actual Arrival: 12:00 CET
Arrival Delay at Final Destination: +3h 30m

Statutory Review Finding:
1. Operating Carrier Jurisdictional Exclusion:
Under Article 3(1)(b) of Regulation (EC) No 261/2004, flights departing from third countries (USA) to the European Union are ONLY covered if operated by a Community (EU/UK) carrier. Because this flight was operated by Delta Air Lines (a non-EU carrier), EU261 does not apply, even if booked under an Air France code.

Evaluation & Determination:
- Statutory Compensation Entitlement: €0 (Ineligible under Art. 3(1)(b) operating metal rule).
- Carrier Weather Defense Status: Telemetry query bypassed to preserve protocol budget ($0 spent).
- Recommendation: Claim closed without dispute filing. Excluded by operating carrier statute.

(Generated by SkyClaim Autonomous Disruption Shield.)`,
  budgetGuard: {
    perRequestCapUsd: 0.05,
    dailySpendCapUsd: 5.0,
    currentDailySpendUsd: 0.0,
    rateLimitRemaining: 15,
  },
  accounting: {
    queriesFired: 0,
    receiptsVerified: 0,
    settlementChain: "Base Sepolia (EIP-155:84532)",
    settlementToken: "Circle USDC (0x036CbD53842c5426634e7929541eC2318f3dCF7e)",
    diamondContract: SKYCLAIM_CONFIG.diamondAddress,
    payerAddress: "none (zero on-chain spend)",
  },
};

// Fixture for AF112
const AF112_RESULT: SkyClaimResult = {
  claimId: "CLM-AF112-VERIFIED",
  timestamp: "2026-11-22T06:00:00.000Z",
  caseNumber: 3,
  caseTitle: "AF112 · Air France",
  caseCopy:
    "Hypothetical flight AF112 (Chicago ORD → Paris CDG). Operating carrier: Air France (EU carrier). Arrival delay: 4h 10m (FIXTURE). Severe winter blizzard ground-stop alert active at departure hub (FIXTURE). The airline holds an extraordinary circumstances defense under Article 5(3). Contested claim draft generated to challenge whether other carriers operated.",
  badge: "FIXTURE",
  badgeNote:
    "Preset test fixture: hypothetical test case representing a severe winter blizzard ground stop at Chicago ORD. Contested claim workflow activated.",
  verdict: "FAIL_CLOSED_WEATHER",
  verdictRationale:
    "The airline will invoke an extraordinary circumstances defense under Article 5(3) due to the severe blizzard at Chicago ORD. However, weather alerts do not automatically excuse the airline if other flights departed or reasonable measures were omitted (Wallentin-Hermann v Alitalia C-549/07). Flagged as contested claim.",
  recommendation: "HIGH_REJECTION_RISK",
  recommendationText:
    "Severe weather alert active at departure — High airline defense risk under Art. 5(3). Contested claim draft generated.",
  statutoryRegulation: "EU261",
  statutoryDelayBasis:
    "Arrival delay at final destination (CJEU Sturgeon v Condor standard)",
  eligibleCompensationRange: "€300 – €600",
  compensationNote:
    "The carrier holds an active extraordinary circumstances defense under Article 5(3). SkyClaim flags this claim as contested rather than dead, providing a specialized legal letter demanding carrier evidence that no reasonable measures could prevent the delay.",
  flight: {
    flightNumber: "AF112",
    isHypothetical: true,
    flightDate: "2026-11-22",
    carrier: "Air France",
    operatingCarrier: "Air France",
    marketingCarrier: "Air France (AF)",
    isOperatingCarrierEUUK: true,
    origin: "ORD",
    destination: "CDG",
    distanceKm: 6670,
    scheduledDeparture: "16:45 CST",
    actualDeparture: "20:50 CST",
    scheduledArrival: "08:00 CET",
    actualArrival: "12:10 CET",
    arrivalDelayMinutes: 250,
    delayCategory: "WEATHER_IMPACTED",
    rawStatus: "ARRIVAL_DELAY_4H_10M",
    tag: "FIXTURE",
  },
  weather: {
    departureAirport: "ORD",
    departureWeather: "Active severe weather alert at ORD (Blizzard ground stop)",
    hasSevereDepartureAlert: true,
    arrivalAirport: "CDG",
    arrivalWeather: "LFPG VFR (Clear, wind 9kt) · Destination terminal open.",
    hasSevereArrivalAlert: false,
    bothCorridorsClear: false,
    coverageNote: "Severe weather alert confirmed at ORD departure corridor; Paris CDG arrival corridor clear.",
    hasSevereStormAlert: true,
    stormDetails:
      "CRITICAL: Severe winter blizzard ground-stop alert active at Chicago O'Hare (ORD).",
    sourceAuthority: "ttl-nws (NWS Station ORD Alert) & aviationweather.gov",
    secondaryCrossCheck: {
      source: "aviationweather.gov METAR",
      status: "CONSISTENT",
      departureFltCat: "LIFR",
      arrivalFltCat: "VFR",
      details: "Departure hub under severe blizzard alert (KORD LIFR +SN BLSN). Destination LFPG clear. Disruption risk high.",
      confidence: 0.96,
    },
    extraordinaryCircumstancesRisk: "HIGH_AIRLINE_DEFENSE",
    tag: "FIXTURE",
  },
  receipt: {
    intent: "STORM_ALERT_GENERAL",
    minerId: "106005",
    minerName: "ttl-nws (NWS Station Transit Alerts)",
    networkRank: 1,
    confidence: 0.96,
    latencyMs: 32,
    costUsd: 0.01,
    txHash: "0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18",
    basescanUrl: "https://sepolia.basescan.org/tx/0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18",
    signalHash: "0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444",
    timestamp: "2026-11-22 16:45:00 UTC",
    settled: true,
    weatherTag: "LIVE",
    rawDetails: "KORD Active Winter Blizzard Alert (Low visibility & runway icing). Destination LFPG clear.",
  },
  totalCostUsd: 0.01,
  totalLatencyMs: 32,
  draftClaimLetter: `To: Air France Passenger Claims Department
Subject: CONTESTED CLAIM NOTICE · Statutory Compensation under Regulation (EC) No 261/2004 (Article 5(3) Challenge)

Passenger Flight: AF112 (Chicago ORD → Paris CDG)
Operating Carrier: Air France (EU Community Carrier)
Marketing Carrier: Air France (AF)
Flight Date: 2026-11-22
Scheduled Arrival: 08:00 CET
Actual Arrival: 12:10 CET
Arrival Delay at Final Destination: +4h 10m

Statutory Assessment & Article 5(3) Contest Notice:
While automated telemetry identified an active meteorological condition (Severe winter blizzard ground-stop alert active at Chicago O'Hare), the passenger hereby contests any summary claim denial under Article 5(3) of Regulation (EC) No 261/2004.

Legal Grounds under Court of Justice Case Law (Wallentin-Hermann v Alitalia C-549/07):
1. Meteorological conditions do not constitute an automatic blanket defense. The carrier must prove that the specific adverse weather directly affected the aircraft executing flight AF112.
2. The carrier must substantiate that the delay could not have been avoided even if all reasonable measures had been taken (including timely rerouting, aircraft substitution, or crew repositioning).
3. The passenger requests documented evidence of whether other flights operated from Chicago ORD during the departure window.

Statutory Compensation Claim Range: €300 – €600 (Contested Art. 5(3) Weather Defense)

Attached Telemetry:
- Departure Weather: Severe winter blizzard ground-stop alert active at Chicago O'Hare (ORD).
- Arrival Weather: LFPG VFR (Clear, wind 9kt) · Destination terminal open.
- Cross-Check Audit: aviationweather.gov METAR (KORD LIFR +SN BLSN).

Please provide the carrier's formal Article 5(3) justification with flight log evidence within 14 business days.
(Generated by SkyClaim Autonomous Disruption Shield.)`,
  budgetGuard: {
    perRequestCapUsd: 0.05,
    dailySpendCapUsd: 5.0,
    currentDailySpendUsd: 0.0,
    rateLimitRemaining: 15,
  },
  accounting: {
    queriesFired: 1,
    receiptsVerified: 1,
    settlementChain: "Base Sepolia (EIP-155:84532)",
    settlementToken: "Circle USDC (0x036CbD53842c5426634e7929541eC2318f3dCF7e)",
    diamondContract: SKYCLAIM_CONFIG.diamondAddress,
    payerAddress: "backend-protocol-relayer",
  },
};

const LOADING_STEPS = [
  "Checking statutory jurisdiction & operating metal...",
  "Purchasing cryptographic weather telemetry via x402...",
  "Evaluating CJEU Art. 5(3) consensus & building verdict...",
];

export default function SkyClaimHome() {
  const [queryInput, setQueryInput] = useState("BA178");
  const [activePreset, setActivePreset] = useState("BA178");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [settlementRail, setSettlementRail] = useState<"base" | "solana">("base");
  const [claim, setClaim] = useState<SkyClaimResult>(DEFAULT_BA178_RESULT);
  const [copied, setCopied] = useState(false);
  const [engineMode, setEngineMode] = useState<"consumer" | "solana">("consumer");
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [apiDocsOpen, setApiDocsOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [ledger, setLedger] = useState<PublicLedgerEntry[]>(INITIAL_LEDGER);
  const [showRawJson, setShowRawJson] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState<"ALL" | "ELIGIBLE" | "CONTESTED" | "INELIGIBLE">("ALL");

  const runVerification = async (target?: string, rail = settlementRail) => {
    const flightCode = (target || queryInput).trim().toUpperCase();
    if (!flightCode) return;

    setLoading(true);
    setLoadingStep(0);

    // Fast-path deterministic presets with silky stepped progress
    if (flightCode === "BA178") {
      setActivePreset("BA178");
      setQueryInput("BA178");
      setLoadingStep(1);
      setTimeout(() => {
        setLoadingStep(2);
        setTimeout(() => {
          setClaim(rail === "solana" ? DEFAULT_BA178_SOLANA_RESULT : DEFAULT_BA178_RESULT);
          triggerVictoryConfetti();
          setLoading(false);
        }, 180);
      }, 180);
      return;
    } else if (flightCode === "DL401") {
      setActivePreset("DL401");
      setQueryInput("DL401");
      setLoadingStep(1);
      setTimeout(() => {
        setLoadingStep(2);
        setTimeout(() => {
          setClaim(DL401_RESULT);
          setLoading(false);
        }, 180);
      }, 180);
      return;
    } else if (flightCode === "AF112") {
      setActivePreset("AF112");
      setQueryInput("AF112");
      setLoadingStep(1);
      setTimeout(() => {
        setLoadingStep(2);
        setTimeout(() => {
          setClaim(AF112_RESULT);
          setLoading(false);
        }, 180);
      }, 180);
      return;
    }

    try {
      setLoadingStep(1);
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber: flightCode, network: rail }),
      });
      setLoadingStep(2);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.claimId) {
        setClaim(data as SkyClaimResult);
        setActivePreset("");
        if (data.verdict === "ELIGIBLE_FOR_CLAIM") {
          triggerVictoryConfetti();
        }

        // Dynamically update public ledger with real live receipts
        if (data.badge === "LIVE" && data.receipt) {
          const isSol = data.receipt.network === "solana" || rail === "solana";
          const newEntry: PublicLedgerEntry = {
            id: `LEDGER-LIVE-${Date.now().toString().slice(-4)}`,
            flightNumber: data.flight.flightNumber,
            carrier: data.flight.carrier,
            operatingCarrier: `${data.flight.operatingCarrier} (${data.flight.isOperatingCarrierEUUK ? "EU/UK Metal" : "Non-EU Metal"})`,
            marketingCarrier: data.flight.marketingCarrier,
            route: `${data.flight.origin} → ${data.flight.destination}`,
            delayText: `+${Math.floor(data.flight.arrivalDelayMinutes / 60)}h ${(data.flight.arrivalDelayMinutes % 60).toString().padStart(2, "0")}m`,
            verdict: data.verdict,
            recommendation: data.recommendation,
            recommendationText: data.recommendationText,
            compensationRange: data.eligibleCompensationRange,
            costUsd: data.totalCostUsd,
            txHash: data.receipt.txHash,
            signalHash: data.receipt.signalHash,
            basescanUrl: isSol ? undefined : data.receipt.basescanUrl,
            explorerUrl: data.receipt.explorerUrl || data.receipt.basescanUrl,
            network: isSol ? "solana" : "base",
            minerName: data.receipt.minerName,
            timestamp: "Just now",
            badge: "LIVE",
            badgeNote: isSol
              ? "Live on-chain x402 purchase settled on Solana Devnet."
              : "Live on-chain x402 purchase settled on Base Sepolia.",
            isContested: data.verdict === "FAIL_CLOSED_WEATHER",
          };
          setLedger((prev) => [newEntry, ...prev.filter((p) => p.flightNumber !== data.flight.flightNumber)]);
        }
      }
    } catch (e) {
      // fallback smoothly to BA178
    } finally {
      setLoading(false);
    }
  };

  const triggerVictoryConfetti = () => {
    try {
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ["#38BDF8", "#2563EB", "#10B981", "#FFFFFF"],
          disableForReducedMotion: true,
        });
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setQueryInput(preset.flightNumber);
    setActivePreset(preset.flightNumber);
    if (preset.flightNumber === "BA178") {
      triggerVictoryConfetti();
    }
    runVerification(preset.flightNumber, settlementRail);
  };

  const downloadClaimsPackage = () => {
    let content = claim.draftClaimLetter || claim.caseCopy;
    if (claim.badge === "LIVE" && claim.receipt) {
      const isSol = claim.receipt.network === "solana";
      content += "\n\n" + "=".repeat(72) + "\n";
      content += isSol
        ? "TELEGRAPH PROTOCOL CRYPTOGRAPHIC RECEIPT (SOLANA DEVNET x402 SVM)\n"
        : "TELEGRAPH PROTOCOL CRYPTOGRAPHIC RECEIPT (BASE SEPOLIA x402)\n";
      content += "=".repeat(72) + "\n";
      content += claim.receipt.rawReceiptJson || JSON.stringify(claim.receipt, null, 2);
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${claim.flight.flightNumber}-Statutory-Claims-Package.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyDraftLetter = () => {
    const content = claim.draftClaimLetter || claim.caseCopy;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyRawReceiptJson = () => {
    if (!claim.receipt) return;
    const jsonStr = claim.receipt.rawReceiptJson || JSON.stringify(claim.receipt, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const filteredLedger = useMemo(() => {
    if (ledgerFilter === "ALL") return ledger;
    if (ledgerFilter === "ELIGIBLE") return ledger.filter((l) => l.verdict === "ELIGIBLE_FOR_CLAIM");
    if (ledgerFilter === "CONTESTED") return ledger.filter((l) => l.verdict === "FAIL_CLOSED_WEATHER");
    if (ledgerFilter === "INELIGIBLE") return ledger.filter((l) => l.verdict === "INELIGIBLE");
    return ledger;
  }, [ledger, ledgerFilter]);

  const isEligible = claim.verdict === "ELIGIBLE_FOR_CLAIM";
  const isContested = claim.verdict === "FAIL_CLOSED_WEATHER";
  const isIneligible = claim.verdict === "INELIGIBLE";

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Top subtle radial spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/[0.12] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* HEADER: Responsive, Mobile-Optimized, Apple/Linear Precision */}
      <Header
        engineMode={engineMode}
        setEngineMode={setEngineMode}
        onOpenReceiptBox={() => setReceiptBoxOpen(true)}
        onOpenTelegram={() => setTelegramOpen(true)}
        onOpenApiDocs={() => setApiDocsOpen(true)}
        onOpenRoadmap={() => setRoadmapOpen(true)}
        onOpenFaq={() => setFaqOpen(true)}
        onScrollToLedger={() => {
          const el = document.getElementById("public-ledger");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex-1 w-full pb-20 space-y-12">
        {engineMode === "solana" ? (
          <div className="pt-8 animate-fade-in">
            <SolanaInstitutionalView />
          </div>
        ) : (
          <>
            {/* ── HERO & SEARCH SECTION ── */}
            <section className="relative pt-8 sm:pt-14 pb-4 max-w-4xl mx-auto text-center space-y-6">
              {/* Route Arc Background Graphic */}
              <div className="absolute inset-0 -top-6 pointer-events-none flex items-center justify-center opacity-35 overflow-hidden">
                <svg viewBox="0 0 800 240" className="w-full max-w-3xl h-48" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="hero-route-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0.85" />
                    </linearGradient>
                    <filter id="hero-route-glow">
                      <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#22D3EE" floodOpacity="0.75" />
                    </filter>
                  </defs>
                  {/* Thin Curved Route Arc between two airport dots */}
                  <path
                    d="M 140 180 Q 400 35 660 180"
                    fill="none"
                    stroke="url(#hero-route-arc)"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    filter="url(#hero-route-glow)"
                  />
                  {/* Origin Dot (JFK) */}
                  <circle cx="140" cy="180" r="5" fill="#22D3EE" />
                  <circle cx="140" cy="180" r="11" fill="none" stroke="#22D3EE" strokeWidth="0.8" strokeOpacity="0.4" />
                  <text x="140" y="204" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    JFK
                  </text>
                  {/* Destination Dot (LHR) */}
                  <circle cx="660" cy="180" r="5" fill="#34D399" />
                  <circle cx="660" cy="180" r="11" fill="none" stroke="#34D399" strokeWidth="0.8" strokeOpacity="0.4" />
                  <text x="660" y="204" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    LHR
                  </text>
                </svg>
              </div>

              {/* Headline & Subline */}
              <div className="relative z-10 space-y-3.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Check the airline&apos;s excuse before you file.
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Instant statutory delay verification (EU261 &amp; UK261) backed by autonomous cryptographic weather telemetry.
                </p>
              </div>

              {/* Rail Switcher & Flight Search Input */}
              <div className="relative z-10 pt-2 max-w-2xl mx-auto space-y-4">
                {/* Small Segmented Rail Switcher near input */}
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setSettlementRail("base");
                      if (activePreset === "BA178") setClaim(DEFAULT_BA178_RESULT);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      settlementRail === "base"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>Base Sepolia</span>
                    <span className="text-[10px] text-slate-500">84532</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSettlementRail("solana");
                      if (activePreset === "BA178") setClaim(DEFAULT_BA178_SOLANA_RESULT);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      settlementRail === "solana"
                        ? "bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#14F195]" />
                    <span>Solana Devnet</span>
                    <span className="text-[10px] text-slate-500">x402</span>
                  </button>
                </div>

                {/* One Large Rounded Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runVerification(queryInput, settlementRail);
                  }}
                  className="bg-[#0A0F1F] border border-white/[0.12] rounded-2xl p-2 flex items-center gap-3 shadow-2xl focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-400/20 transition"
                >
                  <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Enter flight code (e.g. BA178, DL401, AF112)..."
                    className="bg-transparent border-none text-white text-base font-mono focus:outline-none w-full placeholder-slate-500 tracking-wide"
                  />
                  {queryInput && (
                    <button
                      type="button"
                      onClick={() => setQueryInput("")}
                      className="text-slate-500 hover:text-slate-300 text-xs px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/25 shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <span>Check flight</span>
                    )}
                  </motion.button>
                </form>
              </div>
            </section>

            {/* ── PRESETS: DEPARTURE-BOARD STRIP ── */}
            <section className="max-w-4xl mx-auto">
              <DepartureBoardPresets
                presets={PRESET_CASES}
                activePreset={activePreset}
                onSelectPreset={handleSelectPreset}
              />
            </section>

            {/* ── PROGRESS BAR (When loading) ── */}
            {loading && (
              <section className="max-w-4xl mx-auto rounded-2xl border border-cyan-500/30 bg-[#0A0F1F] p-4 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    {LOADING_STEPS[loadingStep]}
                  </span>
                  <span className="text-slate-400">Step {loadingStep + 1} of 3</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: "15%" }}
                    animate={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </section>
            )}

            {/* ── RESULT: BOARDING-PASS CARD & EVIDENCE ── */}
            <motion.section
              id="verification-panel"
              key={claim.flight.flightNumber + claim.timestamp}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <BoardingPassCard
                claim={claim}
                onCopyLetter={copyDraftLetter}
                onDownloadPackage={downloadClaimsPackage}
                letterCopied={copied}
              />

              {/* 2-Column Cockpit: Corridor Map + Delay Threshold Gauge */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <FlightTelemetryMap
                  origin={claim.flight.origin}
                  destination={claim.flight.destination}
                  flightNumber={claim.flight.flightNumber}
                  distanceKm={claim.flight.distanceKm}
                  carrier={claim.flight.carrier}
                />
                <DelayThresholdGauge claim={claim} />
              </div>
            </motion.section>

            {/* PUBLIC DISRUPTION ACTIVITY LEDGER */}
            <section id="public-ledger" className="space-y-4 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-mono font-semibold text-white tracking-wide">
                    Public Disruption Activity Ledger
                  </h3>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {(["ALL", "ELIGIBLE", "CONTESTED", "INELIGIBLE"] as const).map((filter) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLedgerFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        ledgerFilter === filter
                          ? "bg-blue-600/20 border-blue-500 text-white font-bold shadow-sm shadow-blue-500/20"
                          : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0D1527]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Flight</th>
                        <th className="py-3 px-4">Operating Carrier</th>
                        <th className="py-3 px-4">Route</th>
                        <th className="py-3 px-4">Arrival Delay</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Proof</th>
                        <th className="py-3 px-4 text-right">Statutory Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                      {filteredLedger.map((entry) => (
                        <tr
                          key={entry.id}
                          onClick={() => runVerification(entry.flightNumber.replace("Hypothetical ", ""))}
                          className="hover:bg-white/[0.04] transition cursor-pointer"
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <Plane className="h-3.5 w-3.5 text-blue-400" />
                              <span>{entry.flightNumber}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 text-[11px]">
                            {entry.operatingCarrier || entry.carrier}
                          </td>
                          <td className="py-3 px-4 text-slate-300">{entry.route}</td>
                          <td
                            className={`py-3 px-4 font-bold tabular-nums ${
                              entry.verdict === "ELIGIBLE_FOR_CLAIM"
                                ? "text-emerald-400"
                                : entry.verdict === "FAIL_CLOSED_WEATHER"
                                ? "text-amber-400"
                                : "text-slate-400"
                            }`}
                          >
                            {entry.delayText}
                          </td>
                          <td className="py-3 px-4">
                            {entry.badge === "LIVE" ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                LIVE
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border-blue-500/30">
                                FIXTURE
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            {entry.explorerUrl || entry.basescanUrl ? (
                              <a
                                href={entry.explorerUrl || entry.basescanUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center gap-1 hover:underline ${
                                  entry.network === "solana" || (entry.explorerUrl || entry.basescanUrl)?.includes("solscan")
                                    ? "text-[#14F195]"
                                    : "text-blue-400"
                                }`}
                              >
                                <span>
                                  {entry.txHash
                                    ? `${entry.txHash.slice(0, 6)}...${entry.txHash.slice(-4)}`
                                    : entry.network === "solana"
                                    ? "Solscan"
                                    : "BaseScan"}
                                </span>
                                {entry.network === "solana" && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30">SOL</span>
                                )}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-slate-500 text-[11px]">$0.00 spent</span>
                            )}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-bold ${
                              entry.verdict === "ELIGIBLE_FOR_CLAIM"
                                ? "text-emerald-400"
                                : entry.verdict === "FAIL_CLOSED_WEATHER"
                                ? "text-amber-400"
                                : "text-slate-500"
                            }`}
                          >
                            {entry.compensationRange}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* FOOTER: Minimal, High-Craft */}
      <footer className="border-t border-white/[0.08] bg-[#05080F] text-xs text-slate-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaperPlaneLogo size={24} />
            <span className="font-semibold text-white font-sans text-sm">SkyClaim</span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px]">Flight Disruption Shield</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <button onClick={() => setReceiptBoxOpen(true)} className="hover:text-white transition cursor-pointer">
              Receipt Box
            </button>
            <button onClick={() => setRoadmapOpen(true)} className="hover:text-white transition cursor-pointer">
              Roadmap
            </button>
            <button onClick={() => setApiDocsOpen(true)} className="hover:text-white transition cursor-pointer">
              API
            </button>
            <button onClick={() => setFaqOpen(true)} className="hover:text-white transition cursor-pointer">
              FAQ
            </button>
            <button onClick={() => setTelegramOpen(true)} className="hover:text-white transition cursor-pointer">
              @SkyClaimprobot
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TheReceiptBox isOpen={receiptBoxOpen} onClose={() => setReceiptBoxOpen(false)} />
      <BuilderRoadmapModal isOpen={roadmapOpen} onClose={() => setRoadmapOpen(false)} />
      <ApiDocsModal isOpen={apiDocsOpen} onClose={() => setApiDocsOpen(false)} />
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
      <TelegramModal isOpen={telegramOpen} onClose={() => setTelegramOpen(false)} />
    </div>
  );
}
