import fs from 'fs';
import path from 'path';

function removeUppercase(filepath) {
    if (!fs.existsSync(filepath)) return;
    let svelte = fs.readFileSync(filepath, 'utf-8');
    
    svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
    svelte = svelte.replace(/uppercase/g, ''); // Tailwind classes
    svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
    svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 500;');
    svelte = svelte.replace(/letter-spacing: 0\.1em;/g, 'letter-spacing: 0;');
    svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
    svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
    
    fs.writeFileSync(filepath, svelte);
}

removeUppercase('src/lib/components/products/ProductGallery.svelte');
removeUppercase('src/lib/components/products/SpecTable.svelte');
removeUppercase('src/lib/components/products/RelatedProducts.svelte');
removeUppercase('src/lib/components/products/PurchaseCard.svelte');
removeUppercase('src/lib/components/layout/NavSearch.svelte');
removeUppercase('src/routes/products/[slug]/+page.svelte');

console.log('Extra components softened');
