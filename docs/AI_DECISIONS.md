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
