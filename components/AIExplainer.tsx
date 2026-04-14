"use client";

/**
 * AIExplainer
 *
 * A compact, expandable panel that sits below any decision surface in
 * the product. It asks the /api/explain route for a grounded, natural-
 * language explanation of why the engine reached its decision.
 *
 * Design intent:
 *   • Feels like part of the product, not a chatbot bolted on
 *   • No chat UI. No scrolling transcript. One card, one explanation.
 *   • Visible "AI-assisted" signal for recruiters / portfolio readers
 *   • Grounded in structured decision inputs — never invents metrics
 */

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Confidence = "High" | "Medium" | "Low";

interface ExplainerResponse {
  summary: string;
  keySignals: string[];
  confidence: Confidence;
  caution: string;
  source?: "model" | "synth";
}

export interface AIExplainerProps {
  decision: string;
  why: string;
  signals: string[];
  actions?: string[];
  scope?: "artist" | "track" | "campaign";
  /** Optional accent colour class, e.g. "text-push" */
  accentClass?: string;
}

function confidenceDot(c: Confidence) {
  if (c === "High") return "bg-push";
  if (c === "Medium") return "bg-hold";
  return "bg-test";
}

export default function AIExplainer({
  decision,
  why,
  signals,
  actions,
  scope,
  accentClass = "text-ink",
}: AIExplainerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplainerResponse | null>(null);

  const fetchExplanation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, why, signals, actions, scope }),
      });
      if (!res.ok) throw new Error("request failed");
      const json = (await res.json()) as ExplainerResponse;
      setData(json);
    } catch (e) {
      setError("Couldn't generate an explanation. Try again.");
    } finally {
      setLoading(false);
    }
  }, [decision, why, signals, actions, scope]);

  const handleToggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next && !data && !loading) fetchExplanation();
  }, [open, data, loading, fetchExplanation]);

  return (
    <div className="mt-5 pt-4 border-t border-ink/6">
      {/* Trigger row */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ink text-cream text-[9px] font-mono tracking-[0.12em]">
            AI
          </span>
          <span className="text-sm font-medium text-ink/75 group-hover:text-ink transition-colors">
            Why this recommendation?
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-ink/30 text-sm"
          aria-hidden
        >
          ▾
        </motion.span>
      </button>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-ink/10 bg-paper/80 p-5 md:p-6">
              {/* Eyebrow */}
              <div className="flex items-center justify-between mb-3">
                <div className="eyebrow text-ink/30">AI-assisted explanation</div>
                {data?.source && (
                  <div className="text-[10px] font-mono tracking-[0.12em] uppercase text-ink/25">
                    {data.source === "model" ? "Claude · Haiku" : "Grounded synth"}
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex items-center gap-3 text-sm text-ink/40 py-1">
                  <span className="inline-block w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full animate-spin" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="leading-relaxed"
                  >
                    Reasoning over structured inputs…
                  </motion.span>
                </div>
              )}

              {error && !loading && (
                <div className="text-sm text-ink/60">
                  {error}{" "}
                  <button
                    onClick={fetchExplanation}
                    className="underline underline-offset-4 text-ink hover:text-signal transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {data && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary */}
                  <p className={`text-[15px] md:text-base leading-relaxed ${accentClass === "text-ink" ? "text-ink/85" : "text-ink/85"}`}>
                    {data.summary}
                  </p>

                  {/* Key signals considered */}
                  {data.keySignals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-ink/6">
                      <div className="eyebrow text-ink/30 mb-2">Strongest signals</div>
                      <ul className="space-y-1.5">
                        {data.keySignals.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-[13px] text-ink/60 leading-relaxed"
                          >
                            <span className="text-ink/25 mt-0.5 shrink-0">·</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Confidence + caution row */}
                  <div className="mt-4 pt-4 border-t border-ink/6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${confidenceDot(data.confidence)}`} />
                      <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-ink/40">
                        Confidence · {data.confidence}
                      </span>
                    </div>
                    {data.caution && (
                      <div className="text-[12px] text-ink/50 leading-snug">
                        {data.caution}
                      </div>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="mt-4 pt-4 border-t border-ink/6 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-ink/30">
                      Generated from structured inputs + decision logic
                    </p>
                    <button
                      onClick={fetchExplanation}
                      className="text-[12px] font-medium text-ink/40 hover:text-ink transition-colors"
                    >
                      Regenerate ↻
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
