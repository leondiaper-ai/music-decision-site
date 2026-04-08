"use client";

import { motion } from "framer-motion";
import type { FeasibilityResult } from "@/lib/location-engine";

const confidenceColor: Record<string, string> = {
  High: "bg-mint/15 text-mint",
  Medium: "bg-sun/20 text-amber-700",
  Low: "bg-signal/10 text-signal",
};

interface ResultsSnapshotProps {
  snapshot: FeasibilityResult["snapshot"];
}

export default function ResultsSnapshot({ snapshot }: ResultsSnapshotProps) {
  const metrics = [
    {
      label: "Scenario type",
      value: snapshot.scenarioType,
      detail: snapshot.scenarioDetail,
    },
    {
      label: "Paperwork load",
      value: snapshot.paperworkLoad,
      detail: snapshot.paperworkDetail,
    },
    {
      label: "Resident / traffic",
      value: snapshot.exposure,
      detail: snapshot.exposureDetail,
    },
    {
      label: "Authority complexity",
      value: snapshot.authorityComplexity,
      detail: snapshot.authorityDetail,
    },
  ];

  return (
    <section className="relative py-6 md:py-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="border border-ink/10 rounded-2xl overflow-hidden bg-paper"
        >
          {/* Header */}
          <div className="px-6 md:px-8 py-5 border-b border-ink/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-base">
                Feasibility Snapshot
              </span>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${confidenceColor[snapshot.confidence]}`}
              >
                {snapshot.confidence} confidence
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {snapshot.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-electric/10 text-electric text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
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
            <div className="flex-1">
              <p className="text-sm text-ink/70 leading-relaxed">
                <span className="font-semibold text-ink">
                  Recommended path:
                </span>{" "}
                {snapshot.recommendation}
              </p>
              <p className="text-xs text-ink/40 mt-1 italic">
                {snapshot.confidenceNote}
              </p>
            </div>
          </div>

          {/* Unknowns */}
          {snapshot.unknowns.length > 0 && (
            <div className="px-6 md:px-8 py-4 border-t border-ink/5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sun/15 text-amber-600 flex items-center justify-center mt-0.5 text-xs font-bold">
                  ?
                </span>
                <div className="flex-1">
                  <span className="eyebrow text-ink/40 mb-1.5 block">
                    What we don&apos;t know
                  </span>
                  <div className="space-y-1">
                    {snapshot.unknowns.map((u, i) => (
                      <p
                        key={i}
                        className="text-xs text-ink/50 leading-relaxed flex items-start gap-2"
                      >
                        <span className="flex-shrink-0 w-1 h-1 rounded-full bg-ink/20 mt-1.5" />
                        {u}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
