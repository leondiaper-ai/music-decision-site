"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-paper pt-24 md:pt-36 pb-10 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="headline font-display text-[14vw] md:text-[11vw] leading-[0.9]"
        >
          Decide
          <br />
          <span className="text-signal italic font-light">what's next.</span>
        </motion.h2>

        <div className="mt-16 grid md:grid-cols-12 gap-8 pt-10 border-t border-paper/15">
          <div className="md:col-span-5">
            <p className="text-paper/65 text-sm md:text-base leading-snug mb-6 max-w-sm">
              I design and prototype systems like this using AI, data, and simple
              logic.
            </p>
            <p className="text-paper/55 text-xs md:text-sm leading-snug mb-6 max-w-sm">
              Available for roles in creative technology and AI systems.
            </p>
            <div className="eyebrow text-paper/50 mb-3">Contact</div>
            <a
              href="mailto:leondiaper@gmail.com"
              className="font-display text-2xl md:text-3xl font-bold hover:text-signal transition-colors"
            >
              leondiaper@gmail.com
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow text-paper/50 mb-3">Tools</div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="/lens"
                  className="hover:text-signal transition-colors"
                >
                  Artist & Track Lens →
                </a>
              </li>
              <li>
                <a
                  href="https://campaign-timeline-viewer.vercel.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-signal transition-colors"
                >
                  Campaign Timeline ↗
                </a>
              </li>
              <li>
                <a
                  href="https://youtube-campaign-coach.vercel.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-signal transition-colors"
                >
                  YouTube Campaign Coach ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">Coming</div>
            <ul className="space-y-1.5 text-sm text-paper/70">
              <li>— Case studies</li>
              <li>
                — Experiments
                <ul className="mt-1 ml-4 space-y-1 text-paper/45 text-[13px]">
                  <li>
                    ·{" "}
                    <a
                      href="/archive/british-state-power-ireland"
                      className="hover:text-signal transition-colors"
                    >
                      Archive intelligence
                    </a>
                  </li>
                  <li>
                    ·{" "}
                    <a
                      href="/locations/feasibility-lens"
                      className="hover:text-signal transition-colors"
                    >
                      Film location scoring
                    </a>
                  </li>
                </ul>
              </li>
              <li>— Internal tools</li>
              <li>— About / profile</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/50">
          <span>© {new Date().getFullYear()} — Decision System</span>
          <span>Built for music teams who'd rather decide than dashboard.</span>
        </div>
      </div>
    </footer>
  );
}
