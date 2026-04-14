"use client";

import { motion } from "framer-motion";

export default function NorthStarSystem() {
  return (
    <section className="relative py-24 md:py-36 border-t border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow text-ink/60 mb-4 block">The Decision Engine (AI-assisted)</span>
          <h2 className="headline font-display text-4xl md:text-6xl leading-[1.05]">
            We turn data into evidence.
            <br />
            <span className="italic font-light">
              And evidence into decisions.
            </span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/60 leading-snug max-w-2xl">
            Each tool below is a signal input. The decision engine interprets them together — using AI to read trajectory, flag risk and recommend the next move.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
