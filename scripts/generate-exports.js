import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Function to get all JavaScript files in the dist directory (excluding index.js)
function getJsFiles() {
	return fs
		.readdirSync(distDir)
		.filter(
			(file) =>
				file.endsWith('.js') &&
				file !== 'index.js' &&
				!file.includes('.test.') &&
				!file.includes('.spec.')
		);
}

// Function to get all TypeScript declaration files in the dist directory (excluding index.d.ts)
function getDtsFiles() {
	return fs
		.readdirSync(distDir)
		.filter(
			(file) =>
				file.endsWith('.d.ts') &&
				file !== 'index.d.ts' &&
				!file.includes('.test.') &&
				!file.includes('.spec.')
		);
}

// Create index.js export file
function createIndexJs() {
	const jsFiles = getJsFiles();

	// Create export statements
	const exports = jsFiles.map((file) => {
		const moduleName = path.basename(file, '.js');
		return `export * from './${moduleName}.js';`;
	});

	// Create the file content
	const content = `// Re-export all modules\n${exports.join('\n')}\n`;

	// Write the file
	const indexPath = path.join(distDir, 'index.js');
	fs.writeFileSync(indexPath, content, 'utf8');
	console.log(`Created ${indexPath}`);
}

// Create index.d.ts export file
function createIndexDts() {
	const dtsFiles = getDtsFiles();

	// Create export statements
	const exports = dtsFiles.map((file) => {
		const moduleName = path.basename(file, '.d.ts');
		return `export * from './${moduleName}';`;
	});

	// Create the file content
	const content = `// Re-export all type definitions\n${exports.join('\n')}\n`;

	// Write the file
	const indexPath = path.join(distDir, 'index.d.ts');
	fs.writeFileSync(indexPath, content, 'utf8');
	console.log(`Created ${indexPath}`);
}

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true });
	console.log(`Created dist directory: ${distDir}`);
}

// Generate the export files
createIndexJs();
createIndexDts();

console.log('Export files generation completed successfully.');
