import { sequence } from "@sveltejs/kit/hooks";
import { S as SESSION_COOKIE_NAME, v as validateSession, l as logoutUser, d as deleteSessionCookie } from "../chunks/auth.js";
import { i as isDemoMode, c as createPocketBaseClient } from "../chunks/pocketbase.js";
const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};
const handleAuth = async ({ event, resolve }) => {
  event.locals.isAuthenticated = false;
  event.locals.user = null;
  event.locals.token = null;
  if (isDemoMode()) {
    event.locals.pb = null;
    return resolve(event);
  }
  const pb = createPocketBaseClient();
  const token = event.cookies.get(SESSION_COOKIE_NAME);
  console.log(
    `[hooks] Auth check for: ${event.url.pathname}, token ${token ? "present" : "absent"}`
  );
  event.locals.pb = pb;
  if (token) {
    try {
      console.log("[hooks] Found token, validating session...");
      const { user, isValid } = await validateSession(token);
      console.log("[hooks] Validation result:", { isValid, userExists: !!user });
      if (isValid && user) {
        console.log("[hooks] Session is valid, setting user in locals:", user.username);
        event.locals.user = user;
        event.locals.token = token;
        event.locals.isAuthenticated = true;
      } else {
        console.log("[hooks] Session is invalid, cleaning up cookies");
        logoutUser(pb);
        deleteSessionCookie(event);
      }
    } catch (error) {
      console.error("Session validation error:", error);
      logoutUser(pb);
      deleteSessionCookie(event);
    }
  } else {
    console.log("[hooks] No auth token found in cookies");
  }
  return resolve(event);
};
const handleSecurity = async ({ event, resolve }) => {
  const response = await resolve(event);
  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.headers.set(header, value);
  });
  return response;
};
const filterBots = async ({ event, resolve }) => {
  const userAgent = event.request.headers.get("user-agent") || "";
  const isBot = /bot|crawl|spider|slurp|mediapartners-google/i.test(userAgent);
  event.locals.isBot = isBot;
  if (isBot && (event.url.pathname.startsWith("/account") || event.url.pathname.startsWith("/api"))) {
    return new Response("Not Found", { status: 404 });
  }
  return resolve(event);
};
const handle = sequence(filterBots, handleAuth, handleSecurity);
export {
  handle
};
