"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ScoredOption } from "@/lib/location-engine";

const paperworkColor: Record<string, string> = {
  Light: "bg-mint/15 text-mint",
  Moderate: "bg-sun/20 text-amber-700",
  Heavy: "bg-signal/10 text-signal",
};

const verdictColor: Record<string, string> = {
  "High friction": "text-signal",
  Workable: "text-amber-700",
  "Best path": "text-mint",
};

const confidenceColor: Record<string, string> = {
  High: "bg-mint/15 text-mint",
  Medium: "bg-sun/20 text-amber-700",
  Low: "bg-signal/10 text-signal",
};

function RiskDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= level
              ? level >= 4
                ? "bg-signal"
                : level >= 3
                ? "bg-amber-500"
                : "bg-mint"
              : "bg-ink/10"
          }`}
        />
      ))}
    </div>
  );
}

interface ResultsTableProps {
  inputText: string;
  options: ScoredOption[];
}

export default function ResultsTable({ inputText, options }: ResultsTableProps) {
  const [view, setView] = useState<"feasibility" | "source">("feasibility");

  return (
    <section id="results" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Quoted input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-ink/10 rounded-2xl p-6 md:p-8 bg-paper mb-6"
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 text-2xl text-ink/25 leading-none mt-0.5">
              &ldquo;
            </span>
            <div>
              <p className="text-lg md:text-xl text-ink/80 italic leading-snug">
                {inputText}
              </p>
              <span className="eyebrow text-ink/40 mt-3 block">
                Your request
              </span>
            </div>
          </div>
        </motion.div>

        {/* View toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center gap-1 mb-4"
        >
          <button
            onClick={() => setView("feasibility")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              view === "feasibility"
                ? "bg-ink text-paper"
                : "bg-paper border border-ink/10 text-ink/60 hover:text-ink"
            }`}
          >
            Feasibility
          </button>
          <button
            onClick={() => setView("source")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              view === "source"
                ? "bg-ink text-paper"
                : "bg-paper border border-ink/10 text-ink/60 hover:text-ink"
            }`}
          >
            Source / Evidence
          </button>
        </motion.div>

        {view === "feasibility" ? (
            <motion.div
              key="feasibility"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-paper border border-ink/10 rounded-2xl overflow-hidden"
            >
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-cream/60">
                      <th className="eyebrow text-ink/50 px-8 py-4">Area</th>
                      <th className="eyebrow text-ink/50 px-6 py-4">Lead time</th>
                      <th className="eyebrow text-ink/50 px-6 py-4">Est. cost</th>
                      <th className="eyebrow text-ink/50 px-6 py-4">Paperwork</th>
                      <th className="eyebrow text-ink/50 px-6 py-4">Risk</th>
                      <th className="eyebrow text-ink/50 px-6 py-4">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {options.map((opt, i) => (
                      <motion.tr
                        key={opt.area}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                        className="group"
                      >
                        <td className="px-8 py-5">
                          <span className="font-display font-bold text-base">
                            {opt.area}
                          </span>
                          <br />
                          <span className="text-xs text-ink/40">{opt.detail}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-ink/75">
                          {opt.leadTime}
                        </td>
                        <td className="px-6 py-5 text-sm text-ink/75">
                          {opt.cost}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${paperworkColor[opt.paperwork]}`}
                          >
                            {opt.paperwork}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <RiskDots level={opt.riskLevel} />
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`font-medium text-sm ${verdictColor[opt.verdict]}`}
                          >
                            {opt.verdict}
                          </span>
                          <br />
                          <span className="text-xs text-ink/40">
                            {opt.verdictNote}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-ink/5">
                {options.map((opt) => (
                  <div key={opt.area} className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-lg">
                        {opt.area}
                      </span>
                      <span
                        className={`font-medium text-sm ${verdictColor[opt.verdict]}`}
                      >
                        {opt.verdict}
                      </span>
                    </div>
                    <p className="text-xs text-ink/40">{opt.detail}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-ink/40 block">Lead time</span>
                        <span className="text-ink/75">{opt.leadTime}</span>
                      </div>
                      <div>
                        <span className="text-xs text-ink/40 block">Est. cost</span>
                        <span className="text-ink/75">{opt.cost}</span>
                      </div>
                      <div>
                        <span className="text-xs text-ink/40 block">Paperwork</span>
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${paperworkColor[opt.paperwork]}`}
                        >
                          {opt.paperwork}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-ink/40 block mb-1">Risk</span>
                        <RiskDots level={opt.riskLevel} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ──── SOURCE VIEW ──── */
            <motion.div
              key="source"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {options.map((opt, i) => (
                <motion.div
                  key={opt.area}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="border border-ink/10 rounded-2xl bg-paper overflow-hidden"
                >
                  {/* Card header */}
                  <div className="px-6 md:px-8 py-5 border-b border-ink/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-base">
                        {opt.area}
                      </span>
                      <span
                        className={`font-medium text-xs ${verdictColor[opt.verdict]}`}
                      >
                        {opt.verdict}
                      </span>
                    </div>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${confidenceColor[opt.confidence]}`}
                    >
                      {opt.confidence} confidence
                    </span>
                  </div>

                  {/* Evidence lines */}
                  <div className="divide-y divide-ink/5">
                    {opt.evidence.map((ev, j) => (
                      <div key={j} className="px-6 md:px-8 py-4 flex gap-4">
                        <span className="eyebrow text-ink/45 flex-shrink-0 w-32 pt-0.5">
                          {ev.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink/75 leading-relaxed">
                            {ev.fact}
                          </p>
                          <span className="text-xs text-ink/35 mt-1 block">
                            {ev.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Unknowns */}
                  {opt.unknowns.length > 0 && (
                    <div className="px-6 md:px-8 py-4 bg-cream/50 border-t border-ink/5">
                      <span className="eyebrow text-ink/40 mb-2 block">
                        Unknowns / gaps
                      </span>
                      <div className="space-y-1.5">
                        {opt.unknowns.map((u, k) => (
                          <p
                            key={k}
                            className="text-xs text-ink/50 leading-relaxed flex items-start gap-2"
                          >
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-ink/20 mt-1.5" />
                            {u}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
      </div>
    </section>
  );
}
