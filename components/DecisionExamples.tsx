"use client";

import { motion } from "framer-motion";

const examples = [
  {
    tag: "TRACK STATUS",
    status: "TEST",
    statusColor: "bg-sun text-ink",
    summary: "Save rate strong. Reach weak.",
    metrics: [
      { k: "Save rate", v: "4.8%", tone: "text-mint" },
      { k: "Reach (7d)", v: "−18%", tone: "text-signal" },
      { k: "Skip rate", v: "32%", tone: "text-ink/70" },
    ],
    recommendation: "Push content. Hold paid spend until reach recovers.",
  },
  {
    tag: "CAMPAIGN SIGNAL",
    status: "UNEVEN",
    statusColor: "bg-signal text-paper",
    summary: "Strong opening, weak follow-through.",
    metrics: [
      { k: "Day 1 peak", v: "1.2M", tone: "text-mint" },
      { k: "Day 3 drop", v: "−61%", tone: "text-signal" },
      { k: "Retention", v: "Low", tone: "text-signal" },
    ],
    recommendation: "Tighten post-release cadence. Add day-4 and day-7 moments.",
  },
  {
    tag: "ARTIST HEALTH",
    status: "BUILDING",
    statusColor: "bg-electric text-paper",
    summary: "Catalogue quiet. New release momentum positive.",
    metrics: [
      { k: "Monthly Δ", v: "+9%", tone: "text-mint" },
      { k: "Catalogue", v: "Flat", tone: "text-ink/70" },
      { k: "Top market", v: "MX", tone: "text-ink" },
    ],
    recommendation: "Protect the release. Delay catalogue push by 2 weeks.",
  },
];

export default function DecisionExamples() {
  return (
    <section id="examples" className="relative py-24 md:py-36 bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="eyebrow text-paper/60">03 — Example Outputs</span>
            <h2 className="headline font-display text-5xl md:text-7xl mt-3 max-w-3xl">
              Not charts.
              <br />
              <span className="text-signal">Recommendations.</span>
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-paper/70 text-sm leading-relaxed">
            Illustrative only. Every output is scoped to a team's real decisions —
            release, paid, content, planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((ex, i) => (
            <motion.article
              key={ex.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl border border-paper/15 bg-paper/5 backdrop-blur-sm p-7 hover:bg-paper/10 hover:border-paper/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="eyebrow text-paper/60">{ex.tag}</span>
                <span
                  className={`${ex.statusColor} text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full`}
                >
                  {ex.status}
                </span>
              </div>

              <p className="font-display text-2xl md:text-3xl font-bold leading-tight mb-6">
                {ex.summary}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 pt-5 border-t border-paper/15">
                {ex.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="text-[10px] uppercase tracking-wider text-paper/50 mb-1">
                      {m.k}
                    </div>
                    <div className={`font-display font-bold text-lg ${m.tone}`}>
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 text-sm text-paper/85">
                <span className="text-signal mt-0.5">→</span>
                <span className="leading-snug">{ex.recommendation}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
