# FixTar — Development Guide

## Project
SvelteKit 2 + Svelte 5 (runes) e-commerce for professional power tools (Polish language).
**Stack:** SvelteKit, Tailwind CSS v4 (`@theme`), Turso (libSQL) + Drizzle ORM, Better Auth, BaseLinker API (product sync), `@nomideusz/svelte-search` (FTS5 + trigram fuzzy), Phosphor icons.
**Language:** Polish (all customer-facing UI).

---

## Design Direction — Industrial Premium (v1.2)

**Source of truth:** `apps/fixtar/.claude/design_handoff_fixtar_v1.2/` — design system HTML + asset bundle. Hex values, font weights, and pixel measurements transfer exactly. Refer to it before any visual decision.

### Identity in one line
Cinematic, industrial, premium — Bosch Professional rigor + Makita XGT precision + DJI ecommerce confidence. Never generic Shopify.

### Brand palette (use tokens, never raw hex)

| Role | Token | Hex |
|---|---|---|
| Cyan / Turquoise (brand) | `--ft-cyan` / `--color-teal-500` | `#3F98A2` |
| Orange (action, sparingly) | `--ft-cta` / `--color-orange-500` | `#FF8A1F` |
| Dark surface | `--ft-ink-900` | `#1D2228` |
| Page background | `--ft-bg` | `#FFFFFF` |
| Soft surface | `--ft-frost` / `--color-ink-050` | `#F4F5F7` |

Full 10-stop `ink-*` ramp + 6-stop `teal-*` and `orange-*` scales available in `app.css`. **Cyan carries brand identity** (logo, highlights, hover, active). **Orange is conversion-only** (CTAs, add-to-cart, sale labels) — sparingly, always meaningful.

### Typography

| Style | Family | Weight | Use |
|---|---|---|---|
| Display / XL hero | Teko | 500 italic | Hero headline, club lockup — identity moments only |
| H1 / page title | Teko | 500 upright | Page titles |
| H2 section title | Teko | 500 upright | Section headings |
| H2 alt | Oxanium | 500 | Technical/futuristic alternate (rare) |
| H3 / UI heading | Inter | 700 | Component headings |
| Eyebrow / kicker | Iosevka Mono | 500 | Section kickers ("FEATURED · BESTSELLERS") |
| Body | Inter | 400 | Default copy |
| Small / helper | Inter | 400 | 13px helper text |
| Mono / SKU | Iosevka Mono | 400 | SKUs, micro-labels, tabular numerics |

**Italic Teko is reserved for hero and identity moments.** Default headings are upright. Body type never competes with the headline.

### Signature visual moves
1. **Category cards** — entire card sheared `skewX(-7°)`, photo & content counter-skewed `+7°` to stay upright. Dark slab on left (58% wide). 4px cyan stripe with glow on diagonal edge. Orange 44×44 CTA arrow free on photo. See `home/CategoriesSection.svelte`.
2. **Hero** — light premium surface (`#FAFBFC → #EDF0F3`) + far-right cyan radial glow. Italic Teko headline (ink + cyan accent). Photo column right with left-edge fade into surface. Frosted "stamp" chip bottom-right with cyan status dot.
3. **Club** — dark `ink-900` slab. Photo left with diagonal right edge (`clip-path` 110px slope). 4px cyan stripe rotated 11.1° along the slope. Right column: kicker + logo+Teko-italic word lockup + 5 perks with vertical hairline dividers + flush 56px email/CTA form. Promo note left-aligned.

### Principles
1. **Cinematic, not decorated.** Real industrial environments, real grit. No gradients-as-decoration, no glass, no glow effects.
2. **Cyan is brand. Orange is action.** Used together, never confused.
3. **Italic display, calm body.** Italic Teko ONLY in hero/identity moments. Inter for everything that has to be read.
4. **European, premium, reliable.** Reference Bosch Pro / Makita XGT / DJI — never generic Shopify.

---

## Design Tokens (`src/app.css`)

Tailwind v4 `@theme` block defines the full token system. Use semantic aliases (`--ft-*`) in component styles; theme tokens (`--color-*`, `--font-*`, `--radius-*`) generate Tailwind classes.

### Key semantic aliases
| Token | Value | Use |
|---|---|---|
| `--ft-bg` | `#fff` | Page background |
| `--ft-surface` | `#fff` | Cards, panels |
| `--ft-frost` | `--ink-050` | Subtle fills, hover states, empty placeholders |
| `--ft-line` | `--ink-200` | Borders, dividers |
| `--ft-text` | `--ink-900` | Body text, headings |
| `--ft-text-muted` | `--ink-500` | Secondary text |
| `--ft-text-faint` | `--ink-400` | Hints, placeholders |
| `--ft-accent` | `--teal-500` | Brand cyan |
| `--ft-cta` | `--orange-500` | Conversion orange |
| `--ft-shadow-card` | (resting) | Default card shadow |
| `--ft-shadow-lift` | (hover) | Hover/focused card shadow |

### Radii
| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 3px | Badges, chips |
| `--radius-sm` | 6px | Buttons, inputs |
| `--radius-md` | 10px | Cards, panels |
| `--radius-lg` | 16px | Hero, club, large compositions |

### Spacing
| Class | Padding | Use case |
|---|---|---|
| `.ft-section-sm` | `clamp(24px, 3vh, 40px)` | Compact sections |
| `.ft-section` | `clamp(48px, 6vh, 72px)` | Standard sections |
| `.ft-section-lg` | `clamp(64px, 8vh, 96px)` | Spacious sections |
| `.ft-container` | `max-width: 1440px` + responsive padding | Horizontal containment |

### Typography utilities
| Class | Use |
|---|---|
| `.ft-page-title` | Teko 500 uppercase, ~28-40px, page headings on account/checkout/listing routes |
| `.ft-eyebrow` / `.ft-label` | Mono uppercase 11px cyan-600 kicker above section titles |
| `.ft-mono` | Iosevka Mono 500 with tabular-nums, for SKUs and numeric data |
| `.text-money` | Inter 700 tabular for prices |

---

## UI Component Inventory (`src/lib/components/ui/`)

| Component | Purpose |
|---|---|
| `Button.svelte` | Variants: `cta` (orange), `teal` (cyan), `dark`/`primary` (ink-900), `outline`/`secondary` (white + ink-300 border), `ghost`, `ghost-dark`. Sizes: `sm`/`md`/`lg`. Use `cta` for conversion only. |
| `Input.svelte` | 44px height, 6px radius, cyan focus ring (3px teal-050). |
| `Textarea.svelte` | Resize vertical, min-height 110px, cyan focus ring. |
| `Select.svelte` | 44px height, custom caret SVG, cyan focus ring. |
| `Checkbox.svelte` | 18×18 box, 3px radius, cyan checked. |
| `Radio.svelte` | 18×18 circle, cyan checked. |
| `Switch.svelte` | 40×22 track, cyan checked. |
| `FieldGroup.svelte` | Wraps label (mono uppercase 12px) + input + helper/error. |
| `QuantityStepper.svelte` | Minus / number / plus, all 44px height. |
| `FilterChip.svelte` | Pill-shaped, optional removable, active inverts to ink-900. |
| `Tabs.svelte` | Underline tabs, cyan-500 active indicator, optional count badges. |
| `Pagination.svelte` | Prev/Next + numbered pages + gap "…" + active state (ink-900 bg). |
| `Breadcrumbs.svelte` | Inline mono "/" separators, ink-500 links → teal-600 hover, ink-900 current. |
| `PageHeader.svelte` | Eyebrow + Teko 500 title + ink-500 description. `align: left | center`. |
| `StarRating.svelte` | 5-star SVG, score + count, `-lg` variant. |
| `AvatarGroup.svelte` | Overlapping circular avatars + "+N more". |
| `Alert.svelte` | 4 variants (success/info/warning/danger) with icon, bold lead, body, optional close. |
| `Tooltip.svelte` | Dark ink-900 bubble, mono uppercase, triangle pointer (top/bottom). |
| `EmptyState.svelte` | Icon circle + Teko 28px title + ink-500 description + CTA slot. |
| `Skeleton.svelte` | Animated shimmer. |
| `Card.svelte` | Generic card primitive with hover lift. |
| `ProductCard.svelte` | Catalog workhorse: 1:1 image, badge + heart top strip, name, rating, price, add-to-cart. |
| `CountdownTimer.svelte` | Reusable timer with full/compact modes. |
| `Modal.svelte` | Generic modal. |
| `Notifications.svelte` | Toast surface (consider migrating to `Alert` variants). |

---

## Architecture

```
src/routes/**/+page.svelte          — Pages
src/routes/**/+layout.svelte        — Layouts (root, account, admin)
src/lib/components/{domain}/        — Domain components (home, products, checkout, account, layout, ui)
src/lib/stores/*.svelte.ts          — Svelte 5 runes stores
src/lib/utils/*.ts                  — Shared utilities
src/lib/images/                     — Image assets
src/lib/fonts/                      — Self-hosted fonts (Iosevka Mono in /static/IoskeleyMono-Web/)
```

### Key Rules
- **Spacing:** Use `.ft-section-*` + `.ft-container`. Never `px-*` on `.ft-container`.
- **Colors:** Only `--ft-*` or `--color-*` tokens. Never raw hex or Tailwind neutrals (`bg-neutral-*`, `text-gray-*`).
- **Borders:** `border-[--ft-line]`. Never `border-white/*` or `border-neutral-*`.
- **Icons:** Phosphor SVG only, never emoji. `aria-hidden="true"` on decorative icons.
- **Touch targets:** ≥44px on all interactive elements.
- **CSS layers:** Resets in `@layer base`. Never unlayered resets.
- **No circular vars:** `--ft-surface: var(--ft-surface)` = broken. Use literals for aliases.
- **Italic Teko ONLY for hero/identity moments** — never in general headings.

### Validation
```bash
cd apps/fixtar && npx svelte-check
```
Target: 0 errors, 0 warnings (excluding pre-existing `polityka-prywatnosci` unused-CSS warning).

---

## What NOT to change (preserve)
- BaseLinker integration (`src/lib/services/baselinker.ts`, `src/routes/api/baselinker/`).
- Search infrastructure (`packages/svelte-search/`, `src/lib/server/search/`).
- Auth (`better-auth` config, `src/lib/server/schema.ts`).
- Database schema and Drizzle migrations.
- Cart state management (`src/lib/stores/`).
- Routing structure or page hierarchies.

---

## Migration history

The site evolved through several design phases — Scheppach minimal (Sessions 12-18), brief Chakra Petch / Honda Blue industrial experiment (Session 19), and now **v1.2 Industrial Premium** (current). Earlier session notes have been removed; visual decisions are now governed by the design handoff bundle and the tokens in `app.css`.
