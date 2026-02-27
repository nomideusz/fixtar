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

		// TODO: Implement with BaseLinker API
		async fetchProducts() {
			if (!browser) return;
			console.warn('[productsStore] fetchProducts: PocketBase removed, implement with BaseLinker API');
			return null;
		},

		async fetchProduct(_: string): Promise<Product | null> {
			void _;
			console.warn('[productsStore] fetchProduct: PocketBase removed, implement with BaseLinker API');
			return null;
		},

		async fetchFeaturedProducts() {
			console.warn('[productsStore] fetchFeaturedProducts: PocketBase removed, implement with BaseLinker API');
			return [];
		},

		async addProduct(_?: any) {
			void _;
			console.warn('[productsStore] addProduct: PocketBase removed, implement with BaseLinker API');
			return null;
		},

		async updateProduct(_id: string, _data: any) {
			void _id; void _data;
			console.warn('[productsStore] updateProduct: PocketBase removed, implement with BaseLinker API');
			return null;
		},

		async removeProduct(_id: string) {
			void _id;
			console.warn('[productsStore] removeProduct: PocketBase removed, implement with BaseLinker API');
			return false;
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
		get loading() { return loading; },

		// TODO: Implement with BaseLinker API
		async fetchCategories() {
			console.warn('[categoriesStore] fetchCategories: PocketBase removed, implement with BaseLinker API');
			return [];
		},

		async fetchFeaturedCategories() {
			console.warn('[categoriesStore] fetchFeaturedCategories: PocketBase removed, implement with BaseLinker API');
			return [];
		}
	};
}

export const productsStore = createProductsStore();
export const categoriesStore = createCategoriesStore();
