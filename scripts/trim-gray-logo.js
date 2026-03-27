import sharp from 'sharp';
import path from 'path';

const logoDir = path.join('src', 'lib', 'images', 'logo');

async function trimAndConvertLogo(inputFile, outputFile) {
  try {
    const inputPath = path.join(logoDir, inputFile);
    const outputPath = path.join(logoDir, outputFile);
    
    console.log(`Processing ${inputFile} -> ${outputFile}...`);
    
    await sharp(inputPath)
      .trim() // Removes transparent pixels from all edges
      .webp({ quality: 85 })
      .toFile(outputPath);
      
    console.log(`✅ Saved to ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error processing ${inputFile}:`, error);
  }
}

async function main() {
  // Trim and convert full gray logo
  await trimAndConvertLogo('fixtar-logo-gray.png', 'fixtar-logo-gray-trimmed.webp');
  
  // Trim and convert gray icon
  await trimAndConvertLogo('fixtar-icon-gray.png', 'fixtar-icon-gray-trimmed.webp');
  
  console.log('\nDone!');
}

main();
