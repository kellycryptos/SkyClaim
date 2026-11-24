"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SOLANA_SETTLEMENT_PRESETS,
  INITIAL_SOLANA_LEDGER,
  verifySolanaSettlement,
} from "@/lib/solana-settlement";
import {
  InstitutionalSettlementResult,
  SettlementPreset,
} from "@/lib/solana-types";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Lock,
  Building2,
  DollarSign,
  FileCheck,
  Cpu,
  RefreshCw,
} from "lucide-react";

export function SolanaInstitutionalView() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("SETTLE-USD-250K");
  const [result, setResult] = useState<InstitutionalSettlementResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);
  const [activeLedger, setActiveLedger] = useState(INITIAL_SOLANA_LEDGER);

  // Auto-load preset on mount or selection
  React.useEffect(() => {
    loadPreset(selectedPresetId);
  }, [selectedPresetId]);

  async function loadPreset(presetId: string) {
    setLoading(true);
    try {
      const res = await verifySolanaSettlement(presetId, true);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyDossier() {
    if (!result) return;
    navigator.clipboard.writeText(result.settlementDossier);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  }

  function handleDownloadDossier() {
    if (!result) return;
    const blob = new Blob([result.settlementDossier], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.settlementId}-compliance-dossier.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Enterprise Feature · Pre-Settlement Assurance</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          SolSettle · Institutional Settlement Assurance
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Pre-authorization compliance firewall for high-value Solana settlements. Telegraph specialized miners independently verify counterparty legal identity, OFAC/EU sanctions, and Living RWA bank reserves before execution.
        </p>
      </div>

      {/* Preset Scenario Selector */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Deterministic Reviewer Acceptance Cases</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">1-Click Zero-Config Reviewer Tests</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SOLANA_SETTLEMENT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/5"
                    : "bg-[#090E1A] border-[#1E293B] hover:border-slate-700 hover:bg-[#0D1527]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#111827] text-slate-300 border border-[#1E293B]">
                      {preset.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        preset.expectedVerdict === "SETTLEMENT_AUTHORIZED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {preset.expectedVerdict === "SETTLEMENT_AUTHORIZED" ? "CLEAN" : "HALTED"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{preset.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>${preset.amountUsd.toLocaleString()} {preset.tokenSymbol}</span>
                  <span className="text-blue-400">Click to evaluate →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Execution Result Display */}
      {loading ? (
        <div className="p-12 text-center bg-[#0B1120] border border-[#1E293B] rounded-2xl space-y-3">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">
            Querying Telegraph specialized compliance & RWA miners...
          </p>
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
              result.circuitBreakerEngaged
                ? "bg-red-950/30 border-red-500/30 text-red-100"
                : "bg-emerald-950/30 border-emerald-500/30 text-emerald-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  result.circuitBreakerEngaged ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {result.circuitBreakerEngaged ? (
                  <ShieldAlert className="w-8 h-8" />
                ) : (
                  <ShieldCheck className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      result.circuitBreakerEngaged
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {result.verdict}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111827] text-slate-300 border border-[#1E293B]">
                    Badge: {result.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {result.verdictTitle}
                </h2>
                <p className="text-xs text-slate-300">
                  Target Amount: <span className="font-semibold text-white">${result.transferAmountUsd.toLocaleString()} {result.tokenSymbol}</span> · Counterparty: <span className="font-semibold text-white">{result.counterparty.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <button
                onClick={handleCopyDossier}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111827] hover:bg-[#161F33] border border-[#1E293B] text-xs font-medium text-slate-200 transition cursor-pointer"
              >
                {copiedDossier ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copiedDossier ? "Copied" : "Copy Dossier"}</span>
              </button>
              <button
                onClick={handleDownloadDossier}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          {/* Grid: Counterparty & RWA Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Counterparty Box */}
            <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Counterparty Due Diligence
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    result.counterparty.sanctionsStatus === "CLEAN"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  Sanctions: {result.counterparty.sanctionsStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                  <span className="text-slate-400">Legal Name</span>
                  <span className="font-semibold text-white">{result.counterparty.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                  <span className="text-slate-400">Legal Entity Identifier (LEI)</span>
                  <span className="font-mono text-slate-200">{result.counterparty.lei}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                  <span className="text-slate-400">Jurisdiction</span>
                  <span className="text-slate-200">{result.counterparty.jurisdiction}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                  <span className="text-slate-400">Solana Address</span>
                  <span className="font-mono text-slate-300 truncate max-w-[180px] sm:max-w-[220px]">
                    {result.counterparty.solanaAddress}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">KYB / Compliance Risk Score</span>
                  <span
                    className={`font-mono font-semibold ${
                      result.counterparty.riskScore < 20
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.counterparty.riskScore} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Living RWA Profile or Secondary Cross-Check */}
            <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    {result.rwaProfile ? "Living RWA Off-Chain Health" : "Secondary Registry Cross-Check"}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                  {result.secondaryCheck.status}
                </span>
              </div>

              {result.rwaProfile ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">Token & Issuer</span>
                    <span className="font-semibold text-white">
                      {result.rwaProfile.tokenSymbol} ({result.rwaProfile.issuer})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">On-Chain Supply</span>
                    <span className="font-mono text-slate-200">
                      ${result.rwaProfile.onChainSupply.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">Verified Bank Reserves</span>
                    <span className="font-mono text-slate-200">
                      ${result.rwaProfile.offChainReservesUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">Custodian Bank</span>
                    <span className="text-slate-200">{result.rwaProfile.custodianBank}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Attestation Status</span>
                    <span
                      className={`font-mono font-semibold ${
                        result.rwaProfile.attestationStatus === "FULLY_BACKED"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {result.rwaProfile.attestationStatus}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">Registry Source</span>
                    <span className="font-semibold text-white">{result.secondaryCheck.registrySource}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/40">
                    <span className="text-slate-400">Matched Registry Identifier</span>
                    <span className="font-mono text-slate-200">{result.secondaryCheck.matchedId}</span>
                  </div>
                  <div className="py-2 text-slate-300 leading-relaxed bg-[#090E1A] p-2.5 rounded-lg border border-[#1E293B]/60 text-[11px]">
                    {result.secondaryCheck.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Telegraph Telemetry Receipts Table */}
          <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  Telegraph Protocol Verification Telemetry (x402 / Pay.sh)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Cost: $0.01 USDC / check</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E293B] text-[10px] font-mono text-slate-400 uppercase">
                    <th className="py-2 px-3">Intent</th>
                    <th className="py-2 px-3">Miner</th>
                    <th className="py-2 px-3">Payment Rail</th>
                    <th className="py-2 px-3">Signal Hash</th>
                    <th className="py-2 px-3">Findings</th>
                    <th className="py-2 px-3">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60 font-mono text-[11px]">
                  {result.telegraphReceipts.map((rcpt, idx) => (
                    <tr key={idx} className="hover:bg-[#0D1527] transition">
                      <td className="py-2.5 px-3 font-semibold text-blue-400">{rcpt.intent}</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {rcpt.minerName} <span className="text-slate-500 text-[10px]">({rcpt.minerId})</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{rcpt.paymentRail}</td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[120px]">{rcpt.signalHash}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans text-xs max-w-xs">{rcpt.findingsSummary}</td>
                      <td className="py-2.5 px-3 text-blue-400">
                        {rcpt.explorerUrl ? (
                          <a
                            href={rcpt.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">Fixture</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
