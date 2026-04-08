"use client";

import { motion } from "framer-motion";

const layers = [
  {
    code: "ARCH",
    label: "Archive theme",
    question: "What pattern does this reveal?",
    description:
      "The organising layer. Each ARCH page gathers the strongest reporting on a specific system of power and grows over time.",
    color: "bg-electric",
    textColor: "text-paper",
  },
  {
    code: "INV",
    label: "Investigation",
    question: "What happened here?",
    description:
      "Individual investigations, lightly reframed to sit within the archive. Tagged to relevant ARCH themes. Nothing is rewritten — this preserves and makes work reusable.",
    color: "bg-sun",
    textColor: "text-ink",
  },
  {
    code: "INT",
    label: "Intervention",
    question: "Why does this matter now?",
    description:
      "Used sparingly. Moments where the archive supports an argument or highlights a pressure point. Draws directly from ARCH and INV layers.",
    color: "bg-mint",
    textColor: "text-ink",
  },
];

export default function ArchiveStructure() {
  return (
    <section id="structure" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">
              04 — How the archive works
            </span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              Three layers.
              <br />
              <span className="italic font-light">One system.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/65 leading-relaxed max-w-lg">
              The archive is not a blog or a feed. It is a structured knowledge
              system — built so that investigative reporting becomes a permanent,
              usable intelligence tool rather than something that disappears into
              a news cycle.
            </p>
          </div>
        </div>

        {/* Three-layer diagram */}
        <div className="grid md:grid-cols-3 gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.code}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Code badge */}
              <div
                className={`${layer.color} ${layer.textColor} inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold text-sm mb-5`}
              >
                {layer.code}
                <span className="opacity-60 font-normal">· {layer.label}</span>
              </div>

              {/* Question */}
              <p className="font-display font-bold text-xl md:text-2xl mb-3 leading-tight">
                &ldquo;{layer.question}&rdquo;
              </p>

              {/* Description */}
              <p className="text-sm text-ink/60 leading-relaxed">
                {layer.description}
              </p>

              {/* Connector arrow (between cards) */}
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
          className="hidden md:block mt-8 h-px bg-gradient-to-r from-electric via-sun to-mint"
        />
      </div>
    </section>
  );
}
