import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.wT-CNdOw.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js"];
export const stylesheets = [];
export const fonts = [];
