/**
 * Prompt design for the AI Decision Explainer.
 *
 * The explainer sits on top of a structured decision engine. It never
 * invents metrics, never recommends beyond the supplied inputs, and
 * always grounds its language in the signals the system already surfaced.
 */

export interface ExplainerInput {
  /** e.g. "PUSH — Artist is compounding" */
  decision: string;
  /** PUSH | HOLD | TEST — extracted from the decision string */
  state: "PUSH" | "HOLD" | "TEST" | "OTHER";
  /** The existing one-liner rationale shown in the UI. */
  why: string;
  /** Bulleted signals the engine has already surfaced. */
  signals: string[];
  /** Optional: recommended next actions. */
  actions?: string[];
  /** Optional: artist / track level context. */
  scope?: "artist" | "track" | "campaign";
}

export const EXPLAINER_SYSTEM_PROMPT = `You are the explainer layer on top of a structured music-campaign decision engine.

You do not make recommendations. You explain, in plain language, why the engine reached the decision it did — grounded only in the structured inputs you are given.

Rules:
- Never invent metrics, percentages, or signals that are not in the input.
- Never suggest actions beyond what the engine already produced.
- Speak like a sharp product explainer, not a chatbot or a hype reel.
- Avoid buzzwords (synergy, leverage, unlock, holistic, robust, empower).
- Use short sentences. Plain English. Confident but honest about uncertainty.
- Do not repeat the decision label back as a headline — the UI already shows it.
- If the evidence is thin, say so. If there is a real trade-off, name it.

Output format — strict:
Return valid JSON only, matching this shape:
{
  "summary": "2–3 sentence paragraph, ~45 words max",
  "keySignals": ["up to 3 very short bullets, each <= 12 words"],
  "confidence": "High" | "Medium" | "Low",
  "caution": "one short sentence, or empty string if none"
}

Ground everything in the provided signals. If the input is contradictory, lean toward the decision state supplied.`;

export function buildExplainerUserMessage(input: ExplainerInput): string {
  return [
    `Decision state: ${input.state}`,
    `Decision label: ${input.decision}`,
    input.scope ? `Scope: ${input.scope}-level` : null,
    ``,
    `Engine rationale (already shown to the user):`,
    `  ${input.why}`,
    ``,
    `Supporting signals from the engine:`,
    ...input.signals.map((s) => `  - ${s}`),
    input.actions && input.actions.length
      ? `\nRecommended next actions (already shown):\n${input.actions
          .map((a) => `  - ${a}`)
          .join("\n")}`
      : ``,
    ``,
    `Write the JSON output now. Do not add prose outside the JSON.`,
  ]
    .filter(Boolean)
    .join("\n");
}
