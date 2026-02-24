import * as server from '../entries/pages/products/_page.server.ts.js';

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/products/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/products/+page.server.ts";
export const imports = ["_app/immutable/nodes/30.B93WJkuS.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/pmetS_eo.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/DHlvweli.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/CtjSKAnx.js","_app/immutable/chunks/B9QY4uHP.js"];
export const stylesheets = ["_app/immutable/assets/LoadingSpinner.BlQQEQv2.css","_app/immutable/assets/30.Cb8Ygomt.css"];
export const fonts = [];
