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
  budget: number;
}

interface CulturalContext {
  campaignType: string;
  reference: string;
  tone: string;
  intent: string;
  constraint: string;
}

interface SignalRead {
  label: string;
  value: string;
  strength: "strong" | "moderate" | "weak";
}

interface Tension {
  signal: string;
  culture: string;
  resolution: string;
}

interface CapitalAction {
  action: string;
  rationale: string;
  amount: string;
}

interface ExecutionDirective {
  label: string;
  detail: string;
}

interface MonitorTrigger {
  condition: string;
  response: string;
}

interface SystemOutput {
  culture: CulturalContext;
  signals: SignalRead[];
  tension: Tension;
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  decisionReason: string;
  capitalActions: CapitalAction[];
  execution: ExecutionDirective[];
  triggers: MonitorTrigger[];
}

/* ─── Engine ────────────────────────────────────────────── */

const BUDGET_MAP = (pct: number) => Math.round(500 + (pct / 100) * 49500);

function formatBudget(n: number): string {
  return n >= 1000
    ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
    : `$${n}`;
}

function generate(input: CampaignInput): SystemOutput {
  const budget = BUDGET_MAP(input.budget);
  const isEmerging = input.artistStage === "emerging";
  const isEstablished = input.artistStage === "established";

  // ── Culture ──
  const culture: CulturalContext = isEmerging
    ? {
        campaignType: "Discovery campaign",
        reference: "Raw studio session, first headline show energy",
        tone: "Lo-fi, raw, unfiltered",
        intent: "Authenticity + discovery",
        constraint: "No over-polished assets. Nothing that breaks the narrative.",
      }
    : isEstablished
    ? {
        campaignType: "Scale campaign",
        reference: "Arena-level confidence, catalogue moment",
        tone: "Cinematic, high-production",
        intent: "Scale + cultural positioning",
        constraint: "No cheap reach. Everything must match stature.",
      }
    : {
        campaignType: "Momentum campaign",
        reference: "Breakout single, underground-to-mainstream crossover",
        tone: "Energetic, narrative-driven",
        intent: "Credibility + momentum",
        constraint: "No generic content. Every asset must build the story.",
      };

  // ── Signals ──
  const signals: SignalRead[] = isEstablished
    ? [
        { label: "Save rate", value: "5.1%", strength: "strong" },
        { label: "Audience reach", value: "+24%", strength: "strong" },
        { label: "Playlist velocity", value: "High", strength: "strong" },
        { label: "Early skip rate", value: "18%", strength: "moderate" },
      ]
    : isEmerging
    ? [
        { label: "Save rate", value: "3.2%", strength: "moderate" },
        { label: "Audience reach", value: "−12%", strength: "weak" },
        { label: "Playlist velocity", value: "Low", strength: "weak" },
        { label: "Early engagement", value: "High", strength: "strong" },
      ]
    : [
        { label: "Save rate", value: "4.1%", strength: "strong" },
        { label: "Audience reach", value: "+8%", strength: "moderate" },
        { label: "Playlist velocity", value: "Medium", strength: "moderate" },
        { label: "Early engagement", value: "High", strength: "strong" },
      ];

  // ── Decision ──
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

  // ── Tension ──
  const tension: Tension = isEmerging
    ? {
        signal: "Strong early engagement suggests scaling potential",
        culture: "But cultural context requires raw, authentic positioning",
        resolution:
          decision === "TEST"
            ? "System resolves: validate signal before scaling. Protect the narrative."
            : "System resolves: hold until signal is strong enough to scale without compromising authenticity.",
      }
    : isEstablished
    ? {
        signal: "Strong signal across all metrics supports aggressive deployment",
        culture: "Cultural context demands premium execution at every touchpoint",
        resolution:
          "System resolves: push aggressively, but every asset must match stature. No cheap reach.",
      }
    : {
        signal: "Mixed signal — strong engagement, moderate reach",
        culture: "Narrative positioning requires credibility over volume",
        resolution:
          decision === "PUSH"
            ? "System resolves: push with narrative-first content. Story over scale."
            : decision === "TEST"
            ? "System resolves: test narrative formats before committing budget to scale."
            : "System resolves: hold and strengthen narrative foundation before spending.",
      };

  // ── Decision reason ──
  const decisionReason =
    decision === "PUSH"
      ? `Signal supports deployment. Cultural direction (${culture.intent.toLowerCase()}) aligns with current momentum.`
      : decision === "TEST"
      ? `Signal is promising but unconfirmed. Deploying capital to validate within ${culture.tone.toLowerCase()} framework.`
      : `Insufficient signal to justify spend. Holding until data supports deployment within cultural context.`;

  // ── Capital actions (directional, not static bars) ──
  const capitalActions: CapitalAction[] =
    decision === "PUSH"
      ? [
          {
            action: "Increase content investment",
            rationale: `Narrative-driven assets aligned with ${culture.tone.toLowerCase()} direction`,
            amount: formatBudget(Math.round(budget * 0.35)),
          },
          {
            action: "Scale paid reach",
            rationale: "Signal confirms audience. Deploy to extend momentum.",
            amount: formatBudget(Math.round(budget * 0.4)),
          },
          {
            action: "Activate creator network",
            rationale: "Targeted voices that match campaign positioning",
            amount: formatBudget(Math.round(budget * 0.15)),
          },
          {
            action: "Hold reserve",
            rationale: "Available for reallocation based on week-1 signal",
            amount: formatBudget(Math.round(budget * 0.1)),
          },
        ]
      : decision === "TEST"
      ? [
          {
            action: "Increase content investment",
            rationale: "Test formats within cultural frame before scaling",
            amount: formatBudget(Math.round(budget * 0.4)),
          },
          {
            action: "Delay paid spend",
            rationale: "Organic-first. Paid only after 48hr signal confirmation.",
            amount: formatBudget(Math.round(budget * 0.25)),
          },
          {
            action: "Focus on audience understanding",
            rationale: "Map response patterns before committing budget",
            amount: formatBudget(Math.round(budget * 0.2)),
          },
          {
            action: "Hold reserve",
            rationale: "Larger reserve for rapid reallocation if signal confirms",
            amount: formatBudget(Math.round(budget * 0.15)),
          },
        ]
      : [
          {
            action: "Hold all paid spend",
            rationale: "No deployment until signal justifies it",
            amount: formatBudget(Math.round(budget * 0)),
          },
          {
            action: "Invest in audience research",
            rationale: "Build understanding before building campaign",
            amount: formatBudget(Math.round(budget * 0.35)),
          },
          {
            action: "Minimal content production",
            rationale: `Baseline ${culture.tone.toLowerCase()} assets only`,
            amount: formatBudget(Math.round(budget * 0.35)),
          },
          {
            action: "Full reserve",
            rationale: "Capital preserved for deployment when signal arrives",
            amount: formatBudget(Math.round(budget * 0.3)),
          },
        ];

  // ── Execution ──
  const execution: ExecutionDirective[] =
    decision === "PUSH"
      ? culture.tone.includes("Lo-fi")
        ? [
            { label: "Content direction", detail: "Raw, unpolished assets. Avoid over-production." },
            { label: "Creator strategy", detail: "Authentic voices only. Storytelling over reach." },
            { label: "Platform timing", detail: "Front-load organic, scale paid after 48hr signal." },
          ]
        : culture.tone.includes("Cinematic")
        ? [
            { label: "Content direction", detail: "High-production hero assets. Cinematic first impression." },
            { label: "Creator strategy", detail: "Established voices + editorial placements." },
            { label: "Platform timing", detail: "Simultaneous paid + organic. Maximise day-1 reach." },
          ]
        : [
            { label: "Content direction", detail: "Narrative-driven assets. Story over volume." },
            { label: "Creator strategy", detail: "Genre-adjacent creators who build credibility." },
            { label: "Platform timing", detail: "Staggered rollout. Build momentum across 7 days." },
          ]
      : decision === "TEST"
      ? [
          { label: "Content direction", detail: `${culture.tone} content. Test formats before committing.` },
          { label: "Creator strategy", detail: "Micro-creators. Alignment over follower count." },
          { label: "Platform timing", detail: "Organic first. Paid only after signal confirms." },
        ]
      : [
          { label: "Content direction", detail: `Minimal output. ${culture.tone} tone when ready.` },
          { label: "Creator strategy", detail: "Hold outreach. Research aligned voices." },
          { label: "Platform timing", detail: "No paid spend until signal justifies." },
        ];

  // ── Monitor triggers ──
  const triggers: MonitorTrigger[] =
    decision === "PUSH"
      ? [
          { condition: "Save rate drops below 3%", response: "Downgrade to TEST. Pause paid." },
          { condition: "Day-3 streams decline >40%", response: "Reallocate budget to Shorts." },
          { condition: "Playlist adds spike", response: "Increase paid support immediately." },
        ]
      : decision === "TEST"
      ? [
          { condition: "Save rate exceeds 4.5%", response: "Upgrade to PUSH. Scale spend." },
          { condition: "First Short hits 2× baseline", response: "Accelerate content cadence." },
          { condition: "No signal after 7 days", response: "Downgrade to HOLD. Preserve capital." },
        ]
      : [
          { condition: "Organic save rate crosses 3%", response: "Upgrade to TEST. Begin deployment." },
          { condition: "New audience data available", response: "Re-evaluate cultural frame." },
          { condition: "Competitor clears lane", response: "Consider earlier activation." },
        ];

  return {
    culture,
    signals,
    tension,
    decision,
    confidence,
    risk,
    decisionReason,
    capitalActions,
    execution,
    triggers,
  };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision): string {
  return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";
}
function signalDot(s: "strong" | "moderate" | "weak"): string {
  return s === "strong" ? "bg-mint" : s === "moderate" ? "bg-sun" : "bg-signal";
}

/* ─── System Run Phases ─────────────────────────────────── */

const PHASE_COUNT = 7; // 0-indexed: culture, signals, tension, decision, capital, execution, monitor
const PHASE_DELAY = 1200; // ms between phases

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "running" | "complete">("input");
  const [input, setInput] = useState<CampaignInput>({
    trackName: "",
    artistStage: "breaking",
    budget: 30,
  });
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [phase, setPhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const budgetValue = BUDGET_MAP(input.budget);

  const handleStart = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("running");
    setPhase(0);
  }, [input]);

  // Progressive phase reveal
  useEffect(() => {
    if (step !== "running") return;
    if (phase < PHASE_COUNT - 1) {
      const t = setTimeout(() => setPhase((p) => p + 1), PHASE_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setStep("complete"), 600);
      return () => clearTimeout(t);
    }
  }, [step, phase]);

  // Scroll to latest phase
  useEffect(() => {
    if (step === "running" || step === "complete") {
      const el = phaseRefs.current[phase];
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
    }
  }, [step, phase]);

  const handleReset = useCallback(() => {
    setStep("input");
    setOutput(null);
    setPhase(0);
  }, []);

  const visible = (i: number) => phase >= i || step === "complete";

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: visible(i) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] },
  });

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
          <Link
            href="/"
            className="text-sm text-ink/60 hover:text-signal transition-colors"
          >
            ← Overview
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-ink text-paper py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <span className="eyebrow text-paper/50 mb-4 block">Campaign System</span>
          <p className="text-paper/45 text-sm md:text-base mb-4">
            Most music marketing spend is guesswork.
          </p>
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
        <AnimatePresence mode="wait">
          {/* ── INPUT ───────────────────────────────────── */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="eyebrow text-ink/50 mb-6 block">Input</span>

              <div className="mb-8">
                <label className="block text-sm font-medium text-ink/60 mb-2">Track name</label>
                <input
                  type="text"
                  value={input.trackName}
                  onChange={(e) => setInput((p) => ({ ...p, trackName: e.target.value }))}
                  placeholder="e.g. Midnight Drive"
                  className="w-full rounded-xl border border-ink/15 bg-cream px-5 py-3.5 text-base text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-ink/60 mb-3">Artist stage</label>
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
                      onClick={() => setInput((p) => ({ ...p, artistStage: value }))}
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

              <div className="mb-10">
                <label className="block text-sm font-medium text-ink/60 mb-2">Budget</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={input.budget}
                    onChange={(e) => setInput((p) => ({ ...p, budget: Number(e.target.value) }))}
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

              <button
                onClick={handleStart}
                disabled={!input.trackName.trim()}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-7 py-3.5 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Run System
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SYSTEM RUN (progressive reveal) ───────── */}
        {(step === "running" || step === "complete") && output && (
          <div className="space-y-16 md:space-y-24">
            {/* ── Phase 0: Cultural Context ────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[0] = el; }}
              {...fade(0)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                01 — Setting cultural context
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Campaign type
                    </div>
                    <p className="font-display font-bold text-lg">{output.culture.campaignType}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Reference
                    </div>
                    <p className="text-sm text-ink/70">{output.culture.reference}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">Tone</div>
                    <p className="font-display font-bold text-base">{output.culture.tone}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">Intent</div>
                    <p className="font-display font-bold text-base">{output.culture.intent}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">Constraint</div>
                    <p className="text-sm text-ink/65 italic">{output.culture.constraint}</p>
                  </div>
                </div>
                <p className="text-sm text-ink/45 border-t border-ink/10 pt-4">
                  This defines how the system behaves.
                </p>
              </div>
            </motion.div>

            {/* ── Phase 1: Signal Read ─────────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[1] = el; }}
              {...fade(1)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                02 — Reading signal within cultural context
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {output.signals.map((s) => (
                  <div key={s.label} className="rounded-xl border border-ink/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${signalDot(s.strength)}`} />
                      <span className="text-xs text-ink/45 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="font-display font-bold text-xl">{s.value}</div>
                    <div className="text-xs text-ink/40 mt-1 capitalize">{s.strength}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Phase 2: Tension ─────────────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[2] = el; }}
              {...fade(2)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                03 — System tension
              </span>
              <div className="rounded-xl bg-cream border border-ink/10 p-6 md:p-8">
                <div className="space-y-4 mb-6">
                  <p className="text-base md:text-lg text-ink/80">
                    <span className="text-mint font-medium">Signal:</span>{" "}
                    {output.tension.signal}
                  </p>
                  <p className="text-base md:text-lg text-ink/80">
                    <span className="text-signal font-medium">But:</span>{" "}
                    {output.tension.culture}
                  </p>
                </div>
                <div className="border-t border-ink/15 pt-4">
                  <p className="text-sm text-ink/65 flex items-start gap-2">
                    <span className="text-electric mt-0.5 shrink-0">→</span>
                    {output.tension.resolution}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Phase 3: Decision ────────────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[3] = el; }}
              {...fade(3)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                04 — Decision
              </span>
              <div className="rounded-2xl bg-ink text-paper p-8 md:p-12">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
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
                      <div className="eyebrow text-paper/40 mb-1">Confidence</div>
                      <div className="font-display font-bold text-3xl">{output.confidence}%</div>
                    </div>
                    <div>
                      <div className="eyebrow text-paper/40 mb-1">Risk</div>
                      <div className={`font-display font-bold text-3xl ${
                        output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"
                      }`}>
                        {output.risk}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-paper/65 text-base leading-snug">
                  {output.decisionReason}
                </p>
                <p className="text-paper/40 text-sm mt-4 italic">
                  Culture defines the rules. Data decides the moves.
                </p>
              </div>
            </motion.div>

            {/* ── Phase 4: Capital Actions ─────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[4] = el; }}
              {...fade(4)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                05 — Capital deployment
              </span>
              <div className="space-y-3">
                {output.capitalActions.map((ca) => (
                  <div
                    key={ca.action}
                    className="rounded-xl border border-ink/10 p-5 flex flex-wrap items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-display font-bold text-base mb-1">{ca.action}</div>
                      <p className="text-sm text-ink/55">{ca.rationale}</p>
                    </div>
                    <div className="font-display font-bold text-lg text-ink/80">{ca.amount}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Phase 5: Execution ───────────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[5] = el; }}
              {...fade(5)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                06 — Execution plan
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="divide-y divide-ink/10">
                  {output.execution.map((ex) => (
                    <div key={ex.label} className="py-3.5 grid md:grid-cols-12 gap-2">
                      <div className="md:col-span-4 text-sm font-medium text-ink/50">{ex.label}</div>
                      <div className="md:col-span-8 text-sm text-ink/75">{ex.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System modules */}
              <div className="mt-6">
                <div className="eyebrow text-ink/40 mb-3">System modules activated</div>
                <div className="grid md:grid-cols-3 gap-3">
                  <a
                    href="/lens"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Signal</div>
                      <div className="font-display font-bold text-sm">Artist & Track Lens</div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">→</span>
                  </a>
                  <a
                    href="https://youtube-campaign-coach.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Content</div>
                      <div className="font-display font-bold text-sm">YouTube Campaign Coach</div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">↗</span>
                  </a>
                  <a
                    href="https://campaign-timeline-viewer.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Timeline</div>
                      <div className="font-display font-bold text-sm">Campaign Timeline</div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">↗</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── Phase 6: Monitoring ──────────────────── */}
            <motion.div
              ref={(el) => { phaseRefs.current[6] = el; }}
              {...fade(6)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                07 — System continues to monitor
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="divide-y divide-ink/10">
                  {output.triggers.map((t) => (
                    <div key={t.condition} className="py-3.5 grid md:grid-cols-12 gap-2">
                      <div className="md:col-span-6 text-sm text-ink/65">
                        If: <span className="text-ink/80 font-medium">{t.condition}</span>
                      </div>
                      <div className="md:col-span-6 text-sm text-ink/75 flex items-start gap-2">
                        <span className="text-signal shrink-0">→</span>
                        {t.response}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-ink/10 pt-4 mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  <span className="text-sm text-ink/45">System active. Next evaluation in 48 hours.</span>
                </div>
              </div>
            </motion.div>

            {/* ── Reset ────────────────────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-6 border-t border-ink/10"
              >
                <button
                  onClick={handleReset}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  Run another simulation
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
