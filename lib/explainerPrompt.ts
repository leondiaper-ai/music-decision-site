/**
 * Prompt design for the AI-assisted perspective layer.
 *
 * The perspective layer does NOT repeat the engine's "why". It adds a
 * second layer of thinking on top of a structured decision output:
 *
 *   • Shift potential — what would need to change to flip the decision
 *   • Risk signal    — what could go wrong if the call is ignored
 *   • Confidence     — how stable the signals are, with a short note
 *   • Pattern read   — (timeline mode only) the shape of the campaign
 *
 * Everything is grounded in the structured inputs. No invented metrics.
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
  /** Optional: artist / track / campaign context. */
  scope?: "artist" | "track" | "campaign";
  /** Which perspective to produce. */
  mode?: ExplainerMode;
  /** Optional: ordered campaign moments (timeline mode). */
  moments?: string[];
}

export const EXPLAINER_SYSTEM_PROMPT = `You are the perspective layer that sits on top of a structured music-campaign decision engine.

You never repeat the engine's "why". The engine has already explained itself. Your job is to add a second layer of thinking that the engine does not produce — grounded only in the structured inputs you are given.

Rules:
- Never invent metrics, percentages, or signals that are not in the input.
- Never recommend actions the engine did not already surface.
- Speak like a sharp product analyst, not a chatbot or a hype reel.
- Avoid buzzwords (synergy, leverage, unlock, holistic, robust, empower).
- Use short sentences. Plain English. Confident but honest about uncertainty.
- If the evidence is thin, say so. If there is a real trade-off, name it.
- Do NOT restate the decision. Do NOT rephrase the "why".

Output format — strict JSON:
{
  "shiftPotential": "1 sentence, max ~22 words. What specific signal change would flip the decision (e.g. HOLD → PUSH, TEST → PUSH). Reference named signals from the input (save rate, retention, velocity, reach, etc.).",
  "riskSignal": "1 sentence, max ~22 words. What breaks if this call is ignored — the downside or fragility in the current state.",
  "confidence": "High" | "Medium" | "Low",
  "confidenceNote": "1 short clause, max ~14 words. Why the signals are stable, early, or mixed.",
  "patternRead": "Only for timeline mode. 1–2 sentences, max ~35 words. Name the shape (spike-and-decay, delayed breakout, sustained growth, flat plateau, second wind, etc.) and connect moments into one interpretation. Empty string if mode is not timeline."
}

Ground everything in the provided signals. If the input is contradictory, lean toward the decision state supplied.`;

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
