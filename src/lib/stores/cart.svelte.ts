import { PersistedState } from 'runed';
import { browser } from '$app/environment';

export interface CartItem {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
}

function createCart() {
	const persisted = new PersistedState<CartItem[]>('cart', [], {
		storage: 'local',
		syncTabs: true
	});

	const total = $derived(
		persisted.current.reduce((sum, item) => sum + item.price * item.quantity, 0)
	);

	const count = $derived(persisted.current.reduce((sum, item) => sum + item.quantity, 0));

	return {
		get items() {
			return persisted.current;
		},
		get total() {
			return total;
		},
		get count() {
			return count;
		},

		addItem(product: Omit<CartItem, 'quantity'>, qty = 1) {
			const items = [...persisted.current];
			const existing = items.find((i) => i.productId === product.productId);
			if (existing) {
				existing.quantity += qty;
			} else {
				items.push({ ...product, quantity: qty });
			}
			persisted.current = items;
		},

		removeItem(productId: string) {
			persisted.current = persisted.current.filter((i) => i.productId !== productId);
		},

		updateQuantity(productId: string, quantity: number) {
			if (quantity <= 0) {
				persisted.current = persisted.current.filter((i) => i.productId !== productId);
				return;
			}
			persisted.current = persisted.current.map((i) =>
				i.productId === productId ? { ...i, quantity } : i
			);
		},

		clear() {
			persisted.current = [];
		}
	};
}

export const cart = createCart();
