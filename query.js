import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
  const r = await client.execute("SELECT slug, name FROM products WHERE name LIKE '%Eurotec%' OR slug LIKE '%eurotec%' LIMIT 30;");
  console.log(r.rows);
}
run();
