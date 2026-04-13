"use client";

import { useState, useCallback, useEffect } from "react";
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

/* ─── Engine ────────────────────────────────────────────── */

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
  { id: "signal", label: "Signal Monitor", angle: -90, idx: 0 },
  { id: "culture", label: "Cultural Intelligence", angle: -18, idx: 1 },
  { id: "spend", label: "Spend Engine", angle: 54, idx: 2 },
  { id: "youtube", label: "YouTube Coach", angle: 126, idx: 3 },
  { id: "lens", label: "Artist & Track Lens", angle: 198, idx: 4 },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

/* ─── System loop phases ───────────────────────────────── */

type Phase = "idle" | "signal_fire" | "culture_fire" | "converge" | "decide" | "downstream" | "settle";

interface LoopState {
  phase: Phase;
  decision: Decision;
  confidence: number;
  activeNodes: ModuleId[];
  downstream: ModuleId | null;
}

const DECISIONS: Decision[] = ["PUSH", "TEST", "HOLD"];
const CONF_BASE: Record<Decision, number> = { PUSH: 84, TEST: 70, HOLD: 62 };

function useSystemLoop(): LoopState {
  const [state, setState] = useState<LoopState>({
    phase: "idle", decision: "PUSH", confidence: 84, activeNodes: [], downstream: null,
  });

  useEffect(() => {
    let mounted = true;
    let idx = 0;

    function run() {
      if (!mounted) return;
      const dec = DECISIONS[idx % DECISIONS.length];
      const conf = CONF_BASE[dec] + Math.floor(Math.random() * 5) - 2; // slight jitter

      // idle
      setState({ phase: "idle", decision: dec, confidence: conf, activeNodes: [], downstream: null });

      const t1 = setTimeout(() => {
        if (!mounted) return;
        // Signal fires
        setState({ phase: "signal_fire", decision: dec, confidence: conf, activeNodes: ["signal"], downstream: null });
      }, 1800);

      const t2 = setTimeout(() => {
        if (!mounted) return;
        // Culture fires (stronger)
        setState({ phase: "culture_fire", decision: dec, confidence: conf, activeNodes: ["signal", "culture", "lens"], downstream: null });
      }, 3200);

      const t3 = setTimeout(() => {
        if (!mounted) return;
        // Converge — all modules
        setState({ phase: "converge", decision: dec, confidence: conf, activeNodes: ["signal", "culture", "spend", "youtube", "lens"], downstream: null });
      }, 4600);

      const t4 = setTimeout(() => {
        if (!mounted) return;
        // Decision
        setState({ phase: "decide", decision: dec, confidence: conf, activeNodes: ["signal", "culture", "spend", "youtube", "lens"], downstream: null });
      }, 5800);

      const t5 = setTimeout(() => {
        if (!mounted) return;
        // Downstream — spend reacts
        const ds: ModuleId | null = dec === "PUSH" ? "spend" : dec === "TEST" ? "spend" : null;
        setState({ phase: "downstream", decision: dec, confidence: conf, activeNodes: ds ? [ds] : [], downstream: ds });
      }, 7200);

      const t6 = setTimeout(() => {
        if (!mounted) return;
        // Settle
        setState({ phase: "settle", decision: dec, confidence: conf, activeNodes: [], downstream: null });
      }, 8600);

      const t7 = setTimeout(() => {
        if (!mounted) return;
        idx++;
        run();
      }, 10000);

      return [t1, t2, t3, t4, t5, t6, t7];
    }

    const timers = run();
    return () => {
      mounted = false;
      if (timers) timers.forEach(clearTimeout);
    };
  }, []);

  return state;
}

/* ─── Hero System Map ──────────────────────────────────── */

function SystemMap({ state, compact }: { state: LoopState; compact?: boolean }) {
  const CX = 400, CY = compact ? 180 : 280, R = compact ? 130 : 220;
  const VH = compact ? 360 : 560;
  const VW = 800;
  const decColor = state.decision === "PUSH" ? "#FF4A1C" : state.decision === "TEST" ? "#FFD24C" : "#2C25FF";
  const isDeciding = state.phase === "decide";
  const isConverging = state.phase === "converge" || isDeciding;
  const isDownstream = state.phase === "downstream";

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className={`w-full ${compact ? "max-w-[600px]" : "max-w-[1040px]"} mx-auto`} preserveAspectRatio="xMidYMid meet">

      {/* Connection lines */}
      {MODULES.map((mod) => {
        const rad = (mod.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        const active = state.activeNodes.includes(mod.id);
        const isDs = state.downstream === mod.id;
        return (
          <line
            key={`c-${mod.id}`}
            x1={mx} y1={my} x2={CX} y2={CY}
            stroke={active || isDs ? decColor : "#0E0E0E"}
            strokeWidth={active ? 1.5 : isDs ? 2 : 0.6}
            opacity={active ? 0.35 : isDs ? 0.5 : 0.06}
            style={{ transition: "all 0.6s ease" }}
          />
        );
      })}

      {/* Inward signal dots — ambient, always on */}
      {MODULES.map((mod) => {
        const rad = (mod.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        const active = state.activeNodes.includes(mod.id);
        // Signal module has faster ambient rhythm
        const baseDur = mod.id === "signal" ? "2.5s" : mod.id === "culture" ? "4s" : "3.5s";
        return (
          <circle key={`sig-${mod.id}`} r={active ? 2.5 : 1.5} fill={active ? decColor : "#0E0E0E"} opacity={active ? 0.4 : 0.08}>
            <animateMotion
              dur={isConverging ? "0.7s" : baseDur}
              repeatCount="indefinite"
              begin={`${mod.idx * 0.5}s`}
              path={`M${mx - CX},${my - CY} L0,0`}
            />
          </circle>
        );
      })}

      {/* Downstream pulse — flows OUT from center to spend */}
      {isDownstream && state.downstream && (() => {
        const ds = MODULES.find((m) => m.id === state.downstream);
        if (!ds) return null;
        const rad = (ds.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        return (
          <circle r={3.5} fill={decColor} opacity={0.6}>
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={`M0,0 L${mx - CX},${my - CY}`}
            />
          </circle>
        );
      })()}

      {/* Module nodes */}
      {MODULES.map((mod) => {
        const rad = (mod.angle * Math.PI) / 180;
        const mx = CX + Math.cos(rad) * R;
        const my = CY + Math.sin(rad) * R;
        const below = mod.angle > 0 && mod.angle < 180;
        const active = state.activeNodes.includes(mod.id);
        const isDs = state.downstream === mod.id;
        const lit = active || isDs;
        return (
          <g key={mod.id}>
            {/* Pulse ring — only when active */}
            {lit && (
              <circle cx={mx} cy={my} r={8} fill="none" stroke={decColor} strokeWidth={0.75} opacity={0}>
                <animate attributeName="r" values={`8;${isDs ? 24 : 18};8`} dur={isDs ? "1.8s" : `${2.2 + mod.idx * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values={`${isDs ? 0.2 : 0.08};0;${isDs ? 0.2 : 0.08}`} dur={isDs ? "1.8s" : `${2.2 + mod.idx * 0.2}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={mx} cy={my}
              r={isDs ? 12 : lit ? 9 : 6}
              fill={lit ? decColor : "#0E0E0E"}
              opacity={isDs ? 0.8 : lit ? 0.6 : 0.2}
              style={{ transition: "all 0.4s ease" }}
            />
            <text
              x={mx}
              y={my + (below ? (compact ? 22 : 28) : (compact ? -16 : -20))}
              textAnchor="middle"
              className={`${compact ? "text-[10px]" : "text-[13px]"} font-mono font-medium`}
              fill={lit ? decColor : "#0E0E0E"}
              opacity={lit ? 0.65 : 0.4}
              style={{ transition: "all 0.4s ease" }}
            >
              {mod.label}
            </text>
          </g>
        );
      })}

      {/* Center node — the most prominent element */}
      <circle
        cx={CX} cy={CY}
        r={isDeciding ? (compact ? 38 : 52) : isConverging ? (compact ? 32 : 42) : (compact ? 26 : 34)}
        fill={isDeciding || isDownstream ? decColor : "#0E0E0E"}
        opacity={isDeciding ? 0.95 : isDownstream ? 0.85 : 0.55}
        style={{ transition: "all 0.5s ease" }}
      >
        {!isDeciding && !isDownstream && (
          <animate attributeName="r" values={compact ? "26;29;26" : "34;38;34"} dur="3s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Decision text in center */}
      {(isDeciding || isDownstream) && (
        <text x={CX} y={CY + (compact ? 7 : 10)} textAnchor="middle" className={`${compact ? "text-[17px]" : "text-[24px]"} font-mono font-bold tracking-tight`} fill="#FAF7F2">
          {state.decision}
        </text>
      )}

      {/* Confidence — subtle, below center when deciding */}
      {isDeciding && !compact && (
        <text x={CX} y={CY + 76} textAnchor="middle" className="text-[11px] font-mono" fill="#0E0E0E" opacity={0.25}>
          {state.confidence}% confidence
        </text>
      )}
    </svg>
  );
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
  const loop = useSystemLoop();

  /* Fixed loop state for converge/result modes */
  const fixedState: LoopState = output ? {
    phase: mode === "converge" ? "converge" : "decide",
    decision: output.decision,
    confidence: output.confidence,
    activeNodes: mode === "converge"
      ? ["signal", "culture", "spend", "youtube", "lens"]
      : output.decision !== "HOLD" ? ["spend"] : [],
    downstream: mode === "result" && output.decision !== "HOLD" ? "spend" : null,
  } : loop;

  const launch = useCallback((inp: CampaignInput) => {
    setOutput(generate(inp));
    setMode("boot");
    setBootIdx(0);
  }, []);

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

  useEffect(() => {
    if (mode !== "converge") return;
    const t = setTimeout(() => setMode("result"), 2200);
    return () => clearTimeout(t);
  }, [mode]);

  const reset = useCallback(() => { setMode("system"); setOutput(null); setBootIdx(0); }, []);
  const decClr = (d: Decision) => d === "PUSH" ? "text-signal" : d === "TEST" ? "text-sun" : "text-electric";

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

      <AnimatePresence mode="wait">
        {/* ── SYSTEM LAYER ────────────────────────────── */}
        {mode === "system" && (
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>

            <section className="bg-ink text-paper pt-12 pb-32 md:pt-16 md:pb-44 relative">
              <div className="mx-auto max-w-[1120px] px-6 md:px-10">
                <h1 className="font-display text-4xl md:text-6xl leading-[0.92] font-bold max-w-lg">
                  One system.<br />
                  <span className="italic font-light text-signal">Every decision.</span>
                </h1>
                <p className="mt-3 text-sm text-paper/25 max-w-sm">Signal, culture, audience, capital. Connected. Continuous.</p>
              </div>
            </section>

            {/* System map — overlaps hero, dominant */}
            <section className="mx-auto max-w-[1120px] px-4 md:px-8 -mt-28 md:-mt-40 relative z-10">
              <SystemMap state={loop} />
            </section>

            <section className="mx-auto max-w-[960px] px-6 md:px-10 py-10 md:py-14">
              <div className="max-w-md mx-auto space-y-6">
                {[
                  "The system reads signal, culture, and audience.",
                  "It updates continuously.",
                  "It decides what to do.",
                  "It deploys capital automatically.",
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                    className="text-center text-sm text-ink/35 font-mono"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </section>

            <section className="mx-auto max-w-[960px] px-6 md:px-10 pb-16 md:pb-24">
              <div className="border-t border-ink/6 pt-8 text-center">
                <p className="text-xs text-ink/18 mb-5 font-mono">See the system run a campaign</p>
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
            <SystemMap state={fixedState} />
          </motion.div>
        )}

        {/* ── RESULT ──────────────────────────────────── */}
        {mode === "result" && output && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mx-auto max-w-[960px] px-6 md:px-10">

            <div className="pt-8 md:pt-12 max-w-[480px] mx-auto">
              <SystemMap state={fixedState} compact />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="max-w-md mx-auto mt-6 rounded-xl bg-ink text-paper p-6"
            >
              <div className="flex items-end justify-between gap-4 mb-2">
                <div className="font-display font-bold text-4xl md:text-5xl leading-none flex items-center gap-2">
                  <span className={decClr(output.decision)}>→</span>{output.decision}
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-paper/25">{output.confidence}%</span>
                  <span className={output.risk === "Low" ? "text-mint" : output.risk === "Medium" ? "text-sun" : "text-signal"}>{output.risk}</span>
                </div>
              </div>
              <p className="text-paper/30 text-sm font-mono">{output.deployment}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="max-w-md mx-auto mt-4 text-center"
            >
              <p className="text-xs text-ink/20 font-mono">{output.outcome}</p>
            </motion.div>

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
