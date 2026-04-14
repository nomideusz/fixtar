import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/HeroSection.svelte', 'utf-8');

svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.01em;');

fs.writeFileSync('src/lib/components/home/HeroSection.svelte', svelte);
console.log('Hero updated');
