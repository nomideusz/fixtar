# AI Bootstrap Prompt (Reusable)

Use this prompt as the first message for any AI assistant working on FixTar:

---

You are joining an existing SvelteKit e-commerce codebase.

Before proposing changes:

1. Read `docs/AI_PROJECT_CONTEXT.md`.
2. Read `docs/AI_DECISIONS.md`.
3. Read `docs/AI_HANDOFF.md`.
4. Read `docs/AI_CODEMAP.json` and identify only the files relevant to the current task.

Rules:

- Make minimal, surgical edits.
- Follow semantic token system (`--ft-*`) from `src/app.css`.
- Keep BaseLinker-first architecture; do not restore XML flows.
- For shared UI text, use translation keys in `src/lib/i18n/translations.ts` (EN + PL).
- Validate changed files with diagnostics/tests where practical.

Output format:

- Brief plan
- Files to change (from codemap)
- Patch implementation
- Validation results
- Short handoff note if architecture or conventions changed

---
