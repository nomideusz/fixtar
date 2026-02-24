import * as server from '../entries/pages/account/favorites/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/favorites/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/favorites/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.CY_2aFIO.js","_app/immutable/chunks/euVeJPvK.js"];
export const stylesheets = ["_app/immutable/assets/11.Dze4YOjn.css"];
export const fonts = [];
