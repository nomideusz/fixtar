/**
 * Add gallery column to products table and populate from image-sync-report.json
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import fs from 'fs/promises';

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // 1. Add gallery column if not exists
  console.log('Adding gallery column...');
  try {
    await client.execute('ALTER TABLE products ADD COLUMN gallery TEXT DEFAULT \'[]\'');
    console.log('  ✅ Column added');
  } catch (e: any) {
    if (e.message?.includes('duplicate column')) {
      console.log('  ⏭️  Column already exists');
    } else {
      throw e;
    }
  }

  // 2. Load report
  const report = JSON.parse(await fs.readFile('scripts/image-sync-report.json', 'utf-8'));

  // 3. Update gallery for each product
  let updated = 0;
  for (const p of report.products) {
    if (p.totalImages <= 1) continue;

    // Gallery = all images except the first (primary)
    const galleryImages = p.gallery.slice(1);
    if (galleryImages.length === 0) continue;

    await client.execute({
      sql: 'UPDATE products SET gallery = ? WHERE id = ?',
      args: [JSON.stringify(galleryImages), p.dbId],
    });
    updated++;
  }

  console.log(`\n✅ Updated gallery for ${updated} products`);

  // Verify
  const check = await client.execute(
    'SELECT id, name, gallery FROM products WHERE gallery != \'[]\' AND gallery IS NOT NULL LIMIT 3'
  );
  for (const row of check.rows) {
    const g = JSON.parse(String(row.gallery));
    console.log(`  ${row.name}: ${g.length} gallery images`);
  }
}

main().catch(console.error);
