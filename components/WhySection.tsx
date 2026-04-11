"use client";

import { motion } from "framer-motion";

const points = [
  {
    k: "Built around workflows",
    v: "Designed from how music teams actually work — releases, pushes, catalogue, content.",
  },
  {
    k: "For commercial & marketing",
    v: "Not a data science toy. Built for the people making day-to-day calls.",
  },
  {
    k: "Decisions, not dashboards",
    v: "Every screen should answer: what do we do next — and why.",
  },
];

export default function WhySection() {
  return (
    <section id="why" className="relative py-24 md:py-36 bg-blush">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">05 — Why this exists</span>
            <h2 className="headline font-display text-5xl md:text-7xl mt-3">
              The gap isn't
              <br />
              <span className="italic font-light">data.</span>
              <br />
              It's <span className="bg-ink text-paper px-3 -mx-1">decisions.</span>
            </h2>
          </div>

          <div className="md:col-span-7 md:pl-10">
            <p className="text-lg md:text-xl text-ink/80 leading-snug mb-10 max-w-xl">
              Teams already have data. What they don't have is a shared way to
              decide what to do next.
            </p>

            <div className="divide-y divide-ink/15 border-y border-ink/15">
              {points.map((p, i) => (
                <motion.div
                  key={p.k}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="py-6 grid md:grid-cols-12 gap-4"
                >
                  <div className="md:col-span-5 font-display font-bold text-xl">
                    {p.k}
                  </div>
                  <div className="md:col-span-7 text-ink/75 text-base leading-relaxed">
                    {p.v}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
