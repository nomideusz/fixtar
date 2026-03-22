import type { Product } from '$lib/stores/products.svelte';

interface StockInfo {
	inStock: boolean;
	label: string;
	colorClass: string;
}

export function getStockInfo(product: Product): StockInfo {
	if (!product.inventory?.trackQuantity) {
		return { inStock: true, label: 'Dostępny', colorClass: 'text-success' };
	}

	const qty = product.inventory.quantity;
	const lowThreshold = product.inventory.lowStockThreshold || 10;

	if (qty === 0) {
		return { inStock: false, label: 'Wyprzedany', colorClass: 'text-danger' };
	}

	if (qty <= lowThreshold) {
		return { inStock: true, label: `Mało sztuk (${qty})`, colorClass: 'text-warning' };
	}

	return { inStock: true, label: 'Dostępny', colorClass: 'text-success' };
}
