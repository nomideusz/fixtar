# FixTar — Elektronarzędzia Online

E-commerce store for power tools (elektronarzędzia). Built with SvelteKit 2 + Svelte 5, Turso (libSQL), and BaseLinker integration.

## Tech Stack

- **Frontend:** SvelteKit 2, Svelte 5 (runes), Tailwind CSS v4
- **Database:** Turso (libSQL/SQLite edge DB)
- **Search:** FTS5 + trigram fuzzy via `@nomideusz/svelte-search`
- **Product Source:** BaseLinker API (read-only sync from inventory "Elektronarzędzia")
- **Auth:** Better Auth (email/password, OAuth) → Turso
- **Fonts:** Chakra Petch (headings) + Barlow (body)

## Architecture

```
BaseLinker (source of truth) ──read-only sync──▶ Turso (products, FTS5, trigrams)
                                                      │
Allegro ◀──managed by BaseLinker                      ▼
                                               SvelteKit app ──▶ User
```

- **Products:** Synced from BaseLinker inventory 9392 → Turso `products` table
- **Search:** FTS5 full-text + trigram fuzzy matching with Polish locale support
- **Categories:** 8 merged categories (Szlifierki i polerki, Wiertarki i wkrętarki, Piły i pilarki, etc.)
- **Orders:** Write methods disabled during development (live Allegro connection)

## Setup

```bash
pnpm install
```

### Environment Variables

Create `.env`:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
BASELINKER_API_TOKEN=your-baselinker-token
BETTER_AUTH_SECRET=your-auth-secret
```

### Database

Search tables (products, FTS5, trigrams, synonyms):

```bash
pnpm tsx scripts/db/setup-search.ts
```

Auth tables are managed by Better Auth + Drizzle (`src/lib/server/schema.ts`).

### Sync Products from BaseLinker

Products sync via `POST /api/baselinker/sync` with `{ inventoryId: 9392 }`.

## Development

```bash
pnpm dev
```

## Key Directories

```
src/
├── lib/
│   ├── components/     # UI components (home/, layout/, ui/)
│   ├── server/
│   │   ├── products.ts # Turso product queries
│   │   ├── search/     # svelte-search adapter (FTS5 + trigram)
│   │   ├── db.ts       # Drizzle + libsql client
│   │   └── schema.ts   # Auth tables (Drizzle)
│   ├── services/
│   │   └── baselinker.ts  # BaseLinker API (read-only)
│   ├── stores/         # Svelte 5 rune stores (cart, user, products)
│   └── i18n/           # Translations (EN + PL)
├── routes/
│   ├── +page           # Homepage (hero, categories, featured)
│   ├── products/       # Product listing + detail (with category filtering)
│   ├── search/         # Full-text search
│   ├── admin/          # Admin dashboard + product management
│   ├── api/            # API endpoints (search, sync, orders)
│   └── cart/           # Shopping cart
packages/
└── svelte-search/      # @nomideusz/svelte-search (FTS5 + trigram engine)
```

## Design System

- Semantic tokens: `--ft-*` family in `src/app.css`
- Dark industrial theme with teal accent (`--color-brand-500: #378a92`)
- Typography: Chakra Petch headings (max weight 700), Barlow body
- Component primitives: `Button`, `Card`, `Input`, `Hero`, `ProductCard`
