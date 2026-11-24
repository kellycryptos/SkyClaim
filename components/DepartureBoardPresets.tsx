"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import type { PresetScenario } from "@/lib/skyclaim-types";

interface DepartureBoardPresetsProps {
  presets: PresetScenario[];
  activePreset: string;
  onSelectPreset: (preset: PresetScenario) => void;
}

export function DepartureBoardPresets({
  presets,
  activePreset,
  onSelectPreset,
}: DepartureBoardPresetsProps) {
  return (
    <div className="w-full rounded-2xl bg-[#0A0F1F] border border-white/[0.1] overflow-hidden shadow-xl">
      {/* Airport Departure Board Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white/[0.02] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Plane className="h-3.5 w-3.5 text-cyan-400 rotate-45" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
            DEPARTURE BOARD · BENCHMARK CASES
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          1-Click Reviewer Presets
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.06]">
        {presets.map((preset) => {
          const isActive = activePreset === preset.flightNumber;
          const status =
            preset.flightNumber === "BA178"
              ? "CLEARED"
              : preset.flightNumber === "DL401"
              ? "DENIED"
              : "HOLD";

          const statusColor =
            status === "CLEARED"
              ? "bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30"
              : status === "DENIED"
              ? "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30"
              : "bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30";

          const route =
            preset.flightNumber === "BA178"
              ? "JFK ➔ LHR"
              : preset.flightNumber === "DL401"
              ? "JFK ➔ CDG"
              : "ORD ➔ CDG";

          const summary =
            preset.flightNumber === "BA178"
              ? "+3h 42m · £260–£520 UK261 Eligible"
              : preset.flightNumber === "DL401"
              ? "+3h 30m · Ex-US Non-EU Metal (€0)"
              : "+4h 10m · Art. 5(3) Weather Risk (€600)";

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectPreset(preset)}
              className={`w-full px-4 sm:px-6 py-3.5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition cursor-pointer ${
                isActive
                  ? "bg-cyan-500/[0.08] border-l-4 border-l-cyan-400"
                  : "border-l-4 border-l-transparent hover:border-l-white/20"
              }`}
            >
              {/* Left: Code, Route, Airline */}
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="font-mono font-extrabold text-base text-white tracking-wider w-16">
                  {preset.flightNumber}
                </span>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
                  <span className="font-semibold text-white">{route}</span>
                  <span className="text-slate-500 hidden md:inline">·</span>
                  <span className="text-slate-400 hidden md:inline">{preset.carrier}</span>
                </div>
              </div>

              {/* Right: Summary & Status Chip */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  {summary}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border shrink-0 ${statusColor}`}
                >
                  {status}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
