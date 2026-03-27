# FixTar — Development Guide

## Project
SvelteKit e-commerce for professional power tools (Polish language).  
**Stack:** SvelteKit, Tailwind CSS v4, Turso (DB), BaseLinker API (product sync), Drizzle ORM  
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

## Session 14 — Phase 4: Conversion & Trust

### New Components Created
- **`BrandLogos.svelte`** (`src/lib/components/home/`) — 6 brand names (Bavaria, Magnum, Eurotec, Sterling, Graphite, Yato) as text links. Faint→teal hover. Border-separated strip with "Zaufane marki" label.
- **`TestimonialsSection.svelte`** (`src/lib/components/home/`) — Stats strip (2,500+ products, 15,000+ orders, 4.8/5 rating, 98% positive reviews) with staggered fade-in. 3 customer testimonial cards: star ratings (orange SVG), blockquote text, avatar initials (frost circle), name + role. Responsive grid 1→2→3 cols.
- **`NewsletterSection.svelte`** (`src/lib/components/home/`) — Standalone email signup CTA with "5% rabatu" incentive. Envelope icon in circle. Custom email validation, loading spinner, success state with checkmark. Frost bg with border. Input+button inline (stacks on mobile ≤480px). `novalidate` + custom error messages. `aria-invalid`, `aria-describedby` for a11y.
- **`CountdownTimer.svelte`** (`src/lib/components/ui/`) — Reusable countdown timer. Two modes: full (block layout with day/hour/min/sec boxes + labels) and compact (inline `02h:15m:30s`). `font-variant-numeric: tabular-nums` for stable layout. `role="timer"` + `aria-label`. Expired state text. `onExpired` callback. Cleans up interval on unmount.
- **`FlashSaleBanner.svelte`** (`src/lib/components/home/`) — Dark navy banner bar above hero. Pulsing orange dot (CSS ping animation), headline text, compact countdown timer, arrow CTA. Auto-hides when countdown expires. Links to /deals. Responsive (dot hidden on mobile). `prefers-reduced-motion` disables ping.

### Redesigned Pages
- **Deals page** (`/deals`) — Two-tier layout:
  - **Flash deals**: 2-column grid with product image (badge + discount overlay), title, description, original→sale price with strikethrough, full countdown timer, "Kup teraz" CTA button.
  - **Seasonal promotions**: 3-column card grid with image zoom on hover, discount badge, title/description, date label, "Sprawdź →" link with arrow animation.
  - Newsletter CTA bar at bottom linking to homepage `#newsletter` anchor.

### Updated Pages
- **Homepage** (`+page.svelte`) — New section order:
  ```
  [FlashSaleBanner]       ← NEW (dark bar with countdown)
  [HeroSection]           ← existing
  [CategoriesSection]     ← existing (image cards)
  [FeaturedProducts]      ← existing
  [BrandLogos]            ← NEW (trust logos strip)
  [TestimonialsSection]   ← NEW (stats + reviews)
  [NewsletterSection]     ← NEW (email signup with 5% incentive)
  ```

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## Session 15 — Phase 5.1: Animations & Micro-interactions

### View Transitions
- **`+layout.svelte`** — Added `onNavigate` hook using the View Transitions API (`document.startViewTransition`). Pages cross-fade with subtle vertical slide (4px) on navigation. Falls back gracefully in unsupported browsers.
- **`app.css`** — Added `::view-transition-old(root)` / `::view-transition-new(root)` keyframes. Old page fades out + slides up, new page fades in + slides down. 150ms out, 200ms in.
- **`Navbar.svelte`** — Added `view-transition-name: navbar` so navbar stays fixed during page transitions (no flash).
- **`app.d.ts`** — Added `Document.startViewTransition` type declaration.

### Staggered Card Entry
- **`app.css`** — New `.ft-stagger` utility class. Children animate in with `ft-card-enter` (opacity 0→1, translateY 12px→0) with 40ms delay increments per child (up to 13+). Uses `--ease-out` cubic-bezier.
- Applied `.ft-stagger` to:
  - Product grid (`/products`)
  - Featured products (homepage)
  - Categories grid (homepage)
  - Deals grids (flash + seasonal)
  - Search results grid

### Button Hover Enhancement
- **`Button.svelte`** — Added `transform` to transition property list. All button variants now lift on hover:
  - Primary: `translateY(-1px)` + orange shadow
  - Secondary: `translateY(-1px)`
  - Outline: `translateY(-1px)` + orange shadow
  - All hovers gated with `:not(:disabled)`

### Card Hover Enhancement
- **`Card.svelte`** — Added `transform` to transition. Hover cards lift `translateY(-2px)`.
- **`ProductCard.svelte`** — Increased hover lift to `-3px`, uses `--ease-out` easing.

### Footer Icons (Simple Icons integration)
- **`Footer.svelte`** — Replaced hand-drawn social SVGs with official Simple Icons (CC0):
  - Facebook: proper filled `f` logo
  - Instagram: official camera glyph (filled, not stroke)
  - YouTube: official play button shape (filled)
- Payment icons: replaced plain text `<span>` with SVG logos in styled `.pay-chip` containers:
  - Visa, Mastercard, PayPal: Simple Icons SVGs
  - BLIK, Przelew: kept as styled text logos (no standard SVG exists)
- Payment chips now have `border + frost bg + border-radius + aria-label`

### Reduced Motion
- All view transition animations disabled via `prefers-reduced-motion: reduce`
- Stagger animations respect existing global reduced-motion rule

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## Session 16 — Product Experience Polish

### Product Listing Page
- **Breadcrumbs** — Added `Breadcrumbs` component to `/products` page. Shows "Strona główna → Produkty → {Category}" when a category filter or search is active. Hidden when viewing all products (no redundant crumb).

### Product Card View Transitions
- **`ProductCard.svelte`** — Each card's image container gets a unique `view-transition-name` via CSS custom property (`--vt-name: product-img-{id}`). When navigating to a product detail page, the image morphs smoothly from card to gallery.
- **Product detail page** — Gallery wrapper matches the same `view-transition-name` so the View Transitions API creates a seamless morph animation between list and detail views.
- **`app.css`** — Added `::view-transition-group(*)` with 250ms ease-out timing for all view transition groups.

### Related Products
- Added `.ft-stagger` to related products carousel for staggered entry animation.

### Cleanup
- Confirmed spec table, related products carousel, and breadcrumb hierarchy were already implemented in Session 12. Removed from TODO.

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## Session 17 — Homepage & Navigation Polish

### CategoriesSection Redesign
- **Section header** — Added "Przeglądaj" label (ft-label) above "Kategorie" title for hierarchy.
- **Product count** — Each category card now shows product count below the name (e.g., "42 produktów"). Uses Polish plural rules (1 produkt, 2-4 produkty, 5+ produktów).
- **Overlay redesign** — Name + count in a flex column. Gradient refined to 50% opacity for better legibility.
- **Fallback icon** — Categories without mapped images now show a wrench SVG icon (was blank frost). Dark text mode for fallback cards (no gradient needed).
- **More image mappings** — Added `frezarki`, `odkurzacze`, `kompresory`, `narzedzia-reczne` slugs mapped to existing banner images.

### Navbar — Promocje Badge
- **`Navbar.svelte`** — "Promocje" nav link now has a small orange dot (`promo-dot`) indicating active deals. 6px circle, `bg-[--ft-cta]`, `vertical-align: super`. Desktop only (hidden in mobile menu).

### NavSearch UX Improvements
- **Popular categories** — When search input is focused with empty query, shows "Popularne kategorie" section with chip links (Szlifierki, Wiertarki, Młotowiertarki, Pilarki). Clicking navigates to filtered products page.
- **Combined empty state** — Recent searches (if any) shown above popular categories with a border separator between sections.
- **Category chips** — Frost bg, border, rounded-full pills. Hover: orange border + text + light bg.

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## Session 18 — Optimization & Nice-to-Haves

### Dark Mode
- **`app.css`** — Full token inversion via `@media (prefers-color-scheme: dark)` and manual `.dark` class. Dark palette: bg `#0f1419`, surface `#1a2028`, text `#c8d1db`, headings `#e2e8f0`, line `#2a3444`, frost `#1e2630`. CTA brightened to `#FF7A1A`, accent to `#56a8a8`. Shadows darkened. Uses `html:not(.light-forced)` to allow manual override.
- **`app.html`** — Inline `<script>` reads `ft-theme` from `localStorage` and applies `.dark` or `.light-forced` before first paint (prevents FOUC). Dual `<meta name="theme-color">` for light/dark schemes. Trimmed font weights (removed unused 300/400 from Plus Jakarta Sans).
- **`Navbar.svelte`** — Dark mode toggle button (sun/moon icons). Desktop: icon button in actions bar. Mobile: text button in mobile menu ("Tryb ciemny"/"Tryb jasny"). Reads initial state from `localStorage` → falls back to `prefers-color-scheme`. Saves preference to `localStorage`.

### Lazy-Loading (Intersection Observer)
- **`src/lib/utils/lazy.ts`** — `lazyReveal` Svelte action. Observes element with configurable threshold/rootMargin. Adds `.is-visible` class when entering viewport. Unobserves after first intersection. Respects `prefers-reduced-motion`.
- **`app.css`** — `.ft-lazy` class: starts at `opacity: 0; translateY(16px)`, transitions to visible on `.is-visible`. 500ms ease-out. Disabled for reduced motion.
- **Homepage** — Applied `ft-lazy` + `use:lazyReveal` to below-fold sections: FeaturedProducts, BrandLogos, TestimonialsSection, NewsletterSection. Hero and Categories stay eager (above fold).

### Print Styles
- **`app.css`** — `@media print` rules: hides nav, footer, buttons, search, filters, pagination, cart, flash banner, newsletter. Resets all backgrounds to white, text to black. Shows URLs after links. Avoids page breaks after headings. Product grid forced to 2 columns. Container padding removed.

### Typography Optimization
- **`app.html`** — Trimmed Google Fonts request: Plus Jakarta Sans now loads only weights 500–800 (was 300–800). Saves ~20KB of font data. `font-display: swap` already set via URL parameter.

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## TODO — Remaining Work

---

### 🟢 Conversion & Trust (Phase 4 — remaining)

- [ ] Google Reviews integration (needs API key)
- [ ] Exit-intent newsletter popup
- [ ] Discount percentage filter on deals page (needs real DB data)
- [ ] Connect newsletter form to real backend/email service

---

### 🔵 Future (Low Priority)

- [x] ~~Dark mode~~ ✅
- [ ] Image `srcset`/`sizes` for responsive images (product images are external URLs — needs image proxy)
- [x] ~~Lazy-loading below-fold sections (Intersection Observer)~~ ✅
- [ ] Virtualized product grid for 50+ items (deferred — current pagination handles scale)
- [x] ~~Bundle splitting audit~~ ✅ (SvelteKit auto-splits well, largest client chunk 96KB = Svelte runtime)
- [x] ~~Print styles~~ ✅
- [ ] Admin pages token cleanup (73 stale `neutral-*` references — internal only)
- [x] ~~Typography review~~ ✅ (trimmed font weights, `font-display: swap` confirmed)
