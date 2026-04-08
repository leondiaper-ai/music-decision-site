"use client";

import { motion } from "framer-motion";

export default function LocationNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/70 border-b border-ink/5"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg"
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal" />
          locations/feasibility_
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#example" className="hover:text-signal transition-colors">
            Example
          </a>
          <a href="#how" className="hover:text-signal transition-colors">
            How it works
          </a>
          <a href="#why" className="hover:text-signal transition-colors">
            Why
          </a>
          <a href="#pattern" className="hover:text-signal transition-colors">
            Pattern
          </a>
        </nav>
        <span className="eyebrow text-ink/40">LOC — 001</span>
      </div>
    </motion.header>
  );
}
