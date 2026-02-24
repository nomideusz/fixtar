import { z } from "zod";
import { c as createPocketBaseClient } from "./pocketbase.js";
const SESSION_COOKIE_NAME = "pb-auth";
const LoginSchema = z.object({
  identity: z.string().min(1, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
const RegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirm: z.string().min(8, "Password confirmation is required")
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"]
});
function isNetlifyUrl(hostname) {
  return hostname?.endsWith(".netlify.app") || hostname?.includes("netlify") || hostname?.includes("-netlify-") || hostname?.endsWith(".netlify.com");
}
async function getAuthenticatedUser(pb, locals) {
  if (!pb) return null;
  try {
    if (locals?.user) {
      console.log("[auth] Found user in locals:", locals.user.username || "unknown");
      return locals.user;
    }
    if (!pb.authStore || !pb.authStore.isValid) return null;
    if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV || process.env.NETLIFY) {
      return pb.authStore.isValid && pb.authStore.record ? pb.authStore.record : null;
    }
    try {
      await pb.collection("users").authRefresh();
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
    }
    return pb.authStore.record;
  } catch (err) {
    console.error("Error getting authenticated user:", err);
    pb?.authStore?.clear();
    return null;
  }
}
async function loginUser(identity, password, pb) {
  const client = pb || createPocketBaseClient();
  try {
    const validData = LoginSchema.parse({ identity, password });
    await client.collection("users").authWithPassword(validData.identity, validData.password);
    const user = client.authStore.record ? {
      id: client.authStore.record.id,
      username: client.authStore.record.username,
      email: client.authStore.record.email,
      verified: client.authStore.record.verified,
      created: client.authStore.record.created,
      updated: client.authStore.record.updated,
      isAdmin: client.authStore.record.isAdmin || false
    } : null;
    return {
      success: true,
      user,
      token: client.authStore.token
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      error
    };
  }
}
async function registerUser(username, email, password, passwordConfirm) {
  const pb = createPocketBaseClient();
  try {
    const validData = RegisterSchema.parse({ username, email, password, passwordConfirm });
    const result = await pb.collection("users").create({
      username: validData.username,
      email: validData.email,
      password: validData.password,
      passwordConfirm: validData.passwordConfirm
    });
    return { success: true, user: result };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error };
  }
}
function logoutUser(pb) {
  const client = pb || createPocketBaseClient();
  client.authStore.clear();
  return { success: true };
}
function setSessionCookieWithParams(cookies, url, token) {
  const expires = new Date(Date.now() + 1e3 * 60 * 60 * 24 * 30);
  const isProduction = process.env.NODE_ENV === "production";
  const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
  const hostname = url?.hostname || "";
  const isNetlify = !!process.env.NETLIFY || !!process.env.NETLIFY_IMAGES_CDN_DOMAIN || !!process.env.NETLIFY_DEPLOY_URL || isNetlifyUrl(hostname);
  console.log(`[auth] Setting cookies in environment: ${isProduction ? "production" : "development"}, Vercel: ${isVercel}, Netlify: ${isNetlify}, Hostname: ${hostname}`);
  let domain = void 0;
  if (isProduction) {
    const hostname2 = url.hostname.split(":")[0];
    console.log(`[auth] Setting cookies for hostname: ${hostname2}`);
    if (!hostname2.includes("localhost")) {
      if (hostname2.startsWith("www.")) {
        domain = hostname2;
        console.log(`[auth] Using full www domain: ${domain}`);
      } else if (hostname2.includes(".")) {
        domain = hostname2;
        console.log(`[auth] Using domain: ${domain}`);
      }
    }
  }
  const sameSite = isVercel ? "none" : "lax";
  const useSecure = isProduction && (isVercel || isNetlify || url.protocol === "https:");
  console.log(
    `[auth] Setting cookie with options:`,
    JSON.stringify({
      path: "/",
      domain,
      sameSite,
      secure: useSecure,
      httpOnly: true,
      expires: expires.toISOString(),
      token: token ? `${token.substring(0, 10)}...` : "none"
    })
  );
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    domain,
    sameSite: isVercel ? "none" : "lax",
    secure: useSecure,
    httpOnly: true,
    expires
  });
  cookies.set(`${SESSION_COOKIE_NAME}_exists`, "true", {
    path: "/",
    domain,
    sameSite: isVercel ? "none" : "lax",
    secure: useSecure,
    httpOnly: false,
    expires
  });
  console.log(`[auth] Session cookies set for domain: ${domain || "default"} with SameSite=${sameSite}, secure=${useSecure}`);
}
function deleteSessionCookie(event) {
  console.log("[auth] Deleting session cookies");
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
    const hostname = event.url?.hostname || "";
    const isNetlify = !!process.env.NETLIFY || !!process.env.NETLIFY_IMAGES_CDN_DOMAIN || !!process.env.NETLIFY_DEPLOY_URL || isNetlifyUrl(hostname);
    let domain = void 0;
    const url = event.url || event?.request?.url || null;
    if (isProduction && url) {
      let hostname2;
      if (typeof url === "string") {
        try {
          hostname2 = new URL(url).hostname.split(":")[0];
        } catch (e) {
          console.error("[auth] Invalid URL string:", url);
          hostname2 = "";
        }
      } else {
        hostname2 = url.hostname.split(":")[0];
      }
      console.log(`[auth] Deleting cookies for hostname: ${hostname2}`);
      if (!hostname2.includes("localhost")) {
        if (hostname2.startsWith("www.")) {
          domain = hostname2;
          console.log(`[auth] Using www domain: ${domain}`);
        } else if (hostname2.includes(".")) {
          domain = hostname2;
          console.log(`[auth] Using domain: ${domain}`);
        }
      }
    }
    const sameSite = isVercel ? "none" : "lax";
    const useSecure = isProduction && (isVercel || isNetlify || url && typeof url !== "string" && url.protocol === "https:");
    const baseOptions = {
      path: "/",
      domain,
      sameSite,
      secure: useSecure
    };
    console.log(`[auth] Cookie deletion options:`, JSON.stringify({
      ...baseOptions,
      sameSite,
      secure: useSecure
    }));
    event.cookies.delete(SESSION_COOKIE_NAME, {
      path: "/",
      domain,
      sameSite: isVercel ? "none" : "lax",
      secure: useSecure
    });
    console.log(`[auth] Deleted cookie ${SESSION_COOKIE_NAME}`);
    event.cookies.delete(`${SESSION_COOKIE_NAME}_exists`, {
      path: "/",
      domain,
      sameSite: isVercel ? "none" : "lax",
      secure: useSecure
    });
    console.log(`[auth] Deleted cookie ${SESSION_COOKIE_NAME}_exists`);
    const paths = ["/", "/auth", "/api", "/account"];
    for (const path of paths) {
      try {
        event.cookies.delete(SESSION_COOKIE_NAME, {
          path,
          domain,
          sameSite: isVercel ? "none" : "lax",
          secure: useSecure
        });
        event.cookies.delete(`${SESSION_COOKIE_NAME}_exists`, {
          path,
          domain,
          sameSite: isVercel ? "none" : "lax",
          secure: useSecure
        });
      } catch (e) {
      }
    }
    event.cookies.set(SESSION_COOKIE_NAME, "", {
      path: "/",
      domain,
      sameSite: isVercel ? "none" : "lax",
      secure: useSecure,
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0
    });
    event.cookies.set(`${SESSION_COOKIE_NAME}_exists`, "", {
      path: "/",
      domain,
      sameSite: isVercel ? "none" : "lax",
      secure: useSecure,
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0
    });
    try {
      if (event.request && event.request.headers) {
        console.log(
          "[auth] Cookies after deletion:",
          event.request.headers.get("cookie") || "no cookies"
        );
      } else {
        console.log("[auth] Cookies after deletion: Unable to access request headers");
      }
    } catch (headerError) {
      console.log("[auth] Could not read request headers:", headerError);
    }
  } catch (e) {
    console.error("[auth] Error deleting cookies:", e);
  }
}
async function validateSession(token) {
  const pb = createPocketBaseClient();
  try {
    if (!token) return { user: null, token: null, isValid: false };
    pb.authStore.save(token, null);
    if (!pb.authStore.isValid) return { user: null, token: null, isValid: false };
    console.log("[auth] Auth record in store after token validation:", pb.authStore.record);
    if (process.env.NODE_ENV === "production") {
      if (pb.authStore.record) {
        const user2 = {
          id: pb.authStore.record.id,
          username: pb.authStore.record.username,
          email: pb.authStore.record.email,
          verified: pb.authStore.record.verified || false,
          created: pb.authStore.record.created,
          updated: pb.authStore.record.updated,
          isAdmin: pb.authStore.record.isAdmin || false
        };
        console.log("[auth] Mapped user from AuthStore:", user2);
        return { user: user2, token, isValid: true };
      }
    } else {
      try {
        await pb.collection("users").authRefresh();
        console.log("[auth] Auth refreshed successfully");
      } catch (error) {
        console.error("[auth] Auth refresh failed:", error);
      }
    }
    if (!pb.authStore.record) {
      console.log("[auth] No record in auth store after validation");
      return { user: null, token: null, isValid: false };
    }
    console.log("[auth] Raw record from auth store:", pb.authStore.record);
    const user = {
      id: pb.authStore.record.id || "",
      username: pb.authStore.record.username || "unknown",
      email: pb.authStore.record.email || "",
      verified: pb.authStore.record.verified || false,
      created: pb.authStore.record.created || (/* @__PURE__ */ new Date()).toISOString(),
      updated: pb.authStore.record.updated || (/* @__PURE__ */ new Date()).toISOString(),
      isAdmin: pb.authStore.record.isAdmin || false
    };
    console.log("[auth] Final mapped user:", user);
    return { user, token, isValid: !!user.id };
  } catch (error) {
    console.error("[auth] Session validation failed:", error);
    pb.authStore.clear();
    return { user: null, token: null, isValid: false };
  }
}
export {
  SESSION_COOKIE_NAME as S,
  loginUser as a,
  deleteSessionCookie as d,
  getAuthenticatedUser as g,
  logoutUser as l,
  registerUser as r,
  setSessionCookieWithParams as s,
  validateSession as v
};
