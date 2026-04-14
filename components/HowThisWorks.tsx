"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "Input",
    body: "Real campaign signals (not dashboards).",
  },
  {
    label: "System",
    body: "Simple logic that cuts through noise.",
  },
  {
    label: "Output",
    body: "A decision you can actually act on.",
  },
];

export default function HowThisWorks() {
  return (
    <section
      id="how-this-works"
      className="relative py-20 md:py-28 border-t border-ink/10"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <span className="eyebrow text-ink/60">How this works</span>

        <div className="mt-8 grid md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-5"
            >
              <span className="font-display font-bold text-3xl text-ink/25 shrink-0 leading-none pt-1">
                0{i + 1}
              </span>
              <div>
                <div className="font-display font-bold text-xl mb-1.5">
                  {s.label}
                  <span className="text-ink/30 ml-2">→</span>
                </div>
                <p className="text-ink/70 text-sm md:text-base leading-snug max-w-xs">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
