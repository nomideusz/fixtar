import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/layout/Footer.svelte', 'utf-8');

// Remove top thick border
svelte = svelte.replace(/border-top: 4px solid var\(--ft-accent\);/g, 'border-top: 1px solid var(--ft-line);');

// Soften column titles
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: 0\.1em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/font-size: 0\.72rem;/g, 'font-size: 0.95rem;');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');

fs.writeFileSync('src/lib/components/layout/Footer.svelte', svelte);
console.log('Footer updated');
