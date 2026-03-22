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
Button, Card, Input, Hero, Modal, Breadcrumbs, LoadingSpinner, ProductCard, CustomBadge, Notifications, OptimizedImage, AnnouncementBanner

**Domain components:**  
- `products/` — CategoryFilter, MobileFilterPanel, ProductListItem, ActiveFilters, ProductGallery, ImageZoomModal  
- `checkout/` — SectionHeader, SelectableMethodCard, CheckoutProgress, OrderSummary, EmptyMethodsFallback  
- `account/` — StatCard, QuickActionCard, RecentOrdersTable, SettingsNav, NotificationToggle  
- `admin/` — SortableHeader, StatusBadge, StatusOverviewCards, ProductRow  
- `home/` — HeroSection, CategoriesSection, FeaturedProducts, FeaturesSection  
- `layout/` — Navbar, Footer, CartDrawer, AccountSidebar, AccountMobileNav

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

---

## TODO — Remaining Work

### HIGH Priority

#### Design Consistency
- [x] **CartDrawer** — ~~legacy aliases~~ migrated to canonical tokens, emoji→SVG, focus trap added
- [ ] **SelectableMethodCard** — `.brand .radio-dot.checked` uses `--color-brand-400` (should be `--color-brand-600` or `--ft-accent`)
- [x] **Deals page** — ~~dark theme~~ restyled with design tokens, English→Polish, added `<label>` for newsletter input
- [x] **Orders [id] page** — ~~emoji icons~~ replaced with SVG, fixed invisible `text-neutral-200`→`text-[--ft-text-muted]`

#### i18n / Language
- [x] **AccountMobileNav** — ~~English labels~~ Polish, ~~emoji icons~~ SVG, focus trap added
- [x] **Error page** — ~~English text~~ fully translated to Polish, emoji→SVG
- [ ] **AccountSidebar (account layout)** — already has Polish labels + SVG icons ✅
- [ ] **Breadcrumbs** — check all pages use Polish labels

#### Accessibility
- [x] **MobileFilterPanel** — ~~no focus trap~~ focus trap added with Tab cycling + Escape
- [x] **CartDrawer** — ~~no focus trap~~ focus trap added
- [ ] **ImageZoomModal** — verify focus trap and Escape key handling
- [x] **Deals page** — ~~newsletter form input has no `<label>`~~ `<label>` added
- [ ] **About page** — uses emoji icons for features (🚀 etc.) — should be SVG

### MEDIUM Priority

#### Components to Polish
- [ ] **About page** — audit spacing, emoji→SVG, verify token usage
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
- [ ] Admin pages still use raw Tailwind neutrals — acceptable for internal tools but could be tokenized later

### LOW Priority

#### Polish & Enhancement
- [ ] **Footer** — audit spacing, token usage, responsive layout
- [ ] **Notifications component** — `hover:text-neutral-900` in warning dismiss button
- [ ] **CustomBadge** — warning variants use `text-neutral-900`
- [ ] **Product detail** — `bg-neutral-600` for out-of-stock badge (works but not tokenized)
- [ ] **Skeleton loading** — add skeleton screens for product grid loading (currently uses spinner overlay)
- [ ] **Scroll restoration** — verify products page preserves scroll position on back navigation
- [ ] **Print styles** — no print CSS exists
- [ ] **Dark mode** — currently disabled ("light only for now"), entire token layer exists as aliases

#### Performance
- [ ] **Image optimization** — verify all product images use `srcset`/`sizes` for responsive loading
- [ ] **Bundle splitting** — audit route-level code splitting
- [ ] **Third-party scripts** — audit for async/defer loading
- [ ] **Virtualized lists** — consider for product grids with 50+ items

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

### Validation
Run before committing:
```bash
npx svelte-check --threshold error
```
Current status: **0 errors, 0 warnings** ✅
