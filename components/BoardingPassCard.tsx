"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Download,
  Info,
} from "lucide-react";
import type { SkyClaimResult } from "@/lib/skyclaim-types";

interface BoardingPassCardProps {
  claim: SkyClaimResult;
  onCopyLetter: () => void;
  onDownloadPackage: () => void;
  letterCopied: boolean;
}

export function BoardingPassCard({
  claim,
  onCopyLetter,
  onDownloadPackage,
  letterCopied,
}: BoardingPassCardProps) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const isEligible = claim.verdict === "ELIGIBLE_FOR_CLAIM";
  const isContested = claim.verdict === "FAIL_CLOSED_WEATHER";
  const isIneligible = claim.verdict === "INELIGIBLE";

  // Map verdict to the 3 canonical stamps
  const stamp = isEligible ? "CLEARED" : isIneligible ? "DENIED" : "HOLD";

  const stampColor = isEligible
    ? "border-[#34D399] text-[#34D399] bg-[#34D399]/10 shadow-[#34D399]/10"
    : isIneligible
    ? "border-[#F87171] text-[#F87171] bg-[#F87171]/10 shadow-[#F87171]/10"
    : "border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 shadow-[#FBBF24]/10";

  // Format one-line reason
  const oneLineReason = isEligible
    ? "No adverse weather at departure in the contemporaneous METAR"
    : isIneligible
    ? "Non-EU operating carrier on US departure (excluded under EU261 Art. 3(1)(b))"
    : "Departure storm alert flagged · Art. 5(3) extraordinary circumstances risk";

  const isSolana =
    claim.receipt?.network === "solana" ||
    claim.accounting?.settlementChain?.toLowerCase().includes("solana");

  const explorerUrl = claim.receipt?.explorerUrl || claim.receipt?.basescanUrl;
  const isLive = claim.badge === "LIVE" && Boolean(claim.receipt?.txHash);

  const copyPayload = () => {
    if (!claim.receipt) return;
    const jsonStr = claim.receipt.rawReceiptJson || JSON.stringify(claim.receipt, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* ── BOARDING PASS CONTAINER ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-3xl bg-[#0A0F1F] border border-white/[0.12] shadow-2xl overflow-hidden"
      >
        {/* Top Boarding Pass Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              SKYCLAIM BOARDING PASS
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              PASSENGER DISRUPTION EVIDENCE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400">
              {claim.flight.flightDate || "22 NOV 2026"}
            </span>
            {isLive ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.06] text-slate-400 border border-white/[0.1]">
                FIXTURE
              </span>
            )}
          </div>
        </div>

        {/* Boarding Pass Body: 2-Column with Perforated Divider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 relative">
          {/* Left Column: Route, Flight, Times, Delay (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Route & Airport Display */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {claim.flight.origin || "JFK"}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {claim.flight.origin === "JFK"
                    ? "New York JFK"
                    : claim.flight.origin === "ORD"
                    ? "Chicago O'Hare"
                    : claim.flight.origin}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  SCHED: {claim.flight.scheduledDeparture || "18:00 EST"}
                </div>
              </div>

              {/* Center Plane / Flight Code */}
              <div className="flex flex-col items-center px-4">
                <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full mb-1">
                  {claim.flight.flightNumber}
                </div>
                <div className="w-24 sm:w-32 border-t-2 border-dashed border-white/[0.15] relative my-1">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-cyan-400 text-sm">
                    ✈
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {(claim.flight.distanceKm || 5550).toLocaleString()} KM
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {claim.flight.destination || "LHR"}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {claim.flight.destination === "LHR"
                    ? "London Heathrow"
                    : claim.flight.destination === "CDG"
                    ? "Paris Charles de Gaulle"
                    : claim.flight.destination}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  SCHED: {claim.flight.scheduledArrival || "06:15 UTC"}
                </div>
              </div>
            </div>

            {/* Flight Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Operating Metal
                </span>
                <p className="text-xs font-mono font-semibold text-slate-200 truncate">
                  {claim.flight.operatingCarrier || claim.flight.carrier}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Delay Category
                </span>
                <p className="text-xs font-mono font-semibold text-slate-200">
                  {claim.flight.delayCategory === "WEATHER_IMPACTED"
                    ? "Weather Defense"
                    : "Mechanical / Operational"}
                </p>
              </div>

              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Arrival Delay
                </span>
                <p
                  className={`text-xs font-mono font-bold tabular-nums ${
                    isEligible
                      ? "text-[#34D399]"
                      : isIneligible
                      ? "text-[#F87171]"
                      : "text-[#FBBF24]"
                  }`}
                >
                  +{Math.floor((claim.flight.arrivalDelayMinutes || 222) / 60)}h{" "}
                  {((claim.flight.arrivalDelayMinutes || 222) % 60)
                    .toString()
                    .padStart(2, "0")}m
                </p>
              </div>
            </div>
          </div>

          {/* Perforated Divider (Hidden on mobile, vertical on desktop) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-between py-6 relative">
            {/* Top Cutout Notch */}
            <div className="w-5 h-5 rounded-full bg-[#0B1226] border border-white/[0.12] -mt-8" />
            {/* Dashed Vertical Perforation */}
            <div className="w-px h-full border-r-2 border-dashed border-white/[0.12]" />
            {/* Bottom Cutout Notch */}
            <div className="w-5 h-5 rounded-full bg-[#0B1226] border border-white/[0.12] -mb-8" />
          </div>

          {/* Mobile Horizontal Perforation Divider */}
          <div className="lg:hidden flex items-center justify-between px-2 relative my-2">
            <div className="w-5 h-5 rounded-full bg-[#0B1226] border border-white/[0.12] -ml-5" />
            <div className="w-full border-t-2 border-dashed border-white/[0.12]" />
            <div className="w-5 h-5 rounded-full bg-[#0B1226] border border-white/[0.12] -mr-5" />
          </div>

          {/* Right Column: Large Verdict Stamp, Compensation & Barcode (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-white/[0.015] space-y-6">
            <div className="space-y-4">
              {/* Verdict Stamp */}
              <div className="flex flex-col items-start sm:items-center lg:items-start">
                <div
                  className={`inline-block px-5 py-2.5 rounded-xl border-2 font-mono font-extrabold text-2xl sm:text-3xl tracking-widest uppercase shadow-lg select-none -rotate-2 ${stampColor}`}
                >
                  {stamp}
                </div>
                <p className="text-xs text-slate-300 font-mono mt-3 leading-relaxed">
                  {oneLineReason}
                </p>
              </div>

              {/* Compensation Amount */}
              <div className="pt-2 border-t border-white/[0.08] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {claim.statutoryRegulation === "UK261"
                    ? "UK261 Statutory Claim (GBP)"
                    : "EU261 Statutory Claim (EUR)"}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                  {claim.eligibleCompensationRange}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {isEligible
                    ? "Statutory Payout (Art. 7)"
                    : isIneligible
                    ? "$0 spent · Telemetry bypassed"
                    : "Subject to Art. 5(3) airline defense"}
                </div>
              </div>
            </div>

            {/* Decorative Barcode Stub */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex gap-0.5 items-end h-6 opacity-60">
                  <div className="w-1 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-2 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-2 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 block">
                  {claim.claimId || `SKY-${claim.flight.flightNumber}-2026`}
                </span>
              </div>

              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {claim.statutoryRegulation || "EU261"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── EVIDENCE STRIP UNDER CARD ── */}
      <div className="rounded-2xl bg-[#0A0F1F] border border-white/[0.08] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Cryptographic Proof &amp; Verification Evidence
            </span>

            {isLive ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
                LIVE ON-CHAIN
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                BENCHMARK FIXTURE
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            {isLive
              ? isSolana
                ? "Settled via Solana SVM x402 (~145ms)"
                : "Settled via Base Sepolia x402 ($0.01 USDC)"
              : "Zero-cost offline fixture · No on-chain spend"}
          </div>
        </div>

        {/* Evidence Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Source</span>
            <span className="text-white font-medium truncate block mt-0.5">
              {claim.weather?.sourceAuthority || "Telegraph Consensus"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Miner ID</span>
            <span className="text-white font-medium truncate block mt-0.5">
              {claim.receipt?.minerName || (isLive ? "TxLens (9002)" : "PREFLIGHT (20260828)")}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Protocol Cost</span>
            <span className="text-[#34D399] font-medium block mt-0.5">
              {isLive ? `$${(claim.totalCostUsd || 0.01).toFixed(2)} USDC` : "$0.00 (Fixture)"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Chain</span>
            <span
              className={`font-medium block mt-0.5 ${
                isSolana ? "text-[#14F195]" : "text-cyan-400"
              }`}
            >
              {isSolana ? "Solana Devnet" : "Base Sepolia (84532)"}
            </span>
          </div>
        </div>

        {/* Signal Hash & Explorer Link */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">
              {isLive ? (isSolana ? "Signature:" : "Tx Hash:") : "Signal:"}
            </span>
            <span className="text-cyan-400 truncate select-all">
              {isLive
                ? claim.receipt?.txHash || "0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145"
                : claim.receipt?.signalHash || "0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9 (Fixture Hash)"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLive && explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSolana
                    ? "bg-[#14F195]/15 hover:bg-[#14F195]/25 text-[#14F195] border border-[#14F195]/30"
                    : "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                <span>{isSolana ? "Solscan" : "BaseScan"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-medium transition cursor-pointer"
            >
              <span>{showRawJson ? "Hide Evidence" : "View Evidence"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showRawJson ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Evidence Payload */}
        <AnimatePresence>
          {showRawJson && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-[#070B14] border border-white/[0.06] p-3 text-xs font-mono space-y-2 overflow-hidden mt-3"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/[0.06] pb-1.5">
                <span>Cryptographic Telemetry Payload</span>
                <button
                  onClick={copyPayload}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {jsonCopied ? "Copied!" : "Copy Payload"}
                </button>
              </div>
              <pre className="text-slate-300 overflow-x-auto max-h-48 text-[11px] leading-relaxed p-1">
                {claim.receipt?.rawReceiptJson || JSON.stringify(claim.receipt || claim.weather, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ACTION FOOTER / HONESTY EXPLANATION ── */}
      {isEligible ? (
        /* CLEARED FLIGHT: Show Copy Claim Letter & Download Package */
        <div className="rounded-2xl bg-[#0A0F1F] border border-[#34D399]/20 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-mono font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                <span>Statutory Claim Letter Ready to Send</span>
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Eligible under UK261 / EU261 Article 7. Carrier weather defense refuted by verified corridor telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onCopyLetter}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white transition cursor-pointer"
              >
                {letterCopied ? (
                  <>
                    <Check className="h-4 w-4 text-[#34D399]" />
                    <span className="text-[#34D399]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-400" />
                    <span>Copy Claim Letter</span>
                  </>
                )}
              </button>

              <button
                onClick={onDownloadPackage}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs transition shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                <Download className="h-4 w-4 text-black" />
                <span>Download Package</span>
              </button>
            </div>
          </div>

          {/* Letter preview */}
          <div className="rounded-xl bg-[#070B14] border border-white/[0.06] p-4 text-xs font-mono text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {claim.draftClaimLetter || claim.caseCopy}
          </div>
        </div>
      ) : isIneligible ? (
        /* DENIED FLIGHT: Honest Explanation of Ineligibility */
        <div className="rounded-2xl bg-[#0A0F1F] border border-[#F87171]/20 p-5 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-[#F87171] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-mono font-semibold text-white">
                Why this flight was denied: Non-EU Operating Metal
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Operating carrier is <strong>Delta Air Lines</strong>. Under Regulation (EC) No 261/2004 Article 3(1)(b), EU261 only covers flights departing a third country (such as the US) if operated by an EU-licensed carrier. Even though tickets were ticketed as Air France codeshare and the arrival delay was +3h 30m, the physical operating metal governs jurisdiction.
              </p>
              <div className="pt-2 text-xs text-slate-400 font-sans border-t border-white/[0.06]">
                <strong className="text-slate-200">What would change the verdict:</strong> If the aircraft was operated by European metal (e.g. Air France) or departed from a European airport (e.g. CDG → JFK), the statutory 3-hour delay would entitle passengers to €600 compensation.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* HOLD FLIGHT: Weather Defense / Insufficient Telemetry Explanation */
        <div className="rounded-2xl bg-[#0A0F1F] border border-[#FBBF24]/20 p-5 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#FBBF24] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-mono font-semibold text-white">
                Why this claim is on hold: Convective Weather Alert Flagged
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                A severe meteorological alert was recorded at the departure corridor. The carrier will invoke Article 5(3) extraordinary circumstances. Claim letter generation is suspended until secondary peer airport departure records verify whether other flights operated on schedule.
              </p>
              <div className="pt-2 text-xs text-slate-400 font-sans border-t border-white/[0.06]">
                <strong className="text-slate-200">What would change the verdict:</strong> Demonstrating that other flights departed the same runway within the same 60-minute window without diversion or cancellation defeats the airline&apos;s Article 5(3) defense under CJEU Wallentin-Hermann precedent.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
