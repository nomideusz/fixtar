

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CzY1WyqG.js","_app/immutable/chunks/euVeJPvK.js","_app/immutable/chunks/BCUCx8Q8.js"];
export const stylesheets = [];
export const fonts = [];
