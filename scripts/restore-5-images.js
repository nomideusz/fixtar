import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
  // We overwrite the 5 Google AI images with the real BaseLinker filenames (which still exist in static/img/products/)
  const updates = [
    { id: 'bl-53762926', file: 'szlifierka-do-gladzi-kds2300-f7185b.jpg' },
    { id: 'bl-53762963', file: 'klucz-udarowy-akumulatorowy-eu2050-mls-20280.jpg' },
    { id: 'bl-53763021', file: 'wyrzynarka-bvjs1100.jpg' },
    { id: 'bl-53763066', file: 'pila-szablasta-eurcs-1700-j1f-gw3-20.jpg' },
    { id: 'bl-82332729', file: 'zestaw-narzedzi-187el-eu-187b.jpg' },
  ];
  
  for (const item of updates) {
      // The BaseLinker sync just saved them natively, let's just make sure DB points to them
      await db.execute({
          sql: `UPDATE products SET image = ? WHERE id = ?`,
          args: [item.file, item.id]
      });
      console.log(`Restored DB entry for ${item.id} -> ${item.file}`);
  }
}
run();
