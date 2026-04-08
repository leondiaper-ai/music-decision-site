# Decision System — Landing Page

A standalone Next.js (App Router) showcase hub for AI-powered decision tools in modern music marketing.

Not a SaaS dashboard. Not a generic portfolio. A sharp, editorial landing page that frames the thinking, the system, and the live tools.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Structure

```
app/
  layout.tsx        Root layout + metadata
  page.tsx          One-page site composition
  globals.css       Base styles + editorial utilities
components/
  Nav.tsx           Sticky top nav
  Hero.tsx          Headline + animated Artist→Decision node map
  Marquee.tsx       Infinite keyword ribbon
  SystemSection.tsx The 5 floating system blocks (POPIN-esque)
  DecisionExamples.tsx  Dark section of example recommendation cards
  ToolCards.tsx     3 live tools with In / Out framing
  WhySection.tsx    Positioning / philosophy
  Footer.tsx        Oversized closing headline + contact
tailwind.config.ts  Custom editorial colour palette
```

## Design system

Custom Tailwind colours:

- `paper` / `cream` — warm off-white backgrounds
- `ink` — near-black text + dark sections
- `signal` — hot orange-red accent for decisions / action
- `electric` — strong blue for systems / structure
- `mint` — positive state
- `sun` — highlight yellow
- `blush` — soft block pink

Typography is intentionally editorial and oversized. Motion is used for entrance + hover — never decoration.

## Setup

```bash
cd music-decision-site
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Drop straight onto Vercel — no env vars required.

## Sections

1. **Hero** — Oversized headline with an animated system diagram (Artist → Track → Campaign → YouTube → Decision).
2. **Marquee** — Infinite keyword ribbon (dark band).
3. **System** — 5 floating colour blocks, POPIN-spirited layout.
4. **Example decisions** — Dark section showing recommendation-style output cards.
5. **Tools** — Three live tool cards with In / Out framing, linking out to:
   - https://pih-v2.vercel.app/label
   - https://campaign-timeline-viewer.vercel.app/
   - https://youtube-campaign-coach.vercel.app/
6. **Why** — Positioning: decisions, not dashboards.
7. **Footer** — Oversized closing headline + contact + "coming next" list.

## Notes

- Content is placeholder where meaningful — tune copy as the thinking evolves.
- All components are client components only where motion requires it.
- Fully responsive; mobile layout is reflowed, not shrunk.
