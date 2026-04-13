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
  type: "film" | "artist" | "audience" | "aesthetic";
}

interface CulturalIntelligence {
  campaignType: string;
  tone: string;
  intent: string;
  constraint: string;
  tiles: CulturalTile[];
  energy: string;
  leanInto: string[];
  avoid: string[];
  refinedPosition: string;
}

interface SignalRead {
  label: string;
  value: string;
  strength: "strong" | "moderate" | "weak";
}

interface Tension {
  signal: string;
  culture: string;
  health: string;
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

interface LiveFeedEvent {
  time: string;
  type: "monitor" | "trigger" | "adjust";
  message: string;
}

interface WhyBlock {
  connection: string;
  direction: string;
}

interface SystemOutput {
  artistHealth: ArtistHealth;
  culture: CulturalIntelligence;
  signals: SignalRead[];
  tension: Tension;
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  decisionLine: string;
  capitalActions: CapitalAction[];
  execution: ExecutionDirective[];
  liveFeed: LiveFeedEvent[];
  why: WhyBlock;
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
        constraint: "Nothing over-polished. Protect the narrative.",
        tiles: [
          { label: "Film", value: "Grainy backstage, handheld, natural light", type: "film" },
          { label: "Artist", value: "Early PinkPantheress, Clairo bedroom era", type: "artist" },
          { label: "Audience", value: "Taste-first listeners, micro-communities", type: "audience" },
          { label: "Aesthetic", value: "Intimacy over production value", type: "aesthetic" },
        ],
        energy: "The artist people find — not the artist being pushed.",
        leanInto: [
          "Behind-the-scenes authenticity",
          "Fan-first content (DMs, small shows, raw takes)",
          "Platform-native formats (Stories, lo-fi Reels)",
        ],
        avoid: [
          "Polished videos that feel disconnected",
          "Generic playlist pitching",
          "Influencer placements that dilute credibility",
        ],
        refinedPosition: "Position as discovery.",
      }
    : isEstablished
    ? {
        campaignType: "Scale",
        tone: "Cinematic, high-production",
        intent: "Scale + cultural positioning",
        constraint: "No cheap reach. Match the stature.",
        tiles: [
          { label: "Film", value: "Widescreen cinematography, monument shots", type: "film" },
          { label: "Artist", value: "Peak Drake rollout, Beyoncé visual precision", type: "artist" },
          { label: "Audience", value: "Mainstream crossover, cultural commentators", type: "audience" },
          { label: "Aesthetic", value: "Every asset is an event", type: "aesthetic" },
        ],
        energy: "The release everyone talks about — not just hears.",
        leanInto: [
          "Premium hero content (short film, visual EP)",
          "Editorial partnerships and press exclusives",
          "Simultaneous multi-platform launch",
        ],
        avoid: [
          "High-volume low-quality content",
          "Trend-chasing formats beneath the artist",
          "Discount pricing or bundle gimmicks",
        ],
        refinedPosition: "Position as cultural moment.",
      }
    : {
        campaignType: "Momentum",
        tone: "Energetic, narrative-driven",
        intent: "Credibility + momentum",
        constraint: "Every asset builds the story.",
        tiles: [
          { label: "Film", value: "Dynamic performance, split-screen, street energy", type: "film" },
          { label: "Artist", value: "Central Cee breakout, early Doja Cat, Raye pre-Grammy", type: "artist" },
          { label: "Audience", value: "Genre explorers, playlist curators, music Twitter", type: "audience" },
          { label: "Aesthetic", value: "The breakout — make it feel inevitable", type: "aesthetic" },
        ],
        energy: "The artist on the edge of breaking through.",
        leanInto: [
          "Narrative-first content (story behind the track)",
          "Creator partnerships that build credibility",
          "Staggered release to build anticipation",
        ],
        avoid: [
          "Over-saturation that kills the build",
          "Generic paid ads without narrative",
          "Skipping organic validation for paid scale",
        ],
        refinedPosition: "Position as momentum.",
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

  /* ── Tension ── */
  const tension: Tension = isEmerging
    ? {
        signal: "Early engagement suggests scaling potential",
        culture: "Authentic positioning required — can't force it",
        health: "Small audience, deep engagement — dilution risk",
        resolution:
          decision === "TEST"
            ? "Validate before scaling. Protect the narrative."
            : "Hold until signal supports scale without compromise.",
      }
    : isEstablished
    ? {
        signal: "Strong across all metrics — supports deployment",
        culture: "Premium execution at every touchpoint",
        health: "Plateau — this is a re-engagement opportunity",
        resolution: "Push aggressively. Every asset matches stature.",
      }
    : {
        signal: "Strong engagement, moderate reach",
        culture: "Credibility over volume",
        health: "Accelerating growth — momentum is real",
        resolution:
          decision === "PUSH"
            ? "Ride the momentum. Story over scale."
            : decision === "TEST"
            ? "Test narrative formats before committing scale."
            : "Strengthen foundation before spending.",
      };

  /* ── Decision line ── */
  const decisionLine =
    decision === "PUSH"
      ? `Health (${artistHealth.growthState.label.toLowerCase()}) + culture (${culture.intent.toLowerCase()}) align. Deploy.`
      : decision === "TEST"
      ? `Health (${artistHealth.growthState.label.toLowerCase()}) suggests caution. Validate within ${culture.tone.split(",")[0].toLowerCase()} frame.`
      : `Insufficient signal. Hold until evidence supports ${culture.intent.toLowerCase()}.`;

  /* ── Capital actions ── */
  const capitalActions: CapitalAction[] =
    decision === "PUSH"
      ? [
          { action: "Content", rationale: `${culture.tone.split(",")[0]} assets`, amount: formatBudget(Math.round(budget * 0.35)) },
          { action: "Paid reach", rationale: "Signal confirms. Extend.", amount: formatBudget(Math.round(budget * 0.4)) },
          { action: "Creators", rationale: "Voices that match positioning", amount: formatBudget(Math.round(budget * 0.15)) },
          { action: "Reserve", rationale: "Week-1 reallocation", amount: formatBudget(Math.round(budget * 0.1)) },
        ]
      : decision === "TEST"
      ? [
          { action: "Content", rationale: "Test formats within cultural frame", amount: formatBudget(Math.round(budget * 0.4)) },
          { action: "Paid (delayed)", rationale: "After 48hr signal only", amount: formatBudget(Math.round(budget * 0.25)) },
          { action: "Audience intel", rationale: "Map patterns first", amount: formatBudget(Math.round(budget * 0.2)) },
          { action: "Reserve", rationale: "Rapid reallocation ready", amount: formatBudget(Math.round(budget * 0.15)) },
        ]
      : [
          { action: "Paid spend", rationale: "Held — no deployment", amount: "$0" },
          { action: "Research", rationale: "Build understanding first", amount: formatBudget(Math.round(budget * 0.35)) },
          { action: "Content (minimal)", rationale: `Baseline ${culture.tone.split(",")[0].toLowerCase()} only`, amount: formatBudget(Math.round(budget * 0.35)) },
          { action: "Reserve", rationale: "Preserved for deployment", amount: formatBudget(Math.round(budget * 0.3)) },
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

  /* ── Live feed ── */
  const liveFeed: LiveFeedEvent[] =
    decision === "PUSH"
      ? [
          { time: "00:00", type: "monitor", message: "Monitoring all signal channels" },
          { time: "06:00", type: "monitor", message: `Tracking save rate against ${culture.campaignType.toLowerCase()} baseline` },
          { time: "24:00", type: "trigger", message: "First evaluation — playlist velocity + engagement" },
          { time: "24:00", type: "adjust", message: "Save rate < 3% → downgrade to TEST" },
          { time: "48:00", type: "trigger", message: "Cross-referencing artist health" },
          { time: "48:00", type: "adjust", message: "Playlist spike → increase paid immediately" },
          { time: "72:00", type: "monitor", message: "Full review. Reallocate on 72hr data." },
        ]
      : decision === "TEST"
      ? [
          { time: "00:00", type: "monitor", message: "Observing organic response" },
          { time: "12:00", type: "monitor", message: "Engagement vs. artist health baseline" },
          { time: "24:00", type: "trigger", message: "Save rate check" },
          { time: "24:00", type: "adjust", message: "Save > 4.5% → upgrade to PUSH" },
          { time: "48:00", type: "trigger", message: "Format evaluation — what resonates?" },
          { time: "48:00", type: "adjust", message: "No signal 48h → downgrade to HOLD" },
          { time: "168:00", type: "monitor", message: "Test cycle complete. Next phase." },
        ]
      : [
          { time: "00:00", type: "monitor", message: "Monitoring for signal emergence" },
          { time: "24:00", type: "monitor", message: "Watching organic save rate" },
          { time: "48:00", type: "trigger", message: "Signal check — any traction?" },
          { time: "48:00", type: "adjust", message: "Save > 3% → upgrade to TEST" },
          { time: "168:00", type: "monitor", message: "Weekly health update" },
          { time: "168:00", type: "adjust", message: "New data → re-evaluate frame" },
          { time: "336:00", type: "monitor", message: "Hold review — continue or activate" },
        ];

  /* ── Why ── */
  const why: WhyBlock = isEmerging
    ? {
        connection: `${culture.tiles[1].value} built audiences through authenticity, not volume. The cultural references (${culture.tiles[0].value.split(",")[0].toLowerCase()}) reinforce this — raw, unpolished, real.`,
        direction: `At ${artistHealth.fanbaseStrength.value} monthly listeners with ${artistHealth.engagementDepth.value.toLowerCase()} engagement, the audience is there but small. A ${culture.campaignType.toLowerCase()} campaign protects what's working while testing scale.`,
      }
    : isEstablished
    ? {
        connection: `${culture.tiles[1].value} set the standard for high-production rollouts. The visual language (${culture.tiles[0].value.split(",")[0].toLowerCase()}) signals cultural weight, not just marketing spend.`,
        direction: `With ${artistHealth.fanbaseStrength.value} monthly listeners but a ${artistHealth.growthState.label.toLowerCase()} growth state, this release needs to reactivate — not maintain. The ${culture.campaignType.toLowerCase()} frame gives it room.`,
      }
    : {
        connection: `${culture.tiles[1].value} all broke through with narrative-driven campaigns. The visual energy (${culture.tiles[0].value.split(",")[0].toLowerCase()}) matches the urgency of a breakout moment.`,
        direction: `At ${artistHealth.fanbaseStrength.value} monthly and ${artistHealth.growthState.label.toLowerCase()}, the momentum is real. A ${culture.campaignType.toLowerCase()} campaign channels it without burning it.`,
      };

  return {
    artistHealth,
    culture,
    signals,
    tension,
    decision,
    confidence,
    risk,
    decisionLine,
    capitalActions,
    execution,
    liveFeed,
    why,
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
function feedIcon(t: "monitor" | "trigger" | "adjust"): string {
  return t === "monitor" ? "◉" : t === "trigger" ? "⚡" : "↻";
}
function feedColor(t: "monitor" | "trigger" | "adjust"): string {
  return t === "monitor" ? "text-ink/40" : t === "trigger" ? "text-sun" : "text-signal";
}
function tileIcon(t: "film" | "artist" | "audience" | "aesthetic"): string {
  return t === "film" ? "◈" : t === "artist" ? "◎" : t === "audience" ? "◇" : "◆";
}

/* ─── Boot Sequence ─────────────────────────────────────── */

const BOOT_LINES = [
  "Initialising system…",
  "Loading artist baseline…",
  "Mapping cultural landscape…",
  "Reading signal…",
  "Running.",
];
const BOOT_LINE_DELAY = 600;
const BOOT_TOTAL = BOOT_LINES.length * BOOT_LINE_DELAY + 400;

/* ─── System Run Phases ─────────────────────────────────── */

const PHASE_COUNT = 9;
const PHASE_DELAY = 1100;

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "booting" | "running" | "complete">("input");
  const [input, setInput] = useState<CampaignInput>({
    trackName: "",
    artistStage: "breaking",
    budget: 30,
  });
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [phase, setPhase] = useState(0);
  const [bootLine, setBootLine] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);
  const [whyOpen, setWhyOpen] = useState(false);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const budgetValue = BUDGET_MAP(input.budget);

  /* ── Start → boot → run ── */
  const handleStart = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("booting");
    setBootLine(0);
    setPhase(0);
    setFeedIndex(0);
    setWhyOpen(false);
  }, [input]);

  // Boot sequence progression
  useEffect(() => {
    if (step !== "booting") return;
    if (bootLine < BOOT_LINES.length - 1) {
      const t = setTimeout(() => setBootLine((b) => b + 1), BOOT_LINE_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setStep("running"), 400);
      return () => clearTimeout(t);
    }
  }, [step, bootLine]);

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

  // Live feed drip
  useEffect(() => {
    if (phase < 8 || !output) return;
    if (feedIndex < output.liveFeed.length - 1) {
      const t = setTimeout(() => setFeedIndex((i) => i + 1), 700);
      return () => clearTimeout(t);
    }
  }, [phase, feedIndex, output]);

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
    setBootLine(0);
    setFeedIndex(0);
    setWhyOpen(false);
  }, []);

  const visible = (i: number) => phase >= i || step === "complete";

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: visible(i) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[] },
  });

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
      <section className="relative bg-ink text-paper py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <span className="eyebrow text-paper/50 mb-4 block">Campaign System</span>
          <h1 className="headline font-display text-5xl md:text-7xl leading-[0.95]">
            AI runs<br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-paper/50 max-w-md">
            Decision → content → spend → optimisation. Continuously.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">

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

          {/* ── BOOT SEQUENCE ─────────────────────────── */}
          {step === "booting" && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-md py-24"
            >
              <div className="space-y-3">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={
                      bootLine >= i
                        ? { opacity: i === bootLine ? 1 : 0.35, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-sm"
                  >
                    <span className="text-ink/25 mr-3">
                      {bootLine > i ? "✓" : bootLine === i ? "›" : " "}
                    </span>
                    <span className={bootLine === i ? "text-ink" : "text-ink/40"}>
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (bootLine + 1) / BOOT_LINES.length }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-px bg-ink/20 mt-8 origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SYSTEM RUN ─────────────────────────────── */}
        {(step === "running" || step === "complete") && output && (
          <div className="space-y-14 md:space-y-20">

            {/* Phase 0: Artist Health */}
            <motion.div ref={(el) => { phaseRefs.current[0] = el; }} {...fade(0)}>
              <span className="eyebrow text-ink/40 mb-4 block">00 — Artist health</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Fanbase", ...output.artistHealth.fanbaseStrength },
                  { label: "Repeat", ...output.artistHealth.repeatListening },
                  { label: "Depth", ...output.artistHealth.engagementDepth },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-ink/10 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${healthDot(m.state)}`} />
                      <span className="text-xs text-ink/40 uppercase tracking-wider">{m.label}</span>
                    </div>
                    <div className="font-display font-bold text-2xl">{m.value}</div>
                  </div>
                ))}
                <div className="rounded-xl border border-ink/10 p-4">
                  <div className="text-xs text-ink/40 uppercase tracking-wider mb-1.5">Growth</div>
                  <div className="font-display font-bold text-2xl flex items-center gap-2">
                    <span className={directionColor(output.artistHealth.growthState.direction)}>
                      {directionArrow(output.artistHealth.growthState.direction)}
                    </span>
                    {output.artistHealth.growthState.label}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phase 1: Cultural Board */}
            <motion.div ref={(el) => { phaseRefs.current[1] = el; }} {...fade(1)}>
              <span className="eyebrow text-ink/40 mb-4 block">01 — Cultural intelligence</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {output.culture.tiles.map((tile) => (
                  <div key={tile.label} className="rounded-xl bg-cream border border-ink/8 p-4 group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-ink/25 text-xs">{tileIcon(tile.type)}</span>
                      <span className="text-xs text-ink/45 uppercase tracking-wider font-medium">{tile.label}</span>
                    </div>
                    <p className="text-sm text-ink/70 leading-snug">{tile.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-ink/15" />
                <p className="text-base text-ink/60 font-display italic">{output.culture.energy}</p>
              </div>
            </motion.div>

            {/* Phase 2: Cultural Refinement */}
            <motion.div ref={(el) => { phaseRefs.current[2] = el; }} {...fade(2)}>
              <span className="eyebrow text-ink/40 mb-4 block">02 — Refined alignment</span>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-ink/10 p-5">
                  <div className="text-xs font-medium text-mint uppercase tracking-wider mb-3">Lean into</div>
                  {output.culture.leanInto.map((item) => (
                    <div key={item} className="text-sm text-ink/70 flex items-start gap-2 mb-1.5 last:mb-0">
                      <span className="text-mint shrink-0">+</span> {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-ink/10 p-5">
                  <div className="text-xs font-medium text-signal uppercase tracking-wider mb-3">Avoid</div>
                  {output.culture.avoid.map((item) => (
                    <div key={item} className="text-sm text-ink/70 flex items-start gap-2 mb-1.5 last:mb-0">
                      <span className="text-signal shrink-0">−</span> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="w-8 h-px bg-ink/15" />
                <p className="font-display font-bold text-sm text-ink/65">{output.culture.refinedPosition}</p>
              </div>
            </motion.div>

            {/* Phase 3: Signal Read */}
            <motion.div ref={(el) => { phaseRefs.current[3] = el; }} {...fade(3)}>
              <span className="eyebrow text-ink/40 mb-4 block">03 — Signal read</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {output.signals.map((s) => (
                  <div key={s.label} className="rounded-xl border border-ink/10 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${signalDot(s.strength)}`} />
                      <span className="text-xs text-ink/40 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="font-display font-bold text-2xl">{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phase 4: Tension */}
            <motion.div ref={(el) => { phaseRefs.current[4] = el; }} {...fade(4)}>
              <span className="eyebrow text-ink/40 mb-4 block">04 — Tension</span>
              <div className="rounded-xl bg-cream border border-ink/8 p-5 md:p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-mint font-medium text-sm shrink-0 mt-0.5">Signal</span>
                  <span className="text-sm text-ink/70">{output.tension.signal}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-signal font-medium text-sm shrink-0 mt-0.5">Culture</span>
                  <span className="text-sm text-ink/70">{output.tension.culture}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-electric font-medium text-sm shrink-0 mt-0.5">Health</span>
                  <span className="text-sm text-ink/70">{output.tension.health}</span>
                </div>
                <div className="border-t border-ink/10 pt-3 flex items-start gap-2">
                  <span className="text-electric shrink-0">→</span>
                  <span className="text-sm text-ink/80 font-medium">{output.tension.resolution}</span>
                </div>
              </div>
            </motion.div>

            {/* Phase 5: Decision */}
            <motion.div ref={(el) => { phaseRefs.current[5] = el; }} {...fade(5)}>
              <span className="eyebrow text-ink/40 mb-4 block">05 — Decision</span>
              <div className="rounded-2xl bg-ink text-paper p-8 md:p-10">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-5">
                  <div className="font-display font-bold text-6xl md:text-8xl leading-none tracking-tight flex items-center gap-4">
                    <span className={decisionColor(output.decision)}>→</span>
                    <span>{output.decision}</span>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-paper/35 text-xs uppercase tracking-wider mb-1">Confidence</div>
                      <div className="font-display font-bold text-2xl">{output.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-paper/35 text-xs uppercase tracking-wider mb-1">Risk</div>
                      <div className={`font-display font-bold text-2xl ${
                        output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"
                      }`}>{output.risk}</div>
                    </div>
                  </div>
                </div>
                <p className="text-paper/55 text-sm">{output.decisionLine}</p>
              </div>
            </motion.div>

            {/* Phase 6: Capital */}
            <motion.div ref={(el) => { phaseRefs.current[6] = el; }} {...fade(6)}>
              <span className="eyebrow text-ink/40 mb-4 block">06 — Capital</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {output.capitalActions.map((ca) => (
                  <div key={ca.action} className="rounded-xl border border-ink/10 p-4">
                    <div className="font-display font-bold text-lg mb-0.5">{ca.amount}</div>
                    <div className="text-sm font-medium text-ink/70 mb-1">{ca.action}</div>
                    <div className="text-xs text-ink/40">{ca.rationale}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phase 7: Execution */}
            <motion.div ref={(el) => { phaseRefs.current[7] = el; }} {...fade(7)}>
              <span className="eyebrow text-ink/40 mb-4 block">07 — Execution</span>
              <div className="rounded-xl border border-ink/10 divide-y divide-ink/8">
                {output.execution.map((ex) => (
                  <div key={ex.label} className="px-5 py-3.5 flex items-start gap-4">
                    <span className="text-sm font-medium text-ink/40 min-w-[5rem] shrink-0">{ex.label}</span>
                    <span className="text-sm text-ink/70">{ex.detail}</span>
                  </div>
                ))}
              </div>
              {/* Modules */}
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <a href="/lens" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/35 mb-0.5">Signal</div>
                    <div className="font-display font-bold text-sm">Artist & Track Lens</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">→</span>
                </a>
                <a href="https://youtube-campaign-coach.vercel.app" target="_blank" rel="noreferrer noopener" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/35 mb-0.5">Content</div>
                    <div className="font-display font-bold text-sm">YouTube Coach</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">↗</span>
                </a>
                <a href="https://campaign-timeline-viewer.vercel.app" target="_blank" rel="noreferrer noopener" className="group rounded-xl border border-ink/10 p-3.5 hover:border-ink/25 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink/35 mb-0.5">Timeline</div>
                    <div className="font-display font-bold text-sm">Campaign Timeline</div>
                  </div>
                  <span className="text-ink/20 group-hover:text-signal transition-colors">↗</span>
                </a>
              </div>
            </motion.div>

            {/* Phase 8: Live Feed */}
            <motion.div ref={(el) => { phaseRefs.current[8] = el; }} {...fade(8)}>
              <span className="eyebrow text-ink/40 mb-4 block">08 — Live feed</span>
              <div className="rounded-xl border border-ink/10 p-5 md:p-6">
                <div className="space-y-0">
                  {output.liveFeed
                    .slice(0, step === "complete" ? output.liveFeed.length : feedIndex + 1)
                    .map((ev, i) => (
                      <motion.div
                        key={`${ev.time}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="py-2 flex items-center gap-3 border-b border-ink/5 last:border-0"
                      >
                        <span className="text-xs text-ink/25 font-mono min-w-[3rem]">{ev.time}</span>
                        <span className={`${feedColor(ev.type)} text-xs shrink-0`}>{feedIcon(ev.type)}</span>
                        <span className={`text-sm ${
                          ev.type === "adjust" ? "text-ink/75 font-medium"
                          : ev.type === "trigger" ? "text-ink/65"
                          : "text-ink/45"
                        }`}>{ev.message}</span>
                      </motion.div>
                    ))}
                </div>
                <div className="border-t border-ink/10 pt-4 mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                    <span className="text-sm text-ink/50 font-medium">System active</span>
                  </div>
                  <span className="text-xs text-ink/30 font-mono">Next eval: 48h</span>
                </div>
              </div>
            </motion.div>

            {/* ── Why This Works (expandable) ──────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button
                  onClick={() => setWhyOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-ink/40 hover:text-ink/60 transition-colors mb-3"
                >
                  <span className="transition-transform" style={{ transform: whyOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                  Why this works
                </button>
                <AnimatePresence>
                  {whyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-cream border border-ink/8 p-5 space-y-3">
                        <div>
                          <div className="text-xs text-ink/40 uppercase tracking-wider mb-1">Cultural connection</div>
                          <p className="text-sm text-ink/65">{output.why.connection}</p>
                        </div>
                        <div>
                          <div className="text-xs text-ink/40 uppercase tracking-wider mb-1">Campaign direction</div>
                          <p className="text-sm text-ink/65">{output.why.direction}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Agent Bar ───────────────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="rounded-2xl bg-ink text-paper p-6 md:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse" />
                    <span className="font-display font-bold text-base">System running</span>
                  </div>
                  <span className="text-paper/35 text-xs font-mono">
                    {input.trackName} · {input.artistStage} · {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-paper/35 text-xs uppercase tracking-wider mb-1">Signals</div>
                    <div className="text-paper/70 text-sm font-medium flex items-center gap-1.5">
                      <span className={directionColor(output.artistHealth.growthState.direction)}>
                        {directionArrow(output.artistHealth.growthState.direction)}
                      </span>
                      {output.artistHealth.growthState.direction === "rising" ? "Rising" : output.artistHealth.growthState.direction === "stable" ? "Stable" : "Declining"}
                    </div>
                  </div>
                  <div>
                    <div className="text-paper/35 text-xs uppercase tracking-wider mb-1">Status</div>
                    <div className="text-paper/70 text-sm font-medium">Awaiting first eval</div>
                  </div>
                  <div>
                    <div className="text-paper/35 text-xs uppercase tracking-wider mb-1">Actions</div>
                    <div className="text-paper/70 text-sm font-medium">None yet</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reset */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-4 border-t border-ink/10"
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
          </div>
        )}
      </div>
    </main>
  );
}
