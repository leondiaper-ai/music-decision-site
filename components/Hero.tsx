"use client";

import { motion } from "framer-motion";

const nodes = [
  { label: "Artist",   color: "bg-electric text-paper", x: "6%",  y: "18%", rotate: -6 },
  { label: "Track",    color: "bg-sun text-ink",        x: "28%", y: "58%", rotate: 4  },
  { label: "Campaign", color: "bg-blush text-ink",      x: "52%", y: "12%", rotate: -3 },
  { label: "YouTube",  color: "bg-mint text-ink",       x: "72%", y: "62%", rotate: 6  },
  { label: "Decision", color: "bg-signal text-paper",   x: "86%", y: "22%", rotate: -4 },
];

export default function Hero() {
  return (
    <section id="top" className="relative pt-20 md:pt-28 pb-24 md:pb-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Eyebrow row */}
        <div className="flex items-center justify-between mb-10">
          <span className="eyebrow text-ink/60">01 — Introduction</span>
          <span className="eyebrow text-ink/60 hidden md:inline">v1 · Decision System</span>
        </div>

        {/* Subtle supporting tagline above the headline */}
        <p className="font-display italic text-lg md:text-xl text-ink/55 mb-5">
          Music marketing, but with decisions.
        </p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="headline text-[8.5vw] md:text-[6vw] lg:text-[5.4rem] font-display leading-[1.02]"
        >
          Most marketing tools show data.
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
            className="md:col-span-6 max-w-xl"
          >
            <p className="text-lg md:text-xl leading-snug text-ink/80">
              Artist health, track signals, campaign moments and YouTube planning —
              combined into one clear recommendation.
            </p>
            <p className="mt-3 text-sm md:text-base text-ink/55">
              A system for turning signals into decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="md:col-span-6 flex flex-wrap gap-3 md:justify-end"
          >
            <a
              href="/lens"
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-signal transition-colors"
            >
              Try the demo
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#system"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:border-ink hover:bg-ink hover:text-paper transition-colors"
            >
              Explore the system
            </a>
          </motion.div>
        </div>

        {/* Diagram caption — explains the system in one line */}
        <p className="mt-16 md:mt-24 mb-4 text-sm md:text-base text-ink/60">
          A simple system: multiple signals → one decision.
        </p>

        {/* Animated node diagram */}
        <div className="relative h-[380px] md:h-[440px] rounded-3xl bg-cream border border-ink/10 overflow-hidden">
          {/* Grid bg */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #0E0E0E 1px, transparent 1px), linear-gradient(to bottom, #0E0E0E 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Connection line (drawn as animated SVG) */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M 90 140 Q 300 380 460 170 T 820 220 T 1200 160"
              fill="none"
              stroke="#0E0E0E"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
            />
          </svg>

          {/* Floating nodes */}
          {nodes.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: n.rotate }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, rotate: 0, scale: 1.04 }}
              style={{ left: n.x, top: n.y }}
              className={`absolute ${n.color} px-5 py-3 rounded-2xl font-display text-xl md:text-2xl font-bold shadow-[6px_6px_0_0_rgba(14,14,14,1)] cursor-default`}
            >
              {n.label}
            </motion.div>
          ))}

          {/* Label corner */}
          <div className="absolute bottom-4 left-4 eyebrow text-ink/60">
            Artist → Track → Campaign → YouTube → Decision
          </div>
          <div className="absolute bottom-4 right-4 eyebrow text-ink/40">
            Fig. 01 — system map
          </div>
        </div>
      </div>
    </section>
  );
}
