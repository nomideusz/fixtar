/**
 * Add is_featured column to products table.
 * Admin uses this to pin products to the homepage "Polecane" section.
 *
 * Usage: npx tsx scripts/add-featured-column.ts
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';

async function main() {
	const client = createClient({
		url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
		authToken: process.env.TURSO_AUTH_TOKEN
	});

	console.log('Adding is_featured column...');
	try {
		await client.execute(
			"ALTER TABLE products ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0"
		);
		console.log('  Column added');
	} catch (e: any) {
		if (e.message?.includes('duplicate column')) {
			console.log('  Column already exists — skipping');
		} else {
			throw e;
		}
	}

	const check = await client.execute(
		'SELECT COUNT(*) AS c, SUM(is_featured) AS featured FROM products'
	);
	const row = check.rows[0];
	console.log(`\nTotal products: ${row.c}. Featured: ${row.featured ?? 0}.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
