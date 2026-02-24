import * as server from '../entries/pages/account/settings/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.917cVDju.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCUCx8Q8.js","_app/immutable/chunks/BCY0rcL3.js","_app/immutable/chunks/Be_B613E.js","_app/immutable/chunks/DHlvweli.js","_app/immutable/chunks/B9QY4uHP.js"];
export const stylesheets = ["_app/immutable/assets/13.CqX8iC3W.css"];
export const fonts = [];
