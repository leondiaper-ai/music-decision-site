"use client";

import { motion } from "framer-motion";

export default function ArchiveHero() {
  return (
    <section className="relative pt-20 md:pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-10">
          <span className="eyebrow text-ink/60">
            Archive Theme — ARCH-001
          </span>
          <span className="eyebrow text-ink/40 hidden md:inline">
            Matt Kennard · Declassified UK
          </span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="headline text-[11vw] md:text-[7vw] lg:text-[6.5rem] font-display max-w-5xl"
        >
          British State Power
          <br />
          <span className="italic font-light">Ireland /</span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Northern Ireland</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="absolute left-0 right-0 bottom-1 md:bottom-2 h-3 md:h-4 bg-electric/20 -z-0"
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
          Partition, military presence, political strategy, and the long arc of
          British power in Ireland — mapped through investigative reporting and
          archived for long-term use.
        </motion.p>

        {/* Quiet framing line */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-4 text-sm md:text-base text-ink/50 italic max-w-2xl"
        >
          An experiment in turning fragmented reporting into structured
          intelligence.
        </motion.p>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-6 text-sm text-ink/50"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />3
            investigations archived
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            Active theme
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sun" />
            Last updated: Apr 2024
          </span>
        </motion.div>
      </div>
    </section>
  );
}
