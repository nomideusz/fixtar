import * as server from '../entries/pages/account/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.BV2SoM3j.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/BCY0rcL3.js"];
export const stylesheets = ["_app/immutable/assets/2.Cf8_rDCd.css"];
export const fonts = [];
