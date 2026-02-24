const load = async ({ locals, url }) => {
  console.log("Root layout server load function called");
  const user = locals.user;
  const isAuthenticated = locals.isAuthenticated;
  console.log(
    "User authentication state:",
    isAuthenticated ? "authenticated" : "not authenticated",
    user ? `as ${user.username}` : ""
  );
  return {
    user,
    isAuthenticated
  };
};
export {
  load
};
