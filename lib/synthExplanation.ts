/**
 * Grounded fallback for the AI-assisted perspective layer.
 *
 * Used when no ANTHROPIC_API_KEY is configured. It never invents data —
 * it composes short, distinct perspective blocks by recombining the
 * structured inputs the engine already produced.
 *
 * The design goal: even without a live model call, the layer adds NEW
 * value (shift / risk / confidence / pattern) rather than repeating the
 * engine's "why".
 */

import type { ExplainerInput } from "./explainerPrompt";

export interface ExplainerOutput {
  shiftPotential: string;
  riskSignal: string;
  confidence: "High" | "Medium" | "Low";
  confidenceNote: string;
  patternRead: string;
}

/* ── Signal vocabulary extracted from the provided inputs ──────────── */

function hasAny(haystack: string, needles: string[]): boolean {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function joinSignals(input: ExplainerInput): string {
  return [input.why, input.whatChanged ?? "", ...input.signals].join(" · ");
}

/**
 * Pull a trajectory word from the "what changed" context (or signals).
 * Returns one of: compounding / expanding / flattening / decaying / mixed.
 */
function trajectory(input: ExplainerInput): "compounding" | "expanding" | "flattening" | "decaying" | "mixed" {
  const text = joinSignals(input).toLowerCase();
  if (/decay|fell|drop|softening|skip rate climb/.test(text)) return "decaying";
  if (/flat|plateau|stall|confined|stays stable|not broaden/.test(text)) return "flattening";
  if (/compounding|moving together|multiple tracks/.test(text)) return "compounding";
  if (/expanding|broadening|day-on-day|rising|trending up|climbed/.test(text)) return "expanding";
  return "mixed";
}

/* ── Shift potential: what would flip the decision ─────────────────── */

function shiftPotential(input: ExplainerInput): string {
  const text = joinSignals(input);
  const mentionsSave = hasAny(text, ["save rate", "saves"]);
  const mentionsRetention = hasAny(text, ["retention", "skip", "day 3", "day-three", "follow-through"]);
  const mentionsReach = hasAny(text, ["reach", "listeners", "broaden", "expand"]);
  const mentionsVelocity = hasAny(text, ["velocity", "trending", "momentum", "compounding"]);

  switch (input.state) {
    case "HOLD": {
      if (mentionsRetention && mentionsReach)
        return "Flips to PUSH if retention lifts past day 3 and reach starts broadening beyond the core audience.";
      if (mentionsReach)
        return "Flips to TEST if reach starts expanding in a single segment before any wider commitment.";
      if (mentionsSave)
        return "Flips to TEST if save rate climbs above baseline for two consecutive weeks.";
      return "Flips to TEST if one named signal — reach, save rate, or retention — moves above baseline for 2+ weeks.";
    }
    case "TEST": {
      if (mentionsSave && mentionsVelocity)
        return "Flips to PUSH if save rate holds above baseline and velocity sustains through the next release cycle.";
      if (mentionsReach)
        return "Flips to PUSH if reach broadens outside the responsive segment within 14 days.";
      return "Flips to PUSH if the early signal proves durable across two full reporting windows.";
    }
    case "PUSH": {
      if (mentionsRetention)
        return "Downgrades to HOLD if retention softens or the save curve flattens over the next two weeks.";
      return "Downgrades to HOLD if compounding stalls — flat listeners, no new reach, or save rate drifting to baseline.";
    }
    default:
      return "Flips if the strongest signal in the current state reverses for two consecutive reporting windows.";
  }
}

/* ── Risk signal: fragility if the call is ignored ─────────────────── */

function riskSignal(input: ExplainerInput): string {
  const text = joinSignals(input);
  switch (input.state) {
    case "HOLD": {
      if (hasAny(text, ["drop", "skip", "weak", "day 3", "day-three"]))
        return "Spending now burns budget into a weak retention window and teaches the algorithm the wrong lesson.";
      if (hasAny(text, ["plateau", "flat", "not pulling"]))
        return "Pushing past a plateau without a new signal compounds a flat audience instead of expanding it.";
      return "Scaling ahead of the evidence spends against noise — and the next real signal gets harder to read.";
    }
    case "TEST": {
      if (hasAny(text, ["shallow", "thin", "early"]))
        return "Skipping the test and scaling too early risks confusing a narrow early signal for a broad one.";
      return "Committing full budget on a thin signal caps upside if the early traction doesn't broaden.";
    }
    case "PUSH": {
      if (hasAny(text, ["editorial", "playlist"]))
        return "Under-committing now lets momentum cool before paid and editorial supports can compound it.";
      return "Holding back now lets a compounding window pass — the same signals are more expensive to restart later.";
    }
    default:
      return "Acting against the current call stretches the signal-to-decision loop and weakens the next read.";
  }
}

/* ── Confidence ────────────────────────────────────────────────────── */

function confidence(input: ExplainerInput): { level: ExplainerOutput["confidence"]; note: string } {
  const text = joinSignals(input);
  const weak = hasAny(text, ["thin", "shallow", "early", "flat", "plateau", "unproven"]);
  const strong = hasAny(text, ["above baseline", "compounding", "expanding", "trending up", "broadening", "velocity"]);
  const mixed = hasAny(text, ["mixed", "but", "however", "trade-off", "uneven"]);

  if (input.state === "PUSH" && strong && !weak) {
    return { level: "High", note: "Multiple signals moving together, not a single-metric spike." };
  }
  if (input.state === "TEST") {
    return { level: "Medium", note: "Early directional signal — real, but not yet broad or durable." };
  }
  if (input.state === "HOLD" && weak) {
    return { level: "Medium", note: "Core audience is stable; no fresh signal to act on." };
  }
  if (mixed) {
    return { level: "Medium", note: "Signals are pointing in different directions — act cautiously." };
  }
  return {
    level: strong ? "Medium" : "Low",
    note: strong ? "Trend is forming but not yet confirmed across cycles." : "Evidence is thin — treat any action as reversible.",
  };
}

/* ── Pattern read (timeline mode) ──────────────────────────────────── */

function patternRead(input: ExplainerInput): string {
  if ((input.mode ?? "decision") !== "timeline") return "";
  const text = joinSignals(input);
  const moments = (input.moments ?? []).join(" ");
  const all = `${text} ${moments}`.toLowerCase();

  if (/second wind|resurge|reawaken/.test(all)) {
    return "Second-wind pattern — post-release traction flattens, then lifts again as campaign moments re-engage the audience.";
  }
  if (/delayed|slow build|late|breakout/.test(all)) {
    return "Delayed-breakout pattern — early traction builds gradually before a second wave driven by campaign moments.";
  }
  if (/spike|drop|day 1|day-one|decay/.test(all)) {
    return "Spike-and-decay pattern — a sharp day-one peak that the audience doesn't carry forward once campaign support thins.";
  }
  if (/plateau|flat|stall/.test(all)) {
    return "Flat-plateau pattern — campaign moments land without lifting the baseline, suggesting the audience is held, not growing.";
  }
  if (/compounding|expanding|broaden|growth/.test(all)) {
    return "Sustained-growth pattern — each campaign moment compounds on the last, with reach broadening through the cycle.";
  }
  return "Mixed pattern — no single shape dominates; campaign moments are creating short lifts without a clear overall trajectory.";
}

export function synthesiseExplanation(input: ExplainerInput): ExplainerOutput {
  const c = confidence(input);
  const traj = trajectory(input);

  // Blend trajectory into shift potential so output reads about direction,
  // not just static state. Never overwrite if there's no clear signal.
  const baseShift = shiftPotential(input);
  const shift =
    traj === "decaying"
      ? baseShift.replace(/^([A-Z])/, (m) => `Trajectory is decaying — ${m.toLowerCase()}`)
      : traj === "flattening"
      ? baseShift.replace(/^([A-Z])/, (m) => `Trajectory is flat — ${m.toLowerCase()}`)
      : traj === "compounding"
      ? baseShift.replace(/^([A-Z])/, (m) => `Trajectory is compounding — ${m.toLowerCase()}`)
      : traj === "expanding"
      ? baseShift.replace(/^([A-Z])/, (m) => `Trajectory is expanding — ${m.toLowerCase()}`)
      : baseShift;

  return {
    shiftPotential: shift,
    riskSignal: riskSignal(input),
    confidence: c.level,
    confidenceNote: c.note,
    patternRead: patternRead(input),
  };
}
