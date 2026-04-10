"use client";

import { useState, useCallback, useEffect, useRef, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

/* ── Rotating processing messages ─────────────────────────── */

const PROCESSING_MESSAGES = [
  "Analyzing signals…",
  "Reading audience patterns…",
  "Generating decision…",
];

/* ── CSV classifier ────────────────────────────────────────── */

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

  if (hasSaveHigh && hasGrowth && !hasReachWeak) return { ...SAMPLES[0], filename: name };
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

/* ── Mode toggle ───────────────────────────────────────────── */

type Mode = "sample" | "own";

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-cream border border-ink/10">
      <button
        onClick={() => onChange("sample")}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${
            mode === "sample"
              ? "bg-paper text-ink shadow-[2px_2px_0_0_rgba(14,14,14,1)] border border-ink/15"
              : "text-ink/40 hover:text-ink/60"
          }
        `}
      >
        Try with sample data
      </button>
      <button
        onClick={() => onChange("own")}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${
            mode === "own"
              ? "bg-paper text-ink shadow-[2px_2px_0_0_rgba(14,14,14,1)] border border-ink/15"
              : "text-ink/40 hover:text-ink/60"
          }
        `}
      >
        Use your own data
      </button>
    </div>
  );
}

/* ── Page component ────────────────────────────────────────── */

export default function LensPage() {
  const [mode, setMode] = useState<Mode>("sample");
  const [pendingOutput, setPendingOutput] = useState<LensOutput | null>(null);
  const [result, setResult] = useState<LensOutput | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const msgInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStep: 1 | 2 | 3 = result ? 3 : pendingOutput ? 2 : 1;

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

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        selectFile(classifyCSV(text, file.name));
      };
      reader.readAsText(file);
    },
    [selectFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const resetAll = useCallback(() => {
    setPendingOutput(null);
    setResult(null);
    setLoadedFile(null);
    setCopied(false);
    setArtistName("");
    setTrackTitle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const switchMode = useCallback(
    (m: Mode) => {
      if (m === mode) return;
      setMode(m);
      resetAll();
    },
    [mode, resetAll]
  );

  const copyDecisionSummary = useCallback(() => {
    if (!result) return;
    const header =
      mode === "own" && (artistName || trackTitle)
        ? `*${[artistName, trackTitle].filter(Boolean).join(" — ")}*\n\n`
        : "";
    const summary =
      header +
      [
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
  }, [result, mode, artistName, trackTitle]);

  const canRun =
    pendingOutput !== null && (mode === "sample" || loadedFile !== null);

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
          <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Artist &amp; Track Lens
          </h1>
          <p className="text-ink/50 text-lg md:text-xl max-w-xl leading-relaxed">
            Drop in messy CSVs. Get a clear decision.
          </p>
        </motion.div>

        {/* ── Mode toggle + step indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <ModeToggle mode={mode} onChange={switchMode} />
          <StepIndicator current={currentStep} />
        </motion.div>

        {/* ── Main grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-[380px_1fr] gap-8"
        >
          {/* ── Left: Input column ── */}
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {mode === "sample" ? (
                /* ─── Sample mode ─── */
                <motion.div
                  key="sample-input"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[11px] text-ink/30 mb-3 uppercase tracking-widest font-semibold">
                    Sample files
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
                    Select a file to load. Each represents a different track scenario.
                  </p>
                </motion.div>
              ) : (
                /* ─── Own data mode ─── */
                <motion.div
                  key="own-input"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  {/* Artist + track inputs */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[11px] text-ink/40 mb-1.5 uppercase tracking-widest font-semibold">
                        Artist name
                      </label>
                      <input
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="e.g. K Trap"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/12 bg-cream text-sm text-ink/80 placeholder:text-ink/25 focus:outline-none focus:border-electric/40 focus:bg-paper transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-ink/40 mb-1.5 uppercase tracking-widest font-semibold">
                        Track title <span className="text-ink/20 normal-case font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={trackTitle}
                        onChange={(e) => setTrackTitle(e.target.value)}
                        placeholder="e.g. Single name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/12 bg-cream text-sm text-ink/80 placeholder:text-ink/25 focus:outline-none focus:border-electric/40 focus:bg-paper transition-all"
                      />
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      rounded-2xl border-2 border-dashed cursor-pointer
                      flex flex-col items-center justify-center
                      py-10 px-6 text-center transition-all
                      ${dragging ? "border-electric bg-electric/5" : "border-ink/15 bg-cream hover:border-ink/30"}
                    `}
                  >
                    {loadedFile && !analyzing ? (
                      <>
                        <div className="text-lg mb-1 opacity-30">✓</div>
                        <p className="text-sm text-ink/50 leading-relaxed">
                          <span className="font-mono text-ink/70">{loadedFile}</span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetAll();
                          }}
                          className="mt-2 text-xs text-ink/30 hover:text-ink/50 transition-colors cursor-pointer"
                        >
                          Clear &amp; start over
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl mb-2 opacity-40">↓</div>
                        <p className="text-sm text-ink/50 leading-relaxed">
                          Drop a Spotify CSV — or click to browse
                        </p>
                        <p className="text-[11px] text-ink/25 mt-1.5">
                          .csv from Spotify for Artists, Chartmetric, etc.
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Run analysis button */}
            <AnimatePresence>
              {canRun && !result && (
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

            {/* Run another after result */}
            {result && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={resetAll}
                className="w-full py-3 rounded-xl border border-ink/12 text-sm font-medium text-ink/50 hover:border-ink/25 hover:text-ink/70 transition-all cursor-pointer"
              >
                Run another analysis
              </motion.button>
            )}
          </div>

          {/* ── Right: Output column (identical in both modes) ── */}
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
                  {/* Optional context line for own-data mode */}
                  {mode === "own" && (artistName || trackTitle) && (
                    <div className="mb-4 text-xs text-ink/35 font-mono">
                      {[artistName, trackTitle].filter(Boolean).join(" — ")}
                    </div>
                  )}

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
                  <div className="mt-auto pt-5 border-t border-ink/6">
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

                  {/* COPY BUTTON */}
                  <div className="mt-6 pt-5 border-t border-ink/6">
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
                        : mode === "sample"
                        ? "Select a sample file to begin"
                        : "Drop a CSV to begin"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Collapsible "How it works" ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-20 border-t border-ink/8 pt-10"
        >
          <button
            onClick={() => setHowItWorksOpen((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div>
              <p className="eyebrow text-ink/40 mb-1.5">About this tool</p>
              <h2 className="font-display font-bold text-2xl text-ink/80 group-hover:text-ink transition-colors">
                How it works
              </h2>
            </div>
            <div
              className={`w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/40 group-hover:border-ink/30 group-hover:text-ink/60 transition-all ${
                howItWorksOpen ? "rotate-180" : ""
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          <AnimatePresence>
            {howItWorksOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-6 mt-6 pt-2">
                  <div>
                    <div className="eyebrow text-ink/30 mb-2">Inputs</div>
                    <ul className="text-sm text-ink/60 space-y-1.5 leading-relaxed">
                      <li>— Raw Spotify / streaming exports</li>
                      <li>— Noisy performance signals</li>
                      <li>— Mixed time windows</li>
                    </ul>
                  </div>
                  <div>
                    <div className="eyebrow text-ink/30 mb-2">What it reads</div>
                    <ul className="text-sm text-ink/60 space-y-1.5 leading-relaxed">
                      <li>— Save and skip patterns</li>
                      <li>— Reach trajectory</li>
                      <li>— Listener-to-follower conversion</li>
                    </ul>
                  </div>
                  <div>
                    <div className="eyebrow text-ink/30 mb-2">Outputs</div>
                    <ul className="text-sm text-ink/60 space-y-1.5 leading-relaxed">
                      <li>→ Clear health status</li>
                      <li>→ What's actually happening</li>
                      <li>→ What to do next</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-ink/50 leading-relaxed mt-8 max-w-2xl">
                  Most teams already have the data. They just don't have a shared way
                  to interpret signals and act on them consistently. This tool removes
                  the interpretation step and gives you a next move.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer strip ── */}
        <div className="mt-16 pt-6 border-t border-ink/8 flex items-center justify-between">
          <p className="text-[11px] text-ink/20">
            Add data → Run analysis → Get decision
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
    </div>
  );
}
