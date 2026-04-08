"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Investigation {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  whyArchived: string;
  relevance: string;
  connectedTo: string[];
  insightCue: string;
}

const investigations: Investigation[] = [
  {
    id: "inv-001",
    title:
      "Irish PM proposed accepting Northern Ireland's union with Britain in 1983",
    source: "Declassified UK",
    date: "11 Apr 2024",
    summary:
      "Reveals previously hidden political calculations around partition. Documents how an Irish Taoiseach was prepared to formally accept Northern Ireland's constitutional position within the UK — a position never made public at the time.",
    whyArchived:
      "Exposes the gap between public political rhetoric and private elite negotiation on the constitutional status of Northern Ireland. A key piece of evidence for understanding how partition has been managed by both states.",
    relevance:
      "Directly supports the ARCH theme by documenting how British and Irish elites manage constitutional outcomes through closed-door strategy rather than democratic process.",
    connectedTo: ["INV-002 — Military drawdown as parallel strategy", "INV-003 — Reunification as the pressure test for these calculations"],
    insightCue: "Together with the military drawdown, this suggests partition was managed through coordinated elite action across both states — not through democratic settlement.",
  },
  {
    id: "inv-002",
    title: "The vanishing UK military presence in Northern Ireland",
    source: "Declassified UK",
    date: "9 Apr 2024",
    summary:
      "Documents the drawdown and transformation of British military presence in Northern Ireland — reframing what is often presented as demilitarisation as a strategic repositioning.",
    whyArchived:
      "Relevant to understanding long-term shifts in British security strategy and the optics of military withdrawal. The military did not leave — it changed shape.",
    relevance:
      "Maps directly to the theme of British state power being exercised through evolving rather than retreating structures. The form changes; the presence persists.",
    connectedTo: ["INV-001 — Elite political management of partition", "INV-003 — Reunification pressure as context for repositioning"],
    insightCue: "The military drawdown mirrors the political pattern: presence is restructured, not removed. This suggests a single strategy operating across both domains.",
  },
  {
    id: "inv-003",
    title:
      "'The closest we've been since partition': Irish reunification on the horizon",
    source: "Declassified UK",
    date: "8 Apr 2024",
    summary:
      "Captures the growing elite and public reassessment of partition — documenting a shift in the political landscape that could force British state strategy to harden or adapt.",
    whyArchived:
      "Potential future relevance if British state strategy responds to reunification pressure. This piece captures a moment of recalibration.",
    relevance:
      "Establishes the contemporary pressure layer for this ARCH theme — the conditions under which archived patterns of British state behaviour may re-emerge or intensify.",
    connectedTo: ["INV-001 — The elite calculations this pressure may reactivate", "INV-002 — Military posture as indicator of state response"],
    insightCue: "This is the entry most likely to shift from archival to active. If reunification pressure intensifies, the patterns documented in INV-001 and INV-002 become predictive.",
  },
];

function InvestigationEntry({ inv }: { inv: Investigation }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="border-b border-ink/10 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-7 md:py-8 flex items-start justify-between gap-6 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="eyebrow text-electric">{inv.id.toUpperCase()}</span>
            <span className="text-xs text-ink/40">
              {inv.source} · {inv.date}
            </span>
          </div>
          <h3 className="font-display font-bold text-xl md:text-2xl leading-tight group-hover:text-electric transition-colors pr-4">
            {inv.title}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center text-sm transition-all ${
            open
              ? "bg-electric text-paper border-electric rotate-45"
              : "text-ink/40 group-hover:border-ink/30"
          }`}
        >
          +
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-0 md:pl-4">
              {/* Summary */}
              <p className="text-base text-ink/75 leading-relaxed mb-6 max-w-3xl">
                {inv.summary}
              </p>

              {/* Detail blocks */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-cream rounded-xl p-5">
                  <span className="eyebrow text-ink/50 mb-2 block">
                    Why this is archived
                  </span>
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {inv.whyArchived}
                  </p>
                </div>
                <div className="bg-cream rounded-xl p-5">
                  <span className="eyebrow text-ink/50 mb-2 block">
                    Relevance to ARCH theme
                  </span>
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {inv.relevance}
                  </p>
                </div>
              </div>

              {/* Connected investigations */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-xs font-medium text-ink/40 tracking-wide uppercase">
                  Connected to
                </span>
                {inv.connectedTo.map((c, j) => (
                  <span
                    key={j}
                    className="text-sm text-electric/70 leading-snug"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Insight cue */}
              <div className="mt-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-px bg-electric/30 mt-2.5" />
                <p className="text-sm text-ink/45 italic leading-relaxed">
                  {inv.insightCue}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InvestigationList() {
  return (
    <section id="investigations" className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">
              05 — Full investigation list
            </span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              Every entry.
              <br />
              <span className="italic font-light">Expandable.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/60 leading-relaxed max-w-lg">
              Each investigation is archived with context — why it matters, what
              it reveals, and how it connects to the broader theme. Click any
              entry to expand.
            </p>
          </div>
        </div>

        <div className="bg-paper rounded-2xl border border-ink/10 divide-y divide-ink/0 px-6 md:px-10">
          {investigations.map((inv) => (
            <InvestigationEntry key={inv.id} inv={inv} />
          ))}
        </div>
      </div>
    </section>
  );
}
