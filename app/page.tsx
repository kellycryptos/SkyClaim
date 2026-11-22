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
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldAlert,
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
      setError("Please select a preset or enter a flight number (e.g. BA178).");
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
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[#1C2028] bg-[#0A0C10] px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            {/* Budget & Safety Guard Pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#12151D] border border-[#1C2028] text-[11px] font-mono text-gray-300">
              <span className="text-emerald-400">Cap: $0.05/req</span>
              <span className="text-gray-600">·</span>
              <span className="text-blue-400">Daily: $5.00 limit</span>
              <span className="text-gray-600">·</span>
              <span className="text-purple-400">15 req/min</span>
            </div>

            {/* Network Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Base Sepolia (84532)
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

      {/* Main Container - 1 Minimal Page */}
      <main className="max-w-6xl mx-auto w-full px-6 py-6 flex-1 space-y-6">
        {/* 1-Click Reviewer Presets */}
        <section className="bg-[#0C0E14] border border-[#1C2028] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              1-Click Reviewer Presets (The 3 Acceptance Scenarios)
            </span>
            <span className="text-xs text-gray-400 font-mono">Cost: $0.02 USDC (2 x402 miners)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SKYCLAIM_PRESETS.map((p) => {
              const isSelected = flightNumber.toUpperCase() === p.flightNumber.toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p)}
                  disabled={loading}
                  className={`text-left p-3 rounded-lg border transition ${
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
                        : "CONFLICT"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400 line-clamp-1">{p.summary}</p>
                </button>
              );
            })}
          </div>

          {/* Flight Input Form */}
          <div className="mt-4 pt-4 border-t border-[#1C2028] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Enter flight code (e.g. BA178, DL401, AF112)"
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
                  Verifying Consensus ($0.02)...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Verify Flight Disruption
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

        {/* Result Card & Claim Draft */}
        {claim && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Result Card */}
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
                    {claim.verdict === "FAIL_CLOSED_WEATHER_CONFLICT" && <ShieldAlert className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base font-bold text-white tracking-wide">
                        {claim.flight.carrier} {claim.flight.flightNumber} ({claim.flight.origin} → {claim.flight.destination})
                      </h2>

                      {/* Visible LIVE / SIMULATED Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          claim.mode === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        }`}
                      >
                        ● {claim.mode}
                      </span>

                      {/* Verdict Badge */}
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
                      Scheduled: {claim.flight.scheduledArrival} · Actual: {claim.flight.actualArrival} · Delay: +{Math.floor(claim.flight.delayMinutes / 60)}h {claim.flight.delayMinutes % 60}m
                    </p>
                  </div>
                </div>

                {/* Compensation & Action */}
                <div className="flex items-center gap-4 self-end md:self-auto border-t md:border-t-0 border-[#1C2028] pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Statutory Compensation</span>
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
                      <span className="text-xs text-gray-400 font-normal"> / pax</span>
                    </span>
                  </div>

                  {claim.verdict === "APPROVED_FOR_CLAIM" && (
                    <button
                      onClick={downloadClaimPackage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Claim
                    </button>
                  )}
                </div>
              </div>

              {/* Status & Proof Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Cost: <strong className="text-emerald-400">${claim.totalCostUsd.toFixed(2)} USDC</strong>
                  </span>
                  <span>
                    Latency: <strong className="text-gray-200">{claim.totalLatencyMs}ms</strong>
                  </span>
                  <span>
                    Consensus: <strong className="text-blue-400">{claim.consensus.minerAgreement ? "2/2 Agreement" : "Fail-Closed"}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Claim ID: <span className="text-gray-300">{claim.claimId}</span>
                </div>
              </div>
            </section>

            {/* Receipts Section */}
            <section className="rounded-xl border border-[#1C2028] bg-[#0C0E14] overflow-hidden">
              <div className="border-b border-[#1C2028] bg-white/[0.02] px-4 py-3 flex items-center justify-between text-xs font-semibold text-gray-300">
                <span>Settled Telegraph Requests (2 Miners · Base Sepolia Chain ID 84532)</span>
                <span className="font-mono text-emerald-400">Total: $0.02 USDC</span>
              </div>
              <div className="divide-y divide-[#1C2028]">
                {/* Transit Miner Receipt */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">1. Transit Telemetry Check</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-gray-300">
                        {claim.receipts.transitMiner.intent}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          claim.receipts.transitMiner.mode === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {claim.receipts.transitMiner.mode}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-400">
                      Miner: <strong className="text-gray-200">{claim.receipts.transitMiner.minerName}</strong> · Rank: <strong className="text-blue-400">#{claim.receipts.transitMiner.networkRank}</strong>
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-gray-500">
                      Tx: <span className="text-gray-400">{claim.receipts.transitMiner.txHash}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">${claim.receipts.transitMiner.costUsd.toFixed(2)} USDC</span>
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

                {/* Weather Miner Receipt */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">2. Weather Disruption Screening</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-gray-300">
                        {claim.receipts.weatherMiner.intent}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          claim.receipts.weatherMiner.mode === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {claim.receipts.weatherMiner.mode}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-400">
                      Miner: <strong className="text-gray-200">{claim.receipts.weatherMiner.minerName}</strong> · Rank: <strong className="text-blue-400">#{claim.receipts.weatherMiner.networkRank}</strong>
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-gray-500">
                      Tx: <span className="text-gray-400">{claim.receipts.weatherMiner.txHash}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">${claim.receipts.weatherMiner.costUsd.toFixed(2)} USDC</span>
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
            </section>

            {/* Generated Claim Draft */}
            <section className="rounded-xl border border-[#1C2028] bg-[#0A0C10] p-4">
              <div className="flex items-center justify-between mb-3 border-b border-[#1C2028] pb-2">
                <span className="text-xs font-semibold text-gray-300">Statutory Passenger Claim Draft</span>
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
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <Download className="h-3 w-3" /> Download .txt
                  </button>
                </div>
              </div>
              <pre className="font-mono text-[11px] text-gray-300 bg-[#060709] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-[#141720]">
                {claim.draftClaimLetter}
              </pre>
            </section>
          </div>
        )}
      </main>

      {/* The Receipt Box Modal */}
      <TheReceiptBox isOpen={receiptBoxOpen} onClose={() => setReceiptBoxOpen(false)} />
    </div>
  );
}
