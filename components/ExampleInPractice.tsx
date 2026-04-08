"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "Scenario",
    body: "Mid-tier UK artist, new single. Save rate was strong in the first 48 hours, but reach began flattening by day four.",
  },
  {
    label: "System read",
    body: "High intent, weak distribution. The audience was responding — but the track wasn't reaching enough new listeners to sustain momentum.",
  },
  {
    label: "Decision",
    body: "Hold the paid push. Prioritise content cadence and organic audience growth before spending into a reach window that wasn't ready.",
  },
  {
    label: "Impact",
    body: "Avoided premature spend on a weak reach window. Gave the team a shared read and a clearer next step instead of a reactive media buy.",
  },
];

export default function ExampleInPractice() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-ink/10 bg-cream p-8 md:p-10"
        >
          <span className="eyebrow text-ink/50">Example in practice</span>
          <p className="text-ink/40 text-sm mt-2 mb-8 max-w-lg">
            A simple example of how the system turns signals into action.
          </p>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="font-display font-bold text-base mb-2">
                  {s.label}
                </div>
                <p className="text-sm text-ink/65 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
