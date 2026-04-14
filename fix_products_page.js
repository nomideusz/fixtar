import fs from 'fs';

let svelte = fs.readFileSync('src/routes/products/+page.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/letter-spacing: -0\.01em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/letter-spacing: 0\.04em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/letter-spacing: 0\.03em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/border-left: 4px solid var\(--ft-accent\);/g, '');
svelte = svelte.replace(/padding-left: 14px;/g, '');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/border-radius: 2px;/g, 'border-radius: var(--radius-full);');

// Change chip and sort btn sizes to fit the rounded style
svelte = svelte.replace(/border-radius: 2px 0 0 2px;/g, 'border-radius: var(--radius-full) 0 0 var(--radius-full);');
svelte = svelte.replace(/border-radius: 0 2px 2px 0;/g, 'border-radius: 0 var(--radius-full) var(--radius-full) 0;');

fs.writeFileSync('src/routes/products/+page.svelte', svelte);
console.log('Products page updated');
