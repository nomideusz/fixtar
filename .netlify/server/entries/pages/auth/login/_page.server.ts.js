import { a as loginUser, s as setSessionCookieWithParams } from "../../../../chunks/auth.js";
import { fail, redirect } from "@sveltejs/kit";
const actions = {
  default: async ({ request, cookies, fetch, url }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const redirectTo = data.get("redirectTo")?.toString() || "/account";
    console.log(`[login] Processing login attempt for ${email || "unknown user"}`);
    console.log(`[login] Current URL: ${url.toString()}`);
    console.log(`[login] Redirect destination: ${redirectTo}`);
    if (!email || !password) {
      return fail(400, {
        message: "Email and password are required",
        email: email || "",
        redirectTo
      });
    }
    const result = await loginUser(email, password);
    if (!result.success) {
      console.log(`[login] Login failed:`, result.error);
      return fail(401, {
        message: "Invalid credentials",
        email,
        redirectTo
      });
    }
    console.log(`[login] Login successful for ${email}`);
    console.log(`[login] Setting session cookie`);
    setSessionCookieWithParams(cookies, url, result.token);
    const allCookies = cookies.getAll();
    console.log(`[login] Cookies set (${allCookies.length})`);
    const absoluteRedirectUrl = new URL(redirectTo, url.origin).toString();
    console.log(`[login] Redirecting to: ${absoluteRedirectUrl}`);
    throw redirect(303, absoluteRedirectUrl);
  }
};
export {
  actions
};
