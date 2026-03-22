import { browser } from '$app/environment';

// Product interface
export interface Product {
	id: string;
	name: string;
	slug: string;
	description?: string;
	shortDescription?: string;
	price: number;
	compareAtPrice?: number;
	cost?: number;
	sku: string;
	barcode?: string;
	categories?: string[];
	mainImage?: string;
	gallery?: string[];
	status: 'draft' | 'active' | 'archived';
	inventory?: {
		quantity: number;
		trackQuantity: boolean;
		allowBackorder: boolean;
		lowStockThreshold: number;
	};
	variants?: Array<{
		name: string;
		options: string[];
	}>;
	attributes?: Record<string, any>;
	weight?: number;
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
	featured?: boolean;
	shipping?: Record<string, any>;
	taxable?: boolean;
	taxClass?: string;
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
	metadata?: Record<string, any>;
	created?: string;
	updated?: string;
	expand?: {
		categories?: Array<{
			id: string;
			name: string;
			slug: string;
			description?: string;
		}>;
	};
}

// Category interface
export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
	parent?: string;
	image?: string;
	featured?: boolean;
	displayOrder?: number;
	seo?: Record<string, any>;
	metadata?: Record<string, any>;
}

/**
 * Client-side products store.
 * Products are loaded server-side via +page.server.ts loaders.
 * This store is only used for client-side state management (e.g. admin).
 */
function createProductsStore() {
	let products = $state<Product[]>([]);
	const loading = $state(false);
	let error = $state<string | null>(null);

	const featured = $derived(products.filter((p) => p.featured && p.status === 'active'));
	const inStock = $derived(
		products.filter((p) => {
			if (!p.inventory?.trackQuantity) return true;
			return p.inventory.quantity > 0;
		})
	);

	return {
		get items() { return products; },
		get loading() { return loading; },
		get error() { return error; },
		get featured() { return featured; },
		get inStock() { return inStock; },

		setProducts(items: Product[]) {
			products = items;
		},

		clear() {
			products = [];
			error = null;
		}
	};
}

function createCategoriesStore() {
	const categories = $state<Category[]>([]);
	const loading = $state(false);

	return {
		get items() { return categories; },
		get loading() { return loading; }
	};
}

export const productsStore = createProductsStore();
export const categoriesStore = createCategoriesStore();
