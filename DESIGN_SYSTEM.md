# FixTar Design System

> Design token reference and migration guide for the FixTar brand.

---

## Architecture

The design system is built on **three layers**:

| Layer | Location | Purpose |
|-------|----------|---------|
| **1. Palette tokens** | `@theme` block in `src/app.css` | Raw color / font / radius values. Generate Tailwind utility classes (`bg-brand-600`, `text-accent-500`, etc.) |
| **2. Semantic tokens** | `:root` CSS custom properties in `src/app.css` | Map design *intent* to palette values (`--ft-primary`, `--ft-border`, etc.). Enables dark-mode and theme switching. |
| **3. Component classes** | `@layer components` in `src/app.css` + Svelte components | Consume semantic tokens. Ready-made `.btn-primary`, `.card`, `.input` classes. |

### Why this structure?

- **Changing the brand** = update Layer 1 palette values → everything cascades.
- **Adding dark mode** = add `:root` overrides in a `prefers-color-scheme` media query at Layer 2.
- **Tailwind utilities still work** for one-off styling; semantic tokens keep components consistent.

---

## 1. Palette Tokens (Tailwind utilities)

### Brand — Orange (industrial, tools, energy)

| Token | Value | Utility example |
|-------|-------|-----------------|
| `--color-brand-50` | `#fff7ed` | `bg-brand-50` |
| `--color-brand-100` | `#ffedd5` | `bg-brand-100` |
| `--color-brand-200` | `#fed7aa` | `text-brand-200` |
| `--color-brand-300` | `#fdba74` | `border-brand-300` |
| `--color-brand-400` | `#fb923c` | |
| `--color-brand-500` | `#f97316` | |
| **`--color-brand-600`** | **`#ea580c`** | **Primary brand color** |
| `--color-brand-700` | `#c2410c` | Hover state |
| `--color-brand-800` | `#9a3412` | Active / pressed |
| `--color-brand-900` | `#7c2d12` | |
| `--color-brand-950` | `#431407` | |

### Accent — Teal (trust, contrast)

| Token | Value | Utility example |
|-------|-------|-----------------|
| `--color-accent-50` | `#f0fdfa` | `bg-accent-50` |
| `--color-accent-100` | `#ccfbf1` | |
| `--color-accent-200` | `#99f6e4` | |
| `--color-accent-300` | `#5eead4` | |
| `--color-accent-400` | `#2dd4bf` | |
| `--color-accent-500` | `#14b8a6` | |
| **`--color-accent-600`** | **`#0d9488`** | **Secondary actions** |
| `--color-accent-700` | `#0f766e` | |
| `--color-accent-800` | `#115e59` | |
| `--color-accent-900` | `#134e4a` | |
| `--color-accent-950` | `#042f2e` | |

### Neutral — Slate (text, backgrounds, borders)

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-neutral-50` | `#f8fafc` | Page backgrounds |
| `--color-neutral-100` | `#f1f5f9` | Secondary surfaces |
| `--color-neutral-200` | `#e2e8f0` | Borders |
| `--color-neutral-300` | `#cbd5e1` | Hover borders |
| `--color-neutral-400` | `#94a3b8` | Muted text |
| `--color-neutral-500` | `#64748b` | Placeholder text |
| `--color-neutral-600` | `#475569` | Secondary text |
| `--color-neutral-700` | `#334155` | |
| `--color-neutral-800` | `#1e293b` | Footer background |
| `--color-neutral-900` | `#0f172a` | Primary text |
| `--color-neutral-950` | `#020617` | |

### Status Colors

| Token | Value | Utility |
|-------|-------|---------|
| `--color-success` | `#16a34a` | `text-success` |
| `--color-success-light` | `#dcfce7` | `bg-success-light` |
| `--color-warning` | `#f59e0b` | `text-warning` |
| `--color-warning-light` | `#fef3c7` | `bg-warning-light` |
| `--color-danger` | `#dc2626` | `text-danger` |
| `--color-danger-light` | `#fee2e2` | `bg-danger-light` |
| `--color-info` | `#2563eb` | `text-info` |
| `--color-info-light` | `#dbeafe` | `bg-info-light` |

---

## 2. Semantic Tokens (CSS custom properties)

Use these in component CSS via `var(--ft-*)`. They reference the palette tokens above.

### Surface / Background

| Property | Default | Description |
|----------|---------|-------------|
| `--ft-surface` | `#ffffff` | Main page background |
| `--ft-surface-secondary` | `neutral-50` | Alternate sections |
| `--ft-surface-tertiary` | `neutral-100` | Inputs, cards |
| `--ft-surface-elevated` | `#ffffff` | Modals, popovers |
| `--ft-surface-overlay` | `rgba(0,0,0,0.5)` | Backdrop overlays |

### Text

| Property | Default | Description |
|----------|---------|-------------|
| `--ft-text` | `neutral-900` | Primary text |
| `--ft-text-secondary` | `neutral-600` | Secondary text |
| `--ft-text-muted` | `neutral-400` | Hints, placeholders |
| `--ft-text-inverse` | `#ffffff` | Text on dark/brand bg |
| `--ft-text-brand` | `brand-600` | Branded text |

### Borders

| Property | Default | Description |
|----------|---------|-------------|
| `--ft-border` | `neutral-200` | Default borders |
| `--ft-border-hover` | `neutral-300` | Hover state |
| `--ft-border-focus` | `brand-500` | Focus state |

### Interactive (Primary)

| Property | Default | Description |
|----------|---------|-------------|
| `--ft-primary` | `brand-600` | Buttons, links |
| `--ft-primary-hover` | `brand-700` | Hover |
| `--ft-primary-active` | `brand-800` | Active/pressed |
| `--ft-primary-light` | `brand-100` | Light accent bg |
| `--ft-primary-ring` | `brand-500` | Focus ring |

### Interactive (Secondary)

| Property | Default | Description |
|----------|---------|-------------|
| `--ft-secondary` | `accent-600` | Secondary actions |
| `--ft-secondary-hover` | `accent-700` | Hover |
| `--ft-secondary-light` | `accent-100` | Light accent bg |

---

## 3. Typography

| Token | Value | Utility |
|-------|-------|---------|
| `--font-sans` | `'Inter', system-ui, …` | `font-sans` (body) |
| `--font-heading` | `'Inter', system-ui, …` | `font-heading` (h1–h6) |
| `--font-mono` | `'JetBrains Mono', …` | `font-mono` |

> **Note:** To use Inter and JetBrains Mono, add Google Fonts links in `app.html` when ready:
> ```html
> <link rel="preconnect" href="https://fonts.googleapis.com" />
> <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet" />
> ```
> Until then, the system-ui fallback chain Provides good typography.

---

## 4. Border Radius

| Token | Value | Utility |
|-------|-------|---------|
| `--radius-xs` | `0.25rem` | `rounded-xs` |
| `--radius-sm` | `0.375rem` | `rounded-sm` |
| `--radius-md` | `0.5rem` | `rounded-md` |
| `--radius-lg` | `0.75rem` | `rounded-lg` |
| `--radius-xl` | `1rem` | `rounded-xl` |
| `--radius-2xl` | `1.5rem` | `rounded-2xl` |
| `--radius-3xl` | `2rem` | `rounded-3xl` |
| `--radius-full` | `9999px` | `rounded-full` |

---

## 5. Migration Guide

### Replacing hardcoded colors in templates

When you encounter old blue/purple hardcoded colors, replace them with brand tokens:

| Old (Kompi) | New (FixTar) | When to use |
|-------------|--------------|-------------|
| `bg-blue-600` | `bg-brand-600` | Primary buttons, badges |
| `hover:bg-blue-700` | `hover:bg-brand-700` | Hover states |
| `focus:ring-blue-500` | `focus:ring-brand-500` | Focus rings |
| `text-blue-600` | `text-brand-600` | Links, branded text |
| `border-blue-600` | `border-brand-600` | Outlines |
| `from-purple-600 to-blue-600` | `from-brand-600 to-accent-600` | Gradients |
| `from-blue-50 to-purple-50` | `from-brand-50 to-accent-50` | Light gradients |
| `bg-gray-50` | `bg-neutral-50` | Backgrounds |
| `text-gray-900` | `text-neutral-900` | Text |
| `border-gray-200` | `border-neutral-200` | Borders |

### Replacing hardcoded colors in CSS

```css
/* Before (hardcoded) */
.my-component {
  background-color: #2563eb;
  border: 1px solid #d1d5db;
  color: #1f2937;
}

/* After (semantic tokens) */
.my-component {
  background-color: var(--ft-primary);
  border: 1px solid var(--ft-border);
  color: var(--ft-text);
}
```

### Component checklist

Components already migrated to brand tokens:

- [x] `Button.svelte` — all variants use `brand-*` / `accent-*`
- [x] `Card.svelte` — gradient accent bar, hover glow
- [x] `Input.svelte` — focus ring, border states
- [x] `Hero.svelte` — backgrounds, shadow effects
- [x] `ProductCard.svelte` — badges, hover, CTA button
- [x] `app.css` — all component classes use semantic tokens

Components still using some old Tailwind defaults (safe to migrate later):

- [ ] `+layout.svelte` — navbar, footer, cart drawer (largest file, ~758 lines)
- [ ] `Notifications.svelte` — toast colors
- [ ] `Breadcrumbs.svelte` — references undefined `--color-primary` vars
- [ ] `CustomBadge.svelte` — references `bg-primary`, `bg-success`
- [ ] `LoadingSpinner.svelte` — spinner color
- [ ] `AnnouncementBanner.svelte` — banner background
- [ ] Route pages — scattered `blue-*` / `gray-*` classes

### Adding dark mode (future)

The `:root` block in `app.css` already has a commented dark-mode section. To enable:

1. Uncomment the `@media (prefers-color-scheme: dark)` block
2. Adjust the semantic token values for dark surfaces/text
3. Components using `var(--ft-*)` will adapt automatically
4. Components using Tailwind utilities need `dark:` variant prefixes

---

## 6. File Map

| File | Role |
|------|------|
| `src/app.css` | **Single source of truth** for all design tokens |
| `tailwind.config.js` | Content paths only (Tailwind v4 uses CSS-first config) |
| `src/lib/components/ui/` | Reusable UI components (consume tokens) |
| `src/lib/components/layout/` | Layout components (navbar, footer, etc.) |
| `src/lib/img/` | Brand logos (`logo-FixTar.png`, `logo-FixTar-white.png`) |
| `static/` | Favicons, robots.txt |
| `DESIGN_SYSTEM.md` | This document |
