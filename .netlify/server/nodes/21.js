import * as server from '../entries/pages/auth/register/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.XxylnldQ.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/DHlvweli.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/CskxXjNh.js"];
export const stylesheets = ["_app/immutable/assets/21.Cu5mKoHl.css"];
export const fonts = [];
