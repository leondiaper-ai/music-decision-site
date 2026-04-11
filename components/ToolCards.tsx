"use client";

import { motion } from "framer-motion";

const tools = [
  {
    number: "01",
    title: "Artist & Track Lens",
    tagline:
      "Drop in messy CSVs. See what's actually happening — and what to do next.",
    href: "/lens",
    inputs: ["Raw Spotify / streaming exports", "Noisy performance signals", "Mixed time windows"],
    outputs: ["Clear health status", "What's actually happening", "What to do next"],
    accent: "bg-electric",
    text: "text-paper",
  },
  {
    number: "02",
    title: "Campaign Timeline",
    tagline:
      "Every release moment, push and peak on one timeline — so you can see what actually moved the campaign.",
    href: "https://campaign-timeline-viewer.vercel.app",
    inputs: ["Release moments", "Activity log", "Performance markers"],
    outputs: ["Unified timeline", "Momentum read", "Cadence gaps"],
    accent: "bg-sun",
    text: "text-ink",
    external: true,
  },
  {
    number: "03",
    title: "YouTube Campaign Coach",
    tagline:
      "Map shorts, premieres and uploads to release moments. Structure, not guesswork.",
    href: "https://youtube-campaign-coach.vercel.app",
    inputs: ["Release window", "Channel context", "Asset inventory"],
    outputs: ["Posting plan", "Moment mapping", "Priority queue"],
    accent: "bg-mint",
    text: "text-ink",
    external: true,
  },
];

export default function ToolCards() {
  return (
    <section id="tools" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="eyebrow text-ink/60">04 — The Tools</span>
            <h2 className="headline font-display text-5xl md:text-7xl mt-3 max-w-3xl">
              Three tools.
              <br />
              <span className="italic font-light">One workflow.</span>
            </h2>
            <p className="text-ink/60 text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
              I built three tools that work together as one system — turning messy
              data into a clear next step.
            </p>
          </div>
          <p className="hidden md:block max-w-xs text-ink/70 text-sm leading-relaxed">
            Each tool is live and usable. They share one philosophy — make the
            next decision obvious.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((t, i) => {
            const isExternal = "external" in t && t.external;

            return (
              <motion.a
                key={t.title}
                href={t.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer noopener" : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className={`group rounded-3xl border p-7 flex flex-col hover:border-ink/40 transition-colors ${
                  t.number === "01"
                    ? "border-electric/20 hover:border-electric/50"
                    : "border-ink/10"
                } bg-cream`}
              >
                <div
                  className={`${t.accent} ${t.text} w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl mb-6 shadow-[4px_4px_0_0_rgba(14,14,14,1)]`}
                >
                  {t.number}
                </div>

                <h3 className="font-display font-bold text-3xl leading-tight mb-3">
                  {t.title}
                </h3>
                <p className="text-ink/70 text-sm leading-relaxed mb-6">
                  {t.tagline}
                </p>

                <div className="space-y-4 mb-6 pt-5 border-t border-ink/10">
                  <div>
                    <div className="eyebrow text-ink/50 mb-2">In</div>
                    <ul className="text-sm space-y-1">
                      {t.inputs.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-ink/30">—</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="eyebrow text-ink/50 mb-2">Out</div>
                    <ul className="text-sm space-y-1">
                      {t.outputs.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-signal">→</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium">
                  {t.number === "01" ? "Try the demo" : "Open tool"}
                  <span className="group-hover:translate-x-1 transition-transform">
                    {t.number === "01" ? "→" : "↗"}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Minimal usage footnote — no box, no emphasis */}
        <p className="mt-10 text-xs text-ink/35">
          Used weekly to guide artist, track and campaign decisions.
        </p>
      </div>
    </section>
  );
}
