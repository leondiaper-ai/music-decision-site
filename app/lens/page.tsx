"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FULL_TOOL_URL = "https://pih-v2.vercel.app/label";

/* ── Data model ────────────────────────────────────────────── */

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

const PROCESSING_MESSAGES = [
  "Analyzing signals…",
  "Reading audience patterns…",
  "Generating decision…",
];

/* ── Step indicator ────────────────────────────────────────── */

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Add data" },
    { num: 2, label: "Run analysis" },
    { num: 3, label: "Get decision" },
  ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = step.num === current;
        const isDone = step.num < current;
        return (
          <div key={step.num} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${isDone ? "bg-electric" : "bg-ink/12"} transition-colors`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${isActive ? "bg-electric text-paper" : isDone ? "bg-electric/20 text-electric" : "bg-ink/8 text-ink/30"}
                `}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

/* ── Page component ────────────────────────────────────────── */

export default function LensPage() {
  const [pendingOutput, setPendingOutput] = useState<LensOutput | null>(null);
  const [result, setResult] = useState<LensOutput | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const msgInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep: 1 | 2 | 3 = result ? 3 : pendingOutput ? 2 : 1;

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

  const selectFile = useCallback((output: LensOutput) => {
    setPendingOutput(output);
    setLoadedFile(output.filename);
    setResult(null);
    setCopied(false);
  }, []);

  const runAnalysis = useCallback(() => {
    if (!pendingOutput) return;
    setAnalyzing(true);
    setResult(null);
    const duration = 800 + Math.random() * 400;
    setTimeout(() => {
      setAnalyzing(false);
      setResult(pendingOutput);
    }, duration);
  }, [pendingOutput]);

  const resetAll = useCallback(() => {
    setPendingOutput(null);
    setResult(null);
    setLoadedFile(null);
    setCopied(false);
  }, []);

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
    <div className="min-h-screen bg-paper">
      {/* ── Top bar ── */}
      <header className="border-b border-ink/8">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-ink/40 hover:text-ink/60 transition-colors flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to overview
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-electric text-paper w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs shadow-[2px_2px_0_0_rgba(14,14,14,1)]">
              01
            </div>
            <span className="text-sm font-display font-bold text-ink/70">
              Artist &amp; Track Lens
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-10 md:py-14">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="eyebrow text-ink/40 mb-3">A guided entry point</p>
          <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Artist &amp; Track Lens
          </h1>
          <p className="text-ink/50 text-lg md:text-xl max-w-xl leading-relaxed">
            Try it with sample data. See how the tool turns messy CSVs into a clear decision.
          </p>
        </motion.div>

        {/* ── Step indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <StepIndicator current={currentStep} />
        </motion.div>

        {/* ── Main grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-[380px_1fr] gap-8"
        >
          {/* ── Left: Sample input ── */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[11px] text-ink/30 mb-3 uppercase tracking-widest font-semibold">
                Try with sample data
              </p>
              <div className="flex flex-col gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.filename}
                    onClick={() => selectFile(s)}
                    className={`
                      group flex items-center gap-2.5 px-3.5 py-3
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
                        <path d="M1 1.5h7.5L12.5 5.5v9a1 1 0 01-1 1h-9.5a1 1 0 01-1-1v-13a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M8.5 1.5v4h4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                    <span className="font-mono text-[13px] text-ink/60 group-hover:text-ink/80 transition-colors truncate">
                      {s.filename}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-ink/25 mt-3 leading-relaxed">
                Each file represents a different track scenario.
              </p>
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

            {/* After-result actions */}
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-2.5"
              >
                <a
                  href={FULL_TOOL_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-3.5 rounded-xl bg-ink text-paper font-display font-bold text-sm tracking-wide text-center transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(44,37,255,1)] hover:shadow-[2px_2px_0_0_rgba(44,37,255,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  Run this on your own data →
                </a>
                <button
                  onClick={resetAll}
                  className="w-full py-2.5 rounded-xl border border-ink/12 text-sm font-medium text-ink/50 hover:border-ink/25 hover:text-ink/70 transition-all cursor-pointer"
                >
                  Try another sample
                </button>
              </motion.div>
            )}
          </div>

          {/* ── Right: Output panel ── */}
          <div className="min-h-[400px] flex items-stretch">
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
                  key={result.filename + "-result"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 rounded-2xl border border-ink/10 bg-cream p-7 md:p-9 flex flex-col"
                >
                  {/* DECISION */}
                  <div className="mb-6 pb-6 border-b border-ink/8">
                    <div className="eyebrow text-ink/30 mb-2">Decision</div>
                    <div className={`font-display font-black text-3xl md:text-4xl leading-tight tracking-tight ${result.decisionColor}`}>
                      {result.decision}
                    </div>
                  </div>

                  {/* WHY */}
                  <div className="mb-6">
                    <div className="eyebrow text-ink/30 mb-1.5">Why</div>
                    <p className="text-sm md:text-base text-ink/70 leading-relaxed">
                      {result.why}
                    </p>
                  </div>

                  {/* WHAT TO DO NEXT */}
                  <div className="mb-6">
                    <div className="eyebrow text-ink/30 mb-2">What to do next</div>
                    <ul className="space-y-2">
                      {result.actions.map((action) => (
                        <li key={action} className="flex items-start gap-2 text-sm md:text-base text-ink/80 leading-relaxed font-medium">
                          <span className="text-signal mt-0.5 shrink-0">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SUPPORTING SIGNALS */}
                  <div className="pt-5 border-t border-ink/6">
                    <div className="eyebrow text-ink/20 mb-2">Supporting signals</div>
                    <ul className="space-y-1">
                      {result.signals.map((sig) => (
                        <li key={sig} className="flex items-start gap-2 text-[13px] text-ink/35 leading-relaxed">
                          <span className="mt-0.5 shrink-0">·</span>
                          {sig}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom action row */}
                  <div className="mt-6 pt-5 border-t border-ink/6 flex items-center justify-between gap-4 flex-wrap">
                    <button
                      onClick={copyDecisionSummary}
                      className="inline-flex items-center gap-2 text-sm font-medium text-ink/40 hover:text-ink/70 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Copied to clipboard
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
                            <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
                          </svg>
                          Copy decision summary
                        </>
                      )}
                    </button>
                    <a
                      href={FULL_TOOL_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-electric hover:text-electric/80 transition-colors"
                    >
                      Run this on your own data
                      <span>→</span>
                    </a>
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
                  <div className="text-center px-8">
                    <div className="text-3xl mb-3 opacity-15">↗</div>
                    <p className="text-sm text-ink/25">
                      {pendingOutput
                        ? "Ready — hit Run analysis"
                        : "Select a sample file to begin"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Artist Health Decision Engine — explains what just happened ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="engine-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 rounded-3xl bg-cream border border-ink/10 p-8 md:p-10 shadow-[8px_8px_0_0_rgba(14,14,14,1)]"
            >
              <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-ink/40 mb-3">
                Under the read
              </p>
              <h2 className="font-display font-black text-2xl md:text-3xl leading-tight tracking-tight mb-3">
                Artist Health
                <br />
                <span className="italic font-light text-ink/70">Decision Engine</span>
              </h2>
              <p className="text-sm md:text-base text-ink/55 leading-relaxed max-w-xl mb-7">
                Every decision is built from three steps. You just saw the full loop.
              </p>

              {/* Engine flow: Artist → Signals → Decision */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {[
                  { label: "Artist", accent: "bg-electric text-paper" },
                  { label: "Signals", accent: "bg-sun text-ink" },
                  { label: "Decision", accent: "bg-signal text-paper" },
                ].map((node, i, arr) => (
                  <div key={node.label} className="flex items-center gap-2 md:gap-3">
                    <div
                      className={`${node.accent} px-4 md:px-5 py-2.5 rounded-full font-display font-bold text-sm md:text-base shadow-[3px_3px_0_0_rgba(14,14,14,1)]`}
                    >
                      {node.label}
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-ink/30 text-xl md:text-2xl select-none" aria-hidden>
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Compact "Where this sits" ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-2xl border border-ink/10 bg-cream/70 px-6 md:px-8 py-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-md">
              <p className="eyebrow text-ink/40 mb-2">Where this sits</p>
              <p className="text-sm text-ink/65 leading-relaxed">
                Artist &amp; Track Lens is the first read in a larger system.
                It answers two questions before any campaign or budget moves:{" "}
                <span className="text-ink/85 font-medium">
                  is there real momentum, and is this ready to scale?
                </span>
              </p>
              <p className="font-display font-bold text-sm text-ink mt-3">
                Not a dashboard. <span className="text-electric">The first decision layer.</span>
              </p>
            </div>

            {/* Compact system flow */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: "Artist", active: false },
                { label: "Track", active: true },
                { label: "Campaign", active: false },
                { label: "YouTube", active: false },
                { label: "Decision", active: false, terminal: true },
              ].map((node, i, arr) => (
                <div key={node.label} className="flex items-center gap-1.5">
                  <div
                    className={`
                      px-2.5 py-1 rounded-lg border text-[11px] font-display font-bold transition-all
                      ${
                        node.active
                          ? "bg-electric text-paper border-electric"
                          : node.terminal
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper text-ink/45 border-ink/15"
                      }
                    `}
                  >
                    {node.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span
                      className={`text-xs ${
                        node.active || arr[i + 1].active ? "text-electric" : "text-ink/20"
                      }`}
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Footer strip ── */}
        <div className="mt-10 pt-6 border-t border-ink/8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[11px] text-ink/20">
            Add data → Run analysis → Get decision
          </p>
          <a
            href={FULL_TOOL_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-electric hover:text-electric/80 transition-colors"
          >
            Run this on your own data
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
