"use client";

import { useState, useCallback, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Sample states ─────────────────────────────────────────── */

interface LensOutput {
  label: string;
  systemRead: string;
  recommendation: string;
  signals: string[];
}

const SAMPLES: LensOutput[] = [
  {
    label: "Strong intent",
    systemRead: "High intent, healthy growth",
    recommendation:
      "Push now. Audience is responding and broadening — this is the window for paid amplification.",
    signals: [
      "Save rate 40% above baseline",
      "Reach expanding day-on-day",
      "Listener-to-follower conversion trending up",
    ],
  },
  {
    label: "Weak follow-through",
    systemRead: "Initial spike, no sustained engagement",
    recommendation:
      "Hold spend. Revisit content strategy before next push — the audience isn't retaining.",
    signals: [
      "Strong day-one streams, sharp drop by day 3",
      "Save rate below baseline",
      "Skip rate rising across playlist placements",
    ],
  },
  {
    label: "Mixed signals",
    systemRead: "High intent, weak distribution",
    recommendation:
      "Hold paid push. Focus on content cadence and audience growth before spending into a reach window that isn't ready.",
    signals: [
      "Save rate above baseline",
      "Reach flattening after day 3",
      "Growth not broadening beyond core audience yet",
    ],
  },
];

/* ── Minimal CSV parser ────────────────────────────────────── */

function classifyCSV(text: string): LensOutput {
  const lower = text.toLowerCase();

  // Look for signals in the data
  const hasSaveHigh =
    lower.includes("save") &&
    (lower.includes("high") || lower.includes("above") || lower.includes("strong"));
  const hasReachWeak =
    lower.includes("reach") &&
    (lower.includes("flat") || lower.includes("low") || lower.includes("declining"));
  const hasDropOff =
    lower.includes("drop") || lower.includes("spike") || lower.includes("skip");
  const hasGrowth =
    lower.includes("growth") &&
    (lower.includes("rising") || lower.includes("expanding") || lower.includes("up"));

  // Strong intent: high saves + expanding reach
  if (hasSaveHigh && hasGrowth && !hasReachWeak) return SAMPLES[0];
  // Weak follow-through: drop-off signals
  if (hasDropOff && !hasSaveHigh) return SAMPLES[1];
  // Default: mixed signals
  return SAMPLES[2];
}

/* ── Component ─────────────────────────────────────────────── */

export default function TryTheLens() {
  const [result, setResult] = useState<LensOutput | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const showResult = useCallback((output: LensOutput) => {
    setProcessing(true);
    setResult(null);
    // Brief processing pause to feel real
    setTimeout(() => {
      setProcessing(false);
      setResult(output);
    }, 600);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        showResult(classifyCSV(text));
      };
      reader.readAsText(file);
    },
    [showResult]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow text-ink/50">Try the Lens</span>
          <p className="text-ink/40 text-sm mt-2 mb-8 max-w-lg">
            Drop in a sample Spotify export and get a clear system read.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ── Left: Input ── */}
            <div className="flex flex-col gap-4">
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  rounded-2xl border-2 border-dashed
                  flex flex-col items-center justify-center
                  py-10 px-6 text-center transition-all
                  ${
                    dragging
                      ? "border-electric bg-electric/5"
                      : "border-ink/15 bg-cream hover:border-ink/30"
                  }
                `}
              >
                <div className="text-2xl mb-2 opacity-40">↓</div>
                <p className="text-sm text-ink/50 leading-relaxed">
                  Drag &amp; drop a CSV file
                </p>
                <p className="text-[11px] text-ink/30 mt-1">
                  or choose a sample below
                </p>
              </div>

              {/* Sample buttons */}
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => showResult(s)}
                    className="
                      px-4 py-2 rounded-xl text-sm font-medium
                      border border-ink/12 bg-cream
                      hover:border-ink/30 hover:bg-cream/80
                      transition-colors cursor-pointer
                    "
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Output ── */}
            <div className="min-h-[240px] flex items-stretch">
              <AnimatePresence mode="wait">
                {processing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="
                      flex-1 rounded-2xl border border-ink/10 bg-cream
                      flex items-center justify-center
                    "
                  >
                    <div className="flex items-center gap-3 text-sm text-ink/40">
                      <span className="inline-block w-4 h-4 border-2 border-ink/20 border-t-electric rounded-full animate-spin" />
                      Reading signals…
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key={result.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="
                      flex-1 rounded-2xl border border-ink/10 bg-cream
                      p-6 md:p-7 flex flex-col
                    "
                  >
                    {/* System read */}
                    <div className="mb-5">
                      <div className="eyebrow text-ink/40 mb-1.5">
                        System read
                      </div>
                      <div className="font-display font-bold text-xl leading-snug">
                        {result.systemRead}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-5">
                      <div className="eyebrow text-ink/40 mb-1.5">
                        Recommendation
                      </div>
                      <p className="text-sm text-ink/75 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    {/* Signals */}
                    <div className="mt-auto">
                      <div className="eyebrow text-ink/40 mb-2">
                        Signals behind the read
                      </div>
                      <ul className="space-y-1.5">
                        {result.signals.map((sig) => (
                          <li
                            key={sig}
                            className="flex items-start gap-2 text-sm text-ink/60 leading-relaxed"
                          >
                            <span className="text-signal mt-0.5 shrink-0">
                              →
                            </span>
                            {sig}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="
                      flex-1 rounded-2xl border border-dashed border-ink/10 bg-cream/50
                      flex items-center justify-center
                    "
                  >
                    <p className="text-sm text-ink/25 text-center px-6">
                      Select a sample or drop a file to see the system read
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
