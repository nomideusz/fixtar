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
  console.log("Fetching products with images...");
  const query = await db.execute("SELECT id, image FROM products WHERE image IS NOT NULL AND image != '';");
  
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of query.rows) {
    const file = row.image;
    const id = row.id;

    // Skip external URLs if any snuck in
    if (file.startsWith('http')) {
        console.log(`Skipping ${id}, external URL: ${file}`);
        skipped++;
        continue;
    }

    const inputPath = path.join(IMG_DIR, file);
    
    if (!fs.existsSync(inputPath)) {
        console.log(`Skipping ${file}, file not found.`);
        skipped++;
        continue;
    }

    // Force .webp extension
    const webpName = file.replace(/\.[^/.]+$/, "") + ".webp";
    const outputPath = path.join(IMG_DIR, "opt_" + webpName); // temporary name to avoid read/write conflicts if already webp

    try {
        await sharp(inputPath)
            .trim({ threshold: 15, background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
            
        // Rename opt_ back to target
        const finalPath = path.join(IMG_DIR, webpName);
        fs.renameSync(outputPath, finalPath);
        
        // If the original wasn't webp, maybe delete it (optional, let's keep it clean)
        if (file !== webpName && fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }

        // Update DB
        if (file !== webpName) {
            await db.execute({
                sql: `UPDATE products SET image = ? WHERE id = ?`,
                args: [webpName, id]
            });
        }
        processed++;
    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
        failed++;
    }
  }

  console.log(`\nOptimization Complete!`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

run();
