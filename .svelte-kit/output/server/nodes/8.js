import * as server from '../entries/pages/account/addresses/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/addresses/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/addresses/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.CYHLEsET.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/BCUCx8Q8.js"];
export const stylesheets = [];
export const fonts = [];
