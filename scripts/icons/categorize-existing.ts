#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to categorize existing icons from icons.css to category-specific files
 *
 * Usage:
 *   npx tsx scripts/icons/categorize-existing.ts
 */

interface CategoryMap {
	[key: string]: string[];
}

// Define icon categories and their associated icons
const categories: CategoryMap = {
	arrows: [
		'arrow-right',
		'arrow-up',
		'arrow-down',
		'arrow-left',
		'chevron-up',
		'chevron-down',
		'chevron-right',
		'chevron-left'
	],
	social: ['linkedin', 'twitter', 'instagram', 'facebook'],
	ui: [
		'search',
		'menu',
		'settings',
		'plus',
		'minus',
		'check',
		'close',
		'notification',
		'refresh',
		'check-circle',
		'mail',
		'cart'
	],
	devices: ['mobile', 'tablet', 'desktop', 'phone'],
	cyberpunk: [
		'circuit-board',
		'chip',
		'cyber-eye',
		'matrix',
		'data-flow',
		'glitch',
		'neural',
		'virtual-reality-fill',
		'virus-fill',
		'vector-three-fill'
	],
	general: [
		// Default category for icons not matched elsewhere
	]
};

// Create the categories directory
const categoryDir = path.resolve(process.cwd(), 'src/lib/styles/icons/categories');
if (!fs.existsSync(categoryDir)) {
	fs.mkdirSync(categoryDir, { recursive: true });
}

// Read the existing icons.css file
const iconsCssPath = path.resolve(process.cwd(), 'src/lib/styles/icons/icons.css');
const iconsCss = fs.readFileSync(iconsCssPath, 'utf8');

// Split into icon blocks
const iconBlocks = iconsCss.split(/\/\* Ikona /);

// Initialize category CSS content
const categoryCss: Record<string, string> = {};
Object.keys(categories).forEach((category) => {
	categoryCss[category] = `/* Icons in category: ${category} */\n\n`;
});

// Process each icon block
for (let i = 1; i < iconBlocks.length; i++) {
	const block = iconBlocks[i];

	// Extract icon name
	const nameMatch = block.match(/^([^*]+)/);
	if (!nameMatch) continue;

	const name = nameMatch[1]
		.trim()
		.toLowerCase()
		.replace(/\s+\(.+\)$/, '');
	const cssBlock = `/* Ikona ${nameMatch[1]} */\n${block}`;

	// Find the appropriate category
	let assigned = false;
	for (const [category, icons] of Object.entries(categories)) {
		if (icons.includes(name)) {
			categoryCss[category] += cssBlock;
			assigned = true;
			break;
		}
	}

	// If not assigned to a specific category, add to general
	if (!assigned) {
		categoryCss['general'] += cssBlock;
	}
}

// Write category CSS files
for (const [category, css] of Object.entries(categoryCss)) {
	const categoryFilePath = path.resolve(categoryDir, `${category}.css`);
	fs.writeFileSync(categoryFilePath, css);
	console.log(`Created ${category}.css with category-specific icons`);
}

// Now create a backup of the original icons.css file
const backupPath = path.resolve(process.cwd(), 'src/lib/styles/icons/icons.css.backup');
fs.copyFileSync(iconsCssPath, backupPath);
console.log(`Created backup of original icons.css at ${backupPath}`);

console.log('Categorization complete. Use src/lib/styles/icons/index.css as the main import file.');
