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
            Campaign System
          </span>

          <h2 className="headline font-display text-[10vw] md:text-[6.5vw] lg:text-[5.8rem] leading-[0.95] tracking-tight">
            AI runs
            <br />
            <span className="italic font-light text-signal">the campaign.</span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-paper/65 leading-snug max-w-xl">
            From decision → content → spend → optimisation.
          </p>

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
