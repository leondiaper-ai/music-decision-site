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

interface Reasoning {
  signal: string;
  culture: string;
  artist: string;
}

interface Moment {
  day: number;
  streams: number;
  saves: number;
  action: string;
  type: "decision" | "deploy" | "execute" | "monitor" | "adjust";
  reasoning: Reasoning;
  confidence?: number;
  risk?: "Low" | "Medium" | "High";
  tool?: { label: string; href: string; external?: boolean };
}

interface SystemOutput {
  decision: Decision;
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

  let decision: Decision;
  if (isEs && budget > 15000) decision = "PUSH";
  else if (isEm && budget < 5000) decision = "TEST";
  else if (isEs) decision = "PUSH";
  else if (budget > 20000) decision = "PUSH";
  else if (isEm) decision = "TEST";
  else decision = "HOLD";

  const conf = decision === "PUSH" ? (isEs ? 87 : 81) : decision === "TEST" ? (isEm && budget < 5000 ? 72 : 68) : 64;
  const risk: "Low" | "Medium" | "High" = decision === "PUSH" ? (isEs ? "Low" : "Medium") : decision === "TEST" ? "Medium" : "High";

  const base = isEs ? 45000 : isEm ? 800 : 8000;
  const sv = isEs ? 5.1 : isEm ? 3.2 : 4.1;
  const m = decision === "PUSH" ? 1.6 : decision === "TEST" ? 1.15 : 0.95;

  const tone = isEm ? "lo-fi, raw" : isEs ? "cinematic" : "energetic, narrative";
  const culture = isEm ? "discovery" : isEs ? "scale" : "momentum";
  const growth = isEm ? "early traction" : isEs ? "plateau" : "accelerating";
  const fans = isEm ? "12k" : isEs ? "2.1M" : "340k";

  const moments: Moment[] = [
    {
      day: 0, streams: base, saves: sv, type: "decision",
      action: decision === "PUSH" ? `PUSH — deploy ${fmt(budget)}` : decision === "TEST" ? `TEST — validate before committing ${fmt(budget)}` : `HOLD — ${fmt(budget)} preserved`,
      confidence: conf, risk,
      reasoning: {
        signal: isEs ? `Save 5.1%, reach +24%, velocity high` : isEm ? `Save 3.2%, reach −12%, engagement high` : `Save 4.1%, reach +8%, engagement high`,
        culture: `${culture} frame — ${tone} positioning`,
        artist: `${fans} monthly, ${growth}`,
      },
      tool: { label: "Artist & Track Lens", href: "/lens" },
    },
    {
      day: 1, streams: Math.round(base * 1.15), saves: sv + 0.2, type: "execute",
      action: decision === "PUSH"
        ? isEs ? "System set execution — hero assets, editorial, simultaneous launch"
          : isEm ? "System set execution — raw content, authentic voices, organic-first"
          : "System set execution — narrative assets, genre-adjacent creators, 7-day stagger"
        : decision === "TEST" ? `System set execution — ${tone.split(",")[0]} test formats, micro-creators` : "System set execution — minimal output, research mode",
      reasoning: {
        signal: "Execution follows from signal read",
        culture: `${culture} frame shapes content direction and creator strategy`,
        artist: `${growth} state determines timing and scale`,
      },
      tool: { label: "Campaign Timeline", href: "https://campaign-timeline-viewer.vercel.app", external: true },
    },
    {
      day: 3, streams: Math.round(base * m * 0.9), saves: sv + (decision === "PUSH" ? 0.8 : 0.1), type: "deploy",
      action: decision === "PUSH"
        ? `System deployed capital — ${fmt(Math.round(budget * 0.4))} paid, ${fmt(Math.round(budget * 0.35))} content, ${fmt(Math.round(budget * 0.25))} creators + reserve`
        : decision === "TEST"
        ? `System deployed capital — ${fmt(Math.round(budget * 0.4))} content testing, ${fmt(Math.round(budget * 0.6))} held`
        : "System held all capital — no deployment",
      reasoning: {
        signal: decision === "PUSH" ? "Signal confirms audience — extend momentum" : decision === "TEST" ? "Signal promising, not confirmed — test first" : "Insufficient signal",
        culture: decision === "PUSH" ? `${tone} assets, voices matching ${culture} positioning` : `Organic validation within ${culture} frame`,
        artist: decision === "PUSH" ? `${growth} supports aggressive deployment` : `${growth} requires caution`,
      },
      tool: decision !== "HOLD" ? { label: "YouTube Coach", href: "https://youtube-campaign-coach.vercel.app", external: true } : undefined,
    },
    {
      day: 5, streams: Math.round(base * m * 1.05), saves: sv + (decision === "PUSH" ? 1.3 : decision === "TEST" ? 0.3 : -0.1), type: "monitor",
      action: decision === "PUSH" ? `Monitoring — saves climbing to ${(sv + 1.3).toFixed(1)}%, streams up` : decision === "TEST" ? "Monitoring — organic response steady" : "Monitoring — no organic traction",
      reasoning: { signal: "Tracking against baseline", culture: "No intervention — observing", artist: "Health stable" },
    },
    {
      day: 7, streams: Math.round(base * m * 1.15), saves: sv + (decision === "PUSH" ? 1.5 : decision === "TEST" ? 0.6 : -0.2), type: "monitor",
      action: decision === "PUSH" ? `System evaluated — streams +${Math.round((m * 1.15 - 1) * 100)}%, saves ${(sv + 1.5).toFixed(1)}%`
        : decision === "TEST" ? `System evaluated — saves ${(sv + 0.6).toFixed(1)}%, mixed format response` : "System evaluated — no breakthrough",
      reasoning: { signal: "7-day data cross-referenced", culture: `Performance within ${culture} frame`, artist: `Health baseline at ${growth}` },
      tool: { label: "Artist & Track Lens", href: "/lens" },
    },
    {
      day: 10, streams: Math.round(base * m * (decision === "PUSH" ? 1.4 : decision === "TEST" ? 1.1 : 0.85)), saves: sv + (decision === "PUSH" ? 1.8 : decision === "TEST" ? 0.8 : -0.5), type: "monitor",
      action: decision === "PUSH" ? "Monitoring — sustained, no drop-off" : decision === "TEST" ? "Monitoring — saves climbing, narrative outperforming" : "Monitoring — flat, holding",
      reasoning: { signal: "Trend continuing", culture: "Frame holding", artist: "No health change" },
    },
    {
      day: 14, streams: Math.round(base * m * (decision === "PUSH" ? 1.65 : decision === "TEST" ? 1.2 : 0.75)), saves: sv + (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.0 : -0.7), type: "adjust",
      action: decision === "PUSH" ? `System adjusted — reallocating ${fmt(Math.round(budget * 0.1))} reserve to paid` : decision === "TEST" ? `System adjusted — save rate crossed ${(sv + 1.0).toFixed(1)}%, upgrading to PUSH` : "System adjusted — extending hold",
      reasoning: {
        signal: decision === "PUSH" ? `Streams +${Math.round((m * 1.65 - 1) * 100)}%, saves ${(sv + 2.1).toFixed(1)}%` : decision === "TEST" ? "Threshold crossed — evidence supports deployment" : "No organic demand",
        culture: decision === "PUSH" ? "Momentum confirmed in cultural frame" : decision === "TEST" ? "Cultural frame validated through testing" : "Frame requires stronger signal",
        artist: decision === "PUSH" ? "Deploying remaining capital" : decision === "TEST" ? "Artist health supports upgrade" : "Continuing research",
      },
    },
    {
      day: 21, streams: Math.round(base * m * (decision === "PUSH" ? 1.9 : decision === "TEST" ? 1.35 : 0.7)), saves: sv + (decision === "PUSH" ? 2.3 : decision === "TEST" ? 1.2 : -0.8), type: "monitor",
      action: decision === "PUSH" ? `Monitoring — sustaining at ${fmtK(Math.round(base * m * 1.9))} daily` : decision === "TEST" ? "Monitoring — post-upgrade ramp" : "Monitoring — hold continues",
      reasoning: { signal: "Continuous evaluation", culture: "Active", artist: "Stable" },
    },
    {
      day: 28, streams: Math.round(base * m * (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.5 : 0.65)), saves: sv + (decision === "PUSH" ? 2.5 : decision === "TEST" ? 1.4 : -1.0), type: "monitor",
      action: decision === "PUSH" ? `28-day — ${fmtK(Math.round(base * m * 2.1))} daily, saves ${(sv + 2.5).toFixed(1)}%`
        : decision === "TEST" ? `28-day — ${fmtK(Math.round(base * m * 1.5))} daily, test validated`
        : `28-day — ${fmtK(Math.round(base * m * 0.65))} daily, hold maintained`,
      reasoning: { signal: "Full cycle complete", culture: "System begins next window", artist: "Health re-evaluated" },
    },
  ];

  return { decision, moments };
}

/* ─── Helpers ───────────────────────────────────────────── */

function decisionColor(d: Decision) { return d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric"; }
function dotFill(t: Moment["type"]) { return t === "decision" ? "bg-ink" : t === "deploy" ? "bg-mint" : t === "execute" ? "bg-electric" : t === "adjust" ? "bg-signal" : "bg-ink/15"; }

/* ─── Ecosystem Map ────────────────────────────────────── */

const MODULES = [
  { id: "signal", label: "Signal Monitor", angle: -90 },
  { id: "culture", label: "Cultural Intelligence", angle: -18 },
  { id: "spend", label: "Spend Engine", angle: 54 },
  { id: "youtube", label: "YouTube Coach", angle: 126 },
  { id: "lens", label: "Artist & Track Lens", angle: 198 },
] as const;

function EcosystemMap({ decision, onComplete }: { decision: Decision; onComplete: () => void }) {
  const [phase, setPhase] = useState<"nodes" | "connect" | "signal" | "converge" | "decide" | "out">("nodes");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("connect"), 600),
      setTimeout(() => setPhase("signal"), 1200),
      setTimeout(() => setPhase("converge"), 2400),
      setTimeout(() => setPhase("decide"), 3200),
      setTimeout(() => setPhase("out"), 4200),
      setTimeout(onComplete, 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const phaseGte = (p: typeof phase) => {
    const order = ["nodes", "connect", "signal", "converge", "decide", "out"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  const CX = 240, CY = 160, R = 110;
  const decColor = decision === "PUSH" ? "#FF4A1C" : decision === "TEST" ? "#FFD24C" : "#2C25FF";

  return (
    <div className="flex items-center justify-center py-8 md:py-12">
      <svg viewBox="0 0 480 320" className="w-full max-w-[520px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          {MODULES.map((mod, i) => {
            const rad = (mod.angle * Math.PI) / 180;
            const mx = CX + Math.cos(rad) * R;
            const my = CY + Math.sin(rad) * R;
            return (
              <linearGradient key={`grad-${i}`} id={`line-grad-${i}`} x1={mx} y1={my} x2={CX} y2={CY} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0E0E0E" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#0E0E0E" stopOpacity={0.15} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Connection lines */}
        {MODULES.map((mod, i) => {
          const rad = (mod.angle * Math.PI) / 180;
          const mx = CX + Math.cos(rad) * R;
          const my = CY + Math.sin(rad) * R;
          return (
            <line
              key={`conn-${i}`}
              x1={mx} y1={my} x2={CX} y2={CY}
              stroke={`url(#line-grad-${i})`}
              strokeWidth={1}
              opacity={phaseGte("connect") ? 1 : 0}
              style={{ transition: "opacity 0.4s ease" }}
            />
          );
        })}

        {/* Signal pulses — dots moving along connections */}
        {phaseGte("signal") && !phaseGte("out") && MODULES.map((mod, i) => {
          const rad = (mod.angle * Math.PI) / 180;
          const mx = CX + Math.cos(rad) * R;
          const my = CY + Math.sin(rad) * R;
          const converging = phaseGte("converge");
          return (
            <circle key={`pulse-${i}`} r={2.5} fill="#0E0E0E" opacity={0.25}>
              <animateMotion
                dur={converging ? "0.6s" : "1.8s"}
                repeatCount={converging ? "1" : "indefinite"}
                begin={converging ? "0s" : `${i * 0.3}s`}
                fill={converging ? "freeze" : "remove"}
                path={`M${mx - CX},${my - CY} L0,0`}
              />
            </circle>
          );
        })}

        {/* Module nodes */}
        {MODULES.map((mod, i) => {
          const rad = (mod.angle * Math.PI) / 180;
          const mx = CX + Math.cos(rad) * R;
          const my = CY + Math.sin(rad) * R;
          const converged = phaseGte("converge");
          return (
            <g key={mod.id} opacity={phaseGte("nodes") ? (phaseGte("out") ? 0.15 : 1) : 0} style={{ transition: "opacity 0.4s ease" }}>
              {/* Pulse ring */}
              {phaseGte("signal") && !converged && (
                <circle cx={mx} cy={my} r={12} fill="none" stroke="#0E0E0E" strokeWidth={0.5} opacity={0.08}>
                  <animate attributeName="r" values="12;20;12" dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.08;0;0.08" dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={mx} cy={my} r={converged ? 3 : 5} fill="#0E0E0E" opacity={converged ? 0.12 : 0.65} style={{ transition: "all 0.5s ease" }} />
              <text x={mx} y={my + (mod.angle > 0 && mod.angle < 180 ? 16 : -12)} textAnchor="middle" className="text-[8px] font-mono" fill="#0E0E0E" opacity={converged ? 0.08 : 0.25} style={{ transition: "opacity 0.4s ease" }}>
                {mod.label}
              </text>
            </g>
          );
        })}

        {/* Center node */}
        <circle cx={CX} cy={CY} r={phaseGte("converge") ? 18 : 8} fill={phaseGte("decide") ? decColor : "#0E0E0E"} opacity={phaseGte("decide") ? 0.9 : 0.7} style={{ transition: "all 0.5s ease" }}>
          {phaseGte("signal") && !phaseGte("converge") && (
            <animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Decision text */}
        {phaseGte("decide") && (
          <text x={CX} y={CY + 4} textAnchor="middle" className="text-[11px] font-mono font-bold" fill="#FAF7F2" opacity={phaseGte("out") ? 0.5 : 1} style={{ transition: "opacity 0.3s ease" }}>
            {decision}
          </text>
        )}

        {/* Center label */}
        {!phaseGte("decide") && (
          <text x={CX} y={CY + 32} textAnchor="middle" className="text-[8px] font-mono" fill="#0E0E0E" opacity={0.2}>
            Campaign System
          </text>
        )}
      </svg>
    </div>
  );
}

/* ─── Graph ─────────────────────────────────────────────── */

function Graph({ moments, activeIdx, onHover }: { moments: Moment[]; activeIdx: number | null; onHover: (i: number | null) => void }) {
  const W = 720, H = 180, PX = 36, PY = 20;
  const maxS = Math.max(...moments.map((m) => m.streams)) * 1.1;
  const maxD = moments[moments.length - 1].day || 1;
  const px = (d: number) => PX + (d / maxD) * (W - PX * 2);
  const py = (s: number) => PY + (1 - s / maxS) * (H - PY * 2);
  const pts = moments.map((mo) => `${px(mo.day)},${py(mo.streams)}`).join(" ");
  const area = `${px(0)},${py(0)} ${pts} ${px(moments[moments.length - 1].day)},${py(0)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PX} y1={py(maxS * f)} x2={W - PX} y2={py(maxS * f)} stroke="currentColor" className="text-ink/[0.03]" strokeWidth={0.5} />
      ))}
      <polygon points={area} className="fill-ink/[0.02]" />
      <polyline points={pts} fill="none" stroke="currentColor" className="text-ink/15" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {moments.map((mo, i) => {
        const isA = activeIdx === i;
        const cx = px(mo.day), cy = py(mo.streams);
        return (
          <g key={i} onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} className="cursor-pointer">
            <circle cx={cx} cy={cy} r={14} fill="transparent" />
            <circle cx={cx} cy={cy} r={isA ? 4.5 : mo.type === "monitor" ? 2 : 3}
              className={`transition-all duration-150 ${isA ? "fill-signal" : mo.type === "decision" ? "fill-ink" : mo.type === "deploy" ? "fill-mint" : mo.type === "adjust" ? "fill-signal/60" : "fill-ink/12"}`} />
            {isA && (
              <>
                <line x1={cx} y1={cy + 6} x2={cx} y2={H - PY} stroke="currentColor" className="text-signal/12" strokeWidth={0.5} strokeDasharray="2,2" />
                <text x={cx} y={cy - 12} textAnchor="middle" className="text-[9px] font-mono fill-ink/50">{fmtK(mo.streams)} · {mo.saves.toFixed(1)}%</text>
                <text x={cx} y={H - PY + 12} textAnchor="middle" className="text-[7px] font-mono fill-ink/25">Day {mo.day}</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Boot ──────────────────────────────────────────────── */

const BOOT = ["Initialising…", "Loading baseline…", "Mapping culture…", "Reading signal…", "Running."];

/* ─── Scenarios ─────────────────────────────────────────── */

const SCENARIOS: { label: string; sub: string; input: CampaignInput }[] = [
  { label: "Breaking artist — momentum moment", sub: "340k monthly, accelerating, $15k", input: { trackName: "Midnight Drive", artistStage: "breaking", budget: 30 } },
  { label: "Established artist — major release", sub: "2.1M monthly, plateau, $35k", input: { trackName: "Cathedral", artistStage: "established", budget: 70 } },
  { label: "Emerging artist — first traction", sub: "12k monthly, early traction, $3k", input: { trackName: "Bedroom Floor", artistStage: "emerging", budget: 5 } },
];

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [step, setStep] = useState<"input" | "boot" | "ecosystem" | "run" | "done">("input");
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [bootIdx, setBootIdx] = useState(0);
  const [evIdx, setEvIdx] = useState(0);
  const [openReasoning, setOpenReasoning] = useState<Record<number, boolean>>({});
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState<CampaignInput>({ trackName: "", artistStage: "breaking", budget: 30 });
  const endRef = useRef<HTMLDivElement | null>(null);

  const launch = useCallback((inp: CampaignInput) => {
    setOutput(generate(inp));
    setStep("boot");
    setBootIdx(0); setEvIdx(0); setOpenReasoning({}); setActiveIdx(null); setShowCustom(false);
  }, []);

  useEffect(() => {
    if (step !== "boot") return;
    if (bootIdx < BOOT.length - 1) { const t = setTimeout(() => setBootIdx((b) => b + 1), 480); return () => clearTimeout(t); }
    else { const t = setTimeout(() => setStep("ecosystem"), 280); return () => clearTimeout(t); }
  }, [step, bootIdx]);

  const onEcosystemComplete = useCallback(() => {
    setStep("run");
    setEvIdx(0);
  }, []);

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

  const reset = useCallback(() => { setStep("input"); setOutput(null); setBootIdx(0); setEvIdx(0); setOpenReasoning({}); setActiveIdx(null); }, []);
  const toggleR = (i: number) => setOpenReasoning((r) => ({ ...r, [i]: !r[i] }));
  const vis = output ? output.moments.slice(0, step === "done" ? output.moments.length : evIdx + 1) : [];

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/70 border-b border-ink/5">
        <div className="mx-auto max-w-[960px] px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" />decision/system_
          </Link>
          <Link href="/" className="text-sm text-ink/50 hover:text-signal transition-colors">← Overview</Link>
        </div>
      </header>

      <section className="bg-ink text-paper py-10 md:py-12">
        <div className="mx-auto max-w-[960px] px-6 md:px-10">
          <h1 className="font-display text-3xl md:text-5xl leading-[0.95] font-bold">
            AI runs <span className="italic font-light text-signal">the campaign.</span>
          </h1>
          <p className="mt-3 text-sm text-paper/30 max-w-sm">Decision → content → spend → optimisation. Continuously.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[960px] px-6 md:px-10 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {/* Scenarios */}
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="max-w-2xl">
              <p className="text-sm text-ink/40 mb-6">Pick a campaign. Watch the system run.</p>
              <div className="grid gap-3 mb-8">
                {SCENARIOS.map((sc) => (
                  <button key={sc.label} onClick={() => launch(sc.input)} className="group w-full text-left rounded-xl border border-ink/10 hover:border-ink/25 px-5 py-4 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-ink/70 group-hover:text-ink transition-colors">{sc.label}</div>
                      <div className="text-xs text-ink/30 mt-0.5">{sc.sub}</div>
                    </div>
                    <span className="text-ink/12 group-hover:text-signal transition-colors text-sm">→</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-ink/6 pt-4">
                <button onClick={() => setShowCustom((s) => !s)} className="text-xs text-ink/20 hover:text-ink/40 transition-colors">
                  <span className="inline-block transition-transform mr-1" style={{ transform: showCustom ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>Custom setup
                </button>
                <AnimatePresence>
                  {showCustom && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="pt-4 max-w-md space-y-4">
                        <div>
                          <label className="block text-xs text-ink/35 mb-1">Track</label>
                          <input type="text" value={customInput.trackName} onChange={(e) => setCustomInput((p) => ({ ...p, trackName: e.target.value }))} placeholder="e.g. Midnight Drive" className="w-full rounded-lg border border-ink/10 bg-cream px-3.5 py-2 text-sm text-ink placeholder:text-ink/20 focus:outline-none focus:border-ink/25 transition-colors" />
                        </div>
                        <div className="flex gap-2">
                          {([["emerging","Emerging"],["breaking","Breaking"],["established","Established"]] as [ArtistStage,string][]).map(([v,l]) => (
                            <button key={v} onClick={() => setCustomInput((p) => ({ ...p, artistStage: v }))} className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${customInput.artistStage === v ? "bg-ink text-paper border-ink" : "border-ink/10 text-ink/45 hover:border-ink/20"}`}>{l}</button>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="range" min={0} max={100} value={customInput.budget} onChange={(e) => setCustomInput((p) => ({ ...p, budget: Number(e.target.value) }))} className="flex-1 h-1.5 rounded-full appearance-none bg-ink/6 accent-ink cursor-pointer" />
                          <span className="font-display font-bold text-sm min-w-[4rem] text-right">{fmt(BUDGET_MAP(customInput.budget))}</span>
                        </div>
                        <button onClick={() => { if (customInput.trackName.trim()) launch(customInput); }} disabled={!customInput.trackName.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-4 py-2 text-xs font-medium hover:bg-signal transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
                          Run <span>→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Boot */}
          {step === "boot" && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="max-w-xs py-14">
              {BOOT.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -5 }} animate={bootIdx >= i ? { opacity: i === bootIdx ? 1 : 0.15, x: 0 } : { opacity: 0, x: -5 }} transition={{ duration: 0.2 }} className="font-mono text-sm mb-2">
                  <span className="text-ink/15 mr-2">{bootIdx > i ? "✓" : bootIdx === i ? "›" : " "}</span>
                  <span className={bootIdx === i ? "text-ink" : "text-ink/20"}>{line}</span>
                </motion.div>
              ))}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: (bootIdx + 1) / BOOT.length }} transition={{ duration: 0.25 }} className="h-px bg-ink/12 mt-5 origin-left" />
            </motion.div>
          )}

          {/* Ecosystem */}
          {step === "ecosystem" && output && (
            <motion.div key="ecosystem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <EcosystemMap decision={output.decision} onComplete={onEcosystemComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── THE TIMELINE ────────────────────────────── */}
        {(step === "run" || step === "done") && output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

            {/* Graph — no border, no label, just the curve */}
            <div className="mb-6">
              <Graph moments={output.moments} activeIdx={activeIdx} onHover={setActiveIdx} />
            </div>

            {/* Timeline */}
            <div className="relative ml-1">
              <div className="absolute left-[3px] top-0 bottom-0 w-px bg-ink/6" />

              {vis.map((mo, i) => {
                const isDecision = mo.type === "decision";
                const isA = activeIdx === i;
                const rOpen = !!openReasoning[i];

                return (
                  <motion.div
                    key={`${mo.day}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative pl-7 pb-0.5 transition-colors duration-100 ${isA ? "bg-ink/[0.015] -mx-2 px-9 rounded-lg" : ""}`}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  >
                    <span className={`absolute left-0 top-[0.9rem] w-[7px] h-[7px] rounded-full ${dotFill(mo.type)} ${mo.type === "adjust" ? "animate-pulse" : ""}`} />

                    {(i === 0 || mo.day !== vis[i - 1].day) && (
                      <div className="text-[10px] font-mono text-ink/18 mb-0.5">Day {mo.day}</div>
                    )}

                    {isDecision ? (
                      /* Decision — the only dark card in the entire UI */
                      <div className="rounded-xl bg-ink text-paper p-5 mb-2">
                        <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                          <div className="font-display font-bold text-3xl md:text-4xl leading-none flex items-center gap-2">
                            <span className={decisionColor(output.decision)}>→</span>{output.decision}
                          </div>
                          {mo.confidence && mo.risk && (
                            <div className="flex gap-4 text-xs">
                              <span className="text-paper/25">{mo.confidence}% conf</span>
                              <span className={mo.risk === "Low" ? "text-mint" : mo.risk === "Medium" ? "text-sun" : "text-signal"}>{mo.risk} risk</span>
                            </div>
                          )}
                        </div>
                        <p className="text-paper/45 text-sm">{mo.action}</p>

                        {/* Reasoning — collapsed */}
                        <button onClick={() => toggleR(i)} className="mt-2 text-xs text-paper/18 hover:text-paper/35 transition-colors">
                          <span className="inline-block transition-transform mr-0.5" style={{ transform: rOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                          {rOpen ? "Less" : "Why"}
                        </button>
                        <AnimatePresence>
                          {rOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="mt-1.5 pl-2 border-l border-paper/10 space-y-1 text-xs text-paper/25">
                                <p><span className="text-mint">Signal</span> {mo.reasoning.signal}</p>
                                <p><span className="text-electric">Culture</span> {mo.reasoning.culture}</p>
                                <p><span className="text-sun">Artist</span> {mo.reasoning.artist}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {mo.tool && (
                          <a href={mo.tool.href} target={mo.tool.external ? "_blank" : undefined} rel={mo.tool.external ? "noreferrer noopener" : undefined} className="inline-flex items-center gap-1 mt-2 text-xs text-paper/15 hover:text-signal transition-colors">
                            <span className="w-1 h-1 rounded-full bg-paper/8" />{mo.tool.label} {mo.tool.external ? "↗" : "→"}
                          </a>
                        )}
                      </div>
                    ) : (
                      /* Standard moment */
                      <div className={`pb-3 ${i < vis.length - 1 && vis[i + 1]?.day !== mo.day ? "border-b border-ink/4" : ""}`}>
                        <p className={`text-sm ${mo.type === "adjust" ? "text-ink/65 font-medium" : mo.type === "monitor" ? "text-ink/35" : "text-ink/55"}`}>{mo.action}</p>

                        {/* Reasoning — collapsed */}
                        <button onClick={() => toggleR(i)} className="mt-1 text-[11px] text-ink/15 hover:text-ink/30 transition-colors">
                          <span className="inline-block transition-transform mr-0.5" style={{ transform: rOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                          {rOpen ? "Less" : "Why"}
                        </button>
                        <AnimatePresence>
                          {rOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                              <div className="mt-1 pl-2 border-l border-ink/6 space-y-0.5 text-[11px] text-ink/25">
                                <p><span className="text-mint">Signal</span> {mo.reasoning.signal}</p>
                                <p><span className="text-electric">Culture</span> {mo.reasoning.culture}</p>
                                <p><span className="text-sun">Artist</span> {mo.reasoning.artist}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {mo.tool && (
                          <a href={mo.tool.href} target={mo.tool.external ? "_blank" : undefined} rel={mo.tool.external ? "noreferrer noopener" : undefined} className="inline-flex items-center gap-1 mt-1 text-[11px] text-ink/15 hover:text-signal transition-colors">
                            <span className="w-1 h-1 rounded-full bg-ink/8" />{mo.tool.label} {mo.tool.external ? "↗" : "→"}
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Active indicator — replaces system bar */}
              {step === "done" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="relative pl-7 pt-2 pb-4">
                  <span className="absolute left-0 top-[0.85rem] w-[7px] h-[7px] rounded-full bg-mint animate-pulse" />
                  <span className="text-xs text-ink/25 font-mono">System active · next eval 48h</span>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {step === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 pt-4 border-t border-ink/5">
                <button onClick={reset} className="group inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-4 py-2 text-xs font-medium hover:bg-ink hover:text-paper transition-colors">
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
