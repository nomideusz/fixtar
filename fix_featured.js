import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/FeaturedProducts.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/border-left: 4px solid var\(--ft-accent\);/g, '');
svelte = svelte.replace(/padding-left: 14px;/g, '');
svelte = svelte.replace(/border-bottom: 2px solid var\(--ft-accent\);/g, '');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/font-size: 0\.8rem;/g, 'font-size: 0.95rem;');

fs.writeFileSync('src/lib/components/home/FeaturedProducts.svelte', svelte);
console.log('Featured products updated');
