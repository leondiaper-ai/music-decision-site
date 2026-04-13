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

interface SystemOutput {
  decision: Decision;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  deployment: string;
  outcome: string;
}

/* ─── Engine (simplified for system layer) ─────────────── */

const BUDGET_MAP = (pct: number) => Math.round(500 + (pct / 100) * 49500);
function fmt(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`; }

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

  const deployment = decision === "PUSH"
    ? `${fmt(Math.round(budget * 0.4))} paid · ${fmt(Math.round(budget * 0.35))} content · ${fmt(Math.round(budget * 0.25))} creators`
    : decision === "TEST"
    ? `${fmt(Math.round(budget * 0.4))} testing · ${fmt(Math.round(budget * 0.6))} held`
    : `${fmt(budget)} preserved`;

  const m = decision === "PUSH" ? 1.6 : decision === "TEST" ? 1.15 : 0.95;
  const base = isEs ? 45000 : isEm ? 800 : 8000;
  const sv = isEs ? 5.1 : isEm ? 3.2 : 4.1;
  const endStreams = Math.round(base * m * (decision === "PUSH" ? 2.1 : decision === "TEST" ? 1.5 : 0.65));
  const endSaves = sv + (decision === "PUSH" ? 2.5 : decision === "TEST" ? 1.4 : -1.0);
  const outcome = `${endStreams >= 1000 ? `${(endStreams / 1000).toFixed(1)}k` : endStreams} daily · ${endSaves.toFixed(1)}% saves · 28 days`;

  return { decision, confidence: conf, risk, deployment, outcome };
}

/* ─── Modules ──────────────────────────────────────────── */

const MODULES = [
  { id: "signal", label: "Signal Monitor", angle: -90 },
  { id: "culture", label: "Cultural Intelligence", angle: -18 },
  { id: "spend", label: "Spend Engine", angle: 54 },
  { id: "youtube", label: "YouTube Coach", angle: 126 },
  { id: "lens", label: "Artist & Track Lens", angle: 198 },
] as const;

/* ─── Hero System Map ──────────────────────────────────── */

function SystemMap({ activeDecision, converging }: { activeDecision: Decision | null; converging: boolean }) {
  const CX = 300, CY = 200, R = 140;
  const decColor = !activeDecision ? "#0E0E0E" : activeDecision === "PUSH" ? "#FF4A1C" : activeDecision === "TEST" ? "#FFD24C" : "#2C25FF";
  const showDec = activeDecision && converging;

  return (
    <svg viewBox="0 0 600 400" className="w-full max-w-[640px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        {MODULES.map((_, i) => (
          <linearGradient key={`lg-${i}`} id={`lg-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E0E0E" stopOpacity={0.04} />
            <stop offset="100%" stopColor="#0E0E0E" stopOpacity={0.12} />
          </linearGradient>
        ))}
      </defs>

      {/* Connection lines */}
      {MODULES.map((mod, i) => {
        const rad = (mod.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        return (
          <line
            key={`c-${i}`}
            x1={mx} y1={my} x2={CX} y2={CY}
            stroke={converging ? decColor : `url(#lg-${i})`}
            strokeWidth={converging ? 1.5 : 0.75}
            opacity={converging ? 0.35 : 1}
            style={{ transition: "all 0.6s ease" }}
          />
        );
      })}

      {/* Signal dots — always moving inward */}
      {MODULES.map((mod, i) => {
        const rad = (mod.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        return (
          <circle key={`s-${i}`} r={converging ? 3 : 1.5} fill={converging ? decColor : "#0E0E0E"} opacity={converging ? 0.45 : 0.12}>
            <animateMotion
              dur={converging ? "0.8s" : "3.5s"}
              repeatCount="indefinite"
              begin={`${i * 0.6}s`}
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
        const below = mod.angle > 0 && mod.angle < 180;
        return (
          <g key={mod.id}>
            {/* Pulse ring */}
            <circle cx={mx} cy={my} r={10} fill="none" stroke={converging ? decColor : "#0E0E0E"} strokeWidth={0.5} opacity={0}>
              <animate attributeName="r" values="10;22;10" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.06;0;0.06" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={mx} cy={my} r={converging ? 6 : 5} fill={converging ? decColor : "#0E0E0E"} opacity={converging ? 0.6 : 0.35} style={{ transition: "all 0.5s ease" }} />
            <text
              x={mx}
              y={my + (below ? 18 : -14)}
              textAnchor="middle"
              className="text-[9px] font-mono"
              fill="#0E0E0E"
              opacity={0.3}
            >
              {mod.label}
            </text>
          </g>
        );
      })}

      {/* Center node */}
      <circle cx={CX} cy={CY} r={showDec ? 22 : 12} fill={showDec ? decColor : "#0E0E0E"} opacity={showDec ? 0.9 : 0.5} style={{ transition: "all 0.5s ease" }}>
        {!showDec && (
          <animate attributeName="r" values="12;14;12" dur="2.5s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Decision label in center */}
      {showDec && (
        <text x={CX} y={CY + 4.5} textAnchor="middle" className="text-[13px] font-mono font-bold" fill="#FAF7F2">
          {activeDecision}
        </text>
      )}
    </svg>
  );
}

/* ─── Auto-cycling decision logic ──────────────────────── */

const CYCLE_DECISIONS: Decision[] = ["PUSH", "TEST", "HOLD"];

function useCyclingDecision() {
  const [idx, setIdx] = useState(0);
  const [converging, setConverging] = useState(false);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    let mounted = true;
    function cycle() {
      if (!mounted) return;
      // Start convergence
      setConverging(true);
      setTimeout(() => {
        if (!mounted) return;
        setShowing(true);
        setTimeout(() => {
          if (!mounted) return;
          setShowing(false);
          setConverging(false);
          setTimeout(() => {
            if (!mounted) return;
            setIdx((i) => (i + 1) % CYCLE_DECISIONS.length);
            cycle();
          }, 2500);
        }, 2000);
      }, 1200);
    }
    const start = setTimeout(cycle, 1500);
    return () => { mounted = false; clearTimeout(start); };
  }, []);

  return {
    decision: CYCLE_DECISIONS[idx],
    converging,
    showing,
  };
}

/* ─── Scenarios ─────────────────────────────────────────── */

const SCENARIOS: { label: string; sub: string; input: CampaignInput }[] = [
  { label: "Breaking artist — momentum moment", sub: "340k monthly · $15k", input: { trackName: "Midnight Drive", artistStage: "breaking", budget: 30 } },
  { label: "Established artist — major release", sub: "2.1M monthly · $35k", input: { trackName: "Cathedral", artistStage: "established", budget: 70 } },
  { label: "Emerging artist — first traction", sub: "12k monthly · $3k", input: { trackName: "Bedroom Floor", artistStage: "emerging", budget: 5 } },
];

/* ─── Boot ──────────────────────────────────────────────── */

const BOOT = ["Initialising…", "Reading signal…", "Mapping culture…", "Running."];

/* ─── Page ──────────────────────────────────────────────── */

export default function CampaignPage() {
  const [mode, setMode] = useState<"system" | "boot" | "converge" | "result">("system");
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [bootIdx, setBootIdx] = useState(0);
  const cycling = useCyclingDecision();

  const launch = useCallback((inp: CampaignInput) => {
    setOutput(generate(inp));
    setMode("boot");
    setBootIdx(0);
  }, []);

  /* Boot sequence */
  useEffect(() => {
    if (mode !== "boot") return;
    if (bootIdx < BOOT.length - 1) {
      const t = setTimeout(() => setBootIdx((b) => b + 1), 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setMode("converge"), 300);
      return () => clearTimeout(t);
    }
  }, [mode, bootIdx]);

  /* Converge → result */
  useEffect(() => {
    if (mode !== "converge") return;
    const t = setTimeout(() => setMode("result"), 2200);
    return () => clearTimeout(t);
  }, [mode]);

  const reset = useCallback(() => { setMode("system"); setOutput(null); setBootIdx(0); }, []);

  const decisionColor = (d: Decision) => d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";

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

      {/* ── SYSTEM LAYER ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        {mode === "system" && (
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>

            {/* Hero */}
            <section className="bg-ink text-paper pt-14 pb-4 md:pt-20 md:pb-6">
              <div className="mx-auto max-w-[960px] px-6 md:px-10">
                <h1 className="font-display text-4xl md:text-6xl leading-[0.92] font-bold max-w-lg">
                  One system.<br />
                  <span className="italic font-light text-signal">Every decision.</span>
                </h1>
                <p className="mt-4 text-sm text-paper/25 max-w-sm">Signal, culture, audience, capital. Connected. Continuous.</p>
              </div>
            </section>

            {/* System map — the hero */}
            <section className="mx-auto max-w-[960px] px-6 md:px-10 pt-8 md:pt-12">
              <SystemMap
                activeDecision={cycling.showing ? cycling.decision : null}
                converging={cycling.converging}
              />
            </section>

            {/* System statements */}
            <section className="mx-auto max-w-[960px] px-6 md:px-10 py-10 md:py-14">
              <div className="max-w-md mx-auto space-y-6">
                {[
                  "The system reads signal, culture, and audience.",
                  "It decides what to do.",
                  "It deploys capital automatically.",
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 }}
                    className="text-center text-sm text-ink/40 font-mono"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </section>

            {/* CTA → campaign demo */}
            <section className="mx-auto max-w-[960px] px-6 md:px-10 pb-16 md:pb-24">
              <div className="border-t border-ink/6 pt-8 text-center">
                <p className="text-xs text-ink/20 mb-5 font-mono">See the system run a campaign</p>
                <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.label}
                      onClick={() => launch(sc.input)}
                      className="group w-full text-left rounded-xl border border-ink/10 hover:border-ink/25 px-5 py-3.5 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{sc.label}</div>
                        <div className="text-xs text-ink/25 mt-0.5">{sc.sub}</div>
                      </div>
                      <span className="text-ink/12 group-hover:text-signal transition-colors text-sm">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── BOOT ────────────────────────────────────── */}
        {mode === "boot" && (
          <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mx-auto max-w-[960px] px-6 md:px-10">
            <div className="max-w-xs py-24 md:py-32">
              {BOOT.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -5 }} animate={bootIdx >= i ? { opacity: i === bootIdx ? 1 : 0.15, x: 0 } : { opacity: 0, x: -5 }} transition={{ duration: 0.2 }} className="font-mono text-sm mb-2">
                  <span className="text-ink/15 mr-2">{bootIdx > i ? "✓" : bootIdx === i ? "›" : " "}</span>
                  <span className={bootIdx === i ? "text-ink" : "text-ink/20"}>{line}</span>
                </motion.div>
              ))}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: (bootIdx + 1) / BOOT.length }} transition={{ duration: 0.25 }} className="h-px bg-ink/12 mt-5 origin-left" />
            </div>
          </motion.div>
        )}

        {/* ── CONVERGE ────────────────────────────────── */}
        {mode === "converge" && output && (
          <motion.div key="converge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-[960px] px-6 md:px-10 py-12 md:py-20">
            <SystemMap activeDecision={output.decision} converging={true} />
          </motion.div>
        )}

        {/* ── RESULT ──────────────────────────────────── */}
        {mode === "result" && output && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mx-auto max-w-[960px] px-6 md:px-10">

            {/* Compact system map — still alive */}
            <div className="pt-8 md:pt-12 max-w-[480px] mx-auto">
              <SystemMap activeDecision={output.decision} converging={false} />
            </div>

            {/* Decision card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="max-w-md mx-auto mt-6 rounded-xl bg-ink text-paper p-6"
            >
              <div className="flex items-end justify-between gap-4 mb-2">
                <div className="font-display font-bold text-4xl md:text-5xl leading-none flex items-center gap-2">
                  <span className={decisionColor(output.decision)}>→</span>{output.decision}
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-paper/25">{output.confidence}%</span>
                  <span className={output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"}>{output.risk}</span>
                </div>
              </div>
              <p className="text-paper/30 text-sm font-mono">{output.deployment}</p>
            </motion.div>

            {/* Outcome */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="max-w-md mx-auto mt-4 text-center"
            >
              <p className="text-xs text-ink/20 font-mono">{output.outcome}</p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-3 mt-8 pb-16"
            >
              <button onClick={reset} className="group inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-4 py-2 text-xs font-medium hover:bg-ink hover:text-paper transition-colors">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to system
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
