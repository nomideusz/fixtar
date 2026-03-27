import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const result = await client.execute(
    `SELECT category, category_slug, COUNT(*) as count
     FROM products
     WHERE category != ''
     GROUP BY category, category_slug
     ORDER BY count DESC`
  );

  console.log(JSON.stringify(result.rows, null, 2));
}

main().catch(console.error);
