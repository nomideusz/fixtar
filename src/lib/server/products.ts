/**
 * Product queries against Turso (products table).
 * Replaces mock data with real BaseLinker-synced products.
 */
import { createClient, type Client } from '@libsql/client';
import { env } from '$env/dynamic/private';

let _client: Client | null = null;

function getClient(): Client {
	if (!_client) {
		_client = createClient({
			url: env.TURSO_DATABASE_URL || 'file:./dev.db',
			authToken: env.TURSO_AUTH_TOKEN || undefined
		});
	}
	return _client;
}

export { getClient };

// ── Category Mappings ──────────────────────────────────────

const NATIVE_TO_APP_CATEGORIES: Record<string, { slug: string, name: string }> = {
	'wiertarki-i-wkretarki': { slug: 'wiertarki-i-wkretarki', name: 'Wiertarki i wkrętarki' },
	'mlotowiertarki-i-mloty': { slug: 'mlotowiertarki-i-mloty', name: 'Młoty i młotowiertarki' },
	'szlifierki-i-polerki': { slug: 'szlifierki-i-polerki', name: 'Szlifierki i polerki' },
	'pily-i-pilarki': { slug: 'pily-i-pilarki', name: 'Piły i pilarki' },
	'narzedzia-pneumatyczne': { slug: 'pneumatyczne-i-budowlane', name: 'Narzędzia pneumatyczne i budowlane' },
	'mieszadla-i-budowlane': { slug: 'pneumatyczne-i-budowlane', name: 'Narzędzia pneumatyczne i budowlane' },
	'dom-i-ogrod': { slug: 'ogrod-i-akcesoria', name: 'Ogród i akcesoria' },
	'zestawy-i-akcesoria': { slug: 'ogrod-i-akcesoria', name: 'Ogród i akcesoria' }
};

const APP_TO_NATIVE_CATEGORIES: Record<string, string[]> = {
	'wiertarki-i-wkretarki': ['wiertarki-i-wkretarki'],
	'mlotowiertarki-i-mloty': ['mlotowiertarki-i-mloty'],
	'szlifierki-i-polerki': ['szlifierki-i-polerki'],
	'pily-i-pilarki': ['pily-i-pilarki'],
	'pneumatyczne-i-budowlane': ['narzedzia-pneumatyczne', 'mieszadla-i-budowlane'],
	'ogrod-i-akcesoria': ['dom-i-ogrod', 'zestawy-i-akcesoria']
};

// ── Types ──────────────────────────────────────────────────

export interface DBProduct {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	original_price: number | null;
	image: string;
	category: string;
	category_slug: string;
	tags: string;
	in_stock: number;
	sku: string;
	ean: string;
	weight: number;
}

export interface DBCategory {
	category: string;
	category_slug: string;
	count: number;
}

// ── Queries ────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 8): Promise<DBProduct[]> {
	const db = getClient();
	// Prefer products with images and prices, ordered by price desc (showcase best items)
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products
		      WHERE price > 0
		      ORDER BY (CASE WHEN image != '' AND image IS NOT NULL THEN 0 ELSE 1 END), in_stock DESC, price DESC
		      LIMIT ?`,
		args: [limit]
	});
	return result.rows as unknown as DBProduct[];
}

export async function getAllProducts(opts: {
	search?: string;
	category?: string;
	sort?: string;
	page?: number;
	perPage?: number;
	minPrice?: number;
	maxPrice?: number;
	inStockOnly?: boolean;
}): Promise<{ products: DBProduct[]; total: number }> {
	const db = getClient();
	const { search, category, sort = 'name', page = 1, perPage = 20, minPrice, maxPrice, inStockOnly } = opts;

	let where = 'WHERE 1=1';
	const args: (string | number)[] = [];

	if (search) {
		where += ' AND products.id IN (SELECT rowid FROM products_fts WHERE products_fts MATCH ?)';
		args.push(search);
	}

	if (category) {
		const nativeSlugs = APP_TO_NATIVE_CATEGORIES[category] || [category];
		const placeholders = nativeSlugs.map(() => '?').join(',');
		where += ` AND category_slug IN (${placeholders})`;
		args.push(...nativeSlugs);
	}

	if (minPrice !== undefined) {
		where += ' AND price >= ?';
		args.push(minPrice);
	}

	if (maxPrice !== undefined) {
		where += ' AND price <= ?';
		args.push(maxPrice);
	}

	if (inStockOnly) {
		where += ' AND in_stock > 0';
	}

	let orderBy = 'ORDER BY name ASC';
	if (sort === 'name' || sort === 'name-asc') orderBy = 'ORDER BY name ASC';
	else if (sort === 'name-desc') orderBy = 'ORDER BY name DESC';
	else if (sort === 'price-asc' || sort === 'price-low') orderBy = 'ORDER BY price ASC';
	else if (sort === 'price-desc' || sort === 'price-high') orderBy = 'ORDER BY price DESC';
	else if (sort === 'newest') orderBy = 'ORDER BY updated_at DESC';

	const countResult = await db.execute({
		sql: `SELECT COUNT(*) as c FROM products ${where}`,
		args
	});
	const total = Number(countResult.rows[0].c);

	const offset = (page - 1) * perPage;
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products ${where} ${orderBy} LIMIT ? OFFSET ?`,
		args: [...args, perPage, offset]
	});

	return { products: result.rows as unknown as DBProduct[], total };
}

export async function getProductBySlug(slug: string): Promise<DBProduct | null> {
	const db = getClient();
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products WHERE slug = ? LIMIT 1`,
		args: [slug]
	});
	if (result.rows.length === 0) return null;
	return result.rows[0] as unknown as DBProduct;
}

export async function getProductById(id: string): Promise<DBProduct | null> {
	const db = getClient();
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products WHERE id = ? LIMIT 1`,
		args: [id]
	});
	if (result.rows.length === 0) return null;
	return result.rows[0] as unknown as DBProduct;
}

export async function getRelatedProducts(categorySlug: string, excludeId: string, limit = 4): Promise<DBProduct[]> {
	const db = getClient();
	const nativeSlugs = APP_TO_NATIVE_CATEGORIES[categorySlug] || [categorySlug];
	const placeholders = nativeSlugs.map(() => '?').join(',');
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products WHERE category_slug IN (${placeholders}) AND id != ? LIMIT ?`,
		args: [...nativeSlugs, excludeId, limit]
	});
	return result.rows as unknown as DBProduct[];
}

export async function getCategories(): Promise<DBCategory[]> {
	const db = getClient();
	const result = await db.execute(
		`SELECT category, category_slug, COUNT(*) as count
		 FROM products
		 WHERE category != ''
		 GROUP BY category, category_slug`
	);

	const map = new Map<string, DBCategory>();

	for (const row of result.rows as any) {
		const mapping = NATIVE_TO_APP_CATEGORIES[row.category_slug];
		const slug = mapping ? mapping.slug : row.category_slug;
		const name = mapping ? mapping.name : row.category;

		const existing = map.get(slug);
		if (existing) {
			existing.count += Number(row.count);
		} else {
			map.set(slug, { category: name, category_slug: slug, count: Number(row.count) });
		}
	}

	return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export async function getTotalProducts(): Promise<number> {
	const db = getClient();
	const result = await db.execute('SELECT COUNT(*) as c FROM products');
	return Number(result.rows[0].c);
}

// ── Helpers to convert DB row → store Product shape ────────

import type { Product } from '$lib/stores/products.svelte';

export function toStoreProduct(p: DBProduct): Product {
	let tags: string[] = [];
	try { tags = JSON.parse(p.tags || '[]'); } catch { /* */ }

	const mapping = NATIVE_TO_APP_CATEGORIES[p.category_slug];
	const uiCategoryName = mapping ? mapping.name : p.category;
	const uiCategorySlug = mapping ? mapping.slug : p.category_slug;

	return {
		id: p.id,
		name: p.name,
		slug: p.slug,
		description: p.description || '',
		price: p.price,
		compareAtPrice: p.original_price ?? undefined,
		sku: p.sku || '',
		barcode: p.ean || '',
		categories: [uiCategorySlug],
		mainImage: p.image || undefined,
		gallery: [],
		status: 'active',
		inventory: {
			quantity: p.in_stock ? 10 : 0,
			trackQuantity: true,
			allowBackorder: false,
			lowStockThreshold: 2
		},
		weight: p.weight || undefined,
		attributes: { tags },
		featured: false,
		expand: {
			categories: p.category
				? [{ id: uiCategorySlug, name: uiCategoryName, slug: uiCategorySlug }]
				: []
		}
	};
}
