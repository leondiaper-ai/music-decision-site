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
/* Asymmetric positions relative to center (CX=400, CY=280 in 800x560 viewBox) */

type ModuleId = "signal" | "culture" | "spend" | "youtube" | "lens";

interface ModuleDef {
  id: ModuleId;
  label: string;
  x: number;   // card center
  y: number;
  w: number;
  h: number;
  idx: number;
  curveBias: number; // controls curve direction for connection path
}

const MODULES: ModuleDef[] = [
  { id: "signal",  label: "Signal Monitor",       x: 180, y: 90,  w: 150, h: 58, idx: 0, curveBias: -1 },
  { id: "culture", label: "Cultural Intelligence", x: 640, y: 130, w: 170, h: 58, idx: 1, curveBias:  1 },
  { id: "lens",    label: "Artist & Track Lens",  x: 90,  y: 310, w: 150, h: 58, idx: 2, curveBias: -1 },
  { id: "spend",   label: "Spend Engine",         x: 680, y: 380, w: 140, h: 58, idx: 3, curveBias:  1 },
  { id: "youtube", label: "YouTube Coach",        x: 250, y: 490, w: 150, h: 58, idx: 4, curveBias: -1 },
];

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

/* ─── Module Glyphs ────────────────────────────────────── */

function Glyph({ id, cx, cy, color, active }: { id: ModuleId; cx: number; cy: number; color: string; active: boolean }) {
  const stroke = active ? color : "#0E0E0E";
  const op = active ? 0.85 : 0.4;

  if (id === "signal") {
    // Sparkline waveform
    const pts = "0,6 6,2 12,4 18,1 24,5 30,0 36,3 42,-1";
    return (
      <g transform={`translate(${cx - 21}, ${cy})`} opacity={op} style={{ transition: "opacity 0.4s ease" }}>
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.25} strokeLinejoin="round" strokeLinecap="round">
          {active && <animate attributeName="points" values={`${pts};0,4 6,1 12,6 18,2 24,4 30,-1 36,5 42,1;${pts}`} dur="1.2s" repeatCount="indefinite" />}
        </polyline>
      </g>
    );
  }

  if (id === "culture") {
    // Cluster of small dots — loose constellation
    const dots = [
      { x: -18, y: -4, r: 1.8 },
      { x: -10, y: 3,  r: 2.2 },
      { x: -2,  y: -5, r: 1.6 },
      { x: 5,   y: 2,  r: 2.5 },
      { x: 12,  y: -3, r: 1.4 },
      { x: 18,  y: 4,  r: 2 },
      { x: 0,   y: 6,  r: 1.2 },
    ];
    return (
      <g transform={`translate(${cx}, ${cy})`} style={{ transition: "opacity 0.4s ease" }}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={stroke} opacity={op * (0.6 + (i % 3) * 0.15)}>
            {active && <animate attributeName="opacity" values={`${op * 0.4};${op};${op * 0.4}`} dur={`${1.5 + i * 0.15}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>
    );
  }

  if (id === "spend") {
    // Three horizontal bars — capital allocation
    const bars = [
      { y: -6, w: 32 },
      { y: 0,  w: 24 },
      { y: 6,  w: 18 },
    ];
    return (
      <g transform={`translate(${cx - 16}, ${cy})`} opacity={op} style={{ transition: "opacity 0.4s ease" }}>
        {bars.map((b, i) => (
          <rect key={i} x={0} y={b.y - 1.5} width={b.w} height={3} rx={1.5} fill={stroke}>
            {active && <animate attributeName="width" values={`${b.w * 0.7};${b.w};${b.w * 0.7}`} dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
          </rect>
        ))}
      </g>
    );
  }

  if (id === "youtube") {
    // Feed / list
    return (
      <g transform={`translate(${cx - 18}, ${cy})`} opacity={op} style={{ transition: "opacity 0.4s ease" }}>
        {[-6, 0, 6].map((y, i) => (
          <g key={i}>
            <circle cx={2} cy={y} r={1.8} fill={stroke} opacity={0.7} />
            <rect x={8} y={y - 1} width={26} height={2} rx={1} fill={stroke} opacity={0.5} />
          </g>
        ))}
      </g>
    );
  }

  // lens — concentric circles + crosshair
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={op} style={{ transition: "opacity 0.4s ease" }}>
      <circle cx={0} cy={0} r={9} fill="none" stroke={stroke} strokeWidth={0.75} opacity={0.5} />
      <circle cx={0} cy={0} r={5} fill="none" stroke={stroke} strokeWidth={0.75} opacity={0.75} />
      <circle cx={0} cy={0} r={1.5} fill={stroke} />
      <line x1={-13} y1={0} x2={-10} y2={0} stroke={stroke} strokeWidth={0.75} />
      <line x1={10}  y1={0} x2={13}  y2={0} stroke={stroke} strokeWidth={0.75} />
      <line x1={0} y1={-13} x2={0} y2={-10} stroke={stroke} strokeWidth={0.75} />
      <line x1={0} y1={10}  x2={0} y2={13}  stroke={stroke} strokeWidth={0.75} />
    </g>
  );
}

/* ─── Curved connection path helpers ─────────────────── */

function buildCurvedPath(mx: number, my: number, cx: number, cy: number, bias: number): string {
  const midX = (mx + cx) / 2;
  const midY = (my + cy) / 2;
  // perpendicular offset for organic curve
  const dx = cx - mx;
  const dy = cy - my;
  const len = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / len) * 40 * bias;
  const perpY = (dx / len) * 40 * bias;
  return `M${mx},${my} Q${midX + perpX},${midY + perpY} ${cx},${cy}`;
}

/* ─── Hero System Map ──────────────────────────────────── */

function SystemMap({ state, compact }: { state: LoopState; compact?: boolean }) {
  const VW = 800;
  const VH = compact ? 420 : 600;
  const scale = compact ? 0.72 : 1;
  const CX = 400;
  const CY = compact ? 210 : 300;
  const decColor = state.decision === "PUSH" ? "#FF4A1C" : state.decision === "TEST" ? "#FFD24C" : "#2C25FF";
  const isDeciding = state.phase === "decide";
  const isConverging = state.phase === "converge" || isDeciding;
  const isDownstream = state.phase === "downstream";

  // Module positions relative to center (with scale applied, centered on CY)
  const mods = MODULES.map((mod) => {
    const sx = CX + (mod.x - 400) * scale;
    const sy = CY + (mod.y - 280) * scale;
    return { ...mod, sx, sy, sw: mod.w * scale, sh: mod.h * scale };
  });

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className={`w-full ${compact ? "max-w-[680px]" : "max-w-[1100px]"} mx-auto`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.12" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connection curves (behind everything) */}
      {mods.map((mod) => {
        const active = state.activeNodes.includes(mod.id);
        const isDs = state.downstream === mod.id;
        const lit = active || isDs;
        const path = buildCurvedPath(mod.sx, mod.sy, CX, CY, mod.curveBias);
        return (
          <g key={`conn-${mod.id}`}>
            {/* Base path — subtle always-on */}
            <path
              d={path}
              fill="none"
              stroke={lit ? decColor : "#0E0E0E"}
              strokeWidth={lit ? 1.5 : 0.75}
              opacity={lit ? 0.35 : 0.08}
              strokeLinecap="round"
              style={{ transition: "all 0.6s ease" }}
            />
            {/* Animated dashed flow when active */}
            {lit && (
              <path
                d={path}
                fill="none"
                stroke={decColor}
                strokeWidth={2}
                strokeDasharray="4 10"
                opacity={0.5}
                strokeLinecap="round"
              >
                <animate attributeName="stroke-dashoffset" from="0" to={isDs ? "28" : "-28"} dur="1.4s" repeatCount="indefinite" />
              </path>
            )}
          </g>
        );
      })}

      {/* Inward signal particles — ambient */}
      {mods.map((mod) => {
        const active = state.activeNodes.includes(mod.id);
        const isDs = state.downstream === mod.id;
        if (isDs) return null; // downstream handled separately
        const path = buildCurvedPath(mod.sx, mod.sy, CX, CY, mod.curveBias);
        const baseDur = mod.id === "signal" ? "2.2s" : mod.id === "culture" ? "3.8s" : "3.2s";
        return (
          <circle key={`sig-${mod.id}`} r={active ? 3 : 1.8} fill={active ? decColor : "#0E0E0E"} opacity={active ? 0.55 : 0.18}>
            <animateMotion
              dur={isConverging ? "0.8s" : baseDur}
              repeatCount="indefinite"
              begin={`${mod.idx * 0.45}s`}
              path={path}
            />
          </circle>
        );
      })}

      {/* Downstream flow — outward from center to spend */}
      {isDownstream && state.downstream && (() => {
        const ds = mods.find((m) => m.id === state.downstream);
        if (!ds) return null;
        const path = `M${CX},${CY} Q${(CX + ds.sx) / 2 + 30},${(CY + ds.sy) / 2 - 20} ${ds.sx},${ds.sy}`;
        return (
          <>
            <circle r={4} fill={decColor} opacity={0.7}>
              <animateMotion dur="1.1s" repeatCount="indefinite" path={path} />
            </circle>
            <circle r={2.5} fill={decColor} opacity={0.5}>
              <animateMotion dur="1.1s" begin="0.4s" repeatCount="indefinite" path={path} />
            </circle>
          </>
        );
      })()}

      {/* External input particles — entering signal & culture periodically */}
      {[
        { target: "signal",  delay: 0 },
        { target: "culture", delay: 2.2 },
        { target: "signal",  delay: 4 },
        { target: "culture", delay: 6 },
      ].map((inp, i) => {
        const m = mods.find((mm) => mm.id === inp.target);
        if (!m) return null;
        // particle comes from just outside the viewBox edge
        const fromX = m.sy < CY ? m.sx + 40 : m.sx - 40;
        const fromY = m.sy < CY ? -20 : VH + 20;
        return (
          <circle key={`inp-${i}`} r={1.5} fill="#0E0E0E" opacity={0}>
            <animate attributeName="opacity" values="0;0.4;0" dur="2s" begin={`${inp.delay}s`} repeatCount="indefinite" />
            <animateMotion
              dur="2s"
              begin={`${inp.delay}s`}
              repeatCount="indefinite"
              path={`M${fromX},${fromY} L${m.sx},${m.sy}`}
            />
          </circle>
        );
      })}

      {/* Module cards */}
      {mods.map((mod) => {
        const active = state.activeNodes.includes(mod.id);
        const isDs = state.downstream === mod.id;
        const lit = active || isDs;
        const cardX = mod.sx - mod.sw / 2;
        const cardY = mod.sy - mod.sh / 2;
        return (
          <g key={mod.id} style={{ transition: "opacity 0.4s ease" }}>
            {/* Shadow layer */}
            <rect
              x={cardX + 2} y={cardY + 3}
              width={mod.sw} height={mod.sh}
              rx={10}
              fill="#0E0E0E"
              opacity={0.08}
            />
            {/* Card background */}
            <rect
              x={cardX} y={cardY}
              width={mod.sw} height={mod.sh}
              rx={10}
              fill="#FAF7F2"
              stroke={lit ? decColor : "#0E0E0E"}
              strokeOpacity={lit ? 0.5 : 0.12}
              strokeWidth={lit ? 1.5 : 1}
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Inner active tint */}
            {lit && (
              <rect
                x={cardX} y={cardY}
                width={mod.sw} height={mod.sh}
                rx={10}
                fill={decColor}
                opacity={0.05}
              />
            )}
            {/* Pulse ring */}
            {lit && (
              <rect
                x={cardX - 4} y={cardY - 4}
                width={mod.sw + 8} height={mod.sh + 8}
                rx={14}
                fill="none"
                stroke={decColor}
                strokeWidth={1}
                opacity={0}
              >
                <animate attributeName="opacity" values={isDs ? "0.25;0;0.25" : "0.15;0;0.15"} dur={isDs ? "1.6s" : "2.4s"} repeatCount="indefinite" />
                <animate attributeName="x" values={`${cardX - 4};${cardX - 10};${cardX - 4}`} dur={isDs ? "1.6s" : "2.4s"} repeatCount="indefinite" />
                <animate attributeName="y" values={`${cardY - 4};${cardY - 10};${cardY - 4}`} dur={isDs ? "1.6s" : "2.4s"} repeatCount="indefinite" />
                <animate attributeName="width" values={`${mod.sw + 8};${mod.sw + 20};${mod.sw + 8}`} dur={isDs ? "1.6s" : "2.4s"} repeatCount="indefinite" />
                <animate attributeName="height" values={`${mod.sh + 8};${mod.sh + 20};${mod.sh + 8}`} dur={isDs ? "1.6s" : "2.4s"} repeatCount="indefinite" />
              </rect>
            )}
            {/* Glyph */}
            <Glyph id={mod.id} cx={cardX + 26 * scale} cy={mod.sy} color={decColor} active={lit} />
            {/* Label */}
            <text
              x={cardX + 52 * scale}
              y={mod.sy + 4}
              className={`${compact ? "text-[10px]" : "text-[12px]"} font-mono font-medium`}
              fill={lit ? decColor : "#0E0E0E"}
              opacity={lit ? 0.85 : 0.55}
              style={{ transition: "all 0.4s ease" }}
            >
              {mod.label}
            </text>
          </g>
        );
      })}

      {/* Decision rings — radiate outward from center on decide */}
      {isDeciding && [0, 1, 2].map((i) => (
        <circle key={`ring-${i}`} cx={CX} cy={CY} r={50} fill="none" stroke={decColor} strokeWidth={1.5} opacity={0}>
          <animate attributeName="r" from="50" to={compact ? "110" : "160"} dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Center node — layered shadow + hub */}
      <circle
        cx={CX + 2} cy={CY + 4}
        r={isDeciding ? (compact ? 42 : 58) : (compact ? 30 : 40)}
        fill="#0E0E0E"
        opacity={0.1}
        style={{ transition: "all 0.5s ease" }}
      />
      <circle
        cx={CX} cy={CY}
        r={isDeciding ? (compact ? 40 : 56) : isConverging ? (compact ? 34 : 46) : (compact ? 28 : 38)}
        fill={isDeciding || isDownstream ? decColor : "#0E0E0E"}
        opacity={isDeciding ? 0.95 : isDownstream ? 0.85 : 0.65}
        style={{ transition: "all 0.5s ease" }}
      >
        {!isDeciding && !isDownstream && (
          <animate attributeName="r" values={compact ? "28;31;28" : "38;42;38"} dur="3s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Inner highlight ring for depth */}
      <circle
        cx={CX} cy={CY}
        r={isDeciding ? (compact ? 32 : 44) : (compact ? 22 : 30)}
        fill="none"
        stroke="#FAF7F2"
        strokeWidth={1}
        opacity={0.12}
        style={{ transition: "all 0.5s ease" }}
      />

      {/* Decision text emerging from center */}
      {(isDeciding || isDownstream) && (
        <text
          x={CX} y={CY + (compact ? 8 : 11)}
          textAnchor="middle"
          className={`${compact ? "text-[18px]" : "text-[26px]"} font-mono font-bold tracking-tight`}
          fill="#FAF7F2"
        >
          {state.decision}
        </text>
      )}

      {/* Confidence */}
      {isDeciding && !compact && (
        <text x={CX} y={CY + 82} textAnchor="middle" className="text-[11px] font-mono" fill="#0E0E0E" opacity={0.3}>
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
