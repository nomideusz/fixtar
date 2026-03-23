# Audit 02 — Products & Product Detail
**Scope:** Products page, Product detail, ProductCard, ProductCardSkeleton, ProductGallery, ImageZoomModal  
**Auditor:** FixTar Design System Audit  
**Date:** 2026-03-23  
**Skill ref:** `C:/Users/BartoszDymet/.agents/skills/fixtar-web-design/SKILL.md`

---

> **Files 6–10 (QuickViewModal, CategoryFilter, MobileFilterPanel, ActiveFilters) do not exist.**  
> All four were deleted in Session 14. No issues to report for those. ✅

---

## 🔴 RED — Critical (breaks design contract, accessibility, or correctness)

---

### R1 · `products/[slug]/+page.svelte` L321–340 — `transition-all` on primary CTA + heavy shadow/scale animation

```svelte
<Button
  class="w-full transform py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
>
```

`transition: all` is explicitly banned by the skill. Animating `shadow` is also GPU-expensive.  
**Fix:** Replace with explicit `transition: transform 0.2s ease, opacity 0.2s ease`. Remove `hover:shadow-xl`.

---

### R2 · `products/[slug]/+page.svelte` L558, L621 — `transition: all` in local styles (×2)

```css
/* L558 — .wishlist-detail-btn */
transition: all 0.15s ease;

/* L621 — .buy-now-btn */
transition: all 0.2s ease;
```

Both use `transition: all`. Enumerating properties is required.  
**Fix:**
```css
transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
```

---

### R3 · `products/[slug]/+page.svelte` L562–564, L568–570 — Raw hex + raw rgba

```css
color: #ef4444;
border-color: #ef4444;
background: rgba(239, 68, 68, 0.04);
```

Hardcoded red hex value instead of a design token. There is no `--ft-danger` token — the correct approach is to add one to `app.css` and reference it.  
**Fix:** Add `--ft-danger: #dc2626;` and `--ft-danger-light: rgba(220, 38, 38, 0.05);` to `app.css`, then:
```css
color: var(--ft-danger);
border-color: var(--ft-danger);
background: var(--ft-danger-light);
```

---

### R4 · `products/[slug]/+page.svelte` L237–388 — Card wrapper for purchase area

```svelte
<Card class="from-[--ft-frost] to-[--ft-frost] border-[--ft-accent]/20 border bg-linear-to-br p-6">
```

The purchase area is the most important element on the page. Wrapping it in a `bg-linear-to-br` Card adds visual clutter exactly where the photo should be the hero. Also `bg-linear-to-br from-[--ft-frost] to-[--ft-frost]` is a no-op gradient (same value both ends).  
**Fix:** Replace the `<Card>` wrapper with a plain `<div>`. Remove the gradient and border. Use spacing (`gap`, `pt-*`) to breathe instead. Keep the quantity/total area visually clean.

---

### R5 · `products/[slug]/+page.svelte` L390 — Out-of-stock Card with non-`--ft-*` token

```svelte
<Card class="bg-danger-500/10 border-danger-500/20 border p-6">
  <svg class="text-danger ...">
```

`danger-500`, `border-danger-500/20`, and `text-danger` are not `--ft-*` tokens.  
**Fix:** Use `bg-[color-mix(in_srgb,var(--ft-danger)_8%,transparent)]` or add `--ft-danger-light` to tokens (per R3). Replace with:
```svelte
<div class="rounded-xl border border-[--ft-danger]/20 bg-[--ft-danger-light] p-6">
```

---

### R6 · `products/[slug]/+page.svelte` L558 — Wishlist button touch target `min-height: 36px`

```css
.wishlist-detail-btn {
  min-height: 36px; /* ← 36px < 44px WCAG minimum */
}
```

The wishlist button is interactive and must meet the 44px touch target requirement.  
**Fix:** `min-height: 44px;`

---

### R7 · `products/[slug]/+page.svelte` L511 — Category pill touch target `min-height: 40px`

```css
.category-pill {
  min-height: 40px; /* ← 40px < 44px WCAG minimum */
}
```

Category pills are navigational links — interactive elements that require ≥44px.  
**Fix:** `min-height: 44px;`

---

### R8 · `ProductGallery.svelte` L2, L17, L120 — Card wrapper on product gallery

```svelte
import Card from '$lib/components/ui/Card.svelte';
...
<Card class="overflow-hidden">
  <!-- main image + thumbnails -->
</Card>
```

The product gallery is the hero of the detail page. Wrapping it in a Card adds an invisible (but real) box model with background and potential shadow. Per design rules: "Content floats on the white page."  
**Fix:** Replace `<Card>` with a plain `<div class="overflow-hidden">`.

---

### R9 · `ProductGallery.svelte` L31 — `object-cover` crops product photography

```svelte
class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
```

Product images must use `object-contain` (preserves aspect ratio, shows full tool). `object-cover` crops power tool photos and hides important detail.  
**Fix:** `object-contain` with frost background (already on the container).

---

### R10 · `ProductGallery.svelte` L40, L82 — `transition-all` (×2)

```svelte
<!-- L40: zoom overlay -->
class="... transition-all duration-300 group-hover:opacity-100"

<!-- L82: thumbnail border -->
class="... transition-all duration-200 ..."
```

Two instances of `transition-all`. Both should enumerate properties.  
**Fix L40:** `transition: opacity 0.3s ease`  
**Fix L82:** `transition: border-color 0.2s ease`

---

### R11 · `ImageZoomModal.svelte` L283–288 — Zoom control buttons touch target < 44px

```css
.zoom-control-button {
  padding: 0.5rem;  /* 8px each side */
}
/* Icon size: 20px (h-5 w-5). Total: 20 + 16 = 36px < 44px */
```

All five zoom control buttons (prev, zoom-out, reset, zoom-in, next) fail the 44px touch target.  
**Fix:** `padding: 0.75rem;` (12px) → total ≥44px. Or add explicit `min-width: 44px; min-height: 44px;`.

---

## 🟠 ORANGE — Important (degrades UX or violates design principles)

---

### O1 · `products/[slug]/+page.svelte` L321–340, L343–348 — Two competing CTAs

```svelte
<Button ...>Dodaj do koszyka</Button>
<button class="buy-now-btn" ...>Kup teraz</button>
```

The design system explicitly prohibits heavy CTA buttons. Having **two** CTAs stacked is doubly anti-pattern. "Kup teraz" especially mimics aggressive e-commerce dark patterns.  
**Fix:** Keep a single, understated action. Consider:
- A single quiet "Dodaj do koszyka" as a text link or icon+text button (not a full-width CTA)
- Remove "Kup teraz" entirely — let checkout flow from the cart

---

### O2 · `products/[slug]/+page.svelte` L148, L315 — Price uses `--ft-accent` (teal), not `--ft-cta` (orange)

```svelte
<span class="text-[--ft-accent] text-4xl font-bold">
  {product.price.toFixed(2)} zł
</span>
```

Per the token system: `--ft-cta` (#FF6B00, orange) is the "Action" color for prices and active states. `--ft-accent` (#3E8B8B, teal) is for "labels, status indicators, links." Prices are action-oriented and should use `--ft-cta`.  
**Fix:** Replace `text-[--ft-accent]` → `text-[--ft-cta]` on both price spans (L148 and L315).

---

### O3 · `products/[slug]/+page.svelte` L141, L188, L208, L222, L420 — 5× `border-b border-[--ft-line]` dividers

```svelte
<div class="pb-5 border-b border-[--ft-line]">  <!-- header -->
<div class="pb-5 border-b border-[--ft-line]">  <!-- categories -->
<div class="pb-5 border-b border-[--ft-line]">  <!-- description -->
<div class="pb-5 border-b border-[--ft-line]">  <!-- spec table -->
<section class="mt-16 border-t border-[--ft-line] pt-12"> <!-- related -->
```

Five horizontal lines dividing adjacent content blocks is heavy. The design principle states: "Use spacing, not borders, to separate sections."  
**Fix:** Remove `border-b` from all four content blocks in the product info column. Rely on `pb-5 gap-5` spacing (already present). The related section `border-t` is OK as a major section break — keep it or replace with `mt-20`.

---

### O4 · `products/[slug]/+page.svelte` — Separate page instead of SlideOver

The product detail is a full separate page. Per the design skill (Section 5 + Section 13): product detail should be a **SlideOver** — a right panel on desktop, bottom sheet on mobile. Products page stays visible underneath.  
**Recommendation:** Port the SlideOver pattern from `C:\dev\apps\asini\apps\yoga\src\lib\components\SlideOver.svelte`, replacing `--sf-*` tokens with `--ft-*`.

---

### O5 · `ProductCard.svelte` L132, L162 — `--color-danger` / `--color-success` instead of `--ft-*`

```css
background: var(--color-danger);   /* discount tag */
color: var(--color-success);       /* availability text */
```

`--color-danger` and `--color-success` exist in `app.css` but are **not** `--ft-*` tokens. They fall outside the design system namespace.  
**Fix:** Either add `--ft-danger: var(--color-danger)` and `--ft-success: var(--color-success)` aliases to `app.css`, or use them consistently as `--color-danger` across all files (not `bg-danger`/`text-success` Tailwind classes). Whichever is chosen, make it consistent with [slug]/+page.svelte.

---

### O6 · `products/[slug]/+page.svelte` L46, L155, L164, L303, L356, L393 — `bg-danger` / `text-success` / `text-warning` Tailwind classes

```svelte
class: 'bg-danger'
class="bg-danger rounded-lg ..."
class:bg-success / bg-danger
class="text-warning ..."
class="text-success h-4 w-4"
class="text-danger mx-auto ..."
```

Tailwind shorthand classes like `bg-danger`, `text-success`, `text-warning` are not defined in the design token system. These rely on Tailwind's implicit color mapping (which may or may not resolve to `--color-danger`). They should be explicit `--ft-*` or `--color-*` references.  
**Fix:** Replace `bg-danger` → `bg-[--color-danger]`, `text-success` → `text-[--color-success]`, etc. Long-term: add proper `--ft-*` tokens.

---

### O7 · `ImageZoomModal.svelte` L133 — Raw `rgba(0, 0, 0, 0.4)` backdrop color

```svelte
style="background-color: rgba(0, 0, 0, 0.4); overscroll-behavior: contain;"
```

Raw rgba instead of a token. The `overscroll-behavior` could also move to the CSS class.  
**Fix:** Add `--ft-backdrop: rgba(0, 0, 0, 0.4)` to `app.css` (alongside other shadow tokens), then use `bg-[--ft-backdrop]` or `style="background-color: var(--ft-backdrop)"`.

---

### O8 · `ImageZoomModal.svelte` L255 — Product image missing `width` + `height` (CLS)

```svelte
<img
  src={images[selectedIndex]}
  alt={productName}
  class="max-w-none transition-transform duration-200 select-none"
  draggable="false"
/>
```

No `width` or `height` attributes. Inside a fullscreen modal the image dimensions are unknown, but omitting them can cause CLS and prevents proper aspect-ratio preservation before the image loads.  
**Fix:** Add `width="1200" height="1200"` (or appropriate max dimensions for gallery images) as CLS hints.

---

### O9 · `ProductGallery.svelte` L90 — Thumbnail images use `object-cover`

```svelte
class="h-full w-full object-cover"
```

Same issue as R9 but for thumbnails. Thumbnails must accurately represent the full product shape.  
**Fix:** `object-contain` on thumbnails too.

---

## 🟡 YELLOW — Minor (polish improvements, minor inconsistencies)

---

### Y1 · `products/+page.svelte` L421 — Product grid `minmax(220px, 1fr)` — cards are small

```css
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
```

Design brief says "Large product cards. Products are the hero — big images." 220px minimum is tight, especially on mid-range screens where you get 5–6 columns of tiny cards.  
**Recommendation:** `minmax(260px, 1fr)` for desktop, or consider a fixed 3/4 column grid per breakpoint for more intentional sizing.

---

### Y2 · `ProductCard.svelte` L43 — Image dimensions `320×240` don't match `aspect-ratio: 1` container

```svelte
<img src={mainImageUrl} alt={product.name} loading="lazy" width="320" height="240" />
```

The container has `aspect-ratio: 1` (square), but the CLS hint says `320×240` (4:3). The browser uses `width`/`height` to reserve space before load. If the actual image is square (or 1:1), the pre-load space will be wrong → CLS.  
**Fix:** `width="320" height="320"` to match the 1:1 container.

---

### Y3 · `ProductCardSkeleton.svelte` L53 — Raw `rgba` in shimmer gradient

```css
background: linear-gradient(
  90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.5) 50%,
  transparent 100%
);
```

Raw `rgba(255,255,255,0.5)`. This is a shimmer effect where the literal white value is somewhat justified, but for consistency it could use `color-mix` or a token.  
**Acceptable as-is** for the shimmer effect, but note for future: `rgba(255,255,255,0.5)` will not work correctly in dark mode.

---

### Y4 · `ProductCardSkeleton.svelte` L26–30, L102–104 — Skeleton implies a CTA button exists

```css
.skeleton-btn {
  height: 44px;
  width: 100%;
}
```

The skeleton renders a full-width button placeholder. But `ProductCard.svelte` has **no** "Add to Cart" button on the card (correct per design). The skeleton is misleading — it shows layout that doesn't exist in the real card, causing a layout shift on load.  
**Fix:** Remove `.skeleton-btn` and the `skeleton-btn` div from the skeleton template. The real card's info section has: name + availability text + price — skeleton should reflect that only.

---

### Y5 · `ProductCardSkeleton.svelte` — Shimmer duration 1.8s vs spec 1.5s

```css
animation: shimmer 1.8s ease-in-out infinite;
```

Design skill (Section 11) specifies `1.5s` for skeleton shimmer.  
**Fix:** `1.5s ease-in-out infinite`

---

### Y6 · `ImageZoomModal.svelte` L289 — Invalid CSS `transition: colors`

```css
.zoom-control-button:hover {
  color: var(--ft-text-muted);
}
/* Above the :hover rule: */
.zoom-control-button {
  padding: 0.5rem;
  color: var(--ft-text);
  transition: colors 0.2s;  /* ← "colors" is not a valid CSS property name */
}
```

`transition: colors` is invalid CSS — the correct property name is `color`. This means the hover color transition is instant (no animation).  
**Fix:** `transition: color 0.2s ease;`

---

### Y7 · `ProductGallery.svelte` L67 — `!text-white` forced override

```svelte
class="rounded-lg px-3 py-1.5 text-xs font-semibold !text-white shadow-lg {badge.class}"
```

Using `!important` (`!text-white`) to force white text on badges suggests a specificity battle. The badge class (e.g. `bg-[--ft-accent]`) should not be fighting `text-white`.  
**Fix:** Move the `text-white` into the badge styles themselves, or ensure badge classes don't override text color from outside.

---

### Y8 · `products/[slug]/+page.svelte` L459, L585 — `border-bottom` in `.product-description :global(h3)` and `.spec-row`

```css
.product-description :global(h3) {
  border-bottom: 1px solid var(--ft-line);
  padding-bottom: 0.5rem;
}

.spec-row {
  border-bottom: 1px solid var(--ft-line);
}
```

Minor — description h3 borders and spec-row dividers are reasonable for tabular data. The spec table dividers are semantically justified. Keep spec-row borders. Consider removing the `border-bottom` on `h3` inside description — use `margin-bottom` instead.

---

### Y9 · `products/[slug]/+page.svelte` — Heading color uses `--ft-text` not `--ft-text-strong`

```svelte
<h1 class="mb-4 text-3xl leading-tight font-bold text-[--ft-text] lg:text-4xl">
  {product.name}
</h1>
```

Product name heading uses `--ft-text` (#2e3a46 dark slate) rather than `--ft-text-strong` (#014783 navy). Per the token table, headings should use `--ft-text-strong` for maximum clarity.  
**Fix:** `text-[--ft-text-strong]`

---

### Y10 · `products/[slug]/+page.svelte` L323 — `hover:scale-[1.02]` on full-width button

```svelte
class="w-full transform py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
```

A subtle scale on a full-width element causes the button to visually overflow its container on hover, which looks like a layout bug on constrained widths. The skill recommends `translateY(-2px)` for lift effects, not scale.  
**Fix (if button is kept):** Replace `hover:scale-[1.02]` with `hover:-translate-y-px`. Remove `transition-all` (per R1).

---

## Summary Table

| ID | File | Line | Category | Issue |
|----|------|------|----------|-------|
| R1 | `[slug]/+page.svelte` | 323 | `transition-all` on Button | Banned |
| R2 | `[slug]/+page.svelte` | 558, 621 | `transition: all` ×2 in styles | Banned |
| R3 | `[slug]/+page.svelte` | 562–570 | Raw `#ef4444` + `rgba(239,68,68)` | No raw hex |
| R4 | `[slug]/+page.svelte` | 237–388 | Card wrapper on purchase area | No card boxes |
| R5 | `[slug]/+page.svelte` | 390 | `bg-danger-500/10` non-token on out-of-stock card | Not --ft-* |
| R6 | `[slug]/+page.svelte` | 558 | Wishlist btn `min-height: 36px` | < 44px touch |
| R7 | `[slug]/+page.svelte` | 511 | Category pill `min-height: 40px` | < 44px touch |
| R8 | `ProductGallery.svelte` | 2, 17, 120 | Card wrapper on gallery | No card boxes |
| R9 | `ProductGallery.svelte` | 31 | `object-cover` crops product photos | Use contain |
| R10 | `ProductGallery.svelte` | 40, 82 | `transition-all` ×2 | Banned |
| R11 | `ImageZoomModal.svelte` | 283–288 | Zoom buttons 36px touch target | < 44px touch |
| O1 | `[slug]/+page.svelte` | 321–348 | Two competing CTAs | Design violation |
| O2 | `[slug]/+page.svelte` | 148, 315 | Prices use `--ft-accent` not `--ft-cta` | Wrong token |
| O3 | `[slug]/+page.svelte` | 141,188,208,222,420 | 5× `border-b` dividers | Anti-pattern |
| O4 | `[slug]/+page.svelte` | — | Full page instead of SlideOver | Architecture |
| O5 | `ProductCard.svelte` | 132, 162 | `--color-danger/success` not `--ft-*` | Token namespace |
| O6 | `[slug]/+page.svelte` | 46,155,164,303,356,393 | `bg-danger`/`text-success`/`text-warning` Tailwind classes | Not --ft-* |
| O7 | `ImageZoomModal.svelte` | 133 | Raw `rgba(0,0,0,0.4)` backdrop | No raw values |
| O8 | `ImageZoomModal.svelte` | 255 | Main image no `width`+`height` | CLS |
| O9 | `ProductGallery.svelte` | 90 | Thumbnails `object-cover` | Use contain |
| Y1 | `+page.svelte` | 421 | Grid `minmax(220px)` — cards too small | Design brief |
| Y2 | `ProductCard.svelte` | 43 | `width=320 height=240` but container is 1:1 | CLS mismatch |
| Y3 | `ProductCardSkeleton.svelte` | 53 | Raw `rgba(255,255,255,0.5)` shimmer | Minor |
| Y4 | `ProductCardSkeleton.svelte` | 102–104 | Skeleton has button, real card doesn't | Layout shift |
| Y5 | `ProductCardSkeleton.svelte` | — | Shimmer 1.8s vs spec 1.5s | Timing |
| Y6 | `ImageZoomModal.svelte` | 289 | `transition: colors` — invalid CSS | Typo |
| Y7 | `ProductGallery.svelte` | 67 | `!text-white` forced override | Specificity |
| Y8 | `[slug]/+page.svelte` | 459, 585 | `border-bottom` in description h3 | Minor borders |
| Y9 | `[slug]/+page.svelte` | 134 | Product name h1 uses `--ft-text` not `--ft-text-strong` | Typography |
| Y10 | `[slug]/+page.svelte` | 323 | `hover:scale-[1.02]` overflow on full-width btn | Layout |

---

## Fix Priority Order

1. **R11, R6, R7** — Touch targets (accessibility, legal risk)
2. **R3, R5, O6** — Token violations (consistency)
3. **R1, R2, R10** — `transition: all` (performance)
4. **R9, O9** — `object-cover` → `object-contain` (product photography quality)
5. **R4, R8** — Remove Card wrappers (design philosophy)
6. **O1** — Remove "Kup teraz" CTA (design philosophy)
7. **O2** — Fix price color token (visual identity)
8. **O3** — Remove `border-b` divider chain (design philosophy)
9. **Y4** — Fix skeleton to match real card layout
10. **O4** — SlideOver architecture (major refactor, low urgency)

---

## Files NOT Found (Deleted in Session 14) ✅

| File | Status |
|------|--------|
| `QuickViewModal.svelte` | Deleted — ✅ |
| `CategoryFilter.svelte` | Deleted — ✅ |
| `MobileFilterPanel.svelte` | Deleted — ✅ |
| `ActiveFilters.svelte` | Deleted — ✅ |

No issues to report for these.
