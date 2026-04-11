"use client";

import { motion } from "framer-motion";

const blocks = [
  {
    title: "Artist Health",
    number: "01",
    body: "Assess momentum, catalogue strength and audience signals in one view.",
    bg: "bg-electric",
    text: "text-paper",
    shape: "rounded-[36px]",
    col: "md:col-span-5 md:row-span-2",
    rotate: "-rotate-2",
  },
  {
    title: "Track Signals",
    number: "02",
    body: "Save rate, reach, skips — translated into a simple status.",
    bg: "bg-sun",
    text: "text-ink",
    shape: "rounded-full",
    col: "md:col-span-4",
    rotate: "rotate-1",
  },
  {
    title: "Campaign Timeline",
    number: "03",
    body: "See every release moment, push and performance peak in one line.",
    bg: "bg-blush",
    text: "text-ink",
    shape: "rounded-[28px]",
    col: "md:col-span-3",
    rotate: "-rotate-1",
  },
  {
    title: "YouTube Planning",
    number: "04",
    body: "Structure shorts, premieres and uploads around release moments.",
    bg: "bg-mint",
    text: "text-ink",
    shape: "rounded-[28px]",
    col: "md:col-span-3",
    rotate: "rotate-2",
  },
  {
    title: "Decision Output",
    number: "05",
    body: "A clear recommendation — not another chart.",
    bg: "bg-signal",
    text: "text-paper",
    shape: "rounded-[36px]",
    col: "md:col-span-4",
    rotate: "-rotate-1",
  },
];

export default function SystemSection() {
  return (
    <section id="system" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="eyebrow text-ink/60">02 — The System</span>
            <h2 className="headline font-display text-5xl md:text-7xl mt-3 max-w-3xl">
              Five parts.
              <br />
              One recommendation.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-ink/70 text-sm leading-relaxed">
            Most teams look at these separately. This combines them into one clear
            decision.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-8 md:auto-rows-[220px]">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, rotate: 0 }}
              className={`${b.col} ${b.bg} ${b.text} ${b.shape} ${b.rotate} p-7 md:p-8 flex flex-col justify-between min-h-[220px] shadow-[8px_8px_0_0_rgba(14,14,14,1)] transition-transform`}
            >
              <div className="flex items-start justify-between">
                <span className="eyebrow opacity-70">{b.number}</span>
                <span className="opacity-70 text-lg">↗</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-3xl md:text-4xl leading-none mb-3">
                  {b.title}
                </h3>
                <p className="text-sm md:text-base opacity-90 max-w-[30ch]">{b.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
