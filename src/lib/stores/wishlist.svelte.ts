import { browser } from '$app/environment';

const STORAGE_KEY = 'fixtar-wishlist';

function loadFromStorage(): Set<string> {
	if (!browser) return new Set();
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (data) return new Set(JSON.parse(data));
	} catch { /* */ }
	return new Set();
}

function saveToStorage(ids: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
	} catch { /* */ }
}

function createWishlistStore() {
	let items = $state<Set<string>>(loadFromStorage());

	return {
		get items() { return items; },
		get count() { return items.size; },

		has(productId: string): boolean {
			return items.has(productId);
		},

		toggle(productId: string): boolean {
			if (items.has(productId)) {
				items.delete(productId);
				// Trigger reactivity by reassigning
				items = new Set(items);
				saveToStorage(items);
				return false;
			} else {
				items.add(productId);
				items = new Set(items);
				saveToStorage(items);
				return true;
			}
		},

		add(productId: string): void {
			if (!items.has(productId)) {
				items.add(productId);
				items = new Set(items);
				saveToStorage(items);
			}
		},

		remove(productId: string): void {
			if (items.has(productId)) {
				items.delete(productId);
				items = new Set(items);
				saveToStorage(items);
			}
		},

		clear(): void {
			items = new Set();
			saveToStorage(items);
		}
	};
}

export const wishlist = createWishlistStore();
