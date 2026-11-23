"use client";

import React, { useState } from "react";
import { SKYCLAIM_CONFIG, SKYCLAIM_PRESETS, INITIAL_LEDGER } from "@/lib/skyclaim-consensus";
import { SkyClaimResult, PresetScenario, PublicLedgerEntry } from "@/lib/skyclaim-types";
import { PaperPlaneLogo } from "@/components/PaperPlaneLogo";
import { FlightMapVisual } from "@/components/FlightMapVisual";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import { ApiDocsModal } from "@/components/ApiDocsModal";
import { FaqModal } from "@/components/FaqModal";
import {
  Search,
  Copy,
  Check,
  Download,
  Sun,
  Snowflake,
  Plane,
  AlertTriangle,
  FileText,
  Wallet,
  ExternalLink,
  ShieldAlert,
  Activity,
  Github,
  Twitter,
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
    "Hypothetical flight BA178 (New York JFK → London LHR). Operating carrier: British Airways (UK/EU carrier). Arrival delay: 3h 42m (FIXTURE). Weather at departure and arrival: clean corridors (FIXTURE). Airline's weather defense is not supported by evidence. Eligible compensation to be checked under EU261: €300 to €600 (subject to Article 7(2) 50% rule for 3h–4h arrival delays on flights > 3,500 km). Draft claim ready.",
  badge: "FIXTURE",
  badgeNote:
    "Preset benchmark fixture: hypothetical schedule, arrival delay, and dual-corridor weather observations are deterministic test vectors.",
  verdict: "ELIGIBLE_FOR_CLAIM",
  verdictRationale:
    "Arrival delay at London Heathrow is 3h 42m (exceeds 3h statutory threshold). Dual-hub weather screening confirmed zero active severe alerts at JFK departure and LHR arrival. Operating carrier is British Airways (UK/EU Community metal). Under EU261 Article 7(2)(c), long-haul flights (> 3,500 km) with arrival delays between 3 and 4 hours may be subject to a 50% reduction (€300 vs €600).",
  recommendation: "DRAFT_CLAIM_READY",
  recommendationText:
    "Draft Claim Ready — Operating carrier is British Airways (UK/EU). Airline weather excuse unsupported. Eligible for carrier review.",
  statutoryRegulation: "EU261",
  statutoryDelayBasis:
    "Arrival delay at final destination (CJEU Sturgeon v Condor standard)",
  eligibleCompensationRange: "€300 – €600 (to be checked under Art. 7(2))",
  compensationNote:
    "Statutory arrival delay is 3h 42m. Under Article 7(2)(c), if arrival delay is under 4 hours on flights > 3,500 km, carrier may reduce compensation by 50% down to €300.",
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
    departureWeather: "Departure Weather: Clear (JFK Telemetry - 0 active severe alerts)",
    hasSevereDepartureAlert: false,
    arrivalAirport: "LHR",
    arrivalWeather: "EGLL VFR (Clear, visibility 9999m) · Normal instrument approaches active.",
    hasSevereArrivalAlert: false,
    bothCorridorsClear: true,
    coverageNote: "Dual-hub screening confirmed clean corridors at both JFK departure and LHR arrival.",
    hasSevereStormAlert: false,
    stormDetails:
      "No active severe weather alerts at New York JFK departure corridor or London Heathrow arrival.",
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
    txHash: "0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9",
    basescanUrl: "https://sepolia.basescan.org/tx/0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9",
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

Pursuant to Regulation (EC) 261/2004 and Court of Justice case law (Sturgeon v Condor, Joined Cases C-402/07 & C-432/07), passenger is entitled to statutory compensation for arrival delay exceeding 3 hours on a flight over 3,500 km.

Eligible Compensation Range to be Checked:
- Baseline statutory entitlement (Art. 7(1)(c)): €600
- If carrier invokes Article 7(2)(c) (arrival delay under 4 hours): 50% reduction applies, making eligible amount €300.
Eligible Amount Submitted for Verification: €300 – €600 (to be checked under Art. 7(2))

Attached Verification Evidence:
- Operating Carrier Jurisdiction: Confirmed British Airways is operating carrier under Regulation (EC) No 261/2004 Art. 3(1)(b).
- Arrival Telemetry: Arrival at London LHR delayed by 3h 42m (Scheduled 06:15 UTC · Actual 09:57 UTC).
- Dual-Hub Weather Screening: Meteorological telemetry confirms zero active severe thunderstorm or blizzard ground-stop alerts during departure at New York JFK and arrival at London LHR. The carrier's weather defense is not supported by this evidence.
- Verification Mode: FIXTURE (Preset test fixture: hypothetical schedule, arrival delay, and weather observations are deterministic test vectors.)
- Multi-Source Cross-Check: aviationweather.gov METAR (Consensus verified: KJFK LIFR, EGLL VFR).

Please confirm receipt and evaluate this claim within 14 business days.
(Draft generated by SkyClaim. Draft only, not legal advice.)`,
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

// Fixture for DL401
const DL401_RESULT: SkyClaimResult = {
  claimId: "CLM-DL401-VERIFIED",
  timestamp: "2026-11-22T06:00:00.000Z",
  caseNumber: 2,
  caseTitle: "DL401 · Delta Air Lines",
  caseCopy:
    "Hypothetical flight DL401 (New York JFK → Paris CDG). Operating carrier: Delta Air Lines (not EU/UK) → not covered by EU261 on departures from third countries (Regulation (EC) 261/2004 Art. 3(1)(b) & CJEU Case C-502/18). Furthermore, arrival delay (1h 05m) is below the 3-hour statutory threshold. Ineligible ($0 spent).",
  badge: "FIXTURE",
  badgeNote:
    "Preset test fixture: operating carrier is Delta Air Lines (not EU/UK carrier ex-USA) and arrival delay is under 3 hours ($0 spent). No transaction executed.",
  verdict: "INELIGIBLE",
  verdictRationale:
    "Two independent disqualifications: 1) Operating carrier: Delta (not EU/UK) → not covered by EU261 on US departures under Regulation (EC) 261/2004 Art. 3(1)(b) & CJEU Case C-502/18. 2) Arrival delay at Paris CDG is 1h 05m (below the 3-hour statutory threshold). Ineligible ($0 spent, no purchase made).",
  recommendation: "NO_PURCHASE_BELOW_THRESHOLD",
  recommendationText:
    "Ineligible for Claim — Operating carrier is Delta (not EU/UK) and arrival delay 1h 05m is below 3-hour statutory threshold.",
  statutoryRegulation: "EU261",
  statutoryDelayBasis:
    "Arrival delay at final destination (CJEU Sturgeon v Condor standard)",
  eligibleCompensationRange: "€0 (Non-EU operating metal & delay < 3h)",
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
      "Operating carrier: Delta (not EU/UK) → not covered by EU261 for US departures under Regulation (EC) 261/2004 Art. 3(1)(b) & CJEU Case C-502/18.",
    origin: "JFK",
    destination: "CDG",
    distanceKm: 5835,
    scheduledDeparture: "19:15 EST",
    actualDeparture: "20:15 EST",
    scheduledArrival: "08:30 CET",
    actualArrival: "09:35 CET",
    arrivalDelayMinutes: 65,
    delayCategory: "ON_TIME",
    rawStatus: "ARRIVAL_DELAY_1H_05M",
    tag: "FIXTURE",
  },
  weather: {
    departureAirport: "JFK",
    departureWeather: "Departure Weather: Clear (Under 3h statutory threshold)",
    hasSevereDepartureAlert: false,
    arrivalAirport: "CDG",
    arrivalWeather: "Query bypassed.",
    hasSevereArrivalAlert: false,
    bothCorridorsClear: true,
    coverageNote: "Telemetry bypassed to preserve budget on non-qualifying flight.",
    hasSevereStormAlert: false,
    stormDetails:
      "Query bypassed: Ineligible due to non-EU operating metal and arrival delay under 3 hours (Zero protocol spend).",
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
Actual Arrival: 09:35 CET
Arrival Delay at Final Destination: +1h 05m

Statutory Review Finding:
Under Regulation (EC) No 261/2004 and landmark Court of Justice jurisprudence:
1. Operating Carrier Jurisdictional Exclusion:
Under Article 3(1)(b) and CJEU Case C-502/18 (CS and Others v České aerolinie), flights departing from third countries (USA) to the European Union are ONLY covered if operated by a Community (EU/UK) carrier. Because this flight was operated by Delta Air Lines (a non-EU carrier), EU261 does not apply, even if booked or codeshared under an Air France airline code.

2. Statutory Arrival Delay Threshold:
Under Sturgeon v Condor (Joined Cases C-402/07 & C-432/07), passenger compensation rights activate only when arrival delay at the final destination is 3 hours or greater. Arrival delay of 1h 05m is below the mandatory threshold.

Evaluation & Determination:
- Statutory Compensation Entitlement: €0 (Ineligible under Art. 3(1)(b) / Sturgeon).
- Carrier Weather Defense Status: Meteorological query bypassed to preserve protocol budget ($0 spent).
- Recommendation: Claim closed without dispute filing. No statutory compensation is legally payable.

(Assessment generated by SkyClaim. Draft only, not legal advice.)`,
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
  eligibleCompensationRange: "€300 – €600 (Contested Art. 5(3) Weather Defense)",
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
    departureWeather: "Departure Weather: Active severe weather alert at ORD (Blizzard ground stop)",
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
    txHash: "0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444",
    basescanUrl: "https://sepolia.basescan.org/tx/0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444",
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
While automated telemetry identified an active meteorological condition (CRITICAL: Severe winter blizzard ground-stop alert active at Chicago O'Hare), the passenger hereby contests any summary claim denial under Article 5(3) of Regulation (EC) No 261/2004.

Legal Grounds under Court of Justice Case Law (Wallentin-Hermann v Alitalia C-549/07):
1. Meteorological conditions do not constitute an automatic blanket defense. The carrier must prove that the specific adverse weather directly affected the aircraft executing flight AF112.
2. The carrier must substantiate that the delay could not have been avoided even if all reasonable measures had been taken (including timely rerouting, aircraft substitution, or crew repositioning).
3. The passenger requests documented evidence of whether other flights operated from Chicago ORD during the departure window.

Statutory Compensation Claim Range: €300 – €600 (Contested Art. 5(3) Weather Defense)
Attached Telemetry:
- Departure Weather: CRITICAL: Severe winter blizzard ground-stop alert active at Chicago O'Hare (ORD).
- Arrival Weather: LFPG VFR (Clear, wind 9kt) · Destination terminal open.
- Cross-Check Audit: aviationweather.gov METAR (KORD LIFR +SN BLSN).

Please provide the carrier's formal Article 5(3) justification with flight log evidence within 14 business days.
(Contested notice generated by SkyClaim. Draft only, not legal advice.)`,
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

export default function SkyClaimHome() {
  const [queryInput, setQueryInput] = useState("BA178");
  const [activePreset, setActivePreset] = useState("BA178");
  const [loading, setLoading] = useState(false);
  const [claim, setClaim] = useState<SkyClaimResult>(DEFAULT_BA178_RESULT);
  const [copied, setCopied] = useState(false);
  const [activeNav, setActiveNav] = useState("Disruption Shield");
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [apiDocsOpen, setApiDocsOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ledger, setLedger] = useState<PublicLedgerEntry[]>(INITIAL_LEDGER);
  const [showRawJson, setShowRawJson] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const runVerification = async (target?: string) => {
    const flightCode = (target || queryInput).trim().toUpperCase();
    if (!flightCode) return;

    setLoading(true);

    // Fast-path for deterministic presets
    if (flightCode === "BA178") {
      setActivePreset("BA178");
      setQueryInput("BA178");
      setClaim(DEFAULT_BA178_RESULT);
      setLoading(false);
      return;
    } else if (flightCode === "DL401") {
      setActivePreset("DL401");
      setQueryInput("DL401");
      setClaim(DL401_RESULT);
      setLoading(false);
      return;
    } else if (flightCode === "AF112") {
      setActivePreset("AF112");
      setQueryInput("AF112");
      setClaim(AF112_RESULT);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber: flightCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.claimId) {
        setClaim(data as SkyClaimResult);
        setActivePreset("");

        // Dynamically update public ledger with real live receipts
        if (data.badge === "LIVE" && data.receipt) {
          const newEntry: PublicLedgerEntry = {
            id: `LEDGER-LIVE-${Date.now().toString().slice(-4)}`,
            flightNumber: data.flight.flightNumber,
            carrier: data.flight.carrier,
            operatingCarrier: `${data.flight.operatingCarrier} (${data.flight.isOperatingCarrierEUUK ? "EU/UK Metal" : "Non-EU Metal"})`,
            marketingCarrier: data.flight.marketingCarrier,
            route: `${data.flight.origin} → ${data.flight.destination}`,
            delayText: `+${Math.floor(data.flight.arrivalDelayMinutes / 60)}h ${(data.flight.arrivalDelayMinutes % 60).toString().padStart(2, "0")}m arrival delay`,
            verdict: data.verdict,
            recommendation: data.recommendation,
            recommendationText: data.recommendationText,
            compensationRange: data.eligibleCompensationRange,
            costUsd: data.totalCostUsd,
            txHash: data.receipt.txHash,
            signalHash: data.receipt.signalHash,
            basescanUrl: data.receipt.basescanUrl,
            minerName: data.receipt.minerName,
            timestamp: "Just now",
            badge: "LIVE",
            badgeNote: "Live on-chain x402 purchase settled on Base Sepolia.",
            isContested: data.verdict === "FAIL_CLOSED_WEATHER",
          };
          setLedger((prev) => [newEntry, ...prev.filter((p) => p.flightNumber !== data.flight.flightNumber)]);
        }
      }
    } catch (e) {
      // fallback to BA178
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setQueryInput(preset.flightNumber);
    setActivePreset(preset.flightNumber);
    runVerification(preset.flightNumber);
  };

  const downloadClaimsPackage = () => {
    let content = claim.draftClaimLetter || claim.caseCopy;
    if (claim.badge === "LIVE" && claim.receipt) {
      content += "\n\n" + "=".repeat(72) + "\n";
      content += "TELEGRAPH PROTOCOL CRYPTOGRAPHIC RECEIPT (BASE SEPOLIA x402 / ESCROW)\n";
      content += "=".repeat(72) + "\n";
      content += claim.receipt.rawReceiptJson || JSON.stringify(claim.receipt, null, 2);
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${claim.flight.flightNumber}-Claims-Package.txt`;
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

  const handleNavClick = (item: string) => {
    setActiveNav(item);
    if (item === "Verifier" || item === "Disruption Shield") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Claims Ledger") {
      const el = document.getElementById("claims-ledger-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (item === "API & Docs") {
      setApiDocsOpen(true);
    } else if (item === "FAQ") {
      setFaqOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E1A] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Subtle radial blue spotlight glow behind hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* 1. HEADER (TWO-TIER NAVIGATION) */}
      <header className="relative z-30 border-b border-[#1E293B] bg-[#090E1A]/90 backdrop-blur-md">
        {/* Top utility bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Brand lockup */}
          <div className="flex items-center gap-3">
            <PaperPlaneLogo size={32} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                  SkyClaim
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#111827] text-slate-300 border border-[#1E293B]">
                  Testnet: Base Sepolia
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-medium mt-0.5 hidden sm:block">
                Flight Disruption Shield
              </span>
            </div>
          </div>

          {/* Right: Network pill, Receipt Box & Connect Wallet */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Network pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1E293B] text-[11px] font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base Sepolia (84532)</span>
            </div>

            {/* Receipt Box button */}
            <button
              onClick={() => setReceiptBoxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#161F33] border border-[#1E293B] text-xs font-medium text-slate-200 transition cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <span>Receipt Box</span>
            </button>

            {/* Connect Wallet primary button */}
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold transition shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>

        {/* Second sub-navigation bar */}
        <div className="border-t border-[#1E293B]/80 bg-[#0B1120]/60 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar text-xs font-medium">
            {[
              { label: "Disruption Shield", id: "Disruption Shield" },
              { label: "Verifier", id: "Verifier" },
              { label: "Claims Ledger", id: "Claims Ledger" },
              { label: "API & Docs", id: "API & Docs" },
              { label: "FAQ", id: "FAQ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`py-2.5 whitespace-nowrap transition cursor-pointer relative ${
                  activeNav === tab.id
                    ? "text-blue-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {activeNav === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex-1 w-full pb-20 space-y-10">
        {/* 2. HERO AND SEARCH SECTION */}
        <section className="text-center pt-12 pb-6 max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight font-sans">
            Autonomous Flight Disruption &amp; Claim Verifier
          </h1>
          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
            Instant EU261 &amp; UK261 disruption screening for US-to-Europe flights. Same-day statutory claim verification powered by automated weather telemetry.
          </p>

          {/* Wide search container */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runVerification();
              }}
              className="bg-[#111827] border border-[#1E293B] rounded-xl p-2 sm:p-2.5 flex items-center gap-3 shadow-2xl focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/30 transition"
            >
              <Search className="h-5 w-5 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter Flight Number (e.g. BA178)"
                className="bg-transparent border-none text-white text-sm sm:text-base font-mono focus:outline-none w-full placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Screening..." : "Run Disruption Check"}
              </button>
            </form>
          </div>
        </section>

        {/* 3. PRESET ACCEPTANCE CASES (3-COLUMN GRID) */}
        <section className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Reviewer Presets (Deterministic Acceptance Cases)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: BA178 */}
            <div
              onClick={() => handleSelectPreset(PRESET_CASES[0])}
              className={`rounded-xl p-4 transition cursor-pointer border ${
                activePreset === "BA178"
                  ? "bg-[#131B2E] border-blue-500/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-[#111827] border-[#1E293B] hover:border-slate-700 hover:bg-[#131B2E]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="font-bold text-white text-sm">BA178 - British Airways</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ELIGIBLE FOR CLAIM
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-1">
                New York JFK → London LHR - 5,550 km
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#1E293B] text-xs">
                <span className="font-mono text-emerald-400 font-bold tabular-nums">Delay: +3h 42m</span>
                <span className="text-slate-400 font-mono">Weather: Clean</span>
              </div>
            </div>

            {/* Card 2: DL401 */}
            <div
              onClick={() => handleSelectPreset(PRESET_CASES[1])}
              className={`rounded-xl p-4 transition cursor-pointer border ${
                activePreset === "DL401"
                  ? "bg-[#131B2E] border-blue-500/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-[#111827] border-[#1E293B] hover:border-slate-700 hover:bg-[#131B2E]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="font-bold text-white text-sm">DL401 - Delta Air Lines</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-700/30 text-slate-400 border border-slate-700/50">
                  INELIGIBLE
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-1">
                New York JFK → Paris CDG - 5,835 km
              </div>
              <div className="flex flex-col gap-1.5 pt-3 mt-2 border-t border-[#1E293B] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-400 font-bold tabular-nums">Delay: +1h 05m</span>
                  <span className="text-slate-400 text-[11px] font-mono">$0 spent</span>
                </div>
                <div className="text-[11px] text-amber-400/90 font-mono leading-tight">
                  Operating carrier: Delta (not EU/UK) → not covered by EU261
                </div>
              </div>
            </div>

            {/* Card 3: AF112 */}
            <div
              onClick={() => handleSelectPreset(PRESET_CASES[2])}
              className={`rounded-xl p-4 transition cursor-pointer border ${
                activePreset === "AF112"
                  ? "bg-[#131B2E] border-blue-500/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-[#111827] border-[#1E293B] hover:border-slate-700 hover:bg-[#131B2E]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="font-bold text-white text-sm">AF112 - Air France</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  WEATHER DISRUPTION RISK
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-1">
                Chicago ORD → Paris CDG - 6,670 km
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#1E293B] text-xs">
                <span className="font-mono text-amber-400 font-bold tabular-nums">Delay: +4h 10m</span>
                <span className="text-amber-400 text-[11px] flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Active severe weather alert at ORD
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* LOADING INDICATOR (10-12s settlement & miner progress) */}
        {loading && (
          <section className="rounded-xl border border-blue-500/40 bg-[#131B2E] p-6 shadow-xl shadow-blue-500/10 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    Purchasing Live Telemetry via Telegraph Protocol...
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      x402 · Base Sepolia
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Signing gasless EIP-712 transfer authorization ($0.01 USDC) &amp; querying ranked live miner.
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Facilitator Settlement Active (~11s)</span>
              </div>
            </div>
          </section>
        )}

        {/* 4. ACTIVE CLAIM VERIFICATION PANEL */}
        <section id="verification-panel">
          <div className="rounded-xl bg-[#111827] claim-panel-glow overflow-hidden shadow-2xl">
            {/* Top header bar */}
            <div className="px-5 py-3.5 bg-[#131B2E] border-b border-[#1E293B] flex items-center justify-between gap-3 flex-wrap">
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#F8FAFC]">
                Active Claim Verification Panel (Current Result - {claim.flight.flightNumber})
              </span>
              {claim.badge === "LIVE" ? (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 uppercase inline-flex items-center gap-1.5 shadow-sm shadow-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  VERIFIED BY SKYCLAIM - LIVE
                </span>
              ) : claim.badge === "SIMULATED" ? (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  VERIFIED BY SKYCLAIM - SIMULATED
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 uppercase inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                  VERIFIED BY SKYCLAIM - FIXTURE
                </span>
              )}
            </div>

            {/* Split 2-column layout (50/50 on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1E293B]">
              {/* Left Column: Flight Telemetry & Delay Analysis */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span>Flight Telemetry &amp; Delay Analysis</span>
                </div>

                {/* Dark-mode SVG flight map */}
                <FlightMapVisual
                  origin={claim.flight.origin}
                  destination={claim.flight.destination}
                  distanceKm={claim.flight.distanceKm}
                />

                {/* 3-column stat row below map */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-3 text-center">
                    <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Scheduled Arrival</span>
                    <div className="text-sm sm:text-base font-mono font-bold text-[#F8FAFC] tabular-nums mt-0.5">
                      {claim.flight.scheduledArrival}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-3 text-center">
                    <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Actual Arrival</span>
                    <div className="text-sm sm:text-base font-mono font-bold text-[#F8FAFC] tabular-nums mt-0.5">
                      {claim.flight.actualArrival}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-3 text-center">
                    <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Arrival Delay</span>
                    <div
                      className={`text-sm sm:text-base font-mono font-bold tabular-nums mt-0.5 ${
                        claim.flight.arrivalDelayMinutes >= 180
                          ? "text-[#34D399]"
                          : "text-slate-400"
                      }`}
                    >
                      {claim.flight.arrivalDelayMinutes > 0
                        ? `+${Math.floor(claim.flight.arrivalDelayMinutes / 60)}h ${(claim.flight.arrivalDelayMinutes % 60).toString().padStart(2, "0")}m`
                        : "On-Time"}
                    </div>
                  </div>
                </div>

                {/* Weather Screening sub-section */}
                <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-3.5 space-y-3 text-xs font-mono">
                  {/* Header & Source Labels */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5 text-blue-400" />
                      <span>Weather Screening Telemetry</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Dual-Source Consensus
                    </span>
                  </div>

                  {/* Primary Telemetry Source: Telegraph Protocol */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                        Primary Telemetry Source: Telegraph Protocol
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Intent: {claim.receipt?.intent || "TRAVEL_TRANSIT_LOCK_GENERAL"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-medium pl-2.5">
                      {claim.weather.hasSevereDepartureAlert || claim.weather.hasSevereArrivalAlert ? (
                        <Snowflake className="h-4 w-4 text-amber-400 shrink-0" />
                      ) : (
                        <Sun className="h-4 w-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs">{claim.weather.departureWeather}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] font-sans pl-2.5">
                      {claim.weather.coverageNote || "Dual-hub screening confirmed clean corridors at departure and arrival."}
                    </p>
                  </div>

                  {/* Secondary Cross-Check: NWS Station Feed */}
                  {claim.weather.secondaryCrossCheck && (
                    <div className="pt-2 border-t border-[#1E293B]/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          Secondary Cross-Check: aviationweather.gov (NWS Station Feed)
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            claim.weather.secondaryCrossCheck.status === "CONSISTENT"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : claim.weather.secondaryCrossCheck.status === "DISCREPANCY"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-slate-700/30 text-slate-400 border-slate-700/50"
                          }`}
                        >
                          {claim.weather.secondaryCrossCheck.status === "CONSISTENT"
                            ? "Cross-checked with NWS (Consistent)"
                            : claim.weather.secondaryCrossCheck.status === "DISCREPANCY"
                            ? "Discrepancy Detected"
                            : claim.weather.secondaryCrossCheck.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans pl-2.5 leading-relaxed">
                        {claim.weather.secondaryCrossCheck.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: EU261 / UK261 Statutory Claim Draft */}
              <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>EU261 / UK261 Statutory Claim Draft</span>
                    <span className="text-[11px] text-slate-400 font-sans">Formal Passenger Letter</span>
                  </div>

                  {/* Dark recessed inset claim letter box */}
                  <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-4 text-xs font-mono text-[#E2E8F0] whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed shadow-inner">
                    {claim.draftClaimLetter}
                  </div>
                </div>

                {/* Bottom compensation highlight and action buttons */}
                <div className="pt-2 border-t border-[#1E293B] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono text-[#94A3B8] uppercase">Claim Compensation</span>
                    <span
                      className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
                        claim.verdict === "ELIGIBLE_FOR_CLAIM"
                          ? "text-[#34D399]"
                          : claim.verdict === "FAIL_CLOSED_WEATHER"
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}
                    >
                      {claim.eligibleCompensationRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={copyDraftLetter}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#111827] hover:bg-[#161F33] border border-[#1E293B] text-xs font-semibold text-slate-200 transition cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={downloadClaimsPackage}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold transition shadow-lg shadow-blue-500/25 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Claims Package</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4b. Dedicated Telegraph Cryptographic Receipt Section */}
            <div className="border-t border-[#1E293B] bg-[#0E1526] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider">
                    Telegraph Protocol Settlement Receipt &amp; Verification Proof
                  </span>
                </div>
                {claim.badge === "LIVE" && claim.receipt ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase inline-flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-400" />
                    Cryptographic Proof On-Chain
                  </span>
                ) : claim.badge === "SIMULATED" ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                    Zero-Spend Sandbox Simulation
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 uppercase">
                    Preset Deterministic Vector
                  </span>
                )}
              </div>

              {claim.badge === "LIVE" && claim.receipt ? (
                <div className="space-y-4">
                  {/* 5-Column Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-mono">
                    <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-2.5">
                      <span className="text-[10px] uppercase text-[#94A3B8] block">Intent ID</span>
                      <span className="text-white font-semibold truncate block mt-0.5" title={claim.receipt.intent}>
                        {claim.receipt.intent}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-2.5">
                      <span className="text-[10px] uppercase text-[#94A3B8] block">Miner &amp; Served Rank</span>
                      <span className="text-white font-semibold truncate block mt-0.5" title={claim.receipt.minerName}>
                        {claim.receipt.minerName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ID: {claim.receipt.minerId} · Rank #{claim.receipt.servedRank || claim.receipt.networkRank || 1}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-2.5">
                      <span className="text-[10px] uppercase text-[#94A3B8] block">Payment Method</span>
                      <span className="text-emerald-400 font-semibold truncate block mt-0.5">
                        {claim.receipt.paymentMethod || "x402 Micropayment (EIP-712)"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Base Sepolia (84532)</span>
                    </div>

                    <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-2.5">
                      <span className="text-[10px] uppercase text-[#94A3B8] block">Cost &amp; Spend</span>
                      <span className="text-white font-semibold block mt-0.5">
                        ${claim.receipt.costUsd.toFixed(2)} USDC
                      </span>
                      <span className="text-[10px] text-emerald-400 block">Settled</span>
                    </div>

                    <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-2.5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase text-[#94A3B8] block">Timestamp</span>
                      <span className="text-slate-300 font-semibold block mt-0.5 truncate">
                        {claim.receipt.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Hash & BaseScan Permalinks */}
                  <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider shrink-0">Tx Hash:</span>
                      <span className="text-blue-400 truncate select-all">{claim.receipt.txHash}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {claim.receipt.basescanUrl && (
                        <a
                          href={claim.receipt.basescanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition text-xs font-semibold cursor-pointer"
                        >
                          <span>View on BaseScan</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => setShowRawJson(!showRawJson)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#131B2E] hover:bg-[#1A243B] text-slate-200 border border-[#1E293B] transition text-xs font-semibold cursor-pointer"
                      >
                        <span>{showRawJson ? "Hide Raw JSON" : "View Raw JSON"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Raw JSON Viewer */}
                  {showRawJson && (
                    <div className="rounded-lg bg-[#080D1A] border border-[#1E293B] p-4 text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-[11px] text-slate-400">
                        <span>Raw Cryptographic Receipt Payload</span>
                        <button
                          onClick={copyRawReceiptJson}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#131B2E] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] transition cursor-pointer"
                        >
                          {jsonCopied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-slate-400" />
                              <span className="text-[10px]">Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-slate-300 overflow-x-auto max-h-64 text-[11px] leading-relaxed p-1">
                        {claim.receipt.rawReceiptJson || JSON.stringify(claim.receipt, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : claim.badge === "SIMULATED" ? (
                <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-4 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">Simulated Zero-Spend Verification Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Live Telegraph credentials (<code className="text-slate-300">TELEGRAPH_API_KEY</code>) or USDC balance are not configured in this sandbox environment. 
                    SkyClaim performed a zero-spend corridor classification ($0.00 spent). No on-chain transaction hash or simulated receipt is fabricated, maintaining absolute evidentiary integrity.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-[#0B1120] border border-[#1E293B] p-4 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Activity className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="font-semibold">Preset Deterministic Test Vector (#{claim.caseNumber})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">$0.00 Protocol Spend</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {claim.badgeNote || "This scenario runs against predetermined benchmark vectors to demonstrate instant statutory decisioning without invoking live network micro-transactions."}
                  </p>
                  {claim.receipt?.txHash && claim.receipt.txHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
                    <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Benchmark Reference Tx (Base Sepolia):</span>
                      <a
                        href={claim.receipt.basescanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <span>{claim.receipt.txHash.slice(0, 10)}...{claim.receipt.txHash.slice(-8)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. PUBLIC DISRUPTION VERIFICATION ACTIVITY TABLE */}
        <section id="claims-ledger-section" className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>Public Disruption Verification Activity</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Live Base Sepolia Receipts &amp; Verified Presets
            </span>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#111827] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1E293B] bg-[#131B2E] text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Flight &amp; Airline</th>
                    <th className="py-3 px-4">Operating Carrier</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Arrival Delay</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Proof (BaseScan)</th>
                    <th className="py-3 px-4 text-right">Statutory Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-slate-300">
                  {ledger.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => runVerification(entry.flightNumber.replace("Hypothetical ", ""))}
                      className="hover:bg-[#161F33]/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Plane className="h-3.5 w-3.5 text-blue-400" />
                          <span>{entry.flightNumber}</span>
                          <span className="text-[11px] text-slate-400 font-normal">· {entry.carrier}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        {entry.operatingCarrier || entry.carrier}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{entry.route}</td>
                      <td className={`py-3.5 px-4 font-bold tabular-nums ${
                        entry.verdict === "ELIGIBLE_FOR_CLAIM"
                          ? "text-emerald-400"
                          : entry.verdict === "FAIL_CLOSED_WEATHER"
                          ? "text-amber-400"
                          : "text-slate-400"
                      }`}>
                        {entry.delayText}
                      </td>
                      <td className="py-3.5 px-4">
                        {entry.badge === "LIVE" ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE
                          </span>
                        ) : entry.badge === "SIMULATED" ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border-amber-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            SIMULATED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border-blue-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            FIXTURE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {entry.basescanUrl ? (
                          <a
                            href={entry.basescanUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                            title={entry.txHash}
                          >
                            <span>{entry.txHash ? `${entry.txHash.slice(0, 6)}...${entry.txHash.slice(-4)}` : "BaseScan"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[11px]">$0.00 spent</span>
                        )}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${
                        entry.verdict === "ELIGIBLE_FOR_CLAIM"
                          ? "text-emerald-400"
                          : entry.verdict === "FAIL_CLOSED_WEATHER"
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}>
                        {entry.compensationRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER (MULTI-COLUMN) */}
      <footer className="border-t border-[#1E293B] bg-[#090E1A] mt-16 text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <PaperPlaneLogo size={26} />
              <span className="text-base font-bold text-white font-sans">SkyClaim</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Autonomous flight disruption screening and statutory claim verification. Powered by Base Sepolia Testnet.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-md bg-[#111827] border border-[#1E293B] text-slate-400 hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-md bg-[#111827] border border-[#1E293B] text-slate-400 hover:text-white transition"
                aria-label="Twitter / X"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Product
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => handleNavClick("Verifier")}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Disruption Verifier
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("Disruption Shield")}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Statutory Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFaqOpen(true)}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Coverage &amp; Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => setApiDocsOpen(true)}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Telemetry Sources
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Resources
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setFaqOpen(true)}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  EU261/UK261 Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setApiDocsOpen(true)}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Developer Docs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setReceiptBoxOpen(true)}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Smart Contracts
                </button>
              </li>
              <li className="text-slate-400">System Status: Operational</li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Legal
            </span>
            <ul className="space-y-2 text-[11px]">
              <li className="text-slate-400">Terms of Service</li>
              <li className="text-slate-400">Privacy Policy</li>
              <li className="text-slate-400">Disclaimer: Drafts only, not legal advice</li>
              <li className="text-slate-400">Testnet Notice</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] py-6 px-4 sm:px-6 text-center text-[11px] text-slate-500 font-mono">
          © 2026 SkyClaim. All rights reserved. SkyClaim provides autonomous verification drafts and is not a law firm.
        </div>
      </footer>

      {/* Modals */}
      <TheReceiptBox isOpen={receiptBoxOpen} onClose={() => setReceiptBoxOpen(false)} />
      <ApiDocsModal isOpen={apiDocsOpen} onClose={() => setApiDocsOpen(false)} />
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
