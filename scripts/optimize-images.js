import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DIRS = [
  'src/lib/images/banners',
  'src/lib/images/products/power-tools'
];

async function optimizeImages() {
  for (const dir of DIRS) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const fullPath = path.join(dir, file);
        let newName = file.replace(/\.png$/, '.webp');
        
        // Fix naming for banners
        if (dir.includes('banners') && newName.startsWith('hero-')) {
          newName = newName.replace('hero-', 'banner-');
        }

        const newFullPath = path.join(dir, newName);
        console.log(`Processing: ${file} -> ${newName}`);

        try {
          await sharp(fullPath)
            .resize({ width: 1200, withoutEnlargement: true }) // ensure max width is sensible
            .webp({ quality: 80 })
            .toFile(newFullPath);
          
          // Delete old png
          await fs.unlink(fullPath);
          console.log(`✅ Converted and deleted original ${file}`);
        } catch (e) {
          console.error(`❌ Error processing ${file}:`, e);
        }
      }
    }
  }
}

optimizeImages().then(() => console.log('Done!'));
