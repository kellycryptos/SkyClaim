"use client";

import React, { useState } from "react";
import { X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "What is EU261 and UK261 statutory flight disruption compensation?",
      a: "Regulation (EC) No 261/2004 and the UK equivalent provide legally mandated cash compensation for passengers whose flights arrive at their final destination 3 or more hours late, or are cancelled without sufficient notice, provided the disruption was not caused by extraordinary circumstances.",
    },
    {
      q: "How does the 3-hour arrival delay rule work under Sturgeon v Condor?",
      a: "In the landmark Sturgeon v Condor case, the Court of Justice of the European Union ruled that passengers delayed by 3 hours or more upon arrival at their final destination are treated identically to cancelled flight passengers for statutory compensation (Article 7). Departure delays alone do not establish entitlement.",
    },
    {
      q: "What qualifies as an 'Extraordinary Circumstances' defense?",
      a: "Under Article 5(3), an airline is exempt from paying statutory cash compensation if it proves the delay was caused by events beyond its actual control that could not have been avoided even if all reasonable measures were taken. Severe weather (e.g., active ground stops, blizzards, volcanic ash) is a valid defense.",
    },
    {
      q: "Why does SkyClaim verify weather telemetry automatically?",
      a: "Airlines routinely cite 'weather' as a blanket excuse to deny legitimate claims. SkyClaim automatically queries real-time and historical NWS/aviation weather alerts for the departure airport. If the weather was clear, the airline's excuse is debunked with cryptographic evidence.",
    },
    {
      q: "What does the Article 7(2) 50% compensation rule mean?",
      a: "For long-haul flights (> 3,500 km, such as transatlantic US-to-Europe routes), statutory compensation is €600. However, if the arrival delay is between 3 and 4 hours, Article 7(2)(c) permits the carrier to reduce compensation by 50% to €300.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl border border-[#1E293B] bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC] tracking-tight font-mono">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs text-[#94A3B8]">
                EU261 / UK261 legal basis, weather screening, and claims verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#161F33] hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1E293B] bg-[#161F33] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-blue-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#94A3B8] leading-relaxed border-t border-[#1E293B]/50 bg-[#0B1120]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end border-t border-[#1E293B] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
