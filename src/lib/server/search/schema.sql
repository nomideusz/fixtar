-- Product search tables for FixTar
-- Run via: tsx scripts/db/setup-search.ts

-- Products table (local cache of BaseLinker products)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_n TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  description_n TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  original_price REAL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  category_n TEXT NOT NULL DEFAULT '',
  category_slug TEXT NOT NULL DEFAULT '',
  tags TEXT DEFAULT '[]',
  tags_n TEXT NOT NULL DEFAULT '',
  in_stock INTEGER NOT NULL DEFAULT 1,
  sku TEXT DEFAULT '',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
  name_n,
  description_n,
  category_n,
  tags_n,
  content=products,
  content_rowid=rowid
);

-- Trigram index for fuzzy matching
CREATE TABLE IF NOT EXISTS product_trigrams (
  trigram TEXT NOT NULL,
  product_id TEXT NOT NULL,
  field TEXT NOT NULL,
  PRIMARY KEY (trigram, product_id, field)
);

CREATE INDEX IF NOT EXISTS idx_product_trigrams_trigram ON product_trigrams(trigram);

-- FTS5 triggers to keep index in sync
CREATE TRIGGER IF NOT EXISTS products_ai AFTER INSERT ON products BEGIN
  INSERT INTO products_fts(rowid, name_n, description_n, category_n, tags_n)
  VALUES (new.rowid, new.name_n, new.description_n, new.category_n, new.tags_n);
END;

CREATE TRIGGER IF NOT EXISTS products_ad AFTER DELETE ON products BEGIN
  INSERT INTO products_fts(products_fts, rowid, name_n, description_n, category_n, tags_n)
  VALUES ('delete', old.rowid, old.name_n, old.description_n, old.category_n, old.tags_n);
END;

CREATE TRIGGER IF NOT EXISTS products_au AFTER UPDATE ON products BEGIN
  INSERT INTO products_fts(products_fts, rowid, name_n, description_n, category_n, tags_n)
  VALUES ('delete', old.rowid, old.name_n, old.description_n, old.category_n, old.tags_n);
  INSERT INTO products_fts(rowid, name_n, description_n, category_n, tags_n)
  VALUES (new.rowid, new.name_n, new.description_n, new.category_n, new.tags_n);
END;

-- Search synonyms (optional, for future use)
CREATE TABLE IF NOT EXISTS search_synonyms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL,
  canonical TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'product'
);
