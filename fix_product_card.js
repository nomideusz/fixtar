import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/ui/ProductCard.svelte', 'utf-8');

// HUD Pills and Tags
svelte = svelte.replace(/border-radius: var\(--radius-sm\);/g, 'border-radius: var(--radius-full);');
svelte = svelte.replace(/font-family: var\(--font-mono\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');

// Floating cart button
svelte = svelte.replace(/border-radius: 0;/g, 'border-radius: var(--radius-full);');
svelte = svelte.replace(/box-shadow: 3px 3px 0px rgba\(0, 0, 0, 0\.1\);/g, 'box-shadow: var(--ft-shadow-md);');
svelte = svelte.replace(/box-shadow: 5px 5px 0px rgba\(0, 0, 0, 0\.15\);/g, 'box-shadow: var(--ft-shadow-lg);');

// Card price
svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');

// Card name
svelte = svelte.replace(/font-size: 0\.9rem;/g, 'font-size: 1rem;');

// Remove harsh borders from hover if any
// Change font-display to sans generally in tags if any

fs.writeFileSync('src/lib/components/ui/ProductCard.svelte', svelte);
console.log('ProductCard updated');
