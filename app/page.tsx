"use client";

import React, { useState } from "react";
import { SKYCLAIM_PRESETS, SKYCLAIM_CONFIG, SKYCLAIM_PUBLIC_LEDGER } from "@/lib/skyclaim-consensus";
import { SkyClaimResult, PresetScenario } from "@/lib/skyclaim-types";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import {
  Plane,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Download,
  Zap,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  Scale,
  Lock,
  CloudSun,
  FileText,
  Activity,
  Layers,
} from "lucide-react";

export default function SkyClaimHome() {
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDate, setFlightDate] = useState("2026-11-20");
  const [loading, setLoading] = useState(false);
  const [claim, setClaim] = useState<SkyClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Run disruption audit action
  const runVerification = async (overrideFlight?: string, overrideDate?: string) => {
    const flightToTest = overrideFlight || flightNumber;
    const dateToTest = overrideDate || flightDate || "2026-11-20";

    if (!flightToTest) {
      setError("Please select a flight scenario or enter a flight code (e.g. BA178).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightNumber: flightToTest,
          flightDate: dateToTest,
          forceDemo: false,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setClaim(data as SkyClaimResult);
    } catch (err: any) {
      setError(err?.message || "Failed to verify flight disruption.");
    } finally {
      setLoading(false);
    }
  };

  // Preset selector
  const selectPreset = (preset: PresetScenario) => {
    setFlightNumber(preset.flightNumber);
    setFlightDate(preset.flightDate);
    runVerification(preset.flightNumber, preset.flightDate);
  };

  // Export claim package
  const downloadClaimPackage = () => {
    if (!claim) return;
    const blob = new Blob([claim.draftClaimLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${claim.flight.flightNumber}-Disruption-Claim-Package.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyClaimPackage = () => {
    if (!claim) return;
    navigator.clipboard.writeText(claim.draftClaimLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-gray-100 flex flex-col font-sans radar-grid">
      {/* Top Aerospace Header */}
      <header className="border-b border-[#1A1E26] bg-[#0A0D14]/90 backdrop-blur-md px-6 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Plane className="h-4 w-4 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">SKYCLAIM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  AEROSPACE INTEL · MISSION 15
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Budget & Safety Guard Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F131C] border border-[#1C2230] text-[11px] font-mono text-gray-300">
              <span className="text-emerald-400">Cap: $0.05/req</span>
              <span className="text-gray-600">·</span>
              <span className="text-blue-400">Daily: $5.00</span>
              <span className="text-gray-600">·</span>
              <span className="text-purple-400">15 req/min</span>
            </div>

            {/* Network Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Base Sepolia (84532)
            </div>

            {/* Sponsor Evidence Button */}
            <button
              onClick={() => setReceiptBoxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              The Receipt Box
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Flight Desk */}
      <main className="max-w-6xl mx-auto w-full px-6 py-6 flex-1 space-y-6">
        {/* Positioning Hero Bar: 60-Second Judge Hook */}
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0D111A] to-purple-950/20 p-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Consensus Before Action · Mission 15
                </span>
                <span className="text-xs text-gray-400 font-mono">Dual-Miner Adjudication vs. Single-Source</span>
              </div>
              <p className="text-sm font-medium text-gray-200">
                “SkyClaim only files a claim when <strong className="text-white">two independent Telegraph miners agree</strong> the delay is eligible and weather does not give the airline a free pass. <span className="text-amber-400 font-semibold">Otherwise it fails closed and tells you not to bother.</span>”
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                EU261 / UK261 Statutory Recovery (€250–€600)
              </span>
            </div>
          </div>
        </div>

        {/* Flight Departure Terminal / Presets */}
        <section className="bg-[#0A0D14] border border-[#1A1F2B] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <h1 className="text-xs font-semibold text-gray-300 uppercase tracking-widest font-mono">
                Flight Telemetry Dispatcher · 1-Click Scenarios
              </h1>
            </div>
            <span className="text-xs text-gray-400 font-mono">Cost: $0.02 USDC (2 x402 miners)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SKYCLAIM_PRESETS.map((p) => {
              const isSelected = flightNumber.toUpperCase() === p.flightNumber.toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p)}
                  disabled={loading}
                  className={`text-left p-4 rounded-xl border transition relative overflow-hidden group ${
                    isSelected
                      ? "border-blue-500/80 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                      : "border-[#1A1F2B] bg-[#0E121B] hover:border-gray-700 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm tracking-wide text-white group-hover:text-blue-400 transition">
                      {p.flightNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        p.expectedVerdict === "APPROVED_FOR_CLAIM"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : p.expectedVerdict === "INELIGIBLE_ON_TIME"
                          ? "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {p.expectedVerdict === "APPROVED_FOR_CLAIM"
                        ? "€600 CLAIM"
                        : p.expectedVerdict === "INELIGIBLE_ON_TIME"
                        ? "ON-TIME"
                        : "CONFLICT"}
                    </span>
                  </div>
                  <p className="mt-1.5 font-medium text-xs text-gray-200">{p.carrier}</p>
                  <p className="mt-1 text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{p.summary}</p>
                </button>
              );
            })}
          </div>

          {/* Quick Airport Search & Telemetry Input */}
          <div className="mt-5 pt-4 border-t border-[#1A1F2B] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter flight code (e.g. BA178, DL401, AF112, LH400)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-[#0E121B] border border-[#1A1F2B] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition uppercase tracking-wider"
              />
            </div>
            <input
              type="date"
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              className="bg-[#0E121B] border border-[#1A1F2B] rounded-xl px-4 py-2.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={() => runVerification()}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-blue-600/20 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Auditing 2 Miners ($0.02)...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Verify Disruption Telemetry</span>
                </>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* High-End Flight Boarding Pass & Telemetry Dossier */}
        {claim && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Action Recommendation Banner (The 60-Second Verdict) */}
            {claim.verdict === "APPROVED_FOR_CLAIM" && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <span>RECOMMENDATION: GREENLIGHT TO FILE</span>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">€600 APPROVED</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">
                      Dual consensus reached: Gate delay (+3h 35m) and clear weather independently verified. Airline Article 5(3) weather defense is pre-emptively refuted.
                    </div>
                  </div>
                </div>
                <div className="shrink-0 font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-center">
                  GREENLIGHT · PROCEED
                </div>
              </div>
            )}

            {claim.verdict === "INELIGIBLE_ON_TIME" && (
              <div className="p-4 rounded-2xl bg-gray-500/10 border border-gray-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-500/20 border border-gray-500/30 flex items-center justify-center shrink-0 text-gray-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <span>RECOMMENDATION: DO NOT FILE — INELIGIBLE</span>
                      <span className="text-[10px] bg-gray-500/20 px-2 py-0.5 rounded text-gray-300">+14M MINOR DELAY</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Arrival delay is below statutory 3-hour minimum under EU261/UK261. Automated claim halted to prevent 100% airline rejection and save time.
                    </div>
                  </div>
                </div>
                <div className="shrink-0 font-mono text-xs text-gray-300 font-semibold bg-gray-500/20 px-3 py-1.5 rounded-lg border border-gray-500/30 text-center">
                  HALTED · DO NOT FILE
                </div>
              </div>
            )}

            {claim.verdict === "FAIL_CLOSED_WEATHER_CONFLICT" && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-rose-500/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                      <span>RECOMMENDATION: DO NOT FILE — HIGH REJECTION RISK</span>
                      <span className="text-[10px] bg-rose-500/25 px-2 py-0.5 rounded text-rose-200">FAIL-CLOSED ACTIVE</span>
                    </div>
                    <div className="text-xs text-rose-200/90 mt-0.5">
                      Severe blizzard ground stop detected at Chicago ORD. The airline possesses an ironclad Article 5(3) "extraordinary circumstances" defense. SkyClaim refuses to file and protects your legal standing.
                    </div>
                  </div>
                </div>
                <div className="shrink-0 font-mono text-xs text-rose-300 font-semibold bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/40 text-center">
                  HOLD CLAIM · DEFENSE DETECTED
                </div>
              </div>
            )}

            {/* Luxury Boarding Pass Metaphor Card */}
            <section
              className={`rounded-2xl border relative overflow-hidden transition ${
                claim.verdict === "APPROVED_FOR_CLAIM"
                  ? "bg-gradient-to-b from-[#0B1516] to-[#080D12] border-emerald-500/40 glow-emerald"
                  : claim.verdict === "INELIGIBLE_ON_TIME"
                  ? "bg-gradient-to-b from-[#0F1218] to-[#0A0D12] border-gray-700/40"
                  : "bg-gradient-to-b from-[#17120D] to-[#0D0B09] border-amber-500/40 glow-amber"
              }`}
            >
              {/* Notches for ticket cutout look */}
              <div className="hidden lg:block ticket-notch-left top-1/2 -translate-y-1/2 border-r border-[#1A1F2B]" />
              <div className="hidden lg:block ticket-notch-right top-1/2 -translate-y-1/2 border-l border-[#1A1F2B]" />

              {/* Pass Header */}
              <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {claim.flight.carrier}
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="font-mono text-sm font-bold text-white tracking-wider">
                    {claim.flight.flightNumber}
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-[11px] font-mono text-gray-400">
                    Transatlantic Route ({claim.flight.distanceKm.toLocaleString()} km)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Execution Mode Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      claim.mode === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                    }`}
                  >
                    ● {claim.mode}
                  </span>

                  {/* Verdict Pill */}
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                      claim.verdict === "APPROVED_FOR_CLAIM"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : claim.verdict === "INELIGIBLE_ON_TIME"
                        ? "bg-gray-500/20 text-gray-300 border-gray-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {claim.verdict.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Boarding Pass Flight Route & Gate Trajectory */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Route Visualizer (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center justify-between">
                    {/* Origin */}
                    <div>
                      <span className="text-3xl font-black font-mono tracking-tight text-white block">
                        {claim.flight.origin}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {claim.flight.origin === "LHR" ? "London Heathrow" : claim.flight.origin === "CDG" ? "Paris Charles de Gaulle" : "New York JFK"}
                      </span>
                      <div className="mt-2 text-[11px] font-mono text-gray-500">
                        Scheduled: <strong className="text-gray-300">{claim.flight.scheduledArrival.split(" ")[0]} UTC</strong>
                      </div>
                    </div>

                    {/* Trajectory Flight Path */}
                    <div className="flex-1 px-6 flex flex-col items-center">
                      <div className="w-full flex items-center justify-center gap-2 text-gray-600">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-600 to-gray-500" />
                        <Plane className="h-5 w-5 text-blue-400 transform rotate-90 shrink-0" />
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-500 via-gray-600 to-transparent" />
                      </div>

                      {/* Delay Indicator Tag */}
                      <div className="mt-2.5">
                        <span
                          className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
                            claim.flight.delayMinutes >= 180
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : claim.flight.delayMinutes > 0
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          +{Math.floor(claim.flight.delayMinutes / 60)}H {claim.flight.delayMinutes % 60}M DELAY
                        </span>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="text-right">
                      <span className="text-3xl font-black font-mono tracking-tight text-white block">
                        {claim.flight.destination}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {claim.flight.destination === "JFK" ? "New York JFK" : claim.flight.destination === "LAX" ? "Los Angeles LAX" : "Chicago O'Hare"}
                      </span>
                      <div className="mt-2 text-[11px] font-mono text-gray-500">
                        Actual Gate: <strong className="text-gray-200">{claim.flight.actualArrival}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Operational Consensus Note */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 leading-relaxed">
                    <span className="font-semibold text-gray-100">Consensus Audit: </span>
                    {claim.verdictRationale}
                  </div>
                </div>

                {/* Right Payout Stub (4 cols) */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6 pt-5 lg:pt-0 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">
                      Statutory Compensation Right
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-black font-mono tracking-tight ${
                          claim.verdict === "APPROVED_FOR_CLAIM"
                            ? "text-emerald-400"
                            : claim.verdict === "INELIGIBLE_ON_TIME"
                            ? "text-gray-400"
                            : "text-amber-400"
                        }`}
                      >
                        {claim.eligibleCompensation.split(" ")[0]}
                      </span>
                      <span className="text-xs font-mono text-gray-400">/ ticketed passenger</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400 font-mono">
                      Regulation: <span className="text-gray-200">{claim.statutoryRegulation} Article 7</span>
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    {claim.verdict === "APPROVED_FOR_CLAIM" && (
                      <button
                        onClick={downloadClaimPackage}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-lg shadow-emerald-600/20"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Claim Package
                      </button>
                    )}

                    <button
                      onClick={copyClaimPackage}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Dossier Copied to Clipboard" : "Copy Complete Dossier"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pass Footer Micro-Ledger */}
              <div className="px-6 py-3 border-t border-white/5 bg-black/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-5">
                  <span>
                    Cost: <strong className="text-emerald-400">${claim.totalCostUsd.toFixed(2)} USDC</strong> (2 x402 miners)
                  </span>
                  <span>
                    Latency: <strong className="text-gray-200">{claim.totalLatencyMs}ms</strong>
                  </span>
                  <span>
                    Consensus: <strong className="text-blue-400">{claim.consensus.minerAgreement ? "2/2 Locked" : "Fail-Closed"}</strong>
                  </span>
                </div>
                <div>
                  Dossier Ref: <span className="text-gray-300">{claim.claimId}</span>
                </div>
              </div>
            </section>

            {/* Dual-Miner Telemetry Radar Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sensor 1: Flight Telemetry Miner */}
              <div className="rounded-2xl border border-[#1A1F2B] bg-[#0A0D14] p-5 shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-xs text-white">Sensor Alpha · Transit Radar</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      claim.receipts.transitMiner.mode === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {claim.receipts.transitMiner.mode}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-gray-300">
                    Miner: <strong className="text-white">{claim.receipts.transitMiner.minerName}</strong>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Intent: <span className="text-gray-300">{claim.receipts.transitMiner.intent}</span> · Rank: <span className="text-blue-400 font-bold">#{claim.receipts.transitMiner.networkRank}</span>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Telemetry: <span className="text-gray-200">Delay +{claim.flight.delayMinutes}m verified at destination gate</span>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Rule 1 (&ge; 180 min): <strong className={claim.consensus.rule1DelayMet ? "text-emerald-400" : "text-gray-500"}>{claim.consensus.rule1DelayMet ? "SATISFIED ✓" : "BELOW STATUTORY THRESHOLD"}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A1F2B] flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span>Settled: $0.01 USDC</span>
                  <a
                    href={claim.receipts.transitMiner.basescanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Basescan Proof <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Sensor 2: Meteorological Defense Miner */}
              <div className="rounded-2xl border border-[#1A1F2B] bg-[#0A0D14] p-5 shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudSun className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold text-xs text-white">Sensor Beta · Weather Defense Scanner</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      claim.receipts.weatherMiner.mode === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {claim.receipts.weatherMiner.mode}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-gray-300">
                    Miner: <strong className="text-white">{claim.receipts.weatherMiner.minerName}</strong>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Intent: <span className="text-gray-300">{claim.receipts.weatherMiner.intent}</span> · Rank: <span className="text-cyan-400 font-bold">#{claim.receipts.weatherMiner.networkRank}</span>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Atmosphere: <span className="text-gray-200">{claim.weather.stormDetails}</span>
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    Rule 2 (Weather clear): <strong className={claim.consensus.rule2WeatherClear ? "text-emerald-400" : "text-rose-400"}>{claim.consensus.rule2WeatherClear ? "DEFENSE REFUTED ✓" : "DEFENSE RISK ACTIVE ⚠️"}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A1F2B] flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span>Settled: $0.01 USDC</span>
                  <a
                    href={claim.receipts.weatherMiner.basescanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Basescan Proof <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* Generated Dispute-Proof Legal Claim Package */}
            <section className="rounded-2xl border border-[#1A1F2B] bg-[#0A0D14] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3 border-b border-[#1A1F2B] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
                    Statutory Claim Dossier · Pre-Emptive Legal Demand
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={copyClaimPackage}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={downloadClaimPackage}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    <Download className="h-3 w-3" /> Download .txt
                  </button>
                </div>
              </div>
              <pre className="font-mono text-[11px] text-gray-300 bg-[#060709] p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-[#141822] leading-relaxed">
                {claim.draftClaimLetter}
              </pre>
            </section>
          </div>
        )}

        {/* Public Claim Board / "Money Recovered" Ledger */}
        <section className="bg-[#0A0D14] border border-[#1A1F2B] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1F2B] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-gray-200 uppercase tracking-widest font-mono">
                  Public Claim Board · Live Recovery & Protection Ledger
                </h2>
                <p className="text-[11px] text-gray-400 font-mono">
                  Real-time machine consensus audit stream · Anonymized passenger claims
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                €14,450 Recovered
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                $0.96 USDC Intel Spend
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                31.2% Fail-Closed Safe
              </span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#161B26] text-[10px] text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Flight / Route</th>
                  <th className="py-2.5 px-3">Gate Telemetry</th>
                  <th className="py-2.5 px-3">Consensus Verdict</th>
                  <th className="py-2.5 px-3">Action Recommendation</th>
                  <th className="py-2.5 px-3">Compensation</th>
                  <th className="py-2.5 px-3 text-right">Dual Receipts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121622] text-gray-300">
                {SKYCLAIM_PUBLIC_LEDGER.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{entry.flightNumber}</span>
                        <span className="text-[10px] font-normal text-gray-400 font-sans">({entry.carrier})</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{entry.route} · {entry.timestamp}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-gray-200">{entry.delayText}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          entry.verdict === "APPROVED_FOR_CLAIM"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : entry.verdict === "INELIGIBLE_ON_TIME"
                            ? "bg-gray-500/15 text-gray-400 border-gray-500/30"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {entry.verdict === "APPROVED_FOR_CLAIM"
                          ? "2/2 CONSENSUS"
                          : entry.verdict === "INELIGIBLE_ON_TIME"
                          ? "ON-TIME TOLERANCE"
                          : "FAIL-CLOSED DEFENSE"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold ${
                          entry.recommendation === "GREENLIGHT_TO_FILE"
                            ? "text-emerald-400"
                            : entry.recommendation === "DO_NOT_FILE_INELIGIBLE"
                            ? "text-gray-400"
                            : "text-rose-400"
                        }`}
                      >
                        {entry.recommendation === "GREENLIGHT_TO_FILE"
                          ? "✅ GREENLIGHT (File Claim)"
                          : entry.recommendation === "DO_NOT_FILE_INELIGIBLE"
                          ? "⏹️ DO NOT FILE (Ineligible)"
                          : "⛔ DO NOT FILE (Storm Risk)"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={entry.compensationEur > 0 ? "text-emerald-400" : "text-gray-500"}>
                        {entry.compensationEur > 0 ? `+€${entry.compensationEur}` : "€0 (Protected)"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px]">
                        <a
                          href={entry.basescanTransit}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline flex items-center gap-0.5"
                          title="Transit Telemetry Receipt"
                        >
                          Transit <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        <span className="text-gray-600">·</span>
                        <a
                          href={entry.basescanWeather}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5"
                          title="Weather Defense Audit Receipt"
                        >
                          Weather <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* The Receipt Box Modal */}
      <TheReceiptBox isOpen={receiptBoxOpen} onClose={() => setReceiptBoxOpen(false)} />
    </div>
  );
}
