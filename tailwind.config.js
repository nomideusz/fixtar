/**
 * Tailwind CSS v4 — CSS-first configuration
 *
 * All design tokens (colors, fonts, radius, etc.) are defined in src/app.css
 * using the @theme block. This file only sets content paths.
 *
 * See DESIGN_SYSTEM.md for the full token reference.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/app.html'],
	theme: {
		extend: {}
	},
	plugins: []
};
