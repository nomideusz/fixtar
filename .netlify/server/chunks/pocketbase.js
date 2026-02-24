import PocketBase from "pocketbase";
import { p as private_env } from "./vendor.js";
const DEMO_MODE = private_env.DEMO_MODE === "true";
if (!DEMO_MODE) {
  if (!private_env.POCKETBASE_URL) throw new Error("POCKETBASE_URL is not set");
  if (!private_env.PB_ADMIN_EMAIL) throw new Error("PB_ADMIN_EMAIL is not set");
  if (!private_env.PB_ADMIN_PASSWORD) throw new Error("PB_ADMIN_PASSWORD is not set");
}
function createPocketBaseClient() {
  return new PocketBase(private_env.POCKETBASE_URL || "http://localhost:8090");
}
function isDemoMode() {
  return DEMO_MODE;
}
const pb = createPocketBaseClient();
async function authenticateAsAdmin() {
  if (DEMO_MODE) {
    console.log("[pb] Demo mode - skipping admin authentication");
    return false;
  }
  try {
    if (process.env.VERCEL_ENV || process.env.CF_PAGES) {
      console.log("[pb] Skipping admin authentication in Edge runtime");
      return false;
    }
    const adminEmail = private_env.PB_ADMIN_EMAIL;
    const adminPassword = private_env.PB_ADMIN_PASSWORD;
    await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
    console.log("[pb] Admin authentication successful");
    return true;
  } catch (error) {
    console.error("[pb] Failed to authenticate as admin:", error);
    return false;
  }
}
if (!process.env.VERCEL_ENV && !process.env.CF_PAGES) {
  authenticateAsAdmin().then((success) => {
    if (success) {
      console.log("[pb] Admin credentials verified");
    } else {
      console.warn("[pb] Admin authentication failed");
    }
  });
}
export {
  createPocketBaseClient as c,
  isDemoMode as i,
  pb as p
};
