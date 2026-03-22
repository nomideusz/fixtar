# FixTar — Design System & Development Guide

## Project Overview
SvelteKit e-commerce app for professional power tools (Polish language).  
Scandinavian industrial aesthetic: editorial, refined, lots of white space.  
Warm slate + teal accent. DM Sans headlines + Inter body.

**Stack:** SvelteKit, Tailwind CSS v4, PocketBase, Drizzle ORM  
**Deploy:** Netlify / Vercel  
**Language:** Polish (all customer-facing UI)

---

## Design System Reference

### Tokens (defined in `src/app.css`)

| Token | Value | Usage |
|---|---|---|
| `--ft-bg` | `#f7f9fc` | Page background |
| `--ft-surface` | `#ffffff` | Cards, panels |
| `--ft-frost` | `#e8f0fa` | Subtle fills, hover states |
| `--ft-line` | `#dce4ee` | Borders, dividers |
| `--ft-text` | `#3a4558` | Body text |
| `--ft-text-strong` | `#1a2233` | Headings (alias: `--ft-dark`) |
| `--ft-text-muted` | `#8a95a8` | Secondary text |
| `--ft-text-faint` | `#b0bac8` | Hints, placeholders |
| `--ft-accent` | `#378a92` | Brand teal, links, active states |
| `--ft-accent-hover` | `#2f6d73` | Hover on accent |
| `--ft-warm` | `#c49a6c` | Badge accent (warm gold) |

### Spacing System (`src/app.css`)

| Class | Padding | Use case |
|---|---|---|
| `.ft-section-sm` | `clamp(32px, 4vh, 40px)` | Listings, admin, sidebar layouts |
| `.ft-section` | `clamp(48px, 6vh, 64px)` | Standard pages (cart, detail, orders) |
| `.ft-section-lg` | `clamp(64px, 8vh, 96px)` | Spacious (checkout, auth, about, contact) |
| `.ft-container` | `max-width: 1440px` + `padding: clamp(24px, 5vw, 80px)` | Horizontal containment |

**Rule:** Never add `px-*` on top of `.ft-container` — it already has responsive gutter.

### Component Library

**UI primitives:** `src/lib/components/ui/`  
Button, Card, Input, Hero, Modal, Breadcrumbs, LoadingSpinner, ProductCard, CustomBadge, Notifications, AnnouncementBanner

**Domain components:**  
- `products/` — CategoryFilter, MobileFilterPanel, ProductListItem, ActiveFilters, ProductGallery, ImageZoomModal  
- `checkout/` — SectionHeader, SelectableMethodCard, CheckoutProgress, OrderSummary, EmptyMethodsFallback  
- `account/` — StatCard, QuickActionCard, RecentOrdersTable, SettingsNav, NotificationToggle  
- `admin/` — SortableHeader, StatusBadge, StatusOverviewCards, ProductRow  
- `home/` — HeroSection, CategoriesSection, FeaturedProducts, FeaturesSection  
- `layout/` — Navbar, Footer, CartDrawer, AccountMobileNav

### Shared Utilities
- `src/lib/utils/inventory.ts` — `getStockInfo(product)` → `{ inStock, label, colorClass }`
- `src/lib/utils/order-status.ts` — `getOrderStatus(status)` → `{ label, colorClass }`

---

## Completed Work

### Session 1 — Refactoring (6 prior sessions)
- Extracted 20+ reusable components from 8 large files
- Created shared utilities (inventory, order-status)
- All passing `svelte-check` with 0 errors/warnings

### Session 2 — Token Consistency (dark→light theme fix)
- **49 files, ~354 replacements**
- Replaced dark-theme remnants with proper design tokens:
  - `text-neutral-300/400/500` → `text-[--ft-text]` / `text-[--ft-text-muted]`
  - `border-white/10/15` → `border-[--ft-line]`
  - `bg-white/5/10/3` → `bg-[--ft-frost]` / `bg-[--ft-surface]`
- Fixed hardcoded `rgb()` in scoped styles (SettingsNav, account layout, auth pages, SelectableMethodCard)
- Fixed layout inconsistencies (doubled padding on ft-container)

### Session 3 — UX Quality Pass (UI/UX Pro Max skill)
- **Touch targets:** All interactive elements ≥44px (navbar icons, cart buttons, view toggles, category chips, mobile nav)
- **Accessibility:** Added `aria-label`, `aria-pressed`, `aria-current="page"`, `role="search"`, `role="status"`, `sr-only` labels, `aria-hidden` on decorative SVGs
- **Performance:** Added `width`/`height` to all product images (CLS prevention), confirmed `font-display=swap`
- **Global:** Added `touch-action: manipulation` (eliminates 300ms tap delay)
- **Navbar:** Added active state highlighting for current page

### Session 4 — Products Page Deep Dive
- **Layout:** Replaced full Hero with compact page header (breadcrumbs + title + search inline)
- **Toolbar:** Removed Card wrapper, lightweight inline strip
- **Sidebar:** Fixed `sticky top-0` → `sticky top-20` (clears fixed navbar)
- **CategoryFilter:** Fixed broken color tokens (`--color-brand-400` → `--ft-accent`)
- **ActiveFilters:** Fixed invisible chip text, proper bordered pill design
- **Select elements:** Consistent `border-[--ft-line] bg-[--ft-surface]` styling
- **Product detail:** Lighter related products section (removed Card wrapper, editorial style)
- **Stale tokens:** Cleaned `--ft-border`, `--ft-card`, `--ft-surface-tertiary` across all product files

### Session 5 — Spacing & Padding System
- **Created spacing system:** `.ft-section-sm`, `.ft-section`, `.ft-section-lg` with fluid `clamp()` values
- **Fixed 20 routes:** Replaced ad-hoc `py-8`/`py-16`/`px-6 py-16 sm:px-8 lg:px-12` with system classes
- **Eliminated doubled padding:** No more `px-*` on `ft-container`
- **Account sub-pages:** Replaced misplaced `<Hero>` inside sidebar layouts with inline section headers
- **Auth pages:** Now use `ft-container` for consistent horizontal padding
- **Homepage sections:** Converted fixed `px` to fluid `clamp()` rhythm
- **Error page:** Now uses `ft-container` instead of custom max-width

### Session 6 — Design Consistency & Accessibility
- **CartDrawer** — Migrated all legacy CSS tokens (`--ft-border`→`--ft-line`, `--ft-primary`→`--ft-accent`, `--ft-surface-elevated`→`--ft-surface`, `--ft-surface-secondary`→`--ft-frost`, `--ft-surface-overlay`→literal rgba, `--ft-text-secondary`→`--ft-text-muted`, `--ft-primary-light`→literal rgba). Replaced 🗑️ emoji with SVG trash icon. Added `role="dialog"`, `aria-label`, and focus trap.
- **AccountMobileNav** — English→Polish labels ("Overview"→"Przegląd", "Orders"→"Zamówienia", etc.), emoji→SVG icons (👤📦❤️📍⚙️ → proper stroke SVGs), added focus trap, `role="dialog"`, `aria-modal`, `aria-label`, Escape key handling.
- **Error page** — Full English→Polish translation ("Page Not Found"→"Nie znaleziono strony", "Back to Home"→"Wróć na stronę główną", etc.), emoji category icons→SVG, replaced `card` class with `ft-card`, proper `<title>` and meta description in Polish.
- **Deals page** — Removed dark theme remnants (`bg-neutral-900`, `border-neutral-700`, `bg-neutral-800`, `placeholder-neutral-500`), restyled newsletter section with `bg-[--ft-frost]` + `border-[--ft-line]`, all English→Polish ("Special Deals"→"Promocje", "Shop Now"→"Kup teraz", "Subscribe"→"Zapisz się"), added `<label>` for newsletter email input, added `width`/`height` to deal images.
- **Orders [id] page** — Replaced emoji status icons (🕒⚙️🚚✅❌💰❓) with SVG icon paths, fixed invisible `text-neutral-200` on refunded/default statuses → `text-[--ft-text-muted]`.
- **MobileFilterPanel** — Added focus trap with Tab cycling and Escape key, `role="dialog"`, `aria-label`.
- All passing `svelte-check` with **0 errors, 0 warnings** ✅

### Session 7 — Web Interface Guidelines Audit & Simplification
- **Deleted dead components:** `AccountSidebar.svelte` (never imported, superseded by account layout inline sidebar), `OptimizedImage.svelte` (320-line unused over-engineered image component with `runed` dependency)
- **Input.svelte:** Fixed `id` vs `inputId` bug — label `for` attribute now matches input `id`
- **Button.svelte:** Replaced `transition: all` with explicit property list
- **Modal.svelte:** Fixed `--ft-surface-elevated`→`--ft-surface`, `--ft-surface-overlay`→literal rgba, "Close modal"→"Zamknij", hover contrast increased, added `overscroll-behavior: contain`
- **LoadingSpinner.svelte:** Replaced `--ft-primary`→`--ft-accent`, `--ft-border`→`--ft-line`, `--ft-text-secondary`→`--ft-text-muted`, `--ft-text-inverse`→literal `#ffffff`
- **Notifications.svelte:** Replaced 3× `text-neutral-900` → `text-[--ft-text-strong]`
- **CustomBadge.svelte:** Simplified from 90 lines (18 class combos, 6 variants×3 modes) to 45 lines — only `size`, `rounded`, `customClass` remain (all callers used `customClass` anyway)
- **AnnouncementBanner.svelte:** English→Polish defaults, `--ft-primary`/`--ft-text-inverse`→canonical tokens, added 44px touch target on dismiss button
- **Breadcrumbs.svelte:** Full rewrite — eliminated 19 `:global()` rules, fixed double separators (CSS `::before` + SVG), "Home"→"Strona główna", `--ft-border`/`--ft-primary`/`--ft-surface-tertiary`→canonical tokens. Now fully scoped CSS.
- **Hero.svelte:** Added `width`/`height`/`loading="lazy"` to image
- **CartDrawer.svelte:** Added `overscroll-behavior: contain`, `--font-heading`→`--font-display`
- **Navbar.svelte:** Added `overscroll-behavior: contain` on mobile overlay
- **MobileFilterPanel.svelte:** Added `overscroll-behavior: contain`
- **ImageZoomModal.svelte:** Added focus trap, `--ft-surface-overlay`→literal rgba, `overscroll-behavior: contain`
- **ProductGallery.svelte:** Added `width`/`height`/`loading="lazy"` to main + thumbnail images
- **ProductListItem.svelte:** Added `width`/`height` to image, `--ft-text-secondary`→`--ft-text-muted`
- **OrderSummary.svelte:** Added `width`/`height`/`loading="lazy"` to item images
- **ActiveFilters.svelte:** `--ft-text-secondary`→`--ft-text-muted`
- All passing `svelte-check` with **0 errors, 0 warnings** ✅

### Session 8 — Critical CSS Fixes & Product Detail Redesign

#### Critical: CSS Circular Reference (`--ft-surface`)
- **`app.css`:** Legacy alias `--ft-surface: var(--ft-surface)` overwrote the canonical `--ft-surface: #ffffff` with a self-reference, making it resolve to the CSS guaranteed-invalid value. This silently broke `background: var(--ft-surface)` across all Card components and any `bg-[--ft-surface]` usage. Fixed by removing the self-referencing alias and using literal `#ffffff` for legacy aliases that previously referenced `--ft-surface`.

#### Critical: CSS Reset vs Tailwind v4 Layer Cascade
- **`app.css`:** The global reset `* { margin: 0; padding: 0 }` was **unlayered**. In Tailwind CSS v4, all utilities (`mb-*`, `p-*`, `gap-*`, `space-y-*`) are generated inside `@layer utilities`. Per the CSS Cascade spec, unlayered CSS always beats layered CSS — so `margin: 0` silently overrode **every Tailwind spacing utility across the entire site**. Fixed by wrapping base styles in `@layer base`.

#### Product Detail Page Redesign
- **Layout:** Replaced `space-y-8` + Card wrappers with `flex flex-col gap-5` + `border-b border-[--ft-line]` dividers for clear editorial section separation
- **Description formatting:** New `formatDescription()` function handles three cases: paragraph breaks (`\n\n`), line breaks (`\n`), and long unformatted blobs (breaks at sentence boundaries before uppercase letters — common in supplier product data). Renders via `{@html}` with HTML escaping.
- **Category pills:** Proper scoped `.category-pill` class with white bg, subtle border, 40px min-height, hover transitions (border→teal, text→teal, bg→frost, shadow lift)
- **Spacing tuned:** `ft-section`→`ft-section-sm`, breadcrumb margin `mb-6`, grid `gap-8`, section gaps `gap-5`/`pb-5`
- **Remaining legacy tokens cleaned:** `--ft-text-secondary`→`--ft-text-muted` in product pages and ProductGallery
- All passing `svelte-check` with **0 errors, 0 warnings** ✅

### Session 9 — Phase 1 Modernization: Visual Upgrades

#### Layout Architecture Change
- **Navbar:** Changed from `position: fixed` → `position: sticky`. This allows TrustBar to sit naturally above it in document flow, scroll away when user scrolls, while navbar sticks at top. Eliminated `padding-top: 68px` hack from main. Updated mobile overlay from `top: 68px` → `padding-top: 68px`.

#### New Components Created
- **`TrustBar.svelte`** (`src/lib/components/layout/`) — Dismissible trust bar with `localStorage` persistence. Shows: Darmowa dostawa od 299 zł · Gwarancja producenta · 14 dni na zwrot. SVG icons, responsive (dots hidden on mobile), `bg-[--ft-frost]`.
- **`BrandLogos.svelte`** (`src/lib/components/home/`) — Brand trust section with text logos (Bavaria, Magnum, Eurotec, Sterling). Links to search by brand name. Faint color → teal on hover.

#### Redesigned Components
- **`HeroSection.svelte`** — New emotional headline "Narzędzia, Które Pracują z Tobą" with accent color span. CTAs now "Przeglądaj Produkty" + "Promocje" (links to /deals). Added inline trust signals row (Gwarancja, Dostawa 24h, 14 dni zwrot). Stats strip expanded to 4 items. Subtle gradient background.
- **`CategoriesSection.svelte`** — Complete rewrite from horizontal chip-scroll to visual card grid. Each card: icon (44px frost square) + name + product count + arrow. Responsive grid 1→2→3→4 columns. Hover: icon inverts (bg→accent, color→white), card lifts with shadow. Section header with label+title hierarchy.
- **`FeaturesSection.svelte`** — Expanded from 3 to 4 features (+Łatwe Zwroty). Distinct SVG icons per feature (Shield, Lightning, Headphones, Rotate). Responsive grid 1→2→4 columns. Icon containers now square (44px, `radius-sm`).
- **`Footer.svelte`** — Complete rewrite from 2-row minimal to 4-column professional layout. Brand+description+social, Sklep nav, Pomoc nav, Newsletter signup. Bottom bar with payment method icons (BLIK, Visa, Mastercard, PayPal, Przelew). Responsive 4→2→1 columns.

#### Homepage Updated
- **`+page.svelte`** — New section order: Hero → Categories → FeaturedProducts → BrandLogos → Features. Added BrandLogos import.
- **`+layout.svelte`** — Added TrustBar import, placed above Navbar. Removed `padding-top: 68px` from main.

All passing `svelte-check` with **0 errors, 0 warnings** ✅

---

## TODO — Modernization Roadmap

> **Inspiration:** scheppach.co.uk (tools e-commerce) + szkolyjogi.pl (yoga directory, our completed project).
> Both are minimal, modern, editorial. This roadmap tracks the full modernization plan.

---

### 🔴 Phase 1 — High-Impact Visual Upgrades

#### 1.1 Trust Bar (above navbar) ✅
- [x] Create `TrustBar.svelte` in `src/lib/components/layout/`
- [x] Content: "Darmowa dostawa od 299 zł · Gwarancja producenta · 14 dni na zwrot" with SVG icons
- [x] Thin strip, `bg-[--ft-frost]`, dismissible with `localStorage` persistence
- [x] Added to root `+layout.svelte` above `<Navbar />`

#### 1.2 Hero Section Redesign ✅
- [x] Redesigned hero with emotional headline "Narzędzia, Które Pracują z Tobą" + accent color span
- [x] Two CTAs: "Przeglądaj Produkty" (primary) + "Promocje" (secondary, links to /deals)
- [x] Added inline trust signals below CTAs (Gwarancja, Dostawa 24h, 14 dni zwrot) with SVG icons
- [x] Featured product card preserved with existing visual treatment
- [x] Stats strip expanded to 4 items (+14 Dni na zwrot), responsive wrapping
- [x] Subtle gradient background (teal + warm radials)
- [ ] Future: add lifestyle/workshop background photography when assets available

#### 1.3 Homepage Category Showcases ✅ (partial)
- [x] Redesigned `CategoriesSection.svelte` from chip-scroll to visual card grid
- [x] Each card shows: icon (square, frost bg) + name + product count + arrow indicator
- [x] Responsive grid: 1→2→3→4 columns, hover with icon color inversion + shadow lift
- [x] Added section title "Znajdź Narzędzia" with label/title hierarchy
- [ ] Future: `CategoryShowcase.svelte` — 2-3 deep-dive sections with product thumbnails per category

#### 1.4 Footer Expansion ✅
- [x] Redesigned `Footer.svelte` to 4-column layout (1.5fr 1fr 1fr 1.5fr)
- [x] Col 1: Brand "fixtar.pl" + description + social icons (Facebook, Instagram, YouTube)
- [x] Col 2: Sklep links (Wszystkie produkty, Promocje, Szukaj)
- [x] Col 3: Pomoc links (Kontakt, O nas)
- [x] Col 4: Newsletter signup with email input + arrow submit button + success state
- [x] Bottom bar: payment icons (BLIK, Visa, Mastercard, PayPal, Przelew) + copyright
- [x] Responsive: 4→2→1 column stacking, all tokens correct

#### 1.5 Homepage Flow (new page structure) ✅
- [x] Updated `+page.svelte` section order:
  ```
  [TrustBar]           ← layout level, dismissible
  [Navbar]             ← layout level, now sticky (was fixed)
  [HeroSection]        ← redesigned with trust signals
  [CategoriesSection]  ← visual card grid (was chip scroll)
  [FeaturedProducts]   ← kept current
  [BrandLogos]         ← NEW (Bavaria, Magnum, Eurotec, Sterling)
  [FeaturesSection]    ← expanded to 4 items (+ Łatwe Zwroty)
  [Footer]             ← expanded 4-column
  ```
- [x] Created `BrandLogos.svelte` — text-based brand logos, link to search by brand
- [x] Expanded `FeaturesSection.svelte` to 4 items with distinct SVG icons
- [x] Navbar changed from `position: fixed` → `position: sticky` (TrustBar now flows naturally above it, scrolls away, navbar sticks at top)

---

### 🟠 Phase 2 — Navigation & Search

#### 2.1 Enhanced Navigation
- [ ] Add mega-menu dropdown on "Produkty" hover (desktop)
- [ ] Create `MegaMenu.svelte` — grid of categories with icons/thumbnails + counts
- [ ] Promotion badge on "Promocje" nav item when active deals exist
- [ ] Smooth open/close transitions

#### 2.2 Navbar Inline Search
- [ ] Expandable search input in navbar (click search icon → input slides open)
- [ ] Replace redirect to /search with inline dropdown results
- [ ] Show: matching products (name + thumb), categories, brands
- [ ] Keyboard navigation (↑↓ Enter Escape)

#### 2.3 Search Autocomplete (products page)
- [ ] Port yoga project's omnisearch UX pattern
- [ ] Autocomplete dropdown with product suggestions, categories, brands
- [ ] Recent searches from localStorage
- [ ] Debounced server search for fuzzy matching
- [ ] "X wyników dla '...'" result summary

---

### 🟡 Phase 3 — Product Experience

#### 3.1 Enhanced Product Cards
- [ ] Stock status indicator (green dot = dostępny, orange = ostatnie sztuki)
- [ ] Brand badge/logo on card
- [ ] Quick specs from description (e.g., "2000W · 48T" for saws)
- [ ] Wishlist heart icon on hover
- [ ] "Dodaj do koszyka" appears on hover (desktop) / always visible (mobile)

#### 3.2 Products Page Refinements
- [ ] Create `ProductCardSkeleton.svelte` — skeleton loading (6-9 gray placeholders)
- [ ] Replace spinner overlay with skeleton cards during navigation
- [ ] Sticky toolbar with active filter count badge
- [ ] Result count above grid: "Znaleziono X produktów"

#### 3.3 Quick View Modal
- [ ] Create `QuickViewModal.svelte` — click product → modal with gallery + details + add to cart
- [ ] Image gallery with thumbnails
- [ ] Key specs + price + stock status + CTA
- [ ] "Zobacz szczegóły" link to full product page

#### 3.4 Product Detail Enhancements
- [ ] Specification table (parse from description or BaseLinker data)
- [ ] "Kup teraz" express checkout button
- [ ] Related products carousel (horizontal scroll)
- [ ] Full breadcrumb path showing category hierarchy

---

### 🟢 Phase 4 — Conversion & Trust

#### 4.1 Social Proof
- [ ] Create `BrandLogos.svelte` — partner/brand logos section
- [ ] Customer count / order count stats (homepage)
- [ ] Optional: Google Reviews integration

#### 4.2 Newsletter & Engagement
- [ ] Create `NewsletterSection.svelte` — email signup with discount incentive
- [ ] "Zapisz się i otrzymaj 5% rabatu na pierwsze zamówienie"
- [ ] Form validation, success state, error state
- [ ] Optional: exit-intent popup

#### 4.3 Deals / Outlet Enhancement
- [ ] Countdown timers for limited-time deals
- [ ] Discount percentage filter (10%, 20%, 30%+)
- [ ] Flash sale banner capability on homepage

---

### 🔵 Phase 5 — Polish & Performance

#### 5.1 Animations & Micro-interactions
- [ ] View transitions between pages (`::view-transition-old/new` like yoga project)
- [ ] Staggered product card entry on load and filter changes
- [ ] Cart drawer slide animation with backdrop blur
- [ ] Button hover: subtle lift + shadow transition

#### 5.2 Typography Review
- [ ] Evaluate Chakra Petch for headlines (more industrial/technical feel)
- [ ] Verify `font-display: swap` and preload critical fonts
- [ ] Ensure consistent font stack across all components

#### 5.3 Dark Mode
- [ ] Implement using yoga project's token inversion pattern
- [ ] `@media (prefers-color-scheme: dark)` with `--ft-*` overrides
- [ ] Test all components in dark mode
- [ ] Add manual toggle in navbar

#### 5.4 Performance
- [ ] Image `srcset`/`sizes` for responsive product images
- [ ] Intersection Observer for lazy-loading below-fold sections
- [ ] Virtualized product grid for 50+ items
- [ ] Bundle splitting audit

---

### ⚪ Remaining Cleanup (from Sessions 1-8)

#### Design Consistency
- [ ] **SelectableMethodCard** — `.brand .radio-dot.checked` uses `--color-brand-400` (should be `--ft-accent`)
- [ ] **About page** — emoji icons (🚀 etc.) → SVG, audit spacing, verify token usage
- [ ] **Product detail** — `bg-neutral-600` for out-of-stock badge → tokenize

#### Components to Polish
- [ ] **Contact page** — audit form labels, spacing, error states
- [ ] **Search page** — audit empty state, suggestion chips, loading states
- [ ] **Checkout success page** — audit spacing, verify token usage
- [ ] **Auth logout page** — audit token usage, spacing
- [ ] **Account favorites page** — uses `--ft-surface-overlay` in scoped styles
- [ ] **Account addresses pages** — form labels use stale `text-neutral-300` in `new/` and `[id]/edit/`

#### Cart & Checkout Flow
- [ ] **Cart page** — audit empty state, quantity controls, responsive layout
- [ ] **Checkout page** — form label for voivodeship select uses `text-neutral-300` class
- [ ] **Checkout** — textarea (notes) styling should match Input component

#### Admin Pages (lower priority — internal)
- [ ] Admin pages still use raw Tailwind neutrals — acceptable for now

#### Other
- [ ] **Scroll restoration** — verify products page preserves scroll position on back navigation
- [ ] **Print styles** — no print CSS exists

---

## Architecture Notes

### File Conventions
- Pages: `src/routes/**/+page.svelte` (31 total)
- Layouts: `src/routes/**/+layout.svelte` (root, account, admin)
- Server loads: `src/routes/**/+page.server.ts`
- Components: `src/lib/components/{domain}/ComponentName.svelte`
- Stores: `src/lib/stores/*.svelte.ts` (Svelte 5 runes)
- Utilities: `src/lib/utils/*.ts`

### Key Patterns
- **Spacing:** Always use `.ft-section-*` + `.ft-container`. Never add `px-*` on ft-container.
- **Colors:** Use CSS custom properties (`--ft-*`), never raw hex or Tailwind neutral/white opacity.
- **Borders:** `border-[--ft-line]` for all dividers. Never `border-white/*` or `border-neutral-*`.
- **Text:** `text-[--ft-text]` (body), `text-[--ft-text-strong]` (headings), `text-[--ft-text-muted]` (secondary), `text-[--ft-text-faint]` (hints).
- **Backgrounds:** `bg-[--ft-surface]` (cards), `bg-[--ft-frost]` (subtle fills), `bg-[--ft-bg]` (page).
- **Touch targets:** All interactive elements ≥44px. Use `min-width`/`min-height` on buttons/icons.
- **Icons:** SVG only, never emoji for structural UI. `aria-hidden="true"` on decorative icons.
- **Labels:** Every input needs a visible or `sr-only` `<label>`. Every select needs `<label for="">`.
- **Buttons:** Use the `Button` component. Sizes: sm (36px), md (44px), lg (48px) min-height.
- **Scoped styles:** Prefer design system CSS variables over hardcoded colors. Avoid `rgb()` literals.

### CSS Architecture (Tailwind v4)
- **Layer order:** `@layer base` → `@layer components` → `@layer utilities` → unlayered (highest)
- **⚠️ Never put resets outside `@layer base`** — unlayered `* { margin: 0 }` silently overrides ALL Tailwind utilities. Base styles MUST be in `@layer base`.
- **⚠️ Never create circular CSS variable references** — `--ft-surface: var(--ft-surface)` makes the token invalid. Legacy aliases must point to a DIFFERENT name or use a literal value.
- **Custom layout classes** (`.ft-container`, `.ft-section-*`) are intentionally unlayered so they're stronger than Tailwind utilities.
- **Component classes** (`.btn-primary`, `.input`) are in `@layer components` so utilities can override them.

### Validation
Run before committing:
```bash
npx svelte-check --threshold error
```
Current status: **0 errors, 0 warnings** ✅
