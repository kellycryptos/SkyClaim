"use client";

import React from "react";

interface SkyClaimLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function SkyClaimLogo({
  size = 38,
  className = "",
  showGlow = true,
}: SkyClaimLogoProps) {
  const id = React.useId().replace(/:/g, "");

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ width: size, height: size }}
      title="SkyClaim · Flight Disruption Shield"
    >
      {/* Dynamic ambient neon glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 opacity-50 blur-md pointer-events-none transition-all duration-300 group-hover:opacity-85 group-hover:blur-lg"
          style={{ transform: "scale(0.88)" }}
        />
      )}

      {/* High-Precision Cyber Shield & Supersonic Delta Emblem */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Shield Outer Bezel Gradient */}
          <linearGradient id={`${id}-shield-border`} x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="65%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Shield Core Interior Fill */}
          <linearGradient id={`${id}-shield-bg`} x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#162032" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#080D1A" />
          </linearGradient>

          {/* Supersonic Delta Wing: Left Port Facet (Electric Deep Blue) */}
          <linearGradient id={`${id}-delta-left`} x1="32" y1="13" x2="15" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Supersonic Delta Wing: Right Starboard Facet (Illuminated Cyan/Azure) */}
          <linearGradient id={`${id}-delta-right`} x1="32" y1="13" x2="49" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#7DD3FC" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Center Fuselage Keel Crease (Razor Sharp Highlight) */}
          <linearGradient id={`${id}-keel-crease`} x1="32" y1="13" x2="32" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          {/* Stealth Exhaust Vector Glow */}
          <linearGradient id={`${id}-exhaust-glow`} x1="32" y1="36" x2="32" y2="47" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Outer Aerodynamic Protective Shield */}
        <path
          d="M 32 5.5 
             L 53.5 13.5 
             C 53.5 28.5, 51.5 44, 32 58.5 
             C 12.5 44, 10.5 28.5, 10.5 13.5 
             Z"
          fill={`url(#${id}-shield-bg)`}
          stroke={`url(#${id}-shield-border)`}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 2. Inner Shield Contour & Precision Radar Graticule */}
        <path
          d="M 32 10 
             L 48 16 
             C 48 28, 46.5 39, 32 51.5 
             C 17.5 39, 16 28, 16 16 
             Z"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />

        {/* Concentric Radar Grid Rings (Flight Telemetry) */}
        <circle cx="32" cy="30" r="14" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="1.5 2.5" />
        <circle cx="32" cy="30" r="8" stroke="#60A5FA" strokeWidth="0.5" strokeOpacity="0.12" />

        {/* 3. Exhaust Trail Glow */}
        <polygon
          points="28,37 36,37 32,48"
          fill={`url(#${id}-exhaust-glow)`}
        />

        {/* 4. The Iconic Supersonic Stealth Jet / Paper-Plane */}
        {/* Left Delta Wing */}
        <polygon
          points="32,13.5 14,37.5 32,33"
          fill={`url(#${id}-delta-left)`}
          stroke="#1E3A8A"
          strokeWidth="0.5"
        />

        {/* Right Delta Wing */}
        <polygon
          points="32,13.5 50,37.5 32,33"
          fill={`url(#${id}-delta-right)`}
          stroke="#38BDF8"
          strokeWidth="0.5"
        />

        {/* Lower Port Canard / Winglet */}
        <polygon
          points="32,33 24,42.5 32,45"
          fill="#0F172A"
          stroke="#2563EB"
          strokeWidth="0.6"
        />

        {/* Lower Starboard Canard / Winglet */}
        <polygon
          points="32,33 40,42.5 32,45"
          fill="#1E293B"
          stroke="#38BDF8"
          strokeWidth="0.6"
        />

        {/* Central Spine Fold / Fuselage Keel */}
        <polygon
          points="32,13.5 30.2,33 32,45 33.8,33"
          fill={`url(#${id}-keel-crease)`}
        />

        {/* Nose Beacon Highlight Dot */}
        <circle
          cx="32"
          cy="13.5"
          r="1.2"
          fill="#FFFFFF"
          filter="drop-shadow(0 0 3px #93C5FD)"
        />
      </svg>
    </div>
  );
}
