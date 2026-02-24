import { pb } from '$lib/pocketbase';
import { browser } from '$app/environment';

// Product interface matching the PocketBase schema
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
	let loading = $state(false);
	let error = $state<string | null>(null);

	const featured = $derived(
		products.filter((p) => p.featured && p.status === 'active')
	);

	const inStock = $derived(
		products.filter((p) => {
			if (!p.inventory?.trackQuantity) return true;
			return p.inventory.quantity > 0;
		})
	);

	return {
		get items() {
			return products;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get featured() {
			return featured;
		},
		get inStock() {
			return inStock;
		},

		async fetchProducts(filters?: {
			category?: string;
			status?: string;
			featured?: boolean;
			search?: string;
			limit?: number;
			page?: number;
		}) {
			if (!browser || !pb) return;

			loading = true;
			error = null;

			try {
				const filterParts: string[] = [];

				if (filters?.category) {
					filterParts.push(`categories ~ "${filters.category}"`);
				}
				if (filters?.status) {
					filterParts.push(`status = "${filters.status}"`);
				} else {
					filterParts.push(`status = "active"`);
				}
				if (filters?.featured !== undefined) {
					filterParts.push(`featured = ${filters.featured}`);
				}
				if (filters?.search) {
					filterParts.push(
						`(name ~ "${filters.search}" || shortDescription ~ "${filters.search}")`
					);
				}

				const filter = filterParts.join(' && ');

				const result = await pb.collection('products').getList(
					filters?.page || 1,
					filters?.limit || 50,
					{
						filter,
						sort: '-created',
						expand: 'categories',
					}
				);

				products = result.items as unknown as Product[];
				return result;
			} catch (err) {
				console.error('Failed to fetch products:', err);
				error = 'Failed to load products';
				return null;
			} finally {
				loading = false;
			}
		},

		async fetchProduct(idOrSlug: string): Promise<Product | null> {
			if (!browser || !pb) return null;

			loading = true;
			error = null;

			try {
				let product;
				if (idOrSlug.length === 15) {
					product = await pb.collection('products').getOne(idOrSlug, {
						expand: 'categories',
					});
				} else {
					product = await pb
						.collection('products')
						.getFirstListItem(`slug="${idOrSlug}"`, {
							expand: 'categories',
						});
				}

				return product as unknown as Product;
			} catch (err) {
				console.error('Failed to fetch product:', err);
				error = 'Product not found';
				return null;
			} finally {
				loading = false;
			}
		},

		async fetchFeaturedProducts(limit = 8) {
			if (!browser || !pb) return [];

			loading = true;
			error = null;

			try {
				const result = await pb.collection('products').getList(1, limit, {
					filter: 'status = "active" && featured = true',
					sort: '-created',
					expand: 'categories',
				});

				return result.items as unknown as Product[];
			} catch (err) {
				console.error('Failed to fetch featured products:', err);
				error = 'Failed to load featured products';
				return [];
			} finally {
				loading = false;
			}
		},

		async addProduct(productData: Omit<Product, 'id' | 'created' | 'updated'>) {
			if (!browser || !pb) return null;

			loading = true;
			error = null;

			try {
				const product = await pb.collection('products').create(productData);
				products = [...products, product as unknown as Product];
				return product as unknown as Product;
			} catch (err) {
				console.error('Failed to add product:', err);
				error = 'Failed to add product';
				return null;
			} finally {
				loading = false;
			}
		},

		async updateProduct(id: string, updates: Partial<Product>) {
			if (!browser || !pb) return null;

			loading = true;
			error = null;

			try {
				const product = await pb.collection('products').update(id, updates);
				products = products.map((p) =>
					p.id === id ? { ...p, ...product } : p
				);
				return product as unknown as Product;
			} catch (err) {
				console.error('Failed to update product:', err);
				error = 'Failed to update product';
				return null;
			} finally {
				loading = false;
			}
		},

		async removeProduct(id: string) {
			if (!browser || !pb) return false;

			loading = true;
			error = null;

			try {
				await pb.collection('products').delete(id);
				products = products.filter((p) => p.id !== id);
				return true;
			} catch (err) {
				console.error('Failed to remove product:', err);
				error = 'Failed to remove product';
				return false;
			} finally {
				loading = false;
			}
		},

		clear() {
			products = [];
			error = null;
		},
	};
}

function createCategoriesStore() {
	let categories = $state<Category[]>([]);
	let loading = $state(false);

	return {
		get items() {
			return categories;
		},
		get loading() {
			return loading;
		},

		async fetchCategories() {
			if (!browser || !pb) return [];

			loading = true;

			try {
				const result = await pb.collection('categories').getFullList({
					sort: 'displayOrder,name',
				});

				categories = result as unknown as Category[];
				return categories;
			} catch (err) {
				console.error('Failed to fetch categories:', err);
				return [];
			} finally {
				loading = false;
			}
		},

		async fetchFeaturedCategories() {
			if (!browser || !pb) return [];

			loading = true;

			try {
				const result = await pb.collection('categories').getList(1, 10, {
					filter: 'featured = true',
					sort: 'displayOrder,name',
				});

				return result.items as unknown as Category[];
			} catch (err) {
				console.error('Failed to fetch featured categories:', err);
				return [];
			} finally {
				loading = false;
			}
		},
	};
}

export const productsStore = createProductsStore();
export const categoriesStore = createCategoriesStore();
