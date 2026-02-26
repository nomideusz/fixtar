import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'AI_CODEMAP.json');
const CHECK_MODE = process.argv.includes('--check');

const INCLUDE_EXTENSIONS = new Set(['.svelte', '.ts', '.js']);
const IGNORE_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.git']);

function toPosixPath(value) {
	return value.split(path.sep).join('/');
}

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		if (IGNORE_DIRS.has(entry.name)) continue;
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
			continue;
		}

		if (entry.isFile() && INCLUDE_EXTENSIONS.has(path.extname(entry.name))) {
			files.push(fullPath);
		}
	}

	return files;
}

function detectArea(relativePath) {
	if (relativePath.startsWith('src/routes/admin/')) return 'admin';
	if (relativePath.startsWith('src/routes/api/')) return 'api';
	if (relativePath.startsWith('src/routes/auth/')) return 'auth';
	if (relativePath.startsWith('src/routes/checkout/')) return 'checkout';
	if (relativePath.startsWith('src/routes/products/')) return 'catalog';
	if (relativePath.startsWith('src/routes/cart/')) return 'cart';
	if (relativePath.startsWith('src/routes/account/')) return 'account';
	if (relativePath.startsWith('src/routes/')) return 'pages';
	if (relativePath.startsWith('src/lib/components/layout/')) return 'layout';
	if (relativePath.startsWith('src/lib/components/ui/')) return 'ui';
	if (relativePath.startsWith('src/lib/stores/')) return 'stores';
	if (relativePath.startsWith('src/lib/server/')) return 'server';
	if (relativePath.startsWith('src/lib/services/')) return 'services';
	if (relativePath.startsWith('src/lib/i18n/')) return 'i18n';
	return 'other';
}

function collectExports(fileContent) {
	const matches = fileContent.matchAll(/export\s+(?:const|function|class|let|var|type|interface)\s+([A-Za-z0-9_]+)/g);
	return [...new Set([...matches].map((m) => m[1]))].slice(0, 20);
}

function collectImports(fileContent) {
	const importMatches = fileContent.matchAll(/from\s+['"]([^'"]+)['"]/g);
	return [...new Set([...importMatches].map((m) => m[1]))].slice(0, 30);
}

function collectSvelteStateSignals(fileContent) {
	const signals = [];
	if (fileContent.includes('$state(')) signals.push('$state');
	if (fileContent.includes('$derived(')) signals.push('$derived');
	if (fileContent.includes('$effect(')) signals.push('$effect');
	if (fileContent.includes('$props(')) signals.push('$props');
	return signals;
}

async function buildCodeMap() {
	const files = await walk(SRC_DIR);
	const entries = [];
	const areaCount = {};

	for (const fullPath of files) {
		const relative = toPosixPath(path.relative(ROOT, fullPath));
		const content = await fs.readFile(fullPath, 'utf8');
		const area = detectArea(relative);

		areaCount[area] = (areaCount[area] || 0) + 1;

		entries.push({
			path: relative,
			area,
			route: relative.startsWith('src/routes/') ? relative.replace('src/routes', '') : null,
			exports: collectExports(content),
			imports: collectImports(content),
			svelteRunes: relative.endsWith('.svelte') ? collectSvelteStateSignals(content) : []
		});
	}

	entries.sort((a, b) => a.path.localeCompare(b.path));

	return {
		meta: {
			project: 'FixTar',
			generatedAt: new Date().toISOString(),
			sourceDir: 'src',
			entryCount: entries.length,
			areaCount
		},
		criticalFiles: [
			'src/routes/+layout.svelte',
			'src/lib/components/layout/CartDrawer.svelte',
			'src/lib/components/layout/Navbar.svelte',
			'src/lib/stores/cart.svelte.ts',
			'src/lib/stores/language.svelte.ts',
			'src/lib/i18n/translations.ts',
			'src/routes/products/[slug]/+page.server.ts'
		],
		entries
	};
}

async function main() {
	const codeMap = await buildCodeMap();

	if (CHECK_MODE) {
		let existingRaw;
		try {
			existingRaw = await fs.readFile(OUTPUT_FILE, 'utf8');
		} catch {
			console.error(`Missing ${toPosixPath(path.relative(ROOT, OUTPUT_FILE))}. Run: npm run ai:codemap`);
			process.exit(1);
		}

		let existing;
		try {
			existing = JSON.parse(existingRaw);
		} catch {
			console.error(`Invalid JSON in ${toPosixPath(path.relative(ROOT, OUTPUT_FILE))}. Re-generate with: npm run ai:codemap`);
			process.exit(1);
		}

		const normalizedGenerated = {
			...codeMap,
			meta: { ...codeMap.meta, generatedAt: '__IGNORED__' }
		};
		const normalizedExisting = {
			...existing,
			meta: { ...(existing.meta || {}), generatedAt: '__IGNORED__' }
		};

		const generatedString = JSON.stringify(normalizedGenerated);
		const existingString = JSON.stringify(normalizedExisting);

		if (generatedString !== existingString) {
			console.error('AI codemap is stale. Run: npm run ai:codemap and commit docs/AI_CODEMAP.json');
			process.exit(1);
		}

		console.log('AI codemap is up to date.');
		return;
	}

	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(OUTPUT_FILE, JSON.stringify(codeMap, null, 2));
	console.log(`Generated ${toPosixPath(path.relative(ROOT, OUTPUT_FILE))} with ${codeMap.meta.entryCount} entries.`);
}

main().catch((error) => {
	console.error('Failed to generate AI codemap:', error);
	process.exit(1);
});
