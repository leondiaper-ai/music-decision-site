"use client";

import { motion } from "framer-motion";

interface InsightCueProps {
  text: string;
}

export default function InsightCue({ text }: InsightCueProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.8 }}
      className="py-6 md:py-8"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <p className="text-sm text-ink/40 italic tracking-wide max-w-2xl">
          <span className="inline-block w-8 h-px bg-electric/30 align-middle mr-3" />
          {text}
        </p>
      </div>
    </motion.div>
  );
}
