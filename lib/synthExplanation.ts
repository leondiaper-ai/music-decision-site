/**
 * Grounded fallback for the AI interpretation layer.
 *
 * Used when no ANTHROPIC_API_KEY is configured. Never invents data — it
 * composes four distinct blocks (systemStance / aiPerspective / watchFor
 * / ifTriggered) by recombining the structured inputs the engine already
 * produced.
 */

import type { ExplainerInput } from "./explainerPrompt";

export interface ExplainerOutput {
  systemStance: string;
  aiPerspective: string;
  watchFor: string;
  ifTriggered: string;
  confidence: "High" | "Medium" | "Low";
  confidenceNote: string;
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function hasAny(text: string, needles: string[]): boolean {
  const h = text.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function joinSignals(input: ExplainerInput): string {
  return [input.why, input.whatChanged ?? "", ...input.signals].join(" · ");
}

type Trajectory = "compounding" | "expanding" | "flattening" | "decaying" | "mixed";

function trajectory(input: ExplainerInput): Trajectory {
  const text = joinSignals(input).toLowerCase();
  if (/decay|fell|drop|softening|skip rate climb/.test(text)) return "decaying";
  if (/flat|plateau|stall|confined|stays stable|not broaden/.test(text)) return "flattening";
  if (/compounding|moving together|multiple tracks/.test(text)) return "compounding";
  if (/expanding|broadening|day-on-day|rising|trending up|climbed/.test(text)) return "expanding";
  return "mixed";
}

/* ── systemStance ────────────────────────────────────────────────────── */

function systemStance(input: ExplainerInput): string {
  const text = joinSignals(input);
  switch (input.state) {
    case "PUSH": {
      if (hasAny(text, ["compounding", "moving together"])) return "Push — signals compounding together";
      if (hasAny(text, ["expanding", "broadening"])) return "Push — reach expanding beyond the core";
      return "Push — directional signal strong enough to act on";
    }
    case "HOLD": {
      if (hasAny(text, ["flat", "plateau", "not broaden"])) return "Hold — no expansion signal yet";
      if (hasAny(text, ["mixed", "uneven"])) return "Hold — signals mixed, not enough to act";
      return "Hold — core audience stable, no fresh evidence";
    }
    case "TEST": {
      if (hasAny(text, ["early", "narrow", "shallow"])) return "Test — narrow signal, not yet broad";
      return "Test — directional signal worth probing";
    }
    default:
      return "Observing — no dominant signal yet";
  }
}

/* ── aiPerspective ───────────────────────────────────────────────────── */

function aiPerspectiveDecision(input: ExplainerInput, traj: Trajectory): string {
  const text = joinSignals(input);
  const scope = input.scope ?? "artist";
  const scopeWord = scope === "track" ? "track" : scope === "campaign" ? "campaign" : scope === "youtube" ? "channel" : "artist";

  switch (input.state) {
    case "PUSH": {
      if (traj === "compounding")
        return `Multiple signals are moving together on this ${scopeWord} rather than a single metric spiking — that's the pattern that tends to hold through a cycle.`;
      if (traj === "expanding")
        return `Reach is broadening outside the responsive core, which is what separates durable growth from a single-segment bump.`;
      return `Momentum is real and currently being driven by more than one signal, which is why the call is to lean in now rather than wait.`;
    }
    case "HOLD": {
      if (traj === "flattening")
        return `Core engagement is healthy but there's no evidence of widening reach yet — the ${scopeWord} is held, not growing.`;
      if (traj === "decaying")
        return `The recent softening is still inside normal variation, but the system is choosing not to spend against a weakening curve.`;
      return `The base is stable but no new signal is forming — acting now would teach the algorithm a noisier lesson than waiting one more cycle.`;
    }
    case "TEST": {
      if (traj === "expanding")
        return `There's a real early signal but it's still narrow — a focused test confirms whether it broadens before committing full budget.`;
      return `The signal is directional, not decisive. A contained test reads durability without overcommitting to an early read.`;
    }
    default:
      return `No single trajectory dominates yet. The system is waiting for one signal to separate from the noise before committing.`;
  }
}

function aiPerspectiveTimeline(input: ExplainerInput): string {
  const text = joinSignals(input);
  const moments = (input.moments ?? []).join(" ");
  const all = `${text} ${moments}`.toLowerCase();

  if (/second wind|resurge|reawaken/.test(all)) {
    return "Second-wind pattern. This second lift appears campaign-driven rather than release-driven, suggesting behaviour is being reactivated by key moments rather than naturally compounding.";
  }
  if (/delayed|slow build|late|breakout/.test(all)) {
    return "Delayed-breakout pattern. Early traction built slowly before a second wave driven by campaign moments — momentum is campaign-fed, not audience-fed.";
  }
  if (/spike|day 1|day-one/.test(all) && /drop|decay|fall/.test(all)) {
    return "Spike-and-decay pattern. A sharp day-one peak the audience didn't carry forward once campaign support thinned — reach is reactive, not compounding.";
  }
  if (/plateau|flat|stall/.test(all)) {
    return "Flat-plateau pattern. Campaign moments are landing but the baseline isn't lifting — the audience is being held in place rather than grown.";
  }
  if (/compounding|expanding|broaden|growth/.test(all)) {
    return "Sustained-growth pattern. Each campaign moment is compounding on the last, with reach broadening through the cycle.";
  }
  return "Mixed shape. No single pattern dominates yet — campaign moments are creating short lifts without a clear overall trajectory.";
}

/* ── watchFor ────────────────────────────────────────────────────────── */

function watchFor(input: ExplainerInput): string {
  const text = joinSignals(input);
  const mentionsSave = hasAny(text, ["save rate", "saves"]);
  const mentionsRetention = hasAny(text, ["retention", "skip", "day 3", "day-three", "follow-through"]);
  const mentionsReach = hasAny(text, ["reach", "listeners", "broaden", "expand"]);
  const mentionsVelocity = hasAny(text, ["velocity", "trending", "momentum", "compounding"]);
  const mentionsEditorial = hasAny(text, ["editorial", "playlist"]);

  switch (input.state) {
    case "HOLD": {
      if (mentionsRetention) return "Repeat listening climbing past day-three retention across more than one track.";
      if (mentionsReach) return "Reach starting to broaden in a single segment before wider commitment.";
      if (mentionsSave) return "Save rate lifting above baseline for two consecutive reporting weeks.";
      return "One named signal — reach, save rate or retention — moving above baseline for two cycles.";
    }
    case "TEST": {
      if (mentionsSave && mentionsVelocity) return "Save rate holding above baseline while velocity sustains through the next release window.";
      if (mentionsReach) return "Reach broadening outside the responsive segment within the next 14 days.";
      return "Early signal holding across two full reporting windows, not just one.";
    }
    case "PUSH": {
      if (mentionsRetention) return "Retention softening or the save curve flattening across the next two weeks.";
      if (mentionsEditorial) return "Editorial or playlist support tapering before paid spend compounds the moment.";
      return "Listener growth stalling or reach failing to widen alongside streams.";
    }
    default:
      return "One signal separating from the noise and holding for more than a single window.";
  }
}

/* ── ifTriggered ─────────────────────────────────────────────────────── */

function ifTriggered(input: ExplainerInput): string {
  switch (input.state) {
    case "HOLD":
      return "Shift from hold to test with targeted spend or a broader content push on the strongest segment.";
    case "TEST":
      return "Move from test to push — scale spend and commit hero content behind the proven signal.";
    case "PUSH":
      return "Downgrade to hold, reduce paid support and protect budget until the next durable signal appears.";
    default:
      return "Enter a contained test against the strongest emerging signal rather than committing broadly.";
  }
}

/* ── confidence ──────────────────────────────────────────────────────── */

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

export function synthesiseExplanation(input: ExplainerInput): ExplainerOutput {
  const c = confidence(input);
  const traj = trajectory(input);
  const mode = input.mode ?? "decision";

  return {
    systemStance: systemStance(input),
    aiPerspective: mode === "timeline" ? aiPerspectiveTimeline(input) : aiPerspectiveDecision(input, traj),
    watchFor: watchFor(input),
    ifTriggered: ifTriggered(input),
    confidence: c.level,
    confidenceNote: c.note,
  };
}
