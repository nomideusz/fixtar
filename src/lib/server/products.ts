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
}): Promise<{ products: DBProduct[]; total: number }> {
	const db = getClient();
	const { search, category, sort = 'name', page = 1, perPage = 20 } = opts;

	let where = 'WHERE 1=1';
	const args: (string | number)[] = [];

	if (search) {
		where += ' AND (name_n LIKE ? OR description_n LIKE ? OR category_n LIKE ?)';
		const q = `%${search.toLowerCase()}%`;
		args.push(q, q, q);
	}

	if (category) {
		where += ' AND category_slug = ?';
		args.push(category);
	}

	let orderBy = 'ORDER BY name ASC';
	if (sort === 'price-asc') orderBy = 'ORDER BY price ASC';
	else if (sort === 'price-desc') orderBy = 'ORDER BY price DESC';
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
	const result = await db.execute({
		sql: `SELECT id, name, slug, description, price, original_price, image, category, category_slug, tags, in_stock, sku, ean, weight
		      FROM products WHERE category_slug = ? AND id != ? LIMIT ?`,
		args: [categorySlug, excludeId, limit]
	});
	return result.rows as unknown as DBProduct[];
}

export async function getCategories(): Promise<DBCategory[]> {
	const db = getClient();
	const result = await db.execute(
		`SELECT category, category_slug, COUNT(*) as count
		 FROM products
		 WHERE category != ''
		 GROUP BY category, category_slug
		 ORDER BY count DESC`
	);
	return result.rows as unknown as DBCategory[];
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

	return {
		id: p.id,
		name: p.name,
		slug: p.slug,
		description: p.description || '',
		price: p.price,
		compareAtPrice: p.original_price ?? undefined,
		sku: p.sku || '',
		barcode: p.ean || '',
		categories: [p.category_slug],
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
				? [{ id: p.category_slug, name: p.category, slug: p.category_slug }]
				: []
		}
	};
}
