import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
  const rTotal = await client.execute("SELECT COUNT(*) as count FROM products;");
  const rWithImage = await client.execute("SELECT COUNT(*) as count FROM products WHERE image IS NOT NULL AND image != '';");
  console.log("Total products:", rTotal.rows[0].count);
  console.log("Products with photos:", rWithImage.rows[0].count);
}
run();
