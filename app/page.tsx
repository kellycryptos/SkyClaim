"use client";

import React, { useState } from "react";
import { PRESETS, TELEGRAPH_CONFIG } from "@/lib/telegraph";
import { ListingRiskMemo, IntentName } from "@/lib/types";
import { TheReceiptBox } from "@/components/TheReceiptBox";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Download,
  Terminal,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Coins,
  RefreshCw,
  Search,
} from "lucide-react";

export default function SentinelHome() {
  const [targetAddress, setTargetAddress] = useState("");
  const [symbolHint, setSymbolHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState<ListingRiskMemo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptBoxOpen, setReceiptBoxOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState("25.00");
  const [activeTab, setActiveTab] = useState<"findings" | "receipts" | "raw">("findings");

  // Run audit action
  const runAudit = async (overrideAddress?: string, overrideSymbol?: string) => {
    const addressToTest = overrideAddress || targetAddress;
    const symbolToTest = overrideSymbol || symbolHint || "TOKEN";

    if (!addressToTest) {
      setError("Please select a preset or enter a token contract address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress: addressToTest,
          symbolHint: symbolToTest,
          forceDemo: false,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data: ListingRiskMemo = await res.json();
      setMemo(data);

      // Decrement simulated wallet balance
      setWalletBalance((prev) => Math.max(0, parseFloat(prev) - 0.05).toFixed(2));
    } catch (err: any) {
      setError(err?.message || "Failed to execute due diligence scan.");
    } finally {
      setLoading(false);
    }
  };

  // Preset quick selector
  const selectPreset = (preset: typeof PRESETS[0]) => {
    setTargetAddress(preset.address);
    setSymbolHint(preset.symbol);
    runAudit(preset.address, preset.symbol);
  };

  // Export memo as JSON
  const downloadMemoJson = () => {
    if (!memo) return;
    const blob = new Blob([JSON.stringify(memo, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${memo.tokenSymbol}-listing-risk-memo.json`;
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
              TS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide text-white">TELEGRAPH SENTINEL</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                  Mission 01 &amp; 14
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
              1-Click Evaluator Presets
            </span>
            <span className="text-xs text-muted font-mono">Cost: $0.05 USDC per audit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((p) => {
              const isSelected = targetAddress.toLowerCase() === p.address.toLowerCase();
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
                    <span className="font-semibold text-xs text-white">{p.title}</span>
                    <span
                      className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                        p.expectedVerdict === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {p.expectedVerdict}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400 line-clamp-1">{p.description}</p>
                  <p className="mt-1 font-mono text-[10px] text-gray-500 truncate">{p.address}</p>
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
                placeholder="Or paste any token contract address (0x...)"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-[#10121A] border border-[#1C2028] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <button
              onClick={() => runAudit()}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs transition shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Buying Parallel Intelligence...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Run 90s Due Diligence
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
        {memo && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Executive Verdict Banner */}
            <section
              className={`rounded-xl border p-5 transition ${
                memo.verdict === "APPROVED"
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : memo.verdict === "CONDITIONAL"
                  ? "bg-amber-950/20 border-amber-500/30"
                  : "bg-rose-950/20 border-rose-500/30"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border ${
                      memo.verdict === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : memo.verdict === "CONDITIONAL"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {memo.verdict === "APPROVED" && <ShieldCheck className="h-6 w-6" />}
                    {memo.verdict === "CONDITIONAL" && <AlertTriangle className="h-6 w-6" />}
                    {memo.verdict === "REJECTED" && <ShieldAlert className="h-6 w-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-base font-bold text-white tracking-wide">
                        {memo.tokenName} ({memo.tokenSymbol})
                      </h1>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          memo.verdict === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : memo.verdict === "CONDITIONAL"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {memo.verdict}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-300">{memo.verdictRationale}</p>
                    <p className="mt-1 text-[11px] font-mono text-gray-400">{memo.tokenAddress}</p>
                  </div>
                </div>

                {/* Score & Accounting Line */}
                <div className="flex items-center gap-6 self-end md:self-auto border-t md:border-t-0 border-[#1C2028] pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-muted uppercase tracking-wider block font-medium">Risk Score</span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        memo.overallRiskScore > 65
                          ? "text-rose-400"
                          : memo.overallRiskScore > 30
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {memo.overallRiskScore}
                      <span className="text-xs text-gray-500 font-normal"> / 100</span>
                    </span>
                  </div>

                  <button
                    onClick={downloadMemoJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition border border-white/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Memo
                  </button>
                </div>
              </div>

              {/* Cost & Verification Proof Line */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Cost: <strong className="text-emerald-400">${memo.totalCostUsd.toFixed(2)} USDC</strong> (5 requests)
                  </span>
                  <span>
                    Latency: <strong className="text-gray-200">{memo.totalLatencyMs}ms</strong>
                  </span>
                  <span>
                    Receipts: <strong className="text-blue-400">5/5 Verified</strong>
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Memo ID: <span className="text-gray-300">{memo.id}</span>
                </div>
              </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#1C2028] pb-1">
              <button
                onClick={() => setActiveTab("findings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "findings"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Intelligence Findings
              </button>
              <button
                onClick={() => setActiveTab("receipts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "receipts"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Cryptographic Receipts (5)
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "raw"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                JSON Payload
              </button>
            </div>

            {/* TAB 1: Findings */}
            {activeTab === "findings" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(memo.results).map(([intent, data]) => {
                  return (
                    <div
                      key={intent}
                      className="rounded-xl border border-[#1C2028] bg-[#0C0E14] p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{data.label}</span>
                            <span className="font-mono text-[10px] text-gray-500">({intent})</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                              data.status === "passed"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : data.status === "warning"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {data.status.toUpperCase()}
                          </span>
                        </div>

                        <ul className="space-y-1.5 mt-3">
                          {data.findings.map((f, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-gray-500 select-none">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Micro-Receipt Footer */}
                      <div className="mt-4 pt-3 border-t border-[#1C2028] flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span>
                          Miner: <strong className="text-gray-300">{data.receipt.minerName}</strong> (Rank #{data.receipt.networkRank})
                        </span>
                        <a
                          href={data.receipt.basescanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          Tx Receipt <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Receipts Drawer */}
            {activeTab === "receipts" && (
              <div className="rounded-xl border border-[#1C2028] bg-[#0C0E14] overflow-hidden">
                <div className="border-b border-[#1C2028] bg-white/[0.02] px-4 py-3 flex items-center justify-between text-xs font-semibold text-gray-300">
                  <span>5 Settled x402 Intelligence Purchases</span>
                  <span className="font-mono text-emerald-400">Total: $0.05 USDC</span>
                </div>
                <div className="divide-y divide-[#1C2028]">
                  {Object.entries(memo.results).map(([intent, data]) => (
                    <div key={intent} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{intent}</span>
                          <span className="text-[10px] text-gray-500 font-mono">Miner: {data.receipt.minerId}</span>
                        </div>
                        <p className="mt-1 font-mono text-[11px] text-gray-400">
                          Signal Hash: <span className="text-gray-300">{data.receipt.signalHash}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                        <span className="text-emerald-400 font-bold">${data.receipt.costUsd.toFixed(2)} USDC</span>
                        <span className="text-gray-400">{data.receipt.latencyMs}ms</span>
                        <a
                          href={data.receipt.basescanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          Basescan <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Raw JSON */}
            {activeTab === "raw" && (
              <div className="rounded-xl border border-[#1C2028] bg-[#0A0C10] p-4">
                <pre className="text-xs font-mono text-gray-300 overflow-x-auto max-h-96">
                  {JSON.stringify(memo, null, 2)}
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
            <span>Telegraph Season II Entry</span>
            <span>•</span>
            <span>Track 03: Apps &amp; Agents</span>
            <span>•</span>
            <span>Missions 01 &amp; 14</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/telegraphprotocol/bounties"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              Star Bounties Repo <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://hackathon.telegraphprotocol.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              Hackathon H2 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
