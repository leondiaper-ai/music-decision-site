"use client";

const items = [
  "Artist Health",
  "Track Signals",
  "Campaign Moments",
  "YouTube Planning",
  "Decision Output",
  "Streaming Data",
  "Save Rate",
  "Reach",
  "Cadence",
  "Recommendations",
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="relative border-y border-ink/10 bg-ink text-paper overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee py-5">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="px-8 text-2xl md:text-4xl font-display font-bold tracking-tightest flex items-center gap-8"
          >
            {item}
            <span className="text-signal">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
