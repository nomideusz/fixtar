import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const IMG_DIR = path.resolve(process.cwd(), "static/img/products");

async function generateGoogleImage(productName, slug) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in .env");

  console.log(`Generating image for: ${productName}...`);
  
  const prompt = `Professional e-commerce product photo of a power tool: ${productName}. Isolated on a pure white background. Studio lighting, sharp focus, technical industrial aesthetic. Direct front-facing view. Highly detailed, photorealistic. No text, no watermarks, minimalist.`;

  // Imagen 4 endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [
        { prompt: prompt }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        outputOptions: {
          mimeType: "image/jpeg"
        }
      }
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  const base64Data = data.predictions[0].bytesBase64Encoded;
  const buffer = Buffer.from(base64Data, "base64");
  
  const filename = `${slug}.jpg`;
  const outputPath = path.join(IMG_DIR, filename);
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Saved: ${outputPath}`);
  return filename;
}

async function run() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const targetIds = [
    'bl-53762926', // SZLIFIERKA DO GŁADZI
    'bl-53762963', // KLUCZ UDAROWY
    'bl-53763021', // WYRZYNARKA
    'bl-53763066', // PIŁA SZABLASTA
    'bl-82332729'  // ZESTAW NARZĘDZI
  ];
  
  const placeholders = targetIds.map(() => '?').join(',');
  const query = await db.execute({
    sql: `SELECT id, name, slug FROM products WHERE id IN (${placeholders})`,
    args: targetIds
  });

  for (const product of query.rows) {
    try {
        const imagePath = await generateGoogleImage(product.name, product.slug);
        
        await db.execute({
            sql: `UPDATE products SET image = ? WHERE id = ?`,
            args: [imagePath, product.id]
        });
        console.log(`Updated DB for ${product.name} ✅\n`);
        
    } catch (err) {
        console.error(`Failed to generate for ${product.name}:`, err.message);
    }
  }
}

run();
