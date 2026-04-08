"use client";

import { motion } from "framer-motion";

const featured = [
  {
    title: "Irish PM proposed accepting Northern Ireland's union with Britain in 1983",
    source: "Declassified UK",
    date: "11 Apr 2024",
    summary:
      "Newly surfaced documents reveal how senior Irish political figures privately calculated around partition — exposing the distance between public rhetoric and closed-door strategy.",
    tag: "Political calculation",
  },
  {
    title: "The vanishing UK military presence in Northern Ireland",
    source: "Declassified UK",
    date: "9 Apr 2024",
    summary:
      "A detailed account of how British military presence has been drawn down and restructured — not as peace, but as a quieter form of strategic positioning.",
    tag: "Military strategy",
  },
];

export default function FeaturedInvestigations() {
  return (
    <section className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mb-12">
          <span className="eyebrow text-ink/60">
            03 — Featured investigations
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((inv, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.12,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative border border-ink/10 rounded-2xl p-8 md:p-10 bg-paper hover:border-ink/20 transition-colors"
            >
              {/* Tag */}
              <span className="inline-block eyebrow text-electric mb-5">
                {inv.tag}
              </span>

              {/* Title */}
              <h3 className="font-display font-bold text-2xl md:text-[1.65rem] leading-tight mb-4">
                {inv.title}
              </h3>

              {/* Summary */}
              <p className="text-base text-ink/70 leading-relaxed mb-6">
                {inv.summary}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-ink/45">
                <span>{inv.source}</span>
                <span className="w-1 h-1 rounded-full bg-ink/25" />
                <span>{inv.date}</span>
              </div>

              {/* Hover arrow */}
              <span className="absolute top-8 right-8 text-ink/20 group-hover:text-electric transition-colors text-lg">
                ↗
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
