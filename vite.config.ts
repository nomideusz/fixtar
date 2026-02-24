import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()] as PluginOption[],
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				warn(warning);
			},
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				}
			}
		}
	}
});
