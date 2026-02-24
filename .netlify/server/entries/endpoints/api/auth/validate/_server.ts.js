import { json } from "@sveltejs/kit";
import { v as validateSession, s as setSessionCookieWithParams } from "../../../../../chunks/auth.js";
const POST = async ({ request, cookies, url }) => {
  try {
    const body = await request.json();
    const { token } = body;
    if (!token) {
      console.log("[API] Token validation: No token provided");
      return json({ isValid: false, error: "No token provided" }, { status: 400 });
    }
    console.log("[API] Validating token for session recovery");
    const result = await validateSession(token);
    if (result.isValid && result.user) {
      console.log("[API] Token is valid for user:", result.user.username);
      setSessionCookieWithParams(cookies, url, token);
      return json({
        isValid: true,
        user: result.user
      });
    } else {
      console.log("[API] Token validation failed: Invalid token");
      return json({ isValid: false, error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("[API] Token validation error:", error);
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
