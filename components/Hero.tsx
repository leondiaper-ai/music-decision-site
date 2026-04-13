"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative pt-20 md:pt-28 pb-24 md:pb-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Eyebrow row */}
        <div className="flex items-center justify-between mb-10">
          <span className="eyebrow text-ink/60">01 — Positioning</span>
          <span className="eyebrow text-ink/60 hidden md:inline">v1 · Decision System</span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="headline text-[8.5vw] md:text-[6vw] lg:text-[5.4rem] font-display leading-[1.02]"
        >
          Most tools show data.
          <br />
          <span className="italic font-light">This system tells you</span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10">what to do next.</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
              className="absolute left-0 right-0 bottom-1 md:bottom-2 h-2.5 md:h-4 bg-signal -z-0"
            />
          </span>
        </motion.h1>

        {/* Sub + CTA grid */}
        <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="md:col-span-7 max-w-xl"
          >
            <p className="text-lg md:text-xl leading-snug text-ink/80">
              Signal, culture, audience and spend — combined into one decision.
            </p>
            <p className="mt-3 text-sm md:text-base text-ink/55">
              Not dashboards. Direction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="md:col-span-5 flex flex-wrap gap-3 md:justify-end"
          >
            <a
              href="/campaign"
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-signal transition-colors"
            >
              See the system
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/lens"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:border-ink hover:bg-ink hover:text-paper transition-colors"
            >
              Try the demo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
