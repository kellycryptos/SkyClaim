import React from "react";

interface PaperPlaneLogoProps {
  size?: number;
  className?: string;
}

export function PaperPlaneLogo({ size = 32, className = "" }: PaperPlaneLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="sc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E2342" />
            <stop offset="100%" stopColor="#040A14" />
          </linearGradient>
          <linearGradient id="sc-check" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="sc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00D4FF" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Dark navy badge background */}
        <rect width="64" height="64" rx="14" fill="url(#sc-bg)" />
        <rect width="62" height="62" x="1" y="1" rx="13" fill="none" stroke="#1E3A66" strokeWidth="1.2" opacity="0.6" />

        {/* Glowing cyan checkmark trail */}
        <path
          d="M 12 38 L 22 48 C 23.2 49.2 25.2 49.2 26.4 48 L 38 33"
          fill="none"
          stroke="url(#sc-check)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#sc-glow)"
        />

        {/* White Airplane banking up-right */}
        <g transform="translate(36, 26) rotate(45)">
          <path
            d="M 0 -18 C 1.8 -18 3 -12 3 -4 L 3 8 C 3 10 1.8 11 0 11 C -1.8 11 -3 10 -3 8 L -3 -4 C -3 -12 -1.8 -18 0 -18 Z"
            fill="#FFFFFF"
          />
          <path
            d="M -16 2 L 0 -5 L 16 2 L 16 5 L 0 0 L -16 5 Z"
            fill="#FFFFFF"
          />
          <path
            d="M -7 9 L 0 6 L 7 9 L 7 11 L 0 9 L -7 11 Z"
            fill="#FFFFFF"
          />
          <ellipse cx="0" cy="-12" rx="1" ry="2" fill="#0EA5E9" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}
