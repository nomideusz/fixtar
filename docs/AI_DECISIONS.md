# AI Decisions Log (ADR-lite)

## ADR-001: BaseLinker as canonical integration

- Date: 2026-02-26
- Status: Accepted
- Decision: Keep BaseLinker as primary integration path.
- Why: Existing implementation already in place; reduces maintenance surface.
- Rejected alternative: Restore/maintain XML-based order/catalog flow.
- Impact: New integration work should target BaseLinker code paths and docs only.

## ADR-002: Design-system-first component updates

- Date: 2026-02-26
- Status: Accepted
- Decision: Align shared UI/layout components to semantic tokens (`--ft-*`).
- Why: Rebranding readiness, visual consistency, lower styling drift.
- Rejected alternative: Per-component ad-hoc style overrides.
- Impact: New UI work should reference token primitives before introducing new classes.

## ADR-003: CartDrawer as active drawer implementation

- Date: 2026-02-26
- Status: Accepted
- Decision: Use `CartDrawer` as runtime cart UI.
- Why: Better state handling and extensibility than simplified temporary variant.
- Rejected alternative: Keep/restore `SimpleCartDrawer`.
- Impact: All cart-drawer UX improvements go to `src/lib/components/layout/CartDrawer.svelte`.

## ADR-004: Layout-level i18n passthrough fixed to real translations

- Date: 2026-02-26
- Status: Accepted
- Decision: Resolve layout translator from `languageStore` + `translations` map.
- Why: Key passthrough caused untranslated UI in shared layout components.
- Impact: Shared components receiving `t` now display active-language labels.

## ADR-005: Dual font system — Chakra Petch + Barlow

- Date: 2026-02-26
- Status: Accepted
- Decision: Replace single Rajdhani font with Chakra Petch (headings) + Barlow (body).
- Why: Rajdhani is Devanagari-first, poor body readability. Chakra Petch has angular, machine-cut terminals fitting industrial tools. Barlow is a readable geometric sans with industrial DNA.
- Rejected alternative: Keep Rajdhani everywhere; use Inter for body (too generic).
- Impact: `--font-heading` = Chakra Petch, `--font-sans` = Barlow. Max heading weight is 700 (no font-black).

## ADR-006: Dark industrial navbar

- Date: 2026-02-26
- Status: Accepted
- Decision: Navbar uses solid dark background (#0c1117) with teal accent line, white logo.
- Why: Dark nav provides authority for a tools store, matches hero seamlessly, anchors navigation on light pages.
- Rejected alternative: Translucent/glass navbar (felt too SaaS/startup).
- Impact: Navbar imports `logo-FixTar-white.webp`; dropdowns and mobile menu use dark theme.

## ADR-007: Typography tokens in design system

- Date: 2026-02-26
- Status: Accepted
- Decision: Add type scale, line-height, and letter-spacing tokens to `:root` in `app.css`.
- Why: Typography had no defined scale — sizes scattered inconsistently across components.
- Impact: `--ft-text-*`, `--ft-leading-*`, `--ft-tracking-*` tokens available for use. Existing Tailwind utilities still work alongside.
