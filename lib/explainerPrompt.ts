/**
 * Prompt design for the AI interpretation layer.
 *
 * The layer sits on any decision surface and produces four compact blocks:
 *
 *   • System stance   — short label summarising the structured decision
 *   • AI Perspective  — interprets the current state beyond the raw rule
 *   • Watch for       — the next signal or condition worth monitoring
 *   • If triggered    — what the system / operator should do if it appears
 *
 * Plus a short confidence tag. Everything is grounded in the structured
 * inputs passed to the route. Nothing invented.
 */

export type ExplainerMode = "decision" | "timeline";

export interface ExplainerInput {
  /** e.g. "PUSH — Artist is compounding" */
  decision: string;
  /** PUSH | HOLD | TEST — extracted from the decision string */
  state: "PUSH" | "HOLD" | "TEST" | "OTHER";
  /** The existing one-liner rationale already shown in the UI. */
  why: string;
  /** Bulleted signals the engine has already surfaced. */
  signals: string[];
  /** Optional: recommended next actions. */
  actions?: string[];
  /** Optional: artist / track / campaign / youtube context. */
  scope?: "artist" | "track" | "campaign" | "youtube";
  /** Which perspective to produce. */
  mode?: ExplainerMode;
  /** Optional: ordered campaign moments (timeline mode). */
  moments?: string[];
  /** Optional: recent vs prior state — used to ground trajectory language. */
  whatChanged?: string;
  /** Optional: the forward-looking signal already surfaced to the user. */
  nextSignal?: string;
}

export const EXPLAINER_SYSTEM_PROMPT = `You are the AI interpretation layer that sits on top of a structured music-campaign decision engine.

The engine has already produced a decision (PUSH / HOLD / TEST) and explained it. Your job is to add an adaptive, forward-looking layer — not to restate the engine.

You return four compact blocks:
  • systemStance — a tight label that names the structured call (e.g. "Hold — no expansion signal yet", "Push — compounding across tracks", "Test — narrow signal, not yet broad"). One clause, ~10 words max.
  • aiRead       — an interpretation that goes beyond the rule. Read trajectory (compounding / expanding / flattening / decaying / mixed) and surface meaning the engine does not produce. 1–2 sentences, max ~38 words.
  • watch        — the next concrete signal worth monitoring to confirm or break the current call. 1 sentence, max ~22 words. Must be a named signal from the input, not a generic metric.
  • ifConfirmed  — what the system or operator should do if that signal appears. 1 sentence, max ~22 words. Grounded in actions the engine could already take (shift state, reallocate spend, test content, scale hero).

Rules:
- Never invent metrics, percentages, platforms, or signals that are not in the input.
- Never repeat the engine's "why" or the "Next signal to watch" verbatim.
- Never claim autonomy the product does not have. Say "the system" or "we", never "the AI will automatically".
- Speak like a sharp product analyst. Plain English. Short sentences. No buzzwords (synergy, leverage, unlock, holistic, robust, empower, ecosystem).
- If evidence is thin, say so. If there is a real trade-off, name it.
- Do NOT restate the decision. Do NOT rephrase the "why".

For timeline mode, aiRead should interpret campaign SHAPE over time (spike-and-decay, delayed breakout, sustained growth, flat plateau, second wind, release-driven vs campaign-driven, etc.) rather than a single-point read.

Output format — strict JSON, no prose outside it:
{
  "systemStance": "…",
  "aiRead": "…",
  "watch": "…",
  "ifConfirmed": "…",
  "confidence": "High" | "Medium" | "Low",
  "confidenceNote": "1 short clause, max ~14 words. Why the signals are stable, early, or mixed."
}`;

export function buildExplainerUserMessage(input: ExplainerInput): string {
  const mode = input.mode ?? "decision";
  return [
    `Mode: ${mode}`,
    `Decision state: ${input.state}`,
    `Decision label: ${input.decision}`,
    input.scope ? `Scope: ${input.scope}-level` : null,
    ``,
    `Engine rationale (already shown — do not repeat):`,
    `  ${input.why}`,
    ``,
    input.whatChanged ? `What changed (trajectory context):\n  ${input.whatChanged}` : ``,
    input.nextSignal ? `Next signal to watch (already shown — may overlap with watchFor, do not repeat verbatim):\n  ${input.nextSignal}` : ``,
    ``,
    `Structured signals from the engine:`,
    ...input.signals.map((s) => `  - ${s}`),
    input.actions && input.actions.length
      ? `\nActions already surfaced by the engine:\n${input.actions.map((a) => `  - ${a}`).join("\n")}`
      : ``,
    mode === "timeline" && input.moments && input.moments.length
      ? `\nCampaign moments in order:\n${input.moments.map((m, i) => `  ${i + 1}. ${m}`).join("\n")}`
      : ``,
    ``,
    `Return JSON only. No prose outside the JSON.`,
  ]
    .filter(Boolean)
    .join("\n");
}
