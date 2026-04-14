import { createClient } from "@libsql/client";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const IMG_DIR = path.resolve(process.cwd(), "static/img/products");

async function run() {
  const targets = [
    { id: 'bl-53762926', file: 'szlifierka-do-gladzi-kds2300-f7185b.jpg' },
    { id: 'bl-53762963', file: 'klucz-udarowy-akumulatorowy-eu2050-mls-20280.jpg' },
    { id: 'bl-53763021', file: 'wyrzynarka-bvjs1100.jpg' },
    { id: 'bl-53763066', file: 'pila-szablasta-eurcs-1700-j1f-gw3-20.jpg' },
    { id: 'bl-82332729', file: 'zestaw-narzedzi-187el-eu-187b.jpg' },
  ];

  for (const item of targets) {
    const inputPath = path.join(IMG_DIR, item.file);
    const webpName = item.file.replace(/\.jpg$/, '.webp').replace(/\.png$/, '.webp');
    const outputPath = path.join(IMG_DIR, webpName);

    if (!fs.existsSync(inputPath)) {
        console.log(`Skipping ${item.file}, not found.`);
        continue;
    }

    console.log(`Processing ${item.file}...`);
    try {
        await sharp(inputPath)
            // 1. Trim excess white space to maximize product footprint
            .trim({ threshold: 15, background: { r: 255, g: 255, b: 255, alpha: 1 } })
            // 2. Pad back to a perfect square with pure white background
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            // 3. Compress to fast WebP
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
        
        // 4. Update the DB to use the new optimized .webp image
        await db.execute({
            sql: `UPDATE products SET image = ? WHERE id = ?`,
            args: [webpName, item.id]
        });
        console.log(`Saved ${webpName} and updated DB.`);
    } catch (e) {
        console.error(`Error processing ${item.file}:`, e);
    }
  }
}
run();
