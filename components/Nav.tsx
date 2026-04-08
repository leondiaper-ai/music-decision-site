"use client";

import { motion } from "framer-motion";

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/70 border-b border-ink/5"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tightest text-lg">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal" />
          decision/system_
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#system" className="hover:text-signal transition-colors">System</a>
          <a href="#examples" className="hover:text-signal transition-colors">Examples</a>
          <a href="#tools" className="hover:text-signal transition-colors">Tools</a>
          <a href="#why" className="hover:text-signal transition-colors">Why</a>
        </nav>
        <a
          href="#tools"
          className="inline-flex items-center gap-2 rounded-full bg-ink text-paper text-xs font-medium px-4 py-2 hover:bg-signal transition-colors"
        >
          View tools →
        </a>
      </div>
    </motion.header>
  );
}
