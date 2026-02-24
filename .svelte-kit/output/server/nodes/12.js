import * as server from '../entries/pages/account/orders/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/orders/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/orders/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.DFLm33nk.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/B9QY4uHP.js"];
export const stylesheets = [];
export const fonts = [];
