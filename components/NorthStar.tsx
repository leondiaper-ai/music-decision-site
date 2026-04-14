"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NorthStar() {
  return (
    <section className="relative bg-ink text-paper py-20 md:py-28 overflow-hidden">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #FAF7F2 1px, transparent 1px), linear-gradient(to bottom, #FAF7F2 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="eyebrow text-paper/50 mb-6 block">
            Campaign Decision System
          </span>

          <h2 className="headline font-display text-[10vw] md:text-[6.5vw] lg:text-[5.8rem] leading-[0.95] tracking-tight">
            AI runs
            <br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-paper/65 leading-snug max-w-xl">
            From decision → content → spend → optimisation.
          </p>
          <p className="mt-4 text-sm md:text-base text-paper/45 leading-snug max-w-xl">
            Signals, behaviour and context are continuously interpreted to generate decisions.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-paper/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            Allocating spend based on live signals
          </div>

          {/* System log — makes the loop visible without adding UI */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-8 max-w-lg rounded-lg border border-paper/10 bg-paper/[0.03] p-4 font-mono text-[11px] leading-[1.7] text-paper/55"
          >
            <div className="text-paper/30 tracking-[0.18em] uppercase text-[10px] mb-2">[ system ]</div>
            <div><span className="text-paper/40">›</span> stream velocity <span className="text-signal">+32%</span> (7d)</div>
            <div><span className="text-paper/40">›</span> audience expansion detected across 2 segments</div>
            <div><span className="text-paper/40">›</span> pattern match: early breakout</div>
            <div className="mt-2 pt-2 border-t border-paper/10 text-paper/30 tracking-[0.18em] uppercase text-[10px]">[ decision ]</div>
            <div className="text-paper/85">
              <span className="text-signal">PUSH</span> — confidence <span className="text-paper/60">85%</span>
            </div>
            <div className="mt-2 pt-2 border-t border-paper/10 text-paper/30 tracking-[0.18em] uppercase text-[10px]">[ marketing ]</div>
            <div className="text-paper/85">scale spend — marquee + off-platform</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10"
          >
            <Link
              href="/campaign"
              className="group inline-flex items-center gap-2.5 rounded-full bg-signal text-paper px-7 py-3.5 text-sm font-medium hover:bg-paper hover:text-ink transition-colors"
            >
              Run a Campaign
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
