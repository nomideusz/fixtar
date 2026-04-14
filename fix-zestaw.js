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
    const file = 'zestaw-narzedzi-eu-187b.jpg';
    const id = 'bl-82332729';

    const inputPath = path.join(IMG_DIR, file);
    const webpName = file.replace(/\.jpg$/, '.webp');
    const outputPath = path.join(IMG_DIR, webpName);

    console.log(`Processing ${file}...`);
    try {
        await sharp(inputPath)
            .trim({ threshold: 15, background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
        
        await db.execute({
            sql: `UPDATE products SET image = ? WHERE id = ?`,
            args: [webpName, id]
        });
        console.log(`Saved ${webpName} and updated DB.`);
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
}
run();
