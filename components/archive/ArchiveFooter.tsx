"use client";

import { motion } from "framer-motion";

export default function ArchiveFooter() {
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
          The archive
          <br />
          <span className="text-electric italic font-light">
            keeps working.
          </span>
        </motion.h2>

        <p className="mt-10 text-lg text-paper/60 leading-relaxed max-w-xl">
          This page is part of a living archive system. Investigations are added
          as they are published. Patterns are tracked as they emerge. The
          archive is built to still be useful in ten years.
        </p>

        <div className="mt-16 grid md:grid-cols-12 gap-8 pt-10 border-t border-paper/15">
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">Archive system</div>
            <p className="text-sm text-paper/40 leading-relaxed">
              ARCH → INV → INT
              <br />
              Pattern → Evidence → Pressure
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">This theme</div>
            <p className="text-sm text-paper/40 leading-relaxed">
              British State Power — Ireland / Northern Ireland
              <br />3 investigations · Active
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow text-paper/50 mb-3">Navigation</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href="/" className="hover:text-electric transition-colors">
                ← Back to main site
              </a>
              <a
                href="#theme"
                className="text-paper/40 hover:text-electric transition-colors"
              >
                Theme summary
              </a>
              <a
                href="#investigations"
                className="text-paper/40 hover:text-electric transition-colors"
              >
                Investigations
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/40">
          <span>© {new Date().getFullYear()} — Archive Intelligence System</span>
          <span>Built for long-term use. Not for news cycles.</span>
        </div>
      </div>
    </footer>
  );
}
