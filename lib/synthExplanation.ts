/**
 * Grounded fallback explainer.
 *
 * Used when no ANTHROPIC_API_KEY is configured. It never invents data —
 * it composes a short explanation by recombining the structured inputs
 * the engine already produced. This keeps the demo working end-to-end
 * and mirrors the constraints in the LLM prompt.
 */

import type { ExplainerInput } from "./explainerPrompt";

export interface ExplainerOutput {
  summary: string;
  keySignals: string[];
  confidence: "High" | "Medium" | "Low";
  caution: string;
}

function leadIn(state: ExplainerInput["state"]): string {
  switch (state) {
    case "PUSH":
      return "This leans PUSH because";
    case "TEST":
      return "This sits closer to TEST than PUSH because";
    case "HOLD":
      return "This lands on HOLD because";
    default:
      return "The engine chose this because";
  }
}

function confidenceFor(input: ExplainerInput): ExplainerOutput["confidence"] {
  const { state, signals, why } = input;
  const weak = /plateau|flat|not pulling|shallow|thin|below baseline|burn|drop/i.test(
    `${why} ${signals.join(" ")}`
  );
  const strong = /above baseline|compounding|expanding|trending up|broadening|velocity/i.test(
    `${why} ${signals.join(" ")}`
  );
  if (state === "PUSH" && strong && !weak) return "High";
  if (state === "HOLD") return weak ? "Medium" : "Medium";
  if (state === "TEST") return "Medium";
  return strong ? "Medium" : "Low";
}

function cautionFor(input: ExplainerInput): string {
  const text = `${input.why} ${input.signals.join(" ")}`;
  if (/shallow|thin|flat/i.test(text))
    return "The signal is real but still narrow — keep the test contained.";
  if (/drop|burn|weak/i.test(text))
    return "Scaling now risks burning budget into a weak window.";
  if (input.state === "PUSH")
    return "";
  if (input.state === "TEST")
    return "Re-check signals before any wider commitment.";
  return "";
}

export function synthesiseExplanation(input: ExplainerInput): ExplainerOutput {
  const lead = leadIn(input.state);
  const headline = input.why.replace(/\s+/g, " ").trim();
  const firstSignal = (input.signals[0] || "").toLowerCase();

  // Build a 2-sentence summary grounded entirely in provided text.
  const summary = firstSignal
    ? `${lead} ${headline.charAt(0).toLowerCase()}${headline.slice(1)} ${
        input.state === "PUSH"
          ? "The strongest pull: " + firstSignal + "."
          : input.state === "TEST"
          ? "Enough early signal to probe, not enough to commit."
          : "Spend here would outrun the evidence."
      }`
    : `${lead} ${headline}`;

  const keySignals = input.signals.slice(0, 3).map((s) =>
    // clip to first ~12 words
    s.split(/\s+/).slice(0, 12).join(" ")
  );

  return {
    summary: summary.replace(/\s+/g, " ").trim(),
    keySignals,
    confidence: confidenceFor(input),
    caution: cautionFor(input),
  };
}
