"use client";

import React, { useState } from "react";
import { SKYCLAIM_PRESETS, SKYCLAIM_PUBLIC_LEDGER } from "@/lib/skyclaim-consensus";
import { SkyClaimResult, PresetScenario } from "@/lib/skyclaim-types";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import {
  Plane,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldAlert,
  CloudSun,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function SkyClaimHome() {
  const [queryInput, setQueryInput] = useState("BA178");
  const [loading, setLoading] = useState(false);
  const [claim, setClaim] = useState<SkyClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const runVerification = async (target?: string) => {
    const inputToTest = (target || queryInput).trim();
    if (!inputToTest) {
      setError("Please select a preset case or enter a flight/airport code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightNumber: inputToTest,
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

  const selectPreset = (preset: PresetScenario) => {
    setQueryInput(preset.flightNumber);
    runVerification(preset.flightNumber);
  };

  const downloadClaimPackage = () => {
    if (!claim) return;
    const blob = new Blob([claim.draftClaimLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${claim.flight.flightNumber}-Disruption-Claim.txt`;
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
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#1A1F2E] bg-[#0A0D15]/95 backdrop-blur px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Plane className="h-4 w-4 transform -rotate-45" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm tracking-wider text-white font-mono uppercase">SkyClaim</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Mission 15 · Consumer Auto
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F1420] border border-[#1E2538] text-[11px] font-mono text-gray-300">
              <span className="text-emerald-400">Cap: $0.05</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">Daily: $5.00</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Base Sepolia (84532)
            </div>

            <button
              onClick={() => setReceiptBoxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              Receipt Box
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-6 py-6 flex-1 space-y-6">
        {/* Positioning Banner */}
        <div className="rounded-xl border border-blue-500/30 bg-[#0B101C] p-4 text-xs sm:text-sm text-gray-300 leading-relaxed shadow-lg">
          SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it buys live weather alerts for the departure airport through Telegraph. If a severe alert is active, it flags the claim as high risk. Otherwise it drafts an EU261/UK261 claim with the receipt attached. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.
        </div>

        {/* 1-Click Reviewer Presets */}
        <section className="bg-[#0B0E17] border border-[#1B2132] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>Reviewer Presets</span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">Testnet Micropayment: $0.01 USDC</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SKYCLAIM_PRESETS.map((p) => {
              const isSelected = queryInput.toUpperCase() === p.flightNumber.toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p)}
                  disabled={loading}
                  className={`text-left p-4 rounded-xl border transition group ${
                    isSelected
                      ? "border-blue-500/80 bg-blue-500/10 text-white"
                      : "border-[#1E2436] bg-[#0E121E] hover:border-gray-600 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-white group-hover:text-blue-400 transition">
                      {p.flightNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        p.caseNumber === 1
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : p.caseNumber === 2
                          ? "bg-gray-500/15 text-gray-400 border-gray-500/30"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {p.caseNumber === 1 ? "CLAIM VIABLE" : p.caseNumber === 2 ? "< 3H DELAY" : "WEATHER RISK"}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-xs text-gray-200">{p.title}</p>
                  <p className="mt-1 text-[11px] text-gray-400 leading-normal">{p.route}</p>
                  
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gray-400">Flight: <strong className="text-gray-300">FIXTURE</strong></span>
                    <span className="text-gray-400">
                      Weather:{" "}
                      <strong className={p.caseNumber === 1 ? "text-emerald-400" : p.caseNumber === 3 ? "text-amber-400" : "text-gray-400"}>
                        {p.caseNumber === 1 ? "LIVE" : p.caseNumber === 3 ? "RECORDED" : "$0 SPENT"}
                      </strong>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom US Airport Search */}
          <div className="pt-3 border-t border-[#1B2132] flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Or test live weather alerts at any US departure airport (e.g. JFK, ORD, BOS, MIA, SFO)"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full bg-[#0E121E] border border-[#1E2436] rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition uppercase"
              />
            </div>
            <button
              onClick={() => runVerification()}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs transition shrink-0"
            >
              {loading ? "Checking Weather ($0.01)..." : "Run Disruption Check"}
            </button>
          </div>
        </section>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {claim && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Verdict Card */}
            <div
              className={`rounded-xl border p-5 transition ${
                claim.verdict === "CLAIM_LOOKS_VIABLE"
                  ? "bg-[#091512] border-emerald-500/40"
                  : claim.verdict === "DELAY_TOO_SHORT"
                  ? "bg-[#0E121A] border-gray-700/50"
                  : "bg-[#18110D] border-amber-500/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  {claim.verdict === "CLAIM_LOOKS_VIABLE" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                  {claim.verdict === "DELAY_TOO_SHORT" && <Clock className="h-5 w-5 text-gray-400 shrink-0" />}
                  {claim.verdict === "WEATHER_RISK" && <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />}
                  <div>
                    <h2 className="text-sm font-bold font-mono text-white tracking-wide">{claim.caseTitle}</h2>
                    <span className="text-[11px] text-gray-400 font-mono">{claim.recommendationText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-black/40 border border-white/10 text-gray-200">
                    {claim.eligibleCompensation}
                  </span>
                </div>
              </div>

              {/* Exact Case Copy */}
              <div className="mt-4 p-3.5 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-gray-200 leading-relaxed">
                {claim.caseCopy}
              </div>

              {/* Telemetry & Weather Breakdown */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Flight Data Box */}
                <div className="p-3.5 rounded-lg bg-[#0E121E] border border-[#1E2436] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <Plane className="h-3.5 w-3.5 text-blue-400" /> Flight Telemetry
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                      {claim.flight.tag}
                    </span>
                  </div>
                  <div className="text-gray-300 font-mono text-[11px] space-y-1">
                    <p>Flight: <strong className="text-white">{claim.flight.flightNumber}</strong> ({claim.flight.carrier})</p>
                    <p>Route: <span className="text-gray-200">{claim.flight.origin} → {claim.flight.destination}</span> ({claim.flight.distanceKm.toLocaleString()} km)</p>
                    <p>Departure: <span className="text-gray-200">Scheduled {claim.flight.scheduledDeparture} · Actual {claim.flight.actualDeparture}</span></p>
                    <p>Delay at Departure: <strong className={claim.flight.delayMinutes >= 180 ? "text-emerald-400" : "text-gray-400"}>+{Math.floor(claim.flight.delayMinutes / 60)}h {claim.flight.delayMinutes % 60}m</strong></p>
                  </div>
                </div>

                {/* Weather Data Box */}
                <div className="p-3.5 rounded-lg bg-[#0E121E] border border-[#1E2436] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <CloudSun className="h-3.5 w-3.5 text-cyan-400" /> Telegraph Weather Intelligence
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                        claim.weather.tag === "LIVE"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : claim.weather.tag === "RECORDED"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {claim.weather.tag === "RECORDED" ? `RECORDED on ${claim.weather.recordedDate}` : claim.weather.tag}
                    </span>
                  </div>
                  <div className="text-gray-300 font-mono text-[11px] space-y-1">
                    <p>Departure Airport: <strong className="text-white">{claim.weather.departureAirport}</strong></p>
                    <p>Observation: <span className="text-gray-200">{claim.weather.stormDetails}</span></p>
                    <p>Authority / Miner: <span className="text-gray-300">{claim.weather.sourceAuthority}</span></p>
                    <p>
                      Cost: <strong className="text-emerald-400">${claim.totalCostUsd.toFixed(2)} USDC</strong> · Latency: <span className="text-gray-300">{claim.totalLatencyMs}ms</span>
                    </p>
                  </div>

                  {claim.receipt && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Signal Proof:</span>
                      <a
                        href={claim.receipt.basescanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                      >
                        {claim.receipt.signalHash.slice(0, 10)}...{claim.receipt.signalHash.slice(-8)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statutory Claim Draft (shown when claim is viable) */}
            {claim.verdict === "CLAIM_LOOKS_VIABLE" && claim.draftClaimLetter && (
              <div className="rounded-xl border border-[#1E2436] bg-[#0B0E17] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2436] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                      EU261 / UK261 Statutory Claim Draft
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyClaimPackage}
                      className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/10 transition"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={downloadClaimPackage}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 font-medium transition"
                    >
                      <Download className="h-3 w-3" /> Download .txt
                    </button>
                  </div>
                </div>
                <pre className="font-mono text-[11px] text-gray-300 bg-[#06070B] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-white/5 leading-relaxed">
                  {claim.draftClaimLetter}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Public Ledger Table */}
        <section className="bg-[#0B0E17] border border-[#1B2132] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#1B2132] pb-3">
            <div>
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
                Public Testnet Activity &amp; Receipts
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">
                Verifiable Telegraph weather intelligence micropayments on Base Sepolia
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                €1,200 Recoverable
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                $0.02 USDC Spent
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1A1F2E] text-[10px] text-gray-400 uppercase">
                  <th className="py-2 px-3">Flight</th>
                  <th className="py-2 px-3">Delay</th>
                  <th className="py-2 px-3">Verdict</th>
                  <th className="py-2 px-3">Tags</th>
                  <th className="py-2 px-3">Statutory Amount</th>
                  <th className="py-2 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151926] text-gray-300">
                {SKYCLAIM_PUBLIC_LEDGER.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{entry.flightNumber}</div>
                      <div className="text-[10px] text-gray-400">{entry.route} · {entry.carrier}</div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-200">{entry.delayText}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          entry.verdict === "CLAIM_LOOKS_VIABLE"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : entry.verdict === "DELAY_TOO_SHORT"
                            ? "bg-gray-500/15 text-gray-400 border-gray-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {entry.verdict.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {entry.flightTag}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            entry.weatherTag === "LIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : entry.weatherTag === "RECORDED"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}
                        >
                          {entry.weatherTag}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={entry.compensationEur > 0 ? "text-emerald-400" : "text-gray-500"}>
                        {entry.compensationEur > 0 ? `€${entry.compensationEur}` : "€0"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {entry.basescanUrl !== "#" ? (
                        <a
                          href={entry.basescanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                        >
                          Proof <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="text-gray-600">N/A ($0)</span>
                      )}
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
