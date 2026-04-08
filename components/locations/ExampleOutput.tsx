"use client";

import { motion } from "framer-motion";

interface LocationOption {
  area: string;
  detail: string;
  leadTime: string;
  cost: string;
  paperwork: "Light" | "Moderate" | "Heavy";
  riskLevel: number; // 1–5
  verdict: string;
  verdictNote: string;
}

const options: LocationOption[] = [
  {
    area: "Westminster",
    detail: "Great Smith St area",
    leadTime: "6–8 weeks",
    cost: "£2,800–4,200",
    paperwork: "Heavy",
    riskLevel: 4,
    verdict: "High friction",
    verdictNote: "Heritage + security zone",
  },
  {
    area: "Camden",
    detail: "Elm Village / Agar Grove",
    leadTime: "3–4 weeks",
    cost: "£1,200–1,800",
    paperwork: "Moderate",
    riskLevel: 2,
    verdict: "Workable",
    verdictNote: "Residential sensitivity",
  },
  {
    area: "Islington",
    detail: "Sekforde St / Clerkenwell",
    leadTime: "2–3 weeks",
    cost: "£900–1,400",
    paperwork: "Light",
    riskLevel: 1,
    verdict: "Best path",
    verdictNote: "Film-friendly borough",
  },
];

const paperworkColor: Record<string, string> = {
  Light: "bg-mint/15 text-mint",
  Moderate: "bg-sun/20 text-amber-700",
  Heavy: "bg-signal/10 text-signal",
};

const verdictColor: Record<string, string> = {
  "High friction": "text-signal",
  Workable: "text-amber-700",
  "Best path": "text-mint",
};

function RiskDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= level
              ? level >= 4
                ? "bg-signal"
                : level >= 3
                ? "bg-amber-500"
                : "bg-mint"
              : "bg-ink/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function ExampleOutput() {
  return (
    <section id="example" className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">
              01 — Example output
            </span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              From one sentence
              <br />
              <span className="italic font-light">to three options.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/65 leading-relaxed max-w-lg">
              A single creative request — translated into a comparison of
              real-world options, each scored on time, cost, paperwork, and
              risk.
            </p>
          </div>
        </div>

        {/* Quoted input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="border border-ink/10 rounded-2xl p-6 md:p-8 bg-paper mb-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 text-2xl text-ink/25 leading-none mt-0.5">
              &ldquo;
            </span>
            <div>
              <p className="text-lg md:text-xl text-ink/80 italic leading-snug">
                I need a cobbled street in central London for a small daytime
                shoot.
              </p>
              <span className="eyebrow text-ink/40 mt-3 block">
                Sample creative request
              </span>
            </div>
          </div>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-paper border border-ink/10 rounded-2xl overflow-hidden"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cream/60">
                  <th className="eyebrow text-ink/50 px-8 py-4">Area</th>
                  <th className="eyebrow text-ink/50 px-6 py-4">Lead time</th>
                  <th className="eyebrow text-ink/50 px-6 py-4">Est. cost</th>
                  <th className="eyebrow text-ink/50 px-6 py-4">Paperwork</th>
                  <th className="eyebrow text-ink/50 px-6 py-4">Risk</th>
                  <th className="eyebrow text-ink/50 px-6 py-4">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {options.map((opt) => (
                  <tr key={opt.area} className="group">
                    <td className="px-8 py-5">
                      <span className="font-display font-bold text-base">
                        {opt.area}
                      </span>
                      <br />
                      <span className="text-xs text-ink/40">{opt.detail}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-ink/75">
                      {opt.leadTime}
                    </td>
                    <td className="px-6 py-5 text-sm text-ink/75">
                      {opt.cost}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${paperworkColor[opt.paperwork]}`}
                      >
                        {opt.paperwork}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <RiskDots level={opt.riskLevel} />
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`font-medium text-sm ${verdictColor[opt.verdict]}`}
                      >
                        {opt.verdict}
                      </span>
                      <br />
                      <span className="text-xs text-ink/40">
                        {opt.verdictNote}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-ink/5">
            {options.map((opt) => (
              <div key={opt.area} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg">
                    {opt.area}
                  </span>
                  <span
                    className={`font-medium text-sm ${verdictColor[opt.verdict]}`}
                  >
                    {opt.verdict}
                  </span>
                </div>
                <p className="text-xs text-ink/40">{opt.detail}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink/40 block">Lead time</span>
                    <span className="text-ink/75">{opt.leadTime}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink/40 block">Est. cost</span>
                    <span className="text-ink/75">{opt.cost}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink/40 block">Paperwork</span>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${paperworkColor[opt.paperwork]}`}
                    >
                      {opt.paperwork}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-ink/40 block mb-1">Risk</span>
                    <RiskDots level={opt.riskLevel} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
