"use client";

import React from "react";
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Sun,
  Wind,
  CloudSnow,
  Check,
  ShieldCheck,
  Plane,
} from "lucide-react";
import { SkyClaimResult } from "@/lib/skyclaim-types";

interface DelayThresholdGaugeProps {
  claim: SkyClaimResult;
}

export function DelayThresholdGauge({ claim }: DelayThresholdGaugeProps) {
  const delayMinutes = claim.flight.arrivalDelayMinutes;
  const isEligible = claim.verdict === "ELIGIBLE_FOR_CLAIM";
  const isWeatherRisk = claim.verdict === "FAIL_CLOSED_WEATHER";
  const isIneligible = claim.verdict === "INELIGIBLE";
  const isOperatingCarrierEUUK = claim.flight.isOperatingCarrierEUUK ?? true;

  // Statutory threshold is 180 minutes (3 hours)
  const thresholdMinutes = 180;
  const maxScale = 300;
  const currentPercent = Math.min(Math.max((delayMinutes / maxScale) * 100, 5), 100);
  const thresholdPercent = (thresholdMinutes / maxScale) * 100; // 60%

  return (
    <div className="space-y-4">
      {/* Operating Carrier & Jurisdiction Banner */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-blue-400 shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
              Operating Carrier (Actual Aircraft &amp; Crew)
            </span>
            <span className="font-bold text-white text-xs">
              {claim.flight.operatingCarrier || claim.flight.carrier}
            </span>
            {claim.flight.marketingCarrier && claim.flight.marketingCarrier !== claim.flight.operatingCarrier && (
              <span className="text-[10px] text-slate-500 block">
                Marketed as: {claim.flight.marketingCarrier}
              </span>
            )}
          </div>
        </div>

        <div>
          {isOperatingCarrierEUUK ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" />
              EU/UK Community Carrier (Covered)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-3 w-3" />
              Non-EU Metal Ex-USA (Excluded under Art. 3(1)(b))
            </span>
          )}
        </div>
      </div>

      {/* 3-Column Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Scheduled Arrival Card */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-3 sm:p-3.5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Scheduled</span>
            <Clock className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <p className="text-sm sm:text-base font-bold font-mono text-white tracking-tight">
            {claim.flight.scheduledArrival}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            Dep: {claim.flight.scheduledDeparture}
          </span>
        </div>

        {/* Actual Arrival Card */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-3 sm:p-3.5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Actual Gate</span>
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-sm sm:text-base font-bold font-mono text-white tracking-tight">
            {claim.flight.actualArrival}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            Gate touchdown
          </span>
        </div>

        {/* Arrival Delay Card (Hero Metric) */}
        <div
          className={`rounded-xl border p-3 sm:p-3.5 relative overflow-hidden transition ${
            isEligible
              ? "bg-[#0B1C16] border-emerald-500/40 shadow-lg shadow-emerald-500/5"
              : isWeatherRisk
              ? "bg-[#1C140C] border-amber-500/40 shadow-lg shadow-amber-500/5"
              : "bg-[#0B1120] border-[#1E293B]"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Arrival Delay
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                isEligible
                  ? "bg-emerald-400 animate-pulse"
                  : isWeatherRisk
                  ? "bg-amber-400 animate-pulse"
                  : "bg-slate-500"
              }`}
            />
          </div>
          <p
            className={`text-sm sm:text-base font-extrabold font-mono tracking-tight ${
              isEligible
                ? "text-emerald-400"
                : isWeatherRisk
                ? "text-amber-400"
                : "text-slate-300"
            }`}
          >
            +{Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m
          </p>
          <span
            className={`text-[10px] font-mono block mt-1 font-semibold ${
              isEligible
                ? "text-emerald-400"
                : isWeatherRisk
                ? "text-amber-400"
                : "text-slate-500"
            }`}
          >
            {delayMinutes >= 180
              ? `+${delayMinutes - 180}m past 3h trigger`
              : `${180 - delayMinutes}m under threshold`}
          </span>
        </div>
      </div>

      {/* EU261 Statutory Threshold Progress Bar */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1120]/90 p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-[11px]">
            <Gauge className="h-3.5 w-3.5 text-blue-400" />
            <span>EU261 / UK261 Statutory Arrival Delay Scale</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            CJEU STURGEON STANDARD: 3h 00m
          </span>
        </div>

        {/* The Visual Progress Track */}
        <div className="relative w-full h-3.5 rounded-full bg-[#161F33] border border-[#1E293B] overflow-hidden">
          {/* Sub-threshold Zone (0 to 3h) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-slate-700/30 border-r border-dashed border-slate-500/80"
            style={{ width: `${thresholdPercent}%` }}
          />

          {/* Statutory Compensation Zone (> 3h) */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-emerald-500/15"
            style={{ left: `${thresholdPercent}%` }}
          />

          {/* Active Flight Delay Fill Bar */}
          <div
            className={`h-full rounded-full transition-all duration-700 relative ${
              isEligible
                ? "bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-md shadow-emerald-500/30"
                : isWeatherRisk
                ? "bg-gradient-to-r from-blue-500 via-amber-400 to-amber-500 shadow-md shadow-amber-500/30"
                : "bg-slate-500"
            }`}
            style={{ width: `${currentPercent}%` }}
          >
            <span className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full opacity-90 animate-pulse" />
          </div>

          {/* 3-Hour Statutory Line Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 shadow-glow pointer-events-none z-10"
            style={{ left: `${thresholdPercent}%` }}
          />
        </div>

        {/* Milestone Tick Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
          <span>0h (On-time)</span>
          <span>1h</span>
          <span>2h</span>
          <span className="text-yellow-400 font-bold flex items-center gap-0.5">
            ▲ 3h 00m Threshold
          </span>
          <span>4h</span>
          <span>5h+</span>
        </div>

        {/* Statutory Verdict Status Box */}
        <div
          className={`mt-2 p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between gap-2 ${
            isEligible
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : isWeatherRisk
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-slate-800/40 border-slate-700/50 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {isEligible && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {isWeatherRisk && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />}
            {isIneligible && <Clock className="h-4 w-4 text-slate-400 shrink-0" />}
            <span className="text-[11px] leading-snug">
              {isEligible && (
                <>
                  <strong>Statutory Condition Satisfied:</strong> Delay of +{Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m exceeds 3h minimum. Compensation zone activated.
                </>
              )}
              {isWeatherRisk && (
                <>
                  <strong>Contested Claim:</strong> Weather risk flagged. Airline will assert Art. 5(3), but passenger can contest whether other flights departed.
                </>
              )}
              {isIneligible && (
                <>
                  {!isOperatingCarrierEUUK ? (
                    <span>
                      <strong>Non-EU Operating Carrier:</strong> Flights departing US are excluded unless flown on EU/UK metal (Art. 3(1)(b)).
                    </span>
                  ) : (
                    <span>
                      <strong>Under 3-Hour Limit:</strong> Delay of +{Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m does not activate statutory cash compensation.
                    </span>
                  )}
                </>
              )}
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded border border-current">
            {isEligible ? "ELIGIBLE" : isWeatherRisk ? "CONTESTED" : "INELIGIBLE"}
          </span>
        </div>
      </div>

      {/* Dual-Hub Weather Telemetry & Multi-Source Cross-Check */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-2">
          <div className="flex items-center gap-2">
            {claim.weather.hasSevereStormAlert ? (
              <div className="h-6 w-6 rounded-md bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <CloudSnow className="h-3.5 w-3.5 animate-pulse" />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-md bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <Sun className="h-3.5 w-3.5" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-white font-mono block">
                Dual-Hub Weather Telemetry ({claim.weather.departureAirport} → {claim.weather.arrivalAirport || "LHR"})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Primary: {claim.weather.sourceAuthority}
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
              isEligible
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : isWeatherRisk
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-slate-700/30 text-slate-400 border-slate-700/50"
            }`}
          >
            {isEligible
              ? "CLEAR CORRIDORS"
              : isWeatherRisk
              ? "WEATHER DEFENSE (CONTESTED)"
              : "BYPASSED"}
          </span>
        </div>

        {/* Dual Corridor Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-300">
          <div className="bg-[#111827] p-2.5 rounded-lg border border-[#1E293B]">
            <span className="text-slate-500 text-[10px] block uppercase">
              Departure Hub: {claim.weather.departureAirport}
            </span>
            <span
              className={
                claim.weather.hasSevereDepartureAlert
                  ? "text-amber-400 font-bold"
                  : "text-emerald-400 font-medium"
              }
            >
              {claim.weather.departureWeather || "No severe storm or ground-stop alerts active"}
            </span>
          </div>

          <div className="bg-[#111827] p-2.5 rounded-lg border border-[#1E293B]">
            <span className="text-slate-500 text-[10px] block uppercase">
              Arrival Terminal: {claim.weather.arrivalAirport || "LHR"}
            </span>
            <span
              className={
                claim.weather.hasSevereArrivalAlert
                  ? "text-amber-400 font-bold"
                  : "text-emerald-400 font-medium"
              }
            >
              {claim.weather.arrivalWeather || "Destination runway and instrument approaches clear"}
            </span>
          </div>
        </div>

        {/* Secondary Cross-Check Badge */}
        {claim.weather.secondaryCrossCheck && (
          <div className="p-2 rounded-lg bg-[#161F33]/70 border border-[#1E293B] text-[10px] font-mono text-slate-400 flex items-center justify-between gap-2">
            <span className="truncate">{claim.weather.secondaryCrossCheck.details}</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 font-bold uppercase">
              Cross-Check: {claim.weather.secondaryCrossCheck.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
