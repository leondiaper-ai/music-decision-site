"use client";

import { motion } from "framer-motion";

export default function EmergingInsight() {
  return (
    <section className="relative py-14 md:py-18">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow text-electric/70 mb-4 block">
            Emerging insight
          </span>
          <p className="text-lg md:text-xl text-ink/80 leading-relaxed">
            Taken together, these investigations suggest that British state
            power in Ireland operates through a recurring pattern: political
            elites negotiate constitutional outcomes privately, while military
            presence is restructured rather than removed. The current
            acceleration toward reunification discourse may be the pressure
            point where this pattern either adapts or becomes visible.
          </p>
          <p className="mt-4 text-sm text-ink/45 italic">
            This insight is derived from the relationship between 3 archived
            investigations, not from any single entry.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
