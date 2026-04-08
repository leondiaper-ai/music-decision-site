"use client";

import { motion } from "framer-motion";

export default function ThemeSummary() {
  return (
    <section id="theme" className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Left label */}
          <div className="md:col-span-4">
            <span className="eyebrow text-ink/60">01 — Theme summary</span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              What this
              <br />
              <span className="italic font-light">archive tracks.</span>
            </h2>
          </div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8 md:pl-8"
          >
            <p className="text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl mb-8">
              This archive collects reporting on British state power as it
              operates in Ireland and Northern Ireland — including partition,
              military presence, political calculation, and long-term
              constitutional strategy.
            </p>
            <p className="text-base text-ink/65 leading-relaxed max-w-2xl mb-8">
              These entries are not part of current Gaza, arms, or intelligence
              investigations, but they inform future work on British state
              behaviour, imperial legacy, and the exercise of constitutional
              power.
            </p>
            <div className="border-l-2 border-electric/30 pl-5">
              <p className="text-sm text-ink/55 leading-relaxed italic">
                The archive is organised around patterns of power, not news
                cycles. Each theme grows slowly over time — it is never
                &quot;finished.&quot; It is designed to be useful to journalists,
                lawyers, researchers, and serious readers who want to understand
                systems, not just individual stories.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
