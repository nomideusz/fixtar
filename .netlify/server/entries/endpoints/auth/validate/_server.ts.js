import { json } from "@sveltejs/kit";
import { S as SESSION_COOKIE_NAME, v as validateSession, s as setSessionCookieWithParams } from "../../../../chunks/auth.js";
const POST = async ({ request, cookies, url }) => {
  try {
    let token = null;
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const text = await request.text();
        if (text && text.length > 0) {
          const body = JSON.parse(text);
          token = body.token;
        }
      }
    } catch (e) {
      console.log("[AUTH] Error parsing request body:", e);
    }
    if (!token) {
      token = cookies.get(SESSION_COOKIE_NAME);
    }
    if (!token) {
      return json({ isValid: false, error: "No session token found" }, { status: 401 });
    }
    const { user, isValid } = await validateSession(token);
    if (isValid && user) {
      setSessionCookieWithParams(cookies, url, token);
      return json({
        isValid: true,
        user,
        token
      });
    } else {
      return json({ isValid: false, error: "Invalid session" }, { status: 401 });
    }
  } catch (error) {
    console.error("Session validation error:", error);
    return json(
      {
        isValid: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
