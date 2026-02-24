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
  async getInventoryProductsList(inventoryId: number, page = 1): Promise<{
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
  async getInventoryProductsData(inventoryId: number, productIds: number[]): Promise<{
    products: Record<string, BaseLinkerProduct>;
  }> {
    return this.request('getInventoryProductsData', {
      inventory_id: inventoryId,
      products: productIds
    });
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
  async getInventoryProductsPrices(inventoryId: number, page = 1): Promise<{
    products: Record<string, Record<string, number>>;
  }> {
    return this.request('getInventoryProductsPrices', {
      inventory_id: inventoryId,
      page
    });
  }

  // ==========================================================================
  // Order Methods
  // ==========================================================================

  /**
   * Push a new order to BaseLinker
   */
  async addOrder(orderData: {
    order_status_id: number;
    date_add?: number;
    user_comments?: string;
    admin_comments?: string;
    phone?: string;
    email?: string;
    user_login?: string;
    currency?: string;
    payment_method?: string;
    payment_method_cod?: string;
    paid?: boolean;
    delivery_method?: string;
    delivery_price?: number;
    delivery_fullname: string;
    delivery_company?: string;
    delivery_address: string;
    delivery_city: string;
    delivery_postcode: string;
    delivery_country_code?: string;
    delivery_point_id?: string;
    delivery_point_name?: string;
    invoice_fullname?: string;
    invoice_company?: string;
    invoice_nip?: string;
    invoice_address?: string;
    invoice_city?: string;
    invoice_postcode?: string;
    invoice_country_code?: string;
    products: Array<{
      storage: string;
      storage_id: number;
      product_id: string;
      variant_id?: string;
      name: string;
      sku?: string;
      ean?: string;
      attributes?: string;
      price_brutto: number;
      tax_rate?: number;
      quantity: number;
      weight?: number;
    }>;
    custom_extra_fields?: Record<string, string>;
  }): Promise<{ order_id: number }> {
    return this.request('addOrder', orderData);
  }

  /**
   * Get orders from BaseLinker
   */
  async getOrders(params: {
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
  } = {}): Promise<{ orders: BaseLinkerOrder[] }> {
    return this.request('getOrders', params);
  }

  /**
   * Update order status in BaseLinker
   */
  async setOrderStatus(orderId: number, statusId: number): Promise<void> {
    await this.request('setOrderStatus', {
      order_id: orderId,
      status_id: statusId
    });
  }

  /**
   * Get order status list
   */
  async getOrderStatusList(): Promise<{ statuses: Record<string, { id: number; name: string; name_for_customer: string }> }> {
    return this.request('getOrderStatusList');
  }

  /**
   * Set order tracking number
   */
  async setOrderFields(orderId: number, fields: {
    admin_comments?: string;
    user_comments?: string;
    payment_method?: string;
    payment_method_cod?: string;
    delivery_method?: string;
    delivery_price?: number;
    delivery_fullname?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_postcode?: string;
    delivery_country_code?: string;
    want_invoice?: boolean;
    extra_field_1?: string;
    extra_field_2?: string;
    pick_state?: number;
    pack_state?: number;
  }): Promise<void> {
    await this.request('setOrderFields', {
      order_id: orderId,
      ...fields
    });
  }

  // ==========================================================================
  // Sync Logic: BaseLinker → PocketBase
  // ==========================================================================

  /**
   * Sync all products from BaseLinker inventory to PocketBase
   * This is the main sync method to be called from cron or admin UI
   */
  async syncProducts(pb: any, inventoryId: number, options: {
    dryRun?: boolean;
    forceUpdate?: boolean;
  } = {}): Promise<SyncResult> {
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

      // 1. Fetch product list
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

      // 2. Fetch full product data in batches of 100
      const batchSize = 100;
      for (let i = 0; i < allProductIds.length; i += batchSize) {
        const batch = allProductIds.slice(i, i + batchSize);
        const productData = await this.getInventoryProductsData(inventoryId, batch);

        for (const [productId, product] of Object.entries(productData.products)) {
          try {
            await this.upsertProduct(pb, product, Number(productId));
            
            // Check if product exists in PB
            const existing = await this.findProductBySku(pb, product.sku || `BL-${productId}`);
            if (existing) {
              result.productsUpdated++;
            } else {
              result.productsAdded++;
            }
          } catch (err: any) {
            result.errors.push(`Product ${productId}: ${err.message}`);
          }
        }
      }

      // 3. Sync stock levels
      const stockData = await this.getInventoryProductsStock(inventoryId);
      for (const [productId, warehouses] of Object.entries(stockData.products)) {
        const totalStock = Object.values(warehouses).reduce((sum, qty) => sum + qty, 0);
        try {
          await this.updateProductStock(pb, `BL-${productId}`, totalStock);
        } catch (err: any) {
          result.errors.push(`Stock update ${productId}: ${err.message}`);
        }
      }

      result.success = true;
      console.log(`[BaseLinker Sync] Completed: +${result.productsAdded} added, ~${result.productsUpdated} updated, ${result.errors.length} errors`);

    } catch (err: any) {
      result.errors.push(`Sync failed: ${err.message}`);
      console.error('[BaseLinker Sync] Fatal error:', err);
    }

    return result;
  }

  /**
   * Push a FixTar order to BaseLinker
   */
  async pushOrder(order: {
    orderNumber: string;
    email: string;
    phone?: string;
    deliveryAddress: {
      fullName: string;
      company?: string;
      street: string;
      city: string;
      postalCode: string;
      country?: string;
    };
    invoiceAddress?: {
      fullName: string;
      company?: string;
      nip?: string;
      street: string;
      city: string;
      postalCode: string;
      country?: string;
    };
    items: Array<{
      name: string;
      sku?: string;
      ean?: string;
      price: number;
      quantity: number;
      taxRate?: number;
      weight?: number;
    }>;
    paymentMethod?: string;
    deliveryMethod?: string;
    deliveryPrice?: number;
    currency?: string;
    comments?: string;
    statusId?: number;
  }): Promise<OrderPushResult> {
    try {
      const result = await this.addOrder({
        order_status_id: order.statusId || 0,
        email: order.email,
        phone: order.phone,
        user_comments: order.comments,
        admin_comments: `FixTar order: ${order.orderNumber}`,
        currency: order.currency || 'PLN',
        payment_method: order.paymentMethod || 'Przelew',
        delivery_method: order.deliveryMethod || 'Kurier',
        delivery_price: order.deliveryPrice || 0,
        delivery_fullname: order.deliveryAddress.fullName,
        delivery_company: order.deliveryAddress.company,
        delivery_address: order.deliveryAddress.street,
        delivery_city: order.deliveryAddress.city,
        delivery_postcode: order.deliveryAddress.postalCode,
        delivery_country_code: order.deliveryAddress.country || 'PL',
        invoice_fullname: order.invoiceAddress?.fullName,
        invoice_company: order.invoiceAddress?.company,
        invoice_nip: order.invoiceAddress?.nip,
        invoice_address: order.invoiceAddress?.street,
        invoice_city: order.invoiceAddress?.city,
        invoice_postcode: order.invoiceAddress?.postalCode,
        invoice_country_code: order.invoiceAddress?.country || 'PL',
        products: order.items.map(item => ({
          storage: 'db',
          storage_id: 0,
          product_id: item.sku || '',
          name: item.name,
          sku: item.sku || '',
          ean: item.ean || '',
          price_brutto: item.price,
          tax_rate: item.taxRate || 23,
          quantity: item.quantity,
          weight: item.weight || 0
        }))
      });

      return {
        success: true,
        baselinkerOrderId: result.order_id
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  // ==========================================================================
  // Private Helpers
  // ==========================================================================

  private async findProductBySku(pb: any, sku: string) {
    try {
      const result = await pb.collection('products').getList(1, 1, {
        filter: `sku = "${sku}"`
      });
      return result.items[0] || null;
    } catch {
      return null;
    }
  }

  private async upsertProduct(pb: any, product: BaseLinkerProduct, baselinkerProductId: number) {
    const sku = product.sku || `BL-${baselinkerProductId}`;
    const slug = this.slugify(product.name);
    
    const productData = {
      name: product.name,
      slug,
      sku,
      ean: product.ean || '',
      description: product.description || '',
      price: product.price_brutto || 0,
      cost: product.price_netto || 0,
      weight: product.weight || 0,
      status: 'active',
      inventory: JSON.stringify({
        quantity: product.quantity || 0,
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }),
      attributes: JSON.stringify({
        brand: product.man_name || '',
        ...product.features
      }),
      metadata: JSON.stringify({
        baselinkerProductId,
        lastSyncedAt: new Date().toISOString()
      })
    };

    const existing = await this.findProductBySku(pb, sku);
    
    if (existing) {
      await pb.collection('products').update(existing.id, productData);
    } else {
      await pb.collection('products').create(productData);
    }
  }

  private async updateProductStock(pb: any, sku: string, quantity: number) {
    const existing = await this.findProductBySku(pb, sku);
    if (existing) {
      const inventory = JSON.parse(existing.inventory || '{}');
      inventory.quantity = quantity;
      await pb.collection('products').update(existing.id, {
        inventory: JSON.stringify(inventory)
      });
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[ąáàâã]/g, 'a')
      .replace(/[ćç]/g, 'c')
      .replace(/[ęéèêë]/g, 'e')
      .replace(/[ıíìîï]/g, 'i')
      .replace(/[łl]/g, 'l')
      .replace(/[ńñ]/g, 'n')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[śş]/g, 's')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[źżz]/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 200);
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
