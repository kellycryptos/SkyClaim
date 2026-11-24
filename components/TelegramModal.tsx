"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, Terminal, ExternalLink, Bot, CheckCircle2 } from "lucide-react";

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TelegramModal({ isOpen, onClose }: TelegramModalProps) {
  const [copiedSim, setCopiedSim] = useState(false);

  function handleCopySim() {
    navigator.clipboard.writeText("npm run bot:sim");
    setCopiedSim(true);
    setTimeout(() => setCopiedSim(false), 2000);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0E1526] p-5 sm:p-6 shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>SkyClaim Telegram Bot</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                      LIVE &amp; SIMULATOR
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Multi-surface disruption screening directly inside chat
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions & Live Link */}
            <div className="space-y-3">
              <a
                href="https://t.me/SkyClaimprobot"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-white transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5">
                      <span>Launch @SkyClaimprobot on Telegram</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Send any flight code (e.g., &quot;BA178&quot; or &quot;/claim BA178&quot;) for instant EU261 verdict
                    </div>
                  </div>
                </div>
              </a>

              {/* Local Simulator Command */}
              <div className="rounded-xl bg-[#060A13] border border-white/[0.08] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Run Interactive CLI Simulator</span>
                  </div>
                  <button
                    onClick={handleCopySim}
                    className="flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    {copiedSim ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-200 bg-black/40 px-3 py-2 rounded-lg select-all">
                  npm run bot:sim
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instant Arrival Delay Match</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NWS Corridor Weather Query</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Draft Claim Letter Generator</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Gas Micropayment Link</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Powered by Grammy SDK &amp; Telegraph Protocol</span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}