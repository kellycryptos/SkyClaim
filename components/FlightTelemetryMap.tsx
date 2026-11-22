"use client";

import React from "react";
import { Plane } from "lucide-react";

interface FlightTelemetryMapProps {
  origin: string;
  destination: string;
  flightNumber: string;
  distanceKm: number;
}

export function FlightTelemetryMap({
  origin = "JFK",
  destination = "LHR",
  flightNumber = "BA178",
  distanceKm = 5550,
}: FlightTelemetryMapProps) {
  // Determine coordinate points based on origin and destination
  const getCoordinates = () => {
    let x1 = 145,
      y1 = 140; // JFK default
    let x2 = 460,
      y2 = 96; // LHR default

    const o = origin.toUpperCase();
    const d = destination.toUpperCase();

    if (o.includes("ORD") || o.includes("CHICAGO")) {
      x1 = 115;
      y1 = 132;
    } else if (o.includes("SFO") || o.includes("SAN FRANCISCO")) {
      x1 = 70;
      y1 = 135;
    } else if (o.includes("BOS") || o.includes("BOSTON")) {
      x1 = 160;
      y1 = 130;
    } else {
      x1 = 145;
      y1 = 140;
    }

    if (d.includes("CDG") || d.includes("PARIS")) {
      x2 = 475;
      y2 = 108;
    } else if (d.includes("FRA") || d.includes("FRANKFURT")) {
      x2 = 495;
      y2 = 104;
    } else {
      x2 = 460;
      y2 = 96;
    }

    // Quadratic bezier control point high in the north Atlantic for great-circle arch
    const midX = (x1 + x2) / 2;
    const ctrlY = 32;

    return { x1, y1, x2, y2, midX, ctrlY };
  };

  const { x1, y1, x2, y2, midX, ctrlY } = getCoordinates();
  const pathD = `M ${x1} ${y1} Q ${midX} ${ctrlY} ${x2} ${y2}`;

  return (
    <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-[#0A0F1D] border border-[#1E293B] shadow-inner select-none">
      {/* SVG Radar World Map Graphic */}
      <svg
        viewBox="0 0 600 240"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glowing blue filter */}
          <filter id="blue-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="flight-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="ocean-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1224" />
            <stop offset="100%" stopColor="#080D1A" />
          </linearGradient>

          {/* Grid pattern */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#1E293B"
              strokeWidth="0.5"
              strokeDasharray="1 3"
            />
          </pattern>
        </defs>

        {/* Ocean Background & Grid */}
        <rect width="600" height="240" fill="url(#ocean-grad)" />
        <rect width="600" height="240" fill="url(#grid)" />

        {/* Latitude / Flight Corridor Arcs */}
        <ellipse cx="300" cy="270" rx="360" ry="170" fill="none" stroke="#1E293B" strokeWidth="0.75" />
        <ellipse cx="300" cy="290" rx="420" ry="210" fill="none" stroke="#1E293B" strokeWidth="0.75" />
        <line x1="300" y1="0" x2="300" y2="240" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 4" />

        {/* Simplified Continents Outline */}
        <g fill="#162032" stroke="#1F2D44" strokeWidth="0.75" opacity="0.85">
          {/* North America (Eastern US & Canada) */}
          <path d="M 20 50 Q 50 40 90 45 T 140 35 T 180 50 L 195 70 Q 210 85 190 100 T 170 120 T 150 145 T 140 170 T 115 190 T 90 200 T 60 175 T 45 140 T 20 110 Z" />
          
          {/* Florida Peninsula */}
          <path d="M 140 170 Q 145 195 138 215 T 128 200 Z" />

          {/* Greenland Silhouette */}
          <path d="M 250 25 Q 285 20 300 40 T 290 70 T 260 65 T 240 45 Z" />

          {/* Iceland */}
          <path d="M 360 52 Q 380 48 385 58 T 370 65 T 355 58 Z" />

          {/* British Isles / UK & Ireland */}
          <path d="M 435 85 Q 448 72 455 80 T 465 95 T 458 115 T 445 110 T 438 98 Z" />
          <path d="M 420 95 Q 430 90 432 100 T 425 112 T 415 105 Z" />

          {/* Western Europe & France */}
          <path d="M 465 105 Q 485 95 520 95 T 560 110 T 575 140 T 540 170 T 500 175 T 470 155 T 460 130 Z" />

          {/* Iberian Peninsula (Spain/Portugal) */}
          <path d="M 455 160 Q 480 158 485 180 T 465 210 T 440 195 Z" />

          {/* Scandinavia Outline */}
          <path d="M 475 35 Q 510 25 530 50 T 515 80 T 485 70 Z" />
        </g>

        {/* Flight Track Coordinates / Radar rings around origin & destination */}
        <circle cx={x1} cy={y1} r="18" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 2" />
        <circle cx={x2} cy={y2} r="18" fill="none" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 2" />

        {/* Curved Transatlantic Flight Path Arc */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#flight-arc-grad)"
          strokeWidth="2.5"
          filter="url(#blue-glow)"
          strokeLinecap="round"
        />

        {/* Animated Dashed Overlay Track */}
        <path
          d={pathD}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.75"
        />

        {/* Mid-flight glowing plane icon */}
        <g transform={`translate(${midX - 7}, ${ctrlY + 12}) rotate(25)`}>
          <circle cx="7" cy="7" r="10" fill="#2563EB" fillOpacity="0.25" />
          <path
            d="M 7 0 L 9 5 L 14 6 L 10 9 L 11 14 L 7 11 L 3 14 L 4 9 L 0 6 L 5 5 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 4px #60A5FA)"
          />
        </g>

        {/* Origin Pin (e.g. JFK) */}
        <g transform={`translate(${x1}, ${y1})`}>
          <circle cx="0" cy="0" r="7" fill="#2563EB" fillOpacity="0.4">
            <animate attributeName="r" values="4;10;4" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Label Badge */}
          <rect x="-16" y="7" width="32" height="15" rx="3" fill="#0B1120" stroke="#2563EB" strokeWidth="1" />
          <text
            x="0"
            y="18"
            fill="#93C5FD"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {origin}
          </text>
        </g>

        {/* Destination Pin (e.g. LHR or CDG) */}
        <g transform={`translate(${x2}, ${y2})`}>
          <circle cx="0" cy="0" r="7" fill="#10B981" fillOpacity="0.4">
            <animate attributeName="r" values="4;10;4" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Label Badge */}
          <rect x="-16" y="7" width="32" height="15" rx="3" fill="#0B1120" stroke="#10B981" strokeWidth="1" />
          <text
            x="0"
            y="18"
            fill="#A7F3D0"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {destination}
          </text>
        </g>
      </svg>

      {/* Flight HUD Overlay Badges */}
      <div className="absolute top-2.5 left-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2 py-0.5 rounded bg-[#0B1120]/80 border border-[#1E293B] text-[10px] font-mono text-slate-300 backdrop-blur-sm">
          {flightNumber} · {origin} → {destination}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400">
          TRANSATLANTIC
        </span>
      </div>

      <div className="absolute top-2.5 right-3 pointer-events-none">
        <span className="px-2 py-0.5 rounded bg-[#0B1120]/80 border border-[#1E293B] text-[10px] font-mono text-slate-300 backdrop-blur-sm">
          {distanceKm.toLocaleString()} KM
        </span>
      </div>

      <div className="absolute bottom-2 left-3 pointer-events-none">
        <span className="text-[9px] font-mono text-slate-500">
          NORTH ATLANTIC CORRIDOR (NAT-B)
        </span>
      </div>
    </div>
  );
}
