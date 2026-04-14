"use client";

/**
 * WhereNext
 *
 * A short, grounded framing block that positions the product on a
 * three-stage timeline: structured engine → AI interpretation layer →
 * agent-assisted workflows. Intentionally small. No hype, no buzzwords.
 */

import { motion } from "framer-motion";

interface Stage {
  tag: "Now" | "Layered" | "Next";
  title: string;
  body: string;
  dot: string; // tailwind colour
}

const STAGES: Stage[] = [
  {
    tag: "Now",
    title: "Structured decision engine",
    body: "Streams, saves, retention and reach combined into a single decision — PUSH, HOLD, or TEST.",
    dot: "bg-push",
  },
  {
    tag: "Layered",
    title: "AI interpretation layer",
    body: "On top of the engine, AI adds perspective — shift potential, risk signals, and pattern reads grounded in the same inputs.",
    dot: "bg-hold",
  },
  {
    tag: "Next",
    title: "Agent-assisted workflows",
    body: "Same foundation, lighter touch. Context-aware recommendations, scenario simulation, and decisions that adapt as signals evolve.",
    dot: "bg-test",
  },
];

export default function WhereNext() {
  return (
    <section id="where-next" className="relative py-24 md:py-32 bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: framing */}
          <div className="md:col-span-5">
            <div className="eyebrow text-ink/45 mb-4">06 — Trajectory</div>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Where this goes next.
            </h2>
            <p className="mt-6 text-base md:text-lg text-ink/65 leading-relaxed max-w-md">
              A structured decision engine, with AI as an interpretation layer — built to evolve toward agent-assisted workflows.
            </p>
            <p className="mt-3 text-sm text-ink/45 leading-relaxed max-w-md">
              The foundation is deterministic. The intelligence is layered. The direction is agent-like, not autonomous.
            </p>
          </div>

          {/* Right: three stages */}
          <div className="md:col-span-7">
            <ol className="space-y-5">
              {STAGES.map((s, i) => (
                <motion.li
                  key={s.tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-xl border border-ink/10 bg-cream/60 p-5 md:p-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-ink/50">
                      {s.tag}
                    </span>
                  </div>
                  <div className="text-[15px] md:text-base font-semibold text-ink">
                    {s.title}
                  </div>
                  <p className="mt-1.5 text-sm md:text-[14.5px] text-ink/60 leading-relaxed">
                    {s.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
