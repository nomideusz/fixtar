import { redirect } from "@sveltejs/kit";
import { g as getAuthenticatedUser, l as logoutUser, d as deleteSessionCookie } from "../../../chunks/auth.js";
import { D as DEV } from "../../../chunks/vendor.js";
const load = (async ({ locals, url, cookies, fetch }) => {
  const pb = locals.pb;
  try {
    console.log(`Account layout server: Checking auth for path ${url.pathname}`);
    const user = await getAuthenticatedUser(pb, locals);
    console.log(
      `Account layout server: Auth state check - User ${user ? "found with ID " + user.id : "not found"}, authStore.isValid=${pb?.authStore?.isValid || false}`
    );
    if (DEV) ;
    if (user && locals.user) {
      console.log("Account layout server: User found in locals, trusting hooks validation");
      return {
        user: {
          ...user,
          isAuthenticated: true
        }
      };
    }
    if (!user) {
      console.log("Account layout server: No authenticated user, forcing logout");
      try {
        logoutUser(pb);
        deleteSessionCookie({ locals, cookies, url });
      } catch (err) {
        console.error("Error during logout process:", err);
      }
      console.log("Account layout server: Redirecting to login");
      throw redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}&auth=expired`);
    }
    console.log("Account layout server: User authenticated successfully:", user.username);
    return {
      user: {
        ...user,
        isAuthenticated: true
      }
    };
  } catch (error) {
    console.error("Account layout server error:", error);
    try {
      logoutUser(pb);
      deleteSessionCookie({ locals, cookies, url });
    } catch (e) {
      console.error("Failed to clear cookies during error handling:", e);
    }
    throw redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}&error=session`);
  }
});
export {
  load
};
