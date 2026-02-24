import * as universal from '../entries/pages/wishlist/_page.ts.js';

export const index = 33;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/wishlist/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/wishlist/+page.ts";
export const imports = ["_app/immutable/nodes/33.CT-r-8Tr.js","_app/immutable/chunks/euVeJPvK.js"];
export const stylesheets = [];
export const fonts = [];
