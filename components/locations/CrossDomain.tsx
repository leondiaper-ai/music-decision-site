"use client";

import { motion } from "framer-motion";

const domains = [
  { name: "Music", question: "Should we push this track?" },
  { name: "Archive", question: "What pattern does this reveal?" },
  { name: "YouTube", question: "What should we do next?" },
  { name: "Locations", question: "What happens if we choose this?" },
];

export default function CrossDomain() {
  return (
    <section id="pattern" className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mb-14">
          <span className="eyebrow text-ink/60">
            04 — Cross-domain thinking
          </span>
          <h2 className="headline font-display text-4xl md:text-5xl mt-3">
            A pattern
            <br />
            <span className="italic font-light">across domains.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-14">
          {domains.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-ink/10 rounded-2xl p-7 md:p-8 bg-paper hover:border-ink/20 transition-colors"
            >
              <span className="eyebrow text-electric mb-4 block">
                {d.name}
              </span>
              <p className="font-display font-bold text-lg md:text-xl leading-tight">
                {d.question}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <p className="font-display font-bold text-xl md:text-2xl leading-snug mb-2">
            Different domains. Same core problem.
          </p>
          <p className="text-base text-ink/55 leading-relaxed">
            Turning messy signals into clear decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
