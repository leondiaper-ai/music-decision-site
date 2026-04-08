"use client";

import { motion } from "framer-motion";

export default function LocationFooter() {
  return (
    <footer className="relative bg-ink text-paper pt-24 md:pt-32 pb-10 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="headline font-display text-[11vw] md:text-[8vw] leading-[0.9] max-w-4xl"
        >
          Decision support,
          <br />
          <span className="text-signal italic font-light">
            not dashboard clutter.
          </span>
        </motion.h2>

        <p className="mt-10 text-lg text-paper/60 leading-relaxed max-w-xl">
          The Location Feasibility Lens is a concept system — designed to show
          how operational intelligence can replace guesswork in location
          planning and logistics.
        </p>

        <div className="mt-16 grid md:grid-cols-12 gap-8 pt-10 border-t border-paper/15">
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">System</div>
            <p className="text-sm text-paper/40 leading-relaxed">
              Intent → Infrastructure → Authorities
              <br />
              Creative request → Operational plan
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">This concept</div>
            <p className="text-sm text-paper/40 leading-relaxed">
              Location Feasibility Lens
              <br />
              Decision support for location managers
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">Navigation</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href="/" className="hover:text-signal transition-colors">
                ← Back to main site
              </a>
              <a
                href="#example"
                className="text-paper/40 hover:text-signal transition-colors"
              >
                Example output
              </a>
              <a
                href="#how"
                className="text-paper/40 hover:text-signal transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/40">
          <span>© {new Date().getFullYear()} — Concept Systems</span>
          <span>
            Built for long-term thinking. Not for feature checklists.
          </span>
        </div>
      </div>
    </footer>
  );
}
