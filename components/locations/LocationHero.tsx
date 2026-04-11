"use client";

import { motion } from "framer-motion";

const flowSteps = [
  { label: "Creative request", accent: true },
  { label: "Infrastructure" },
  { label: "Authorities" },
  { label: "Time · Cost · Risk" },
];

export default function LocationHero() {
  return (
    <section className="relative pt-20 md:pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-10">
          <span className="eyebrow text-ink/60">
            Decision Support System
          </span>
          <span className="eyebrow text-ink/40 hidden md:inline">
            Concept · Location Intelligence
          </span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="headline text-[11vw] md:text-[7vw] lg:text-[6.5rem] font-display max-w-5xl"
        >
          Location Feasibility
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">Lens</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="absolute left-0 right-0 bottom-1 md:bottom-2 h-3 md:h-4 bg-signal/20 -z-0"
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 text-lg md:text-xl leading-snug text-ink/70 max-w-2xl"
        >
          Turn a creative location idea into a clear, real-world decision.
        </motion.p>

        {/* Quiet framing line */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-3 text-sm md:text-base text-ink/50 italic max-w-2xl"
        >
          An experiment in translating creative ideas into real-world decisions.
        </motion.p>

        {/* Supporting copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-4 border-l-2 border-signal/30 pl-5"
        >
          <p className="text-sm text-ink/50 leading-relaxed italic max-w-md">
            Most tools show you where something is.
            <br />
            This shows you what it will do to your project.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-14 flex flex-wrap items-center gap-3 md:gap-0"
        >
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <span
                className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  step.accent
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper border-ink/10 text-ink/80"
                }`}
              >
                {step.label}
              </span>
              {i < flowSteps.length - 1 && (
                <span className="mx-2 md:mx-3 text-ink/25 text-sm">→</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
