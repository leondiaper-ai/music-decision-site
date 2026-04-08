"use client";

import { motion } from "framer-motion";

const tools = [
  {
    number: "01",
    title: "Artist & Track Lens",
    tagline:
      "Teams check streams but rarely agree on what they mean. This tool reads artist health and track signals together — and outputs a clear recommendation: push, hold, or shift.",
    href: "https://pih-v2.vercel.app/label",
    inputs: ["Artist identifier", "Track performance window", "Streaming signals"],
    outputs: ["Health status", "Track signal read", "Next-step recommendation"],
    accent: "bg-electric",
    text: "text-paper",
  },
  {
    number: "02",
    title: "Campaign Timeline",
    tagline:
      "Release activity lives in spreadsheets, calendars, and Slack threads. This tool puts every moment, push, and performance peak on one timeline — so the whole team sees the same picture.",
    href: "https://campaign-timeline-viewer.vercel.app",
    inputs: ["Release moments", "Activity log", "Performance markers"],
    outputs: ["Unified timeline", "Momentum read", "Cadence gaps"],
    accent: "bg-sun",
    text: "text-ink",
  },
  {
    number: "03",
    title: "YouTube Campaign Coach",
    tagline:
      "YouTube plans often start strong and lose structure by week three. This tool maps shorts, premieres, and uploads to release moments — and flags when cadence drops before the team notices.",
    href: "https://youtube-campaign-coach.vercel.app",
    inputs: ["Release window", "Channel context", "Asset inventory"],
    outputs: ["Posting plan", "Moment mapping", "Priority queue"],
    accent: "bg-mint",
    text: "text-ink",
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
              I built these tools because marketing teams already have data — but
              no shared way to turn it into decisions.
            </p>
          </div>
          <p className="hidden md:block max-w-xs text-ink/70 text-sm leading-relaxed">
            Each tool is live and usable. They share one philosophy — make the
            next decision obvious.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((t, i) => (
            <motion.a
              key={t.title}
              href={t.href}
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-ink/10 bg-cream p-7 flex flex-col hover:border-ink/40 transition-colors"
            >
              <div className={`${t.accent} ${t.text} w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl mb-6 shadow-[4px_4px_0_0_rgba(14,14,14,1)]`}>
                {t.number}
              </div>

              <h3 className="font-display font-bold text-3xl leading-tight mb-3">
                {t.title}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed mb-6">{t.tagline}</p>

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
                Open tool
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Used in practice strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-ink/8 bg-cream px-7 py-6"
        >
          <p className="eyebrow text-ink/40 mb-4">Used in practice</p>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-ink/70 leading-relaxed">
            <p>
              Used weekly to assess artist and track health across a priority
              roster — replacing ad-hoc spreadsheet reviews.
            </p>
            <p>
              Campaign timelines built for live releases at a major label,
              aligning marketing, digital, and commercial teams around one view.
            </p>
            <p>
              YouTube content plans structured around album rollouts — tracking
              cadence, drops, and execution across 24-week campaigns.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
