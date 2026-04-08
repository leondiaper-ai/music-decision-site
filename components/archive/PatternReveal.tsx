"use client";

import { motion } from "framer-motion";

const patterns = [
  {
    text: "Hidden political calculations between British and Irish elites have repeatedly shaped partition outcomes — away from public view.",
  },
  {
    text: "British military presence in Northern Ireland has not ended but transformed — the drawdown is strategic repositioning, not withdrawal.",
  },
  {
    text: "Elite and public reassessment of partition is accelerating, creating potential pressure points where British strategy may harden or adapt.",
  },
];

export default function PatternReveal() {
  return (
    <section id="pattern" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mb-12">
          <span className="eyebrow text-ink/60">
            02 — What pattern does this reveal?
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {patterns.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-electric/10 text-electric flex items-center justify-center font-display font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-base md:text-lg text-ink/80 leading-relaxed">
                  {p.text}
                </p>
              </div>
              {i < patterns.length - 1 && (
                <div className="hidden md:block absolute -right-5 top-0 bottom-0 w-px bg-ink/8" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
