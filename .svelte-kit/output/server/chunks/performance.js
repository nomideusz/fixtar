class SimpleCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  set(key, data, ttlMs = 5 * 60 * 1e3) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  delete(key) {
    this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
const serverCache = new SimpleCache();
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    serverCache.cleanup();
  }, 10 * 60 * 1e3);
}
const pendingRequests = /* @__PURE__ */ new Map();
async function dedupedFetch(key, fetchFn) {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  const promise = fetchFn().finally(() => {
    pendingRequests.delete(key);
  });
  pendingRequests.set(key, promise);
  return promise;
}
async function parallelLimit(items, processor, concurrency = 5) {
  const results = [];
  const executing = [];
  for (let i = 0; i < items.length; i++) {
    const promise = processor(items[i]).then((result) => {
      results[i] = result;
    });
    executing.push(promise);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      for (let j = executing.length - 1; j >= 0; j--) {
        if (executing[j].isFulfilled || executing[j].isRejected) {
          executing.splice(j, 1);
        }
      }
    }
  }
  await Promise.all(executing);
  return results;
}
export {
  dedupedFetch as d,
  parallelLimit as p,
  serverCache as s
};
