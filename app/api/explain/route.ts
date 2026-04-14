import { NextRequest, NextResponse } from "next/server";
import {
  EXPLAINER_SYSTEM_PROMPT,
  buildExplainerUserMessage,
  type ExplainerInput,
} from "@/lib/explainerPrompt";
import {
  synthesiseExplanation,
  type ExplainerOutput,
} from "@/lib/synthExplanation";

export const runtime = "edge";

function parseState(decision: string): ExplainerInput["state"] {
  const d = decision.toUpperCase();
  if (d.startsWith("PUSH")) return "PUSH";
  if (d.startsWith("HOLD")) return "HOLD";
  if (d.startsWith("TEST")) return "TEST";
  return "OTHER";
}

function normalise(body: any): ExplainerInput | null {
  if (!body || typeof body !== "object") return null;
  const { decision, why, signals, actions, scope, mode, moments, whatChanged, nextSignal } = body;
  if (typeof decision !== "string" || typeof why !== "string") return null;
  if (!Array.isArray(signals)) return null;
  return {
    decision,
    state: parseState(decision),
    why,
    signals: signals.filter((s): s is string => typeof s === "string").slice(0, 8),
    actions: Array.isArray(actions)
      ? actions.filter((a): a is string => typeof a === "string").slice(0, 6)
      : undefined,
    scope: scope === "artist" || scope === "track" || scope === "campaign" || scope === "youtube" ? scope : undefined,
    mode: mode === "timeline" ? "timeline" : "decision",
    moments: Array.isArray(moments)
      ? moments.filter((m): m is string => typeof m === "string").slice(0, 12)
      : undefined,
    whatChanged: typeof whatChanged === "string" ? whatChanged : undefined,
    nextSignal: typeof nextSignal === "string" ? nextSignal : undefined,
  };
}

async function callAnthropic(input: ExplainerInput, key: string): Promise<ExplainerOutput | null> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: EXPLAINER_SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildExplainerUserMessage(input) }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (typeof text !== "string") return null;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (typeof parsed.aiRead !== "string" || typeof parsed.watch !== "string" || typeof parsed.ifConfirmed !== "string") return null;
    return {
      systemStance: typeof parsed.systemStance === "string" ? parsed.systemStance : "",
      aiRead: parsed.aiRead,
      watch: parsed.watch,
      ifConfirmed: parsed.ifConfirmed,
      confidence: ["High", "Medium", "Low"].includes(parsed.confidence) ? parsed.confidence : "Medium",
      confidenceNote: typeof parsed.confidenceNote === "string" ? parsed.confidenceNote : "",
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const input = normalise(body);
  if (!input) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  let output: ExplainerOutput | null = null;
  let source: "model" | "synth" = "synth";

  if (key) {
    output = await callAnthropic(input, key);
    if (output) source = "model";
  }
  if (!output) {
    output = synthesiseExplanation(input);
  }

  return NextResponse.json({ ...output, source });
}
