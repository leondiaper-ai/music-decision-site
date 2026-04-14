"use client";

import { motion } from "framer-motion";

const points = [
  {
    k: "Data isn't the bottleneck.",
    v: "Teams have more dashboards than ever. The week still ends without a clear answer on what actually moved.",
  },
  {
    k: "Budgets deploy anyway.",
    v: "Spend gets committed before anyone can explain what's working. That's the real cost of unclear decisions.",
  },
  {
    k: "Clarity is the product.",
    v: "Every screen here answers one question: what do we do next — and what would change that call.",
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
              Teams don't lack data. They lack clarity. And budget still gets
              deployed — every week — against signals no one can fully explain.
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
