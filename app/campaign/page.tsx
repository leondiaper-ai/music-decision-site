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
  expand?: ExpandContent;
}

interface ExpandContent {
  heading: string;
  lines: string[];
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
}

/* ─── Engine ────────────────────────────────────────────── */

const BUDGET_MAP = (pct: number) => Math.round(500 + (pct / 100) * 49500);

function fmt(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
}

function generate(input: CampaignInput): SystemOutput {
  const budget = BUDGET_MAP(input.budget);
  const isEm = input.artistStage === "emerging";
  const isEs = input.artistStage === "established";

  /* context */
  const context: ContextStrip = isEm
    ? { artist: "12k monthly · high engagement", growth: "Early traction", growthDir: "rising", culture: "Discovery", tone: "Lo-fi, raw", signalSummary: "Save 3.2% · Reach −12% · Engagement high", signalStrength: "mixed" }
    : isEs
    ? { artist: "2.1M monthly · moderate engagement", growth: "Plateau", growthDir: "stable", culture: "Scale", tone: "Cinematic", signalSummary: "Save 5.1% · Reach +24% · Velocity high", signalStrength: "strong" }
    : { artist: "340k monthly · high engagement", growth: "Accelerating", growthDir: "rising", culture: "Momentum", tone: "Energetic, narrative", signalSummary: "Save 4.1% · Reach +8% · Engagement high", signalStrength: "mixed" };

  /* decision */
  let decision: Decision, confidence: number, risk: "Low" | "Medium" | "High";
  if (isEs && budget > 15000) { decision = "PUSH"; confidence = 87; risk = "Low"; }
  else if (isEm && budget < 5000) { decision = "TEST"; confidence = 72; risk = "Medium"; }
  else if (isEs) { decision = "PUSH"; confidence = 78; risk = "Low"; }
  else if (budget > 20000) { decision = "PUSH"; confidence = 81; risk = "Medium"; }
  else if (isEm) { decision = "TEST"; confidence = 68; risk = "Medium"; }
  else { decision = "HOLD"; confidence = 64; risk = "High"; }

  /* timeline */
  const tl: TimelineEntry[] = [];

  /* ── 00:00 system init ── */
  tl.push({
    time: "00:00",
    action: `System set cultural frame to ${context.culture.toLowerCase()} — ${context.tone.toLowerCase()} positioning`,
    reasoning: `Artist at ${context.growth.toLowerCase()} with ${context.artist.split("·")[0].trim()}. ${isEm ? "Authenticity over scale." : isEs ? "Every touchpoint must match stature." : "Story over volume."}`,
    type: "system",
    expand: {
      heading: "Cultural references",
      lines: isEm
        ? ["Film: Grainy backstage, handheld, natural light", "Artist: Early PinkPantheress, Clairo bedroom era", "Audience: Taste-first listeners, micro-communities", "Direction: Intimacy over production value"]
        : isEs
        ? ["Film: Widescreen cinematography, monument shots", "Artist: Peak Drake rollout, Beyoncé precision", "Audience: Mainstream crossover, cultural commentators", "Direction: Every asset is an event"]
        : ["Film: Dynamic performance, split-screen, street energy", "Artist: Central Cee breakout, early Doja Cat", "Audience: Genre explorers, playlist curators", "Direction: The breakout — make it feel inevitable"],
    },
  });

  /* ── 00:01 signal read ── */
  tl.push({
    time: "00:01",
    action: isEs
      ? "System read strong signal across all metrics"
      : isEm
      ? "System read mixed signal — high engagement, weak reach"
      : "System read strong engagement with moderate reach",
    reasoning: `${context.signalSummary}. ${isEm ? "Depth is there, but scale isn't confirmed." : isEs ? "Data supports aggressive deployment." : "Momentum is real. Reach is catching up."}`,
    type: "system",
    tool: { label: "Artist & Track Lens", href: "/lens" },
    expand: {
      heading: "Signal breakdown",
      lines: isEs
        ? ["Save rate: 5.1% (strong)", "Audience reach: +24% (strong)", "Playlist velocity: High (strong)", "Skip rate: 18% (moderate)"]
        : isEm
        ? ["Save rate: 3.2% (moderate)", "Reach: −12% (weak)", "Playlist velocity: Low (weak)", "Engagement: High (strong)"]
        : ["Save rate: 4.1% (strong)", "Reach: +8% (moderate)", "Playlist velocity: Med (moderate)", "Engagement: High (strong)"],
    },
  });

  /* ── 00:02 tension ── */
  tl.push({
    time: "00:02",
    action: isEm
      ? "System detected tension — engagement suggests scale, but artist health says protect"
      : isEs
      ? "System detected opportunity — strong signal, but plateau means reactivate not maintain"
      : "System detected momentum — channel it, don't burn it",
    reasoning: isEm
      ? "Small audience with deep engagement. Scaling too fast risks diluting what's working."
      : isEs
      ? `${context.artist.split("·")[0].trim()} base is loyal but flat. This release is the catalyst.`
      : "Growth is accelerating. Campaign must protect credibility while extending reach.",
    type: "system",
  });

  /* ── 00:03 decision ── */
  tl.push({
    time: "00:03",
    action: decision === "PUSH"
      ? `System decided: PUSH. Deploy ${fmt(budget)}.`
      : decision === "TEST"
      ? `System decided: TEST. Validate before committing ${fmt(budget)}.`
      : `System decided: HOLD. ${fmt(budget)} preserved until signal justifies deployment.`,
    reasoning: `Confidence ${confidence}%, risk ${risk.toLowerCase()}. ${
      decision === "PUSH" ? "Health and culture align. Go." : decision === "TEST" ? "Signal promising but unconfirmed. Prove it first." : "Not enough evidence. Wait."
    }`,
    type: "decision",
  });

  /* ── 00:04 capital ── */
  if (decision === "PUSH") {
    tl.push({
      time: "00:04",
      action: `System allocated ${fmt(Math.round(budget * 0.4))} to paid reach — signal confirms audience`,
      reasoning: `Largest allocation. Extending momentum while it's real.`,
      type: "deploy",
    });
    tl.push({
      time: "00:04",
      action: `System allocated ${fmt(Math.round(budget * 0.35))} to content — ${context.tone.toLowerCase()} assets`,
      reasoning: `Cultural frame demands ${isEs ? "cinematic first impression" : isEm ? "raw, unpolished authenticity" : "narrative-driven storytelling"}.`,
      type: "deploy",
      tool: { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true },
    });
    tl.push({
      time: "00:04",
      action: `System allocated ${fmt(Math.round(budget * 0.15))} to creators + ${fmt(Math.round(budget * 0.1))} reserve`,
      reasoning: "Voices that match positioning. Reserve for week-1 reallocation.",
      type: "deploy",
    });
  } else if (decision === "TEST") {
    tl.push({
      time: "00:04",
      action: `System allocated ${fmt(Math.round(budget * 0.4))} to content — test formats within cultural frame`,
      reasoning: `Validate what resonates before scaling spend.`,
      type: "deploy",
      tool: { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true },
    });
    tl.push({
      time: "00:04",
      action: `System delayed ${fmt(Math.round(budget * 0.25))} paid spend — organic first`,
      reasoning: "Paid only after 48hr signal confirmation.",
      type: "deploy",
    });
    tl.push({
      time: "00:04",
      action: `System held ${fmt(Math.round(budget * 0.35))} in reserve + audience intel`,
      reasoning: "Map response patterns. Capital ready for rapid reallocation.",
      type: "deploy",
    });
  } else {
    tl.push({
      time: "00:04",
      action: "System held all paid spend — no deployment",
      reasoning: "No signal to justify it.",
      type: "deploy",
    });
    tl.push({
      time: "00:04",
      action: `System allocated ${fmt(Math.round(budget * 0.35))} to research + ${fmt(Math.round(budget * 0.35))} baseline content`,
      reasoning: `Build understanding. Minimal ${context.tone.toLowerCase()} assets only.`,
      type: "deploy",
    });
  }

  /* ── 00:05 execution ── */
  tl.push({
    time: "00:05",
    action: decision === "PUSH"
      ? isEs
        ? "System set execution: hero assets, editorial placements, simultaneous day-1 launch"
        : isEm
        ? "System set execution: raw content, authentic voices, organic-first then paid at 48hr"
        : "System set execution: narrative-driven assets, genre-adjacent creators, 7-day staggered rollout"
      : decision === "TEST"
      ? `System set execution: ${context.tone.split(",")[0].toLowerCase()} formats, micro-creators, organic-first`
      : `System set execution: minimal output, research mode, no paid until signal justifies`,
    reasoning: `Execution shaped by ${context.culture.toLowerCase()} frame and ${context.growth.toLowerCase()} artist state.`,
    type: "execute",
    tool: { label: "Campaign Timeline", href: "https://campaign-timeline-viewer.vercel.app", external: true },
    expand: {
      heading: "Execution detail",
      lines: decision === "PUSH"
        ? isEs
          ? ["Content: Hero assets. Cinematic first impression.", "Creators: Editorial voices + press placements.", "Timing: Simultaneous paid + organic. Day-1 reach."]
          : isEm
          ? ["Content: Raw, unpolished. No over-production.", "Creators: Authentic voices. Storytelling > reach.", "Timing: Organic first → paid at 48hr."]
          : ["Content: Narrative-driven. Story > volume.", "Creators: Genre-adjacent. Credibility first.", "Timing: Staggered. 7-day momentum build."]
        : decision === "TEST"
        ? [`Content: ${context.tone.split(",")[0]}. Test before committing.`, "Creators: Micro-creators. Alignment > reach.", "Timing: Organic first. Paid after confirmation."]
        : [`Content: Minimal. ${context.tone.split(",")[0]} when ready.`, "Creators: Hold outreach. Research first.", "Timing: No paid until signal justifies."],
    },
  });

  /* ── monitoring ── */
  tl.push({
    time: "06:00",
    action: `Monitoring — tracking save rate against ${context.culture.toLowerCase()} baseline`,
    reasoning: "No action required. Observing.",
    type: "monitor",
  });

  tl.push({
    time: "24:00",
    action: decision === "PUSH"
      ? "System evaluated playlist velocity + engagement depth"
      : decision === "TEST"
      ? "System evaluated save rate for confirmation signal"
      : "System checked for organic traction",
    reasoning: "Cross-referencing against artist health baseline.",
    type: "monitor",
    tool: { label: "Artist & Track Lens", href: "/lens" },
  });

  tl.push({
    time: "24:00",
    action: decision === "PUSH"
      ? "System detected condition — if save rate < 3%, downgrade to TEST"
      : decision === "TEST"
      ? "System detected condition — if save rate > 4.5%, upgrade to PUSH"
      : "System detected condition — if save rate > 3%, upgrade to TEST",
    reasoning: "Threshold set. System adjusts automatically.",
    type: "adjust",
  });

  tl.push({
    time: "48:00",
    action: decision === "PUSH"
      ? "System adjusted — playlist spike detected, increasing paid support"
      : decision === "TEST"
      ? "System adjusted — no signal after 48h, downgrading to HOLD"
      : "System adjusted — new audience data, re-evaluating cultural frame",
    reasoning: decision === "PUSH"
      ? "Signal confirms momentum. Reallocating reserve to paid."
      : decision === "TEST"
      ? "Capital preserved. Awaiting stronger signal."
      : "Updating cultural intelligence layer with new inputs.",
    type: "adjust",
  });

  tl.push({
    time: "72:00",
    action: decision === "PUSH"
      ? "Monitoring — full review, reallocating capital on 72hr data"
      : decision === "TEST"
      ? "Monitoring — test cycle continues, evaluating format performance"
      : "Monitoring — hold review, system decides continue or activate",
    reasoning: "System remains active. Next full evaluation scheduled.",
    type: "monitor",
  });

  return { decision, confidence, risk, context, timeline: tl };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision) {
  return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";
}
function dirArrow(d: "rising" | "stable" | "declining") {
  return d === "rising" ? "↑" : d === "stable" ? "→" : "↓";
}
function dirColor(d: "rising" | "stable" | "declining") {
  return d === "rising" ? "text-mint" : d === "stable" ? "text-sun" : "text-signal";
}
function dotColor(t: TimelineEntry["type"]) {
  return t === "decision" ? "bg-ink" : t === "deploy" ? "bg-mint" : t === "execute" ? "bg-electric" : t === "adjust" ? "bg-signal" : "bg-ink/20";
}
function strengthDot(s: "strong" | "mixed" | "weak") {
  return s === "strong" ? "bg-mint" : s === "mixed" ? "bg-sun" : "bg-signal";
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
  const endRef = useRef<HTMLDivElement | null>(null);

  const budgetVal = BUDGET_MAP(input.budget);

  const start = useCallback(() => {
    if (!input.trackName.trim()) return;
    setOutput(generate(input));
    setStep("boot");
    setBootIdx(0);
    setEvIdx(0);
    setExpanded({});
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
    setStep("input");
    setOutput(null);
    setBootIdx(0);
    setEvIdx(0);
    setExpanded({});
  }, []);

  const toggle = (i: number) => setExpanded((e) => ({ ...e, [i]: !e[i] }));

  const vis = output ? output.timeline.slice(0, step === "done" ? output.timeline.length : evIdx + 1) : [];

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

      {/* Hero — compact */}
      <section className="bg-ink text-paper py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] font-bold">
            AI runs <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-4 text-sm text-paper/40 max-w-sm">Decision → content → spend → optimisation. Continuously.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-12 md:py-16">
        <AnimatePresence mode="wait">

          {/* INPUT */}
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }} className="max-w-xl">
              <div className="mb-7">
                <label className="block text-sm font-medium text-ink/55 mb-2">Track name</label>
                <input type="text" value={input.trackName} onChange={(e) => setInput((p) => ({ ...p, trackName: e.target.value }))} placeholder="e.g. Midnight Drive" className="w-full rounded-xl border border-ink/15 bg-cream px-5 py-3.5 text-base text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/40 transition-colors" />
              </div>
              <div className="mb-7">
                <label className="block text-sm font-medium text-ink/55 mb-2">Artist stage</label>
                <div className="flex gap-2.5">
                  {([ ["emerging","Emerging"], ["breaking","Breaking"], ["established","Established"] ] as [ArtistStage,string][]).map(([v,l]) => (
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

          {/* BOOT */}
          {step === "boot" && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="max-w-sm py-16">
              {BOOT.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -6 }} animate={bootIdx >= i ? { opacity: i === bootIdx ? 1 : 0.25, x: 0 } : { opacity: 0, x: -6 }} transition={{ duration: 0.25 }} className="font-mono text-sm mb-2.5">
                  <span className="text-ink/20 mr-2.5">{bootIdx > i ? "✓" : bootIdx === i ? "›" : " "}</span>
                  <span className={bootIdx === i ? "text-ink" : "text-ink/30"}>{line}</span>
                </motion.div>
              ))}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: (bootIdx + 1) / BOOT.length }} transition={{ duration: 0.3 }} className="h-px bg-ink/15 mt-6 origin-left" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TIMELINE */}
        {(step === "run" || step === "done") && output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

            {/* ── Context Strip ──────────────────────── */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 pb-5 border-b border-ink/8 text-xs text-ink/40">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span className="uppercase tracking-wider font-medium">Artist</span>
                <span className="text-ink/55">{output.context.artist}</span>
                <span className={`${dirColor(output.context.growthDir)} font-medium`}>{dirArrow(output.context.growthDir)} {output.context.growth}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-electric/40" />
                <span className="uppercase tracking-wider font-medium">Culture</span>
                <span className="text-ink/55">{output.context.culture} · {output.context.tone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot(output.context.signalStrength)}`} />
                <span className="uppercase tracking-wider font-medium">Signal</span>
                <span className="text-ink/55">{output.context.signalSummary}</span>
              </div>
            </div>

            {/* ── Timeline ───────────────────────────── */}
            <div className="relative ml-2 md:ml-4">
              {/* line */}
              <div className="absolute left-[3px] top-0 bottom-0 w-px bg-ink/8" />

              {vis.map((ev, i) => {
                const showTime = i === 0 || ev.time !== vis[i - 1].time;
                const isDecision = ev.type === "decision";
                const hasExpand = !!ev.expand;
                const isOpen = !!expanded[i];

                return (
                  <motion.div
                    key={`${ev.time}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pl-8 md:pl-10 pb-1"
                  >
                    {/* dot */}
                    <span className={`absolute left-0 top-[1.1rem] w-[7px] h-[7px] rounded-full ${dotColor(ev.type)} ${ev.type === "adjust" ? "animate-pulse" : ""}`} />

                    {/* timestamp */}
                    {showTime && (
                      <div className="text-[11px] font-mono text-ink/25 mb-1 -mt-0.5">{ev.time}</div>
                    )}

                    {isDecision ? (
                      /* ── Decision card ── */
                      <div className="rounded-xl bg-ink text-paper p-5 md:p-6 mb-4">
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
                          <div className="font-display font-bold text-4xl md:text-5xl leading-none flex items-center gap-3">
                            <span className={decisionColor(output.decision)}>→</span>{output.decision}
                          </div>
                          <div className="flex gap-5 text-sm">
                            <div><span className="text-paper/30 text-xs uppercase tracking-wider">Conf </span><span className="font-display font-bold">{output.confidence}%</span></div>
                            <div><span className="text-paper/30 text-xs uppercase tracking-wider">Risk </span><span className={`font-display font-bold ${output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"}`}>{output.risk}</span></div>
                          </div>
                        </div>
                        <p className="text-paper/50 text-sm">{ev.action}</p>
                        <p className="text-paper/30 text-xs mt-1.5">{ev.reasoning}</p>
                      </div>
                    ) : (
                      /* ── Standard entry ── */
                      <div className={`pb-4 ${i < vis.length - 1 ? "border-b border-ink/5" : ""} mb-1`}>
                        <p className={`text-sm ${ev.type === "adjust" ? "text-ink/75 font-medium" : ev.type === "monitor" ? "text-ink/45" : "text-ink/65"}`}>
                          {ev.action}
                        </p>
                        {ev.reasoning && (
                          <p className="text-xs text-ink/30 mt-1">{ev.reasoning}</p>
                        )}

                        {/* inline tool */}
                        {ev.tool && (
                          <a
                            href={ev.tool.href}
                            target={ev.tool.external ? "_blank" : undefined}
                            rel={ev.tool.external ? "noreferrer noopener" : undefined}
                            className="inline-flex items-center gap-1.5 mt-2 text-xs text-ink/30 hover:text-signal transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-ink/15" />
                            {ev.tool.label}
                            <span>{ev.tool.external ? "↗" : "→"}</span>
                          </a>
                        )}

                        {/* expandable zoom */}
                        {hasExpand && (
                          <>
                            <button onClick={() => toggle(i)} className="block mt-2 text-xs text-ink/25 hover:text-ink/45 transition-colors">
                              <span className="inline-block transition-transform mr-1" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                              {isOpen ? "Less" : ev.expand!.heading}
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 pl-3 border-l border-ink/8 space-y-1">
                                    {ev.expand!.lines.map((ln) => (
                                      <p key={ln} className="text-xs text-ink/35">{ln}</p>
                                    ))}
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

            {/* ── System Bar ─────────────────────────── */}
            {step === "done" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }} className="mt-8 rounded-xl bg-ink text-paper px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  <span className="font-display font-bold text-sm">System active</span>
                  <span className="text-paper/25 text-xs font-mono">{input.trackName} · {input.artistStage} · {fmt(budgetVal)}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-paper/35">
                    <span className={dirColor(output.context.growthDir)}>{dirArrow(output.context.growthDir)}</span> {output.context.growth}
                  </span>
                  <span className="text-paper/25 font-mono">Next eval 48h</span>
                </div>
              </motion.div>
            )}

            {/* Reset */}
            {step === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.35 }} className="mt-6 pt-4 border-t border-ink/8">
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
