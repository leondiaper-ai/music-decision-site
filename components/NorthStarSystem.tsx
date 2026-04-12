"use client";

import { motion } from "framer-motion";

const inputs = [
  {
    label: "Signal",
    detail: "How audiences are responding.",
  },
  {
    label: "Activity",
    detail: "What the campaign is doing.",
  },
  {
    label: "Culture",
    detail: "What the campaign means and how it should feel.",
  },
];

const outcomes = [
  "A decision (TEST / HOLD / PUSH)",
  "A direction (what to do next)",
  "A spend allocation (where budget goes)",
  "A plan (what actually happens in the campaign)",
];

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

export default function NorthStarSystem() {
  return (
    <section className="relative py-24 md:py-36 border-t border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* ── 1. Introduce ──────────────────────────────── */}
        <motion.div {...fade} className="mb-20 md:mb-28 max-w-3xl">
          <span className="eyebrow text-ink/60 mb-4 block">
            The system
          </span>
          <h2 className="headline font-display text-4xl md:text-6xl leading-[1.05] mb-6">
            We don&apos;t collect more data.
            <br />
            <span className="italic font-light">
              We build better evidence to make better decisions.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-ink/70">
            For artists and their music.
          </p>
        </motion.div>

        {/* ── 2. Purpose ────────────────────────────────── */}
        <motion.div {...fade} className="mb-20 md:mb-28 max-w-2xl">
          <p className="text-base md:text-lg text-ink/75 leading-relaxed">
            The system exists to turn signal, activity, and cultural context
            into clear, confident decisions. Not more dashboards. Not more
            noise. Just better bets — on what to do next, where to spend,
            and how to move a campaign forward.
          </p>
        </motion.div>

        {/* ── 3. Inputs ─────────────────────────────────── */}
        <motion.div {...fade} className="mb-20 md:mb-28">
          <div className="eyebrow text-ink/50 mb-6">System inputs</div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {inputs.map((inp, i) => (
              <motion.div
                key={inp.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4"
              >
                <span className="font-display font-bold text-2xl text-ink/20 shrink-0 leading-none pt-0.5">
                  0{i + 1}
                </span>
                <div>
                  <div className="font-display font-bold text-xl mb-1">
                    {inp.label}
                  </div>
                  <p className="text-ink/65 text-sm md:text-base leading-snug">
                    {inp.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink/45">
            Each input is captured through the tools across the system.
          </p>
        </motion.div>

        {/* ── 4. Unifier ────────────────────────────────── */}
        <motion.div {...fade} className="mb-20 md:mb-28 max-w-2xl">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
            One system, not separate tools.
          </h3>
          <p className="text-base md:text-lg text-ink/70 leading-relaxed">
            All inputs feed into a single system that combines audience
            behaviour, campaign activity, cultural direction, and historical
            patterns to produce one clear outcome.
          </p>
        </motion.div>

        {/* ── 5. Outcome ────────────────────────────────── */}
        <motion.div {...fade} className="mb-20 md:mb-28">
          <div className="eyebrow text-ink/50 mb-6">System output</div>
          <div className="rounded-2xl bg-ink text-paper p-8 md:p-10">
            <ul className="space-y-3 mb-8">
              {outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-base md:text-lg text-paper/85"
                >
                  <span className="text-signal mt-0.5 shrink-0">→</span>
                  {o}
                </li>
              ))}
            </ul>
            <p className="text-paper/55 text-sm border-t border-paper/15 pt-5">
              Every part of the system exists to improve this decision.
            </p>
          </div>
        </motion.div>

        {/* ── 6. Philosophy ─────────────────────────────── */}
        <motion.div {...fade} className="mb-16 md:mb-20 max-w-2xl">
          <p className="text-base md:text-lg text-ink/75 leading-relaxed">
            This is not about more data. It&apos;s about building enough
            evidence — across signal and culture — to make the best possible
            decision at the right time.
          </p>
        </motion.div>

        {/* ── 7. Future (restrained) ────────────────────── */}
        <motion.div {...fade}>
          <p className="text-sm text-ink/40 italic">
            Over time, the system doesn&apos;t just recommend — it can act.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
