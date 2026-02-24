import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { 'no-undef': 'off' }
	},
	{
		files: ['**/*.ts'],
		ignores: ['eslint.config.js', 'svelte.config.js'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unused-vars': 'warn' // Still warn, but don't block
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Allow any type usage (can be added back when better typed)
			'@typescript-eslint/no-explicit-any': 'off',
			// Allow empty object type (common pattern in Svelte)
			'@typescript-eslint/no-empty-object-type': 'off',
			// Allow unused variables (warn instead of error for development)
			'@typescript-eslint/no-unused-vars': 'warn',
			// Navigation without resolve - too strict for this codebase
			'svelte/no-navigation-without-resolve': 'off',
			// Unused props can be intentional for API extensibility
			'svelte/no-unused-props': 'warn',
			// Prefer svelte reactivity - warn instead of error
			'svelte/prefer-svelte-reactivity': 'warn',
			// No useless mustaches - minor formatting issue
			'svelte/no-useless-mustaches': 'warn'
		}
	}
);
