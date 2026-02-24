import * as server from '../entries/pages/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BluG0IwI.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/pmetS_eo.js","_app/immutable/chunks/BCUCx8Q8.js"];
export const stylesheets = ["_app/immutable/assets/5.CV2pYkoF.css"];
export const fonts = [];
