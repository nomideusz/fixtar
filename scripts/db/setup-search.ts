/**
 * Setup search tables in Turso.
 * Run: pnpm tsx scripts/db/setup-search.ts
 *
 * Products are synced from BaseLinker — no mock seeding needed.
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

	// Split on semicolons, handling trigger bodies (BEGIN...END;)
	const raw = schemaSQL.replace(/\r\n/g, '\n');
	const statements: string[] = [];
	let current = '';
	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		if (trimmed.startsWith('--') && !current.trim()) continue;
		current += line + '\n';
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
			if (!err.message?.includes('already exists')) {
				console.error(`Failed: ${sql.slice(0, 80)}...`);
				throw err;
			}
		}
	}

	console.log('✓ Search tables created');
	console.log('');
	console.log('Next: sync products from BaseLinker via the admin UI or API.');

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
