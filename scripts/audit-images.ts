import 'dotenv/config';
import { createClient } from '@libsql/client';

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const r = await client.execute(
    'SELECT id, name, image, category, category_slug, sku FROM products ORDER BY category, name'
  );

  const withImg: any[] = [];
  const withoutImg: any[] = [];

  for (const row of r.rows) {
    const hasImg = row.image && String(row.image).trim() !== '';
    if (hasImg) {
      withImg.push(row);
    } else {
      withoutImg.push(row);
    }
    const mark = hasImg ? '✅' : '❌';
    console.log(`${mark} ${row.category} | ${row.name} | img: ${row.image || '(none)'}`);
  }

  console.log(`\n── Summary ──`);
  console.log(`Total: ${r.rows.length} products`);
  console.log(`With images: ${withImg.length}`);
  console.log(`Missing images: ${withoutImg.length}`);

  if (withoutImg.length > 0) {
    console.log(`\n── Products Missing Images ──`);
    for (const row of withoutImg) {
      console.log(`  - [${row.category}] ${row.name} (${row.id})`);
    }
  }
}

main().catch(console.error);
