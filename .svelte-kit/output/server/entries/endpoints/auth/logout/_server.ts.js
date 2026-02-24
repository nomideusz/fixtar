import { l as logoutUser, d as deleteSessionCookie } from "../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
function nukeAllCookies(event) {
  console.log("Aggressive cookie deletion starting...");
  const paths = ["/", "/auth", "/api", "/account", "/auth/logout", ""];
  const cookieNames = [
    "pb-auth",
    "pb-auth_exists",
    "pb_auth",
    "pocketbase_auth",
    "auth",
    "session"
  ];
  const domains = [
    void 0,
    // Bez specyfikacji domeny
    "",
    // Pusta domena
    event.url.hostname,
    // Dokładna domena
    `.${event.url.hostname}`,
    // Domena z kropką (aby objąć wszystkie subdomeny)
    "localhost"
    // Dla środowiska deweloperskiego
  ];
  for (const name of cookieNames) {
    for (const path of paths) {
      for (const domain of domains) {
        try {
          event.cookies.set(name, "", {
            path,
            domain,
            expires: /* @__PURE__ */ new Date(0),
            maxAge: 0,
            sameSite: "lax",
            httpOnly: true,
            secure: false
          });
          event.cookies.set(name, "", {
            path,
            domain,
            expires: /* @__PURE__ */ new Date(0),
            maxAge: 0,
            sameSite: "strict",
            httpOnly: true,
            secure: true
          });
          event.cookies.set(name, "", {
            path,
            domain,
            expires: /* @__PURE__ */ new Date(0),
            maxAge: 0,
            sameSite: "lax",
            httpOnly: false,
            secure: false
          });
        } catch (e) {
        }
      }
    }
  }
  deleteSessionCookie(event);
  console.log("Aggressive cookie deletion completed");
}
const POST = async (event) => {
  try {
    console.log("POST logout handler: Starting server logout process");
    await logoutUser(event.locals.pb);
    console.log("POST logout handler: PocketBase auth store cleared");
    nukeAllCookies(event);
    const allCookies = event.request.headers.get("cookie") || "";
    console.log("POST logout handler: Remaining cookies after deletion:", allCookies);
    const headers = new Headers();
    headers.append("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.append("Pragma", "no-cache");
    headers.append("Expires", "0");
    headers.append("Clear-Site-Data", '"cache", "cookies", "storage"');
    return json(
      { success: true, message: "Logout completed successfully" },
      {
        headers,
        status: 200
      }
    );
  } catch (error) {
    console.error("POST logout handler error:", error);
    return json({ success: false, error: "Logout failed" }, { status: 500 });
  }
};
const GET = async (event) => {
  try {
    console.log("GET logout handler: Starting server logout process");
    const forceLogout = event.url.searchParams.get("force") === "true";
    await logoutUser(event.locals.pb);
    console.log("GET logout handler: PocketBase auth store cleared");
    nukeAllCookies(event);
    const headers = new Headers();
    headers.append("Location", forceLogout ? "/?forced_logout=true" : "/?logged_out=true");
    headers.append("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.append("Pragma", "no-cache");
    headers.append("Expires", "0");
    headers.append("Clear-Site-Data", '"cache", "cookies", "storage"');
    const allCookies = event.request.headers.get("cookie") || "";
    console.log("GET logout handler: Remaining cookies after deletion:", allCookies);
    return new Response(null, {
      status: 302,
      headers
    });
  } catch (error) {
    console.error("GET logout handler error:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/?error=logout_failed",
        "Clear-Site-Data": '"cookies", "storage"'
      }
    });
  }
};
export {
  GET,
  POST
};
