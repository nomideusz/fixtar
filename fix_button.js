import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/ui/Button.svelte', 'utf-8');

svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: 0\.1em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/border-radius: var\(--radius-sm, 4px\);/g, 'border-radius: var(--radius-full);');

svelte = svelte.replace(/font-size: 0\.75rem;/g, 'font-size: 0.95rem;');
svelte = svelte.replace(/font-size: 0\.68rem;/g, 'font-size: 0.85rem;');
svelte = svelte.replace(/font-size: 0\.78rem;/g, 'font-size: 1rem;');

fs.writeFileSync('src/lib/components/ui/Button.svelte', svelte);
console.log('Button updated');
