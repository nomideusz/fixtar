/**
 * BaseLinker API Integration Service for FixTar
 *
 * BaseLinker REST API docs: https://api.baselinker.com/
 *
 * This service handles:
 * - Product sync (BaseLinker → FixTar store)
 * - Order push (FixTar store → BaseLinker)
 * - Inventory sync
 * - Order status updates
 */

import { env } from '$env/dynamic/private';

// ============================================================================
// Types
// ============================================================================

export interface BaseLinkerConfig {
	apiToken: string;
	baseUrl: string;
}

export interface BaseLinkerProduct {
	product_id: number;
	ean: string;
	sku: string;
	name: string;
	quantity: number;
	price_brutto: number;
	price_netto: number;
	tax_rate: number;
	weight: number;
	description: string;
	description_extra1: string;
	description_extra2: string;
	man_name: string; // manufacturer
	category_id: number;
	images: Record<string, string>;
	features: Record<string, string>;
	variants: BaseLinkerVariant[];
	/** Inventory-specific fields returned by getInventoryProductsData */
	text_fields?: Record<string, string>;
	tags?: string[];
	stock?: Record<string, number>;
	prices?: Record<string, number>;
}

export interface BaseLinkerVariant {
	variant_id: number;
	name: string;
	quantity: number;
	price: number;
	ean: string;
	sku: string;
}

export interface BaseLinkerOrder {
	order_id: number;
	shop_order_id: number;
	external_order_id: string;
	order_source: string;
	order_source_id: number;
	order_source_info: string;
	order_status_id: number;
	date_add: number;
	date_confirmed: number;
	date_in_status: number;
	user_login: string;
	phone: string;
	email: string;
	user_comments: string;
	admin_comments: string;
	currency: string;
	payment_method: string;
	payment_method_cod: string;
	payment_done: number;
	delivery_method: string;
	delivery_price: number;
	delivery_fullname: string;
	delivery_company: string;
	delivery_address: string;
	delivery_city: string;
	delivery_postcode: string;
	delivery_country_code: string;
	delivery_point_id: string;
	delivery_point_name: string;
	invoice_fullname: string;
	invoice_company: string;
	invoice_nip: string;
	invoice_address: string;
	invoice_city: string;
	invoice_postcode: string;
	invoice_country_code: string;
	products: BaseLinkerOrderProduct[];
}

export interface BaseLinkerOrderProduct {
	storage: string;
	storage_id: number;
	order_product_id: number;
	product_id: string;
	variant_id: string;
	name: string;
	attributes: string;
	sku: string;
	ean: string;
	auction_id: string;
	price_brutto: number;
	tax_rate: number;
	quantity: number;
	weight: number;
}

export interface BaseLinkerInventory {
	inventory_id: number;
	name: string;
	description: string;
	languages: string[];
	default_language: string;
	price_groups: number[];
	default_price_group: number;
	warehouses: string[];
	default_warehouse: string;
	reservations: boolean;
}

export interface SyncResult {
	success: boolean;
	productsAdded: number;
	productsUpdated: number;
	productsSkipped: number;
	errors: string[];
	timestamp: string;
}

export interface OrderPushResult {
	success: boolean;
	baselinkerOrderId?: number;
	error?: string;
}

// ============================================================================
// BaseLinker API Client
// ============================================================================

export class BaseLinkerService {
	private config: BaseLinkerConfig;

	constructor(config?: Partial<BaseLinkerConfig>) {
		this.config = {
			apiToken: config?.apiToken || env.BASELINKER_API_TOKEN || '',
			baseUrl: config?.baseUrl || 'https://api.baselinker.com/connector.php'
		};
	}

	/**
	 * Make a request to the BaseLinker API
	 */
	private async request<T>(method: string, parameters: Record<string, any> = {}): Promise<T> {
		if (!this.config.apiToken) {
			throw new Error('BaseLinker API token is not configured. Set BASELINKER_API_TOKEN in .env');
		}

		const body = new URLSearchParams({
			token: this.config.apiToken,
			method,
			parameters: JSON.stringify(parameters)
		});

		const response = await fetch(this.config.baseUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'FixTar-Store/1.0'
			},
			body: body.toString()
		});

		if (!response.ok) {
			throw new Error(`BaseLinker API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (data.status === 'ERROR') {
			throw new Error(`BaseLinker error: ${data.error_code} - ${data.error_message}`);
		}

		return data as T;
	}

	// ==========================================================================
	// Product Catalog Methods
	// ==========================================================================

	/**
	 * Get list of inventories (product catalogs)
	 */
	async getInventories(): Promise<BaseLinkerInventory[]> {
		const result = await this.request<{ inventories: BaseLinkerInventory[] }>('getInventories');
		return result.inventories;
	}

	/**
	 * Get products from a specific inventory
	 */
	async getInventoryProductsList(
		inventoryId: number,
		page = 1
	): Promise<{
		products: Record<string, BaseLinkerProduct>;
	}> {
		return this.request('getInventoryProductsList', {
			inventory_id: inventoryId,
			page
		});
	}

	/**
	 * Get full product data including descriptions, images, features
	 */
	async getInventoryProductsData(
		inventoryId: number,
		productIds: number[]
	): Promise<{
		products: Record<string, BaseLinkerProduct>;
	}> {
		return this.request('getInventoryProductsData', {
			inventory_id: inventoryId,
			products: productIds
		});
	}

	/**
	 * Get categories for an inventory
	 */
	async getInventoryCategories(
		inventoryId: number
	): Promise<Array<{ category_id: number; name: string; parent_id: number }>> {
		const result = await this.request<{
			categories: Array<{ category_id: number; name: string; parent_id: number }>;
		}>('getInventoryCategories', { inventory_id: inventoryId });
		return result.categories;
	}

	/**
	 * Get product stock levels from all warehouses
	 */
	async getInventoryProductsStock(inventoryId: number): Promise<{
		products: Record<string, Record<string, number>>;
	}> {
		return this.request('getInventoryProductsStock', {
			inventory_id: inventoryId
		});
	}

	/**
	 * Get product prices from all price groups
	 */
	async getInventoryProductsPrices(
		inventoryId: number,
		page = 1
	): Promise<{
		products: Record<string, Record<string, number>>;
	}> {
		return this.request('getInventoryProductsPrices', {
			inventory_id: inventoryId,
			page
		});
	}

	// ==========================================================================
	// Order Methods (READ-ONLY during development)
	//
	// BaseLinker is connected to live Allegro. All write methods are disabled
	// to prevent accidental modifications to live orders/products.
	// Enable writes only when FixTar checkout is production-ready.
	// ==========================================================================

	/**
	 * Get orders from BaseLinker (read-only)
	 */
	async getOrders(
		params: {
			order_id?: number;
			date_confirmed_from?: number;
			date_from?: number;
			id_from?: number;
			get_unconfirmed_orders?: boolean;
			include_custom_extra_fields?: boolean;
			status_id?: number;
			filter_email?: string;
			filter_order_source?: string;
			filter_order_source_id?: number;
		} = {}
	): Promise<{ orders: BaseLinkerOrder[] }> {
		return this.request('getOrders', params);
	}

	/**
	 * Get order status list (read-only)
	 */
	async getOrderStatusList(): Promise<{
		statuses: Record<string, { id: number; name: string; name_for_customer: string }>;
	}> {
		return this.request('getOrderStatusList');
	}

	// ── WRITE METHODS — DISABLED IN DEVELOPMENT ────────────────────────────
	// Uncomment when FixTar checkout is production-ready.
	//
	// async addOrder(orderData: { ... }): Promise<{ order_id: number }> { ... }
	// async setOrderStatus(orderId: number, statusId: number): Promise<void> { ... }
	// async setOrderFields(orderId: number, fields: { ... }): Promise<void> { ... }

	// ==========================================================================
	// Sync Logic: BaseLinker → Turso
	// ==========================================================================

	/**
	 * Sync all products from BaseLinker inventory to Turso DB.
	 * Fetches categories, products, and stock levels, then upserts into products table.
	 */
	async syncProducts(
		db: import('@libsql/client').Client,
		inventoryId: number,
		options: {
			dryRun?: boolean;
			forceUpdate?: boolean;
		} = {}
	): Promise<SyncResult> {
		const result: SyncResult = {
			success: false,
			productsAdded: 0,
			productsUpdated: 0,
			productsSkipped: 0,
			errors: [],
			timestamp: new Date().toISOString()
		};

		try {
			console.log(`[BaseLinker Sync] Starting product sync for inventory ${inventoryId}...`);

			// 1. Fetch categories
			const catData = await this.getInventoryCategories(inventoryId);
			const catMap = new Map<number, string>();
			for (const c of catData) {
				catMap.set(c.category_id, c.name.trim());
			}

			// 2. Fetch product list (paginated)
			let page = 1;
			let allProductIds: number[] = [];

			while (true) {
				const productList = await this.getInventoryProductsList(inventoryId, page);
				const ids = Object.keys(productList.products).map(Number);
				if (ids.length === 0) break;
				allProductIds = [...allProductIds, ...ids];
				page++;
			}

			console.log(`[BaseLinker Sync] Found ${allProductIds.length} products to sync`);

			if (options.dryRun) {
				result.success = true;
				result.productsSkipped = allProductIds.length;
				return result;
			}

			// 3. Get existing product IDs to detect adds vs updates
			const existingRows = await db.execute('SELECT id FROM products');
			const existingIds = new Set(existingRows.rows.map((r) => r.id as string));

			// 4. Fetch full product data in batches of 50
			const batchSize = 50;
			for (let i = 0; i < allProductIds.length; i += batchSize) {
				const batch = allProductIds.slice(i, i + batchSize);
				const productData = await this.getInventoryProductsData(inventoryId, batch);

				for (const [productId, product] of Object.entries(productData.products)) {
					try {
						const id = `bl-${productId}`;
						const name = product.text_fields?.name || product.sku || 'Unknown';
						const descHtml = product.text_fields?.description || '';
						const descPlain = this.stripHtml(descHtml);
						const category = catMap.get(product.category_id) || '';
						const price =
							product.prices?.[Object.keys(product.prices)[0] as any] || 0;
						const totalStock = Object.values(product.stock || {}).reduce<number>(
							(s, q) => s + (q as number),
							0
						);
						const firstImage = Object.values(product.images || {})[0] || '';
						const tags = (product.tags || []).filter(
							(t: string) => !t.startsWith('Не ') && !t.startsWith('Нема')
						);

						await db.execute({
							sql: `INSERT INTO products (id, name, name_n, slug, description, description_n, price, image, category, category_n, category_slug, tags, tags_n, in_stock, sku, ean, weight, updated_at)
								VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch() * 1000)
								ON CONFLICT(id) DO UPDATE SET
									name=excluded.name, name_n=excluded.name_n, slug=excluded.slug,
									description=excluded.description, description_n=excluded.description_n,
									price=excluded.price, image=excluded.image, category=excluded.category,
									category_n=excluded.category_n, category_slug=excluded.category_slug,
									tags=excluded.tags, tags_n=excluded.tags_n, in_stock=excluded.in_stock,
									sku=excluded.sku, ean=excluded.ean, weight=excluded.weight,
									updated_at=excluded.updated_at`,
							args: [
								id,
								name,
								this.normalize(name),
								this.slugify(name),
								descPlain,
								this.normalize(descPlain),
								price,
								firstImage,
								category,
								this.normalize(category),
								this.slugify(category),
								JSON.stringify(tags),
								tags.map((t: string) => this.normalize(t)).join(' '),
								totalStock > 0 ? 1 : 0,
								(product.sku || '').trim(),
								(product.ean || '').trim(),
								product.weight || 0
							]
						});

						if (existingIds.has(id)) {
							result.productsUpdated++;
						} else {
							result.productsAdded++;
						}
					} catch (err: any) {
						result.errors.push(`Product ${productId}: ${err.message}`);
					}
				}
			}

			result.success = true;
			console.log(
				`[BaseLinker Sync] Completed: +${result.productsAdded} added, ~${result.productsUpdated} updated, ${result.errors.length} errors`
			);
		} catch (err: any) {
			result.errors.push(`Sync failed: ${err.message}`);
			console.error('[BaseLinker Sync] Fatal error:', err);
		}

		return result;
	}

	/**
	 * Push a FixTar order to BaseLinker.
	 * DISABLED during development — BaseLinker is connected to live Allegro.
	 * Returns a mock success response for testing checkout flow locally.
	 */
	async pushOrder(_order: {
		orderNumber: string;
		email: string;
		phone?: string;
		deliveryAddress: { fullName: string; street: string; city: string; postalCode: string; country?: string };
		items: Array<{ name: string; sku?: string; price: number; quantity: number }>;
		[key: string]: unknown;
	}): Promise<OrderPushResult> {
		console.warn(
			`[BaseLinker] pushOrder DISABLED in dev — would push order ${_order.orderNumber} with ${_order.items.length} items`
		);
		return {
			success: true,
			baselinkerOrderId: -1 // mock ID, no real order created
		};
	}

	// ==========================================================================
	// Private Helpers
	// ==========================================================================

	private static readonly PL_MAP: Record<string, string> = {
		ą: 'a', Ą: 'A', ć: 'c', Ć: 'C', ę: 'e', Ę: 'E',
		ł: 'l', Ł: 'L', ń: 'n', Ń: 'N', ó: 'o', Ó: 'O',
		ś: 's', Ś: 'S', ź: 'z', Ź: 'Z', ż: 'z', Ż: 'Z'
	};

	private normalize(text: string): string {
		if (!text) return '';
		let r = '';
		for (const c of text) r += BaseLinkerService.PL_MAP[c] ?? c;
		return r
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	}

	private slugify(text: string): string {
		return this.normalize(text)
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
			.substring(0, 200);
	}

	private stripHtml(html: string): string {
		return (html || '')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	}
}

// ============================================================================
// Singleton instance
// ============================================================================

let _instance: BaseLinkerService | null = null;

export function getBaseLinkerService(): BaseLinkerService {
	if (!_instance) {
		_instance = new BaseLinkerService();
	}
	return _instance;
}
