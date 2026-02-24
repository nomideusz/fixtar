#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'node:util';

/**
 * Script to categorize icons from style-based CSS files into category-specific files
 * 
 * Usage: 
 *   npx tsx scripts/icons/categorize-icons.ts --style=bold --category=arrows
 *   npx tsx scripts/icons/categorize-icons.ts --style=all --category=all
 *   npx tsx scripts/icons/categorize-icons.ts --style=regular --category=devices
 */

interface Options {
  style: string;
  category: string;
}

// Parse command line arguments
function parseCliArgs(): Options {
  const { values } = parseArgs({
    options: {
      style: { type: 'string', default: 'all' },
      category: { type: 'string', default: 'all' },
    },
    allowPositionals: false,
  });

  // Available style options
  const availableStyles = ['bold', 'regular', 'light', 'thin', 'fill', 'duotone', 'all'];
  
  // Validate style
  if (!availableStyles.includes(values.style)) {
    console.error(`Invalid style: ${values.style}. Available styles: ${availableStyles.join(', ')}`);
    process.exit(1);
  }

  return {
    style: values.style,
    category: values.category,
  };
}

// Category patterns mapping
const categoryPatterns = {
  'arrows': ['arrow', 'chevron'],
  'devices': ['mobile', 'tablet', 'desktop', 'phone', 'computer', 'laptop'],
  'social': ['linkedin', 'twitter', 'instagram', 'facebook', 'social'],
  'ui': ['search', 'menu', 'settings', 'plus', 'minus', 'check', 'close', 'notification', 'refresh', 'mail', 'cart'],
  'cyberpunk': ['circuit-board', 'chip', 'cyber-eye', 'matrix', 'data-flow', 'glitch', 'neural', 'virtual-reality', 'virus', 'vector'],
  'general': ['user', 'home', 'heart', 'flag', 'star', 'clock', 'calendar', 'box', 'zap', 'shield', 'sun', 'moon', 'map-pin', 'users', 'image', 'house', 'game']
};

// Process a single style-category combination
function processStyleCategory(style: string, category: string): number {
  console.log(`\nProcessing ${style} style for ${category} category...`);
  
  // Get the patterns for the category
  const patterns = categoryPatterns[category];
  if (!patterns) {
    console.error(`Category not recognized: ${category}`);
    console.log(`Available categories: ${Object.keys(categoryPatterns).join(', ')}`);
    return 0;
  }
  
  // Create the categories directory
  const categoryDir = path.resolve(process.cwd(), 'src/lib/styles/icons/categories');
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // Initialize CSS content
  let categoryCss = `/* Icons in category: ${category}-${style} */\n\n`;
  let iconCount = 0;
  
  // Get raw style CSS file
  const styleCssPath = path.resolve(categoryDir, `${style}.css`);
  
  if (!fs.existsSync(styleCssPath)) {
    console.error(`Style category ${style}.css doesn't exist!`);
    return 0;
  }
  
  console.log(`Reading ${style}.css for ${category} icons with patterns: ${patterns.join(', ')}...`);
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
    
    // Check if it matches any of our patterns WITHOUT containing other style names
    const isTargetIcon = patterns.some(pattern => name.includes(pattern));
    const hasOtherStyle = ['thin', 'regular', 'light', 'fill', 'duotone', 'bold']
      .filter(s => s !== style)
      .some(s => name.includes(s));
    
    if (isTargetIcon && !hasOtherStyle) {
      const cssBlock = `/* Ikona ${nameMatch[1]} */\n${block}`;
      categoryCss += cssBlock;
      iconCount++;
      console.log(`Added ${name} to ${category}-${style}.css`);
    }
  }
  
  // Write category CSS file if we found icons
  if (iconCount > 0) {
    const categoryFilePath = path.resolve(categoryDir, `${category}-${style}.css`);
    fs.writeFileSync(categoryFilePath, categoryCss);
    console.log(`\nCollected ${iconCount} ${style} ${category} icons into ${category}-${style}.css`);
  } else {
    console.log(`No ${category} icons found in ${style}.css`);
  }
  
  return iconCount;
}

// Main function
async function main() {
  try {
    const options = parseCliArgs();
    const { style, category } = options;
    
    const allStyles = ['bold', 'regular', 'light', 'thin', 'fill', 'duotone'];
    const allCategories = Object.keys(categoryPatterns);
    
    let totalIcons = 0;
    
    // Process all combinations or just specified ones
    if (style === 'all' && category === 'all') {
      console.log('Processing all styles for all categories...');
      
      for (const s of allStyles) {
        for (const c of allCategories) {
          totalIcons += processStyleCategory(s, c);
        }
      }
    } else if (style === 'all') {
      console.log(`Processing all styles for ${category} category...`);
      
      for (const s of allStyles) {
        totalIcons += processStyleCategory(s, category);
      }
    } else if (category === 'all') {
      console.log(`Processing ${style} style for all categories...`);
      
      for (const c of allCategories) {
        totalIcons += processStyleCategory(style, c);
      }
    } else {
      totalIcons = processStyleCategory(style, category);
    }
    
    console.log(`\nTotal: Categorized ${totalIcons} icons`);
  } catch (error) {
    console.error('Error in icon categorization:', error);
    process.exit(1);
  }
}

// Run the script
main(); 