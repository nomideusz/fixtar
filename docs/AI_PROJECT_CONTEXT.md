# AI Project Context (FixTar)

## Product Summary
- FixTar is a SvelteKit e-commerce application.
- Current integration direction is BaseLinker-first (legacy XML flows removed from active use).
- Design direction is token-driven, minimal, and rebranding-ready.

## Tech Stack
- SvelteKit 2 + Svelte 5 Runes (`$state`, `$derived`, `$effect`, `$props`)
- Tailwind CSS v4
- PocketBase-backed data access
- TypeScript across app and scripts

## Core Architecture
- App shell: `src/routes/+layout.svelte`
- Main navigation: `src/lib/components/layout/Navbar.svelte`
- Active cart panel: `src/lib/components/layout/CartDrawer.svelte`
- Cart state: `src/lib/stores/cart.svelte.ts`
- Language state: `src/lib/stores/language.svelte.ts`
- Translations map: `src/lib/i18n/translations.ts`
- Product detail route: `src/routes/products/[slug]/+page.server.ts`

## Design System Rules
- Use semantic tokens from `src/app.css` (`--ft-*` family).
- Avoid adding raw hex values when equivalent token exists.
- Prefer shared UI primitives (`Button`, `Card`, etc.) over ad-hoc variants.
- Keep UX changes minimal and consistent with current layout/components.

## Internationalization Rules
- For new UI labels, always add keys in `src/lib/i18n/translations.ts` (EN + PL).
- Do not leave hardcoded English/Polish strings in shared layout components.
- Layout-level translator should resolve via `languageStore.current` and fallback to `translations.en`.

## Integration Rules
- Prefer BaseLinker flows and endpoints.
- Do not reintroduce XML/Qoltec routes or docs as active flows.

## Working Agreements for AI Agents
- Make surgical edits; avoid unrelated refactors.
- Validate changed files with diagnostics or targeted checks.
- Update this context and `AI_HANDOFF.md` when architectural choices change.
