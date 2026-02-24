#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'node:util';

/**
 * Script to batch process multiple SVG icons and add them to the CSS-based icon system
 * 
 * Usage:
 *   npx tsx scripts/icons/batch-process.ts --directory=path/to/svg/directory [--category=category-name] [--filenamePrefix=prefix-] [--skipIndexUpdate]
 * 
 * Example:
 *   npx tsx scripts/icons/batch-process.ts --directory=./icons/fill-icons --category=fill
 */

interface BatchOptions {
  directory: string;
  category?: string;
  filenamePrefix?: string; // Optional prefix to strip from filenames
  useAdvancedProcessing?: boolean; // Use advanced SVG processing
  skipIndexUpdate?: boolean; // Skip updating index.ts
}

// Parse command line arguments
function parseCliArgs(): BatchOptions {
  const { values } = parseArgs({
    options: {
      directory: { type: 'string' },
      category: { type: 'string', default: 'general' },
      filenamePrefix: { type: 'string', default: '' },
      useAdvancedProcessing: { type: 'boolean', default: true },
      skipIndexUpdate: { type: 'boolean', default: false }, // Add option to skip index update
    },
    allowPositionals: false,
  });

  // Check required arguments
  if (!values.directory) {
    console.error('Usage: npx tsx scripts/icons/batch-process.ts --directory=path/to/svg/directory [--category=category-name] [--filenamePrefix=prefix-] [--skipIndexUpdate]');
    process.exit(1);
  }

  return {
    directory: values.directory,
    category: values.category,
    filenamePrefix: values.filenamePrefix,
    useAdvancedProcessing: values.useAdvancedProcessing,
    skipIndexUpdate: values.skipIndexUpdate,
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

// Extract SVG elements and viewBox
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

// Add the icon to category-specific CSS file
function addIconToCss(iconCss: string, category: string): void {
  // Create category-specific CSS file path
  const categoryDir = path.resolve(process.cwd(), 'src/lib/styles/icons/categories');
  const iconsCssPath = path.resolve(categoryDir, `${category}.css`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // Create file with header if it doesn't exist
  if (!fs.existsSync(iconsCssPath)) {
    fs.writeFileSync(iconsCssPath, `/* Icons in category: ${category} */\n\n`);
  }
  
  // Append the icon CSS
  fs.appendFileSync(iconsCssPath, iconCss);
  console.log(`✅ Added icon CSS to ${category}.css`);
}

// Update the index.ts file to include the new icon
function updateIconIndex(name: string, category: string): boolean {
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
    const categoriesMatch = indexContent.match(/export const iconCategories = \{([\s\S]+?)\}/);
    if (categoriesMatch) {
      console.log(categoriesMatch[1].replace(/\s+/g, ' ').trim());
    }
    process.exit(1);
  }
  
  // Check if icon already exists in the category
  const iconRegex = new RegExp(`'${name}'`, 'g');
  if (categoryMatch[1].match(iconRegex)) {
    console.log(`⚠️ Icon '${name}' already exists in the '${category}' category`);
    return false;
  } else {
    // Add the icon to the category
    const updatedCategoryContent = indexContent.replace(
      categoryRegex,
      `$1,\n\t\t'${name}']\n`
    );
    
    fs.writeFileSync(indexPath, updatedCategoryContent);
    console.log(`✅ Added icon '${name}' to '${category}' category in index.ts`);
    return true;
  }
}

// Process an SVG file using the advanced-svg-processing script
function useAdvancedProcessing(filePath: string): string {
  // Create a temporary file path
  const tempFilePath = `${filePath}.temp.svg`;
  
  try {
    // Use dynamic import for Node.js compatibility (ESM vs CommonJS)
    const childProcess = require('child_process');
    
    // Run the advanced processing script
    childProcess.execSync(`npx tsx scripts/icons/advanced-svg-processing.ts --file="${filePath}" --output="${tempFilePath}"`, {
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
    const { 
      directory, 
      category = 'general', 
      filenamePrefix = '',
      useAdvancedProcessing: useAdvProc = true,
      skipIndexUpdate = false // Get the skipIndexUpdate option
    } = options;
    
    // Check if directory exists
    if (!fs.existsSync(directory)) {
      console.error(`Directory not found: ${directory}`);
      process.exit(1);
    }
    
    // Get all SVG files in the directory
    const files = fs.readdirSync(directory)
      .filter(file => file.toLowerCase().endsWith('.svg'));
    
    if (files.length === 0) {
      console.error(`No SVG files found in ${directory}`);
      process.exit(1);
    }
    
    console.log(`Found ${files.length} SVG files to process...`);
    
    // Process each file
    let successCount = 0;
    
    for (const file of files) {
      // Get the file name without extension and strip prefix if needed
      let name = path.basename(file, '.svg');
      if (filenamePrefix && name.startsWith(filenamePrefix)) {
        name = name.slice(filenamePrefix.length);
      }
      
      const filePath = path.join(directory, file);
      
      console.log(`Processing: ${filePath} as ${name}...`);
  
      try {
        // Read and process the SVG file
        let svgContent: string;
        
        if (useAdvProc) {
          // Use advanced processing for complex SVGs
          console.log(`- Optimizing SVG with advanced processing...`);
          svgContent = useAdvancedProcessing(filePath);
        } else {
          // Use simple processing
          console.log(`- Reading SVG file...`);
          svgContent = fs.readFileSync(filePath, 'utf8');
        }
        
        // Process the SVG content
        console.log(`- Extracting SVG data...`);
        const { svgElement, viewBox } = processSvg(svgContent);
        
        // Create CSS for the icon
        console.log(`- Generating encoded SVG for CSS...`);
        const iconCss = createIconCss(name, svgElement, viewBox);
        
        // Add to category-specific CSS file
        console.log(`- Adding to ${category}.css...`);
        addIconToCss(iconCss, category);
        
        // Update index.ts if not skipped
        if (!skipIndexUpdate) {
          console.log(`- Updating index.ts...`);
          const indexSuccess = updateIconIndex(name, category);
          if (indexSuccess) {
            successCount++;
          }
        } else {
          console.log(`- Skipping index.ts update as requested`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }
    
    console.log(`Batch processing complete. Processed ${successCount} icons.`);
  } catch (error) {
    console.error('Error in batch processing:', error);
    process.exit(1);
  }
}

// Run the script
main(); 