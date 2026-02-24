import { json } from "@sveltejs/kit";
import { c as createPocketBaseClient } from "../../../../../chunks/pocketbase.js";
const GET = async ({ locals, request, cookies, url }) => {
  const freshPb = createPocketBaseClient();
  const allCookies = {};
  for (const cookie of cookies.getAll()) {
    allCookies[cookie.name] = cookie.value;
  }
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const safeUser = locals.user ? {
    id: locals.user.id,
    email: locals.user.email,
    username: locals.user.username,
    verified: locals.user.verified,
    isAuthenticated: locals.isAuthenticated
  } : null;
  const pbAuthState = locals.pb ? {
    isValid: locals.pb.authStore.isValid,
    token: locals.pb.authStore.token ? `${locals.pb.authStore.token.substring(0, 10)}...` : null,
    hasRecord: !!locals.pb.authStore.record
  } : null;
  const authCookie = cookies.get("pb-auth");
  if (authCookie) {
    freshPb.authStore.save(authCookie, null);
  }
  const freshPbAuthState = {
    isValid: freshPb.authStore.isValid,
    token: freshPb.authStore.token ? `${freshPb.authStore.token.substring(0, 10)}...` : null,
    hasRecord: !!freshPb.authStore.record
  };
  return json({
    authenticated: !!locals.user,
    isAuthenticated: locals.isAuthenticated,
    user: safeUser,
    token: locals.token ? `${locals.token.substring(0, 10)}...` : null,
    pbAuthState,
    freshPbAuthState,
    cookies: allCookies,
    headers,
    url: url.toString(),
    origin: url.origin,
    host: url.host,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV || "development",
    runtime: {
      vercel: !!process.env.VERCEL_ENV,
      cf: !!process.env.CF_PAGES
    }
  });
};
export {
  GET
};
