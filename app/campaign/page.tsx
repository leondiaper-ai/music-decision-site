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

interface TimelineEntry {
  time: string;
  action: string;
  reasoning: string;
  type: "system" | "decision" | "deploy" | "execute" | "monitor" | "adjust";
  tool?: { label: string; href: string; external?: boolean };
  expand?: { heading: string; lines: string[] };
  graphIdx?: number; // index into performance data — links to graph
}

interface PerfPoint {
  day: number;
  streams: number;
  saves: number;
  label?: string;
  event?: "decision" | "deploy" | "adjust" | "monitor";
}

interface ContextStrip {
  artist: string;
  growth: string;
  growthDir: "rising" | "stable" | "declining";
  culture: string;
  tone: string;
  signalSummary: string;
  signalStrength: "strong" | "mixed" | "weak";
}

interface SystemOutput {
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  context: ContextStrip;
  timeline: TimelineEntry[];
  perf: PerfPoint[];
}

/* ─── Engine ────────────────────────────────────────────── */

const BUDGET_MAP = (pct: number) => Math.round(500 + (pct / 100) * 49500);

function fmt(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
}

function fmtK(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

function generate(input: CampaignInput): SystemOutput {
  const budget = BUDGET_MAP(input.budget);
  const isEm = input.artistStage === "emerging";
  const isEs = input.artistStage === "established";

  const context: ContextStrip = isEm
    ? { artist: "12k monthly · high engagement", growth: "Early traction", growthDir: "rising", culture: "Discovery", tone: "Lo-fi, raw", signalSummary: "Save 3.2% · Reach −12% · Engagement high", signalStrength: "mixed" }
    : isEs
    ? { artist: "2.1M monthly · moderate engagement", growth: "Plateau", growthDir: "stable", culture: "Scale", tone: "Cinematic", signalSummary: "Save 5.1% · Reach +24% · Velocity high", signalStrength: "strong" }
    : { artist: "340k monthly · high engagement", growth: "Accelerating", growthDir: "rising", culture: "Momentum", tone: "Energetic, narrative", signalSummary: "Save 4.1% · Reach +8% · Engagement high", signalStrength: "mixed" };

  let decision: Decision, confidence: number, risk: "Low" | "Medium" | "High";
  if (isEs && budget > 15000) { decision = "PUSH"; confidence = 87; risk = "Low"; }
  else if (isEm && budget < 5000) { decision = "TEST"; confidence = 72; risk = "Medium"; }
  else if (isEs) { decision = "PUSH"; confidence = 78; risk = "Low"; }
  else if (budget > 20000) { decision = "PUSH"; confidence = 81; risk = "Medium"; }
  else if (isEm) { decision = "TEST"; confidence = 68; risk = "Medium"; }
  else { decision = "HOLD"; confidence = 64; risk = "High"; }

  /* ── Performance data ── */
  const base = isEs ? 45000 : isEm ? 800 : 8000;
  const saveBase = isEs ? 5.1 : isEm ? 3.2 : 4.1;
  const mult = decision === "PUSH" ? 1.6 : decision === "TEST" ? 1.15 : 0.95;

  const perf: PerfPoint[] = [
    { day: 0, streams: base, saves: saveBase, label: "Launch", event: "decision" },
    { day: 1, streams: Math.round(base * 1.2), saves: saveBase + 0.2 },
    { day: 2, streams: Math.round(base * 1.1), saves: saveBase + 0.1 },
    { day: 3, streams: Math.round(base * mult * 0.9), saves: saveBase + (decision === "PUSH" ? 0.8 : 0.1), label: decision === "PUSH" ? "Paid activated" : undefined, event: decision === "PUSH" ? "deploy" : undefined },
    { day: 4, streams: Math.round(base * mult * 1.0), saves: saveBase + (decision === "PUSH" ? 1.1 : 0.2) },
    { day: 5, streams: Math.round(base * mult * 1.05), saves: saveBase + (decision === "PUSH" ? 1.3 : 0.15) },
    { day: 7, streams: Math.round(base * mult * 1.15), saves: saveBase + (decision === "PUSH" ? 1.5 : decision === "TEST" ? 0.6 : -0.2), label: "7-day eval", event: "monitor" },
    { day: 10, streams: Math.round(base * mult * (decision === "PUSH" ? 1.4 : decision === "TEST" ? 1.1 : 0.85)), saves: saveBase + (decision === "PUSH" ? 1.8 : decision === "TEST" ? 0.8 : -0.5) },
    { day: 14, streams: Math.round(base * mult * (decision === "PUSH" ? 1.65 : decision === "TEST" ? 1.2 : 0.75)), saves: saveBase + (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.0 : -0.7), label: decision === "PUSH" ? "System scaled" : decision === "TEST" ? "Signal confirmed" : "Under review", event: "adjust" },
    { day: 21, streams: Math.round(base * mult * (decision === "PUSH" ? 1.9 : decision === "TEST" ? 1.35 : 0.7)), saves: saveBase + (decision === "PUSH" ? 2.3 : decision === "TEST" ? 1.2 : -0.8) },
    { day: 28, streams: Math.round(base * mult * (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.5 : 0.65)), saves: saveBase + (decision === "PUSH" ? 2.5 : decision === "TEST" ? 1.4 : -1.0), label: "28-day review", event: "monitor" },
  ];

  /* ── Timeline ── */
  const tl: TimelineEntry[] = [
    {
      time: "00:00", type: "system",
      action: `System set ${context.culture.toLowerCase()} frame — ${context.tone.toLowerCase()} positioning`,
      reasoning: `Artist at ${context.growth.toLowerCase()} with ${context.artist.split("·")[0].trim()}. ${isEm ? "Authenticity over scale." : isEs ? "Every touchpoint must match stature." : "Story over volume."}`,
      graphIdx: 0,
      expand: {
        heading: "Cultural references",
        lines: isEm
          ? ["Film: Grainy backstage, handheld, natural light", "Artist: Early PinkPantheress, Clairo bedroom era", "Audience: Taste-first listeners, micro-communities"]
          : isEs
          ? ["Film: Widescreen cinematography, monument shots", "Artist: Peak Drake rollout, Beyoncé precision", "Audience: Mainstream crossover, cultural commentators"]
          : ["Film: Dynamic performance, split-screen, street energy", "Artist: Central Cee breakout, early Doja Cat", "Audience: Genre explorers, playlist curators"],
      },
    },
    {
      time: "00:01", type: "system",
      action: isEs ? "System read strong signal across all metrics" : isEm ? "System read mixed signal — high engagement, weak reach" : "System read strong engagement with moderate reach",
      reasoning: `${context.signalSummary}. ${isEm ? "Depth is there, scale isn't confirmed." : isEs ? "Data supports aggressive deployment." : "Momentum is real."}`,
      tool: { label: "Artist & Track Lens", href: "/lens" },
      graphIdx: 0,
      expand: {
        heading: "Signal breakdown",
        lines: isEs
          ? ["Save rate: 5.1% (strong)", "Reach: +24% (strong)", "Velocity: High (strong)", "Skip: 18% (moderate)"]
          : isEm
          ? ["Save rate: 3.2% (moderate)", "Reach: −12% (weak)", "Velocity: Low (weak)", "Engagement: High (strong)"]
          : ["Save rate: 4.1% (strong)", "Reach: +8% (moderate)", "Velocity: Med (moderate)", "Engagement: High (strong)"],
      },
    },
    {
      time: "00:02", type: "system",
      action: isEm ? "System detected tension — engagement suggests scale, but health says protect"
        : isEs ? "System detected opportunity — strong signal, plateau means reactivate"
        : "System detected momentum — channel it, don't burn it",
      reasoning: isEm ? "Small audience, deep engagement. Scaling too fast dilutes." : isEs ? "Loyal base is flat. This release is the catalyst." : "Growth accelerating. Protect credibility while extending.",
    },
    {
      time: "00:03", type: "decision", graphIdx: 0,
      action: decision === "PUSH" ? `System decided: PUSH. Deploy ${fmt(budget)}.`
        : decision === "TEST" ? `System decided: TEST. Validate before committing ${fmt(budget)}.`
        : `System decided: HOLD. ${fmt(budget)} preserved.`,
      reasoning: `Confidence ${confidence}%, risk ${risk.toLowerCase()}. ${decision === "PUSH" ? "Health and culture align. Go." : decision === "TEST" ? "Promising but unconfirmed. Prove it." : "Not enough evidence. Wait."}`,
    },
  ];

  /* capital */
  if (decision === "PUSH") {
    tl.push({ time: "00:04", type: "deploy", graphIdx: 3, action: `System allocated ${fmt(Math.round(budget * 0.4))} to paid reach — signal confirms audience`, reasoning: "Largest allocation. Extending momentum.", tool: { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true } });
    tl.push({ time: "00:04", type: "deploy", action: `System allocated ${fmt(Math.round(budget * 0.35))} to content — ${context.tone.toLowerCase()} assets`, reasoning: isEs ? "Cinematic first impression." : isEm ? "Raw, unpolished. Protect the narrative." : "Narrative-driven. Story first." });
    tl.push({ time: "00:04", type: "deploy", action: `System held ${fmt(Math.round(budget * 0.25))} — creators + reserve`, reasoning: "Positioned for week-1 reallocation." });
  } else if (decision === "TEST") {
    tl.push({ time: "00:04", type: "deploy", action: `System allocated ${fmt(Math.round(budget * 0.4))} to content — test formats`, reasoning: "Validate what resonates before scaling.", tool: { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true } });
    tl.push({ time: "00:04", type: "deploy", action: `System delayed ${fmt(Math.round(budget * 0.25))} paid — organic first`, reasoning: "Paid only after 48hr confirmation." });
    tl.push({ time: "00:04", type: "deploy", action: `System held ${fmt(Math.round(budget * 0.35))} in reserve`, reasoning: "Capital ready for rapid reallocation." });
  } else {
    tl.push({ time: "00:04", type: "deploy", action: "System held all paid spend", reasoning: "No signal to justify deployment." });
    tl.push({ time: "00:04", type: "deploy", action: `System allocated ${fmt(Math.round(budget * 0.7))} to research + baseline content`, reasoning: "Build understanding first." });
  }

  /* execution */
  tl.push({
    time: "00:05", type: "execute", graphIdx: 0,
    action: decision === "PUSH"
      ? isEs ? "System set execution: hero assets, editorial placements, day-1 simultaneous launch"
        : isEm ? "System set execution: raw content, authentic voices, organic → paid at 48hr"
        : "System set execution: narrative assets, genre-adjacent creators, 7-day staggered rollout"
      : decision === "TEST"
      ? "System set execution: test formats, micro-creators, organic-first"
      : "System set execution: minimal output, research mode",
    reasoning: `Execution shaped by ${context.culture.toLowerCase()} frame.`,
    tool: { label: "Campaign Timeline", href: "https://campaign-timeline-viewer.vercel.app", external: true },
    expand: {
      heading: "Execution detail",
      lines: decision === "PUSH"
        ? isEs ? ["Content: Hero assets, cinematic.", "Creators: Editorial + press.", "Timing: Simultaneous day-1."]
          : isEm ? ["Content: Raw, unpolished.", "Creators: Authentic voices.", "Timing: Organic → paid 48hr."]
          : ["Content: Narrative-driven.", "Creators: Genre-adjacent.", "Timing: 7-day stagger."]
        : decision === "TEST"
        ? ["Content: Test formats.", "Creators: Micro, aligned.", "Timing: Organic first."]
        : ["Content: Minimal.", "Creators: Research only.", "Timing: No paid."],
    },
  });

  /* monitoring */
  tl.push({ time: "Day 3", type: "monitor", graphIdx: 3, action: decision === "PUSH" ? "Monitoring — paid activated, tracking initial response" : "Monitoring — observing organic response", reasoning: "No intervention. System watching." });
  tl.push({ time: "Day 7", type: "monitor", graphIdx: 6, action: "System evaluated 7-day performance against baseline", reasoning: "Cross-referencing artist health + signal data.", tool: { label: "Artist & Track Lens", href: "/lens" } });
  tl.push({
    time: "Day 14", type: "adjust", graphIdx: 8,
    action: decision === "PUSH" ? "System adjusted — scaling paid support, reallocating reserve"
      : decision === "TEST" ? "System adjusted — signal confirmed, preparing upgrade to PUSH"
      : "System adjusted — reviewing hold position",
    reasoning: decision === "PUSH" ? "Streams +65%, saves climbing. Momentum confirmed." : decision === "TEST" ? "Save rate crossed threshold. Evidence supports deployment." : "Limited traction. Extending hold.",
  });
  tl.push({ time: "Day 28", type: "monitor", graphIdx: 10, action: "Monitoring — 28-day review complete", reasoning: "System active. Next cycle begins." });

  return { decision, confidence, risk, context, timeline: tl, perf };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision) { return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric"; }
function dirArrow(d: "rising" | "stable" | "declining") { return d === "rising" ? "↑" : d === "stable" ? "→" : "↓"; }
function dirColor(d: "rising" | "stable" | "declining") { return d === "rising" ? "text-mint" : d === "stable" ? "text-sun" : "text-signal"; }
function dotColor(t: TimelineEntry["type"]) { return t === "decision" ? "bg-ink" : t === "deploy" ? "bg-mint" : t === "execute" ? "bg-electric" : t === "adjust" ? "bg-signal" : "bg-ink/20"; }
function strengthDot(s: "strong" | "mixed" | "weak") { return s === "strong" ? "bg-mint" : s === "mixed" ? "bg-sun" : "bg-signal"; }
function eventDotColor(e?: string) { return e === "decision" ? "bg-ink" : e === "deploy" ? "bg-mint" : e === "adjust" ? "bg-signal" : "bg-ink/20"; }

/* ─── SVG Graph ─────────────────────────────────────────── */

function PerfGraph({ data, highlightIdx, onHover }: {
  data: PerfPoint[];
  highlightIdx: number | null;
  onHover: (idx: number | null) => void;
}) {
  const W = 400, H = 200, PX = 36, PY = 20;
  const maxStreams = Math.max(...data.map((d) => d.streams)) * 1.1;
  const maxDay = data[data.length - 1].day || 1;

  const x = (d: number) => PX + ((d / maxDay) * (W - PX * 2));
  const y = (s: number) => PY + (1 - s / maxStreams) * (H - PY * 2);

  const pts = data.map((p) => `${x(p.day)},${y(p.streams)}`).join(" ");
  const area = `${x(data[0].day)},${y(0)} ${pts} ${x(data[data.length - 1].day)},${y(0)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PX} y1={y(maxStreams * f)} x2={W - PX} y2={y(maxStreams * f)} stroke="currentColor" className="text-ink/5" strokeWidth={0.5} />
      ))}

      {/* area fill */}
      <polygon points={area} className="fill-ink/[0.03]" />

      {/* line */}
      <polyline points={pts} fill="none" stroke="currentColor" className="text-ink/25" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* data points */}
      {data.map((p, i) => {
        const isHighlight = highlightIdx === i;
        const hasEvent = !!p.event;
        return (
          <g key={i}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            className="cursor-pointer"
          >
            {/* hover target */}
            <circle cx={x(p.day)} cy={y(p.streams)} r={12} fill="transparent" />

            {/* visible dot */}
            <circle
              cx={x(p.day)} cy={y(p.streams)}
              r={isHighlight ? 4.5 : hasEvent ? 3.5 : 2}
              className={`transition-all duration-200 ${
                isHighlight ? "fill-signal" : hasEvent ? "fill-ink/40" : "fill-ink/15"
              }`}
            />

            {/* label */}
            {(isHighlight || hasEvent) && p.label && (
              <text
                x={x(p.day)} y={y(p.streams) - 10}
                textAnchor="middle"
                className={`text-[8px] font-mono ${isHighlight ? "fill-signal" : "fill-ink/30"}`}
              >
                {p.label}
              </text>
            )}

            {/* tooltip on hover */}
            {isHighlight && (
              <>
                <line x1={x(p.day)} y1={y(p.streams) + 6} x2={x(p.day)} y2={H - PY} stroke="currentColor" className="text-signal/20" strokeWidth={0.5} strokeDasharray="2,2" />
                <text x={x(p.day)} y={H - PY + 12} textAnchor="middle" className="text-[8px] font-mono fill-ink/40">
                  Day {p.day}
                </text>
                <text x={x(p.day)} y={y(p.streams) - 20} textAnchor="middle" className="text-[9px] font-mono fill-ink/60">
                  {fmtK(p.streams)} streams · {p.saves.toFixed(1)}% save
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* axes */}
      <line x1={PX} y1={H - PY} x2={W - PX} y2={H - PY} stroke="currentColor" className="text-ink/8" strokeWidth={0.5} />
      <text x={PX} y={H - 4} className="text-[7px] fill-ink/20 font-mono">Day 0</text>
      <text x={W - PX} y={H - 4} textAnchor="end" className="text-[7px] fill-ink/20 font-mono">Day {maxDay}</text>
    </svg>
  );
}

/* ─── Boot ──────────────────────────────────────────────── */

const BOOT = ["Initialising…", "Loading baseline…", "Mapping culture…", "Reading signal…", "Running."];
const BOOT_DELAY = 500;

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "boot" | "run" | "done">("input");
  const [input, setInput] = useState<CampaignInput>({ trackName: "", artistStage: "breaking", budget: 30 });
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [bootIdx, setBootIdx] = useState(0);
  const [evIdx, setEvIdx] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [graphHover, setGraphHover] = useState<number | null>(null);
  const [timelineHover, setTimelineHover] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const budgetVal = BUDGET_MAP(input.budget);

  const start = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("boot");
    setBootIdx(0);
    setEvIdx(0);
    setExpanded({});
    setGraphHover(null);
    setTimelineHover(null);
  }, [input]);

  useEffect(() => {
    if (step !== "boot") return;
    if (bootIdx < BOOT.length - 1) {
      const t = setTimeout(() => setBootIdx((b) => b + 1), BOOT_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setStep("run"); setEvIdx(0); }, 300);
      return () => clearTimeout(t);
    }
  }, [step, bootIdx]);

  useEffect(() => {
    if (step !== "run" || !output) return;
    if (evIdx < output.timeline.length - 1) {
      const t = setTimeout(() => setEvIdx((i) => i + 1), 850);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setStep("done"), 400);
      return () => clearTimeout(t);
    }
  }, [step, evIdx, output]);

  useEffect(() => {
    if ((step === "run" || step === "done") && endRef.current) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [step, evIdx]);

  const reset = useCallback(() => {
    setStep("input"); setOutput(null); setBootIdx(0); setEvIdx(0); setExpanded({}); setGraphHover(null); setTimelineHover(null);
  }, []);

  const toggle = (i: number) => setExpanded((e) => ({ ...e, [i]: !e[i] }));
  const vis = output ? output.timeline.slice(0, step === "done" ? output.timeline.length : evIdx + 1) : [];

  // Linked highlight: timeline hover sets graph highlight and vice versa
  const activeGraphIdx = timelineHover !== null
    ? (vis[timelineHover]?.graphIdx ?? null)
    : graphHover;

  return (
    <main className="min-h-screen bg-paper">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/70 border-b border-ink/5">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" />decision/system_
          </Link>
          <Link href="/" className="text-sm text-ink/50 hover:text-signal transition-colors">← Overview</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-ink text-paper py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <h1 className="font-display text-4xl md:text-5xl leading-[0.95] font-bold">
            AI runs <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-3 text-sm text-paper/35 max-w-sm">Decision → content → spend → optimisation. Continuously.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }} className="max-w-xl">
              <div className="mb-7">
                <label className="block text-sm font-medium text-ink/55 mb-2">Track name</label>
                <input type="text" value={input.trackName} onChange={(e) => setInput((p) => ({ ...p, trackName: e.target.value }))} placeholder="e.g. Midnight Drive" className="w-full rounded-xl border border-ink/15 bg-cream px-5 py-3.5 text-base text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/40 transition-colors" />
              </div>
              <div className="mb-7">
                <label className="block text-sm font-medium text-ink/55 mb-2">Artist stage</label>
                <div className="flex gap-2.5">
                  {([["emerging","Emerging"],["breaking","Breaking"],["established","Established"]] as [ArtistStage,string][]).map(([v,l]) => (
                    <button key={v} onClick={() => setInput((p) => ({ ...p, artistStage: v }))} className={`flex-1 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${input.artistStage === v ? "bg-ink text-paper border-ink" : "border-ink/15 text-ink/60 hover:border-ink/30"}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="mb-9">
                <label className="block text-sm font-medium text-ink/55 mb-2">Budget</label>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={100} value={input.budget} onChange={(e) => setInput((p) => ({ ...p, budget: Number(e.target.value) }))} className="flex-1 h-2 rounded-full appearance-none bg-ink/10 accent-ink cursor-pointer" />
                  <span className="font-display font-bold text-lg min-w-[4.5rem] text-right">{fmt(budgetVal)}</span>
                </div>
                <div className="flex justify-between text-xs text-ink/30 mt-1"><span>$500</span><span>$50k</span></div>
              </div>
              <button onClick={start} disabled={!input.trackName.trim()} className="group inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-25 disabled:cursor-not-allowed">
                Run System <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </motion.div>
          )}

          {step === "boot" && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="max-w-sm py-14">
              {BOOT.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -6 }} animate={bootIdx >= i ? { opacity: i === bootIdx ? 1 : 0.2, x: 0 } : { opacity: 0, x: -6 }} transition={{ duration: 0.25 }} className="font-mono text-sm mb-2">
                  <span className="text-ink/20 mr-2">{bootIdx > i ? "✓" : bootIdx === i ? "›" : " "}</span>
                  <span className={bootIdx === i ? "text-ink" : "text-ink/25"}>{line}</span>
                </motion.div>
              ))}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: (bootIdx + 1) / BOOT.length }} transition={{ duration: 0.3 }} className="h-px bg-ink/15 mt-5 origin-left" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SPLIT VIEW ─────────────────────────────── */}
        {(step === "run" || step === "done") && output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

            {/* Context strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-8 pb-4 border-b border-ink/8 text-xs text-ink/35">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span className="uppercase tracking-wider font-medium text-ink/45">Artist</span>
                <span>{output.context.artist}</span>
                <span className={`${dirColor(output.context.growthDir)} font-medium`}>{dirArrow(output.context.growthDir)} {output.context.growth}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-electric/40" />
                <span className="uppercase tracking-wider font-medium text-ink/45">Culture</span>
                <span>{output.context.culture} · {output.context.tone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span className="uppercase tracking-wider font-medium text-ink/45">Signal</span>
                <span>{output.context.signalSummary}</span>
              </div>
            </div>

            {/* Split: timeline left, graph right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10 items-start">

              {/* ── LEFT: Timeline ── */}
              <div className="relative ml-1">
                <div className="absolute left-[3px] top-0 bottom-0 w-px bg-ink/8" />

                {vis.map((ev, i) => {
                  const showTime = i === 0 || ev.time !== vis[i - 1].time;
                  const isDecision = ev.type === "decision";
                  const hasExpand = !!ev.expand;
                  const isOpen = !!expanded[i];
                  const isHovered = timelineHover === i;

                  return (
                    <motion.div
                      key={`${ev.time}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative pl-7 pb-0.5 transition-colors duration-150 ${isHovered && ev.graphIdx !== undefined ? "bg-ink/[0.02] -mx-2 px-9 rounded-lg" : ""}`}
                      onMouseEnter={() => setTimelineHover(i)}
                      onMouseLeave={() => setTimelineHover(null)}
                    >
                      <span className={`absolute left-0 top-[1rem] w-[7px] h-[7px] rounded-full ${dotColor(ev.type)} ${ev.type === "adjust" ? "animate-pulse" : ""}`} />

                      {showTime && <div className="text-[11px] font-mono text-ink/20 mb-0.5">{ev.time}</div>}

                      {isDecision ? (
                        <div className="rounded-xl bg-ink text-paper p-5 mb-3">
                          <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                            <div className="font-display font-bold text-3xl md:text-4xl leading-none flex items-center gap-2.5">
                              <span className={decisionColor(output.decision)}>→</span>{output.decision}
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span><span className="text-paper/25 text-xs uppercase tracking-wider">Conf </span><span className="font-display font-bold">{output.confidence}%</span></span>
                              <span><span className="text-paper/25 text-xs uppercase tracking-wider">Risk </span><span className={`font-display font-bold ${output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"}`}>{output.risk}</span></span>
                            </div>
                          </div>
                          <p className="text-paper/45 text-sm">{ev.action}</p>
                          <p className="text-paper/25 text-xs mt-1">{ev.reasoning}</p>
                        </div>
                      ) : (
                        <div className={`pb-3 ${i < vis.length - 1 ? "border-b border-ink/5" : ""}`}>
                          <p className={`text-sm ${ev.type === "adjust" ? "text-ink/70 font-medium" : ev.type === "monitor" ? "text-ink/40" : "text-ink/60"}`}>{ev.action}</p>
                          {ev.reasoning && <p className="text-xs text-ink/25 mt-0.5">{ev.reasoning}</p>}

                          {ev.tool && (
                            <a href={ev.tool.href} target={ev.tool.external ? "_blank" : undefined} rel={ev.tool.external ? "noreferrer noopener" : undefined} className="inline-flex items-center gap-1 mt-1.5 text-xs text-ink/25 hover:text-signal transition-colors">
                              <span className="w-1 h-1 rounded-full bg-ink/12" />{ev.tool.label} <span>{ev.tool.external ? "↗" : "→"}</span>
                            </a>
                          )}

                          {hasExpand && (
                            <>
                              <button onClick={() => toggle(i)} className="block mt-1.5 text-xs text-ink/20 hover:text-ink/40 transition-colors">
                                <span className="inline-block transition-transform mr-0.5" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                                {isOpen ? "Less" : ev.expand!.heading}
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                    <div className="mt-1.5 pl-2.5 border-l border-ink/6 space-y-0.5">
                                      {ev.expand!.lines.map((ln) => <p key={ln} className="text-xs text-ink/30">{ln}</p>)}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* ── RIGHT: Performance Graph ── */}
              <div className="lg:sticky lg:top-20">
                <div className="rounded-xl border border-ink/8 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-ink/40 uppercase tracking-wider font-medium">Performance</span>
                    <span className="text-xs text-ink/25 font-mono">28 days</span>
                  </div>
                  <div className="h-[180px] md:h-[200px]">
                    <PerfGraph
                      data={output.perf}
                      highlightIdx={activeGraphIdx}
                      onHover={setGraphHover}
                    />
                  </div>

                  {/* Key moments */}
                  <div className="mt-3 pt-3 border-t border-ink/6 space-y-1.5">
                    {output.perf.filter((p) => p.event).map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${eventDotColor(p.event)}`} />
                        <span className="text-ink/30 font-mono min-w-[2.5rem]">D{p.day}</span>
                        <span className="text-ink/45">{p.label}</span>
                        <span className="text-ink/20 ml-auto font-mono">{fmtK(p.streams)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System bar — inside right column on desktop */}
                {step === "done" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }} className="mt-3 rounded-xl bg-ink text-paper px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                      <span className="font-display font-bold text-sm">System active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-paper/30">
                        <span className={dirColor(output.context.growthDir)}>{dirArrow(output.context.growthDir)}</span> {output.context.growth}
                      </span>
                      <span className="text-paper/20 font-mono">Next eval 48h</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Reset — below split on mobile, below timeline on desktop */}
            {step === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.3 }} className="mt-8 pt-4 border-t border-ink/6">
                <button onClick={reset} className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors">
                  <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Run another
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
