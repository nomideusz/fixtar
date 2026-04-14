import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/NewsletterSection.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/border-radius: var\(--radius-sm\);/g, 'border-radius: var(--radius-full);');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');

// Soften borders
svelte = svelte.replace(/border: 2px solid var\(--ft-line\);/g, 'border: 1px solid var(--ft-line);');
svelte = svelte.replace(/border: 2px solid var\(--ft-text-strong\);/g, 'border: 1px solid var(--ft-text-strong);');
svelte = svelte.replace(/border-color: var\(--ft-text-strong\);/g, 'border-color: var(--ft-cta);');
svelte = svelte.replace(/border-color: var\(--ft-line\);/g, 'border-color: var(--ft-line);');

fs.writeFileSync('src/lib/components/home/NewsletterSection.svelte', svelte);
console.log('Newsletter updated');
