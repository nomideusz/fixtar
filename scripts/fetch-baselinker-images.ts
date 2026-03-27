/**
 * Fetch ALL product images from BaseLinker API, download them locally,
 * and update the database with local paths. Also generates Nano Banana
 * prompts for products with no images at all.
 *
 * Usage: npx tsx scripts/fetch-baselinker-images.ts
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';

// ── Config ─────────────────────────────────────────────────
const BL_API_URL = 'https://api.baselinker.com/connector.php';
const BL_TOKEN = process.env.BASELINKER_API_TOKEN!;
const IMG_DIR = path.resolve('static/img/products');
const GALLERY_DIR = path.resolve('static/img/products/gallery');

// ── BaseLinker API helper ──────────────────────────────────
async function blRequest<T>(method: string, params: Record<string, any> = {}): Promise<T> {
  const body = new URLSearchParams({
    token: BL_TOKEN,
    method,
    parameters: JSON.stringify(params),
  });

  const res = await fetch(BL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();
  if (data.status === 'ERROR') {
    throw new Error(`BaseLinker ${method}: ${data.error_code} - ${data.error_message}`);
  }
  return data as T;
}

// ── Download helper ────────────────────────────────────────
async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buffer);
}

// ── Slug helper ────────────────────────────────────────────
const PL_MAP: Record<string, string> = {
  ą:'a',Ą:'A',ć:'c',Ć:'C',ę:'e',Ę:'E',ł:'l',Ł:'L',ń:'n',Ń:'N',
  ó:'o',Ó:'O',ś:'s',Ś:'S',ź:'z',Ź:'Z',ż:'z',Ż:'Z',
};

function slugify(text: string): string {
  let r = '';
  for (const c of text) r += PL_MAP[c] ?? c;
  return r.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 80);
}

function getExtFromUrl(url: string): string {
  const u = new URL(url);
  const ext = path.extname(u.pathname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return ext;
  return '.jpg'; // fallback
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  // Ensure output dirs exist
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.mkdir(GALLERY_DIR, { recursive: true });

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // 1. Get inventories
  console.log('📦 Fetching inventories...');
  const invData = await blRequest<{ inventories: any[] }>('getInventories');
  const inventoryId = invData.inventories[0]?.inventory_id;
  if (!inventoryId) { console.error('No inventories found!'); return; }
  console.log(`   Using inventory: ${invData.inventories[0].name} (ID: ${inventoryId})`);

  // 2. Get all product IDs (paginated)
  console.log('📋 Fetching product list...');
  let allProductIds: number[] = [];
  let page = 1;
  while (true) {
    const list = await blRequest<{ products: Record<string, any> }>('getInventoryProductsList', {
      inventory_id: inventoryId, page,
    });
    const ids = Object.keys(list.products).map(Number);
    if (ids.length === 0) break;
    allProductIds.push(...ids);
    page++;
  }
  console.log(`   Found ${allProductIds.length} products`);

  // 3. Fetch full data in batches of 50
  console.log('🔍 Fetching full product data (images, names)...');
  const allProducts: Map<string, {
    blId: string;
    name: string;
    sku: string;
    images: Record<string, string>;
    category_id: number;
  }> = new Map();

  const batchSize = 50;
  for (let i = 0; i < allProductIds.length; i += batchSize) {
    const batch = allProductIds.slice(i, i + batchSize);
    const data = await blRequest<{ products: Record<string, any> }>('getInventoryProductsData', {
      inventory_id: inventoryId, products: batch,
    });
    for (const [pid, prod] of Object.entries(data.products)) {
      allProducts.set(pid, {
        blId: pid,
        name: prod.text_fields?.name || prod.sku || 'unknown',
        sku: prod.sku || '',
        images: prod.images || {},
        category_id: prod.category_id,
      });
    }
  }

  // 4. Get categories for naming
  const catData = await blRequest<{ categories: Array<{ category_id: number; name: string }> }>(
    'getInventoryCategories', { inventory_id: inventoryId }
  );
  const catMap = new Map<number, string>();
  for (const c of catData.categories) catMap.set(c.category_id, c.name.trim());

  // 5. Download images and build update map
  console.log('\n🖼️  Downloading images...\n');

  type ProductImageResult = {
    dbId: string;
    name: string;
    category: string;
    primaryImage: string; // local path for DB
    allLocalImages: string[];
    blImages: Record<string, string>; // original URLs
    downloaded: number;
    failed: number;
    missing: boolean;
  };

  const results: ProductImageResult[] = [];
  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const [pid, prod] of allProducts) {
    const dbId = `bl-${pid}`;
    const nameSlug = slugify(prod.name);
    const category = catMap.get(prod.category_id) || 'other';
    const imageEntries = Object.entries(prod.images);

    const result: ProductImageResult = {
      dbId,
      name: prod.name,
      category,
      primaryImage: '',
      allLocalImages: [],
      blImages: prod.images,
      downloaded: 0,
      failed: 0,
      missing: imageEntries.length === 0,
    };

    if (imageEntries.length === 0) {
      results.push(result);
      continue;
    }

    for (let idx = 0; idx < imageEntries.length; idx++) {
      const [imgKey, imgUrl] = imageEntries[idx];
      if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('http')) continue;

      const ext = getExtFromUrl(imgUrl);
      const suffix = idx === 0 ? '' : `-${idx + 1}`;
      const filename = `${nameSlug}${suffix}${ext}`;

      // Primary image goes to IMG_DIR, additional to GALLERY_DIR
      const destDir = idx === 0 ? IMG_DIR : GALLERY_DIR;
      const destPath = path.join(destDir, filename);
      const localPath = idx === 0
        ? filename
        : `gallery/${filename}`;

      // Check if already downloaded
      try {
        await fs.access(destPath);
        console.log(`  ⏭️  Skip (exists): ${filename}`);
        totalSkipped++;
        if (idx === 0) result.primaryImage = localPath;
        result.allLocalImages.push(localPath);
        result.downloaded++;
        continue;
      } catch { /* file doesn't exist, proceed */ }

      try {
        await downloadFile(imgUrl, destPath);
        console.log(`  ✅ ${filename} (${imgUrl.substring(0, 60)}...)`);
        if (idx === 0) result.primaryImage = localPath;
        result.allLocalImages.push(localPath);
        result.downloaded++;
        totalDownloaded++;
      } catch (err: any) {
        console.error(`  ❌ Failed: ${filename} — ${err.message}`);
        result.failed++;
        totalFailed++;
      }
    }

    results.push(result);
  }

  // 6. Update database with local image paths
  console.log('\n💾 Updating database with local image paths...\n');
  let dbUpdated = 0;
  for (const r of results) {
    if (!r.primaryImage) continue;

    await db.execute({
      sql: 'UPDATE products SET image = ? WHERE id = ?',
      args: [r.primaryImage, r.dbId],
    });
    dbUpdated++;
  }

  // 7. Summary
  const missing = results.filter(r => r.missing);
  const withImages = results.filter(r => !r.missing);

  console.log('\n' + '═'.repeat(60));
  console.log('📊 IMAGE SYNC SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total products:     ${results.length}`);
  console.log(`With BL images:     ${withImages.length}`);
  console.log(`Missing all images: ${missing.length}`);
  console.log(`Downloaded:         ${totalDownloaded}`);
  console.log(`Skipped (cached):   ${totalSkipped}`);
  console.log(`Failed:             ${totalFailed}`);
  console.log(`DB rows updated:    ${dbUpdated}`);

  if (missing.length > 0) {
    console.log('\n' + '─'.repeat(60));
    console.log('❌ PRODUCTS WITH NO IMAGES (need generation):');
    console.log('─'.repeat(60));
    for (const r of missing) {
      console.log(`  • [${r.category}] ${r.name} (${r.dbId})`);
    }
  }

  // 8. Generate Nano Banana prompts for missing images
  if (missing.length > 0) {
    console.log('\n' + '═'.repeat(60));
    console.log('🍌 NANO BANANA — IMAGE GENERATION PROMPTS');
    console.log('═'.repeat(60));
    console.log('\nStyle guide: Professional e-commerce product photography.');
    console.log('Background: Pure white (#ffffff). Lighting: Soft studio.');
    console.log('Angle: Front-facing, slightly elevated. No text overlays.\n');

    const prompts: Array<{ dbId: string; name: string; category: string; filename: string; prompt: string }> = [];

    for (const r of missing) {
      const filename = slugify(r.name) + '.webp';
      const prompt = generateNanaBananaPrompt(r.name, r.category);
      prompts.push({ dbId: r.dbId, name: r.name, category: r.category, filename, prompt });
      console.log(`── ${r.name} ──`);
      console.log(`   File: ${filename}`);
      console.log(`   Prompt: ${prompt}\n`);
    }

    // Write prompts to JSON for automation
    const promptsFile = path.resolve('scripts/nano-banana-prompts.json');
    await fs.writeFile(promptsFile, JSON.stringify(prompts, null, 2));
    console.log(`\n📄 Prompts saved to: ${promptsFile}`);

    // Write a batch script
    const batchFile = path.resolve('scripts/generate-missing-images.sh');
    let sh = '#!/bin/bash\n# Auto-generated Nano Banana image generation commands\n';
    sh += '# Run each prompt through Nano Banana to generate product images\n';
    sh += `# Output directory: ${IMG_DIR}\n\n`;
    sh += 'IMG_DIR="static/img/products"\n\n';
    for (const p of prompts) {
      sh += `# ${p.name} (${p.category})\n`;
      sh += `# nano-banana generate --prompt "${p.prompt.replace(/"/g, '\\"')}" --output "$IMG_DIR/${p.filename}" --width 1024 --height 1024\n\n`;
    }
    await fs.writeFile(batchFile, sh);
    await fs.chmod(batchFile, 0o755);
    console.log(`📄 Batch script saved to: ${batchFile}`);
  }

  // 9. Write full report
  const report: Record<string, any> = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      withImages: withImages.length,
      missing: missing.length,
      downloaded: totalDownloaded,
      skipped: totalSkipped,
      failed: totalFailed,
      dbUpdated,
    },
    products: results.map(r => ({
      dbId: r.dbId,
      name: r.name,
      category: r.category,
      primaryImage: r.primaryImage,
      totalImages: r.allLocalImages.length,
      gallery: r.allLocalImages,
      missing: r.missing,
    })),
  };
  const reportFile = path.resolve('scripts/image-sync-report.json');
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${reportFile}`);
}

// ── Nano Banana prompt generator ───────────────────────────
function generateNanaBananaPrompt(productName: string, category: string): string {
  const name = productName.trim();

  // Extract brand if present
  const brands = ['BAVARIA', 'MAGNUM', 'EUROTEC', 'STERLING', 'GRAPHITE', 'YATO'];
  const foundBrand = brands.find(b => name.toUpperCase().includes(b));

  // Product type mapping for better prompts
  const typeMap: Record<string, string> = {
    'KOSA SPALINOWA': 'petrol brush cutter / string trimmer with handlebar',
    'PRZEDŁUŻACZ ZWIJANY': 'retractable cable reel extension cord on orange drum',
    'WĄŻ': 'industrial layflat fire hose, coiled',
    'MIESZADŁO': 'electric paint and mortar mixer with dual paddle',
    'STRUG ELEKTRYCZNY': 'electric hand planer power tool with dust port',
    'KOMPRES': 'air compressor hose, coiled rubber',
    'BATERIA': 'lithium-ion rechargeable battery pack 18V/21V for power tools',
    'PISTOLET MALARSKI': 'electric HVLP paint spray gun with cup',
    'SPAWARKA': 'inverter welding machine IGBT MMA/ARC with digital display',
    'ZESTAW KLUCZY': 'professional mechanic tool set in blow-molded carry case, 300 pieces, sockets wrenches bits',
    'ZESTAW NARZĘDZI AKUMULATOROWYCH': 'cordless power tool combo kit in carry case (drill + impact driver + circular saw + flashlight)',
    'ZESTAW NARZĘDZI': 'professional hand tool set in organized carry case',
  };

  // Find best matching product type
  let productDesc = '';
  for (const [key, desc] of Object.entries(typeMap)) {
    if (name.toUpperCase().includes(key)) {
      productDesc = desc;
      break;
    }
  }

  if (!productDesc) {
    // Fallback: use the product name directly
    productDesc = name.toLowerCase()
      .replace(/[A-Z]{2,}-[A-Z0-9]+/g, '') // remove SKU codes
      .replace(/\/[A-Z0-9-]+/g, '')
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const brandStr = foundBrand ? `, ${foundBrand} brand` : '';
  const colorDetail = foundBrand === 'BAVARIA' ? ', red and black color scheme' :
                      foundBrand === 'MAGNUM' ? ', blue and black color scheme' :
                      foundBrand === 'EUROTEC' ? ', teal and black color scheme' :
                      foundBrand === 'STERLING' ? ', orange and black color scheme' :
                      ', professional color scheme';

  return `Professional e-commerce product photo of a ${productDesc}${brandStr}${colorDetail}. ` +
    `Isolated on pure white background. Studio lighting, soft shadows. ` +
    `Front-facing view, slightly elevated angle. High detail, sharp focus. ` +
    `Clean, minimal, no text or watermarks. 1024x1024px.`;
}

main().catch(console.error);
