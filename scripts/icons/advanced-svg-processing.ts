#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'node:util';

/**
 * Helper script for advanced SVG processing
 * This script can handle more complex SVGs with multiple elements
 * 
 * Usage:
 *   npx tsx scripts/icons/advanced-svg-processing.ts --file=path/to/svg/file.svg [--output=output-file.svg]
 */

interface ProcessingOptions {
  file: string;
  output?: string;
  optimize?: boolean;
  preserveElements?: boolean;
}

// Parse command line arguments
function parseCliArgs(): ProcessingOptions {
  const { values } = parseArgs({
    options: {
      file: { type: 'string' },
      output: { type: 'string' },
      optimize: { type: 'boolean', default: true },
      preserveElements: { type: 'boolean', default: true }
    },
    allowPositionals: false,
  });

  // Check required arguments
  if (!values.file) {
    console.error('Usage: npx tsx scripts/icons/advanced-svg-processing.ts --file=path/to/svg/file.svg [--output=output-file.svg]');
    process.exit(1);
  }

  return {
    file: values.file,
    output: values.output,
    optimize: values.optimize,
    preserveElements: values.preserveElements
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
  elements: string[];
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
  
  // Regular expression to match SVG elements - expanded to match more element types
  // This will match: path, circle, rect, line, polygon, polyline, ellipse
  const elementRegex = /<(path|circle|rect|line|polygon|polyline|ellipse)[^>]*\/?>(?:<\/\1>)?/gi;
  const elementMatches = [...contentBetweenSvgTags.matchAll(elementRegex)];
  
  if (elementMatches.length === 0) {
    console.warn('No SVG elements found. The icon may not render correctly.');
  }
  
  // Extract all SVG elements
  const elements = elementMatches.map(match => match[0]);
  
  return {
    elements,
    viewBox
  };
}

// Convert SVG elements to a format suitable for CSS masks
function processElementForCssMask(element: string): string {
  // Add necessary attributes for proper display
  if (element.includes('fill="none"') && !element.includes('stroke=')) {
    element = element.replace(/fill="none"/, 'fill="none" stroke="currentColor"');
  }
  
  // Ensure stroke and fill attributes use currentColor if not specified
  if (!element.includes('stroke=') && !element.includes('fill=')) {
    element = element.replace(/(<[^>]*)(\/>|>)/, '$1 stroke="currentColor"$2');
  }
  
  return element;
}

// Process SVG from raw to a format suitable for CSS mask
function processSvgForCssMask(svgContent: string, preserveElements: boolean): string {
  // Clean up SVG
  const cleaned = cleanSvg(svgContent);
  
  // Extract SVG elements
  const { elements, viewBox } = extractSvgElements(cleaned);
  
  // Process each element
  const processedElements = elements.map(element => processElementForCssMask(element));
  
  // Create new SVG with processed elements
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${processedElements.join('')}</svg>`;
}

// Main function
async function main() {
  try {
    const options = parseCliArgs();
    const { file, output, optimize = true, preserveElements = true } = options;
    
    // Check if file exists
    if (!fs.existsSync(file)) {
      console.error(`SVG file not found: ${file}`);
      process.exit(1);
    }
    
    // Read SVG file
    const svgContent = fs.readFileSync(file, 'utf8');
    
    let processed = svgContent;
    if (optimize) {
      console.log('Optimizing SVG...');
      processed = processSvgForCssMask(svgContent, preserveElements);
    }
    
    if (output) {
      // Write processed SVG to output file
      fs.writeFileSync(output, processed);
      console.log(`✅ Processed SVG saved to ${output}`);
    } else {
      // Print to stdout
      console.log(processed);
    }
    
    // Create URL-encoded version for CSS
    const encodedForCss = encodeURIComponent(processed);
    console.log('\nEncoded SVG for CSS:');
    console.log(`data:image/svg+xml,${encodedForCss}`);
    
    console.log(`\nTo use with add-icon.ts, first save the processed SVG to a file, then run:`);
    console.log(`npx tsx scripts/icons/add-icon.ts --name=icon-name --file=${output || 'processed.svg'}`);
    
  } catch (error) {
    console.error('Error processing SVG:', error);
    process.exit(1);
  }
}

// Run the script
main(); 