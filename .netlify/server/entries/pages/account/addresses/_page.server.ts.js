import { fail } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const pb = locals.pb;
  const user = locals.user;
  if (!user) {
    console.log("[addresses] No user authenticated");
    return {
      user: null,
      addresses: []
    };
  }
  if (locals.token) {
    try {
      pb.authStore.save(locals.token, user);
      console.log("[addresses] PocketBase client authenticated for load");
    } catch (authError) {
      console.error("[addresses] Failed to authenticate PocketBase client:", authError);
    }
  }
  console.log(`[addresses] Loading addresses for user: ${user.id} (${user.email})`);
  try {
    let addresses = [];
    try {
      const possibleUserFields = ["user", "userId", "user_id"];
      let addressesResult = null;
      let userFieldName = "user";
      for (const fieldName of possibleUserFields) {
        try {
          console.log(`[addresses] Trying to fetch addresses with field: ${fieldName}`);
          addressesResult = await pb.collection("addresses").getFullList({
            filter: `${fieldName} = "${user.id}"`
          });
          userFieldName = fieldName;
          console.log(`[addresses] Successfully fetched ${addressesResult.length} addresses using field: ${fieldName}`);
          console.log("[addresses] Raw addresses data:", addressesResult);
          break;
        } catch (e) {
          console.log(`[addresses] Field ${fieldName} failed:`, e.message);
          continue;
        }
      }
      if (addressesResult) {
        try {
          const sortedResult = await pb.collection("addresses").getFullList({
            filter: `${userFieldName} = "${user.id}"`,
            sort: "created"
          });
          addressesResult = sortedResult;
          console.log("Applied sorting to addresses successfully");
        } catch (e) {
          console.log("Address sorting failed, using unsorted results:", e.message);
        }
      }
      if (addressesResult) {
        addresses = addressesResult.map((item) => ({
          id: item.id,
          user: item[userFieldName] || user.id,
          type: item.type || "Home",
          street: item.street || "",
          city: item.city || "",
          postalCode: item.postalCode || "",
          country: item.country || "",
          default: item.default || false,
          created: item.created,
          updated: item.updated
        }));
        console.log(`Successfully loaded ${addresses.length} addresses for user`);
      } else {
        console.log("No valid user field found for addresses collection");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      console.log("Addresses collection might not be set up yet");
    }
    return {
      user,
      addresses
    };
  } catch (err) {
    console.error("Error in addresses page load:", err);
    return {
      user,
      addresses: [],
      error: "Failed to load addresses"
    };
  }
};
const actions = {
  addAddress: async ({ request, locals }) => {
    const pb = locals.pb;
    const user = locals.user;
    if (!user) {
      return fail(401, { success: false, message: "Authentication required" });
    }
    try {
      const formData = await request.formData();
      const type = formData.get("type")?.toString() || "Home";
      const street = formData.get("street")?.toString();
      const city = formData.get("city")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const country = formData.get("country")?.toString();
      const setDefault = formData.get("default") === "true";
      if (!street || !city || !postalCode || !country) {
        return fail(400, {
          success: false,
          message: "All address fields are required"
        });
      }
      try {
        await pb.collections.getOne("addresses").catch(async () => {
          console.log("Creating addresses collection");
          await pb.collections.create({
            name: "addresses",
            schema: [
              {
                name: "user",
                type: "relation",
                required: true,
                options: {
                  collectionId: "_pb_users_auth_",
                  cascadeDelete: true
                }
              },
              {
                name: "type",
                type: "text",
                required: true
              },
              {
                name: "street",
                type: "text",
                required: true
              },
              {
                name: "city",
                type: "text",
                required: true
              },
              {
                name: "postalCode",
                type: "text",
                required: true
              },
              {
                name: "country",
                type: "text",
                required: true
              },
              {
                name: "default",
                type: "bool",
                required: true
              }
            ]
          });
        });
      } catch (err) {
        console.error("Error checking/creating addresses collection:", err);
      }
      if (setDefault) {
        try {
          const addresses = await pb.collection("addresses").getFullList({
            filter: `user = "${user.id}" && default = true`
          });
          for (const address of addresses) {
            await pb.collection("addresses").update(address.id, {
              default: false
            });
          }
        } catch (err) {
          console.error("Error updating existing default addresses:", err);
        }
      }
      let isDefault = setDefault;
      try {
        const addressCount = await pb.collection("addresses").getList(1, 1, {
          filter: `user = "${user.id}"`
        });
        if (addressCount.totalItems === 0) {
          isDefault = true;
        }
      } catch (err) {
        console.error("Error checking address count:", err);
      }
      const newAddress = await pb.collection("addresses").create({
        user: user.id,
        type,
        street,
        city,
        postalCode,
        country,
        default: isDefault
      });
      return { success: true, address: newAddress };
    } catch (err) {
      console.error("Error adding address:", err);
      return fail(500, {
        success: false,
        message: "Failed to add address"
      });
    }
  },
  updateAddress: async ({ request, locals }) => {
    const pb = locals.pb;
    const user = locals.user;
    if (!user) {
      return fail(401, { success: false, message: "Authentication required" });
    }
    try {
      const formData = await request.formData();
      const addressId = formData.get("id")?.toString();
      const type = formData.get("type")?.toString();
      const street = formData.get("street")?.toString();
      const city = formData.get("city")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const country = formData.get("country")?.toString();
      const setDefault = formData.get("default") === "true";
      if (!addressId) {
        return fail(400, { success: false, message: "Address ID is required" });
      }
      const address = await pb.collection("addresses").getOne(addressId).catch(() => null);
      if (!address || address.user !== user.id) {
        return fail(403, { success: false, message: "Not authorized to update this address" });
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
      if (setDefault !== void 0) updateData.default = setDefault;
      const updatedAddress = await pb.collection("addresses").update(addressId, updateData);
      return { success: true, address: updatedAddress };
    } catch (err) {
      console.error("Error updating address:", err);
      return fail(500, { success: false, message: "Failed to update address" });
    }
  },
  removeAddress: async ({ request, locals }) => {
    const pb = locals.pb;
    const user = locals.user;
    if (!user) {
      return fail(401, { success: false, message: "Authentication required" });
    }
    if (locals.token) {
      try {
        pb.authStore.save(locals.token, user);
        console.log("[addresses] PocketBase client authenticated for removeAddress");
      } catch (authError) {
        console.error("[addresses] Failed to authenticate PocketBase client:", authError);
        return fail(401, { success: false, message: "Authentication failed" });
      }
    }
    try {
      const formData = await request.formData();
      const addressId = formData.get("id")?.toString();
      console.log(`[addresses] Attempting to delete address: ${addressId} for user: ${user.id}`);
      if (!addressId) {
        return fail(400, { success: false, message: "Address ID is required" });
      }
      const address = await pb.collection("addresses").getOne(addressId).catch(() => null);
      if (!address) {
        console.log(`[addresses] Address ${addressId} not found`);
        return fail(404, { success: false, message: "Address not found" });
      }
      if (address.user !== user.id) {
        console.log(`[addresses] User ${user.id} not authorized to delete address ${addressId} (belongs to ${address.user})`);
        return fail(403, { success: false, message: "Not authorized to delete this address" });
      }
      const isDefault = address.default === true;
      console.log(`[addresses] Deleting address ${addressId}, isDefault: ${isDefault}`);
      await pb.collection("addresses").delete(addressId);
      console.log(`[addresses] Successfully deleted address ${addressId}`);
      if (isDefault) {
        try {
          const addresses = await pb.collection("addresses").getFullList({
            filter: `user = "${user.id}"`,
            sort: "created"
          });
          if (addresses.length > 0) {
            await pb.collection("addresses").update(addresses[0].id, {
              default: true
            });
            console.log(`[addresses] Set address ${addresses[0].id} as new default`);
          }
        } catch (err) {
          console.error("Error setting new default address:", err);
        }
      }
      return { success: true };
    } catch (err) {
      console.error("[addresses] Error removing address:", err);
      return fail(500, { success: false, message: "Failed to remove address" });
    }
  },
  setDefaultAddress: async ({ request, locals }) => {
    const pb = locals.pb;
    const user = locals.user;
    if (!user) {
      return fail(401, { success: false, message: "Authentication required" });
    }
    if (locals.token) {
      try {
        pb.authStore.save(locals.token, user);
        console.log("[addresses] PocketBase client authenticated for setDefaultAddress");
      } catch (authError) {
        console.error("[addresses] Failed to authenticate PocketBase client:", authError);
        return fail(401, { success: false, message: "Authentication failed" });
      }
    }
    try {
      const formData = await request.formData();
      const addressId = formData.get("id")?.toString();
      console.log(`[addresses] Setting default address: ${addressId} for user: ${user.id}`);
      if (!addressId) {
        return fail(400, { success: false, message: "Address ID is required" });
      }
      const address = await pb.collection("addresses").getOne(addressId).catch(() => null);
      if (!address) {
        console.log(`[addresses] Address ${addressId} not found`);
        return fail(404, { success: false, message: "Address not found" });
      }
      if (address.user !== user.id) {
        console.log(`[addresses] User ${user.id} not authorized to update address ${addressId}`);
        return fail(403, { success: false, message: "Not authorized to update this address" });
      }
      const addresses = await pb.collection("addresses").getFullList({
        filter: `user = "${user.id}" && default = true && id != "${addressId}"`
      });
      for (const addr of addresses) {
        await pb.collection("addresses").update(addr.id, {
          default: false
        });
      }
      await pb.collection("addresses").update(addressId, {
        default: true
      });
      console.log(`[addresses] Successfully set address ${addressId} as default`);
      return { success: true };
    } catch (err) {
      console.error("[addresses] Error setting default address:", err);
      return fail(500, { success: false, message: "Failed to set default address" });
    }
  }
};
export {
  actions,
  load
};
