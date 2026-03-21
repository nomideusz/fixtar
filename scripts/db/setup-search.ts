/**
 * Setup search tables and seed with mock products.
 * Run: pnpm tsx scripts/db/setup-search.ts
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

async function main() {
	console.log('Creating search tables...');

	const schemaSQL = readFileSync(
		resolve(import.meta.dirname, '../../src/lib/server/search/schema.sql'),
		'utf-8'
	);

	// Split on semicolons that are NOT inside trigger bodies (END;)
	// Simple approach: split on ;\n and handle triggers specially
	const raw = schemaSQL.replace(/\r\n/g, '\n');
	const statements: string[] = [];
	let current = '';
	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		if (trimmed.startsWith('--') && !current.trim()) continue;
		current += line + '\n';
		// Statement ends at a line ending with ; that's not inside a trigger
		if (trimmed.endsWith(';') && (trimmed === 'END;' || !current.includes('BEGIN') || trimmed === 'END;')) {
			const stmt = current.trim().replace(/;$/, '').trim();
			if (stmt) statements.push(stmt);
			current = '';
		}
	}
	if (current.trim()) {
		const stmt = current.trim().replace(/;$/, '').trim();
		if (stmt) statements.push(stmt);
	}

	for (const sql of statements) {
		try {
			await client.execute(sql);
		} catch (err: any) {
			// Ignore "already exists" errors
			if (!err.message?.includes('already exists')) {
				console.error(`Failed: ${sql.slice(0, 80)}...`);
				throw err;
			}
		}
	}

	console.log('✓ Search tables created');

	// Seed mock products
	const { mockProducts, mockCategories } = await import('../../src/lib/data/mockData.js');
	// We need the search module — but it uses $env which isn't available in scripts.
	// So we inline the normalize + upsert logic here.

	const normalize = (text: string): string => {
		if (!text) return '';
		const plMap: Record<string, string> = {
			ą: 'a', Ą: 'A', ć: 'c', Ć: 'C', ę: 'e', Ę: 'E',
			ł: 'l', Ł: 'L', ń: 'n', Ń: 'N', ó: 'o', Ó: 'O',
			ś: 's', Ś: 'S', ź: 'z', Ź: 'Z', ż: 'z', Ż: 'Z',
		};
		let r = '';
		for (const c of text) r += plMap[c] ?? c;
		return r.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
	};

	const makeSlug = (name: string) =>
		normalize(name).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

	const trigrams = (text: string): string[] => {
		const n = normalize(text);
		if (n.length < 3) return n ? [n] : [];
		const result: string[] = [];
		for (const word of n.split(/\s+/)) {
			if (word.length < 3) { result.push(word); continue; }
			for (let i = 0; i <= word.length - 3; i++) result.push(word.slice(i, i + 3));
		}
		return [...new Set(result)];
	};

	// Find category name by id
	const catMap = new Map(mockCategories.map((c: any) => [c.id, c.name]));

	console.log(`Seeding ${mockProducts.length} products...`);

	for (const p of mockProducts) {
		const categoryName = catMap.get(p.category) || p.category;
		const slug = makeSlug(p.name);
		const categorySlug = makeSlug(categoryName);
		const tagsJson = JSON.stringify(p.tags ?? []);
		const tagsN = (p.tags ?? []).map((t: string) => normalize(t)).join(' ');

		await client.execute({
			sql: `INSERT INTO products (id, name, name_n, slug, description, description_n, price, original_price, image, category, category_n, category_slug, tags, tags_n, in_stock, sku)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, '')
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name, name_n=excluded.name_n, slug=excluded.slug,
              description=excluded.description, description_n=excluded.description_n,
              price=excluded.price, image=excluded.image, category=excluded.category,
              category_n=excluded.category_n, category_slug=excluded.category_slug,
              tags=excluded.tags, tags_n=excluded.tags_n`,
			args: [
				p.id, p.name, normalize(p.name), slug,
				p.description ?? '', normalize(p.description ?? ''),
				p.price, p.originalPrice ?? null, p.image ?? '',
				categoryName, normalize(categoryName), categorySlug,
				tagsJson, tagsN,
			]
		});

		// Index trigrams
		await client.execute({ sql: 'DELETE FROM product_trigrams WHERE product_id = ?', args: [p.id] });
		const entries: { trigram: string; field: string }[] = [];
		const addTrigrams = (text: string | undefined, field: string) => {
			if (!text) return;
			for (const t of trigrams(text)) entries.push({ trigram: t, field });
		};
		addTrigrams(p.name, 'name');
		addTrigrams(categoryName, 'category');
		addTrigrams(p.description, 'description');
		(p.tags ?? []).forEach((t: string) => addTrigrams(t, 'tag'));

		const BATCH = 100;
		for (let i = 0; i < entries.length; i += BATCH) {
			const chunk = entries.slice(i, i + BATCH);
			const ph = chunk.map(() => '(?,?,?)').join(',');
			const args = chunk.flatMap((e) => [e.trigram, p.id, e.field]);
			await client.execute({
				sql: `INSERT OR IGNORE INTO product_trigrams (trigram, product_id, field) VALUES ${ph}`,
				args
			});
		}
	}

	console.log(`✓ Seeded ${mockProducts.length} products with trigram indexes`);

	// Verify
	const count = await client.execute('SELECT COUNT(*) as c FROM products');
	const ftsCount = await client.execute('SELECT COUNT(*) as c FROM products_fts');
	const triCount = await client.execute('SELECT COUNT(*) as c FROM product_trigrams');
	console.log(`  Products: ${(count.rows[0] as any).c}`);
	console.log(`  FTS entries: ${(ftsCount.rows[0] as any).c}`);
	console.log(`  Trigrams: ${(triCount.rows[0] as any).c}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
