import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
client.execute("SELECT rowid, id, name FROM products WHERE rowid IN (SELECT rowid FROM products_fts WHERE products_fts MATCH '\"mies\"*')").then(console.log).catch(console.error);
