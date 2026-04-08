"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    label: "Scenario type",
    value: "Public highway",
    detail: "Heritage surface",
  },
  {
    label: "Paperwork load",
    value: "Moderate to heavy",
    detail: "Varies by borough",
  },
  {
    label: "Resident / traffic",
    value: "Medium exposure",
    detail: "Daytime mitigates noise risk",
  },
  {
    label: "Authority complexity",
    value: "1–3 bodies likely",
    detail: "Council + possible TfL",
  },
];

export default function FeasibilitySnapshot() {
  return (
    <section className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="border border-ink/10 rounded-2xl overflow-hidden bg-paper"
        >
          {/* Header */}
          <div className="px-6 md:px-8 py-5 border-b border-ink/5 flex items-center justify-between">
            <span className="font-display font-bold text-base">
              Feasibility Snapshot
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-electric/10 text-electric text-xs font-semibold px-3 py-1 rounded-full">
                Daytime · Street · Central
              </span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink/5">
            {metrics.map((m) => (
              <div key={m.label} className="px-6 md:px-8 py-6">
                <span className="eyebrow text-ink/50 mb-2 block">
                  {m.label}
                </span>
                <p className="font-display font-bold text-base leading-tight">
                  {m.value}
                </p>
                <p className="text-xs text-ink/45 mt-1">{m.detail}</p>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="px-6 md:px-8 py-5 bg-cream/70 flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-mint/15 text-mint flex items-center justify-center mt-0.5">
              <svg
                className="w-3 h-3"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13.5 4.5L6 12l-3.5-3.5" />
              </svg>
            </span>
            <p className="text-sm text-ink/70 leading-relaxed">
              <span className="font-semibold text-ink">Recommended path:</span>{" "}
              Start with Islington (Clerkenwell). Film-friendly council, lighter
              paperwork, and established precedent for small crew street shoots.
              Hold Camden as fallback.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
