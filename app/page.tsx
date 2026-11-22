"use client";

import React, { useState } from "react";
import { SKYCLAIM_PRESETS, SKYCLAIM_CONFIG } from "@/lib/skyclaim-consensus";
import { SkyClaimResult, PresetScenario } from "@/lib/skyclaim-types";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import {
  Plane,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Download,
  Zap,
  Coins,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  CloudSun,
  Clock,
  Compass,
} from "lucide-react";

export default function SkyClaimHome() {
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDate, setFlightDate] = useState("2026-11-20");
  const [loading, setLoading] = useState(false);
  const [claim, setClaim] = useState<SkyClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState("25.00");
  const [activeTab, setActiveTab] = useState<"consensus" | "receipts" | "claimLetter">("consensus");

  // Run disruption audit action
  const runVerification = async (overrideFlight?: string, overrideDate?: string) => {
    const flightToTest = overrideFlight || flightNumber;
    const dateToTest = overrideDate || flightDate || "2026-11-20";

    if (!flightToTest) {
      setError("Please select an evaluator preset or enter a flight number (e.g. BA178).");
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data: SkyClaimResult = await res.json();
      setClaim(data);

      // Decrement simulated wallet balance
      setWalletBalance((prev) => Math.max(0, parseFloat(prev) - 0.02).toFixed(2));
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

  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[#1C2028] bg-[#0A0C10] px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center font-mono font-bold text-xs text-white">
              <Plane className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide text-white">SKYCLAIM</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                  Mission 15 · Consumer Automation
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Network Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Base Sepolia (84532)
            </div>

            {/* Test Wallet Balance */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#12151D] border border-[#1C2028] text-xs font-mono">
              <Coins className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-gray-300">${walletBalance} USDC</span>
              <button
                onClick={() => setWalletBalance("25.00")}
                title="Reset Simulated Wallet"
                className="text-gray-500 hover:text-gray-300 ml-1 transition"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            {/* Sponsor Evidence Button */}
            <button
              onClick={() => setReceiptBoxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              The Receipt Box
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-6">
        {/* Preset Selector Bar (The 90-Second Rule) */}
        <section className="bg-[#0C0E14] border border-[#1C2028] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              1-Click Evaluator Presets (The 3 Reviewer Scenarios)
            </span>
            <span className="text-xs text-muted font-mono">Cost: $0.02 USDC (2 x402 miners)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SKYCLAIM_PRESETS.map((p) => {
              const isSelected = flightNumber.toUpperCase() === p.flightNumber.toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p)}
                  disabled={loading}
                  className={`text-left p-3.5 rounded-lg border transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/5 text-white"
                      : "border-[#1C2028] bg-[#10121A] hover:border-gray-700 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{p.flightNumber} · {p.carrier}</span>
                    <span
                      className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                        p.expectedVerdict === "APPROVED_FOR_CLAIM"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : p.expectedVerdict === "INELIGIBLE_ON_TIME"
                          ? "bg-gray-500/10 text-gray-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {p.expectedVerdict === "APPROVED_FOR_CLAIM"
                        ? "€600 CLAIM"
                        : p.expectedVerdict === "INELIGIBLE_ON_TIME"
                        ? "ON-TIME"
                        : "CONFLICT RISK"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400 line-clamp-1">{p.summary}</p>
                  <p className="mt-1 font-mono text-[10px] text-gray-500 truncate">{p.route}</p>
                </button>
              );
            })}
          </div>

          {/* Manual Input Form */}
          <div className="mt-4 pt-4 border-t border-[#1C2028] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Or enter any flight code (e.g. BA178, DL401, AF112, LH400)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-[#10121A] border border-[#1C2028] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition uppercase"
              />
            </div>
            <input
              type="date"
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              className="bg-[#10121A] border border-[#1C2028] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={() => runVerification()}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs transition shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Buying 2-Miner Consensus...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Verify Disruption ($0.02 USDC)
                </>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Results View */}
        {claim && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Executive Verdict Banner */}
            <section
              className={`rounded-xl border p-5 transition ${
                claim.verdict === "APPROVED_FOR_CLAIM"
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : claim.verdict === "INELIGIBLE_ON_TIME"
                  ? "bg-gray-900/40 border-gray-700/30"
                  : "bg-amber-950/20 border-amber-500/30"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border ${
                      claim.verdict === "APPROVED_FOR_CLAIM"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : claim.verdict === "INELIGIBLE_ON_TIME"
                        ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {claim.verdict === "APPROVED_FOR_CLAIM" && <CheckCircle2 className="h-6 w-6" />}
                    {claim.verdict === "INELIGIBLE_ON_TIME" && <Clock className="h-6 w-6" />}
                    {claim.verdict === "FAIL_CLOSED_WEATHER_CONFLICT" && <AlertTriangle className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-base font-bold text-white tracking-wide">
                        {claim.flight.carrier} {claim.flight.flightNumber} ({claim.flight.origin} → {claim.flight.destination})
                      </h1>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          claim.verdict === "APPROVED_FOR_CLAIM"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : claim.verdict === "INELIGIBLE_ON_TIME"
                            ? "bg-gray-500/20 text-gray-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {claim.verdict.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-300">{claim.verdictRationale}</p>
                    <p className="mt-1 text-[11px] font-mono text-gray-400">
                      Scheduled: {claim.flight.scheduledArrival} · Actual Gate Arrival: {claim.flight.actualArrival} · Total Delay: +{Math.floor(claim.flight.delayMinutes / 60)}h {claim.flight.delayMinutes % 60}m
                    </p>
                  </div>
                </div>

                {/* Statutory Compensation Amount */}
                <div className="flex items-center gap-6 self-end md:self-auto border-t md:border-t-0 border-[#1C2028] pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-muted uppercase tracking-wider block font-medium">Statutory Entitlement</span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        claim.verdict === "APPROVED_FOR_CLAIM"
                          ? "text-emerald-400"
                          : claim.verdict === "INELIGIBLE_ON_TIME"
                          ? "text-gray-400"
                          : "text-amber-400"
                      }`}
                    >
                      {claim.eligibleCompensation.split(" ")[0]}
                      <span className="text-xs text-gray-400 font-normal"> / passenger</span>
                    </span>
                  </div>

                  {claim.verdict === "APPROVED_FOR_CLAIM" && (
                    <button
                      onClick={downloadClaimPackage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Claim Pack
                    </button>
                  )}
                </div>
              </div>

              {/* Cost & Verification Proof Line */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Cost: <strong className="text-emerald-400">${claim.totalCostUsd.toFixed(2)} USDC</strong> (2 x402 miners)
                  </span>
                  <span>
                    Latency: <strong className="text-gray-200">{claim.totalLatencyMs}ms</strong>
                  </span>
                  <span>
                    Consensus: <strong className="text-blue-400">{claim.consensus.minerAgreement ? "Verified (2/2)" : "Conflict / Fail-Closed"}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Claim ID: <span className="text-gray-300">{claim.claimId}</span>
                </div>
              </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#1C2028] pb-1">
              <button
                onClick={() => setActiveTab("consensus")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "consensus"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                2-Miner Consensus Proof
              </button>
              <button
                onClick={() => setActiveTab("receipts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "receipts"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                On-Chain Receipts (Base Sepolia)
              </button>
              <button
                onClick={() => setActiveTab("claimLetter")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "claimLetter"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Generated Claim Letter
              </button>
            </div>

            {/* TAB 1: Consensus Proof */}
            {activeTab === "consensus" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Miner 1: Transit */}
                <div className="rounded-xl border border-[#1C2028] bg-[#0C0E14] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-blue-400" />
                        <span className="font-semibold text-xs text-white">Miner 1: Transit &amp; Delay Telemetry</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        {claim.receipts.transitMiner.intent}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3 text-xs text-gray-300">
                      <p>• Flight Status: <strong className="text-white">{claim.flight.rawStatus}</strong></p>
                      <p>• Actual Gate Delay: <strong className="text-white">+{claim.flight.delayMinutes} minutes</strong></p>
                      <p>• Delay Threshold (&gt;180m): <strong className={claim.consensus.rule1DelayMet ? "text-emerald-400" : "text-gray-400"}>{claim.consensus.rule1DelayMet ? "MET (Eligible)" : "NOT MET (Ineligible)"}</strong></p>
                      <p>• Operational Category: {claim.flight.delayCategory}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C2028] flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>{claim.receipts.transitMiner.minerName} (Rank #1)</span>
                    <a
                      href={claim.receipts.transitMiner.basescanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      Tx Receipt <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Miner 2: Weather */}
                <div className="rounded-xl border border-[#1C2028] bg-[#0C0E14] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CloudSun className="h-4 w-4 text-amber-400" />
                        <span className="font-semibold text-xs text-white">Miner 2: Weather &amp; Defense Pre-emption</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {claim.receipts.weatherMiner.intent}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3 text-xs text-gray-300">
                      <p>• Severe Weather Alert: <strong className={claim.weather.hasSevereStormAlert ? "text-rose-400" : "text-emerald-400"}>{claim.weather.hasSevereStormAlert ? "ACTIVE STORM DETECTED" : "ZERO WEATHER HAZARDS"}</strong></p>
                      <p>• Observation: {claim.weather.stormDetails}</p>
                      <p>• Article 5(3) Defense Risk: <strong className={claim.weather.extraordinaryCircumstancesRisk === "HIGH_AIRLINE_DEFENSE" ? "text-rose-400" : "text-emerald-400"}>{claim.weather.extraordinaryCircumstancesRisk}</strong></p>
                      <p>• Source Authority: {claim.weather.sourceAuthority}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C2028] flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>{claim.receipts.weatherMiner.minerName} (Rank #1)</span>
                    <a
                      href={claim.receipts.weatherMiner.basescanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      Tx Receipt <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Receipts */}
            {activeTab === "receipts" && (
              <div className="rounded-xl border border-[#1C2028] bg-[#0C0E14] overflow-hidden">
                <div className="border-b border-[#1C2028] bg-white/[0.02] px-4 py-3 flex items-center justify-between text-xs font-semibold text-gray-300">
                  <span>2 Settled x402 Micropayments (Base Sepolia Chain ID 84532)</span>
                  <span className="font-mono text-emerald-400">Total: $0.02 USDC</span>
                </div>
                <div className="divide-y divide-[#1C2028]">
                  {/* Transit Miner */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Transit Telemetry Purchase</span>
                        <span className="text-[10px] text-gray-500 font-mono">Miner: {claim.receipts.transitMiner.minerId}</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-gray-400">
                        Tx Hash: <span className="text-gray-300">{claim.receipts.transitMiner.txHash}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">$0.01 USDC</span>
                      <a
                        href={claim.receipts.transitMiner.basescanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        Basescan <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Weather Miner */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Weather Screening Purchase</span>
                        <span className="text-[10px] text-gray-500 font-mono">Miner: {claim.receipts.weatherMiner.minerId}</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-gray-400">
                        Tx Hash: <span className="text-gray-300">{claim.receipts.weatherMiner.txHash}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">$0.01 USDC</span>
                      <a
                        href={claim.receipts.weatherMiner.basescanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        Basescan <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Claim Letter */}
            {activeTab === "claimLetter" && (
              <div className="rounded-xl border border-[#1C2028] bg-[#0A0C10] p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#1C2028] pb-2">
                  <span className="text-xs font-semibold text-gray-300">Statutory Passenger Claim Document</span>
                  <button
                    onClick={downloadClaimPackage}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <Download className="h-3 w-3" /> Download Text File
                  </button>
                </div>
                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {claim.draftClaimLetter}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sponsor Evidence Box Modal */}
      <TheReceiptBox isOpen={receiptBoxOpen} onClose={() => setReceiptBoxOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-[#1C2028] bg-[#0A0C10] px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span>SkyClaim · Telegraph Season II</span>
            <span>•</span>
            <span>Track 03: Apps &amp; Agents</span>
            <span>•</span>
            <span>Mission 15: Consumer Automation</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Run Bot: <code>npx tsx scripts/telegram-bot.ts</code></span>
            <span>•</span>
            <a
              href="https://github.com/telegraphprotocol/bounties"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              Star Bounties Repo <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
