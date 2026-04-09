"use client";

import { useState, useCallback, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Sample states ─────────────────────────────────────────── */

interface LensOutput {
  filename: string;
  systemRead: string;
  recommendation: string;
  signals: string[];
}

const SAMPLES: LensOutput[] = [
  {
    filename: "spotify_export_strong_intent.csv",
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
    filename: "spotify_export_weak_follow_through.csv",
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
    filename: "spotify_export_mixed_signals.csv",
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

function classifyCSV(text: string, name: string): LensOutput {
  const lower = text.toLowerCase();

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

  if (hasSaveHigh && hasGrowth && !hasReachWeak)
    return { ...SAMPLES[0], filename: name };
  if (hasDropOff && !hasSaveHigh) return { ...SAMPLES[1], filename: name };
  return { ...SAMPLES[2], filename: name };
}

/* ── Component ─────────────────────────────────────────────── */

export default function TryTheLens() {
  const [result, setResult] = useState<LensOutput | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const showResult = useCallback((output: LensOutput) => {
    setProcessing(true);
    setResult(null);
    setLoadedFile(output.filename);
    setTimeout(() => {
      setProcessing(false);
      setResult(output);
    }, 700);
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
        showResult(classifyCSV(text, file.name));
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 rounded-3xl border border-electric/15 bg-paper p-7 md:p-10"
    >
      {/* Header — tied to the Lens */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-electric text-paper w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-[3px_3px_0_0_rgba(14,14,14,1)]">
          01
        </div>
        <div>
          <h4 className="font-display font-bold text-lg leading-snug">
            Try the Artist &amp; Track Lens
          </h4>
          <p className="text-ink/40 text-sm mt-1 max-w-md">
            Drop in a sample Spotify export and get a clear system read.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left: Input ── */}
        <div className="flex flex-col gap-5">
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
            {loadedFile && !processing ? (
              <>
                <div className="text-lg mb-1 opacity-30">✓</div>
                <p className="text-sm text-ink/50 leading-relaxed">
                  Loaded: <span className="font-mono text-ink/70">{loadedFile}</span>
                </p>
              </>
            ) : processing ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-ink/15 border-t-electric rounded-full animate-spin mb-2" />
                <p className="text-sm text-ink/40 leading-relaxed">
                  Reading <span className="font-mono">{loadedFile}</span>…
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl mb-2 opacity-40">↓</div>
                <p className="text-sm text-ink/50 leading-relaxed">
                  Drop a Spotify export or try a sample file
                </p>
              </>
            )}
          </div>

          {/* Sample file chips */}
          <div>
            <p className="text-[11px] text-ink/30 mb-2.5 uppercase tracking-widest font-semibold">
              Sample files
            </p>
            <div className="flex flex-col gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.filename}
                  onClick={() => showResult(s)}
                  className={`
                    group flex items-center gap-2.5 px-3.5 py-2.5
                    rounded-xl text-left
                    border transition-all cursor-pointer
                    ${
                      loadedFile === s.filename
                        ? "border-electric/30 bg-electric/5"
                        : "border-ink/10 bg-cream hover:border-ink/25"
                    }
                  `}
                >
                  <span className="shrink-0 text-ink/25 text-xs">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5h7.5L12.5 5.5v9a1 1 0 01-1 1h-9.5a1 1 0 01-1-1v-13a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8.5 1.5v4h4" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </span>
                  <span className="font-mono text-[13px] text-ink/60 group-hover:text-ink/80 transition-colors truncate">
                    {s.filename}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Output ── */}
        <div className="min-h-[300px] flex items-stretch">
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
                key={result.filename}
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
                  Select a sample file to see the system read
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
