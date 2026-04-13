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

interface ArtistHealth {
  fanbaseStrength: { value: string; state: "strong" | "moderate" | "weak" };
  repeatListening: { value: string; state: "strong" | "moderate" | "weak" };
  engagementDepth: { value: string; state: "strong" | "moderate" | "weak" };
  growthState: { label: string; direction: "rising" | "stable" | "declining" };
}

interface CulturalTile {
  label: string;
  value: string;
}

interface CulturalIntelligence {
  campaignType: string;
  tone: string;
  intent: string;
  tiles: CulturalTile[];
  energy: string;
  leanInto: string[];
  avoid: string[];
}

interface SignalRead {
  label: string;
  value: string;
  strength: "strong" | "moderate" | "weak";
}

interface CapitalAction {
  action: string;
  amount: string;
  rationale: string;
}

interface ExecutionDirective {
  label: string;
  detail: string;
}

/* Timeline event — the core unit */
interface TimelineEvent {
  phase: string;
  label: string;
  tag: "system" | "decision" | "deploy" | "execute" | "monitor" | "adjust";
  action: string;
  reasoning: string;
}

interface SystemOutput {
  artistHealth: ArtistHealth;
  culture: CulturalIntelligence;
  signals: SignalRead[];
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  capitalActions: CapitalAction[];
  execution: ExecutionDirective[];
  timeline: TimelineEvent[];
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

  /* ── Artist Health ── */
  const artistHealth: ArtistHealth = isEmerging
    ? {
        fanbaseStrength: { value: "12k", state: "weak" },
        repeatListening: { value: "1.4×", state: "moderate" },
        engagementDepth: { value: "High", state: "strong" },
        growthState: { label: "Early traction", direction: "rising" },
      }
    : isEstablished
    ? {
        fanbaseStrength: { value: "2.1M", state: "strong" },
        repeatListening: { value: "2.8×", state: "strong" },
        engagementDepth: { value: "Moderate", state: "moderate" },
        growthState: { label: "Plateau", direction: "stable" },
      }
    : {
        fanbaseStrength: { value: "340k", state: "moderate" },
        repeatListening: { value: "2.1×", state: "strong" },
        engagementDepth: { value: "High", state: "strong" },
        growthState: { label: "Accelerating", direction: "rising" },
      };

  /* ── Cultural Intelligence ── */
  const culture: CulturalIntelligence = isEmerging
    ? {
        campaignType: "Discovery",
        tone: "Lo-fi, raw, unfiltered",
        intent: "Authenticity + discovery",
        tiles: [
          { label: "Film", value: "Grainy backstage, handheld, natural light" },
          { label: "Artist", value: "Early PinkPantheress, Clairo bedroom era" },
          { label: "Audience", value: "Taste-first listeners, micro-communities" },
          { label: "Aesthetic", value: "Intimacy over production value" },
        ],
        energy: "The artist people find — not the artist being pushed.",
        leanInto: ["Behind-the-scenes authenticity", "Fan-first content", "Platform-native formats"],
        avoid: ["Polished videos that feel disconnected", "Generic playlist pitching", "Influencer placements that dilute credibility"],
      }
    : isEstablished
    ? {
        campaignType: "Scale",
        tone: "Cinematic, high-production",
        intent: "Scale + cultural positioning",
        tiles: [
          { label: "Film", value: "Widescreen cinematography, monument shots" },
          { label: "Artist", value: "Peak Drake rollout, Beyoncé visual precision" },
          { label: "Audience", value: "Mainstream crossover, cultural commentators" },
          { label: "Aesthetic", value: "Every asset is an event" },
        ],
        energy: "The release everyone talks about — not just hears.",
        leanInto: ["Premium hero content", "Editorial partnerships", "Simultaneous multi-platform launch"],
        avoid: ["High-volume low-quality content", "Trend-chasing formats", "Discount pricing gimmicks"],
      }
    : {
        campaignType: "Momentum",
        tone: "Energetic, narrative-driven",
        intent: "Credibility + momentum",
        tiles: [
          { label: "Film", value: "Dynamic performance, split-screen, street energy" },
          { label: "Artist", value: "Central Cee breakout, early Doja Cat, Raye pre-Grammy" },
          { label: "Audience", value: "Genre explorers, playlist curators, music Twitter" },
          { label: "Aesthetic", value: "The breakout — make it feel inevitable" },
        ],
        energy: "The artist on the edge of breaking through.",
        leanInto: ["Narrative-first content", "Creator partnerships", "Staggered release"],
        avoid: ["Over-saturation", "Generic paid ads", "Skipping organic validation"],
      };

  /* ── Signals ── */
  const signals: SignalRead[] = isEstablished
    ? [
        { label: "Save rate", value: "5.1%", strength: "strong" },
        { label: "Reach", value: "+24%", strength: "strong" },
        { label: "Playlist velocity", value: "High", strength: "strong" },
        { label: "Skip rate", value: "18%", strength: "moderate" },
      ]
    : isEmerging
    ? [
        { label: "Save rate", value: "3.2%", strength: "moderate" },
        { label: "Reach", value: "−12%", strength: "weak" },
        { label: "Playlist velocity", value: "Low", strength: "weak" },
        { label: "Engagement", value: "High", strength: "strong" },
      ]
    : [
        { label: "Save rate", value: "4.1%", strength: "strong" },
        { label: "Reach", value: "+8%", strength: "moderate" },
        { label: "Playlist velocity", value: "Med", strength: "moderate" },
        { label: "Engagement", value: "High", strength: "strong" },
      ];

  /* ── Decision ── */
  let decision: Decision;
  let confidence: number;
  let risk: "Low" | "Medium" | "High";

  if (isEstablished && budget > 15000) { decision = "PUSH"; confidence = 87; risk = "Low"; }
  else if (isEmerging && budget < 5000) { decision = "TEST"; confidence = 72; risk = "Medium"; }
  else if (isEstablished) { decision = "PUSH"; confidence = 78; risk = "Low"; }
  else if (budget > 20000) { decision = "PUSH"; confidence = 81; risk = "Medium"; }
  else if (isEmerging) { decision = "TEST"; confidence = 68; risk = "Medium"; }
  else { decision = "HOLD"; confidence = 64; risk = "High"; }

  /* ── Capital ── */
  const capitalActions: CapitalAction[] =
    decision === "PUSH"
      ? [
          { action: "Content", amount: formatBudget(Math.round(budget * 0.35)), rationale: `${culture.tone.split(",")[0]} assets` },
          { action: "Paid reach", amount: formatBudget(Math.round(budget * 0.4)), rationale: "Signal confirms. Extend." },
          { action: "Creators", amount: formatBudget(Math.round(budget * 0.15)), rationale: "Voices that match positioning" },
          { action: "Reserve", amount: formatBudget(Math.round(budget * 0.1)), rationale: "Week-1 reallocation" },
        ]
      : decision === "TEST"
      ? [
          { action: "Content", amount: formatBudget(Math.round(budget * 0.4)), rationale: "Test formats within cultural frame" },
          { action: "Paid (delayed)", amount: formatBudget(Math.round(budget * 0.25)), rationale: "After 48hr signal only" },
          { action: "Audience intel", amount: formatBudget(Math.round(budget * 0.2)), rationale: "Map patterns first" },
          { action: "Reserve", amount: formatBudget(Math.round(budget * 0.15)), rationale: "Rapid reallocation ready" },
        ]
      : [
          { action: "Paid spend", amount: "$0", rationale: "Held — no deployment" },
          { action: "Research", amount: formatBudget(Math.round(budget * 0.35)), rationale: "Build understanding first" },
          { action: "Content (minimal)", amount: formatBudget(Math.round(budget * 0.35)), rationale: `Baseline ${culture.tone.split(",")[0].toLowerCase()} only` },
          { action: "Reserve", amount: formatBudget(Math.round(budget * 0.3)), rationale: "Preserved for deployment" },
        ];

  /* ── Execution ── */
  const execution: ExecutionDirective[] =
    decision === "PUSH"
      ? culture.tone.includes("Lo-fi")
        ? [
            { label: "Content", detail: "Raw, unpolished. No over-production." },
            { label: "Creators", detail: "Authentic voices. Storytelling > reach." },
            { label: "Timing", detail: "Organic first → paid at 48hr." },
          ]
        : culture.tone.includes("Cinematic")
        ? [
            { label: "Content", detail: "Hero assets. Cinematic first impression." },
            { label: "Creators", detail: "Editorial voices + press placements." },
            { label: "Timing", detail: "Simultaneous launch. Day-1 reach." },
          ]
        : [
            { label: "Content", detail: "Narrative-driven. Story > volume." },
            { label: "Creators", detail: "Genre-adjacent. Credibility first." },
            { label: "Timing", detail: "Staggered. 7-day momentum build." },
          ]
      : decision === "TEST"
      ? [
          { label: "Content", detail: `${culture.tone.split(",")[0]}. Test before committing.` },
          { label: "Creators", detail: "Micro-creators. Alignment > reach." },
          { label: "Timing", detail: "Organic first. Paid after confirmation." },
        ]
      : [
          { label: "Content", detail: `Minimal. ${culture.tone.split(",")[0]} when ready.` },
          { label: "Creators", detail: "Hold outreach. Research first." },
          { label: "Timing", detail: "No paid until signal justifies." },
        ];

  /* ── Build timeline ── */
  const growthLabel = artistHealth.growthState.label.toLowerCase();
  const toneShort = culture.tone.split(",")[0];

  const timeline: TimelineEvent[] = [
    {
      phase: "00:00",
      label: "System initialised",
      tag: "system",
      action: `${culture.campaignType} campaign activated for ${input.artistStage} artist`,
      reasoning: `Artist health: ${growthLabel}. Cultural frame: ${culture.intent.toLowerCase()}.`,
    },
    {
      phase: "00:01",
      label: "Signal read",
      tag: "system",
      action: `${signals.filter(s => s.strength === "strong").length}/${signals.length} signals strong`,
      reasoning: `Save rate ${signals[0].value}, reach ${signals[1].value}. Read against ${growthLabel} baseline.`,
    },
    {
      phase: "00:02",
      label: "Tension resolved",
      tag: "system",
      action: isEmerging
        ? "Engagement suggests scale, but health says protect"
        : isEstablished
        ? "Strong signal, but plateau means re-engage not maintain"
        : "Momentum is real — channel it, don't burn it",
      reasoning: isEmerging
        ? `Small audience (${artistHealth.fanbaseStrength.value}) with high depth. ${toneShort} positioning must hold.`
        : isEstablished
        ? `${artistHealth.fanbaseStrength.value} base at ${growthLabel}. ${toneShort} execution at every touchpoint.`
        : `${artistHealth.fanbaseStrength.value} and ${growthLabel}. Credibility before volume.`,
    },
    {
      phase: "00:03",
      label: `Decision: ${decision}`,
      tag: "decision",
      action: decision === "PUSH"
        ? `Deploy ${formatBudget(budget)}. Signal and health align.`
        : decision === "TEST"
        ? `Validate before scaling. ${formatBudget(budget)} held for confirmation.`
        : `Hold. Insufficient signal to justify deployment.`,
      reasoning: `Confidence ${confidence}%. Risk: ${risk.toLowerCase()}. Health (${growthLabel}) + culture (${culture.intent.toLowerCase()}).`,
    },
    ...capitalActions.map((ca, i) => ({
      phase: "00:04",
      label: i === 0 ? "Capital deployed" : "",
      tag: "deploy" as const,
      action: `${ca.action} → ${ca.amount}`,
      reasoning: ca.rationale,
    })),
    ...execution.map((ex, i) => ({
      phase: "00:05",
      label: i === 0 ? "Execution set" : "",
      tag: "execute" as const,
      action: `${ex.label}: ${ex.detail}`,
      reasoning: "",
    })),
    {
      phase: "06:00",
      label: "Monitoring update",
      tag: "monitor",
      action: `Tracking save rate against ${culture.campaignType.toLowerCase()} baseline`,
      reasoning: "No action required. Observing.",
    },
    {
      phase: "24:00",
      label: "First evaluation",
      tag: "monitor",
      action: decision === "PUSH"
        ? "Checking playlist velocity + engagement depth"
        : decision === "TEST"
        ? "Looking for save rate confirmation"
        : "Watching for organic traction",
      reasoning: "Cross-referencing artist health for sustained engagement.",
    },
    {
      phase: "24:00",
      label: "Condition detected",
      tag: "adjust",
      action: decision === "PUSH"
        ? "Save rate < 3% → downgrade to TEST"
        : decision === "TEST"
        ? "Save rate > 4.5% → upgrade to PUSH"
        : "Save rate > 3% → upgrade to TEST",
      reasoning: "System adjusts automatically based on threshold.",
    },
    {
      phase: "48:00",
      label: "System triggered",
      tag: "adjust",
      action: decision === "PUSH"
        ? "Playlist spike detected → increasing paid support"
        : decision === "TEST"
        ? "No signal after 48h → downgrade to HOLD"
        : "New audience data → re-evaluating cultural frame",
      reasoning: decision === "PUSH"
        ? "Signal confirms momentum. Reallocating reserve."
        : decision === "TEST"
        ? "Capital preserved. Awaiting stronger signal."
        : "Updating cultural intelligence layer.",
    },
    {
      phase: "72:00",
      label: "Monitoring update",
      tag: "monitor",
      action: decision === "PUSH"
        ? "Full review. Reallocating capital on 72hr data."
        : decision === "TEST"
        ? "Test cycle continues. Evaluating format performance."
        : "Hold review. Continue or activate.",
      reasoning: "System remains active. Next full evaluation scheduled.",
    },
  ];

  return {
    artistHealth,
    culture,
    signals,
    decision,
    confidence,
    risk,
    capitalActions,
    execution,
    timeline,
  };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision): string {
  return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";
}
function signalDot(s: "strong" | "moderate" | "weak"): string {
  return s === "strong" ? "bg-mint" : s === "moderate" ? "bg-sun" : "bg-signal";
}
function healthDot(s: "strong" | "moderate" | "weak"): string {
  return s === "strong" ? "bg-mint" : s === "moderate" ? "bg-sun" : "bg-signal";
}
function directionArrow(d: "rising" | "stable" | "declining"): string {
  return d === "rising" ? "↑" : d === "stable" ? "→" : "↓";
}
function directionColor(d: "rising" | "stable" | "declining"): string {
  return d === "rising" ? "text-mint" : d === "stable" ? "text-sun" : "text-signal";
}

function tagStyle(t: TimelineEvent["tag"]): string {
  switch (t) {
    case "system": return "bg-ink/8 text-ink/50";
    case "decision": return "bg-ink text-paper";
    case "deploy": return "bg-mint/15 text-mint";
    case "execute": return "bg-electric/10 text-electric";
    case "monitor": return "bg-ink/5 text-ink/40";
    case "adjust": return "bg-signal/12 text-signal";
  }
}

function tagLabel(t: TimelineEvent["tag"]): string {
  switch (t) {
    case "system": return "System";
    case "decision": return "Decision";
    case "deploy": return "Deploy";
    case "execute": return "Execute";
    case "monitor": return "Monitor";
    case "adjust": return "Adjust";
  }
}

function dotColor(t: TimelineEvent["tag"]): string {
  switch (t) {
    case "system": return "bg-ink/30";
    case "decision": return "bg-ink";
    case "deploy": return "bg-mint";
    case "execute": return "bg-electric";
    case "monitor": return "bg-ink/20";
    case "adjust": return "bg-signal";
  }
}

/* ─── Boot ──────────────────────────────────────────────── */

const BOOT_LINES = [
  "Initialising system…",
  "Loading artist baseline…",
  "Mapping cultural landscape…",
  "Reading signal…",
  "Running.",
];
const BOOT_LINE_DELAY = 550;

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "booting" | "running" | "complete">("input");
  const [input, setInput] = useState<CampaignInput>({
    trackName: "",
    artistStage: "breaking",
    budget: 30,
  });
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [bootLine, setBootLine] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [healthOpen, setHealthOpen] = useState(false);
  const [cultureOpen, setCultureOpen] = useState(false);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  const budgetValue = BUDGET_MAP(input.budget);

  const handleStart = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("booting");
    setBootLine(0);
    setEventIndex(0);
    setHealthOpen(false);
    setCultureOpen(false);
  }, [input]);

  // Boot
  useEffect(() => {
    if (step !== "booting") return;
    if (bootLine < BOOT_LINES.length - 1) {
      const t = setTimeout(() => setBootLine((b) => b + 1), BOOT_LINE_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setStep("running"); setEventIndex(0); }, 350);
      return () => clearTimeout(t);
    }
  }, [step, bootLine]);

  // Timeline drip
  useEffect(() => {
    if (step !== "running" || !output) return;
    if (eventIndex < output.timeline.length - 1) {
      const t = setTimeout(() => setEventIndex((i) => i + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setStep("complete"), 500);
      return () => clearTimeout(t);
    }
  }, [step, eventIndex, output]);

  // Auto-scroll timeline
  useEffect(() => {
    if ((step === "running" || step === "complete") && timelineEndRef.current) {
      setTimeout(() => timelineEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 120);
    }
  }, [step, eventIndex]);

  const handleReset = useCallback(() => {
    setStep("input");
    setOutput(null);
    setBootLine(0);
    setEventIndex(0);
  }, []);

  const visibleEvents = output
    ? output.timeline.slice(0, step === "complete" ? output.timeline.length : eventIndex + 1)
    : [];

  return (
    <main className="min-h-screen bg-paper overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/70 border-b border-ink/5">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal" />
            decision/system_
          </Link>
          <Link href="/" className="text-sm text-ink/60 hover:text-signal transition-colors">
            ← Overview
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-ink text-paper py-14 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <span className="eyebrow text-paper/50 mb-3 block">Campaign System</span>
          <h1 className="headline font-display text-5xl md:text-7xl leading-[0.95]">
            AI runs<br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-paper/45 max-w-md">
            Decision → content → spend → optimisation. Continuously.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-14 md:py-20">
        <AnimatePresence mode="wait">

          {/* ── INPUT ─────────────────────────────────── */}
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
                  {([
                    ["emerging", "Emerging"],
                    ["breaking", "Breaking"],
                    ["established", "Established"],
                  ] as [ArtistStage, string][]).map(([value, label]) => (
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
                    type="range" min={0} max={100}
                    value={input.budget}
                    onChange={(e) => setInput((p) => ({ ...p, budget: Number(e.target.value) }))}
                    className="flex-1 h-2 rounded-full appearance-none bg-ink/10 accent-ink cursor-pointer"
                  />
                  <span className="font-display font-bold text-xl min-w-[5rem] text-right">
                    {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-ink/35 mt-1">
                  <span>$500</span><span>$50k</span>
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

          {/* ── BOOT ──────────────────────────────────── */}
          {step === "booting" && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-md py-20"
            >
              <div className="space-y-3">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={
                      bootLine >= i
                        ? { opacity: i === bootLine ? 1 : 0.3, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-sm"
                  >
                    <span className="text-ink/25 mr-3">
                      {bootLine > i ? "✓" : bootLine === i ? "›" : " "}
                    </span>
                    <span className={bootLine === i ? "text-ink" : "text-ink/35"}>
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (bootLine + 1) / BOOT_LINES.length }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-px bg-ink/20 mt-8 origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TIMELINE SYSTEM ─────────────────────────── */}
        {(step === "running" || step === "complete") && output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Context Panels ─────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-10">
              {/* Artist Health panel */}
              <div className="flex-1 min-w-[280px]">
                <button
                  onClick={() => setHealthOpen((o) => !o)}
                  className="w-full rounded-xl border border-ink/10 px-4 py-3 flex items-center justify-between hover:border-ink/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${healthDot(output.artistHealth.engagementDepth.state)}`} />
                    <span className="text-sm font-medium text-ink/70">Artist Health</span>
                    <span className="text-xs text-ink/35 font-mono">
                      {output.artistHealth.fanbaseStrength.value} ·{" "}
                      <span className={directionColor(output.artistHealth.growthState.direction)}>
                        {directionArrow(output.artistHealth.growthState.direction)}
                      </span>{" "}
                      {output.artistHealth.growthState.label}
                    </span>
                  </div>
                  <span className="text-ink/25 text-xs transition-transform" style={{ transform: healthOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </button>
                <AnimatePresence>
                  {healthOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-3 pt-3">
                        {[
                          { label: "Fanbase", ...output.artistHealth.fanbaseStrength },
                          { label: "Repeat", ...output.artistHealth.repeatListening },
                          { label: "Depth", ...output.artistHealth.engagementDepth },
                        ].map((m) => (
                          <div key={m.label} className="rounded-lg border border-ink/8 p-3">
                            <div className="text-xs text-ink/35 uppercase tracking-wider mb-1">{m.label}</div>
                            <div className="font-display font-bold text-lg flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${healthDot(m.state)}`} />
                              {m.value}
                            </div>
                          </div>
                        ))}
                        <div className="rounded-lg border border-ink/8 p-3">
                          <div className="text-xs text-ink/35 uppercase tracking-wider mb-1">Growth</div>
                          <div className="font-display font-bold text-lg flex items-center gap-1.5">
                            <span className={directionColor(output.artistHealth.growthState.direction)}>
                              {directionArrow(output.artistHealth.growthState.direction)}
                            </span>
                            {output.artistHealth.growthState.label}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Culture panel */}
              <div className="flex-1 min-w-[280px]">
                <button
                  onClick={() => setCultureOpen((o) => !o)}
                  className="w-full rounded-xl border border-ink/10 px-4 py-3 flex items-center justify-between hover:border-ink/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-electric/50" />
                    <span className="text-sm font-medium text-ink/70">Cultural Intelligence</span>
                    <span className="text-xs text-ink/35 font-mono">
                      {output.culture.campaignType} · {output.culture.tone.split(",")[0]}
                    </span>
                  </div>
                  <span className="text-ink/25 text-xs transition-transform" style={{ transform: cultureOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </button>
                <AnimatePresence>
                  {cultureOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {output.culture.tiles.map((tile) => (
                            <div key={tile.label} className="rounded-lg bg-cream border border-ink/6 p-3">
                              <div className="text-xs text-ink/35 uppercase tracking-wider mb-1">{tile.label}</div>
                              <p className="text-xs text-ink/60 leading-snug">{tile.value}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-ink/50 italic">{output.culture.energy}</p>
                        <div className="grid md:grid-cols-2 gap-2">
                          <div className="rounded-lg border border-ink/8 p-3">
                            <div className="text-xs text-mint uppercase tracking-wider mb-1.5">Lean into</div>
                            {output.culture.leanInto.map((item) => (
                              <div key={item} className="text-xs text-ink/55 flex gap-1.5 mb-1 last:mb-0">
                                <span className="text-mint shrink-0">+</span>{item}
                              </div>
                            ))}
                          </div>
                          <div className="rounded-lg border border-ink/8 p-3">
                            <div className="text-xs text-signal uppercase tracking-wider mb-1.5">Avoid</div>
                            {output.culture.avoid.map((item) => (
                              <div key={item} className="text-xs text-ink/55 flex gap-1.5 mb-1 last:mb-0">
                                <span className="text-signal shrink-0">−</span>{item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Signal Strip ───────────────────────── */}
            <div className="flex gap-3 mb-10">
              {output.signals.map((s) => (
                <div key={s.label} className="flex-1 rounded-lg border border-ink/8 px-3 py-2.5 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${signalDot(s.strength)}`} />
                  <span className="text-xs text-ink/40 uppercase tracking-wider">{s.label}</span>
                  <span className="font-display font-bold text-sm ml-auto">{s.value}</span>
                </div>
              ))}
            </div>

            {/* ── TIMELINE ───────────────────────────── */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[4.5rem] md:left-[5.5rem] top-0 bottom-0 w-px bg-ink/10" />

              <div className="space-y-0">
                {visibleEvents.map((ev, i) => {
                  const showPhase = i === 0 || ev.phase !== visibleEvents[i - 1].phase;
                  const isDecision = ev.tag === "decision";

                  return (
                    <motion.div
                      key={`${ev.phase}-${ev.label}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="relative flex gap-4 md:gap-6"
                    >
                      {/* Timestamp */}
                      <div className="w-16 md:w-20 shrink-0 text-right pr-4 pt-4">
                        {showPhase && (
                          <span className="text-xs font-mono text-ink/30">{ev.phase}</span>
                        )}
                      </div>

                      {/* Dot on line */}
                      <div className="relative shrink-0 w-3 flex justify-center pt-5">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor(ev.tag)} ${
                          ev.tag === "adjust" ? "animate-pulse" : ""
                        }`} />
                      </div>

                      {/* Event card */}
                      <div className={`flex-1 pb-5 pt-3 ${
                        isDecision ? "" : "border-b border-ink/5"
                      }`}>
                        {isDecision ? (
                          /* Decision — big dark card */
                          <div className="rounded-xl bg-ink text-paper p-6 mb-1">
                            <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
                              <div className="font-display font-bold text-4xl md:text-5xl leading-none flex items-center gap-3">
                                <span className={decisionColor(output.decision)}>→</span>
                                {output.decision}
                              </div>
                              <div className="flex gap-5">
                                <div>
                                  <div className="text-paper/30 text-xs uppercase tracking-wider mb-0.5">Confidence</div>
                                  <div className="font-display font-bold text-xl">{output.confidence}%</div>
                                </div>
                                <div>
                                  <div className="text-paper/30 text-xs uppercase tracking-wider mb-0.5">Risk</div>
                                  <div className={`font-display font-bold text-xl ${
                                    output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"
                                  }`}>{output.risk}</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-paper/50 text-sm">{ev.action}</p>
                            {ev.reasoning && (
                              <p className="text-paper/30 text-xs mt-2">{ev.reasoning}</p>
                            )}
                          </div>
                        ) : (
                          /* Standard event */
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              {ev.label && (
                                <span className="text-sm font-medium text-ink/75">{ev.label}</span>
                              )}
                              <span className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${tagStyle(ev.tag)}`}>
                                {tagLabel(ev.tag)}
                              </span>
                            </div>
                            <p className="text-sm text-ink/65">{ev.action}</p>
                            {ev.reasoning && (
                              <p className="text-xs text-ink/35 mt-1">{ev.reasoning}</p>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div ref={timelineEndRef} />
            </div>

            {/* ── System Modules ──────────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-10 grid md:grid-cols-3 gap-3"
              >
                <a href="/lens" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/30 mb-0.5">Signal</div>
                    <div className="font-display font-bold text-sm">Artist & Track Lens</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">→</span>
                </a>
                <a href="https://youtube-campaign-coach.vercel.app" target="_blank" rel="noreferrer noopener" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/30 mb-0.5">Content</div>
                    <div className="font-display font-bold text-sm">YouTube Coach</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">↗</span>
                </a>
                <a href="https://campaign-timeline-viewer.vercel.app" target="_blank" rel="noreferrer noopener" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/30 mb-0.5">Timeline</div>
                    <div className="font-display font-bold text-sm">Campaign Timeline</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">↗</span>
                </a>
              </motion.div>
            )}

            {/* ── Agent Bar ───────────────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-10 rounded-2xl bg-ink text-paper p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse" />
                    <span className="font-display font-bold text-base">System running</span>
                  </div>
                  <span className="text-paper/30 text-xs font-mono">
                    {input.trackName} · {input.artistStage} · {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-paper/30 text-xs uppercase tracking-wider mb-1">Signals</div>
                    <div className="text-paper/65 text-sm font-medium flex items-center gap-1.5">
                      <span className={directionColor(output.artistHealth.growthState.direction)}>
                        {directionArrow(output.artistHealth.growthState.direction)}
                      </span>
                      {output.artistHealth.growthState.direction === "rising" ? "Rising" : output.artistHealth.growthState.direction === "stable" ? "Stable" : "Declining"}
                    </div>
                  </div>
                  <div>
                    <div className="text-paper/30 text-xs uppercase tracking-wider mb-1">Status</div>
                    <div className="text-paper/65 text-sm font-medium">Awaiting first eval</div>
                  </div>
                  <div>
                    <div className="text-paper/30 text-xs uppercase tracking-wider mb-1">Next eval</div>
                    <div className="text-paper/65 text-sm font-mono">48h</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reset */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8 pt-4 border-t border-ink/10"
              >
                <button
                  onClick={handleReset}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  Run another
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
