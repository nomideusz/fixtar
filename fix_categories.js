import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/CategoriesSection.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.015em;');
svelte = svelte.replace(/border-left: 4px solid var\(--ft-accent\);/g, '');
svelte = svelte.replace(/padding-left: 14px;/g, '');

svelte = svelte.replace(/border: 1px solid var\(--ft-line\); \/\* Hardware drawer look \*\//g, 'border: 1px solid var(--ft-line); border-radius: var(--radius-2xl);');
svelte = svelte.replace(/border-bottom: 1px solid var\(--ft-line\);/g, '');

// Remove the left bar completely from cat-info
svelte = svelte.replace(/\.cat-info::before \{[\s\S]*?\}/g, '');
svelte = svelte.replace(/\.cat-card:hover \.cat-info::before \{[\s\S]*?\}/g, '');

svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');

fs.writeFileSync('src/lib/components/home/CategoriesSection.svelte', svelte);
console.log('Categories updated');
