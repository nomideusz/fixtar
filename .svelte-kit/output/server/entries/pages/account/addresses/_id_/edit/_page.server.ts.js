import { redirect, error } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, "/auth/login");
  }
  const pb = locals.pb;
  const user = locals.user;
  const addressId = params.id;
  try {
    const address = await pb.collection("addresses").getOne(addressId);
    if (address.user !== user.id) {
      throw error(403, "Not authorized to view this address");
    }
    return {
      user,
      address: {
        id: address.id,
        user: address.user,
        type: address.type || "Home",
        street: address.street || "",
        city: address.city || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        default: address.default || false,
        created: address.created,
        updated: address.updated
      }
    };
  } catch (err) {
    console.error("Error loading address:", err);
    if (err.status === 404) {
      throw error(404, "Address not found");
    }
    throw error(500, "Failed to load address");
  }
};
const actions = {
  updateAddress: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, "/auth/login");
    }
    const pb = locals.pb;
    const user = locals.user;
    const addressId = params.id;
    try {
      const formData = await request.formData();
      const type = formData.get("type")?.toString();
      const street = formData.get("street")?.toString();
      const city = formData.get("city")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const country = formData.get("country")?.toString();
      const setDefault = formData.get("default") === "true";
      const address = await pb.collection("addresses").getOne(addressId).catch(() => null);
      if (!address || address.user !== user.id) {
        return {
          success: false,
          message: "Not authorized to update this address"
        };
      }
      if (setDefault) {
        try {
          const addresses = await pb.collection("addresses").getFullList({
            filter: `user = "${user.id}" && default = true && id != "${addressId}"`
          });
          for (const addr of addresses) {
            await pb.collection("addresses").update(addr.id, {
              default: false
            });
          }
        } catch (err) {
          console.error("Error updating existing default addresses:", err);
        }
      }
      const updateData = {};
      if (type) updateData.type = type;
      if (street) updateData.street = street;
      if (city) updateData.city = city;
      if (postalCode) updateData.postalCode = postalCode;
      if (country) updateData.country = country;
      updateData.default = setDefault;
      const updatedAddress = await pb.collection("addresses").update(addressId, updateData);
      return { success: true, address: updatedAddress };
    } catch (err) {
      console.error("Error updating address:", err);
      return {
        success: false,
        message: "Failed to update address"
      };
    }
  }
};
export {
  actions,
  load
};
