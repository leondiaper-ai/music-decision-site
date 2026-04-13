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
  summary: string;
}

interface CulturalIntelligence {
  campaignType: string;
  reference: string;
  tone: string;
  intent: string;
  constraint: string;
  /* Mapping layer */
  filmVisual: string;
  artistParallels: string;
  audienceClusters: string;
  creativeDirection: string;
  /* Refinement layer */
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

interface SystemOutput {
  artistHealth: ArtistHealth;
  culture: CulturalIntelligence;
  signals: SignalRead[];
  tension: Tension;
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  decisionReason: string;
  capitalActions: CapitalAction[];
  execution: ExecutionDirective[];
  liveFeed: LiveFeedEvent[];
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

  // ── Artist Health ──
  const artistHealth: ArtistHealth = isEmerging
    ? {
        fanbaseStrength: { value: "12k monthly", state: "weak" },
        repeatListening: { value: "1.4×", state: "moderate" },
        engagementDepth: { value: "High", state: "strong" },
        growthState: { label: "Early traction", direction: "rising" },
        summary:
          "Small but deeply engaged audience. Growth signals are present but unconfirmed at scale.",
      }
    : isEstablished
    ? {
        fanbaseStrength: { value: "2.1M monthly", state: "strong" },
        repeatListening: { value: "2.8×", state: "strong" },
        engagementDepth: { value: "Moderate", state: "moderate" },
        growthState: { label: "Plateau", direction: "stable" },
        summary:
          "Large, loyal audience with strong repeat behaviour. Growth has levelled — new release is an opportunity to re-engage.",
      }
    : {
        fanbaseStrength: { value: "340k monthly", state: "moderate" },
        repeatListening: { value: "2.1×", state: "strong" },
        engagementDepth: { value: "High", state: "strong" },
        growthState: { label: "Accelerating", direction: "rising" },
        summary:
          "Mid-size audience with strong engagement signals. Growth is accelerating — momentum is real.",
      };

  // ── Cultural Intelligence ──
  const culture: CulturalIntelligence = isEmerging
    ? {
        campaignType: "Discovery campaign",
        reference: "Raw studio session, first headline show energy",
        tone: "Lo-fi, raw, unfiltered",
        intent: "Authenticity + discovery",
        constraint: "No over-polished assets. Nothing that breaks the narrative.",
        filmVisual: "Grainy backstage footage, handheld camera, natural light",
        artistParallels: "Early PinkPantheress, Clairo bedroom era, pre-fame Billie Eilish",
        audienceClusters: "Taste-first listeners, indie playlist followers, micro-community hubs",
        creativeDirection: "Intimacy over production value. Let the rawness be the hook.",
        leanInto: [
          "Behind-the-scenes authenticity",
          "Fan-first content (DMs, small shows, raw takes)",
          "Platform-native formats (Stories, lo-fi Reels)",
        ],
        avoid: [
          "Polished music videos that feel disconnected from stage",
          "Generic playlist pitching without narrative",
          "Influencer placements that dilute credibility",
        ],
        refinedPosition:
          "Position as discovery — the artist people find, not the artist being pushed.",
      }
    : isEstablished
    ? {
        campaignType: "Scale campaign",
        reference: "Arena-level confidence, catalogue moment",
        tone: "Cinematic, high-production",
        intent: "Scale + cultural positioning",
        constraint: "No cheap reach. Everything must match stature.",
        filmVisual: "Widescreen cinematography, editorial-grade stills, monument shots",
        artistParallels: "Peak Drake rollout, Beyoncé visual album precision",
        audienceClusters: "Mainstream pop crossover, playlist power users, cultural commentators",
        creativeDirection: "Every asset is an event. Scale the moment, not the noise.",
        leanInto: [
          "Premium hero content (short film, visual EP)",
          "Editorial partnerships and press exclusives",
          "Simultaneous multi-platform launch",
        ],
        avoid: [
          "High-volume low-quality content",
          "Trend-chasing formats that feel beneath the artist",
          "Discount pricing or bundle gimmicks",
        ],
        refinedPosition:
          "Position as cultural moment — the release everyone talks about, not just hears.",
      }
    : {
        campaignType: "Momentum campaign",
        reference: "Breakout single, underground-to-mainstream crossover",
        tone: "Energetic, narrative-driven",
        intent: "Credibility + momentum",
        constraint: "No generic content. Every asset must build the story.",
        filmVisual: "Dynamic performance footage, split-screen narratives, street-level energy",
        artistParallels: "Central Cee breakout phase, early Doja Cat, Raye pre-Grammy run",
        audienceClusters: "Genre-adjacent explorers, playlist curators, music Twitter/TikTok opinion",
        creativeDirection: "Tell the story of the moment. This is the breakout — make it feel inevitable.",
        leanInto: [
          "Narrative-first content (the story behind the track)",
          "Creator partnerships that build credibility",
          "Staggered release to build anticipation",
        ],
        avoid: [
          "Over-saturation that kills the build",
          "Generic paid ads without narrative framing",
          "Skipping organic validation for paid scale",
        ],
        refinedPosition:
          "Position as momentum — the artist on the edge of breaking through.",
      };

  // ── Signals (now reference artist health) ──
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

  // ── Tension (now includes health) ──
  const tension: Tension = isEmerging
    ? {
        signal: "Strong early engagement suggests scaling potential",
        culture: "Cultural context requires raw, authentic positioning",
        health:
          "Artist health shows small but deeply engaged audience — scaling too fast risks dilution",
        resolution:
          decision === "TEST"
            ? "System resolves: validate signal before scaling. Protect the narrative. Let the audience grow into the artist."
            : "System resolves: hold until signal is strong enough to scale without compromising authenticity.",
      }
    : isEstablished
    ? {
        signal: "Strong signal across all metrics supports aggressive deployment",
        culture: "Cultural context demands premium execution at every touchpoint",
        health:
          "Artist health shows plateau — this release is a re-engagement opportunity, not maintenance",
        resolution:
          "System resolves: push aggressively, but every asset must match stature. Use this as a catalyst to reactivate the base.",
      }
    : {
        signal: "Mixed signal — strong engagement, moderate reach",
        culture: "Narrative positioning requires credibility over volume",
        health:
          "Artist health shows accelerating growth — momentum is real and should be protected",
        resolution:
          decision === "PUSH"
            ? "System resolves: push with narrative-first content. Ride the momentum, but story over scale."
            : decision === "TEST"
            ? "System resolves: test narrative formats before committing budget to scale."
            : "System resolves: hold and strengthen narrative foundation before spending.",
      };

  // ── Decision reason (now references health + culture) ──
  const decisionReason =
    decision === "PUSH"
      ? `Signal supports deployment. Artist health (${artistHealth.growthState.label.toLowerCase()}) and cultural direction (${culture.intent.toLowerCase()}) align. System is confident.`
      : decision === "TEST"
      ? `Signal is promising but unconfirmed. Artist health (${artistHealth.growthState.label.toLowerCase()}) suggests caution. Deploying capital to validate within ${culture.tone.toLowerCase()} framework.`
      : `Insufficient signal to justify spend. Artist health (${artistHealth.growthState.label.toLowerCase()}) and cultural frame require stronger evidence before deployment.`;

  // ── Capital actions ──
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

  // ── Live feed events ──
  const liveFeed: LiveFeedEvent[] =
    decision === "PUSH"
      ? [
          { time: "Now", type: "monitor", message: "System active. Monitoring all signal channels." },
          { time: "+6h", type: "monitor", message: `Tracking save rate against ${culture.campaignType.toLowerCase()} baseline.` },
          { time: "+24h", type: "trigger", message: "First signal evaluation. Checking playlist velocity + engagement depth." },
          { time: "+24h", type: "adjust", message: "If save rate drops below 3% → downgrade to TEST. Pause paid." },
          { time: "+48h", type: "trigger", message: "Second evaluation. Cross-reference artist health for sustained engagement." },
          { time: "+48h", type: "adjust", message: "If playlist adds spike → increase paid support immediately." },
          { time: "+72h", type: "monitor", message: "Full campaign review. Reallocate capital based on 72hr data." },
        ]
      : decision === "TEST"
      ? [
          { time: "Now", type: "monitor", message: "System active. Observing organic response before deployment." },
          { time: "+12h", type: "monitor", message: "Tracking early engagement against artist health baseline." },
          { time: "+24h", type: "trigger", message: "First signal check. Looking for save rate confirmation." },
          { time: "+24h", type: "adjust", message: "If save rate exceeds 4.5% → upgrade to PUSH. Scale spend." },
          { time: "+48h", type: "trigger", message: "Content format evaluation. Which formats are resonating?" },
          { time: "+48h", type: "adjust", message: "If no signal after 48h → downgrade to HOLD. Preserve capital." },
          { time: "+7d", type: "monitor", message: "Full test cycle complete. System recommends next phase." },
        ]
      : [
          { time: "Now", type: "monitor", message: "System active. Monitoring for signal emergence." },
          { time: "+24h", type: "monitor", message: "Watching organic save rate and audience behaviour." },
          { time: "+48h", type: "trigger", message: "Signal check. Any organic traction?" },
          { time: "+48h", type: "adjust", message: "If organic save rate crosses 3% → upgrade to TEST." },
          { time: "+7d", type: "monitor", message: "Weekly artist health update. Re-evaluate growth state." },
          { time: "+7d", type: "adjust", message: "If new audience data → re-evaluate cultural frame." },
          { time: "+14d", type: "monitor", message: "Full hold review. System decides: continue hold or activate." },
        ];

  return {
    artistHealth,
    culture,
    signals,
    tension,
    decision,
    confidence,
    risk,
    decisionReason,
    capitalActions,
    execution,
    liveFeed,
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

/* ─── System Run Phases ─────────────────────────────────── */

const PHASE_COUNT = 9;
// 0: artist health, 1: cultural mapping, 2: cultural refinement,
// 3: signals, 4: tension, 5: decision, 6: capital, 7: execution, 8: live feed
const PHASE_DELAY = 1200;

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
  const [feedIndex, setFeedIndex] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const budgetValue = BUDGET_MAP(input.budget);

  const handleStart = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("running");
    setPhase(0);
    setFeedIndex(0);
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

  // Live feed drip — one event every 800ms after phase 8 appears
  useEffect(() => {
    if (phase < 8 || !output) return;
    if (feedIndex < output.liveFeed.length - 1) {
      const t = setTimeout(() => setFeedIndex((i) => i + 1), 800);
      return () => clearTimeout(t);
    }
  }, [phase, feedIndex, output]);

  // Scroll to latest phase
  useEffect(() => {
    if (step === "running" || step === "complete") {
      const el = phaseRefs.current[phase];
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          150
        );
      }
    }
  }, [step, phase]);

  const handleReset = useCallback(() => {
    setStep("input");
    setOutput(null);
    setPhase(0);
    setFeedIndex(0);
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
          <span className="eyebrow text-paper/50 mb-4 block">
            Campaign System
          </span>
          <p className="text-paper/45 text-sm md:text-base mb-4">
            Most music marketing spend is guesswork.
          </p>
          <h1 className="headline font-display text-5xl md:text-7xl leading-[0.95]">
            AI runs
            <br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-paper/60 max-w-lg">
            From decision → content → spend → optimisation. Continuously.
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
                      setInput((p) => ({ ...p, budget: Number(e.target.value) }))
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

              <button
                onClick={handleStart}
                disabled={!input.trackName.trim()}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-7 py-3.5 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Run System
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SYSTEM RUN (progressive reveal) ───────── */}
        {(step === "running" || step === "complete") && output && (
          <div className="space-y-16 md:space-y-24">
            {/* ── Phase 0: Artist Health (persistent) ──── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[0] = el;
              }}
              {...fade(0)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                00 — Artist health baseline
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Fanbase strength",
                      ...output.artistHealth.fanbaseStrength,
                    },
                    {
                      label: "Repeat listening",
                      ...output.artistHealth.repeatListening,
                    },
                    {
                      label: "Engagement depth",
                      ...output.artistHealth.engagementDepth,
                    },
                  ].map((m) => (
                    <div key={m.label} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${healthDot(m.state)}`}
                        />
                        <span className="text-xs text-ink/45 uppercase tracking-wider">
                          {m.label}
                        </span>
                      </div>
                      <div className="font-display font-bold text-xl">
                        {m.value}
                      </div>
                      <div className="text-xs text-ink/40 capitalize">
                        {m.state}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <div className="text-xs text-ink/45 uppercase tracking-wider">
                      Growth state
                    </div>
                    <div className="font-display font-bold text-xl flex items-center gap-2">
                      <span
                        className={directionColor(
                          output.artistHealth.growthState.direction
                        )}
                      >
                        {directionArrow(
                          output.artistHealth.growthState.direction
                        )}
                      </span>
                      {output.artistHealth.growthState.label}
                    </div>
                    <div className="text-xs text-ink/40 capitalize">
                      {output.artistHealth.growthState.direction}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ink/60 border-t border-ink/10 pt-4">
                  {output.artistHealth.summary}
                </p>
                <p className="text-xs text-ink/35 mt-2 italic">
                  This layer persists throughout the system run. Every decision
                  references it.
                </p>
              </div>
            </motion.div>

            {/* ── Phase 1: Cultural Intelligence — Mapping ── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[1] = el;
              }}
              {...fade(1)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                01 — Mapping cultural intelligence
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Campaign type
                    </div>
                    <p className="font-display font-bold text-lg">
                      {output.culture.campaignType}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Reference
                    </div>
                    <p className="text-sm text-ink/70">
                      {output.culture.reference}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Tone
                    </div>
                    <p className="font-display font-bold text-base">
                      {output.culture.tone}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Intent
                    </div>
                    <p className="font-display font-bold text-base">
                      {output.culture.intent}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Constraint
                    </div>
                    <p className="text-sm text-ink/65 italic">
                      {output.culture.constraint}
                    </p>
                  </div>
                </div>
                <div className="border-t border-ink/10 pt-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Film / visual reference
                    </div>
                    <p className="text-sm text-ink/70">
                      {output.culture.filmVisual}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Artist parallels
                    </div>
                    <p className="text-sm text-ink/70">
                      {output.culture.artistParallels}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Audience clusters
                    </div>
                    <p className="text-sm text-ink/70">
                      {output.culture.audienceClusters}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                      Creative direction
                    </div>
                    <p className="text-sm text-ink/70 font-medium">
                      {output.culture.creativeDirection}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Phase 2: Cultural Intelligence — Refinement ── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[2] = el;
              }}
              {...fade(2)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                02 — Refining cultural alignment
              </span>
              <div className="rounded-xl bg-cream border border-ink/10 p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="text-xs font-medium text-mint uppercase tracking-wider mb-3">
                      Lean into
                    </div>
                    <div className="space-y-2">
                      {output.culture.leanInto.map((item) => (
                        <div
                          key={item}
                          className="text-sm text-ink/75 flex items-start gap-2"
                        >
                          <span className="text-mint shrink-0 mt-0.5">+</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-signal uppercase tracking-wider mb-3">
                      Avoid
                    </div>
                    <div className="space-y-2">
                      {output.culture.avoid.map((item) => (
                        <div
                          key={item}
                          className="text-sm text-ink/75 flex items-start gap-2"
                        >
                          <span className="text-signal shrink-0 mt-0.5">
                            −
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-ink/15 pt-5">
                  <div className="text-xs font-medium text-ink/40 uppercase tracking-wider mb-2">
                    Refined position
                  </div>
                  <p className="text-base text-ink/80 font-display font-bold">
                    {output.culture.refinedPosition}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Phase 3: Signal Read ─────────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[3] = el;
              }}
              {...fade(3)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                03 — Reading signal against artist health + cultural context
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {output.signals.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-ink/10 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-2 h-2 rounded-full ${signalDot(s.strength)}`}
                      />
                      <span className="text-xs text-ink/45 uppercase tracking-wider">
                        {s.label}
                      </span>
                    </div>
                    <div className="font-display font-bold text-xl">
                      {s.value}
                    </div>
                    <div className="text-xs text-ink/40 mt-1 capitalize">
                      {s.strength}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Phase 4: Tension ─────────────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[4] = el;
              }}
              {...fade(4)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                04 — System tension
              </span>
              <div className="rounded-xl bg-cream border border-ink/10 p-6 md:p-8">
                <div className="space-y-4 mb-6">
                  <p className="text-base md:text-lg text-ink/80">
                    <span className="text-mint font-medium">Signal:</span>{" "}
                    {output.tension.signal}
                  </p>
                  <p className="text-base md:text-lg text-ink/80">
                    <span className="text-signal font-medium">Culture:</span>{" "}
                    {output.tension.culture}
                  </p>
                  <p className="text-base md:text-lg text-ink/80">
                    <span className="text-electric font-medium">Health:</span>{" "}
                    {output.tension.health}
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

            {/* ── Phase 5: Decision ────────────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[5] = el;
              }}
              {...fade(5)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                05 — Decision
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
                        className={`font-display font-bold text-3xl ${
                          output.risk === "Low"
                            ? "text-mint"
                            : output.risk === "Medium"
                            ? "text-sun"
                            : "text-signal"
                        }`}
                      >
                        {output.risk}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-paper/65 text-base leading-snug">
                  {output.decisionReason}
                </p>
                <p className="text-paper/40 text-sm mt-4 italic">
                  Artist health, cultural intelligence, and signal — all
                  converge here.
                </p>
              </div>
            </motion.div>

            {/* ── Phase 6: Capital Actions ─────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[6] = el;
              }}
              {...fade(6)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                06 — Capital deployment
              </span>
              <div className="space-y-3">
                {output.capitalActions.map((ca) => (
                  <div
                    key={ca.action}
                    className="rounded-xl border border-ink/10 p-5 flex flex-wrap items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-display font-bold text-base mb-1">
                        {ca.action}
                      </div>
                      <p className="text-sm text-ink/55">{ca.rationale}</p>
                    </div>
                    <div className="font-display font-bold text-lg text-ink/80">
                      {ca.amount}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Phase 7: Execution ───────────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[7] = el;
              }}
              {...fade(7)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                07 — Execution plan
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="divide-y divide-ink/10">
                  {output.execution.map((ex) => (
                    <div
                      key={ex.label}
                      className="py-3.5 grid md:grid-cols-12 gap-2"
                    >
                      <div className="md:col-span-4 text-sm font-medium text-ink/50">
                        {ex.label}
                      </div>
                      <div className="md:col-span-8 text-sm text-ink/75">
                        {ex.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System modules */}
              <div className="mt-6">
                <div className="eyebrow text-ink/40 mb-3">
                  System modules activated
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <a
                    href="/lens"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Signal</div>
                      <div className="font-display font-bold text-sm">
                        Artist & Track Lens
                      </div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">
                      →
                    </span>
                  </a>
                  <a
                    href="https://youtube-campaign-coach.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Content</div>
                      <div className="font-display font-bold text-sm">
                        YouTube Campaign Coach
                      </div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://campaign-timeline-viewer.vercel.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-ink/10 p-4 hover:border-ink/25 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-ink/40 mb-0.5">Timeline</div>
                      <div className="font-display font-bold text-sm">
                        Campaign Timeline
                      </div>
                    </div>
                    <span className="text-ink/25 group-hover:text-signal transition-colors">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── Phase 8: Live System Feed ────────────── */}
            <motion.div
              ref={(el) => {
                phaseRefs.current[8] = el;
              }}
              {...fade(8)}
            >
              <span className="eyebrow text-ink/50 mb-6 block">
                08 — Live system feed
              </span>
              <div className="rounded-xl border border-ink/10 p-6 md:p-8">
                <div className="space-y-0">
                  {output.liveFeed
                    .slice(0, step === "complete" ? output.liveFeed.length : feedIndex + 1)
                    .map((ev, i) => (
                      <motion.div
                        key={`${ev.time}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="py-2.5 flex items-start gap-3 border-b border-ink/5 last:border-0"
                      >
                        <span className="text-xs text-ink/30 font-mono min-w-[3.5rem] pt-0.5">
                          {ev.time}
                        </span>
                        <span className={`${feedColor(ev.type)} text-sm pt-0.5 shrink-0`}>
                          {feedIcon(ev.type)}
                        </span>
                        <span
                          className={`text-sm ${
                            ev.type === "adjust"
                              ? "text-ink/80 font-medium"
                              : ev.type === "trigger"
                              ? "text-ink/70"
                              : "text-ink/55"
                          }`}
                        >
                          {ev.message}
                        </span>
                      </motion.div>
                    ))}
                </div>

                {/* Persistent system status */}
                <div className="border-t border-ink/10 pt-5 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                      <span className="text-sm text-ink/55 font-medium">
                        System active
                      </span>
                    </div>
                    <span className="text-xs text-ink/35 font-mono">
                      Next evaluation in 48h
                    </span>
                  </div>
                  <p className="text-xs text-ink/35 mt-3 italic">
                    The system doesn&apos;t stop at the decision. It monitors,
                    interprets, and adjusts — continuously.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Persistent Agent Bar ─────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="rounded-2xl bg-ink text-paper p-6 md:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse" />
                    <span className="font-display font-bold text-lg">
                      Campaign system is running
                    </span>
                  </div>
                  <span className="text-paper/40 text-xs font-mono">
                    {input.trackName} · {input.artistStage} ·{" "}
                    {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-5">
                  <div>
                    <div className="text-paper/40 text-xs uppercase tracking-wider mb-1">
                      Current signals
                    </div>
                    <div className="text-paper/75 text-sm font-medium flex items-center gap-2">
                      <span
                        className={directionColor(
                          output.artistHealth.growthState.direction
                        )}
                      >
                        {directionArrow(
                          output.artistHealth.growthState.direction
                        )}
                      </span>
                      {output.artistHealth.growthState.direction === "rising"
                        ? "Rising"
                        : output.artistHealth.growthState.direction === "stable"
                        ? "Stable"
                        : "Declining"}
                    </div>
                  </div>
                  <div>
                    <div className="text-paper/40 text-xs uppercase tracking-wider mb-1">
                      Evaluation status
                    </div>
                    <div className="text-paper/75 text-sm font-medium">
                      Awaiting first signal check
                    </div>
                  </div>
                  <div>
                    <div className="text-paper/40 text-xs uppercase tracking-wider mb-1">
                      Triggered actions
                    </div>
                    <div className="text-paper/75 text-sm font-medium">
                      None yet
                    </div>
                  </div>
                </div>
                <p className="text-paper/35 text-xs border-t border-paper/10 pt-4">
                  This system is always on. Artist health, cultural context, and
                  signal are monitored continuously. The next evaluation will
                  refine or override this decision.
                </p>
              </motion.div>
            )}

            {/* ── Reset ────────────────────────────────── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-6 border-t border-ink/10"
              >
                <button
                  onClick={handleReset}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
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
