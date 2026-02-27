# AI Handoff

## Current State

- Homepage features a fully custom, split-panel `HeroSection.svelte` with an angled brand accent strip, engineering grid overlay, corner marks, laser sweep animation, and industrial spec-sheet stats.
- Site typography uses a **dual font system**: `Chakra Petch` (headings/display) + `Barlow` (body/UI), loaded via `app.html` and configured via `--font-heading` and `--font-sans` in `app.css`.
- Typography tokens defined in `:root` — type scale (`--ft-text-*`), line-heights (`--ft-leading-*`), letter-spacing (`--ft-tracking-*`).
- Navbar is a dark industrial bar with teal gradient accent line, uppercase Chakra Petch nav links, and full-screen dark mobile overlay menu.
- Hero uses negative `margin-top` to eliminate the light gap between nav and hero on the homepage.
- Mock data (`mockData.ts`) is stable with a locally generated default `hero-chainsaw.png` and verified working Unsplash URLs.
- Cart drawer is token-aligned, simplified, and active in root layout.
- Layout translator resolves real translations via `languageStore`.

## Last Completed Work

- **Typography Redesign:** Replaced single-font Rajdhani with dual font system: Chakra Petch (angular, machine-cut headings) + Barlow (readable body text). Added 22 typography tokens (scale, line-height, letter-spacing) to `app.css` `:root`. Trimmed Google Fonts load to only needed weights.
- **Navbar Redesign:** Dark solid background (`#0c1117`), 3px teal gradient accent line, uppercase Chakra Petch nav links with sliding underline hover, dark-themed dropdown/mobile menus, sharp cart badge. White logo variant used.
- **Hero Redesign:** Engineering grid overlay, diagonal-hatched accent strip, corner marks (desktop only), laser sweep animation (desktop only), industrial spec-sheet stats with bordered cells and teal top accents, product card with teal gradient accent bar.
- **Mobile Optimization:** Compact hero layout (smaller title, full-width buttons, reduced spacing), hidden decorative elements (corner marks, laser sweep), full-screen dark mobile menu overlay.
- **Gap Fix:** Hero `margin-top: -5rem` (md: `-6rem`) eliminates light strip between nav and hero caused by layout padding.
- **Section Heading Normalization:** FeaturedProducts heading reduced from `text-8xl` to `text-6xl`; all section h2s use `font-heading tracking-tight`.
- **Hero Product Card Overhaul:** Entire product card is now a clickable `<a>` link (no inner CTA link). Image padding removed for transparent-PNG readiness. Image heights increased (14/20/26rem). Product stage widened to 34rem. Hero-product padding reduced for edge-to-edge presence.
- **Homepage Design Cohesion:** Hero bg changed from flat `#0c1117` to subtle gradient (`#0f1720` → `#0c1117`) for nav separation. Removed `NewsletterSection` from homepage (footer has newsletter). Sharpened `FeaturesSection` cards — removed `rounded-3xl`/`rounded-2xl` and heavy shadows for industrial border-based styling.
- **DESIGN_SYSTEM.md updated** with full typography documentation (font stacks, type scale, weight assignments, line-height tokens).

## Open Follow-ups (optional)

- Add `:focus-visible` parity for all hover-only affordances.
- Normalize remaining hardcoded labels in layout/nav to translation keys.
- Move repeated component-local style patterns into global utility tokens/classes.
- Consider applying typography tokens (`var(--ft-text-*)`) to more components for consistency.
- Product detail page and checkout could benefit from explicit `font-heading` on price/title elements.

## Known Constraints

- Keep BaseLinker-first direction; avoid XML reintroduction.
- Keep edits minimal, character-driven (frontend-design skill), and design-system-consistent. No trend-chasing (e.g. no glassmorphism or floating orbs).
- Chakra Petch max weight is 700 (no 800/900) — use `font-bold` not `font-black` for headings.
- Hero negative margin is coupled to layout `pt-20 md:pt-24` — if layout padding changes, hero margin must match.

## Fast Start for Next AI

1. Read `docs/AI_PROJECT_CONTEXT.md`.
2. Read `docs/AI_DECISIONS.md`.
3. Read this handoff file.
4. Regenerate codemap: `npm run ai:codemap`.
5. Scan only codemap-selected files relevant to the task.
