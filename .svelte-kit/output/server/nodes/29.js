import * as server from '../entries/pages/orders/_id_/_page.server.ts.js';

export const index = 29;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/orders/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/orders/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/29.Dnbw3HFS.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js"];
export const stylesheets = [];
export const fonts = [];
