# himalayan-trecking-company

Landing page for a small-group Himalayan trekking company. React + Vite + TypeScript, GSAP (ScrollTrigger, Flip, SplitText) and Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve dist/ on http://localhost:4173
```

## Sections and their one effect

| # | Section | Effect | Reduced motion |
|---|---------|--------|----------------|
| 1 | Hero | Film scales from full-bleed to a rounded card on scroll; headline follows the mouse by at most 10px (fine pointer, ≥1024px) | Static card, film starts paused |
| 2 | Manifesto | Centred statement with photos set into the line; words and photos reveal with scroll (SplitText) | Plain text |
| 3 | Trek finder | Sentence filter ("Show me easy treks of up to 6 days in winter"), a lead trek, and a grid that reorders with GSAP Flip; magnetic primary buttons | Instant reorder, no magnet |
| 4 | Altitude profile | **Pinned.** Route draws with scroll, camp markers activate, odometer altitude counter | Full route, highest point shown |
| 5 | Featured trek | **Pinned** horizontal gallery of staggered wide and tall frames with inner-image parallax (≥900px). Stacks below that | Static two-column grid |
| 6 | Trek leaders | Leaders named in one sentence; hovering a name brings their portrait to the cursor (fine pointer, ≥1024px). Swipeable portrait row elsewhere | Portrait row |
| 7 | Enquire | Photo panel with headline beside the form; fades in once | No fade |

Motion rules: only `transform` and `opacity` are animated (the route "draw" is a counter-translated wipe, not `stroke-dashoffset`). Two pins on desktop, one on mobile. Lenis runs with `lerp: 0.1` and is skipped on touch devices and with reduced motion.

## Files

- `src/data.ts` treks, Rupin Pass camps, gallery captions, leaders
- `src/components/*` one file per section, plus `Magnetic.tsx`
- `src/lib/gsap.ts` plugin registration and shared media queries
- `public/media/` hero film (Kling 3.0 via Higgsfield, 8.5 s seamless loop: 1920 wide for desktop, 540x960 portrait crop for phones), posters, and generated photography

## Before launch

- Trek leaders, prices, contact details and the address are placeholders.
- The enquiry form does not send anywhere yet (see the TODO in `src/components/Book.tsx`).
- Photography and the hero film are AI-generated (Higgsfield Soul and Kling 3.0). Swap in real trip footage where you have it.
