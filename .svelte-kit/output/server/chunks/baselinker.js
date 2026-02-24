import { p as private_env } from "./vendor.js";
class BaseLinkerService {
  constructor(config) {
    this.config = {
      apiToken: config?.apiToken || private_env.BASELINKER_API_TOKEN || "",
      baseUrl: config?.baseUrl || "https://api.baselinker.com/connector.php"
    };
  }
  /**
   * Make a request to the BaseLinker API
   */
  async request(method, parameters = {}) {
    if (!this.config.apiToken) {
      throw new Error("BaseLinker API token is not configured. Set BASELINKER_API_TOKEN in .env");
    }
    const body = new URLSearchParams({
      token: this.config.apiToken,
      method,
      parameters: JSON.stringify(parameters)
    });
    const response = await fetch(this.config.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "FixTar-Store/1.0"
      },
      body: body.toString()
    });
    if (!response.ok) {
      throw new Error(`BaseLinker API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.status === "ERROR") {
      throw new Error(`BaseLinker error: ${data.error_code} - ${data.error_message}`);
    }
    return data;
  }
  // ==========================================================================
  // Product Catalog Methods
  // ==========================================================================
  /**
   * Get list of inventories (product catalogs)
   */
  async getInventories() {
    const result = await this.request("getInventories");
    return result.inventories;
  }
  /**
   * Get products from a specific inventory
   */
  async getInventoryProductsList(inventoryId, page = 1) {
    return this.request("getInventoryProductsList", {
      inventory_id: inventoryId,
      page
    });
  }
  /**
   * Get full product data including descriptions, images, features
   */
  async getInventoryProductsData(inventoryId, productIds) {
    return this.request("getInventoryProductsData", {
      inventory_id: inventoryId,
      products: productIds
    });
  }
  /**
   * Get product stock levels from all warehouses
   */
  async getInventoryProductsStock(inventoryId) {
    return this.request("getInventoryProductsStock", {
      inventory_id: inventoryId
    });
  }
  /**
   * Get product prices from all price groups
   */
  async getInventoryProductsPrices(inventoryId, page = 1) {
    return this.request("getInventoryProductsPrices", {
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
  async addOrder(orderData) {
    return this.request("addOrder", orderData);
  }
  /**
   * Get orders from BaseLinker
   */
  async getOrders(params = {}) {
    return this.request("getOrders", params);
  }
  /**
   * Update order status in BaseLinker
   */
  async setOrderStatus(orderId, statusId) {
    await this.request("setOrderStatus", {
      order_id: orderId,
      status_id: statusId
    });
  }
  /**
   * Get order status list
   */
  async getOrderStatusList() {
    return this.request("getOrderStatusList");
  }
  /**
   * Set order tracking number
   */
  async setOrderFields(orderId, fields) {
    await this.request("setOrderFields", {
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
  async syncProducts(pb, inventoryId, options = {}) {
    const result = {
      success: false,
      productsAdded: 0,
      productsUpdated: 0,
      productsSkipped: 0,
      errors: [],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      console.log(`[BaseLinker Sync] Starting product sync for inventory ${inventoryId}...`);
      let page = 1;
      let allProductIds = [];
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
      const batchSize = 100;
      for (let i = 0; i < allProductIds.length; i += batchSize) {
        const batch = allProductIds.slice(i, i + batchSize);
        const productData = await this.getInventoryProductsData(inventoryId, batch);
        for (const [productId, product] of Object.entries(productData.products)) {
          try {
            await this.upsertProduct(pb, product, Number(productId));
            const existing = await this.findProductBySku(pb, product.sku || `BL-${productId}`);
            if (existing) {
              result.productsUpdated++;
            } else {
              result.productsAdded++;
            }
          } catch (err) {
            result.errors.push(`Product ${productId}: ${err.message}`);
          }
        }
      }
      const stockData = await this.getInventoryProductsStock(inventoryId);
      for (const [productId, warehouses] of Object.entries(stockData.products)) {
        const totalStock = Object.values(warehouses).reduce((sum, qty) => sum + qty, 0);
        try {
          await this.updateProductStock(pb, `BL-${productId}`, totalStock);
        } catch (err) {
          result.errors.push(`Stock update ${productId}: ${err.message}`);
        }
      }
      result.success = true;
      console.log(`[BaseLinker Sync] Completed: +${result.productsAdded} added, ~${result.productsUpdated} updated, ${result.errors.length} errors`);
    } catch (err) {
      result.errors.push(`Sync failed: ${err.message}`);
      console.error("[BaseLinker Sync] Fatal error:", err);
    }
    return result;
  }
  /**
   * Push a FixTar order to BaseLinker
   */
  async pushOrder(order) {
    try {
      const result = await this.addOrder({
        order_status_id: order.statusId || 0,
        email: order.email,
        phone: order.phone,
        user_comments: order.comments,
        admin_comments: `FixTar order: ${order.orderNumber}`,
        currency: order.currency || "PLN",
        payment_method: order.paymentMethod || "Przelew",
        delivery_method: order.deliveryMethod || "Kurier",
        delivery_price: order.deliveryPrice || 0,
        delivery_fullname: order.deliveryAddress.fullName,
        delivery_company: order.deliveryAddress.company,
        delivery_address: order.deliveryAddress.street,
        delivery_city: order.deliveryAddress.city,
        delivery_postcode: order.deliveryAddress.postalCode,
        delivery_country_code: order.deliveryAddress.country || "PL",
        invoice_fullname: order.invoiceAddress?.fullName,
        invoice_company: order.invoiceAddress?.company,
        invoice_nip: order.invoiceAddress?.nip,
        invoice_address: order.invoiceAddress?.street,
        invoice_city: order.invoiceAddress?.city,
        invoice_postcode: order.invoiceAddress?.postalCode,
        invoice_country_code: order.invoiceAddress?.country || "PL",
        products: order.items.map((item) => ({
          storage: "db",
          storage_id: 0,
          product_id: item.sku || "",
          name: item.name,
          sku: item.sku || "",
          ean: item.ean || "",
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
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
  // ==========================================================================
  // Private Helpers
  // ==========================================================================
  async findProductBySku(pb, sku) {
    try {
      const result = await pb.collection("products").getList(1, 1, {
        filter: `sku = "${sku}"`
      });
      return result.items[0] || null;
    } catch {
      return null;
    }
  }
  async upsertProduct(pb, product, baselinkerProductId) {
    const sku = product.sku || `BL-${baselinkerProductId}`;
    const slug = this.slugify(product.name);
    const productData = {
      name: product.name,
      slug,
      sku,
      ean: product.ean || "",
      description: product.description || "",
      price: product.price_brutto || 0,
      cost: product.price_netto || 0,
      weight: product.weight || 0,
      status: "active",
      inventory: JSON.stringify({
        quantity: product.quantity || 0,
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }),
      attributes: JSON.stringify({
        brand: product.man_name || "",
        ...product.features
      }),
      metadata: JSON.stringify({
        baselinkerProductId,
        lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString()
      })
    };
    const existing = await this.findProductBySku(pb, sku);
    if (existing) {
      await pb.collection("products").update(existing.id, productData);
    } else {
      await pb.collection("products").create(productData);
    }
  }
  async updateProductStock(pb, sku, quantity) {
    const existing = await this.findProductBySku(pb, sku);
    if (existing) {
      const inventory = JSON.parse(existing.inventory || "{}");
      inventory.quantity = quantity;
      await pb.collection("products").update(existing.id, {
        inventory: JSON.stringify(inventory)
      });
    }
  }
  slugify(text) {
    return text.toLowerCase().replace(/[ąáàâã]/g, "a").replace(/[ćç]/g, "c").replace(/[ęéèêë]/g, "e").replace(/[ıíìîï]/g, "i").replace(/[łl]/g, "l").replace(/[ńñ]/g, "n").replace(/[óòôõö]/g, "o").replace(/[śş]/g, "s").replace(/[ùúûü]/g, "u").replace(/[źżz]/g, "z").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 200);
  }
}
let _instance = null;
function getBaseLinkerService() {
  if (!_instance) {
    _instance = new BaseLinkerService();
  }
  return _instance;
}
export {
  getBaseLinkerService as g
};
