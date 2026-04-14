"use client";

import { motion } from "framer-motion";

const examples = [
  {
    tag: "TRACK STATUS",
    status: "TEST",
    statusColor: "bg-test text-paper",
    summary: "Saves are strong. Reach isn't catching.",
    metrics: [
      { k: "Save rate", v: "4.8%", tone: "text-mint" },
      { k: "Reach (7d)", v: "−18%", tone: "text-signal" },
      { k: "Skip rate", v: "32%", tone: "text-paper" },
    ],
    recommendation: "Low-spend paid reach test. Don't scale until reach clears baseline.",
    consequence: "Stops a full push against a signal that hasn't radiated yet.",
  },
  {
    tag: "CAMPAIGN SIGNAL",
    status: "PUSH",
    statusColor: "bg-push text-ink",
    summary: "Opening landed. Momentum is leaking by day three.",
    metrics: [
      { k: "Day 1 peak", v: "1.2M", tone: "text-mint" },
      { k: "Day 3 drop", v: "−61%", tone: "text-signal" },
      { k: "Retention", v: "Low", tone: "text-signal" },
    ],
    recommendation: "Cadence intervention. Ship day-4 and day-7 moments this week.",
    consequence: "Without a second push, the opening spend is paying for a one-day spike.",
  },
  {
    tag: "ARTIST HEALTH",
    status: "HOLD",
    statusColor: "bg-hold text-ink",
    summary: "Catalogue is flat. The new release is carrying everything.",
    metrics: [
      { k: "Monthly Δ", v: "+9%", tone: "text-mint" },
      { k: "Catalogue", v: "Flat", tone: "text-paper" },
      { k: "Top market", v: "MX", tone: "text-paper" },
    ],
    recommendation: "Pull catalogue spend. Protect the release window for two weeks.",
    consequence: "Spending into the base right now teaches the wrong lesson about what's working.",
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
            Most campaigns spend before they understand what&rsquo;s actually happening. These are the calls that replace that.
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
                <span className="eyebrow text-paper/75 font-semibold">{ex.tag}</span>
                <span
                  className={`${ex.statusColor} text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full`}
                >
                  {ex.status}
                </span>
              </div>

              <p className="font-display text-2xl md:text-3xl font-bold leading-tight mb-6 text-paper">
                {ex.summary}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 pt-5 border-t border-paper/25">
                {ex.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="text-[10px] uppercase tracking-wider text-paper/70 font-semibold mb-1">
                      {m.k}
                    </div>
                    <div className={`font-display font-bold text-lg ${m.tone}`}>
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-paper/20 space-y-2">
                <div className="flex items-start gap-3 text-[15px] font-medium text-paper/95">
                  <span className="text-signal mt-0.5">→</span>
                  <span className="leading-snug">{ex.recommendation}</span>
                </div>
                <p className="pl-6 text-[12px] leading-snug text-paper/55 italic">
                  {ex.consequence}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
