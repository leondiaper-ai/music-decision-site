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

interface Moment {
  day: number;
  streams: number;
  saves: number;
  action: string;
  reasoning: string;
  type: "decision" | "deploy" | "execute" | "monitor" | "adjust";
  tool?: { label: string; href: string; external?: boolean };
  expand?: { heading: string; lines: string[] };
}

interface ContextLine {
  artist: string;
  growth: string;
  growthDir: "rising" | "stable" | "declining";
  culture: string;
  tone: string;
  signal: string;
  signalStrength: "strong" | "mixed" | "weak";
}

interface SystemOutput {
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  context: ContextLine;
  moments: Moment[];
}

/* ─── Engine ────────────────────────────────────────────── */

const BUDGET_MAP = (pct: number) => Math.round(500 + (pct / 100) * 49500);
function fmt(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`; }
function fmtK(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`; }

function generate(input: CampaignInput): SystemOutput {
  const budget = BUDGET_MAP(input.budget);
  const isEm = input.artistStage === "emerging";
  const isEs = input.artistStage === "established";

  const context: ContextLine = isEm
    ? { artist: "12k monthly", growth: "Early traction", growthDir: "rising", culture: "Discovery", tone: "Lo-fi, raw", signal: "Save 3.2% · Reach −12% · Engagement high", signalStrength: "mixed" }
    : isEs
    ? { artist: "2.1M monthly", growth: "Plateau", growthDir: "stable", culture: "Scale", tone: "Cinematic", signal: "Save 5.1% · Reach +24% · Velocity high", signalStrength: "strong" }
    : { artist: "340k monthly", growth: "Accelerating", growthDir: "rising", culture: "Momentum", tone: "Energetic, narrative", signal: "Save 4.1% · Reach +8% · Engagement high", signalStrength: "mixed" };

  let decision: Decision, confidence: number, risk: "Low" | "Medium" | "High";
  if (isEs && budget > 15000) { decision = "PUSH"; confidence = 87; risk = "Low"; }
  else if (isEm && budget < 5000) { decision = "TEST"; confidence = 72; risk = "Medium"; }
  else if (isEs) { decision = "PUSH"; confidence = 78; risk = "Low"; }
  else if (budget > 20000) { decision = "PUSH"; confidence = 81; risk = "Medium"; }
  else if (isEm) { decision = "TEST"; confidence = 68; risk = "Medium"; }
  else { decision = "HOLD"; confidence = 64; risk = "High"; }

  const base = isEs ? 45000 : isEm ? 800 : 8000;
  const sv = isEs ? 5.1 : isEm ? 3.2 : 4.1;
  const m = decision === "PUSH" ? 1.6 : decision === "TEST" ? 1.15 : 0.95;

  const moments: Moment[] = [
    /* Day 0 — launch + decision */
    {
      day: 0, streams: base, saves: sv, type: "decision",
      action: decision === "PUSH"
        ? `System decided PUSH — deploy ${fmt(budget)}`
        : decision === "TEST"
        ? `System decided TEST — validate before committing ${fmt(budget)}`
        : `System decided HOLD — ${fmt(budget)} preserved`,
      reasoning: `${context.signal}. Artist at ${context.growth.toLowerCase()} (${context.artist}). Cultural frame: ${context.culture.toLowerCase()}, ${context.tone.toLowerCase()}. Confidence ${confidence}%, risk ${risk.toLowerCase()}.`,
      tool: { label: "Artist & Track Lens", href: "/lens" },
      expand: {
        heading: "Cultural context",
        lines: isEm
          ? ["Film: Grainy backstage, handheld, natural light", "Artist: Early PinkPantheress, Clairo bedroom era", "Audience: Taste-first listeners, micro-communities", "Constraint: Nothing over-polished. Protect the narrative."]
          : isEs
          ? ["Film: Widescreen cinematography, monument shots", "Artist: Peak Drake rollout, Beyoncé precision", "Audience: Mainstream crossover, cultural commentators", "Constraint: No cheap reach. Match the stature."]
          : ["Film: Dynamic performance, split-screen, street energy", "Artist: Central Cee breakout, early Doja Cat", "Audience: Genre explorers, playlist curators", "Constraint: Every asset builds the story."],
      },
    },

    /* Day 1 — execution set */
    {
      day: 1, streams: Math.round(base * 1.15), saves: sv + 0.2, type: "execute",
      action: decision === "PUSH"
        ? isEs
          ? "System set execution — hero assets, editorial placements, simultaneous day-1 launch"
          : isEm
          ? "System set execution — raw content, authentic voices, organic-first"
          : "System set execution — narrative assets, genre-adjacent creators, 7-day stagger"
        : decision === "TEST"
        ? `System set execution — ${context.tone.split(",")[0].toLowerCase()} test formats, micro-creators, organic-first`
        : "System set execution — minimal output, research mode",
      reasoning: `Execution shaped by ${context.culture.toLowerCase()} frame and ${context.growth.toLowerCase()} artist state.`,
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
    },

    /* Day 3 — capital deployed */
    {
      day: 3, streams: Math.round(base * m * 0.9), saves: sv + (decision === "PUSH" ? 0.8 : 0.1), type: "deploy",
      action: decision === "PUSH"
        ? `System deployed capital — ${fmt(Math.round(budget * 0.4))} paid reach, ${fmt(Math.round(budget * 0.35))} content, ${fmt(Math.round(budget * 0.25))} creators + reserve`
        : decision === "TEST"
        ? `System deployed capital — ${fmt(Math.round(budget * 0.4))} content testing, ${fmt(Math.round(budget * 0.6))} held`
        : "System held all capital — no deployment until signal justifies",
      reasoning: decision === "PUSH"
        ? "Signal confirms audience. Largest allocation to paid reach — extending momentum while it's real."
        : decision === "TEST"
        ? "Organic-first. Testing formats within cultural frame before scaling."
        : "Insufficient evidence. Capital preserved.",
      tool: decision !== "HOLD" ? { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true } : undefined,
    },

    /* Day 5 — early signal */
    {
      day: 5, streams: Math.round(base * m * 1.05), saves: sv + (decision === "PUSH" ? 1.3 : decision === "TEST" ? 0.3 : -0.1), type: "monitor",
      action: decision === "PUSH"
        ? `Monitoring — save rate climbing to ${(sv + 1.3).toFixed(1)}%, streams trending up`
        : decision === "TEST"
        ? "Monitoring — early organic response, engagement steady"
        : "Monitoring — no significant organic traction",
      reasoning: "System watching. No intervention required.",
    },

    /* Day 7 — first eval */
    {
      day: 7, streams: Math.round(base * m * 1.15), saves: sv + (decision === "PUSH" ? 1.5 : decision === "TEST" ? 0.6 : -0.2), type: "monitor",
      action: decision === "PUSH"
        ? `System evaluated 7-day data — streams +${Math.round((m * 1.15 - 1) * 100)}%, saves at ${(sv + 1.5).toFixed(1)}%`
        : decision === "TEST"
        ? `System evaluated 7-day data — saves at ${(sv + 0.6).toFixed(1)}%, format response mixed`
        : "System evaluated 7-day data — no breakthrough signal",
      reasoning: "Cross-referencing against artist health baseline and cultural frame.",
      tool: { label: "Artist & Track Lens", href: "/lens" },
    },

    /* Day 10 — midpoint */
    {
      day: 10, streams: Math.round(base * m * (decision === "PUSH" ? 1.4 : decision === "TEST" ? 1.1 : 0.85)), saves: sv + (decision === "PUSH" ? 1.8 : decision === "TEST" ? 0.8 : -0.5), type: "monitor",
      action: decision === "PUSH"
        ? "Monitoring — sustained momentum, no drop-off"
        : decision === "TEST"
        ? "Monitoring — save rate slowly climbing, narrative formats outperforming"
        : "Monitoring — flat trajectory, system holding position",
      reasoning: "System continues observing.",
    },

    /* Day 14 — system adjusts */
    {
      day: 14, streams: Math.round(base * m * (decision === "PUSH" ? 1.65 : decision === "TEST" ? 1.2 : 0.75)), saves: sv + (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.0 : -0.7), type: "adjust",
      action: decision === "PUSH"
        ? `System adjusted — scaling paid support, reallocating ${fmt(Math.round(budget * 0.1))} reserve to reach`
        : decision === "TEST"
        ? `System adjusted — save rate crossed ${(sv + 1.0).toFixed(1)}%, preparing upgrade to PUSH`
        : "System adjusted — extending hold, insufficient signal for activation",
      reasoning: decision === "PUSH"
        ? `Streams +${Math.round((m * 1.65 - 1) * 100)}%, saves ${(sv + 2.1).toFixed(1)}%. Momentum confirmed — deploying remaining capital.`
        : decision === "TEST"
        ? "Evidence now supports deployment. Cultural frame validated through testing."
        : "No evidence of organic demand. Continuing research phase.",
    },

    /* Day 21 */
    {
      day: 21, streams: Math.round(base * m * (decision === "PUSH" ? 1.9 : decision === "TEST" ? 1.35 : 0.7)), saves: sv + (decision === "PUSH" ? 2.3 : decision === "TEST" ? 1.2 : -0.8), type: "monitor",
      action: decision === "PUSH"
        ? `Monitoring — campaign sustaining at ${fmtK(Math.round(base * m * 1.9))} daily streams`
        : decision === "TEST"
        ? "Monitoring — post-upgrade ramp, paid activation in progress"
        : "Monitoring — hold continues, watching for signal shift",
      reasoning: "System active. Continuous evaluation.",
    },

    /* Day 28 — review */
    {
      day: 28, streams: Math.round(base * m * (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.5 : 0.65)), saves: sv + (decision === "PUSH" ? 2.5 : decision === "TEST" ? 1.4 : -1.0), type: "monitor",
      action: decision === "PUSH"
        ? `28-day review — ${fmtK(Math.round(base * m * 2.1))} daily streams, saves at ${(sv + 2.5).toFixed(1)}%. Campaign successful.`
        : decision === "TEST"
        ? `28-day review — ${fmtK(Math.round(base * m * 1.5))} daily streams. Test validated, full campaign active.`
        : `28-day review — ${fmtK(Math.round(base * m * 0.65))} daily streams. Hold maintained. System evaluating next cycle.`,
      reasoning: "Full cycle complete. System begins next evaluation window.",
    },
  ];

  return { decision, confidence, risk, context, moments };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision) { return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric"; }
function dirArrow(d: "rising" | "stable" | "declining") { return d === "rising" ? "↑" : d === "stable" ? "→" : "↓"; }
function dirColor(d: "rising" | "stable" | "declining") { return d === "rising" ? "text-mint" : d === "stable" ? "text-sun" : "text-signal"; }
function dotFill(t: Moment["type"]) { return t === "decision" ? "bg-ink" : t === "deploy" ? "bg-mint" : t === "execute" ? "bg-electric" : t === "adjust" ? "bg-signal" : "bg-ink/20"; }
function strengthDot(s: "strong" | "mixed" | "weak") { return s === "strong" ? "bg-mint" : s === "mixed" ? "bg-sun" : "bg-signal"; }

/* ─── SVG Graph ─────────────────────────────────────────── */

function TimelineGraph({ moments, activeIdx, onHover }: {
  moments: Moment[];
  activeIdx: number | null;
  onHover: (i: number | null) => void;
}) {
  const W = 720, H = 220, PX = 40, PY = 24;
  const maxS = Math.max(...moments.map((m) => m.streams)) * 1.12;
  const maxD = moments[moments.length - 1].day || 1;

  const px = (d: number) => PX + (d / maxD) * (W - PX * 2);
  const py = (s: number) => PY + (1 - s / maxS) * (H - PY * 2);

  const pts = moments.map((m) => `${px(m.day)},${py(m.streams)}`).join(" ");
  const area = `${px(0)},${py(0)} ${pts} ${px(moments[moments.length - 1].day)},${py(0)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PX} y1={py(maxS * f)} x2={W - PX} y2={py(maxS * f)} stroke="currentColor" className="text-ink/[0.04]" strokeWidth={0.5} />
      ))}

      {/* area */}
      <polygon points={area} className="fill-ink/[0.025]" />

      {/* line */}
      <polyline points={pts} fill="none" stroke="currentColor" className="text-ink/20" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* points */}
      {moments.map((m, i) => {
        const isActive = activeIdx === i;
        const cx = px(m.day), cy = py(m.streams);

        return (
          <g key={i} onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} className="cursor-pointer">
            <circle cx={cx} cy={cy} r={14} fill="transparent" />
            <circle cx={cx} cy={cy} r={isActive ? 5 : 3.5}
              className={`transition-all duration-150 ${
                isActive ? "fill-signal" : m.type === "decision" ? "fill-ink" : m.type === "deploy" ? "fill-mint" : m.type === "adjust" ? "fill-signal/70" : "fill-ink/20"
              }`} />

            {isActive && (
              <>
                <line x1={cx} y1={cy + 7} x2={cx} y2={H - PY} stroke="currentColor" className="text-signal/15" strokeWidth={0.5} strokeDasharray="2,2" />
                <text x={cx} y={cy - 14} textAnchor="middle" className="text-[9px] font-mono fill-ink/55">{fmtK(m.streams)} streams · {m.saves.toFixed(1)}% save</text>
                <text x={cx} y={H - PY + 14} textAnchor="middle" className="text-[8px] font-mono fill-ink/30">Day {m.day}</text>
              </>
            )}

            {!isActive && (m.type === "decision" || m.type === "adjust") && (
              <text x={cx} y={H - PY + 14} textAnchor="middle" className="text-[7px] font-mono fill-ink/15">D{m.day}</text>
            )}
          </g>
        );
      })}

      {/* axis */}
      <line x1={PX} y1={H - PY} x2={W - PX} y2={H - PY} stroke="currentColor" className="text-ink/6" strokeWidth={0.5} />
    </svg>
  );
}

/* ─── Boot ──────────────────────────────────────────────── */

const BOOT = ["Initialising…", "Loading baseline…", "Mapping culture…", "Reading signal…", "Running."];
const BOOT_DELAY = 480;

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "boot" | "run" | "done">("input");
  const [input, setInput] = useState<CampaignInput>({ trackName: "", artistStage: "breaking", budget: 30 });
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [bootIdx, setBootIdx] = useState(0);
  const [evIdx, setEvIdx] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const budgetVal = BUDGET_MAP(input.budget);

  const start = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("boot");
    setBootIdx(0); setEvIdx(0); setExpanded({}); setActiveIdx(null);
  }, [input]);

  useEffect(() => {
    if (step !== "boot") return;
    if (bootIdx < BOOT.length - 1) { const t = setTimeout(() => setBootIdx((b) => b + 1), BOOT_DELAY); return () => clearTimeout(t); }
    else { const t = setTimeout(() => { setStep("run"); setEvIdx(0); }, 280); return () => clearTimeout(t); }
  }, [step, bootIdx]);

  useEffect(() => {
    if (step !== "run" || !output) return;
    if (evIdx < output.moments.length - 1) { const t = setTimeout(() => setEvIdx((i) => i + 1), 900); return () => clearTimeout(t); }
    else { const t = setTimeout(() => setStep("done"), 400); return () => clearTimeout(t); }
  }, [step, evIdx, output]);

  useEffect(() => {
    if ((step === "run" || step === "done") && endRef.current) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [step, evIdx]);

  const reset = useCallback(() => { setStep("input"); setOutput(null); setBootIdx(0); setEvIdx(0); setExpanded({}); setActiveIdx(null); }, []);
  const toggle = (i: number) => setExpanded((e) => ({ ...e, [i]: !e[i] }));

  const visMoments = output ? output.moments.slice(0, step === "done" ? output.moments.length : evIdx + 1) : [];

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/70 border-b border-ink/5">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" />decision/system_
          </Link>
          <Link href="/" className="text-sm text-ink/50 hover:text-signal transition-colors">← Overview</Link>
        </div>
      </header>

      <section className="bg-ink text-paper py-10 md:py-12">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          <h1 className="font-display text-3xl md:text-5xl leading-[0.95] font-bold">
            AI runs <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-3 text-sm text-paper/35 max-w-sm">Decision → content → spend → optimisation. Continuously.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="max-w-xl">
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
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="max-w-sm py-14">
              {BOOT.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -5 }} animate={bootIdx >= i ? { opacity: i === bootIdx ? 1 : 0.2, x: 0 } : { opacity: 0, x: -5 }} transition={{ duration: 0.2 }} className="font-mono text-sm mb-2">
                  <span className="text-ink/20 mr-2">{bootIdx > i ? "✓" : bootIdx === i ? "›" : " "}</span>
                  <span className={bootIdx === i ? "text-ink" : "text-ink/25"}>{line}</span>
                </motion.div>
              ))}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: (bootIdx + 1) / BOOT.length }} transition={{ duration: 0.25 }} className="h-px bg-ink/15 mt-5 origin-left" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── UNIFIED TIMELINE ────────────────────────── */}
        {(step === "run" || step === "done") && output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

            {/* Context line */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-6 text-xs text-ink/35">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span className="uppercase tracking-wider font-medium text-ink/45">{output.context.artist}</span>
                <span className={`${dirColor(output.context.growthDir)} font-medium`}>{dirArrow(output.context.growthDir)} {output.context.growth}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-electric/40" />
                <span>{output.context.culture} · {output.context.tone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span>{output.context.signal}</span>
              </span>
            </div>

            {/* Graph */}
            <div className="rounded-xl border border-ink/8 p-4 md:p-5 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink/35 uppercase tracking-wider font-medium">Campaign Performance</span>
                <span className="text-xs text-ink/20 font-mono">28 days</span>
              </div>
              <TimelineGraph
                moments={output.moments}
                activeIdx={activeIdx}
                onHover={setActiveIdx}
              />
            </div>

            {/* Moments */}
            <div className="relative ml-1">
              <div className="absolute left-[3px] top-0 bottom-0 w-px bg-ink/8" />

              {visMoments.map((mo, i) => {
                const isDecision = mo.type === "decision";
                const isOpen = !!expanded[i];
                const isActive = activeIdx === i;

                return (
                  <motion.div
                    key={`${mo.day}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative pl-7 pb-0.5 transition-colors duration-100 ${isActive ? "bg-ink/[0.02] -mx-2 px-9 rounded-lg" : ""}`}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  >
                    <span className={`absolute left-0 top-[1rem] w-[7px] h-[7px] rounded-full ${dotFill(mo.type)} ${mo.type === "adjust" ? "animate-pulse" : ""}`} />

                    {/* Day marker */}
                    {(i === 0 || mo.day !== visMoments[i - 1].day) && (
                      <div className="text-[11px] font-mono text-ink/20 mb-0.5">Day {mo.day}</div>
                    )}

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
                        <p className="text-paper/45 text-sm">{mo.action}</p>
                        <p className="text-paper/25 text-xs mt-1">{mo.reasoning}</p>
                        {mo.tool && (
                          <a href={mo.tool.href} target={mo.tool.external ? "_blank" : undefined} rel={mo.tool.external ? "noreferrer noopener" : undefined} className="inline-flex items-center gap-1 mt-2 text-xs text-paper/20 hover:text-signal transition-colors">
                            <span className="w-1 h-1 rounded-full bg-paper/10" />{mo.tool.label} <span>{mo.tool.external ? "↗" : "→"}</span>
                          </a>
                        )}
                        {mo.expand && (
                          <>
                            <button onClick={() => toggle(i)} className="block mt-2 text-xs text-paper/15 hover:text-paper/35 transition-colors">
                              <span className="inline-block transition-transform mr-0.5" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                              {isOpen ? "Less" : mo.expand.heading}
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                  <div className="mt-1.5 pl-2.5 border-l border-paper/10 space-y-0.5">
                                    {mo.expand.lines.map((ln) => <p key={ln} className="text-xs text-paper/25">{ln}</p>)}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className={`pb-3 ${i < visMoments.length - 1 && visMoments[i + 1].day !== mo.day ? "border-b border-ink/5" : ""}`}>
                        <p className={`text-sm ${mo.type === "adjust" ? "text-ink/70 font-medium" : mo.type === "monitor" ? "text-ink/40" : "text-ink/60"}`}>{mo.action}</p>
                        {mo.reasoning && <p className="text-xs text-ink/25 mt-0.5">{mo.reasoning}</p>}
                        {mo.tool && (
                          <a href={mo.tool.href} target={mo.tool.external ? "_blank" : undefined} rel={mo.tool.external ? "noreferrer noopener" : undefined} className="inline-flex items-center gap-1 mt-1.5 text-xs text-ink/20 hover:text-signal transition-colors">
                            <span className="w-1 h-1 rounded-full bg-ink/10" />{mo.tool.label} <span>{mo.tool.external ? "↗" : "→"}</span>
                          </a>
                        )}
                        {mo.expand && (
                          <>
                            <button onClick={() => toggle(i)} className="block mt-1.5 text-xs text-ink/18 hover:text-ink/35 transition-colors">
                              <span className="inline-block transition-transform mr-0.5" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                              {isOpen ? "Less" : mo.expand.heading}
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                  <div className="mt-1.5 pl-2.5 border-l border-ink/6 space-y-0.5">
                                    {mo.expand.lines.map((ln) => <p key={ln} className="text-xs text-ink/28">{ln}</p>)}
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

            {/* System bar */}
            {step === "done" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="mt-8 rounded-xl bg-ink text-paper px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  <span className="font-display font-bold text-sm">System active</span>
                  <span className="text-paper/20 text-xs font-mono">{input.trackName} · {input.artistStage} · {fmt(budgetVal)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-paper/30"><span className={dirColor(output.context.growthDir)}>{dirArrow(output.context.growthDir)}</span> {output.context.growth}</span>
                  <span className="text-paper/18 font-mono">Next eval 48h</span>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }} className="mt-6 pt-4 border-t border-ink/6">
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
