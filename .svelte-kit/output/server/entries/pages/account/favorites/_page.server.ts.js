import { error } from "@sveltejs/kit";
const load = (async ({ locals }) => {
  const pb = locals.pb;
  const user = locals.user;
  if (!user) {
    throw error(401, "Unauthorized");
  }
  try {
    const wishlistItems = user.wishlist || [];
    let favorites = [];
    if (wishlistItems.length > 0) {
      favorites = await pb.collection("products").getFullList({
        filter: wishlistItems.map((id) => `id = "${id}"`).join(" || "),
        sort: "name"
      });
    }
    return {
      favorites,
      user
    };
  } catch (err) {
    console.error("Error fetching favorites:", err);
    throw error(500, "Failed to load favorites");
  }
});
const actions = {
  removeFavorite: async ({ request, locals }) => {
    const data = await request.formData();
    const productId = data.get("productId")?.toString();
    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }
    const pb = locals.pb;
    const user = locals.user;
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    try {
      let wishlist = user.wishlist || [];
      wishlist = wishlist.filter((id) => id !== productId);
      await pb.collection("users").update(user.id, {
        wishlist
      });
      return { success: true };
    } catch (err) {
      console.error("Error removing favorite:", err);
      return { success: false, error: "Failed to remove item from favorites" };
    }
  }
};
export {
  actions,
  load
};
