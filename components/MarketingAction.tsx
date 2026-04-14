"use client";

/**
 * MarketingAction — the operational consequence of a decision.
 *
 * Sits directly under the decision output on every surface. Three lines:
 *   • Spend   — No spend / Controlled / Scale
 *   • Channel — None or minimal discovery / Marquee / Off-platform / Mixed
 *   • Timing  — Immediate / Conditional / Wait, with a conditional clause
 *
 * Derived deterministically from the decision state + what the AI is
 * watching. Never invents budgets. Never repeats the AI Read.
 */

export type MarketingState = "PUSH" | "HOLD" | "TEST" | "OTHER";

interface Props {
  state: MarketingState;
  /** The "Watch" condition the AI is monitoring — used to shape the conditional timing. */
  watch?: string;
  /** Tone: compact card on dark backgrounds vs paper. Defaults to paper. */
  theme?: "paper" | "ink";
}

interface Action {
  spend: string;
  channel: string;
  timing: string;
}

function buildAction(state: MarketingState, watch?: string): Action {
  const w = (watch ?? "").toLowerCase();

  switch (state) {
    case "PUSH": {
      const cond = w
        ? `Immediate — maintain while ${trimCondition(watch!)}`
        : "Immediate — while momentum holds";
      return {
        spend: "Scale",
        channel: "Marquee + off-platform",
        timing: cond,
      };
    }
    case "TEST": {
      const cond = w
        ? `Conditional — trigger if ${trimCondition(watch!)}`
        : "Conditional — trigger on signal confirmation";
      return {
        spend: "Controlled",
        channel: "Marquee test or light off-platform",
        timing: cond,
      };
    }
    case "HOLD": {
      const cond = w
        ? `Wait — hold unless ${trimCondition(watch!)}`
        : "Wait — hold until a new signal appears";
      return {
        spend: "No spend",
        channel: "None or minimal discovery",
        timing: cond,
      };
    }
    default:
      return {
        spend: "No spend",
        channel: "None",
        timing: "Wait — no directional signal yet",
      };
  }
}

/**
 * Shorten a "Watch" line into a dependent clause that reads naturally
 * after "if" / "unless" / "while". Lowercases the first letter and drops
 * a trailing period.
 */
function trimCondition(watch: string): string {
  const cleaned = watch.replace(/\.$/, "").trim();
  if (!cleaned) return "";
  const first = cleaned[0].toLowerCase();
  return first + cleaned.slice(1);
}

interface Tokens {
  border: string;
  bg: string;
  eyebrow: string;
  label: string;
  value: string;
}

const TOKEN: Record<"paper" | "ink", Tokens> = {
  paper: {
    border: "border-ink/10",
    bg: "bg-paper/60",
    eyebrow: "text-ink/35",
    label: "text-ink/40",
    value: "text-ink/85",
  },
  ink: {
    border: "border-paper/10",
    bg: "bg-paper/[0.04]",
    eyebrow: "text-paper/40",
    label: "text-paper/45",
    value: "text-paper/90",
  },
};

export default function MarketingAction({ state, watch, theme = "paper" }: Props) {
  const a = buildAction(state, watch);
  const t = TOKEN[theme];

  return (
    <div className={`mt-4 rounded-xl border ${t.border} ${t.bg} p-4`}>
      <div className={`eyebrow ${t.eyebrow} mb-3`}>Marketing Action</div>
      <div className="grid gap-2 text-[13.5px] leading-snug">
        <Row label="Spend" value={a.spend} tokens={t} />
        <Row label="Channel" value={a.channel} tokens={t} />
        <Row label="Timing" value={a.timing} tokens={t} />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tokens,
}: {
  label: string;
  value: string;
  tokens: Tokens;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className={`text-[10px] font-mono tracking-[0.14em] uppercase ${tokens.label} w-16 shrink-0`}
      >
        {label}
      </span>
      <span className={tokens.value}>{value}</span>
    </div>
  );
}
