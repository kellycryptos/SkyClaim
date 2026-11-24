"use client";

import React from "react";
import { Compass } from "lucide-react";

interface FlightTelemetryMapProps {
  origin: string;
  destination: string;
  flightNumber: string;
  distanceKm: number;
  carrier?: string;
  isLive?: boolean;
}

export function FlightTelemetryMap({
  origin = "JFK",
  destination = "LHR",
  flightNumber = "BA178",
  distanceKm = 5550,
  carrier = "British Airways",
}: FlightTelemetryMapProps) {
  // Determine coordinate points based on origin and destination
  const getCoordinates = () => {
    let x1 = 140,
      y1 = 145; // JFK default
    let x2 = 470,
      y2 = 94; // LHR default

    const o = origin.toUpperCase();
    const d = destination.toUpperCase();

    if (o.includes("ORD") || o.includes("CHICAGO")) {
      x1 = 110;
      y1 = 136;
    } else if (o.includes("SFO") || o.includes("SAN FRANCISCO")) {
      x1 = 65;
      y1 = 138;
    } else if (o.includes("BOS") || o.includes("BOSTON")) {
      x1 = 155;
      y1 = 132;
    } else {
      x1 = 140;
      y1 = 145;
    }

    if (d.includes("CDG") || d.includes("PARIS")) {
      x2 = 485;
      y2 = 106;
    } else if (d.includes("FRA") || d.includes("FRANKFURT")) {
      x2 = 505;
      y2 = 102;
    } else {
      x2 = 470;
      y2 = 94;
    }

    const midX = (x1 + x2) / 2;
    const ctrlY = 28;

    const wp1X = x1 + (midX - x1) * 0.55;
    const wp1Y = y1 + (ctrlY - y1) * 0.5;

    const wp2X = midX + (x2 - midX) * 0.45;
    const wp2Y = ctrlY + (y2 - ctrlY) * 0.5;

    return { x1, y1, x2, y2, midX, ctrlY, wp1X, wp1Y, wp2X, wp2Y };
  };

  const { x1, y1, x2, y2, midX, ctrlY, wp1X, wp1Y, wp2X, wp2Y } = getCoordinates();
  const pathD = `M ${x1} ${y1} Q ${midX} ${ctrlY} ${x2} ${y2}`;

  return (
    <div className="relative w-full rounded-2xl bg-[#0A0F1F] border border-white/[0.08] overflow-hidden select-none shadow-xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Transatlantic Corridor Map
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">
            {flightNumber} · {carrier}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono text-[10px]">
            Illustrative route
          </span>
        </div>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-[#070B14]">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <svg viewBox="0 0 600 240" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <filter id="route-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22D3EE" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* FIR Oceanic Boundary Lines */}
          <line x1="280" y1="20" x2="280" y2="240" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4" />
          <text x="275" y="32" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="end">
            GANDER FIR
          </text>
          <text x="285" y="32" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="start">
            SHANWICK FIR
          </text>

          {/* Great Circle Flight Path Track (Glow) */}
          <path
            d={pathD}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="3.5"
            strokeOpacity="0.35"
            filter="url(#route-cyan-glow)"
          />

          {/* Great Circle Flight Path Track (Core Beam) */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Static Route Dash */}
          <path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.75"
          />

          {/* Oceanic Waypoint 1 */}
          <g transform={`translate(${wp1X}, ${wp1Y})`}>
            <polygon points="0,-3 3,0 0,3 -3,0" fill="#22D3EE" fillOpacity="0.8" />
            <text x="0" y="-6" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              GOMER
            </text>
          </g>

          {/* Oceanic Waypoint 2 */}
          <g transform={`translate(${wp2X}, ${wp2Y})`}>
            <polygon points="0,-3 3,0 0,3 -3,0" fill="#22D3EE" fillOpacity="0.8" />
            <text x="0" y="-6" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              MALOT
            </text>
          </g>

          {/* Departure Hub Pin */}
          <g transform={`translate(${x1}, ${y1})`}>
            <circle cx="0" cy="0" r="5" fill="#22D3EE" stroke="#0B1226" strokeWidth="2" />
            <rect x="-18" y="9" width="36" height="15" rx="3" fill="#0B1226" stroke="#22D3EE" strokeWidth="1" />
            <text
              x="0"
              y="20"
              fill="#22D3EE"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {origin}
            </text>
          </g>

          {/* Arrival Hub Pin */}
          <g transform={`translate(${x2}, ${y2})`}>
            <circle cx="0" cy="0" r="5" fill="#34D399" stroke="#0B1226" strokeWidth="2" />
            <rect x="-18" y="9" width="36" height="15" rx="3" fill="#0B1226" stroke="#34D399" strokeWidth="1" />
            <text
              x="0"
              y="20"
              fill="#34D399"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {destination}
            </text>
          </g>
        </svg>

        {/* HUD Overlay: Great-Circle Distance */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-[#0B1226]/90 border border-white/[0.08] text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-cyan-400" />
            <span>
              GC DISTANCE: <strong className="text-white">{distanceKm.toLocaleString()} KM</strong>
            </span>
          </div>
        </div>

        {/* HUD Overlay: Illustrative Route Label */}
        <div className="absolute bottom-2.5 left-3">
          <div className="px-2.5 py-1 rounded-lg bg-[#0B1226]/90 border border-white/[0.08] text-[10px] font-mono text-slate-400 backdrop-blur-sm">
            FLIGHT PATH TRACK · 068° TRUE · ETOPS 180
          </div>
        </div>

        {/* HUD Overlay: Honesty Tag */}
        <div className="absolute bottom-2.5 right-3">
          <div className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
            <span>Illustrative route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
