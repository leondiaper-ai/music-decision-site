"use client";

import { motion } from "framer-motion";

const threads = [
  {
    label: "Related ARCH themes",
    items: [
      "UK–US power & foreign policy",
      "Intelligence services & secrecy",
      "Military, arms trade & security",
    ],
  },
  {
    label: "Potential INT angles",
    items: [
      "Reunification pressure and British state response",
      "Military restructuring as template for other theatres",
      "Elite consensus vs. democratic process on constitutional questions",
    ],
  },
  {
    label: "Source material",
    items: [
      "Declassified UK archive",
      "Silent Coup (2023) — related chapters",
      "The Racket (2015) — imperial structure analysis",
    ],
  },
];

export default function FutureLayer() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mb-12">
          <span className="eyebrow text-ink/60">
            06 — Future layer / related
          </span>
          <h2 className="headline font-display text-4xl md:text-5xl mt-3">
            Where this
            <br />
            <span className="italic font-light">connects next.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {threads.map((thread, i) => (
            <motion.div
              key={thread.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-ink/10 rounded-2xl p-7 md:p-8"
            >
              <span className="eyebrow text-electric mb-5 block">
                {thread.label}
              </span>
              <ul className="space-y-3">
                {thread.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-base text-ink/70 leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ink/20 mt-2.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
