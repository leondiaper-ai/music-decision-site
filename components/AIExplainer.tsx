"use client";

/**
 * AIExplainer — "AI-assisted perspective"
 *
 * Sits below any decision surface and adds a second layer of thinking:
 *   • Shift potential — what would need to change to flip the decision
 *   • Risk signal    — what breaks if the call is ignored
 *   • Confidence     — how stable the underlying signals are
 *   • Pattern read   — (timeline mode only) the shape of the campaign
 *
 * Never repeats the engine's existing "why". Grounded entirely in the
 * structured decision inputs.
 */

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Confidence = "High" | "Medium" | "Low";

interface ExplainerResponse {
  shiftPotential: string;
  riskSignal: string;
  confidence: Confidence;
  confidenceNote: string;
  patternRead: string;
  source?: "model" | "synth";
}

export interface AIExplainerProps {
  decision: string;
  why: string;
  signals: string[];
  actions?: string[];
  scope?: "artist" | "track" | "campaign";
  /** "decision" (default) or "timeline" — timeline shows pattern read. */
  mode?: "decision" | "timeline";
  /** Ordered campaign moments, only used in timeline mode. */
  moments?: string[];
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
  mode = "decision",
  moments,
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
        body: JSON.stringify({ decision, why, signals, actions, scope, mode, moments }),
      });
      if (!res.ok) throw new Error("request failed");
      const json = (await res.json()) as ExplainerResponse;
      setData(json);
    } catch {
      setError("Couldn't generate a perspective. Try again.");
    } finally {
      setLoading(false);
    }
  }, [decision, why, signals, actions, scope, mode, moments]);

  const handleToggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next && !data && !loading) fetchExplanation();
  }, [open, data, loading, fetchExplanation]);

  const triggerLabel = mode === "timeline" ? "AI pattern read" : "AI-assisted perspective";

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
            {triggerLabel}
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
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow text-ink/30">
                  {mode === "timeline" ? "AI pattern read" : "AI-assisted perspective"}
                </div>
                {data?.source && (
                  <div className="text-[10px] font-mono tracking-[0.12em] uppercase text-ink/25">
                    {data.source === "model" ? "Claude · Haiku" : "Grounded synth"}
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex items-center gap-3 text-sm text-ink/40 py-1">
                  <span className="inline-block w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full animate-spin" />
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="leading-relaxed">
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
                  className="space-y-4"
                >
                  {/* TIMELINE: single pattern read */}
                  {mode === "timeline" && data.patternRead && (
                    <div>
                      <p className="text-[15px] md:text-base text-ink/85 leading-relaxed">
                        {data.patternRead}
                      </p>
                    </div>
                  )}

                  {/* DECISION: three blocks */}
                  {mode === "decision" && (
                    <>
                      <PerspectiveBlock label="Shift potential" body={data.shiftPotential} />
                      <PerspectiveBlock label="Risk signal" body={data.riskSignal} />
                    </>
                  )}

                  {/* Confidence row — shown in both modes */}
                  <div className="pt-4 border-t border-ink/6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${confidenceDot(data.confidence)}`} />
                      <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-ink/45">
                        Confidence · {data.confidence}
                      </span>
                    </div>
                    {data.confidenceNote && (
                      <div className="text-[12px] text-ink/55 leading-snug">
                        {data.confidenceNote}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-ink/6 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-ink/30">
                      Layered on top of structured decision logic
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

function PerspectiveBlock({ label, body }: { label: string; body: string }) {
  if (!body) return null;
  return (
    <div>
      <div className="eyebrow text-ink/35 mb-1.5">{label}</div>
      <p className="text-[14.5px] md:text-[15px] text-ink/85 leading-relaxed">{body}</p>
    </div>
  );
}
