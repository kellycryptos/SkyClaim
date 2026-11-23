import React from "react";

interface PaperPlaneLogoProps {
  size?: number;
  className?: string;
}

export function PaperPlaneLogo({ size = 28, className = "" }: PaperPlaneLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="plane-wing-top" x1="4" y1="4" x2="24" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="plane-wing-bottom" x1="4" y1="14" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="plane-fold" x1="12" y1="12" x2="24" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>

        {/* Minimalist angled supersonic paper-plane / wing icon */}
        <polygon
          points="25,13 4,4 12,13"
          fill="url(#plane-wing-top)"
        />
        <polygon
          points="25,13 12,13 4,22"
          fill="url(#plane-wing-bottom)"
        />
        <polygon
          points="25,13 12,13 10,18"
          fill="url(#plane-fold)"
          opacity="0.8"
        />
        <polygon
          points="12,13 10,18 8,14"
          fill="#1E3A8A"
        />
      </svg>
    </div>
  );
}
