"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneLogo } from "@/components/PaperPlaneLogo";
import { X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0E1526] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <PaperPlaneLogo size={36} />
                <div>
                  <h2 className="text-base font-bold text-[#F8FAFC] tracking-tight font-mono">
                    Frequently Asked Questions (FAQ)
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Statutory passenger rights, weather defense standards, and compensation rules
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {faqs.map((faq, idx) => {
                const isOpenAccordion = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpenAccordion ? null : idx)}
                      className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-white hover:bg-white/[0.04] transition cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      {isOpenAccordion ? (
                        <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpenAccordion && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-white/[0.04] pt-2"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-end border-t border-white/[0.08] pt-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Close FAQ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}