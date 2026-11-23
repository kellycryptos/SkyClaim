"use client";

import React from "react";
import { PaperPlaneLogo } from "@/components/PaperPlaneLogo";
import { X, Code, Terminal, ExternalLink, ShieldAlert, Cpu } from "lucide-react";

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiDocsModal({ isOpen, onClose }: ApiDocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-xl border border-[#1E293B] bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <PaperPlaneLogo size={36} />
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC] tracking-tight font-mono">
                SkyClaim API &amp; Telegraph Protocol Docs
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Deterministic EU261 disruption screening and x402 on-chain telemetry endpoints
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

        <div className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Endpoint 1 */}
          <div className="rounded-xl border border-[#1E293B] bg-[#161F33] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-[11px]">
                  POST
                </span>
                <code className="text-[#F8FAFC] font-mono font-semibold text-xs">/api/claim</code>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">Rate Limit: 15 req/min</span>
            </div>
            <p className="text-[#94A3B8] text-[11px]">
              Verifies flight disruption status against EU261/UK261 criteria and purchases departure weather intelligence if arrival delay &ge; 3 hours.
            </p>
            <div className="mt-2 bg-[#0B1120] p-3 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300">
              <div className="text-slate-500">// Request Payload</div>
              {`{ "flightNumber": "BA178", "flightDate": "2026-11-22" }`}
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="rounded-xl border border-[#1E293B] bg-[#161F33] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                  GET
                </span>
                <code className="text-[#F8FAFC] font-mono font-semibold text-xs">/api/health</code>
              </div>
              <span className="text-emerald-400 text-[11px] font-mono font-bold">Status: 200 OK</span>
            </div>
            <p className="text-[#94A3B8] text-[11px]">
              Returns node health, chain connection (Base Sepolia), and active dual-miner status.
            </p>
          </div>

          {/* Protocol Integration Callout */}
          <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-white font-semibold">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>x402 Micropayment Rail (Base Sepolia)</span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              When querying live departure airport weather, SkyClaim requests intent <code className="text-white bg-[#161F33] px-1 py-0.5 rounded">TRAVEL_TRANSIT_LOCK_GENERAL</code>. If challenge HTTP 402 is returned, it signs an EIP-712 payment header with Circle USDC on Base Sepolia (<code className="text-white bg-[#161F33] px-1 py-0.5 rounded">0x036CbD...</code>) capped at $0.05 per request.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end border-t border-[#1E293B] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Close Docs
          </button>
        </div>
      </div>
    </div>
  );
}
