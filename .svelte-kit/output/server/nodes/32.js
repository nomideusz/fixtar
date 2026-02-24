import * as server from '../entries/pages/search/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/search/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/search/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.BMw3O_fp.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/pmetS_eo.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/DHlvweli.js","_app/immutable/chunks/CtjSKAnx.js","_app/immutable/chunks/B9QY4uHP.js"];
export const stylesheets = ["_app/immutable/assets/LoadingSpinner.BlQQEQv2.css"];
export const fonts = [];
