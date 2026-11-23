"use client";

import React, { useState } from "react";
import { X, Send, Copy, Check, Terminal, ExternalLink, Bot, CheckCircle2 } from "lucide-react";

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TelegramModal({ isOpen, onClose }: TelegramModalProps) {
  const [copiedSim, setCopiedSim] = useState(false);

  if (!isOpen) return null;

  function handleCopySim() {
    navigator.clipboard.writeText("npm run bot:sim");
    setCopiedSim(true);
    setTimeout(() => setCopiedSim(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#1E293B] bg-[#111827] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
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
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#161F33] hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-300">
          {/* Surface A: Live Telegram Bot */}
          <div className="rounded-xl border border-[#1E293B] bg-[#161F33] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Live Telegram Bot</span>
              </div>
              <span className="text-[11px] font-mono text-blue-400 font-semibold">@SkyClaimBot</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Experience the native mobile workflow: query flights, receive statutory delay verdicts, and inspect departure corridor weather telemetry on the go.
            </p>
            <a
              href="https://t.me/SkyClaimBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer"
            >
              <span>Open @SkyClaimBot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Surface B: Zero-Config Terminal Simulator */}
          <div className="rounded-xl border border-[#1E293B] bg-[#161F33] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Instant Evaluator Simulator</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                0-CONFIG READY
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No Telegram account or bot token needed. Evaluators can run the interactive Telegram chat simulation directly in the terminal:
            </p>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0B1120] border border-[#1E293B] font-mono text-xs text-slate-200">
              <code>npm run bot:sim</code>
              <button
                onClick={handleCopySim}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans transition cursor-pointer"
              >
                {copiedSim ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supported Bot Capabilities */}
          <div className="rounded-xl border border-[#1E293B] bg-[#0B1120]/60 p-3.5 space-y-2">
            <span className="font-semibold text-white text-[11px] uppercase tracking-wider font-mono">
              Supported Commands &amp; Interactive Keys
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-slate-200">1-Click Preset Buttons:</strong> Instant evaluation of BA178, DL401, AF112.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-slate-200">Direct Flight Queries:</strong> Type any flight corridor (e.g. <code>BA178</code> or <code>/verify DL401</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-slate-200">Statutory Knowledgebase:</strong> Explains UK261/EU261 rules and codeshare metal exclusions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 text-xs text-slate-400">
          <span>Track 03: Apps &amp; Agents · Mission 15</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-200 font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
