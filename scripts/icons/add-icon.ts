#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'node:util';

/**
 * Script to add SVG icons to the CSS-based icon system
 * 
 * Usage:
 *   npx tsx scripts/icons/add-icon.ts --name=icon-name --file=path/to/svg/file.svg [--category=category-name]
 * 
 * Example:
 *   npx tsx scripts/icons/add-icon.ts --name=calendar --file=./icons/SVGs/calendar.svg --category=general
 */

interface IconOptions {
  name: string;
  file: string;
  category?: string; // Optional category
  useAdvancedProcessing?: boolean; // Use advanced SVG processing
}

// Parse command line arguments
function parseCliArgs(): IconOptions {
  const { values } = parseArgs({
    options: {
      name: { type: 'string' },
      file: { type: 'string' },
      category: { type: 'string', default: 'general' },
      useAdvancedProcessing: { type: 'boolean', default: true }
    },
    allowPositionals: false,
  });

  // Check required arguments
  if (!values.name || !values.file) {
    console.error('Usage: npx tsx scripts/icons/add-icon.ts --name=icon-name --file=path/to/svg/file.svg [--category=category-name]');
    process.exit(1);
  }

  return {
    name: values.name,
    file: values.file,
    category: values.category,
    useAdvancedProcessing: values.useAdvancedProcessing
  };
}

// Clean SVG content
function cleanSvg(svgContent: string): string {
  let cleaned = svgContent;
  
  // Remove XML declaration
  cleaned = cleaned.replace(/<\?xml[^>]*\?>/, '');
  
  // Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove doctype
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/i, '');
  
  // Remove unnecessary whitespace
  cleaned = cleaned.replace(/>\s+</g, '><');
  
  // Remove empty attributes
  cleaned = cleaned.replace(/\s+(\w+)=""/g, '');
  
  // Remove empty elements
  cleaned = cleaned.replace(/<(\w+)(\s+[^>]*)?>\s*<\/\1>/g, '');
  
  // Remove rect with fill="none" and without other attributes
  cleaned = cleaned.replace(/<rect[^>]*width="256"[^>]*height="256"[^>]*fill="none"[^>]*\/>/g, '');
  
  return cleaned.trim();
}

// Extract SVG elements (paths, circles, rects, etc.)
function extractSvgElements(svgContent: string): {
  svgElement: string;
  viewBox: string;
} {
  // Extract the viewBox
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  
  // Remove the opening and closing svg tags to work with the content
  const contentBetweenSvgTags = svgContent
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();
  
  return {
    svgElement: contentBetweenSvgTags,
    viewBox
  };
}

// Process SVG to extract content and viewBox
function processSvg(svgContent: string): {
  svgElement: string;
  viewBox: string;
} {
  // Clean the SVG first
  const cleaned = cleanSvg(svgContent);
  
  // Extract SVG elements and viewBox
  return extractSvgElements(cleaned);
}

// Create CSS for the new icon
function createIconCss(name: string, svgElement: string, viewBox: string): string {
  // Create a complete SVG with the element and viewBox
  const completeSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${svgElement}</svg>`;
  
  // Encode SVG for CSS
  const encodedSvg = encodeURIComponent(completeSvg);
  
  return `
/* Ikona ${name} */
.icon-${name}::before {
\tcontent: '';
\tdisplay: block;
\twidth: 1em;
\theight: 1em;
\tbackground: currentColor;
\t-webkit-mask: url("data:image/svg+xml,${encodedSvg}")
\t\tno-repeat 50% 50%;
\tmask: url("data:image/svg+xml,${encodedSvg}")
\t\tno-repeat 50% 50%;
\t-webkit-mask-size: cover;
\tmask-size: cover;
}
`;
}

// Add the icon to icons.css file
function addIconToCss(iconCss: string): void {
  const iconsCssPath = path.resolve(process.cwd(), 'src/lib/styles/icons/icons.css');
  
  if (!fs.existsSync(iconsCssPath)) {
    console.error(`Icons CSS file not found at ${iconsCssPath}`);
    process.exit(1);
  }
  
  fs.appendFileSync(iconsCssPath, iconCss);
  console.log('✅ Added icon CSS to icons.css');
}

// Update the index.ts file to include the new icon
function updateIconIndex(name: string, category: string): void {
  const indexPath = path.resolve(process.cwd(), 'src/lib/icons/index.ts');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`Icons index file not found at ${indexPath}`);
    process.exit(1);
  }
  
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Find the category array
  const categoryRegex = new RegExp(`(export const iconCategories = \\{[\\s\\S]*?${category}: \\[[\\s\\S]*?)\\]`, 'm');
  const categoryMatch = indexContent.match(categoryRegex);
  
  if (!categoryMatch) {
    console.error(`Category '${category}' not found in index.ts`);
    console.log('Available categories:');
    const categoriesMatch = indexContent.match(/export const iconCategories = \{([^}]+)\}/s);
    if (categoriesMatch) {
      console.log(categoriesMatch[1].replace(/\s+/g, ' ').trim());
    }
    process.exit(1);
  }
  
  // Check if icon already exists in the category
  const iconRegex = new RegExp(`'${name}'`, 'g');
  if (categoryMatch[1].match(iconRegex)) {
    console.log(`⚠️ Icon '${name}' already exists in the '${category}' category`);
  } else {
    // Add the icon to the category
    const updatedCategoryContent = indexContent.replace(
      categoryRegex,
      `$1,\n\t\t'${name}']\n`
    );
    
    fs.writeFileSync(indexPath, updatedCategoryContent);
    console.log(`✅ Added icon '${name}' to '${category}' category in index.ts`);
  }
}

// Process an SVG file using the advanced-svg-processing script
function useAdvancedProcessing(filePath: string): string {
  // Create a temporary file path
  const tempFilePath = `${filePath}.temp.svg`;
  
  try {
    // Import the child_process module
    const { execSync } = require('child_process');
    
    // Run the advanced processing script
    execSync(`npx tsx scripts/icons/advanced-svg-processing.ts --file="${filePath}" --output="${tempFilePath}"`, {
      stdio: ['ignore', 'ignore', process.stderr]
    });
    
    // Read the processed file
    const processedSvg = fs.readFileSync(tempFilePath, 'utf8');
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    return processedSvg;
  } catch (error) {
    console.error('Error using advanced processing:', error);
    // If advanced processing fails, return the original file content
    return fs.readFileSync(filePath, 'utf8');
  }
}

// Main function
async function main() {
  try {
    const options = parseCliArgs();
    const { name, file, category = 'general', useAdvancedProcessing: useAdvProc = true } = options;
    
    // Check if file exists
    if (!fs.existsSync(file)) {
      console.error(`SVG file not found: ${file}`);
      process.exit(1);
    }
    
    // Read and process the SVG file
    let svgContent: string;
    
    if (useAdvProc) {
      // Use advanced processing for complex SVGs
      svgContent = useAdvancedProcessing(file);
    } else {
      // Use simple processing
      svgContent = fs.readFileSync(file, 'utf8');
    }
    
    // Process the SVG content
    const { svgElement, viewBox } = processSvg(svgContent);
    
    // Create CSS for the icon
    const iconCss = createIconCss(name, svgElement, viewBox);
    
    // Add to CSS file
    addIconToCss(iconCss);
    
    // Update index.ts
    updateIconIndex(name, category);
    
    console.log(`✅ Successfully added icon '${name}' to the '${category}' category!`);
  } catch (error) {
    console.error('Error adding icon:', error);
    process.exit(1);
  }
}

// Run the script
main(); 