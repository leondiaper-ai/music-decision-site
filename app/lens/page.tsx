"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FULL_TOOL_URL = "https://pih-v2.vercel.app/label";

/* ── Data model ────────────────────────────────────────────── */

type LensMode = "artist" | "track";

interface LensOutput {
  filename: string;
  source: string;
  includes: string;
  decision: string;
  decisionColor: string;
  why: string;
  actions: string[];
  signals: string[];
}

/* Artist-level scenarios — overall artist health & momentum */
const ARTIST_SAMPLES: LensOutput[] = [
  {
    filename: "s4a_artist_growth_spike_v2.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: listeners, streams, saves, source of streams",
    decision: "PUSH — Artist is compounding",
    decisionColor: "text-mint",
    why: "Listeners, follower velocity, and catalogue saves are all moving together. The whole artist surface is gaining mass — not a single-track spike.",
    actions: [
      "Lean into release cadence — strike while momentum compounds",
      "Brief commercial team — this artist is a priority",
      "Open conversations on partnerships and longer-term campaign budget",
    ],
    signals: [
      "Monthly listeners +28% over the last 30 days",
      "Follower conversion above genre baseline",
      "Catalogue saves growing across multiple tracks",
    ],
  },
  {
    filename: "spotify_artist_28d_export_plateau_case.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: listeners, streams, saves, source of streams",
    decision: "HOLD — Artist has plateaued",
    decisionColor: "text-signal",
    why: "Growth has stalled. Audience is stable but not expanding — no fresh reach, no new listener pull.",
    actions: [
      "Hold scaling spend until a new growth signal appears",
      "Invest in audience-development content, not push spend",
      "Re-evaluate after the next release cycle",
    ],
    signals: [
      "Monthly listeners flat over 60 days",
      "No new market or playlist breakthroughs",
      "Engagement healthy on existing core audience only",
    ],
  },
  {
    filename: "artist_export_low_reach_high_intent.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: listeners, streams, saves, source of streams",
    decision: "TEST — Early signals worth probing",
    decisionColor: "text-sun",
    why: "Intent is real but reach is thin. Enough signal to justify a contained test — not enough to commit full budget.",
    actions: [
      "Run a small, contained paid test against the strongest segment",
      "Increase content cadence in the responsive market",
      "Re-check signals in 14 days before any wider push",
    ],
    signals: [
      "Save rate trending up for 3 consecutive weeks",
      "Follower velocity above baseline in one key market",
      "Catalogue depth still shallow — needs reinforcement",
    ],
  },
];

/* Track-level scenarios — should this specific track scale */
const TRACK_SAMPLES: LensOutput[] = [
  {
    filename: "spotify_track_28d_strong_intent.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: streams, saves, skip rate, playlist source",
    decision: "PUSH — Track is ready to scale",
    decisionColor: "text-mint",
    why: "Save rate is well above baseline and reach is expanding daily. The track is pulling new listeners, not just retaining old ones.",
    actions: [
      "Scale paid spend on this track now",
      "Increase content cadence to sustain momentum",
      "Brief the team — this track is a priority push",
    ],
    signals: [
      "Save rate 40% above baseline",
      "Reach expanding day-on-day",
      "Listener-to-follower conversion trending up",
    ],
  },
  {
    filename: "track_export_weak_followthrough_case.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: streams, saves, skip rate, playlist source",
    decision: "HOLD — Not ready to scale yet",
    decisionColor: "text-signal",
    why: "Day-one spike, day-three drop. Audience isn't retaining — spend now and you burn budget into a weak window.",
    actions: [
      "Hold all paid spend on this track",
      "Revisit content strategy before the next push",
      "Diagnose why listeners aren't coming back",
    ],
    signals: [
      "Strong day-one streams, sharp drop by day 3",
      "Save rate below baseline",
      "Skip rate rising across playlist placements",
    ],
  },
  {
    filename: "track_export_mixed_signals_v3.csv",
    source: "Spotify for Artists export · Last 28 days",
    includes: "Includes: streams, saves, skip rate, playlist source",
    decision: "HOLD — Build before you spend",
    decisionColor: "text-sun",
    why: "Core audience is engaged but reach is flat. The track isn't pulling new listeners — scaling now wastes the spend.",
    actions: [
      "Hold paid push on this track",
      "Focus on content cadence and organic reach",
      "Build audience before scaling spend",
    ],
    signals: [
      "Save rate above baseline",
      "Reach flattening after day 3",
      "Growth not broadening beyond core audience",
    ],
  },
];

const PROCESSING_MESSAGES_ARTIST = [
  "Parsing Spotify export…",
  "Calculating listener depth (SPL)…",
  "Evaluating growth vs baseline…",
];

const PROCESSING_MESSAGES_TRACK = [
  "Parsing Spotify export…",
  "Calculating save rate + retention curve…",
  "Evaluating reach vs baseline…",
];

/* ── Lens copy ─────────────────────────────────────────────── */

const LENS_COPY: Record<LensMode, {
  title: string;
  eyebrow: string;
  subtitle: string;
  toggleContext: string;
  primaryCta: string;
  sampleEyebrow: string;
  sampleHelp: string;
  emptyHelper: string;
}> = {
  artist: {
    title: "Artist Lens",
    eyebrow: "Artist Lens · Growth & Health",
    subtitle: "This is what a real decision looks like.",
    toggleContext: "Evaluating artist-level momentum and growth",
    primaryCta: "Run analysis on your own export →",
    sampleEyebrow: "Sample artist data",
    sampleHelp: "Each file represents a different artist health scenario.",
    emptyHelper: "Select an artist sample to begin",
  },
  track: {
    title: "Track Lens",
    eyebrow: "Track Lens · Scale Decision",
    subtitle: "Should this track scale right now?",
    toggleContext: "Evaluating track-level scale readiness",
    primaryCta: "Upload your data → get decision",
    sampleEyebrow: "Example scenarios",
    sampleHelp: "Each file represents a different track scenario.",
    emptyHelper: "Select a track sample to begin",
  },
};

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

/* ── Lens toggle (inline switch) ───────────────────────────── */

function LensToggle({
  value,
  onChange,
}: {
  value: LensMode;
  onChange: (m: LensMode) => void;
}) {
  const opts: { key: LensMode; label: string }[] = [
    { key: "artist", label: "Artist Lens" },
    { key: "track", label: "Track Lens" },
  ];
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-ink/12 bg-cream">
      {opts.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-display font-bold tracking-wide
              transition-all cursor-pointer
              ${
                active
                  ? "bg-ink text-paper shadow-[2px_2px_0_0_rgba(44,37,255,1)]"
                  : "text-ink/45 hover:text-ink/80"
              }
            `}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Page component ────────────────────────────────────────── */

export default function LensPage() {
  const [lens, setLens] = useState<LensMode>("artist");
  const [pendingOutput, setPendingOutput] = useState<LensOutput | null>(null);
  const [result, setResult] = useState<LensOutput | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const msgInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep: 1 | 2 | 3 = result ? 3 : pendingOutput ? 2 : 1;
  const samples = lens === "artist" ? ARTIST_SAMPLES : TRACK_SAMPLES;
  const processingMessages =
    lens === "artist" ? PROCESSING_MESSAGES_ARTIST : PROCESSING_MESSAGES_TRACK;
  const copy = LENS_COPY[lens];

  useEffect(() => {
    if (analyzing) {
      setProcessingMsg(0);
      msgInterval.current = setInterval(() => {
        setProcessingMsg((prev) => (prev + 1) % processingMessages.length);
      }, 500);
      return () => {
        if (msgInterval.current) clearInterval(msgInterval.current);
      };
    }
  }, [analyzing, processingMessages.length]);

  const changeLens = useCallback((m: LensMode) => {
    setLens((prev) => {
      if (prev === m) return prev;
      setPendingOutput(null);
      setResult(null);
      setLoadedFile(null);
      setCopied(false);
      return m;
    });
  }, []);

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
    // ~1.5s total lets the 3 processing messages cycle at 500ms each
    const duration = 1500;
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
      `— ${lens === "artist" ? "Artist Lens" : "Track Lens"}`,
    ].join("\n");

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, lens]);

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
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="bg-electric text-paper w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs shadow-[2px_2px_0_0_rgba(14,14,14,1)]">
                01
              </div>
              <span className="text-sm font-display font-bold text-ink/70 hidden sm:inline">
                Artist &amp; Track Lens
              </span>
            </div>
            <a
              href={FULL_TOOL_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-4 py-2 text-xs font-display font-bold tracking-wide hover:bg-signal transition-colors shadow-[2px_2px_0_0_rgba(44,37,255,1)] hover:shadow-[3px_3px_0_0_rgba(44,37,255,1)]"
            >
              Open the tool
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 2h5v5M9 2L3.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-10 md:py-14">
        {/* ── Hero with inline lens toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-start justify-between gap-6 flex-wrap"
        >
          <div className="max-w-xl">
            <p className="eyebrow text-ink/40 mb-3">{copy.eyebrow}</p>
            <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight mb-3">
              {copy.title}
            </h1>
            <p className="text-ink/50 text-lg md:text-xl leading-relaxed">
              {copy.subtitle}
            </p>
          </div>
          <div className="pt-1 flex flex-col items-start md:items-end gap-2">
            <LensToggle value={lens} onChange={changeLens} />
            <p className="text-[11px] text-ink/40 leading-none">
              {copy.toggleContext}
            </p>
          </div>
        </motion.div>

        {/* ── Step indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mb-8"
        >
          <StepIndicator current={currentStep} />
        </motion.div>

          {/* Main grid */}
          <motion.div
            key={lens}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-[380px_1fr] gap-8"
          >
              {/* ── Left: Sample input ── */}
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[11px] text-ink/30 mb-3 uppercase tracking-widest font-semibold">
                    {copy?.sampleEyebrow}
                  </p>
                  <div className="flex flex-col gap-2">
                    {samples.map((s) => (
                      <button
                        key={s.filename}
                        onClick={() => selectFile(s)}
                        className={`
                          group flex items-start gap-2.5 px-3.5 py-3
                          rounded-xl text-left
                          border transition-all cursor-pointer
                          ${
                            loadedFile === s.filename
                              ? "border-electric/30 bg-electric/5"
                              : "border-ink/10 bg-cream hover:border-ink/25"
                          }
                        `}
                      >
                        <span className="shrink-0 text-ink/25 text-xs mt-0.5">
                          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5h7.5L12.5 5.5v9a1 1 0 01-1 1h-9.5a1 1 0 01-1-1v-13a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M8.5 1.5v4h4" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </span>
                        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                          <span className="font-mono text-[12px] text-ink/65 group-hover:text-ink/85 transition-colors truncate">
                            {s.filename}
                          </span>
                          <span className="text-[10px] text-ink/30 leading-snug">
                            {s.source}
                          </span>
                          <span className="text-[10px] text-ink/25 leading-snug">
                            {s.includes}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-ink/25 mt-3 leading-relaxed">
                    {copy?.sampleHelp}
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
                            {processingMessages[processingMsg]}
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
                      {copy.primaryCta}
                    </a>
                    <p className="text-[11px] text-ink/40 leading-relaxed -mt-0.5 px-1">
                      Drop in your own Spotify for Artists export to get a real decision
                    </p>
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
                          {processingMessages[processingMsg]}
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
                        <div className="eyebrow text-ink/30 mb-2">Engine result</div>
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

                      {/* SYSTEM SIGNAL — reinforces that the decision is systematic */}
                      <p className="mt-5 pt-4 border-t border-ink/6 text-[10px] tracking-[0.14em] uppercase font-mono text-ink/30">
                        Based on 28d performance vs baseline patterns
                      </p>

                      {/* Bottom action row */}
                      <div className="mt-5 pt-4 border-t border-ink/6 flex items-center gap-4 flex-wrap">
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
                            : copy?.emptyHelper}
                        </p>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </motion.div>

        {/* ── Footer strip ── */}
        <div className="mt-12 pt-6 border-t border-ink/8">
          <p className="text-[11px] text-ink/20">
            Add data → Run analysis → Get decision
          </p>
        </div>
      </div>
    </div>
  );
}
