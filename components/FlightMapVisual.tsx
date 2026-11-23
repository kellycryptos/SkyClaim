import React from "react";

interface FlightMapVisualProps {
  origin?: string;
  destination?: string;
  distanceKm?: number;
}

export function FlightMapVisual({
  origin = "JFK",
  destination = "LHR",
  distanceKm = 5550,
}: FlightMapVisualProps) {
  return (
    <div className="relative w-full h-44 sm:h-48 rounded-lg bg-[#0B1120] border border-[#1E293B] overflow-hidden select-none">
      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <defs>
          <pattern id="flight-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#334155" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#flight-grid)" />
      </svg>

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 500 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Arc gradient */}
          <linearGradient id="arc-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Simplified Continents Silhouette */}
        {/* North America (East Coast) */}
        <path
          d="M 30,30 Q 60,40 75,70 T 95,110 T 105,140 T 115,160 T 110,185 L 10,185 L 10,30 Z"
          fill="#161F33"
          stroke="#1E293B"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Greenland / Northern landmass */}
        <path
          d="M 200,20 Q 230,15 250,30 T 235,55 T 205,45 Z"
          fill="#161F33"
          stroke="#1E293B"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* UK & Western Europe */}
        <path
          d="M 370,80 Q 380,70 395,75 T 405,100 T 385,115 T 370,105 Z"
          fill="#161F33"
          stroke="#1E293B"
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M 405,85 Q 435,90 450,115 T 465,160 T 425,185 L 390,185 Q 395,140 405,85 Z"
          fill="#161F33"
          stroke="#1E293B"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Transatlantic NAT Corridor Track Arc: JFK (110, 140) -> LHR (390, 95) */}
        {/* Glow backdrop path */}
        <path
          d="M 110,140 Q 240,40 390,95"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="4"
          opacity="0.25"
          filter="url(#glow-filter)"
        />
        {/* Main sharp arc */}
        <path
          d="M 110,140 Q 240,40 390,95"
          fill="none"
          stroke="url(#arc-glow)"
          strokeWidth="2"
        />
        {/* Dashed flight track overlay */}
        <path
          d="M 110,140 Q 240,40 390,95"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.6"
        />

        {/* Mid-point airplane symbol (approx x=250, y=70, angle approx 15deg) */}
        <g transform="translate(250, 68) rotate(14)">
          <path
            d="M 0,-5 L 4,5 L 0,3 L -4,5 Z"
            fill="#38BDF8"
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
        </g>

        {/* Origin: JFK (110, 140) */}
        <g transform="translate(110, 140)">
          {/* Pulse ring */}
          <circle r="7" fill="#38BDF8" opacity="0.3" className="animate-ping" />
          <circle r="4" fill="#38BDF8" />
          <circle r="2" fill="#FFFFFF" />
          {/* Label Tag */}
          <rect x="-18" y="10" width="36" height="18" rx="4" fill="#111827" stroke="#38BDF8" strokeWidth="1" />
          <text
            x="0"
            y="23"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            {origin}
          </text>
        </g>

        {/* Destination: LHR (390, 95) */}
        <g transform="translate(390, 95)">
          {/* Pulse ring */}
          <circle r="7" fill="#2563EB" opacity="0.3" className="animate-ping" />
          <circle r="4" fill="#3B82F6" />
          <circle r="2" fill="#FFFFFF" />
          {/* Label Tag */}
          <rect x="-18" y="10" width="36" height="18" rx="4" fill="#111827" stroke="#3B82F6" strokeWidth="1" />
          <text
            x="0"
            y="23"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            {destination}
          </text>
        </g>
      </svg>

      {/* Corridor HUD Badge */}
      <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-[#111827]/90 border border-[#1E293B] text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>NAT-TRACK B · {distanceKm.toLocaleString()} KM</span>
      </div>
    </div>
  );
}
