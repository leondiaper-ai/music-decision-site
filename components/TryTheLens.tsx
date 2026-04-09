"use client";

import { useState, useCallback, useEffect, useRef, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Sample states ─────────────────────────────────────────── */

interface LensOutput {
  filename: string;
  decision: string;
  decisionColor: string;
  why: string;
  actions: string[];
  signals: string[];
}

const SAMPLES: LensOutput[] = [
  {
    filename: "spotify_export_strong_intent.csv",
    decision: "PUSH — Momentum is real",
    decisionColor: "text-mint",
    why: "Audience is responding and broadening. Save rate is well above baseline and reach is expanding daily. This is the window.",
    actions: [
      "Scale paid spend now",
      "Increase content cadence to sustain momentum",
      "Brief commercial team — this is a priority push",
    ],
    signals: [
      "Save rate 40% above baseline",
      "Reach expanding day-on-day",
      "Listener-to-follower conversion trending up",
    ],
  },
  {
    filename: "spotify_export_weak_follow_through.csv",
    decision: "HOLD — Not ready to scale",
    decisionColor: "text-signal",
    why: "Strong initial spike but engagement dropped off fast. The audience isn't retaining — spending now would burn budget into a weak window.",
    actions: [
      "Hold all paid spend",
      "Revisit content strategy before next push",
      "Diagnose why listeners aren't coming back",
    ],
    signals: [
      "Strong day-one streams, sharp drop by day 3",
      "Save rate below baseline",
      "Skip rate rising across playlist placements",
    ],
  },
  {
    filename: "spotify_export_mixed_signals.csv",
    decision: "HOLD — Build before you spend",
    decisionColor: "text-sun",
    why: "Strong intent but reach is flattening early. The core audience is engaged but the track isn't reaching new listeners yet.",
    actions: [
      "Hold paid push",
      "Focus on content cadence and organic growth",
      "Build audience before scaling spend",
    ],
    signals: [
      "Save rate above baseline",
      "Reach flattening after day 3",
      "Growth not broadening beyond core audience",
    ],
  },
];

/* ── Rotating processing messages ─────────────────────────── */

const PROCESSING_MESSAGES = [
  "Analyzing signals…",
  "Reading audience patterns…",
  "Generating decision…",
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

/* ── Step indicator ────────────────────────────────────────── */

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Add data" },
    { num: 2, label: "Run analysis" },
    { num: 3, label: "Get decision" },
  ];

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isActive = step.num === current;
        const isDone = step.num < current;
        return (
          <div key={step.num} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${
                  isDone ? "bg-electric" : "bg-ink/12"
                } transition-colors`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${
                    isActive
                      ? "bg-electric text-paper"
                      : isDone
                      ? "bg-electric/20 text-electric"
                      : "bg-ink/8 text-ink/30"
                  }
                `}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-ink/70" : isDone ? "text-ink/40" : "text-ink/25"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Modal component ───────────────────────────────────────── */

interface TryTheLensProps {
  open: boolean;
  onClose: () => void;
}

export default function TryTheLens({ open, onClose }: TryTheLensProps) {
  const [pendingOutput, setPendingOutput] = useState<LensOutput | null>(null);
  const [result, setResult] = useState<LensOutput | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [entering, setEntering] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const msgInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Current step
  const currentStep: 1 | 2 | 3 = result
    ? 3
    : pendingOutput
    ? 2
    : 1;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPendingOutput(null);
      setResult(null);
      setLoadedFile(null);
      setAnalyzing(false);
      setCopied(false);
      setEntering(true);
      const t = setTimeout(() => setEntering(false), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Rotate processing messages
  useEffect(() => {
    if (analyzing) {
      setProcessingMsg(0);
      msgInterval.current = setInterval(() => {
        setProcessingMsg((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
      }, 400);
      return () => {
        if (msgInterval.current) clearInterval(msgInterval.current);
      };
    }
  }, [analyzing]);

  // Select a file (stage it, don't run yet)
  const selectFile = useCallback((output: LensOutput) => {
    setPendingOutput(output);
    setLoadedFile(output.filename);
    setResult(null);
    setCopied(false);
  }, []);

  // Run analysis
  const runAnalysis = useCallback(() => {
    if (!pendingOutput) return;
    setAnalyzing(true);
    setResult(null);
    const duration = 800 + Math.random() * 400; // 0.8–1.2s
    setTimeout(() => {
      setAnalyzing(false);
      setResult(pendingOutput);
    }, duration);
  }, [pendingOutput]);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const classified = classifyCSV(text, file.name);
        selectFile(classified);
      };
      reader.readAsText(file);
    },
    [selectFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  // Copy decision summary (Slack-ready format)
  const copyDecisionSummary = useCallback(() => {
    if (!result) return;
    const summary = [
      `*${result.decision}*`,
      ``,
      `${result.why}`,
      ``,
      `*What to do next:*`,
      ...result.actions.map((a) => `→ ${a}`),
      ``,
      `_Signals: ${result.signals.join(" · ")}_`,
      ``,
      `— Artist & Track Lens`,
    ].join("\n");

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[960px] max-h-[90vh] overflow-y-auto mx-4 rounded-3xl bg-paper border border-ink/10 shadow-2xl"
          >
            {/* Entering loader */}
            <AnimatePresence>
              {entering && (
                <motion.div
                  key="entering"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-20 rounded-3xl bg-paper flex items-center justify-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-5 h-5 border-2 border-ink/15 border-t-electric rounded-full animate-spin" />
                    <span className="text-sm text-ink/40">
                      Opening Artist &amp; Track Lens…
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-7 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-4">
                  <div className="bg-electric text-paper w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-base shrink-0 shadow-[3px_3px_0_0_rgba(14,14,14,1)]">
                    01
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl leading-snug">
                      Artist &amp; Track Lens
                    </h3>
                    <p className="text-ink/40 text-sm mt-1">
                      Quick Analysis
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-ink/30 hover:text-ink/60 transition-colors p-1 -m-1"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>

              {/* Step indicator */}
              <StepIndicator current={currentStep} />

              {/* Body */}
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
                    {loadedFile && !analyzing ? (
                      <>
                        <div className="text-lg mb-1 opacity-30">✓</div>
                        <p className="text-sm text-ink/50 leading-relaxed">
                          <span className="font-mono text-ink/70">
                            {loadedFile}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl mb-2 opacity-40">↓</div>
                        <p className="text-sm text-ink/50 leading-relaxed">
                          Drop a Spotify CSV — no cleanup needed
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
                          onClick={() => selectFile(s)}
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
                            <svg
                              width="14"
                              height="16"
                              viewBox="0 0 14 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 1.5h7.5L12.5 5.5v9a1 1 0 01-1 1h-9.5a1 1 0 01-1-1v-13a1 1 0 011-1z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                              />
                              <path
                                d="M8.5 1.5v4h4"
                                stroke="currentColor"
                                strokeWidth="1.2"
                              />
                            </svg>
                          </span>
                          <span className="font-mono text-[13px] text-ink/60 group-hover:text-ink/80 transition-colors truncate">
                            {s.filename}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Run analysis button */}
                  <AnimatePresence>
                    {pendingOutput && !result && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={runAnalysis}
                          disabled={analyzing}
                          className={`
                            w-full py-3.5 rounded-xl font-display font-bold text-sm tracking-wide
                            transition-all cursor-pointer
                            ${
                              analyzing
                                ? "bg-electric/60 text-paper/80 cursor-wait"
                                : "bg-electric text-paper hover:bg-electric/90 shadow-[3px_3px_0_0_rgba(14,14,14,1)] hover:shadow-[2px_2px_0_0_rgba(14,14,14,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                            }
                          `}
                        >
                          {analyzing ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="inline-block w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                              {PROCESSING_MESSAGES[processingMsg]}
                            </span>
                          ) : (
                            "Run analysis →"
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Right: Output ── */}
                <div className="min-h-[300px] flex items-stretch">
                  <AnimatePresence mode="wait">
                    {analyzing ? (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 rounded-2xl border border-ink/10 bg-cream flex items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-3 text-sm text-ink/40">
                          <span className="inline-block w-5 h-5 border-2 border-ink/20 border-t-electric rounded-full animate-spin" />
                          <motion.span
                            key={processingMsg}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {PROCESSING_MESSAGES[processingMsg]}
                          </motion.span>
                        </div>
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key={result.filename}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex-1 rounded-2xl border border-ink/10 bg-cream p-6 md:p-7 flex flex-col"
                      >
                        {/* ── DECISION — dominant block ── */}
                        <div className="mb-5 pb-5 border-b border-ink/8">
                          <div className="eyebrow text-ink/30 mb-2">
                            Decision
                          </div>
                          <div
                            className={`font-display font-black text-2xl md:text-3xl leading-tight tracking-tight ${result.decisionColor}`}
                          >
                            {result.decision}
                          </div>
                        </div>

                        {/* ── WHY — short explanation ── */}
                        <div className="mb-5">
                          <div className="eyebrow text-ink/30 mb-1.5">
                            Why
                          </div>
                          <p className="text-sm text-ink/70 leading-relaxed">
                            {result.why}
                          </p>
                        </div>

                        {/* ── WHAT TO DO NEXT — action bullets ── */}
                        <div className="mb-5">
                          <div className="eyebrow text-ink/30 mb-2">
                            What to do next
                          </div>
                          <ul className="space-y-1.5">
                            {result.actions.map((action) => (
                              <li
                                key={action}
                                className="flex items-start gap-2 text-sm text-ink/80 leading-relaxed font-medium"
                              >
                                <span className="text-signal mt-0.5 shrink-0">
                                  →
                                </span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ── SUPPORTING SIGNALS — lower priority ── */}
                        <div className="mt-auto pt-4 border-t border-ink/6">
                          <div className="eyebrow text-ink/20 mb-2">
                            Supporting signals
                          </div>
                          <ul className="space-y-1">
                            {result.signals.map((sig) => (
                              <li
                                key={sig}
                                className="flex items-start gap-2 text-[13px] text-ink/35 leading-relaxed"
                              >
                                <span className="mt-0.5 shrink-0">·</span>
                                {sig}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ── Copy button ── */}
                        <div className="mt-5 pt-4 border-t border-ink/6">
                          <button
                            onClick={copyDecisionSummary}
                            className="inline-flex items-center gap-2 text-sm font-medium text-ink/40 hover:text-ink/70 transition-colors cursor-pointer"
                          >
                            {copied ? (
                              <>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <path
                                    d="M3 7l3 3 5-6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Copied
                              </>
                            ) : (
                              <>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <rect
                                    x="4.5"
                                    y="4.5"
                                    width="8"
                                    height="8"
                                    rx="1.5"
                                  />
                                  <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
                                </svg>
                                Copy decision summary
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 rounded-2xl border border-dashed border-ink/10 bg-cream/50 flex items-center justify-center"
                      >
                        <div className="text-center px-6">
                          <p className="text-sm text-ink/25">
                            {pendingOutput
                              ? "Ready — hit Run analysis"
                              : "Select a file to begin"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-5 border-t border-ink/8 flex items-center justify-between">
                <p className="text-[11px] text-ink/25">
                  Input → Analysis → Decision
                </p>
                <a
                  href="https://pih-v2.vercel.app/label"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-electric hover:text-electric/80 transition-colors"
                >
                  View detailed breakdown
                  <span>→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
