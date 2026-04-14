import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
  const targetIds = [
    'bl-53762926', // SZLIFIERKA DO GŁADZI
    'bl-53762963', // KLUCZ UDAROWY
    'bl-53763021', // WYRZYNARKA
    'bl-53763066', // PIŁA SZABLASTA
    'bl-82332729'  // ZESTAW NARZĘDZI
  ];

  for (const id of targetIds) {
    const res = await db.execute({
      sql: `SELECT image FROM products WHERE id = ?`,
      args: [id]
    });
    
    if (res.rows.length > 0) {
       const img = res.rows[0].image;
       if (img && img.startsWith('/img/products/')) {
           const fixed = img.replace('/img/products/', '');
           await db.execute({
               sql: `UPDATE products SET image = ? WHERE id = ?`,
               args: [fixed, id]
           });
           console.log(`Fixed ${id}: ${img} -> ${fixed}`);
       }
    }
  }
}
run();
