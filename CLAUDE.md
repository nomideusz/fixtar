# FixTar — Development Guide

## Project
SvelteKit e-commerce for professional power tools (Polish language).  
**Stack:** SvelteKit, Tailwind CSS v4, PocketBase, Drizzle ORM  
**Language:** Polish (all customer-facing UI)

---

## Design Direction

**Inspiration:** [scheppach.co.uk](https://www.scheppach.co.uk/en-GB) — minimal, photography-driven, no clutter.

**Core principles:**
- **No CTA buttons.** Links are text. Products sell themselves through photography and clean layout.
- **Simplicity over decoration.** White space is the design. Remove, don't add.
- **Photography-first.** Full-bleed hero images, lifestyle product photography carries the page.
- **Quiet typography.** Headlines inform, don't shout. No gradient backgrounds, no colored section blocks.
- **Flat hierarchy.** Minimal visual weight differences between elements. Let content breathe.

**What this means concretely:**
- Hero = full-bleed photo with minimal text overlay, no buttons
- Categories = clean image grid, clickable cards, no arrows/icons/CTAs
- Product cards = image + name + price, nothing else
- Footer = simple, light, minimal columns
- No trust bars, no stats strips, no feature icon grids, no brand logo sections
- No mega-menus — navigation is plain text links
- Products page = single column, horizontal category pills, no sidebar

---

## Design Tokens (`src/app.css`)

| Token | Value | Usage |
|---|---|---|
| `--ft-bg` | `#ffffff` | Page background |
| `--ft-surface` | `#ffffff` | Cards, panels |
| `--ft-frost` | `#f1f5f9` | Subtle fills, hover states |
| `--ft-line` | `#e2e8f0` | Borders, dividers |
| `--ft-text` | `#2e3a46` | Body text |
| `--ft-text-strong` | `#014783` | Headings (navy) |
| `--ft-text-muted` | `#6b7d8e` | Secondary text |
| `--ft-text-faint` | `#9baab8` | Hints, placeholders |
| `--ft-cta` | `#FF6B00` | Prices, active states |
| `--ft-accent` | `#3E8B8B` | Labels, status, links |

### Spacing

| Class | Padding | Use case |
|---|---|---|
| `.ft-section-sm` | `clamp(32px, 4vh, 40px)` | Compact sections |
| `.ft-section` | `clamp(48px, 6vh, 64px)` | Standard pages |
| `.ft-section-lg` | `clamp(64px, 8vh, 96px)` | Spacious pages |
| `.ft-container` | `max-width: 1440px` + responsive padding | Horizontal containment |

---

## Architecture

```
src/routes/**/+page.svelte          — Pages (31 total)
src/routes/**/+layout.svelte        — Layouts (root, account, admin)
src/lib/components/{domain}/        — Components by domain
src/lib/stores/*.svelte.ts          — Svelte 5 runes stores
src/lib/utils/*.ts                  — Shared utilities
src/lib/images/                     — All image assets
```

### Key Rules
- **Spacing:** Use `.ft-section-*` + `.ft-container`. Never `px-*` on ft-container.
- **Colors:** Only `--ft-*` tokens. Never raw hex or Tailwind neutrals.
- **Borders:** `border-[--ft-line]`. Never `border-white/*` or `border-neutral-*`.
- **Icons:** SVG only, never emoji. `aria-hidden="true"` on decorative.
- **Touch targets:** ≥44px on all interactive elements.
- **CSS layers:** Resets in `@layer base`. Never unlayered resets.
- **No circular vars:** `--ft-surface: var(--ft-surface)` = broken. Use literals for aliases.

### Validation
```bash
npx svelte-check --threshold error
```

---

## Completed Work

### Session 12 — Scheppach-Inspired Minimal Redesign

#### Hero Section
- [x] Full-bleed lifestyle photography from `src/lib/images/hero/`
- [x] 3-slide auto-advancing carousel with real photos (workshop drill, construction hammer, forest axe)
- [x] Minimal text overlay: headline + one-line description, no CTA buttons
- [x] Image itself is a clickable link (wraps `<a>`)
- [x] Dot indicators (not progress bars), 6s auto-advance, pause on hover
- [x] Clean 1s fade transitions, `aspect-ratio: 1920/1072` (native photo proportions)
- [x] Subtle bottom-only gradient scrim for text legibility

#### Homepage Simplification
- [x] Removed `TrustBar.svelte` from layout
- [x] Removed `BrandLogos.svelte` from homepage
- [x] Removed `FeaturesSection.svelte` from homepage
- [x] Section order: Hero → Featured Products → Categories
- [x] `FeaturedProducts` — quiet header ("Polecane"), plain text link, no arrows
- [x] `CategoriesSection` — removed SVG icons, clean image placeholders (4:3), name only

#### Products Page — Single Column Rewrite
- [x] Removed 2-column sidebar layout → single column, full width
- [x] Category pills: horizontal scrollable row (mobile), wrapping (desktop)
- [x] Yoga-inspired pill pattern: `chip-scroll` with `overflow-x: auto`, `scroll-snap-type`, hidden scrollbar
- [x] Selected pill auto-scrolls into center view on mobile
- [x] Removed: sidebar filters, view mode toggle, ActiveFilters, MobileFilterPanel, QuickViewModal, Card wrappers
- [x] Kept: search, sort, pagination — minimal and clean
- [x] Removed "Wszystkie" pill — no category selected = all products shown
- [x] Imports reduced from 12 components to 2 (ProductCard, ProductCardSkeleton)

#### Navbar Cleanup
- [x] Removed MegaMenu component and all hover/timer logic
- [x] Removed `categories` prop from Navbar (no longer needed)
- [x] Plain text links for all nav items (Produkty, Promocje, O Nas, Kontakt)
- [x] Navbar is now a simple sticky bar: logo + links + search + cart + account

All passing `svelte-check` with **0 errors, 0 warnings** ✅

### Session 13 — Token Cleanup & Emoji Sweep

- [x] **SelectableMethodCard** — replaced 4× `--color-accent-*` with `--ft-accent`/`--ft-frost`/rgba
- [x] **About page** — 6 emoji icons (🎯⚡👥🏆🚀🔧) → SVG icons, removed unused gradient `color` field
- [x] **Product detail** — `bg-neutral-600` out-of-stock badge → `bg-[--ft-text-muted]`
- [x] **Contact page** — `from-neutral-100 to-neutral-200` map placeholder → `from-[--ft-frost] to-[--ft-frost]`
- [x] **Account favorites** — complete rewrite: dark cyberpunk theme → light Scandinavian, English→Polish, proper tokens
- [x] **order-status.ts** — `bg-neutral-100 text-neutral-200` → `bg-[--ft-frost] text-[--ft-text-muted]`

All passing `svelte-check` with **0 errors, 0 warnings** ✅

### Session 14 — Deep Audit: Dead Code, Translations, Accessibility, Token Sweep

#### Dead Component Cleanup (11 files deleted, 45→34 components)
- [x] Deleted: `BrandLogos`, `FeaturesSection`, `TrustBar`, `MegaMenu`, `AccountMobileNav`, `MobileFilterPanel`, `QuickViewModal`, `ProductListItem`, `ActiveFilters`, `CategoryFilter`, `AnnouncementBanner`
- [x] Deleted `Hero.svelte` — replaced with inline section headers on all 6 pages

#### Hero → Inline Section Headers (6 pages)
- [x] `about`, `auth/logout`, `checkout`, `checkout/success`, `contact`, `search` — all replaced with lightweight inline `<section>` headers

#### Account Addresses — English→Polish (3 pages)
- [x] Full translation: titles, labels, placeholders, buttons, notifications, error states
- [x] Address type options: Home→Dom, Work→Praca, Other→Inny
- [x] Country names: Poland→Polska, Germany→Niemcy, etc.
- [x] Replaced `bg-brand-100 text-brand-800` Default badge → `bg-[--ft-frost] text-[--ft-accent]`

#### Accessibility Fixes
- [x] Added `aria-label` to social login buttons (Google, GitHub) on login + register pages
- [x] Added `aria-label="Szukaj produktów"` to error page search input
- [x] Added `aria-hidden="true"` on social login SVG icons

#### Image CLS Prevention (6 files)
- [x] Added `width`/`height` to auth logos, cart items, checkout success items, CartDrawer items
- [x] Added `loading="lazy"` to product thumbnails (not logos — above fold)

#### Complete `brand-*` → Token Sweep (~130 replacements across 23 files)
- [x] `text-brand-*` → `text-[--ft-accent]`
- [x] `bg-brand-600/500` → `bg-[--ft-accent]`, `bg-brand-100/50` → `bg-[--ft-frost]`
- [x] `hover:text-brand-*` → `hover:text-[--ft-accent]`
- [x] `hover:bg-brand-700` → `hover:bg-[--ft-accent-hover]`
- [x] `focus:ring-brand-500` → `focus:ring-[--ft-accent]`
- [x] `group-hover:text-brand-*` → `group-hover:text-[--ft-accent]`
- [x] All account, checkout, contact, about, search, auth, error, orders, cart pages + 8 components

**Result: zero `brand-*` classes, zero `neutral-*` classes, zero stale tokens, zero emoji in all non-admin code.**

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## TODO — Remaining Work

### 🔴 Homepage

- [ ] Add category photography (replace frost placeholders)
- [ ] Category name as subtle overlay on image

---

### 🟠 Navigation

- [ ] Refine NavSearch UX
- [ ] Promotion badge on "Promocje" nav item when active deals exist

---

### 🟡 Product Experience

- [ ] Product detail: specification table (parse from description/BaseLinker)
- [ ] Product detail: related products (simple horizontal scroll)
- [ ] Product detail: full breadcrumb path with category hierarchy

---

### 🔵 Future (Low Priority)

- [ ] View transitions between pages
- [ ] Dark mode
- [ ] Image `srcset`/`sizes` for responsive images
- [ ] Lazy-loading below-fold sections
- [ ] Print styles
- [ ] Admin pages token cleanup (88 stale `neutral-*` references — internal only)
