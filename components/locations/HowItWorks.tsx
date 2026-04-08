"use client";

import { motion } from "framer-motion";

const layers = [
  {
    step: "01",
    code: "Intent → Infrastructure",
    question: "What does this actually mean?",
    description:
      "Translate vague creative language into real-world logistical implications.",
    mappings: [
      { from: "cobbled street", to: "public highway, heritage surface" },
      { from: "central", to: "traffic, residents, restricted zones" },
      { from: "small crew", to: "lighter footprint, simpler permits" },
      { from: "daytime", to: "reduced noise / night complexity" },
    ],
    color: "bg-signal",
    textColor: "text-paper",
  },
  {
    step: "02",
    code: "Infrastructure → Authorities",
    question: "Who controls this space?",
    description:
      "Map the scenario to the bodies, agencies, and owners who have jurisdiction.",
    mappings: [
      { from: "public highway", to: "borough council highways dept" },
      { from: "traffic impact", to: "TfL notification / approval" },
      { from: "heritage area", to: "conservation officer review" },
      { from: "private land adj.", to: "estate or freeholder consent" },
    ],
    color: "bg-electric",
    textColor: "text-paper",
  },
  {
    step: "03",
    code: "Memory → Intelligence",
    question: "What happened last time?",
    description:
      "The system learns from real outcomes — not just permits, but what actually happens on the ground.",
    mappings: [
      { from: "delays", to: "actual vs. estimated timelines" },
      { from: "paperwork pain", to: "which forms caused friction" },
      { from: "hidden rules", to: "unwritten local requirements" },
      { from: "responsiveness", to: "who replies, who doesn't" },
    ],
    color: "bg-mint",
    textColor: "text-ink",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">
              02 — How it works
            </span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              Three layers.
              <br />
              <span className="italic font-light">One translation.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/65 leading-relaxed max-w-lg">
              The system doesn&apos;t search for locations. It translates a
              creative intent into operational reality, one layer at a time.
            </p>
          </div>
        </div>

        {/* Three-layer cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative border border-ink/10 rounded-2xl p-7 md:p-8 bg-paper"
            >
              {/* Code badge */}
              <div
                className={`${layer.color} ${layer.textColor} inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold text-sm mb-5`}
              >
                {layer.step}
                <span className="opacity-60 font-normal">
                  · {layer.code}
                </span>
              </div>

              {/* Question */}
              <p className="font-display font-bold text-xl md:text-2xl mb-3 leading-tight">
                &ldquo;{layer.question}&rdquo;
              </p>

              {/* Description */}
              <p className="text-sm text-ink/60 leading-relaxed mb-5">
                {layer.description}
              </p>

              {/* Mappings */}
              <div className="space-y-2.5">
                {layer.mappings.map((m) => (
                  <div
                    key={m.from}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="font-medium text-ink/80 flex-shrink-0">
                      {m.from}
                    </span>
                    <span className="text-ink/25 flex-shrink-0">→</span>
                    <span className="text-ink/55">{m.to}</span>
                  </div>
                ))}
              </div>

              {/* Connector arrow */}
              {i < layers.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center text-ink/25 text-lg">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Flow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          className="hidden md:block mt-8 h-px bg-gradient-to-r from-signal via-electric to-mint"
        />
      </div>
    </section>
  );
}
