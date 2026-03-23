# Audit 03 — Cart, Checkout & Commerce Pages

**Audited:** 2026-03-23  
**Skill used:** `fixtar-web-design`  
**Files:** 10 (7 pages + 3 checkout components)

---

## Files Audited

| # | File | Status |
|---|---|---|
| 1 | `src/routes/cart/+page.svelte` | 🔴 Needs full rewrite |
| 2 | `src/routes/checkout/+page.svelte` | 🔴 Multiple critical issues |
| 3 | `src/routes/checkout/success/+page.svelte` | 🟠 Heavy token violations |
| 4 | `src/routes/orders/[id]/+page.svelte` | 🟠 Multiple cards + tokens |
| 5 | `src/routes/deals/+page.svelte` | 🔴 CTA button + card |
| 6 | `src/routes/search/+page.svelte` | 🟡 Token violations only |
| 7 | `src/routes/wishlist/+page.svelte` | 🟠 CTA button |
| 8 | `src/lib/components/checkout/SectionHeader.svelte` | 🟡 Wrong text token |
| 9 | `src/lib/components/checkout/OrderSummary.svelte` | 🟠 Card + transition:all + tokens |
| 10 | `src/lib/components/checkout/SelectableMethodCard.svelte` | 🟠 transition:all |

---

## 🔴 RED — Critical

### C-01 · Cart page: 100% English UI

**File:** `src/routes/cart/+page.svelte`

The entire cart page is in English — every user-facing string needs translation.

| Line | English string | Polish replacement |
|---|---|---|
| 26 | `<title>Shopping Cart - FixTar</title>` | `Koszyk - FixTar` |
| 27 | `content="Review your shopping cart"` | `Przejrzyj zawartość koszyka` |
| 30 | `Shopping Cart` (h1) | `Koszyk` |
| 40 | `Your cart is empty` (h2) | `Twój koszyk jest pusty` |
| 41 | `Start shopping to add items to your cart` | `Zacznij zakupy, aby dodać produkty do koszyka` |
| 42 | `Browse Products` (button label) | `Przeglądaj produkty` |
| 48 | `Cart Items ({cart.items.length})` (h2) | `Produkty w koszyku ({cart.items.length})` |
| 82 | `Remove` (button text) | `Usuń` |
| 95 | `Order Summary` (h2) | `Podsumowanie` |
| 99 | `label="Coupon Code"` | `label="Kod rabatowy"` |
| 99 | `placeholder="Enter code"` | `placeholder="Wpisz kod"` |
| 102 | `Apply` (button label) | `Zastosuj` |
| 105 | `Coupon applied! {discount * 100}% off` | `Kod zastosowany! Rabat {discount * 100}%` |
| 111 | `Subtotal` | `Suma częściowa` |
| 115 | `Discount` | `Rabat` |
| 119 | `Shipping` | `Dostawa` |
| 120 | `Free` | `Darmowa` |
| 123 | `Total` | `Razem` |
| 127 | `Proceed to Checkout` (button) | `Przejdź do kasy` |
| 131 | `Continue Shopping` (link) | `Kontynuuj zakupy` |

---

### C-02 · Cart page: `$` currency used throughout

**File:** `src/routes/cart/+page.svelte`

All price displays use `$` prefix. Must use `zł` suffix with a space.

| Line | Current | Should be |
|---|---|---|
| 58 | `$\{item.price.toFixed(2)\}` | `{item.price.toFixed(2)} zł` |
| 80 | `$\{(item.price * item.quantity).toFixed(2)\}` | `{(item.price * item.quantity).toFixed(2)} zł` |
| 112 | `$\{subtotal.toFixed(2)\}` | `{subtotal.toFixed(2)} zł` |
| 116 | `-$\{discountAmount.toFixed(2)\}` | `-{discountAmount.toFixed(2)} zł` |
| 124 | `$\{total.toFixed(2)\}` | `{total.toFixed(2)} zł` |

---

### C-03 · Cart page: Two Card-wrapper bordered boxes

**File:** `src/routes/cart/+page.svelte`

The "Cart Items" section and "Order Summary" section are each wrapped in a `bg-[--ft-frost]` box with a visible border — exactly the "bordered container" pattern the design system forbids.

```svelte
<!-- Line 47 — WRONG -->
<div class="border border-[--ft-line] bg-[--ft-frost] p-6">

<!-- Line 94 — WRONG -->
<div class="border border-[--ft-line] bg-[--ft-frost] p-6">
```

**Fix:** Remove the border and `bg-[--ft-frost]` from both wrappers. Use spacing (`gap-8`, `pt-8`) to separate the columns. Content floats on white.

---

### C-04 · Cart page: CTA buttons violate "no CTA buttons" rule

**File:** `src/routes/cart/+page.svelte`

| Line | Current | Fix |
|---|---|---|
| 42 | `<Button href="/products" class="mt-6">Browse Products</Button>` | Plain text link: `<a href="/products" class="...">Przeglądaj produkty</a>` |
| 127 | `<Button href="/checkout" fullWidth size="lg">Proceed to Checkout</Button>` | Subtle text-link or minimal styled anchor, no large `<Button>` |

The design system is explicit: "No CTA buttons." The large full-width checkout button is the most prominent offender.

---

### C-05 · Checkout page: All five form sections wrapped in `<Card>`

**File:** `src/routes/checkout/+page.svelte`

Every form section uses `<Card class="p-8">` as a container — five bordered boxes stacked on the left column. The design system says: *"Avoid Card wrappers, bordered containers, boxed sections. Content floats on the white page."*

| Approx. Line | Card used for |
|---|---|
| ~156 | Empty cart state |
| ~171 | Dane kontaktowe |
| ~224 | Adres dostawy |
| ~314 | Metoda dostawy |
| ~355 | Metoda płatności |
| ~388 | Dodatkowe informacje |

**Fix:** Replace `<Card class="p-8">` wrappers with plain `<div class="space-y-6">` sections separated by generous `pt-10` / `border-t border-[--ft-line]` (use sparingly) or section headings that create visual hierarchy through typography alone.

---

### C-06 · Deals page: "Kup teraz" CTA button

**File:** `src/routes/deals/+page.svelte` · line ~52

```svelte
<!-- WRONG -->
<Button href="/products" fullWidth>Kup teraz</Button>
```

"Kup teraz" (Buy Now) is explicitly listed in the design system as a forbidden CTA pattern. The design brief says: *"No 'Buy Now!', no 'Shop Now!'"*

**Fix:** Replace with a plain text link or remove entirely — the deal card itself should be the clickable target.

---

### C-07 · Cart page: quantity `+/–` buttons have `p-1` — far below 44px touch target

**File:** `src/routes/cart/+page.svelte` · lines 64 & 72

```svelte
<button class="rounded border border-[--ft-line] p-1 hover:bg-[--ft-frost]" aria-label="Decrease quantity">
```

`p-1` = 4px padding on each side. With a 16px SVG icon, the button is ~24px — well below the 44px minimum required by WCAG and the design system.

**Fix:** Use `p-2.5` minimum (40px) or add `min-w-[44px] min-h-[44px]` explicitly.

---

### C-08 · Checkout page: Non-ft-* tokens used as icon/focus colors (stale Tailwind semantic tokens)

**File:** `src/routes/checkout/+page.svelte`

Multiple uses of `success`, `danger`, `accent-100`, `accent-600` which are Tailwind semantic tokens — not part of the `--ft-*` design system.

| Approx. Line | Violation | Fix |
|---|---|---|
| ~225 | `iconBgClass="bg-accent-100"` | `iconBgClass="bg-[--ft-frost]"` |
| ~225 | `iconColorClass="text-success"` | `iconColorClass="text-[--ft-accent]"` |
| ~316 | `iconBgClass="bg-accent-100"` | `iconBgClass="bg-[--ft-frost]"` |
| ~316 | `iconColorClass="text-accent-600"` | `iconColorClass="text-[--ft-accent]"` |
| ~245 | `class="focus:ring-success focus:ring-2"` (multiple inputs) | `class="focus:ring-[--ft-accent] focus:ring-2"` |
| ~298 | `class="focus:ring-success focus:border-success ..."` (select) | `focus:ring-[--ft-accent] focus:border-[--ft-accent]` |
| ~306 | `class="text-success focus:ring-success ..."` (checkbox) | `text-[--ft-accent] focus:ring-[--ft-accent]` |
| ~last | `class="bg-danger fixed ..."` (error toast) | Use `style="background-color: #dc2626;"` or add `--ft-danger` to app.css |

---

### C-09 · SelectableMethodCard: `transition: all 0.2s` in component CSS

**File:** `src/lib/components/checkout/SelectableMethodCard.svelte` · line ~55 (in `<style>`)

```css
/* WRONG */
.method-card {
  transition: all 0.2s;
}
```

The design system explicitly forbids `transition: all`. It triggers layout recalculation on every animatable property.

**Fix:**
```css
.method-card {
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
```

---

## 🟠 ORANGE — Important

### O-01 · Checkout success page: Heavy use of non-ft-* color tokens

**File:** `src/routes/checkout/success/+page.svelte`

| Token used | Replacement |
|---|---|
| `bg-success`, `text-success`, `bg-success/10`, `text-success-dark`, `bg-success/5`, `border-success/20` | Use `--ft-accent` (teal) for "confirmed/success" states, or add `--ft-success: #16a34a` to app.css as a named token |
| `bg-amber-500/10`, `border-amber-500/20`, `text-amber-600`, `text-amber-700`, `text-amber-800` | Add `--ft-warn: #d97706` to app.css; use `bg-[--ft-warn]/10`, `text-[--ft-warn]` |
| `to-accent-600`, `hover:to-accent-700` (in button gradient) | `to-[--ft-accent-hover]` |
| `bg-accent-100`, `text-accent-600`, `text-accent-800` | `bg-[--ft-frost]`, `text-[--ft-accent]` |
| `bg-warning/10`, `border-warning/30`, `text-warning`, `text-warning-dark` | Use `bg-[--ft-warn]/10` once `--ft-warn` is defined |
| `bg-danger/10 text-danger-dark` | Use `--ft-danger` once defined |

There are **14+ non-ft-* color references** in this file. Every semantic color (`success`, `warning`, `danger`, `amber-*`, `accent-100/600/700`) needs to be routed through a `--ft-*` token.

---

### O-02 · Checkout success page: `transition-all duration-300` on action buttons

**File:** `src/routes/checkout/success/+page.svelte` · lines ~259, ~267

```svelte
<!-- WRONG — two buttons -->
class="... transition-all duration-300 hover:scale-105"
class="... transition-all duration-300"
```

**Fix:** Be explicit:
```svelte
class="... transition: transform 0.2s ease, border-color 0.15s ease"
```

---

### O-03 · Checkout success page: Checkmark icon uses `text-[--ft-text]` on green background

**File:** `src/routes/checkout/success/+page.svelte` · line ~75

```svelte
<div class="bg-success relative mx-auto flex h-24 w-24 ... rounded-full">
  <svg class="h-12 w-12 text-[--ft-text]" ...>  <!-- navy on green = low contrast -->
```

`--ft-text` is `#2e3a46` (dark navy) on a green background. This likely fails WCAG 4.5:1 contrast. The checkmark should be white.

**Fix:** `class="h-12 w-12 text-white"`

---

### O-04 · Checkout success page: Invalid CSS class `to-accent-500/100/8`

**File:** `src/routes/checkout/success/+page.svelte` · near bottom (`<!-- Next Steps -->` card)

```svelte
<Card class="from-[--ft-accent]/10 to-accent-500/100/8 border-2 ...">
```

`to-accent-500/100/8` is not valid CSS or Tailwind syntax. This will silently produce no gradient end-stop.

**Fix:** `to-[--ft-frost]` or `to-[--ft-accent]/5`

---

### O-05 · Orders detail page: Non-ft-* tokens in status config

**File:** `src/routes/orders/[id]/+page.svelte` · lines ~15–26 (statusConfig object)

| Status | Current | Fix |
|---|---|---|
| `pending` | `bg-warning/10 text-warning-dark` | `bg-[--ft-frost] text-[--ft-text-muted]` |
| `shipped` | `bg-accent-100 text-accent-800` | `bg-[--ft-frost] text-[--ft-accent]` |
| `delivered` | `bg-success/10 text-success-dark` | `bg-[--ft-frost] text-[--ft-accent]` or define `--ft-success` |
| `cancelled` | `bg-danger/10 text-danger-dark` | Define `--ft-danger` in app.css |

And in the timeline steps array (~line ~75):
```ts
bgClass: 'bg-accent-100',   // → 'bg-[--ft-frost]'
iconClass: 'text-accent-600', // → 'text-[--ft-accent]'
```

Also in the "Szczegóły zamówienia" section (~line ~185):
```svelte
<div class="bg-accent-100 mr-3 ...">
  <svg class="text-accent-600 ...">
```
→ `bg-[--ft-frost]` / `text-[--ft-accent]`

---

### O-06 · Orders detail page: Product thumbnail missing `width` and `height`

**File:** `src/routes/orders/[id]/+page.svelte` · ~line 140

```svelte
<!-- WRONG — no width/height -->
<img
  src={item.product.mainImage}
  alt={item.product?.name || 'Produkt'}
  class="h-16 w-16 rounded-lg object-cover"
/>
```

**Fix:**
```svelte
<img
  src={item.product.mainImage}
  alt={item.product?.name || 'Produkt'}
  class="h-16 w-16 rounded-lg object-cover"
  width="64"
  height="64"
  loading="lazy"
/>
```

---

### O-07 · Orders detail page: Five `<Card>` wrappers in sidebar + main content

**File:** `src/routes/orders/[id]/+page.svelte`

Every section — Order Items, Timeline, Summary, Payment Info, Address, Actions — is in a `<Card class="p-6">`. Six bordered boxes on one page.

| Section | Card location (approx.) |
|---|---|
| Produkty w zamówieniu | ~line 100 |
| Historia zamówienia | ~line 150 |
| Podsumowanie | ~line 185 |
| Informacje o płatności i dostawie | ~line 210 |
| Adres dostawy | ~line 230 |
| Akcje | ~line 255 |

**Fix:** Section headings with `border-t border-[--ft-line] pt-6` or just large `mt-8` / `pt-8` spacing can replace Card wrappers for the sidebar. The main "Produkty" section can stay as a light `bg-[--ft-frost]` list for each item without a Card container.

---

### O-08 · OrderSummary component: Card wrapper + `transition-all` on submit button + non-ft gradients

**File:** `src/lib/components/checkout/OrderSummary.svelte`

Three issues combined:

1. **Card wrapper** (~line 28): `<Card class="p-8">` wraps the entire component — the outer container is a bordered box.

2. **`transition-all duration-300`** on submit button (~line 100):
```svelte
class="... transition-all duration-300 hover:scale-105"
```
→ `transition: transform 0.2s ease`

3. **Non-ft gradient tokens** on submit button (~line 98):
```svelte
class="from-[--ft-accent] to-accent-600 hover:from-[--ft-accent] hover:to-accent-700 ..."
```
`to-accent-600` and `to-accent-700` are not `--ft-*` tokens.
→ `to-[--ft-accent-hover]` for both

---

### O-09 · Deals page: Newsletter section is a bordered frost box

**File:** `src/routes/deals/+page.svelte` · ~line 58

```svelte
<div class="mt-12 rounded-lg border border-[--ft-line] bg-[--ft-frost] p-8 text-center">
```

This is exactly the "bordered container" anti-pattern — a frost-filled box with a visible border. Use spacing and typography hierarchy instead.

**Fix:** Remove `border border-[--ft-line] bg-[--ft-frost]`. Add generous top margin (`mt-16`) and a plain `border-t border-[--ft-line] pt-12` for separation if needed.

---

### O-10 · Deals page: Discount badge uses `--color-danger` (wrong token namespace)

**File:** `src/routes/deals/+page.svelte` · ~line 46

```svelte
<span class="... bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] ... text-[--color-danger]">
```

`--color-danger` is a Tailwind internal token, not a `--ft-*` design token. The intent is correct (danger/alert color for a discount badge), but should use either `--ft-cta` (orange) for promotions or a properly defined `--ft-danger`.

**Fix (using CTA orange for discount badge):**
```svelte
<span class="rounded-full bg-[--ft-cta-light] px-3 py-1 text-sm font-bold text-[--ft-cta]">
```

---

### O-11 · Search page: Error state uses non-ft-* danger tokens

**File:** `src/routes/search/+page.svelte` · ~line 100

```svelte
<div class="bg-danger-50 border-danger-light rounded-xl border p-6 text-center">
  <h3 class="text-danger-dark mb-2 text-lg font-semibold">Wystąpił błąd</h3>
  <p class="text-danger">{data.error}</p>
```

`bg-danger-50`, `border-danger-light`, `text-danger-dark`, `text-danger` — four non-ft-* tokens in one block.

**Fix:** Until `--ft-danger` is defined in app.css, use inline style or a temp class:
```svelte
<div class="rounded-xl border border-[color:#fca5a5] bg-[color:#fef2f2] p-6 text-center">
  <h3 style="color: #dc2626;" class="mb-2 text-lg font-semibold">Wystąpił błąd</h3>
  <p style="color: #ef4444;">{data.error}</p>
```

**Better long-term fix:** Add to `app.css`:
```css
--ft-danger: #dc2626;
--ft-danger-light: rgba(220, 38, 38, 0.08);
```

---

### O-12 · Wishlist page: CTA button on empty state

**File:** `src/routes/wishlist/+page.svelte` · line 25

```svelte
<Button href="/products" class="mt-6">Przeglądaj Produkty</Button>
```

Empty states should use understated text links, not `<Button>` CTAs.

**Fix:**
```svelte
<a href="/products" class="mt-6 inline-block text-sm text-[--ft-accent] hover:text-[--ft-accent-hover] underline-offset-2 hover:underline">
  Przeglądaj produkty
</a>
```

---

## 🟡 YELLOW — Minor

### Y-01 · SectionHeader: Uses `text-[--ft-text]` for section `<h2>` — should be `text-[--ft-text-strong]`

**File:** `src/lib/components/checkout/SectionHeader.svelte` · line ~15

```svelte
<h2 class="text-2xl font-bold text-[--ft-text]">{title}</h2>
```

`--ft-text` is `#2e3a46` (body text color). Section headings should use `--ft-text-strong` (`#014783`, navy) per the typography guidelines.

**Fix:** `text-[--ft-text-strong]`

---

### Y-02 · Search page: Pointless gradient `from-[--ft-frost] to-[--ft-frost]`

**File:** `src/routes/search/+page.svelte` · ~line 161

```svelte
<div class="from-[--ft-frost] to-[--ft-frost] rounded-2xl bg-linear-to-br p-12 text-center">
```

Both gradient stops are the same color. This is a plain frost background wearing gradient clothes.

**Fix:** `<div class="rounded-2xl bg-[--ft-frost] p-12 text-center">`

---

### Y-03 · Orders page: `alert()` calls used for deferred features

**File:** `src/routes/orders/[id]/+page.svelte` · lines ~80, ~86, ~92

```ts
function downloadInvoice() { alert('Funkcja pobierania faktury będzie dostępna wkrótce'); }
function trackShipment()   { alert('Śledzenie przesyłki będzie dostępne wkrótce'); }
function requestReturn()   { alert('Zgłaszanie zwrotu będzie dostępne wkrótce'); }
```

Native `alert()` is a jarring browser dialog, inconsistent with the Scandinavian minimal aesthetic.

**Fix:** Use a toast/notification pattern (even a simple Svelte `in:fly` toast), or disable the buttons with a `title="Wkrótce dostępne"` tooltip and `disabled` state.

---

### Y-04 · Orders page: `border-t` divider in totals — spacing would be cleaner

**File:** `src/routes/orders/[id]/+page.svelte` · ~line 197

```svelte
<div class="border-t pt-3">
  <div class="flex justify-between">
    <span class="text-lg font-semibold text-[--ft-text]">Razem:</span>
```

A generous `pt-6 mt-4` with larger font weight change creates visual separation without a border.

---

### Y-05 · Checkout success page: Redundant animated pulse on success icon background

**File:** `src/routes/checkout/success/+page.svelte` · ~line 71

```svelte
<div class="bg-success/10 absolute inset-0 scale-110 transform animate-pulse rounded-full"></div>
```

The `animate-pulse` (continuous animation) does not respect `prefers-reduced-motion`. The app.css already has a reduced-motion block, but `animate-pulse` uses Tailwind's built-in keyframe which may bypass it depending on the `@layer` order.

**Fix:** Wrap in a media query or use the pattern already in app.css:
```svelte
<div class="motion-safe:animate-pulse bg-success/10 absolute inset-0 scale-110 transform rounded-full"></div>
```

---

### Y-06 · Cart page: `text-danger` / `text-success` semantic tokens not in ft-* system

**File:** `src/routes/cart/+page.svelte` · lines 84 & 105

```svelte
<!-- line 84: Remove button -->
<button class="text-danger hover:text-danger text-sm">Remove</button>

<!-- line 105: Coupon success message -->
<p class="text-success mt-2 text-sm">Coupon applied!...</p>
```

Beyond the English text (covered in C-01), these use `text-danger` and `text-success` which are not `--ft-*` tokens.

**Fix (after Polish translation):**
```svelte
<button class="text-sm" style="color: var(--ft-danger, #dc2626);">Usuń</button>
<p class="mt-2 text-sm text-[--ft-accent]">Kod zastosowany! Rabat {discount * 100}%</p>
```

---

### Y-07 · Checkout page: `<Card>` import in empty state is a Card wrapping a centered div

**File:** `src/routes/checkout/+page.svelte` · ~line 156

```svelte
<Card class="mx-auto max-w-2xl p-16 text-center">
```

The empty cart state wraps all content in a large centered Card. A plain centered `<div>` with generous padding achieves the same without a bordered box.

---

### Y-08 · Deals page: Mock data uses Unsplash external image URLs

**File:** `src/routes/deals/+page.svelte` · lines 10–22

```ts
image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
```

Three Unsplash URLs in mock data. These are external dependencies that will break in production. Images should come from `src/lib/images/` (existing banners/products folder has suitable imagery).

**Fix:** Replace with local images from `src/lib/images/banners/` or `src/lib/images/products/` once real deal data is available.

---

## Summary Statistics

| Severity | Count | Files affected |
|---|---|---|
| 🔴 RED Critical | 9 | cart (5), checkout (2), deals (1), SelectableMethodCard (1) |
| 🟠 ORANGE Important | 12 | success (4), orders (3), checkout (2), OrderSummary (1), deals (1), search (1), wishlist (1) |
| 🟡 YELLOW Minor | 8 | success (2), orders (2), SectionHeader (1), search (1), cart (1), checkout (1), deals (1) |
| **Total** | **29** | |

---

## Priority Fix Order

1. **cart/+page.svelte** — Full rewrite: Polish translation, zł currency, remove Card wrappers, replace CTA buttons with text links, fix touch targets, fix tokens. (C-01, C-02, C-03, C-04, C-07, Y-06)

2. **SelectableMethodCard.svelte** — One-line fix: `transition: all` → explicit properties. (C-09)

3. **deals/+page.svelte** — Remove "Kup teraz" button, remove bordered newsletter box, fix discount badge token. (C-06, O-09, O-10)

4. **wishlist/+page.svelte** — Replace Button CTA with text link. (O-12)

5. **checkout/+page.svelte** — Remove Card wrappers from all 5 form sections, fix non-ft-* tokens. (C-05, C-08)

6. **OrderSummary.svelte** — Remove Card wrapper, fix transition:all, fix gradient tokens. (O-08)

7. **checkout/success/+page.svelte** — Token sweep: success/warning/danger/amber/accent-* → ft-* tokens, fix transition-all, fix checkmark color, fix invalid class. (O-01, O-02, O-03, O-04)

8. **orders/[id]/+page.svelte** — Token sweep in statusConfig, add width/height to image, reduce Card usage, replace alert() calls. (O-05, O-06, O-07, Y-03)

9. **search/+page.svelte** — Fix danger tokens in error state, fix pointless gradient. (O-11, Y-02)

10. **SectionHeader.svelte** — One-line fix: `text-[--ft-text]` → `text-[--ft-text-strong]`. (Y-01)

---

## Tokens Needed in `app.css`

To properly address danger/warning/success states across all pages, add to `src/app.css`:

```css
/* Semantic state tokens (add under color system) */
--ft-success:       #16a34a;
--ft-success-light: rgba(22, 163, 74, 0.08);
--ft-danger:        #dc2626;
--ft-danger-light:  rgba(220, 38, 38, 0.08);
--ft-warn:          #d97706;
--ft-warn-light:    rgba(217, 119, 6, 0.08);
```

This eliminates all `text-success`, `bg-danger`, `text-warning-dark` etc. references by replacing them with properly namespaced ft-* tokens.
