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

function SystemMap({ state, compact, displayConfidence, mode, output }: {
  state: LoopState;
  compact?: boolean;
  displayConfidence: number;
  mode: "ambient" | "evaluating" | "resolved";
  output?: SystemOutput | null;
}) {
  const VW = 800;
  const VH = compact ? 420 : 600;
  const scale = compact ? 0.72 : 1;
  const CX = 400;
  const CY = compact ? 210 : 300;
  const decColor = state.decision === "PUSH" ? "#FF4A1C" : state.decision === "TEST" ? "#FFD24C" : "#2C25FF";
  const isDeciding = state.phase === "decide";
  const isConverging = state.phase === "converge" || isDeciding;
  const isDownstream = state.phase === "downstream";
  const isResolved = mode === "resolved";
  const isEvaluating = mode === "evaluating";
  // Decision is "locked in" when loop has reached decide phase OR we're in resolved
  const decisionLocked = isDeciding || isDownstream || isResolved;
  // During evaluating, before lock, show "..."
  const showEvaluatingMark = isEvaluating && !decisionLocked;

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
      {isDeciding && !isResolved && [0, 1, 2].map((i) => (
        <circle key={`ring-${i}`} cx={CX} cy={CY} r={50} fill="none" stroke={decColor} strokeWidth={1.5} opacity={0}>
          <animate attributeName="r" from="50" to={compact ? "110" : "160"} dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── Center node / expanded detail panel ────────────── */}
      {isResolved && output ? (
        /* Expanded detail panel — center grows to reveal resolution */
        (() => {
          const pw = compact ? 280 : 360;
          const ph = compact ? 140 : 180;
          const px = CX - pw / 2;
          const py = CY - ph / 2;
          return (
            <g>
              {/* Shadow behind panel */}
              <rect x={px + 3} y={py + 6} width={pw} height={ph} rx={14} fill="#0E0E0E" opacity={0.12} />
              {/* Panel body */}
              <rect x={px} y={py} width={pw} height={ph} rx={14} fill="#0E0E0E" />
              {/* Colored edge */}
              <rect x={px} y={py} width={4} height={ph} rx={2} fill={decColor} />
              {/* Decision label */}
              <text x={px + 22} y={py + (compact ? 34 : 42)} className="text-[10px] font-mono uppercase tracking-[0.14em]" fill="#FAF7F2" opacity={0.35}>decision</text>
              <text x={px + 22} y={py + (compact ? 68 : 82)} className={`${compact ? "text-[32px]" : "text-[44px]"} font-display font-bold tracking-tight`} fill={decColor}>
                {output.decision}
              </text>
              {/* Confidence + risk — top right */}
              <text x={px + pw - 22} y={py + (compact ? 34 : 42)} textAnchor="end" className="text-[10px] font-mono uppercase tracking-[0.14em]" fill="#FAF7F2" opacity={0.35}>confidence</text>
              <text x={px + pw - 22} y={py + (compact ? 60 : 72)} textAnchor="end" className={`${compact ? "text-[16px]" : "text-[20px]"} font-mono font-semibold`} fill="#FAF7F2">
                {displayConfidence}%
              </text>
              <text x={px + pw - 22} y={py + (compact ? 78 : 92)} textAnchor="end" className="text-[10px] font-mono" fill={output.risk === "Low" ? "#1FBE7A" : output.risk === "Medium" ? "#FFD24C" : "#FF4A1C"}>
                {output.risk} risk
              </text>
              {/* Divider */}
              <line x1={px + 22} y1={py + (compact ? 88 : 106)} x2={px + pw - 22} y2={py + (compact ? 88 : 106)} stroke="#FAF7F2" strokeOpacity={0.08} />
              {/* Deployment */}
              <text x={px + 22} y={py + (compact ? 104 : 124)} className="text-[9px] font-mono uppercase tracking-[0.14em]" fill="#FAF7F2" opacity={0.35}>capital deployment</text>
              <text x={px + 22} y={py + (compact ? 118 : 140)} className={`${compact ? "text-[11px]" : "text-[12px]"} font-mono`} fill="#FAF7F2" opacity={0.8}>
                {output.deployment}
              </text>
              {/* Outcome */}
              {!compact && (
                <text x={px + 22} y={py + 162} className="text-[11px] font-mono" fill="#FAF7F2" opacity={0.45}>
                  projected · {output.outcome}
                </text>
              )}
            </g>
          );
        })()
      ) : (
        <>
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
            fill={decisionLocked ? decColor : "#0E0E0E"}
            opacity={decisionLocked ? 0.95 : isEvaluating ? 0.75 : 0.65}
            style={{ transition: "all 0.5s ease" }}
          >
            {!decisionLocked && (
              <animate attributeName="r" values={compact ? "28;31;28" : "38;42;38"} dur={isEvaluating ? "1.4s" : "3s"} repeatCount="indefinite" />
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

          {/* Decision text — ALWAYS present, just varies in treatment */}
          {showEvaluatingMark ? (
            <text
              x={CX} y={CY + (compact ? 7 : 10)}
              textAnchor="middle"
              className={`${compact ? "text-[20px]" : "text-[28px]"} font-mono font-bold`}
              fill="#FAF7F2"
              opacity={0.85}
            >
              <tspan>
                •<animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0s" />
              </tspan>
              <tspan dx="3">
                •<animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
              </tspan>
              <tspan dx="3">
                •<animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.6s" />
              </tspan>
            </text>
          ) : (
            <text
              x={CX} y={CY + (compact ? 6 : 8)}
              textAnchor="middle"
              className={`${compact ? "text-[16px]" : "text-[24px]"} font-mono font-bold tracking-tight`}
              fill="#FAF7F2"
              opacity={decisionLocked ? 1 : 0.45}
              style={{ transition: "opacity 0.5s ease" }}
            >
              {state.decision}
            </text>
          )}

          {/* Confidence — ALWAYS visible below decision */}
          <text
            x={CX} y={CY + (compact ? 20 : 28)}
            textAnchor="middle"
            className={`${compact ? "text-[9px]" : "text-[10px]"} font-mono tracking-wide`}
            fill="#FAF7F2"
            opacity={decisionLocked ? 0.55 : 0.35}
            style={{ transition: "opacity 0.5s ease" }}
          >
            {displayConfidence}%
          </text>

          {/* Small evaluating label below node */}
          {isEvaluating && !compact && (
            <text x={CX} y={CY + 78} textAnchor="middle" className="text-[10px] font-mono uppercase tracking-[0.2em]" fill="#0E0E0E" opacity={0.3}>
              evaluating
            </text>
          )}
        </>
      )}
    </svg>
  );
}

/* ─── Live processing feed (synced to loop) ─────────────── */

type FeedTag = "signal" | "culture" | "lens" | "memory" | "decide" | "deploy";
interface FeedEntry { id: number; tag: FeedTag; text: string }

const SIGNAL_TEXTS = [
  "stream velocity +12% · 7d",
  "save rate 5.1% · rising",
  "playlist adds 38 · Spotify editorial",
  "skip rate 18% · below threshold",
];
const CULTURE_TEXTS = [
  "TikTok creator cluster firing · 4.2k",
  "Gen-Z saturation crossing threshold",
  "Discord chatter +28% · scene-adjacent",
  "Reddit sentiment +14% · organic",
];
const LENS_TEXTS = [
  "audience lock · breaking · 340k monthly",
  "artist cohort match · 82% overlap",
  "track fingerprint · uptempo / hook at 0:14",
];
const MEMORY_TEXTS = [
  "similar campaign detected · 14mo ago",
  "prior test→push outcome · +0.6 confidence",
  "historical rollout pattern matched",
  "cohort behaviour · recurring · 3 priors",
  "catalogue precedent · comparable trajectory",
];
const DEPLOY_TEXTS = [
  "capital routing · 40/35/25 split",
  "creator briefs drafted · 12 shortlisted",
  "YouTube coach · 3 formats queued",
];

function useLiveFeed(state: LoopState): FeedEntry[] {
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const lastPhase = useRef<Phase | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    if (lastPhase.current === state.phase) return;
    lastPhase.current = state.phase;
    let entry: FeedEntry | null = null;
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const newId = ++counter.current;

    if (state.phase === "signal_fire") entry = { id: newId, tag: "signal", text: pick(SIGNAL_TEXTS) };
    else if (state.phase === "culture_fire") entry = { id: newId, tag: "culture", text: pick(CULTURE_TEXTS) };
    else if (state.phase === "converge") entry = { id: newId, tag: "lens", text: pick(LENS_TEXTS) };
    else if (state.phase === "decide") entry = { id: newId, tag: "decide", text: `${state.decision} · ${state.confidence}% confidence` };
    else if (state.phase === "downstream") entry = { id: newId, tag: "deploy", text: pick(DEPLOY_TEXTS) };

    // Memory entry — woven in beside converge/decide phases, so the feed reads
    // like the system is referencing what it's seen before.
    let memoryEntry: FeedEntry | null = null;
    if (state.phase === "converge" || state.phase === "decide") {
      memoryEntry = { id: ++counter.current, tag: "memory", text: pick(MEMORY_TEXTS) };
    }

    if (entry || memoryEntry) {
      setFeed((prev) => {
        const next = [...prev];
        if (memoryEntry) next.push(memoryEntry);
        if (entry) next.push(entry);
        return next.slice(-6);
      });
    }
  }, [state.phase, state.decision, state.confidence]);

  return feed;
}

function LiveFeed({ feed, decision }: { feed: FeedEntry[]; decision: Decision }) {
  const decColor = decision === "PUSH" ? "text-signal" : decision === "TEST" ? "text-sun" : "text-electric";
  const tagLabel: Record<FeedTag, string> = {
    signal: "signal", culture: "culture", lens: "lens", memory: "memory", decide: "decide", deploy: "deploy",
  };
  // Always reserve 6 rows to prevent layout shift
  const rows = feed.slice(-6);
  const pad = 6 - rows.length;
  return (
    <div className="font-mono text-[11px] leading-[1.7] text-ink/45">
      {Array.from({ length: pad }).map((_, i) => (
        <div key={`pad-${i}`} className="opacity-0 select-none">—</div>
      ))}
      <AnimatePresence initial={false}>
        {rows.map((e, i) => {
          const ageFromTop = rows.length - 1 - i;
          const opacity = ageFromTop === 0 ? 1 : ageFromTop === 1 ? 0.8 : ageFromTop === 2 ? 0.55 : 0.3;
          const isDecide = e.tag === "decide";
          const isDeploy = e.tag === "deploy";
          const isMemory = e.tag === "memory";
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-baseline gap-3"
            >
              <span className={`w-[54px] shrink-0 ${isMemory ? "text-ink/35 italic" : "text-ink/20"}`}>[{tagLabel[e.tag]}]</span>
              <span className={isDecide ? `${decColor} font-semibold` : isDeploy ? "text-mint" : isMemory ? "text-ink/40 italic" : "text-ink/55"}>
                {isDecide ? "→ " : ""}{e.text}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── Product UI fragments ──────────────────────────────── */

function FragmentVelocity({ active, decision }: { active: boolean; decision: Decision }) {
  const color = decision === "PUSH" ? "#FF4A1C" : decision === "TEST" ? "#FFD24C" : "#2C25FF";
  // 14 points — fake stream velocity sparkline
  const pts = "0,22 8,20 16,18 24,17 32,15 40,13 48,12 56,9 64,8 72,6 80,5 88,3 96,2 104,1";
  return (
    <div className="rounded-lg border border-ink/8 bg-paper p-3 w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[10px] text-ink/40">stream velocity · 7d</span>
        <span className="font-mono text-[10px] text-mint">+12%</span>
      </div>
      <svg viewBox="0 0 108 26" className="w-full h-9">
        <polyline points={pts} fill="none" stroke={active ? color : "#0E0E0E"} strokeOpacity={active ? 0.9 : 0.35} strokeWidth={1.25} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={104} cy={1} r={2} fill={active ? color : "#0E0E0E"} opacity={active ? 1 : 0.4}>
          {active && <animate attributeName="r" values="2;3.5;2" dur="1.2s" repeatCount="indefinite" />}
        </circle>
      </svg>
      <div className="mt-1 font-mono text-[10px] text-ink/30">342,118 daily · est.</div>
    </div>
  );
}

function FragmentAudience({ active }: { active: boolean }) {
  const rows = [
    { label: "LA · 18-24", w: 72 },
    { label: "NY · 18-24", w: 56 },
    { label: "London · 25-34", w: 44 },
    { label: "Berlin · 18-24", w: 32 },
  ];
  return (
    <div className="rounded-lg border border-ink/8 bg-paper p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-ink/40">audience lock · top markets</span>
        <span className={`font-mono text-[10px] ${active ? "text-mint" : "text-ink/25"}`}>● live</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-ink/45 w-[110px] shrink-0">{r.label}</span>
            <div className="flex-1 h-1.5 bg-ink/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.w}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full bg-ink/60"
                style={active ? { background: "#1FBE7A" } : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FragmentSpend({ decision, active }: { decision: Decision; active: boolean }) {
  const color = decision === "PUSH" ? "#FF4A1C" : decision === "TEST" ? "#FFD24C" : "#2C25FF";
  const rows = decision === "PUSH"
    ? [{ label: "paid",     pct: 40 }, { label: "content",  pct: 35 }, { label: "creators", pct: 25 }]
    : decision === "TEST"
    ? [{ label: "testing",  pct: 40 }, { label: "held",     pct: 60 }, { label: "creators", pct: 0  }]
    : [{ label: "preserved",pct: 100 }, { label: "—",       pct: 0  }, { label: "—",        pct: 0  }];
  return (
    <div className="rounded-lg border border-ink/8 bg-paper p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-ink/40">spend engine · allocation</span>
        <span className="font-mono text-[10px] font-semibold" style={{ color: active ? color : "#0E0E0E44" }}>{decision}</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-ink/45 w-[60px] shrink-0">{r.label}</span>
            <div className="flex-1 h-1.5 bg-ink/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${r.pct}%` }}
                transition={{ duration: 0.6 }}
                className="h-full"
                style={{ background: active ? color : "#0E0E0E", opacity: active ? 0.9 : 0.4 }}
              />
            </div>
            <span className="font-mono text-[10px] text-ink/35 w-[28px] text-right">{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Artist & Track Lens — reasoning context ───────────── */

interface LensData {
  artistLabel: string;
  cohortMatch: number;        // 0-100
  catalogueDepth: string;     // e.g. "4 releases · 18mo"
  trackFingerprint: string;   // e.g. "uptempo · hook @ 0:14"
  reasoning: string;          // the why
}

const AMBIENT_LENS: LensData = {
  artistLabel: "ambient cohort",
  cohortMatch: 74,
  catalogueDepth: "mixed pool · rolling",
  trackFingerprint: "genre-agnostic",
  reasoning: "baseline catalogue intelligence",
};

function FragmentLens({ active, data }: { active: boolean; data: LensData }) {
  return (
    <div className="rounded-lg border border-ink/8 bg-paper p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-ink/40">artist & track lens</span>
        <span className={`font-mono text-[10px] ${active ? "text-ink/55" : "text-ink/25"}`}>
          ◎ upstream
        </span>
      </div>
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <svg viewBox="0 0 28 28" className="w-7 h-7">
            <circle cx={14} cy={14} r={12} fill="none" stroke={active ? "#0E0E0E" : "#0E0E0E"} strokeOpacity={active ? 0.3 : 0.15} strokeWidth={1} />
            <circle cx={14} cy={14} r={7}  fill="none" stroke={active ? "#0E0E0E" : "#0E0E0E"} strokeOpacity={active ? 0.55 : 0.2} strokeWidth={1} />
            <circle cx={14} cy={14} r={2}  fill={active ? "#0E0E0E" : "#0E0E0E"} opacity={active ? 0.9 : 0.4}>
              {active && <animate attributeName="r" values="1.8;2.6;1.8" dur="1.5s" repeatCount="indefinite" />}
            </circle>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[11px] text-ink/70 font-medium truncate">{data.artistLabel}</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-[3px] bg-ink/6 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${data.cohortMatch}%` }}
                transition={{ duration: 0.7 }}
                className="h-full bg-ink/55"
              />
            </div>
            <span className="font-mono text-[10px] text-ink/45 shrink-0">{data.cohortMatch}% match</span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] text-ink/35 leading-[1.4]">
            {data.catalogueDepth} · {data.trackFingerprint}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink/45 italic leading-[1.4]">
            <span className="text-ink/25">// </span>{data.reasoning}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── YouTube Coach — execution layer ───────────────────── */

interface YoutubeAction { format: string; detail: string; status: "queued" | "running" | "drafted" }

function FragmentYouTube({ active, decision }: { active: boolean; decision: Decision }) {
  const color = decision === "PUSH" ? "#FF4A1C" : decision === "TEST" ? "#FFD24C" : "#2C25FF";
  const actions: YoutubeAction[] = decision === "PUSH"
    ? [
        { format: "Shorts", detail: "hook-first cut · 0:14", status: "running" },
        { format: "Canvas", detail: "loop · 15s vertical", status: "queued" },
        { format: "Creator", detail: "brief · 12 shortlisted", status: "drafted" },
      ]
    : decision === "TEST"
    ? [
        { format: "Shorts", detail: "A/B hook test · 2 cuts", status: "queued" },
        { format: "Canvas", detail: "holding · pending signal", status: "queued" },
      ]
    : [
        { format: "—", detail: "no execution queued", status: "queued" },
      ];

  const statusColor = (s: YoutubeAction["status"]) =>
    s === "running" ? color : s === "drafted" ? "#1FBE7A" : "#0E0E0E66";

  return (
    <div className="rounded-lg border border-ink/8 bg-paper p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-ink/40">youtube coach · content queue</span>
        <span className="font-mono text-[10px]" style={{ color: active ? color : "#0E0E0E44" }}>
          {decision === "HOLD" ? "idle" : `${actions.length} queued`}
        </span>
      </div>
      <div className="space-y-1.5">
        {actions.map((a, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: active ? statusColor(a.status) : "#0E0E0E33" }}
            >
              {active && a.status === "running" && (
                <span className="block w-1.5 h-1.5 rounded-full animate-ping" style={{ background: color, opacity: 0.5 }} />
              )}
            </span>
            <span className="font-mono text-[10.5px] text-ink/65 w-[56px] shrink-0">{a.format}</span>
            <span className="font-mono text-[10px] text-ink/35 flex-1 truncate">{a.detail}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: active ? statusColor(a.status) : "#0E0E0E33" }}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Scenarios ─────────────────────────────────────────── */

interface Scenario {
  situation: string;
  context: string;
  hint: string;
  likelyDecision: Decision;
  input: CampaignInput;
  lens: LensData;
}

const SCENARIOS: Scenario[] = [
  {
    situation: "A breaking artist just spiked.",
    context: "340k monthly · TikTok inflection · $15k available",
    hint: "culture says yes. signal says momentum. decide now.",
    likelyDecision: "PUSH",
    input: { trackName: "Midnight Drive", artistStage: "breaking", budget: 30 },
    lens: {
      artistLabel: "Midnight Drive · breaking",
      cohortMatch: 82,
      catalogueDepth: "3 releases · 9mo",
      trackFingerprint: "uptempo · hook @ 0:14",
      reasoning: "cohort overlaps active scene · TikTok audience primed",
    },
  },
  {
    situation: "A major release drops Friday.",
    context: "2.1M monthly · established catalog · $35k planned",
    hint: "known cohort. capital-heavy. deploy with conviction.",
    likelyDecision: "PUSH",
    input: { trackName: "Cathedral", artistStage: "established", budget: 70 },
    lens: {
      artistLabel: "Cathedral · established",
      cohortMatch: 91,
      catalogueDepth: "11 releases · 6yr",
      trackFingerprint: "mid-tempo · chorus @ 0:42",
      reasoning: "catalogue gravity + known cohort · deploy at scale",
    },
  },
  {
    situation: "An emerging artist caught first traction.",
    context: "12k monthly · early save curve · $3k ceiling",
    hint: "signal is soft. test before you commit capital.",
    likelyDecision: "TEST",
    input: { trackName: "Bedroom Floor", artistStage: "emerging", budget: 5 },
    lens: {
      artistLabel: "Bedroom Floor · emerging",
      cohortMatch: 58,
      catalogueDepth: "1 release · 3mo",
      trackFingerprint: "lo-fi · hook @ 0:28",
      reasoning: "save curve promising · cohort unproven · test narrow",
    },
  },
];

/* ─── Contextual fragment visibility ─────────────────────── */

type FragmentId = "lens" | "velocity" | "audience" | "spend" | "youtube";

function selectFragments(mode: "ambient" | "evaluating" | "resolved", phase: Phase, decision: Decision): FragmentId[] {
  if (mode === "resolved") {
    if (decision === "HOLD") return ["lens", "spend"];
    return ["lens", "spend", "youtube"];
  }
  if (mode === "evaluating") {
    if (phase === "idle" || phase === "signal_fire") return ["lens"];
    if (phase === "culture_fire") return ["lens", "velocity", "audience"];
    if (phase === "converge") return ["velocity", "audience", "spend"];
    if (phase === "decide" || phase === "downstream") {
      return decision === "HOLD" ? ["audience", "spend"] : ["audience", "spend", "youtube"];
    }
    return ["lens", "velocity"];
  }
  // ambient — rotate by phase
  if (phase === "idle" || phase === "signal_fire") return ["lens", "velocity"];
  if (phase === "culture_fire") return ["velocity", "audience"];
  if (phase === "converge") return ["velocity", "audience", "spend"];
  if (phase === "decide") return ["audience", "spend", "youtube"];
  if (phase === "downstream") return ["spend", "youtube"];
  return ["lens", "velocity"];
}

/* ─── Confidence jitter / smoothing hook ────────────────── */

function useConfidenceDisplay(target: number, jitterAmount: number): number {
  const [display, setDisplay] = useState(target);
  const ref = useRef(target);
  const targetRef = useRef(target);
  const jitterRef = useRef(jitterAmount);
  targetRef.current = target;
  jitterRef.current = jitterAmount;

  useEffect(() => {
    const interval = setInterval(() => {
      const j = (Math.random() - 0.5) * jitterRef.current * 2;
      const t = targetRef.current + j;
      // Smooth toward target
      const next = ref.current + (t - ref.current) * 0.25;
      ref.current = next;
      setDisplay(next);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return Math.max(0, Math.min(99, Math.round(display)));
}

/* ─── Page ──────────────────────────────────────────────── */

type PageMode = "ambient" | "evaluating" | "resolved";

export default function CampaignPage() {
  const [mode, setMode] = useState<PageMode>("ambient");
  const [output, setOutput] = useState<SystemOutput | null>(null);
  const [scenarioState, setScenarioState] = useState<LoopState | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const loop = useSystemLoop();

  // Map state source: scenarioState during evaluating/resolved, otherwise ambient loop
  const currentState: LoopState = mode === "ambient" ? loop : (scenarioState ?? loop);
  const feed = useLiveFeed(currentState);

  // Confidence: higher jitter during evaluating, locked during resolved
  const confJitter = mode === "evaluating" ? 7 : mode === "resolved" ? 0 : 2;
  const displayConfidence = useConfidenceDisplay(currentState.confidence, confJitter);

  const launch = useCallback((sc: Scenario) => {
    const out = generate(sc.input);
    setOutput(out);
    setActiveScenario(sc);
    setMode("evaluating");

    const dec = out.decision;
    const final = out.confidence;

    // Staged evaluation phases — scripted so decision does NOT instantly switch
    setScenarioState({ phase: "idle", decision: dec, confidence: 42, activeNodes: [], downstream: null });
    const t1 = setTimeout(() => setScenarioState({ phase: "signal_fire", decision: dec, confidence: 54, activeNodes: ["signal"], downstream: null }), 500);
    const t2 = setTimeout(() => setScenarioState({ phase: "culture_fire", decision: dec, confidence: 64, activeNodes: ["signal", "culture", "lens"], downstream: null }), 1600);
    const t3 = setTimeout(() => setScenarioState({ phase: "converge", decision: dec, confidence: Math.max(70, final - 6), activeNodes: ["signal", "culture", "spend", "youtube", "lens"], downstream: null }), 2800);
    const t4 = setTimeout(() => setScenarioState({ phase: "decide", decision: dec, confidence: final, activeNodes: ["signal", "culture", "spend", "youtube", "lens"], downstream: null }), 4000);
    const t5 = setTimeout(() => setMode("resolved"), 5000);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const reset = useCallback(() => {
    setMode("ambient");
    setOutput(null);
    setScenarioState(null);
    setActiveScenario(null);
  }, []);

  // Derived visibility flags
  const isAmbient = mode === "ambient";
  const isEvaluating = mode === "evaluating";
  const isResolved = mode === "resolved";

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

      {/* Hero */}
      <section className="bg-ink text-paper pt-12 pb-32 md:pt-16 md:pb-44 relative">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          <h1 className="font-display text-4xl md:text-6xl leading-[0.92] font-bold max-w-lg">
            One system.<br />
            <span className="italic font-light text-signal">Every decision.</span>
          </h1>
          <p className="mt-3 text-sm text-paper/25 max-w-sm">Signal, culture, audience, memory. Connected. Continuous.</p>
          <p className="mt-1.5 font-mono text-[11px] text-paper/18 max-w-sm">Each campaign makes it sharper.</p>
        </div>
      </section>

      {/* System map — persistent anchor */}
      <section className="mx-auto max-w-[1120px] px-4 md:px-8 -mt-28 md:-mt-40 relative z-10">
        <SystemMap
          state={currentState}
          displayConfidence={displayConfidence}
          mode={mode}
          output={isResolved ? output : null}
        />
      </section>

      {/* Live processing feed + product UI fragments */}
      <section className="mx-auto max-w-[1120px] px-6 md:px-10 pt-6 md:pt-10 pb-14">
        <div className="grid md:grid-cols-[1fr_1.05fr] gap-8 md:gap-12 items-start max-w-[900px] mx-auto">

          {/* Left — live feed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`${isEvaluating ? "animate-ping" : "animate-ping"} absolute inline-flex h-full w-full rounded-full ${isEvaluating ? "bg-signal" : isResolved ? "bg-ink" : "bg-mint"} opacity-60`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isEvaluating ? "bg-signal" : isResolved ? "bg-ink" : "bg-mint"}`} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/35">
                {isEvaluating ? "system · evaluating" : isResolved ? "system · locked" : "system · live"}
              </span>
            </div>
            <LiveFeed feed={feed} decision={currentState.decision} />
          </div>

          {/* Right — product UI fragments, contextually selected */}
          <div className="grid grid-cols-1 gap-2.5">
            {(() => {
              const visible = selectFragments(mode, currentState.phase, currentState.decision);
              const lensData = activeScenario?.lens ?? AMBIENT_LENS;
              const renderFragment = (id: FragmentId) => {
                switch (id) {
                  case "lens":
                    return <FragmentLens active={isResolved || currentState.activeNodes.includes("lens") || currentState.phase === "idle" || currentState.phase === "signal_fire" || currentState.phase === "culture_fire"} data={lensData} />;
                  case "velocity":
                    return <FragmentVelocity active={currentState.activeNodes.includes("signal") || currentState.phase === "converge" || isResolved} decision={currentState.decision} />;
                  case "audience":
                    return <FragmentAudience active={currentState.activeNodes.includes("culture") || currentState.phase === "converge" || currentState.phase === "decide" || isResolved} />;
                  case "spend":
                    return <FragmentSpend decision={currentState.decision} active={currentState.phase === "decide" || currentState.phase === "downstream" || isResolved} />;
                  case "youtube":
                    return <FragmentYouTube active={isResolved || currentState.phase === "decide" || currentState.phase === "downstream"} decision={currentState.decision} />;
                }
              };
              return (
                <AnimatePresence initial={false}>
                  {visible.map((id) => (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                    >
                      {renderFragment(id)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Injection area — scenarios or resolved-state actions */}
      <section className="mx-auto max-w-[960px] px-6 md:px-10 pb-20 md:pb-28">
        <div className="border-t border-ink/6 pt-10">
          <AnimatePresence mode="wait">
            {isAmbient && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="max-w-[640px] mx-auto"
              >
                <div className="flex items-baseline justify-between mb-5">
                  <p className="font-mono text-[11px] text-ink/40 uppercase tracking-[0.12em]">Inject a scenario</p>
                  <p className="font-mono text-[10px] text-ink/25">the system will respond</p>
                </div>
                <div className="flex flex-col gap-2.5">
                  {SCENARIOS.map((sc) => {
                    const dotClr = sc.likelyDecision === "PUSH" ? "bg-signal" : sc.likelyDecision === "TEST" ? "bg-sun" : "bg-electric";
                    const txtClr = sc.likelyDecision === "PUSH" ? "text-signal" : sc.likelyDecision === "TEST" ? "text-sun" : "text-electric";
                    return (
                      <button
                        key={sc.situation}
                        onClick={() => launch(sc)}
                        className="group w-full text-left rounded-xl border border-ink/8 hover:border-ink/25 bg-paper px-5 py-4 transition-all hover:translate-x-[2px]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotClr}`} />
                              <span className="text-[15px] font-medium text-ink/80 group-hover:text-ink transition-colors">{sc.situation}</span>
                            </div>
                            <div className="font-mono text-[10.5px] text-ink/35 ml-[14px]">{sc.context}</div>
                            <div className="font-mono text-[10.5px] text-ink/45 ml-[14px] mt-1.5 italic">
                              <span className="text-ink/30">// </span>{sc.hint}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`font-mono text-[10px] ${txtClr} opacity-60 group-hover:opacity-100 transition-opacity`}>
                              likely {sc.likelyDecision}
                            </span>
                            <span className="text-ink/15 group-hover:text-ink/60 transition-all text-sm group-hover:translate-x-0.5">inject →</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {isEvaluating && (
              <motion.div
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-[640px] mx-auto text-center py-3"
              >
                <p className="font-mono text-[11px] text-ink/30 uppercase tracking-[0.14em]">processing</p>
                <p className="mt-2 text-[14px] text-ink/60 italic">{activeScenario?.situation}</p>
                <p className="mt-1 font-mono text-[10.5px] text-ink/30">
                  confidence converging · signals aligning · decision resolving
                </p>
              </motion.div>
            )}

            {isResolved && output && (
              <motion.div
                key="resolved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="max-w-[640px] mx-auto"
              >
                <div className="text-center mb-5">
                  <p className="font-mono text-[10px] text-ink/30 uppercase tracking-[0.14em]">scenario resolved</p>
                  <p className="mt-1 text-[13px] text-ink/55 italic">{activeScenario?.situation}</p>
                </div>
                <p className="text-center font-mono text-[10.5px] text-ink/40 mb-1.5">
                  projected · {output.outcome}
                </p>
                <p className="text-center font-mono text-[10px] text-ink/25 italic mb-6">
                  confidence adjusted using prior campaign outcomes
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={reset}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-mono font-medium hover:bg-ink hover:text-paper transition-colors"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform">↺</span> Inject another scenario
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
