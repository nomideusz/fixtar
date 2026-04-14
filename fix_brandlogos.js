import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/BrandLogos.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: 0\.1em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/color: var\(--ft-text-strong\);/g, 'color: var(--ft-text-muted);'); // soften label color
svelte = svelte.replace(/font-size: 0\.75rem;/g, 'font-size: 0.95rem;');

fs.writeFileSync('src/lib/components/home/BrandLogos.svelte', svelte);
console.log('BrandLogos updated');
