const reroute = (request) => new URL(request.url).pathname;
const nonCachedUrl = (url) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
};
const clearBrowserState = () => {
  try {
    localStorage.removeItem("user_data");
    sessionStorage.removeItem("user_data");
    localStorage.removeItem("pocketbase_auth");
    sessionStorage.removeItem("pocketbase_auth");
    document.cookie = "pb-auth_exists=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Browser state cleared successfully");
  } catch (error) {
    console.error("Error clearing browser state:", error);
  }
};
const hasSessionClient = () => {
  if (typeof document === "undefined") return false;
  try {
    const userData = localStorage.getItem("user_data");
    if (userData && userData !== "null") return true;
    return document.cookie.split(";").some((c) => c.trim().startsWith("pb-auth_exists="));
  } catch (e) {
    return false;
  }
};
const transport = {};
export {
  clearBrowserState,
  hasSessionClient,
  nonCachedUrl,
  reroute,
  transport
};
