"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * One reusable decision surface across the product.
 *
 * System 1 (default, always visible):
 *   - decision headline
 *   - one-line why
 *   - one-line what to do now
 *
 * System 2 (optional, click to reveal):
 *   - AI Read · Spend logic (if relevant) · Watch · If confirmed
 *
 * Visual language matches the rest of the system — no chat, no ask-AI,
 * no big permanent explanation blocks. Trigger pulses softly so the
 * intelligence layer feels alive without shouting.
 */

export type Intelligence = {
  /** Decision token — "PUSH" / "HOLD" / "TEST" / "SCALE" etc. */
  decision: string;
  /** Tailwind text color class for the decision token, e.g. "text-signal". */
  decisionColor?: string;
  /** One short sentence — System 1 */
  why: string;
  /** One short sentence — System 1 */
  doNow: string;
  /** Deeper read of what the system sees — System 2 */
  aiRead: string;
  /** Optional spend / allocation logic — omit for YouTube / cadence-only tools */
  spendLogic?: string;
  /** What signal or condition matters next */
  watch: string;
  /** What happens if the watched signal appears */
  ifConfirmed: string;
  /** Optional single-line signals strip shown under System 1 */
  signalLine?: string;
};

type Theme = "paper" | "ink";

interface Props {
  data: Intelligence;
  /** "paper" = light card surface, "ink" = dark card surface */
  theme?: Theme;
  /** Optional scope label shown as an eyebrow — e.g. "CAMPAIGN" */
  scope?: string;
  /** Extra content to render above the intelligence trigger (optional). */
  children?: React.ReactNode;
}

const PALETTE: Record<Theme, {
  eyebrow: string;
  body: string;
  subtle: string;
  rule: string;
  triggerBg: string;
  triggerHover: string;
  triggerBorder: string;
  dotBg: string;
  dotFg: string;
  panelBg: string;
  panelBorder: string;
  labelFg: string;
  valueFg: string;
}> = {
  paper: {
    eyebrow: "text-ink/30",
    body: "text-ink/85",
    subtle: "text-ink/60",
    rule: "border-ink/10",
    triggerBg: "bg-ink/[0.03]",
    triggerHover: "hover:bg-ink/[0.06]",
    triggerBorder: "border-ink/10",
    dotBg: "bg-ink",
    dotFg: "text-paper",
    panelBg: "bg-ink/[0.03]",
    panelBorder: "border-ink/10",
    labelFg: "text-ink/45",
    valueFg: "text-ink/85",
  },
  ink: {
    eyebrow: "text-paper/45",
    body: "text-paper/90",
    subtle: "text-paper/65",
    rule: "border-paper/10",
    triggerBg: "bg-paper/[0.05]",
    triggerHover: "hover:bg-paper/[0.10]",
    triggerBorder: "border-paper/10",
    dotBg: "bg-paper",
    dotFg: "text-ink",
    panelBg: "bg-paper/[0.04]",
    panelBorder: "border-paper/10",
    labelFg: "text-paper/45",
    valueFg: "text-paper/90",
  },
};

export default function DecisionIntelligence({
  data,
  theme = "paper",
  scope,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const p = PALETTE[theme];

  const rows: Array<[string, string]> = [
    ["AI Read", data.aiRead],
  ];
  if (data.spendLogic) rows.push(["Spend logic", data.spendLogic]);
  rows.push(["Watch", data.watch]);
  rows.push(["If confirmed", data.ifConfirmed]);

  return (
    <div className="space-y-4">
      {/* System 1 — default, fast */}
      <div className="space-y-3">
        {scope && (
          <div className={`text-[10px] font-mono uppercase tracking-[0.14em] ${p.eyebrow}`}>
            {scope}
          </div>
        )}
        <div
          className={`font-display font-black text-3xl md:text-4xl leading-tight tracking-tight ${
            data.decisionColor ?? (theme === "ink" ? "text-paper" : "text-ink")
          }`}
        >
          {data.decision}
        </div>
        <p className={`text-sm md:text-[15px] leading-relaxed ${p.body}`}>
          {data.why}
        </p>
        <p className={`text-sm md:text-[15px] leading-relaxed font-medium ${theme === "ink" ? "text-paper" : "text-ink"}`}>
          <span className={`mr-2 ${p.labelFg} text-[10px] font-mono uppercase tracking-[0.14em]`}>
            Do now
          </span>
          {data.doNow}
        </p>
        {data.signalLine && (
          <p className={`text-[12px] leading-snug ${p.subtle}`}>
            <span className={`mr-2 text-[10px] font-mono uppercase tracking-[0.14em] ${p.labelFg}`}>
              Signals
            </span>
            {data.signalLine}
          </p>
        )}
      </div>

      {children}

      {/* Intelligence trigger — System 2 entry */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group w-full flex items-center justify-between gap-3 rounded-xl border ${p.triggerBorder} ${p.triggerBg} ${p.triggerHover} px-3.5 py-2.5 transition-colors`}
      >
        <span className="flex items-center gap-2.5">
          <span className="relative inline-flex items-center justify-center">
            <span className={`absolute inset-0 rounded-full ${p.dotBg} opacity-30 animate-pulse`} />
            <span
              className={`relative inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[9px] font-mono tracking-[0.1em] ${p.dotBg} ${p.dotFg}`}
            >
              AI
            </span>
          </span>
          <span className={`text-[11.5px] font-mono uppercase tracking-[0.14em] ${p.subtle}`}>
            {open ? "Hide intelligence" : "Open intelligence"}
          </span>
        </span>
        <span
          className={`text-[11px] font-mono ${p.labelFg} transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Intelligence panel — System 2 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="intel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl border ${p.panelBorder} ${p.panelBg} p-4 space-y-3.5`}>
              {rows.map(([label, value]) => (
                <div key={label}>
                  <div className={`text-[10px] font-mono uppercase tracking-[0.14em] mb-1 ${p.labelFg}`}>
                    {label}
                  </div>
                  <p className={`text-[13.5px] leading-snug ${p.valueFg}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
