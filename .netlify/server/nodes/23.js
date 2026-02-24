import * as server from '../entries/pages/categories/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/categories/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/categories/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.CYgSjY8a.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/DHlvweli.js"];
export const stylesheets = ["_app/immutable/assets/23.BrLSfVUV.css"];
export const fonts = [];
