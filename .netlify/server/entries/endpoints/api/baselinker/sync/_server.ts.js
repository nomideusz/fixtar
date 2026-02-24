import { json } from "@sveltejs/kit";
import { g as getBaseLinkerService } from "../../../../../chunks/baselinker.js";
const POST = async ({ locals, request }) => {
  if (!locals.user?.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const { inventoryId, dryRun = false } = body;
    if (!inventoryId) {
      return json({ error: "inventoryId is required" }, { status: 400 });
    }
    const service = getBaseLinkerService();
    const result = await service.syncProducts(locals.pb, inventoryId, { dryRun });
    return json(result);
  } catch (err) {
    console.error("[BaseLinker Sync API] Error:", err);
    return json({ error: err.message }, { status: 500 });
  }
};
const GET = async ({ locals }) => {
  if (!locals.user?.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const service = getBaseLinkerService();
    const inventories = await service.getInventories();
    return json({ inventories });
  } catch (err) {
    console.error("[BaseLinker API] Error fetching inventories:", err);
    return json({ error: err.message }, { status: 500 });
  }
};
export {
  GET,
  POST
};
