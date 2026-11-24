"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Cpu, ShieldCheck, ArrowRight, Sparkles, Terminal, Code } from "lucide-react";

interface BuilderRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuilderRoadmapModal({ isOpen, onClose }: BuilderRoadmapModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#090E1A] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100"
          >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Core Engineering
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Focused Builder Roadmap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              From Autonomous Consumer Verification to Specialized Telegraph Miners and Solana Institutional Settlement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roadmap Stages */}
        <div className="py-6 space-y-8">
          {/* Phase 1: Shipped & Operational */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-emerald-400 font-mono">
                Phase 1: Production Live · Dual-Engine Protocol (Current Release)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">SkyClaim Consumer Disruption</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Shipped</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Same-day US transatlantic flight disruption screening under UK261/EU261. Operating carrier metal enforcement, live Telegraph weather telemetry, and NOAA METAR secondary cross-checking.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">SolSettle Institutional Assurance</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Shipped</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-authorization compliance firewall for high-value Solana settlements. Independent counterparty LEI resolution, real-time OFAC SDN sanction interception, and Living RWA bank reserve attestation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">6 Deterministic Acceptance Test Vectors</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">100% Green</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rigorous CI/CD sandbox resilience with zero `.env` required. 3 consumer flight presets (BA178, DL401, AF112) + 3 institutional Solana presets (S1, S2, S3).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Dual-Rail Micropayments</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Verified</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real on-chain EIP-712 x402 purchases settled on Base Sepolia with Circle USDC + Pay.sh / Solana SVM payment adapter for agent commerce.
                </p>
              </div>
            </div>
          </div>

          {/* Phase 2: Specialized Telegraph Miners */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-400 font-mono">
                Phase 2: Custom Telegraph Miners & Specialized Subnets (Q1 2027)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-8">
              <div className="p-4 rounded-xl bg-[#0D1527] border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">miner-solana-sanctions</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Subnet Build</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Specialized Telegraph miner indexing live OFAC SDN, EU Consolidated, and UK HMT sanctions updates with sub-minute graph entity matching for Solana wallets and beneficial owners.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">miner-rwa-reserves</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Subnet Build</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Living Asset miner parsing trustee custodial bank balances, SEC Form 8-K / 10-Q disclosures, and UCC liens in real-time for Solana RWA issuers (Ondo USDY, Securitize, Credix).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">evaluator-settlement-sla</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Evaluator Rail</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Independent evaluator node measuring miner response latency, confidence calibration, and truth consensus across multi-party compliance signals before rewarding payouts.
                </p>
              </div>
            </div>
          </div>

          {/* Phase 3: Institutional Integrations & Squads */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-purple-400 font-mono">
                Phase 3: Solana Ecosystem & Squads Institutional Hooks (Q2 2027)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
              <div className="p-4 rounded-xl bg-[#0D1527] border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Squads v4 Multisig App Extension</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">Ecosystem Hook</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct plugin for Squads v4 institutional multisig. SolSettle intercepts staged transactions and blocks threshold signatures until Telegraph compliance proof is verified.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Token-2022 Transfer Hook Program</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">On-Chain Enforcer</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Solana Token-2022 transfer hook program that enforces valid, unexpired Telegraph verification signal hashes directly inside the token transfer execution on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Reproduce test suites: <code className="text-slate-200 bg-[#111827] px-1.5 py-0.5 rounded font-mono">npm test</code></span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
          >
            Close Roadmap
          </button>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
