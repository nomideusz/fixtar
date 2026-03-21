// FixTar product search — simplified adapter for @nomideusz/svelte-search
//
// No geo, no resolver, no autocomplete complexity.
// Just: FTS5 + trigram fuzzy + Polish normalization.

import type { Client } from '@libsql/client';
import {
	createSearchEngine,
	createIndexer,
	normalize,
	trigrams,
	type SchemaAdapter,
	type SearchResult as BaseSearchResult,
	type SearchResponse,
	type DatabaseClient
} from '@nomideusz/svelte-search';
import { plLocale } from '@nomideusz/svelte-search/locales/pl';

// ── Product search result ──────────────────────────────────

export interface ProductSearchResult extends BaseSearchResult {
	description: string;
	price: number;
	originalPrice: number | null;
	image: string;
	category: string;
	categorySlug: string;
	tags: string[];
	inStock: boolean;
	sku: string;
}

// ── Schema adapter ─────────────────────────────────────────

const productAdapter: SchemaAdapter<ProductSearchResult> = {
	tables: {
		entities: 'products',
		trigrams: 'product_trigrams',
		fts: 'products_fts',
		synonyms: 'search_synonyms'
	},
	columns: {
		id: 'id',
		name: 'name',
		nameNormalized: 'name_n',
		slug: 'slug',
		lat: null,
		lng: null,
		locationSlug: 'category_slug',
		categoriesNormalized: 'tags_n',
		locationNormalized: 'category_n',
		areaNormalized: null
	},
	trigramColumns: {
		trigram: 'trigram',
		entityId: 'product_id',
		field: 'field'
	},
	toResult(row: Record<string, unknown>): ProductSearchResult {
		let tags: string[];
		try {
			tags = row.tags ? JSON.parse(row.tags as string) : [];
		} catch {
			tags = [];
		}
		return {
			id: row.id as string,
			name: row.name as string,
			slug: row.slug as string,
			description: (row.description as string) || '',
			price: (row.price as number) || 0,
			originalPrice: (row.original_price as number) || null,
			image: (row.image as string) || '',
			category: (row.category as string) || '',
			categorySlug: (row.category_slug as string) || '',
			tags,
			inStock: Boolean(row.in_stock),
			sku: (row.sku as string) || '',
			lat: null,
			lng: null,
			distanceKm: null,
			walkingMin: null,
			score: 0,
			_hasFts: (row._ftsRank as number | null) != null,
			_nameN: (row.name_n as string) || '',
			_locationN: (row.category_n as string) || '',
			_categoriesN: (row.tags_n as string) || ''
		};
	},
	trigramFields(entity: Record<string, unknown>) {
		const tags: string[] = (() => {
			try {
				return JSON.parse((entity.tags as string) || '[]');
			} catch {
				return [];
			}
		})();
		return [
			{ text: entity.name as string, field: 'name' },
			{ text: entity.category as string, field: 'category' },
			{ text: entity.description as string, field: 'description' },
			...tags.map((t) => ({ text: t, field: 'tag' }))
		];
	}
};

// ── Wrap libsql Client ─────────────────────────────────────

function wrapClient(client: Client): DatabaseClient {
	return {
		execute(query) {
			if (typeof query === 'string') {
				return client.execute(query) as Promise<any>;
			}
			return client.execute({ sql: query.sql, args: query.args as any }) as Promise<any>;
		}
	};
}

// ── Engine (cached) ────────────────────────────────────────

let _engine: ReturnType<typeof createSearchEngine<ProductSearchResult>> | null = null;
let _engineClient: Client | null = null;

function getEngine(client: Client) {
	if (_engine && _engineClient === client) return _engine;
	_engine = createSearchEngine<ProductSearchResult>({
		db: wrapClient(client),
		adapter: productAdapter,
		locale: plLocale,
		// No geo for e-commerce
		primaryRadiusKm: 99999,
		nearbyRadiusKm: 99999
	});
	_engineClient = client;
	return _engine;
}

// ── Public API ─────────────────────────────────────────────

export interface SearchParams {
	query: string;
	category?: string;
	limit?: number;
	offset?: number;
}

export async function searchProducts(
	db: Client,
	params: SearchParams
): Promise<SearchResponse<ProductSearchResult>> {
	return getEngine(db).search({
		query: params.query,
		locationSlug: params.category,
		limit: params.limit,
		offset: params.offset
	});
}

// ── Indexer ─────────────────────────────────────────────────

function getIndexer(client: Client) {
	return createIndexer<ProductSearchResult>({
		db: wrapClient(client),
		adapter: productAdapter,
		locale: plLocale
	});
}

/** Make a URL-safe slug from product name */
function makeSlug(name: string): string {
	return normalize(name, plLocale)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

/** Make a URL-safe slug from category name */
function makeCategorySlug(category: string): string {
	return normalize(category, plLocale)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export interface ProductInput {
	id: string;
	name: string;
	description?: string;
	price: number;
	originalPrice?: number;
	image?: string;
	category: string;
	tags?: string[];
	inStock?: boolean;
	sku?: string;
}

/** Insert or update a product and index it for search */
export async function upsertProduct(db: Client, input: ProductInput): Promise<void> {
	const slug = makeSlug(input.name);
	const categorySlug = makeCategorySlug(input.category);
	const tagsJson = JSON.stringify(input.tags ?? []);
	const tagsN = (input.tags ?? []).map((t) => normalize(t, plLocale)).join(' ');

	await db.execute({
		sql: `INSERT INTO products (id, name, name_n, slug, description, description_n, price, original_price, image, category, category_n, category_slug, tags, tags_n, in_stock, sku, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch() * 1000)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name, name_n=excluded.name_n, slug=excluded.slug,
            description=excluded.description, description_n=excluded.description_n,
            price=excluded.price, original_price=excluded.original_price,
            image=excluded.image, category=excluded.category, category_n=excluded.category_n,
            category_slug=excluded.category_slug, tags=excluded.tags, tags_n=excluded.tags_n,
            in_stock=excluded.in_stock, sku=excluded.sku, updated_at=excluded.updated_at`,
		args: [
			input.id,
			input.name,
			normalize(input.name, plLocale),
			slug,
			input.description ?? '',
			normalize(input.description ?? '', plLocale),
			input.price,
			input.originalPrice ?? null,
			input.image ?? '',
			input.category,
			normalize(input.category, plLocale),
			categorySlug,
			tagsJson,
			tagsN,
			input.inStock !== false ? 1 : 0,
			input.sku ?? ''
		]
	});

	// Index trigrams
	await getIndexer(db).indexTrigrams(input.id, {
		name: input.name,
		category: input.category,
		description: input.description ?? '',
		tags: tagsJson
	});
}

/** Rebuild all trigrams from scratch */
export async function reindexAll(db: Client): Promise<number> {
	return getIndexer(db).reindexAllTrigrams();
}

/** Rebuild FTS5 index */
export async function rebuildFts(db: Client): Promise<void> {
	return getIndexer(db).rebuildFts();
}

export { normalize, plLocale, productAdapter };
