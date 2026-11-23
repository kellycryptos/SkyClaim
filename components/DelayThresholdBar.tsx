import React from "react";

interface DelayThresholdBarProps {
  delayMinutes: number;
  thresholdMinutes?: number;
  carrier: string;
  isEUUKCarrier: boolean;
  payoutRange: string;
  verdict: string;
}

export function DelayThresholdBar({
  delayMinutes,
  thresholdMinutes = 180,
  carrier,
  isEUUKCarrier,
  payoutRange,
  verdict,
}: DelayThresholdBarProps) {
  // Max scale is 5 hours (300 min) for display proportion
  const maxMinutes = 300;
  const clampedDelay = Math.min(Math.max(delayMinutes, 0), maxMinutes);
  const delayPercent = (clampedDelay / maxMinutes) * 100;
  const thresholdPercent = (thresholdMinutes / maxMinutes) * 100; // 60%

  const hours = Math.floor(delayMinutes / 60);
  const mins = delayMinutes % 60;
  const delayFormatted = hours > 0 ? `+${hours}h ${mins.toString().padStart(2, "0")}m` : `+${mins}m`;

  const isOverThreshold = delayMinutes >= thresholdMinutes;

  return (
    <div className="space-y-4 pt-2">
      {/* Top summary row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E5E5E0]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#666666] font-sans font-semibold">
            Arrival Delay at Destination
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-2xl font-mono font-bold tracking-tight tabular-nums ${
                isOverThreshold ? "text-[#C0392B]" : "text-[#1A1A1A]"
              }`}
            >
              {delayFormatted}
            </span>
            <span className="text-xs text-[#666666] font-sans">
              {isOverThreshold ? "(Exceeds 3h statutory threshold)" : "(Under 3h statutory threshold)"}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs uppercase tracking-wider text-[#666666] font-sans font-semibold">
            Statutory Payout (Art. 7)
          </span>
          <div className="text-xl font-mono font-bold tabular-nums text-[#2E7D32] mt-0.5">
            {payoutRange}
          </div>
        </div>
      </div>

      {/* Horizontal threshold bar */}
      <div className="relative pt-6 pb-4">
        {/* Threshold tick label above bar */}
        <div
          className="absolute top-0 text-[11px] font-mono text-[#1A1A1A] font-semibold flex flex-col items-center -translate-x-1/2"
          style={{ left: `${thresholdPercent}%` }}
        >
          <span>3h 00m Threshold</span>
          <span className="text-[#C0392B] text-[9px] font-sans">▲ EU261 MARK</span>
        </div>

        {/* The Track */}
        <div className="relative h-3 w-full bg-[#E5E5E0] rounded-sm overflow-hidden">
          {/* Active delay progress bar */}
          <div
            className={`h-full transition-all duration-300 rounded-sm ${
              isOverThreshold ? "bg-[#C0392B]" : "bg-[#666666]"
            }`}
            style={{ width: `${delayPercent}%` }}
          />

          {/* Threshold divider line inside bar */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white z-10"
            style={{ left: `${thresholdPercent}%` }}
          />
        </div>

        {/* Scale labels below bar */}
        <div className="flex justify-between text-[11px] font-mono text-[#737373] mt-2">
          <span>0h (On-Time)</span>
          <span>1h</span>
          <span>2h</span>
          <span className="font-semibold text-[#1A1A1A]">3h (Statutory)</span>
          <span>4h</span>
          <span>5h+</span>
        </div>
      </div>

      {/* Audit verdict notes */}
      <div className="text-xs text-[#555555] leading-relaxed pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0F0EB]">
        <div>
          <span className="font-semibold text-[#1A1A1A]">Operating Carrier: </span>
          <span className="font-mono text-[#333333]">{carrier}</span>
          <span className="ml-1 text-[#666666]">
            {isEUUKCarrier ? "· EU/UK metal covered ex-USA" : "· Non-EU metal excluded ex-USA (Art. 3(1)(b))"}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#737373]">
          CJEU Sturgeon v Condor (Joined Cases C-402/07 &amp; C-432/07)
        </div>
      </div>
    </div>
  );
}
