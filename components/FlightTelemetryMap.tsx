"use client";

import React, { useState, useEffect } from "react";
import { Plane, Navigation, Compass, Wind, Radio, ShieldCheck } from "lucide-react";

interface FlightTelemetryMapProps {
  origin: string;
  destination: string;
  flightNumber: string;
  distanceKm: number;
  carrier?: string;
}

export function FlightTelemetryMap({
  origin = "JFK",
  destination = "LHR",
  flightNumber = "BA178",
  distanceKm = 5550,
  carrier = "British Airways",
}: FlightTelemetryMapProps) {
  const [altitude, setAltitude] = useState(37000);
  const [speedKnots, setSpeedKnots] = useState(488);
  const [mach, setMach] = useState("0.84");

  // Subtle telemetry jitter for lively live-data feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude((prev) => 37000 + Math.floor(Math.random() * 80 - 40));
      setSpeedKnots((prev) => 488 + Math.floor(Math.random() * 6 - 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

    // Midpoint oceanic waypoints (Gander FIR entry & Shanwick FIR entry)
    const wp1X = x1 + (midX - x1) * 0.55;
    const wp1Y = y1 + (ctrlY - y1) * 0.5;

    const wp2X = midX + (x2 - midX) * 0.45;
    const wp2Y = ctrlY + (y2 - ctrlY) * 0.5;

    return { x1, y1, x2, y2, midX, ctrlY, wp1X, wp1Y, wp2X, wp2Y };
  };

  const { x1, y1, x2, y2, midX, ctrlY, wp1X, wp1Y, wp2X, wp2Y } = getCoordinates();
  const pathD = `M ${x1} ${y1} Q ${midX} ${ctrlY} ${x2} ${y2}`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#070C18] border border-[#1E293B] shadow-2xl select-none group">
      {/* Top Glass-Cockpit HUD Telemetry Strip */}
      <div className="bg-[#0B1120]/90 border-b border-[#1E293B] px-3.5 py-2 flex items-center justify-between gap-3 text-[11px] font-mono backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-blue-400" />
            {flightNumber}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-semibold">{origin} → {destination}</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-slate-500">ALT:</span>
            <span className="text-cyan-300 font-bold">{altitude.toLocaleString()} FT</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-slate-500">SPD:</span>
            <span className="text-blue-300 font-bold">{speedKnots} KTS (M{mach})</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-bold">
            NAT-TRACK B
          </div>
        </div>
      </div>

      {/* SVG Interactive Radar Canvas */}
      <div className="relative h-60 sm:h-72 w-full overflow-hidden">
        <svg
          viewBox="0 0 620 260"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Multi-tier Neon Blue Glow */}
            <filter id="intense-blue-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="1" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Jet Contrail Stream Gradient */}
            <linearGradient id="contrail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Radar Grid Pattern */}
            <pattern id="radar-grid-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="#1E293B"
                strokeWidth="0.6"
                strokeDasharray="1 3"
              />
            </pattern>

            {/* Oceanic Sweep Gradient */}
            <radialGradient id="radar-sweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Navy/Space Canvas Background */}
          <rect width="620" height="260" fill="#070C18" />
          <rect width="620" height="260" fill="url(#radar-grid-pattern)" />

          {/* Concentric Oceanic Radar Arcs */}
          <circle cx="310" cy="130" r="190" fill="none" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.6" />
          <circle cx="310" cy="130" r="130" fill="none" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 4" />
          <circle cx="310" cy="130" r="70" fill="none" stroke="#1E293B" strokeWidth="0.6" strokeOpacity="0.4" />
          <circle cx="310" cy="130" r="190" fill="url(#radar-sweep)" />

          {/* Meridian & Parallel Crosshairs */}
          <line x1="310" y1="0" x2="310" y2="260" stroke="#1E293B" strokeWidth="0.7" strokeDasharray="2 3" />
          <line x1="0" y1="130" x2="620" y2="130" stroke="#1E293B" strokeWidth="0.7" strokeDasharray="2 3" />

          {/* Simplified Continents Outline */}
          <g fill="#141E30" stroke="#1F2F48" strokeWidth="0.85" opacity="0.9">
            {/* North America (Eastern US & Canada) */}
            <path d="M 15 50 Q 55 40 95 45 T 145 35 T 185 50 L 200 70 Q 215 85 195 100 T 175 120 T 150 148 T 138 180 T 115 195 T 85 205 T 55 180 T 40 140 T 15 110 Z" />
            
            {/* Florida Peninsula */}
            <path d="M 138 180 Q 144 205 136 225 T 125 210 Z" />

            {/* Greenland Silhouette */}
            <path d="M 255 25 Q 295 18 310 40 T 300 75 T 265 70 T 245 48 Z" />

            {/* Iceland */}
            <path d="M 370 54 Q 390 50 395 60 T 380 68 T 365 60 Z" />

            {/* British Isles / UK & Ireland */}
            <path d="M 445 82 Q 460 70 468 78 T 478 95 T 470 118 T 455 112 T 448 98 Z" />
            <path d="M 430 92 Q 440 88 442 98 T 435 112 T 424 105 Z" />

            {/* Western Europe & France */}
            <path d="M 478 104 Q 500 94 535 94 T 575 108 T 590 140 T 555 172 T 510 178 T 480 158 T 472 130 Z" />

            {/* Iberian Peninsula (Spain/Portugal) */}
            <path d="M 465 162 Q 492 160 498 182 T 478 215 T 450 200 Z" />
          </g>

          {/* Oceanic Airspace Entry / Exit Boundary Lines (Gander FIR / Shanwick FIR) */}
          <line x1="280" y1="20" x2="280" y2="240" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="3 3" strokeOpacity="0.4" />
          <text x="275" y="32" fill="#60A5FA" fontSize="8" fontFamily="monospace" textAnchor="end" opacity="0.6">GANDER FIR</text>
          <text x="285" y="32" fill="#60A5FA" fontSize="8" fontFamily="monospace" textAnchor="start" opacity="0.6">SHANWICK FIR</text>

          {/* Great Circle Flight Path Track (Outer Blue Glow) */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            filter="url(#intense-blue-glow)"
            strokeOpacity="0.7"
          />

          {/* Great Circle Flight Path Track (Core Beam) */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#contrail-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Animated Great-Circle Dash Flow */}
          <path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="5 7"
            strokeOpacity="0.85"
          >
            <animate attributeName="stroke-dashoffset" values="24;0" dur="1.4s" repeatCount="indefinite" />
          </path>

          {/* Oceanic Waypoint 1 (GANDER EXIT) */}
          <g transform={`translate(${wp1X}, ${wp1Y})`}>
            <polygon points="0,-4 4,0 0,4 -4,0" fill="#38BDF8" fillOpacity="0.7" />
            <text x="0" y="-7" fill="#93C5FD" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              GOMER
            </text>
          </g>

          {/* Oceanic Waypoint 2 (SHANWICK ENTRY) */}
          <g transform={`translate(${wp2X}, ${wp2Y})`}>
            <polygon points="0,-4 4,0 0,4 -4,0" fill="#38BDF8" fillOpacity="0.7" />
            <text x="0" y="-7" fill="#93C5FD" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              MALOT
            </text>
          </g>

          {/* Aircraft Marker En Route (Moving Along the Path) */}
          <g transform={`translate(${midX - 2}, ${ctrlY + 14}) rotate(22)`}>
            {/* Glowing Engine Particle Exhaust */}
            <ellipse cx="-10" cy="0" rx="8" ry="3" fill="#38BDF8" fillOpacity="0.6" filter="url(#intense-blue-glow)">
              <animate attributeName="rx" values="6;11;6" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="0" cy="0" r="14" fill="#2563EB" fillOpacity="0.2" />
            <polygon
              points="10,0 -8,-7 -4,-1 -11,-1 -11,1 -4,1 -8,7"
              fill="#FFFFFF"
              stroke="#60A5FA"
              strokeWidth="0.8"
              filter="drop-shadow(0 0 5px #38BDF8)"
            />
          </g>

          {/* Departure Hub (JFK / Origin) Pin & Radar Ripple Waves */}
          <g transform={`translate(${x1}, ${y1})`}>
            <circle cx="0" cy="0" r="22" fill="none" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.3">
              <animate attributeName="r" values="6;24;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0.05;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Airport Label Tag */}
            <rect x="-18" y="9" width="36" height="16" rx="4" fill="#0B1120" stroke="#2563EB" strokeWidth="1.2" />
            <text
              x="0"
              y="21"
              fill="#60A5FA"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {origin}
            </text>
          </g>

          {/* Arrival Hub (LHR / Destination) Pin & Radar Ripple Waves */}
          <g transform={`translate(${x2}, ${y2})`}>
            <circle cx="0" cy="0" r="22" fill="none" stroke="#10B981" strokeWidth="0.7" strokeOpacity="0.3">
              <animate attributeName="r" values="6;24;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0.05;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Airport Label Tag */}
            <rect x="-18" y="9" width="36" height="16" rx="4" fill="#0B1120" stroke="#10B981" strokeWidth="1.2" />
            <text
              x="0"
              y="21"
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

        {/* Live HUD Floating Overlays */}
        {/* Top-Right HUD Distance Chip */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-[#0B1120]/85 border border-[#1E293B] text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>GC DISTANCE: <strong className="text-white">{distanceKm.toLocaleString()} KM</strong></span>
          </div>
        </div>

        {/* Bottom-Left Live Waypoint Telemetry */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-[#0B1120]/80 border border-[#1E293B] text-[9px] font-mono text-slate-400 backdrop-blur-sm">
            TRACK: 068° TRUE · ETOPS 180 · CORRIDOR LIVE
          </div>
        </div>

        {/* Bottom-Right Verification Engine Watermark */}
        <div className="absolute bottom-2.5 right-3">
          <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            TELEMETRY SYNCED
          </div>
        </div>
      </div>
    </div>
  );
}
