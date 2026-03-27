import sharp from 'sharp';
import path from 'path';

const logoPath = path.join('src', 'lib', 'images', 'logo', 'fixtar-logo-black.png');
const outputPath = path.join('src', 'lib', 'images', 'logo', 'fixtar-logo-black-trimmed.png');

async function trimLogo() {
  try {
    console.log(`Trimming ${logoPath}...`);
    await sharp(logoPath)
      .trim() // Removes transparent pixels from all edges
      .toFile(outputPath);
    console.log(`✅ Saved trimmed logo to ${outputPath}`);
  } catch (error) {
    console.error('Error trimming logo:', error);
  }
}

trimLogo();
