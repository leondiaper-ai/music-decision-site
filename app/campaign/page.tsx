"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────── */

type ArtistStage = "emerging" | "breaking" | "established";
type Decision = "PUSH" | "TEST" | "HOLD";

interface CampaignInput {
  trackName: string;
  artistStage: ArtistStage;
  budget: number; // 0–100 slider mapped to $500–$50k
}

interface ContentItem {
  format: string;
  count: number;
  timing: string;
}

interface AlternativeDecision {
  decision: Decision;
  confidence: number;
  reason: string;
}

interface CampaignOutput {
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  budgetAlloc: { label: string; pct: number; amount: string }[];
  content: ContentItem[];
  nextAction: string;
  reasoning: {
    label: string;
    value: string;
    detail: string;
  }[];
  alternatives: AlternativeDecision[];
  tradeoff: string;
  triggers: string[];
}

type Step = "input" | "simulating" | "output";

/* ─── Presentational Engine ─────────────────────────────── */

const BUDGET_MAP = (pct: number) =>
  Math.round(500 + (pct / 100) * 49500);

function formatBudget(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
}

function generateOutput(input: CampaignInput): CampaignOutput {
  const budget = BUDGET_MAP(input.budget);
  const isEmerging = input.artistStage === "emerging";
  const isEstablished = input.artistStage === "established";

  // Decision logic (presentational but plausible)
  let decision: Decision;
  let confidence: number;
  let risk: "Low" | "Medium" | "High";

  if (isEstablished && budget > 15000) {
    decision = "PUSH";
    confidence = 87;
    risk = "Low";
  } else if (isEmerging && budget < 5000) {
    decision = "TEST";
    confidence = 72;
    risk = "Medium";
  } else if (isEstablished) {
    decision = "PUSH";
    confidence = 78;
    risk = "Low";
  } else if (budget > 20000) {
    decision = "PUSH";
    confidence = 81;
    risk = "Medium";
  } else if (isEmerging) {
    decision = "TEST";
    confidence = 68;
    risk = "Medium";
  } else {
    decision = "HOLD";
    confidence = 64;
    risk = "High";
  }

  // Budget allocation
  const budgetAlloc =
    decision === "PUSH"
      ? [
          { label: "Paid media", pct: 45, amount: formatBudget(Math.round(budget * 0.45)) },
          { label: "Content production", pct: 30, amount: formatBudget(Math.round(budget * 0.3)) },
          { label: "Playlist / PR", pct: 15, amount: formatBudget(Math.round(budget * 0.15)) },
          { label: "Reserve", pct: 10, amount: formatBudget(Math.round(budget * 0.1)) },
        ]
      : decision === "TEST"
      ? [
          { label: "Content production", pct: 40, amount: formatBudget(Math.round(budget * 0.4)) },
          { label: "Paid testing", pct: 30, amount: formatBudget(Math.round(budget * 0.3)) },
          { label: "Organic push", pct: 20, amount: formatBudget(Math.round(budget * 0.2)) },
          { label: "Reserve", pct: 10, amount: formatBudget(Math.round(budget * 0.1)) },
        ]
      : [
          { label: "Content production", pct: 50, amount: formatBudget(Math.round(budget * 0.5)) },
          { label: "Audience research", pct: 30, amount: formatBudget(Math.round(budget * 0.3)) },
          { label: "Reserve", pct: 20, amount: formatBudget(Math.round(budget * 0.2)) },
        ];

  // Content plan
  const content: ContentItem[] =
    decision === "PUSH"
      ? [
          { format: "YouTube Shorts", count: 4, timing: "Week 1–2" },
          { format: "Lyric / Visualiser", count: 1, timing: "Day 1" },
          { format: "Creator collabs", count: 2, timing: "Week 2–3" },
          { format: "BTS / Studio content", count: 3, timing: "Week 1–4" },
        ]
      : decision === "TEST"
      ? [
          { format: "YouTube Shorts", count: 3, timing: "Week 1–2" },
          { format: "Lyric / Visualiser", count: 1, timing: "Week 1" },
          { format: "Organic clips", count: 2, timing: "Week 2" },
        ]
      : [
          { format: "BTS / Studio content", count: 2, timing: "Week 1–2" },
          { format: "Teaser clips", count: 2, timing: "Week 2–3" },
        ];

  // Next action
  const nextAction =
    decision === "PUSH"
      ? "Brief content team on Shorts. Lock paid media budget by Wednesday."
      : decision === "TEST"
      ? "Produce first Short this week. Monitor 48hr save rate before scaling."
      : "Hold spend. Focus on audience research and content development.";

  // Reasoning (System 2)
  const reasoning = [
    {
      label: "Save rate signal",
      value: decision === "PUSH" ? "Strong" : decision === "TEST" ? "Moderate" : "Weak",
      detail:
        decision === "PUSH"
          ? "Projected save rate above 4% based on artist stage and budget commitment. Strong intent signal."
          : decision === "TEST"
          ? "Save rate uncertain at this stage. Testing required to validate audience intent."
          : "Insufficient signal to justify spend. Need more data.",
    },
    {
      label: "Audience readiness",
      value: isEstablished ? "High" : isEmerging ? "Low" : "Medium",
      detail: isEstablished
        ? "Established audience base provides built-in reach multiplier."
        : isEmerging
        ? "No existing audience. All reach must be paid or earned."
        : "Growing audience. Organic reach supplements paid.",
    },
    {
      label: "Budget efficiency",
      value: budget > 20000 ? "High" : budget > 5000 ? "Medium" : "Tight",
      detail: `At ${formatBudget(budget)}, ${
        budget > 20000
          ? "budget supports full-scale campaign across channels."
          : budget > 5000
          ? "budget allows targeted approach with room to adapt."
          : "budget requires focused, high-efficiency tactics."
      }`,
    },
    {
      label: "Content velocity",
      value: decision === "PUSH" ? "Aggressive" : decision === "TEST" ? "Moderate" : "Minimal",
      detail:
        decision === "PUSH"
          ? "High output cadence to sustain momentum through release window."
          : decision === "TEST"
          ? "Enough content to test formats without over-committing."
          : "Minimal output until direction is clearer.",
    },
  ];

  // Alternatives
  const alternatives: AlternativeDecision[] =
    decision === "PUSH"
      ? [
          { decision: "TEST", confidence: 52, reason: "Lower risk, but misses the momentum window." },
          { decision: "HOLD", confidence: 23, reason: "Safe but loses competitive timing." },
        ]
      : decision === "TEST"
      ? [
          { decision: "PUSH", confidence: 41, reason: "Higher upside but budget doesn't support sustained push." },
          { decision: "HOLD", confidence: 38, reason: "Safer but delays learnings." },
        ]
      : [
          { decision: "TEST", confidence: 48, reason: "Could surface signal, but resource-intensive for current stage." },
          { decision: "PUSH", confidence: 19, reason: "Premature. Not enough data to justify." },
        ];

  const tradeoff =
    decision === "PUSH"
      ? "Favoring reach over depth. Prioritizing momentum."
      : decision === "TEST"
      ? "Favoring learning over scale. Prioritizing signal clarity."
      : "Favoring patience over action. Prioritizing data quality.";

  const triggers =
    decision === "PUSH"
      ? [
          "Save rate drops below 3% in first 48 hours → downgrade to TEST",
          "Day-3 streams decline >40% → reallocate to Shorts",
          "Playlist adds spike → increase paid support immediately",
        ]
      : decision === "TEST"
      ? [
          "Save rate exceeds 4.5% → upgrade to PUSH",
          "First Short hits 2x baseline → accelerate content cadence",
          "No signal after 7 days → downgrade to HOLD",
        ]
      : [
          "Organic save rate crosses 3% → upgrade to TEST",
          "New audience data available → re-evaluate",
          "Competitor release clears lane → consider earlier push",
        ];

  return {
    decision,
    confidence,
    risk,
    budgetAlloc,
    content,
    nextAction,
    reasoning,
    alternatives,
    tradeoff,
    triggers,
  };
}

/* ─── Simulation Messages ───────────────────────────────── */

const SIM_MESSAGES = [
  "Reading audience signals…",
  "Evaluating track strength…",
  "Generating campaign approach…",
  "Allocating budget…",
];

/* ─── Decision Color Map ────────────────────────────────── */

function decisionColor(d: Decision): string {
  return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";
}
function decisionBg(d: Decision): string {
  return d === "PUSH" ? "bg-signal" : d === "TEST" ? "bg-sun" : "bg-electric";
}
function riskColor(r: string): string {
  return r === "Low" ? "text-mint" : r === "Medium" ? "text-sun" : "text-signal";
}

/* ─── Main Page Component ───────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<Step>("input");
  const [input, setInput] = useState<CampaignInput>({
    trackName: "",
    artistStage: "breaking",
    budget: 30,
  });
  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [simIndex, setSimIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const outputRef = useRef<HTMLDivElement>(null);

  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    if (!input.trackName.trim()) return;
    setStep("simulating");
    setSimIndex(0);
  }, [input.trackName]);

  // Simulation stepper
  useEffect(() => {
    if (step !== "simulating") return;
    if (simIndex < SIM_MESSAGES.length) {
      const t = setTimeout(() => setSimIndex((i) => i + 1), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setOutput(generateOutput(input));
        setStep("output");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [step, simIndex, input]);

  // Scroll to output
  useEffect(() => {
    if (step === "output" && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setStep("input");
    setOutput(null);
    setSimIndex(0);
    setExpandedSections(new Set());
  }, []);

  const budgetValue = BUDGET_MAP(input.budget);

  return (
    <main className="min-h-screen bg-paper overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/70 border-b border-ink/5">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg"
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal" />
            decision/system_
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-ink/60 hover:text-signal transition-colors"
            >
              ← Overview
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-ink text-paper py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <span className="eyebrow text-paper/50 mb-4 block">
            Campaign System
          </span>
          <h1 className="headline font-display text-5xl md:text-7xl leading-[0.95]">
            AI runs
            <br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-paper/60 max-w-lg">
            From decision → content → spend → optimisation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
        {/* ── STEP 1: INPUT ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                01 — Input
              </span>

              {/* Track name */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-ink/60 mb-2">
                  Track name
                </label>
                <input
                  type="text"
                  value={input.trackName}
                  onChange={(e) =>
                    setInput((p) => ({ ...p, trackName: e.target.value }))
                  }
                  placeholder="e.g. Midnight Drive"
                  className="w-full rounded-xl border border-ink/15 bg-cream px-5 py-3.5 text-base text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors"
                />
              </div>

              {/* Artist stage */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-ink/60 mb-3">
                  Artist stage
                </label>
                <div className="flex gap-3">
                  {(
                    [
                      ["emerging", "Emerging"],
                      ["breaking", "Breaking"],
                      ["established", "Established"],
                    ] as [ArtistStage, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setInput((p) => ({ ...p, artistStage: value }))
                      }
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        input.artistStage === value
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/15 text-ink/70 hover:border-ink/30"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget slider */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-ink/60 mb-2">
                  Budget
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={input.budget}
                    onChange={(e) =>
                      setInput((p) => ({
                        ...p,
                        budget: Number(e.target.value),
                      }))
                    }
                    className="flex-1 h-2 rounded-full appearance-none bg-ink/10 accent-ink cursor-pointer"
                  />
                  <span className="font-display font-bold text-xl min-w-[5rem] text-right">
                    {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-ink/35 mt-1">
                  <span>$500</span>
                  <span>$50k</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleStart}
                disabled={!input.trackName.trim()}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-7 py-3.5 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Start Simulation
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: SIMULATION ──────────────────────── */}
          {step === "simulating" && (
            <motion.div
              key="simulating"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl py-16 md:py-24"
            >
              <span className="eyebrow text-ink/50 mb-8 block">
                02 — System
              </span>

              <div className="space-y-5">
                {SIM_MESSAGES.map((msg, i) => (
                  <motion.div
                    key={msg}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{
                      opacity: i <= simIndex ? 1 : 0.2,
                      x: 0,
                    }}
                    transition={{
                      delay: i * 0.15,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-4"
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                        i < simIndex
                          ? "bg-mint"
                          : i === simIndex
                          ? "bg-signal animate-pulse"
                          : "bg-ink/15"
                      }`}
                    />
                    <span
                      className={`font-display text-xl md:text-2xl transition-colors duration-500 ${
                        i <= simIndex ? "text-ink" : "text-ink/25"
                      }`}
                    >
                      {msg}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEPS 3+4: OUTPUT + DETAIL ──────────────── */}
          {step === "output" && output && (
            <motion.div
              key="output"
              ref={outputRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Core Output (System 1) ──────────────── */}
              <div className="mb-16 md:mb-24">
                <span className="eyebrow text-ink/50 mb-6 block">
                  03 — Output
                </span>

                {/* Decision hero */}
                <div className="rounded-2xl bg-ink text-paper p-8 md:p-12 mb-8">
                  <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
                    <div>
                      <p className="text-paper/50 text-sm mb-2">
                        {input.trackName}
                        <span className="text-paper/30 mx-2">·</span>
                        {input.artistStage}
                        <span className="text-paper/30 mx-2">·</span>
                        {formatBudget(budgetValue)}
                      </p>
                      <div className="font-display font-bold text-6xl md:text-8xl leading-none tracking-tight flex items-center gap-4">
                        <span className={decisionColor(output.decision)}>→</span>
                        <span>{output.decision}</span>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <div className="eyebrow text-paper/40 mb-1">
                          Confidence
                        </div>
                        <div className="font-display font-bold text-3xl">
                          {output.confidence}%
                        </div>
                      </div>
                      <div>
                        <div className="eyebrow text-paper/40 mb-1">Risk</div>
                        <div
                          className={`font-display font-bold text-3xl ${riskColor(
                            output.risk
                          )}`}
                        >
                          {output.risk}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget allocation */}
                  <div className="border-t border-paper/15 pt-6 mb-6">
                    <div className="eyebrow text-paper/40 mb-4">
                      Budget allocation
                    </div>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
                      {output.budgetAlloc.map((a) => (
                        <div
                          key={a.label}
                          style={{ width: `${a.pct}%` }}
                          className={`${decisionBg(output.decision)} opacity-${
                            a.pct > 30 ? "100" : a.pct > 15 ? "70" : "45"
                          } first:rounded-l-full last:rounded-r-full`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {output.budgetAlloc.map((a) => (
                        <div key={a.label}>
                          <div className="text-paper/50 text-xs mb-0.5">
                            {a.label}
                          </div>
                          <div className="font-display font-bold text-base">
                            {a.amount}{" "}
                            <span className="text-paper/40 font-normal text-xs">
                              ({a.pct}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content plan */}
                  <div className="border-t border-paper/15 pt-6 mb-6">
                    <div className="eyebrow text-paper/40 mb-4">
                      Content plan
                    </div>
                    <div className="divide-y divide-paper/10">
                      {output.content.map((c) => (
                        <div
                          key={c.format}
                          className="py-2.5 flex items-center justify-between"
                        >
                          <span className="text-paper/85 text-sm">
                            {c.format}
                          </span>
                          <span className="text-paper/55 text-sm">
                            ×{c.count}
                            <span className="text-paper/30 ml-2">
                              {c.timing}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next action */}
                  <div className="border-t border-paper/15 pt-6">
                    <div className="eyebrow text-paper/40 mb-2">
                      Next action this week
                    </div>
                    <p className="text-paper/90 text-base md:text-lg leading-snug flex items-start gap-3">
                      <span className="text-signal mt-0.5">→</span>
                      {output.nextAction}
                    </p>
                  </div>
                </div>

                {/* Tool connections */}
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="https://youtube-campaign-coach.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-5 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="eyebrow text-ink/40 mb-1">
                        Content plan →
                      </div>
                      <div className="font-display font-bold text-lg">
                        YouTube Campaign Coach
                      </div>
                    </div>
                    <span className="text-ink/30 group-hover:text-signal transition-colors">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://campaign-timeline-viewer.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-5 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="eyebrow text-ink/40 mb-1">
                        Timeline →
                      </div>
                      <div className="font-display font-bold text-lg">
                        Campaign Timeline
                      </div>
                    </div>
                    <span className="text-ink/30 group-hover:text-signal transition-colors">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              {/* ── System 2 (Expandable Detail) ────────── */}
              <div>
                <span className="eyebrow text-ink/50 mb-6 block">
                  04 — Detail
                </span>

                <div className="space-y-3">
                  {/* Reasoning */}
                  <ExpandableCard
                    title="Reasoning"
                    isOpen={expandedSections.has("reasoning")}
                    onToggle={() => toggleSection("reasoning")}
                  >
                    <div className="divide-y divide-ink/10">
                      {output.reasoning.map((r) => (
                        <div key={r.label} className="py-4 grid md:grid-cols-12 gap-3">
                          <div className="md:col-span-3">
                            <div className="text-sm text-ink/50">{r.label}</div>
                            <div className="font-display font-bold text-lg">
                              {r.value}
                            </div>
                          </div>
                          <div className="md:col-span-9 text-ink/70 text-sm leading-relaxed pt-1">
                            {r.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ExpandableCard>

                  {/* Alternatives */}
                  <ExpandableCard
                    title="Alternatives considered"
                    isOpen={expandedSections.has("alternatives")}
                    onToggle={() => toggleSection("alternatives")}
                  >
                    <div className="space-y-4">
                      {output.alternatives.map((alt) => (
                        <div
                          key={alt.decision}
                          className="flex items-start gap-4 p-4 rounded-xl bg-cream"
                        >
                          <span
                            className={`font-display font-bold text-xl ${decisionColor(
                              alt.decision
                            )}`}
                          >
                            {alt.decision}
                          </span>
                          <div className="flex-1">
                            <div className="text-sm text-ink/50 mb-0.5">
                              {alt.confidence}% confidence
                            </div>
                            <p className="text-sm text-ink/75">
                              {alt.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                      <p className="text-sm text-ink/55 italic pt-2">
                        Trade-off: {output.tradeoff}
                      </p>
                    </div>
                  </ExpandableCard>

                  {/* Triggers */}
                  <ExpandableCard
                    title="What would change this decision"
                    isOpen={expandedSections.has("triggers")}
                    onToggle={() => toggleSection("triggers")}
                  >
                    <ul className="space-y-3">
                      {output.triggers.map((t, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-ink/75"
                        >
                          <span className="text-signal mt-0.5 shrink-0">→</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </ExpandableCard>
                </div>
              </div>

              {/* Reset */}
              <div className="mt-16 pt-10 border-t border-ink/10">
                <button
                  onClick={handleReset}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  Run another simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ─── Expandable Card Component ─────────────────────────── */

function ExpandableCard({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream/50 transition-colors"
      >
        <span className="font-display font-bold text-base">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-ink/40 text-xl"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
