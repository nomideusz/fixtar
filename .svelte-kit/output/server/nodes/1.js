

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.LTnQg8wc.js","_app/immutable/chunks/euVeJPvK.js"];
export const stylesheets = ["_app/immutable/assets/1.Tta5jf6f.css"];
export const fonts = [];
