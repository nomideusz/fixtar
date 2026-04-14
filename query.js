import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
  const r = await client.execute("SELECT id, name, price, in_stock FROM products WHERE in_stock > 0 LIMIT 15;");
  console.log(JSON.stringify(r.rows, null, 2));
}
run();
