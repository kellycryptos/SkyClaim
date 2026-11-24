"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneLogo } from "@/components/PaperPlaneLogo";
import {
  Send,
  FileText,
  Cpu,
  Menu,
  X,
  Activity,
  HelpCircle,
  Map,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface HeaderProps {
  engineMode: "consumer" | "solana";
  setEngineMode: (mode: "consumer" | "solana") => void;
  onOpenReceiptBox: () => void;
  onOpenTelegram: () => void;
  onOpenApiDocs: () => void;
  onOpenRoadmap: () => void;
  onOpenFaq: () => void;
  onScrollToLedger: () => void;
}

export function Header({
  engineMode,
  setEngineMode,
  onOpenReceiptBox,
  onOpenTelegram,
  onOpenApiDocs,
  onOpenRoadmap,
  onOpenFaq,
  onScrollToLedger,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleModeChange(mode: "consumer" | "solana") {
    setEngineMode(mode);
    setMobileMenuOpen(false);
  }

  function handleScrollLedgerClick() {
    setEngineMode("consumer");
    setMobileMenuOpen(false);
    setTimeout(() => {
      onScrollToLedger();
    }, 100);
  }

  return (
    <header className="sticky top-0 z-40 bg-[#070B14]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      {/* Top Primary Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand lockup */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <PaperPlaneLogo size={28} className="sm:w-[32px] sm:h-[32px]" />
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-none font-sans">
              SkyClaim
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Base × Solana</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>
        </div>

        {/* Center: Desktop Segmented Switcher (Visible on md+ screens) */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium relative">
          <button
            onClick={() => handleModeChange("consumer")}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 z-10 ${
              engineMode === "consumer"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {engineMode === "consumer" && (
              <motion.div
                layoutId="desktopActiveTabIndicator"
                className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span>✈️ Flight Shield</span>
          </button>

          <button
            onClick={() => handleModeChange("solana")}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 z-10 ${
              engineMode === "solana"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {engineMode === "solana" && (
              <motion.div
                layoutId="desktopActiveTabIndicator"
                className="absolute inset-0 rounded-lg bg-purple-600 shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>🏛️ Institutional</span>
          </button>

          <button
            onClick={handleScrollLedgerClick}
            className="px-3.5 py-1.5 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer flex items-center gap-1.5 z-10"
          >
            <Activity className="h-3.5 w-3.5 text-blue-400" />
            <span>Activity</span>
          </button>
        </div>

        {/* Right: Quick Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Receipt Box CTA */}
          <button
            onClick={onOpenReceiptBox}
            className="h-8 sm:h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-xs font-semibold text-blue-300 transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] cursor-pointer"
            title="Open Sponsor Receipt Box Matrix"
          >
            <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Receipt Box</span>
            <span className="sm:hidden">Receipts</span>
          </button>

          {/* Telegram Bot Action */}
          <a
            href="https://t.me/SkyClaimprobot"
            target="_blank"
            rel="noreferrer"
            className="h-8 sm:h-9 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 transition cursor-pointer"
            title="Open Telegram Bot (@SkyClaimprobot)"
          >
            <Send className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Bot</span>
          </a>

          {/* API Docs Button (Desktop) */}
          <button
            onClick={onOpenApiDocs}
            className="h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer hidden lg:flex border border-transparent hover:border-white/[0.06]"
            title="API & Protocol Documentation"
          >
            <Cpu className="h-4 w-4" />
          </button>

          {/* Mobile Menu Toggle Button (Visible on mobile/tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] transition cursor-pointer ml-0.5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-slate-200" />
            ) : (
              <Menu className="h-4 w-4 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Second Row on Mobile: Dedicated 2-Column Segmented Mode Switcher */}
      <div className="md:hidden px-3.5 pb-2.5 pt-0.5">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium relative">
          <button
            onClick={() => handleModeChange("consumer")}
            className={`relative py-2 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 z-10 ${
              engineMode === "consumer"
                ? "text-white font-bold"
                : "text-slate-400 hover:text-white font-medium"
            }`}
          >
            {engineMode === "consumer" && (
              <motion.div
                layoutId="mobileActiveTabIndicator"
                className="absolute inset-0 rounded-lg bg-blue-600 shadow-md shadow-blue-600/30 -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="truncate">✈️ Flight Shield</span>
          </button>

          <button
            onClick={() => handleModeChange("solana")}
            className={`relative py-2 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 z-10 ${
              engineMode === "solana"
                ? "text-white font-bold"
                : "text-slate-400 hover:text-white font-medium"
            }`}
          >
            {engineMode === "solana" && (
              <motion.div
                layoutId="mobileActiveTabIndicator"
                className="absolute inset-0 rounded-lg bg-purple-600 shadow-md shadow-purple-600/30 -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <span className="truncate">🏛️ Institutional</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/[0.08] bg-[#0A0F1D]/95 backdrop-blur-2xl px-4 py-3 space-y-2 overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 gap-1 text-xs font-mono">
              <button
                onClick={handleScrollLedgerClick}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Public Disruption Ledger</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">Live</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReceiptBox();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Receipt Box &amp; Verifications</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Track 03
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTelegram();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Telegram Autonomous Bot</span>
                </div>
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                  @SkyClaimprobot
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApiDocs();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>API &amp; Protocol Endpoints</span>
                </div>
                <span className="text-[10px] text-slate-500">REST</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoadmap();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Map className="w-4 h-4 text-purple-400" />
                  <span>Builder Roadmap &amp; Milestones</span>
                </div>
                <span className="text-[10px] text-slate-500">v1.0</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFaq();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>FAQ &amp; Statutory Compensation</span>
                </div>
                <span className="text-[10px] text-slate-500">UK/EU261</span>
              </button>
            </div>

            {/* Network Infrastructure Badge */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between px-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Base Sepolia (Chain 84532)</span>
              </div>
              <span className="text-emerald-400">x402 Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}