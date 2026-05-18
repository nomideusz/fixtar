# Fixtar Design System v1.2 — Migration Handoff

## What this is
A complete design system reference + migration plan for the live Fixtar e-commerce site (https://fixtar.vercel.app, https://github.com/nomideusz/fixtar).

The site already exists and works. **Do not start a new project.** This handoff describes the evolution from the current implementation to design system v1.2 — a polish + extend pass, not a rewrite.

## About the design files
The HTML file in `design-system/` is a **design reference** — a living style guide showing the intended look and behavior of every token, atom, pattern and composition in the system. Treat it as the source of truth for visual decisions, not as production code to copy.

The target is the existing **SvelteKit 2 + Svelte 5 + Tailwind v4** codebase. Recreate every visual decision using that environment's patterns (Tailwind `@theme`, semantic `--ft-*` aliases, `.svelte` components in `src/lib/components/`).

## Fidelity
**High-fidelity.** All colors, font families, weights, sizes, radii, shadows and spacing in the reference are final. Hex values, font weights, line-heights and pixel measurements should transfer exactly.

---

## The existing codebase — what's already there

The live site is a working e-commerce app. **Preserve all of this:**

- **Stack:** SvelteKit 2, Svelte 5 (runes), Tailwind CSS v4, Turso (libSQL), Better Auth, BaseLinker API, Phosphor icons, custom `@nomideusz/svelte-search` package (FTS5 + trigram fuzzy).
- **77 routes** — home, products (listing + detail), search, cart, checkout, full account section (addresses, favorites, orders, settings), admin (incl. BaseLinker sync), about.
- **48 components** in `src/lib/components/` — Navbar, Footer, CartDrawer, NavSearch, ProductGallery, PurchaseCard, SpecTable, Breadcrumbs, Button, Card, CountdownTimer, BrandLogos, TrustBar, ClubSection, FeaturedProducts, TestimonialsSection, HeroSection, etc.
- **Working integrations** — BaseLinker product sync (inventoryId 9392), Turso FTS5 + trigram search with Polish locale support, Better Auth (email/password + OAuth), Drizzle ORM.

The current `src/app.css` already defines a usable token layer (`--ft-*` family) wired into Tailwind v4 `@theme`. The brand palette and fonts already match (Oxanium + Teko + Inter; `#1d2228` dark; `#ff8a1f` orange).

**You are evolving this, not replacing it.**

---

## What v1.2 changes — deltas only

These are the *only* differences between what's live now and the target system. Group them into the phased migration below.

### Token deltas (`src/app.css` `@theme` block)

| Token | Current | v1.2 target | Notes |
|---|---|---|---|
| `--color-accent` (cyan 500) | `#378a92` | `#3F98A2` | Aligns to brandbook |
| `--color-accent-hover` | `#2d737a` | `#2F7A82` | Cyan 600 |
| Cyan 050 (NEW) | — | `#E8F2F3` | Soft tint, focus ring backgrounds |
| Cyan 200 (NEW) | — | `#B4D9DE` | Soft tag/alert borders |
| Cyan 400 (NEW) | — | `#5FB1BB` | Hover/active highlights on dark |
| Cyan 700 (NEW) | — | `#1F5E66` | Text on cyan-050 |
| Orange 050/200/400/600/700 (NEW) | — | `#FFEFDD / #FFD3A8 / #FFA552 / #E47514 / #C25D08` | Full scale for badges/alerts |
| Ink 100–800 (NEW intermediate steps) | — | `#E8EAEE / #D8DCE1 / #B7BDC4 / #8E97A2 / #6B7682 / #4A5560 / #333A42 / #262C33` | Full neutral ramp |
| `--radius-sm` | 6px | 6px | OK |
| `--radius-md` | 10px | 10px | OK |
| `--radius-xs` (NEW) | — | 3px | Badges, chips |
| `--radius-lg` | 14px | 16px | Slight bump |
| Shadow `--ft-shadow-lift` (NEW) | — | `0 12px 32px -12px rgba(29,34,40,.18), 0 4px 10px -4px rgba(29,34,40,.08)` | Hover/focused cards |

### Component deltas (the visual moves that make it look like *Fixtar*, not generic)

These are the high-impact migrations. See `design-system/Fixtar Design System.html` for full implementations.

1. **Category card — signature skewed parallelogram.**
   - Entire card outline is sheared at `skewX(-7deg)` (-5° on wide and compact variants).
   - Photo and content layers counter-skewed at `+7deg` so imagery stays upright.
   - Dark overlay slab on left (58% wide standard, 52% wide-featured, 75% compact).
   - 4px cyan accent stripe with glow along the diagonal edge.
   - Orange CTA arrow square (44×44) free on the photo at bottom-right, counter-skewed.
   - Aspects: 16:11 standard, 21:9 wide, 4:3 compact.
   - Lives at: `src/lib/components/home/CategoriesSection.svelte`

2. **Hero — italic Teko + light premium surface + cinematic photo.**
   - Background: `linear-gradient(180deg, #FAFBFC 0%, #EDF0F3 100%)` plus a subtle cyan radial glow far right.
   - Headline: Teko 500 italic, 64px, line-height 0.95, letter-spacing -0.02em. First line ink, second line cyan accent.
   - Two buttons side-by-side: teal primary + white outline secondary.
   - Star-rating proof bar below buttons (orange stars + "4.8/5 based on 2,500+ reviews").
   - Full-bleed product photography on the right, fading softly into the surface on the left (layered gradient mask).
   - "Stamp" chip (frosted-glass) bottom-right with cyan status dot.
   - Lives at: `src/lib/components/home/HeroSection.svelte`

3. **Club & newsletter — diagonal photo edge + lockup + 5 perks + flush form.**
   - Dark slab background (`--ink-900`).
   - Photo on the left with a diagonal right edge: `clip-path: polygon(0 0, 100% 0, calc(100% - 110px) 100%, 0 100%)`.
   - 4px cyan accent stripe rotated to follow the slope (rotate 11.1deg, transform-origin top right).
   - Right column: kicker (Inter 13px 600 wide-tracked, NOT italic) → logo + "Club" lockup (logo 64px height + Teko 500 italic 72px word) → description.
   - Perks row: **5 perks** with vertical hairline dividers between them, no boxes — Early access, Tests & tool guides, Limited offers, Member pricing, Welcome gift.
   - Email form: input + button **flush against each other** at 56px height, white input + orange CTA, rounded-left and rounded-right.
   - Promo note at bottom **left-aligned** (not centered): gift emoji + "A welcome -5% code on your first order."
   - Lives at: `src/lib/components/home/ClubSection.svelte`

### New components to add (not in the current repo)

The current site is missing these. All are detailed in the reference HTML. Build as Svelte 5 components in `src/lib/components/ui/`:

- **Alerts** — 4 variants (success / info / warning / danger) with icon, bold lead line, body copy, optional close.
- **Tooltip** — Dark bubble with mono uppercase text, triangle pointer.
- **EmptyState** — Icon circle + display headline + body + CTA.
- **Skeleton** — Animated shimmer lines + skeleton-card for product grid loading.
- **Pagination** — Prev/Next + numbered pages with gap "…" + active state. (May exist; align to spec.)
- **Tabs** — Underline-style with cyan active indicator + optional count badges.
- **FilterChip** — Pill-shaped, removable (with × close), active state inverts to dark.
- **DataTable** — Bordered table with mono SKUs, sortable headers, hover row striping, badges inline.
- **StarRating** — 5-star SVG component, supports score + count, with `-lg` variant.
- **AvatarGroup** — Overlapping circular avatars with "+N more" terminator.
- **QuantityStepper** — Three-piece composite: minus / number input / plus, all 44px height.
- **Form primitives** — Standardize Checkbox, Radio, Switch, Select, Textarea components matching the spec (cyan checked, 18×18 box for check/radio, 40×22 track for switch).

### Form polish (existing forms across checkout + account)

Today some forms use ad-hoc styling. Standardize to:
- Field height **44px**, padding **0 14px**, border **1px var(--ft-line)**, radius **6px**.
- Focused state: `border-color: var(--ft-accent)` + `box-shadow: 0 0 0 3px var(--teal-050)`.
- Error state: `border-color: var(--red-500)` + matching 3px ring.
- Labels: mono uppercase, 12px, 600, letter-spacing 0.06em, color `--ink-700`.
- Helper text: 12px, color `--ink-500`.
- Error text: 12px, red-500, with inline error icon.

### Nav patterns to align

- **Breadcrumbs** (existing `Breadcrumbs.svelte`) — separators should be `/` in mono, current item in `--ink-900` bold, link items in `--ink-500` hovering to `--teal-600`.
- **Pagination** (likely exists per-route) — extract into shared component matching spec.
- **Tabs** for product detail page (Overview / Specifications / Reviews / Shipping & returns / Q&A) — currently may not exist; build as new.

---

## Phased migration plan

Ship in this order so each PR is reviewable and visually meaningful on its own.

### Phase 1 — Visual signatures (highest impact)
- Token harmony first: update the cyan hex, add cyan/orange scales, add `--ft-shadow-lift`, add radius xs.
- Port the **category card** to `CategoriesSection.svelte`. This is the brand's most recognizable move.
- Port the **hero** to `HeroSection.svelte`. Italic headline is non-negotiable.
- Port the **club** to `ClubSection.svelte` with the diagonal photo + 5 perks.

### Phase 2 — UI primitives
- Build the new UI components in `src/lib/components/ui/`: Alert, Tooltip, EmptyState, Skeleton, StarRating, AvatarGroup, QuantityStepper.
- Standardize form primitives: Checkbox, Radio, Switch, Select, Textarea, FieldGroup wrapper with label/helper/error slots.

### Phase 3 — Component polish
- DataTable component, used in admin and account/orders.
- Pagination extracted to shared component.
- Tabs added to product detail.
- FilterChip used in product listing filters.

### Phase 4 — Surface sweep
- Audit each page; replace ad-hoc styling with system components. No code outside `ui/` should style buttons, inputs or badges directly.

---

## Design tokens (full reference)

```css
/* Brand */
--teal-700: #1F5E66;
--teal-600: #2F7A82;
--teal-500: #3F98A2;   /* logo, highlights, brand button */
--teal-400: #5FB1BB;
--teal-200: #B4D9DE;
--teal-050: #E8F2F3;

--orange-700: #C25D08;
--orange-600: #E47514;
--orange-500: #FF8A1F;  /* CTAs, add-to-cart, sale labels — SPARINGLY */
--orange-400: #FFA552;
--orange-200: #FFD3A8;
--orange-050: #FFEFDD;

/* Neutrals */
--ink-900: #1D2228;     /* footer, navs, dark sections */
--ink-800: #262C33;
--ink-700: #333A42;
--ink-600: #4A5560;
--ink-500: #6B7682;
--ink-400: #8E97A2;
--ink-300: #B7BDC4;
--ink-200: #D8DCE1;
--ink-100: #E8EAEE;
--ink-050: #F4F5F7;     /* page background */
--white: #FFFFFF;

/* Status */
--green-500: #2E9E63;
--yellow-500: #F0A732;
--red-500: #D63333;

/* Type */
--font-display: 'Teko', 'Oxanium', sans-serif;       /* hero, headings, category banners */
--font-display-alt: 'Oxanium', sans-serif;            /* technical/futuristic alternate */
--font-sans: 'Inter', 'Manrope', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;

/* Radius */
--r-xs: 3px;   /* badges, chips */
--r-sm: 6px;   /* buttons, inputs */
--r-md: 10px;  /* cards, panels */
--r-lg: 16px;  /* hero, club, large compositions */

/* Shadows */
--shadow-card: 0 1px 2px rgba(29, 34, 40, 0.05), 0 1px 1px rgba(29, 34, 40, 0.03);
--shadow-lift: 0 12px 32px -12px rgba(29, 34, 40, 0.18), 0 4px 10px -4px rgba(29, 34, 40, 0.08);

/* Spacing — 4px base */
--s-1: 4px;  --s-2: 8px;  --s-3: 12px;  --s-4: 16px;
--s-5: 20px; --s-6: 24px; --s-8: 32px;  --s-10: 40px;
--s-12: 48px; --s-16: 64px; --s-20: 80px; --s-24: 96px;
```

## Typography hierarchy

| Style | Family | Weight | Style | Size / Line-height | Use |
|---|---|---|---|---|---|
| Display / XL | Teko | 500 | **italic** | 72px / 0.95 | Hero, club lockup |
| H1 | Teko | 500 | upright | 48px / 1 | Page titles |
| H2 | Teko | 500 | upright | 36px / 1.1 | Section titles |
| H2 alt | Oxanium | 500 | upright | 44px / 1 | Technical/futuristic compositions |
| H3 / UI heading | Inter | 700 | upright | 22px / 1.2 | Component headings |
| Eyebrow | JetBrains Mono | 500 | upright | 11px / 0.12em | Section kickers, "FEATURED · BESTSELLERS" |
| Body | Inter | 400 | upright | 15px / 1.6 | Default copy |
| Small | Inter | 400 | upright | 13px / 1.5 | Meta, helper |
| Mono / SKU | JetBrains Mono | 400 | upright | 12px | SKUs, micro-labels |

**Italic Teko is reserved for hero and identity moments only** — not for H1/H2 generally. The hero headline carries the system's voice.

---

## Principles (when in doubt)

1. **Cinematic, not decorated.** Real industrial environments, real grit, real light. No gradients-as-decoration, no glass, no glow effects.
2. **Cyan is brand. Orange is action.** Turquoise carries identity — logo, highlights, hover states. Orange is conversion-only: CTAs, sale, add-to-cart. Used sparingly, it always means something.
3. **Italic display, calm body.** Teko italic for hero/identity moments only. Inter for everything that has to be read. Body type never competes with the headline.
4. **European, premium, reliable.** Reference the rigor of Bosch Professional, the precision of Makita XGT, the cinematic confidence of DJI — never a generic Shopify look.

---

## Assets in this bundle

- `design-system/Fixtar Design System.html` — Complete v1.2 system reference (22 sections: foundations → atoms → patterns → components → compositions → principles → tokens). Open in a browser to inspect any component.
- `design-system/assets/` — Fixtar logo variants (teal+black, white, all-teal, all-black, mark-only) and the construction + workshop hero photos.

## Files in the live repo to touch (Phase 1)

- `src/app.css` — token block (`@theme`) + `--ft-*` aliases.
- `src/lib/components/home/HeroSection.svelte` — hero rewrite.
- `src/lib/components/home/CategoriesSection.svelte` — skewed category cards.
- `src/lib/components/home/ClubSection.svelte` — diagonal photo + 5 perks + flush form.
- `src/lib/components/ui/Button.svelte` — verify primary/teal/outline/dark variants match.

---

## What NOT to change

- BaseLinker integration (`src/lib/services/baselinker.ts`, `src/routes/api/baselinker/`).
- Search infrastructure (`packages/svelte-search/`, `src/lib/server/search/`).
- Auth (`better-auth` config, `src/lib/server/schema.ts`).
- Database schema and Drizzle migrations.
- Cart state management (`src/lib/stores/`).
- Routing structure or page hierarchies.

This is purely a design-layer migration.
