"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Faster feasibility",
    text: "Know within minutes whether a location idea is viable — before committing time or budget to exploring it.",
    color: "bg-signal",
  },
  {
    title: "Fewer surprises",
    text: "Surface the hidden friction — authorities, paperwork, resident issues — before they surface themselves on shoot day.",
    color: "bg-electric",
  },
  {
    title: "Better planning",
    text: "Give producers and coordinators a realistic picture — lead times, costs, dependencies — not just a pin on a map.",
    color: "bg-sun",
  },
  {
    title: "Institutional memory",
    text: "Capture what actually happened — not what was predicted. Every shoot makes the next decision smarter.",
    color: "bg-mint",
  },
];

export default function WhyThisMatters() {
  return (
    <section id="why" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">03 — Why this matters</span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              From search to
              <br />
              <span className="italic font-light">decision intelligence.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/65 leading-relaxed max-w-lg">
              Most systems optimise for discovery. This optimises for
              decision-making under uncertainty.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-ink/10 rounded-2xl p-7 md:p-8 hover:border-ink/20 transition-colors"
            >
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${card.color} mb-5`}
              />
              <h3 className="font-display font-bold text-lg mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
