interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number;
}

class SimpleCache {
	private cache = new Map<string, CacheEntry<any>>();

	get<T>(key: string): T | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp > entry.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl: ttlMs
		});
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	clear(): void {
		this.cache.clear();
	}

	// Clean up expired entries
	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > entry.ttl) {
				this.cache.delete(key);
			}
		}
	}
}

export const serverCache = new SimpleCache();

// Clean up cache every 10 minutes
if (typeof setInterval !== 'undefined') {
	setInterval(
		() => {
			serverCache.cleanup();
		},
		10 * 60 * 1000
	);
}
