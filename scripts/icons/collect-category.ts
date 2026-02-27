#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to collect icons matching specific patterns from style-based categories
 * into a category-specific CSS file
 *
 * Usage:
 *   npx tsx scripts/icons/collect-category.ts --category=<category> --patterns=<pattern1,pattern2>
 *
 * Example:
 *   npx tsx scripts/icons/collect-category.ts --category=devices --patterns=phone,mobile,tablet,computer,laptop
 */

// Parse command line args
const args = process.argv.slice(2);
let targetCategory = 'arrows';
let patterns: string[] = ['arrow', 'chevron'];

for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	if (arg.startsWith('--category=')) {
		targetCategory = arg.split('=')[1];
	} else if (arg.startsWith('--patterns=')) {
		patterns = arg.split('=')[1].split(',');
	}
}

// Style categories to collect from
const styleCategories = ['bold', 'duotone', 'fill', 'light', 'regular', 'thin'];

// Create the categories directory
const categoryDir = path.resolve(process.cwd(), 'src/lib/styles/icons/categories');
if (!fs.existsSync(categoryDir)) {
	fs.mkdirSync(categoryDir, { recursive: true });
}

// Initialize category CSS content
let categoryCss = `/* Icons in category: ${targetCategory} */\n\n`;
let iconCount = 0;

// Process each style category
for (const style of styleCategories) {
	const styleCssPath = path.resolve(categoryDir, `${style}.css`);

	// Skip if file doesn't exist
	if (!fs.existsSync(styleCssPath)) {
		console.log(`Style category ${style}.css doesn't exist, skipping...`);
		continue;
	}

	console.log(`Processing ${style}.css for ${targetCategory} icons...`);
	const styleCss = fs.readFileSync(styleCssPath, 'utf8');

	// Split into icon blocks
	const iconBlocks = styleCss.split(/\/\* Ikona /);

	// Process each icon block
	for (let i = 1; i < iconBlocks.length; i++) {
		const block = iconBlocks[i];

		// Extract icon name
		const nameMatch = block.match(/^([^*]+)/);
		if (!nameMatch) continue;

		const name = nameMatch[1].trim().toLowerCase();

		// Check if it matches any of the target patterns
		if (patterns.some((pattern) => name.includes(pattern))) {
			const cssBlock = `/* Ikona ${nameMatch[1]} */\n${block}`;
			categoryCss += cssBlock;
			iconCount++;
			console.log(`Added ${name} to ${targetCategory}.css`);
		}
	}
}

// Write category CSS file
const categoryFilePath = path.resolve(categoryDir, `${targetCategory}.css`);
fs.writeFileSync(categoryFilePath, categoryCss);
console.log(`\nCollected ${iconCount} icons into ${targetCategory}.css`);
