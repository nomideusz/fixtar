import { k as derived, w as writable } from "./vendor.js";
import "pocketbase";
function createCartStore() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    addItem: (product, quantity = 1) => {
      update((items) => {
        const existingIndex = items.findIndex((item) => item.productId === product.productId);
        if (existingIndex >= 0) {
          items[existingIndex].quantity += quantity;
        } else {
          items.push({ ...product, quantity });
        }
        return items;
      });
    },
    removeItem: (productId) => {
      update((items) => {
        const newItems = items.filter((item) => item.productId !== productId);
        return newItems;
      });
    },
    updateQuantity: (productId, quantity) => {
      update((items) => {
        const item = items.find((item2) => item2.productId === productId);
        if (item) {
          if (quantity <= 0) {
            const newItems = items.filter((item2) => item2.productId !== productId);
            return newItems;
          } else {
            item.quantity = quantity;
            return items;
          }
        }
        return items;
      });
    },
    clear: () => {
      update(() => {
        const newItems = [];
        return newItems;
      });
    }
  };
}
const cart = createCartStore();
derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.quantity, 0)
);
({
  ...cart
});
function createUserStore() {
  const { subscribe, set, update } = writable(null);
  return {
    subscribe,
    login: (user) => {
      set(user);
    },
    logout: () => {
      set(null);
    },
    updateUser: (updates) => {
      update((currentUser) => {
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          return updatedUser;
        }
        return currentUser;
      });
    }
  };
}
const userStore = createUserStore();
derived(userStore, ($user) => !!$user);
({
  ...userStore
});
function createProductsStore() {
  const { subscribe, set, update } = writable([]);
  const { subscribe: subscribeLoading, set: setLoading } = writable(false);
  const { subscribe: subscribeError, set: setError } = writable(null);
  return {
    subscribe,
    loading: { subscribe: subscribeLoading },
    error: { subscribe: subscribeError },
    // Fetch all products with optional filters
    fetchProducts: async (filters) => {
      return;
    },
    // Fetch a single product by ID or slug
    fetchProduct: async (idOrSlug) => {
      return null;
    },
    // Fetch featured products
    fetchFeaturedProducts: async (limit = 8) => {
      return;
    },
    // Admin functions
    addProduct: async (productData) => {
      return null;
    },
    updateProduct: async (id, updates) => {
      return null;
    },
    removeProduct: async (id) => {
      return false;
    },
    // Clear store
    clear: () => {
      set([]);
      setError(null);
    }
  };
}
function createCategoriesStore() {
  const { subscribe, set, update } = writable([]);
  const { subscribe: subscribeLoading, set: setLoading } = writable(false);
  return {
    subscribe,
    loading: { subscribe: subscribeLoading },
    fetchCategories: async () => {
      return;
    },
    fetchFeaturedCategories: async () => {
      return;
    }
  };
}
const productsStore = createProductsStore();
createCategoriesStore();
derived(
  productsStore,
  ($products) => $products.filter((p) => p.featured && p.status === "active")
);
derived(
  productsStore,
  ($products) => $products.filter((p) => {
    if (!p.inventory?.trackQuantity) return true;
    return p.inventory.quantity > 0;
  })
);
function createNotificationsStore() {
  const { subscribe, update } = writable([]);
  function addNotification(notification) {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5e3
    };
    update((notifications2) => [...notifications2, newNotification]);
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    return id;
  }
  function removeNotification(id) {
    update((notifications2) => notifications2.filter((n) => n.id !== id));
  }
  return {
    subscribe,
    success: (message, duration) => addNotification({ type: "success", message, duration }),
    error: (message, duration) => addNotification({ type: "error", message, duration }),
    warning: (message, duration) => addNotification({ type: "warning", message, duration }),
    info: (message, duration) => addNotification({ type: "info", message, duration }),
    remove: removeNotification,
    clear: () => update(() => [])
  };
}
const notifications = createNotificationsStore();
export {
  cart as c,
  notifications as n,
  userStore as u
};
