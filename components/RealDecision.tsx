"use client";

import { motion } from "framer-motion";

const signals = [
  { label: "Save rate",        value: "Strong", detail: "4.8%" },
  { label: "Reach",            value: "Weak",   detail: "−18%" },
  { label: "Playlist adds",    value: "Low",    detail: null },
  { label: "Early engagement", value: "High",   detail: null },
];

export default function RealDecision() {
  return (
    <section
      id="a-real-decision"
      className="relative py-24 md:py-32 border-t border-ink/10"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Section header */}
        <div className="mb-12 md:mb-14 max-w-3xl">
          <span className="eyebrow text-ink/60">A real decision</span>
          <h2 className="headline font-display text-4xl md:text-6xl mt-3 leading-[1.05]">
            Given this data,
            <br />
            <span className="italic font-light">what would you do?</span>
          </h2>
        </div>

        {/* Input → Output → Why */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-12 gap-8 md:gap-12 items-start"
        >
          {/* Input column */}
          <div className="md:col-span-5">
            <div className="eyebrow text-ink/45 mb-5">Input</div>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {signals.map((s) => (
                <li
                  key={s.label}
                  className="py-3.5 flex items-baseline justify-between gap-4"
                >
                  <span className="text-ink/75 text-sm md:text-base">
                    {s.label}
                  </span>
                  <span className="font-display font-bold text-ink text-base md:text-lg">
                    {s.value}
                    {s.detail && (
                      <span className="font-medium text-ink/40 ml-1.5 text-sm">
                        ({s.detail})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bridge arrow — desktop only, calm not gimmicky */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center text-ink/25 text-3xl pt-10">
            →
          </div>

          {/* Output → Why column */}
          <div className="md:col-span-6">
            <div className="eyebrow text-ink/45 mb-5">Output</div>
            <div className="rounded-2xl bg-ink text-paper p-7 md:p-9">
              <div className="font-display font-bold text-[3.25rem] md:text-7xl leading-none mb-6 tracking-tight flex items-center gap-3">
                <span className="text-signal">→</span>
                <span>PUSH</span>
              </div>
              <div className="border-t border-paper/15 pt-5">
                <div className="eyebrow text-paper/50 mb-2">Action</div>
                <p className="text-paper text-base md:text-lg leading-snug max-w-md">
                  Increase paid support to scale reach.
                </p>
              </div>
              <div className="border-t border-paper/15 pt-5 mt-5">
                <div className="eyebrow text-paper/50 mb-2">Why</div>
                <p className="text-paper/85 text-base md:text-lg leading-snug max-w-md">
                  Strong intent, weak reach. The track is working — it just needs
                  scale.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Closing line — calm, confident, no hype */}
        <p className="mt-12 md:mt-16 text-base md:text-lg text-ink/55 max-w-2xl">
          Most teams would debate this. This system makes the call.
        </p>
      </div>
    </section>
  );
}
