import * as server from '../entries/pages/products/_slug_/_page.server.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/products/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/products/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/31.DZYFaR1s.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/pmetS_eo.js"];
export const stylesheets = [];
export const fonts = [];
