import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/home/TestimonialsSection.svelte', 'utf-8');

svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 600;');
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: -0\.02em;/g, 'letter-spacing: -0.01em;');
svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/font-family: var\(--font-display\);/g, 'font-family: var(--font-sans);');
svelte = svelte.replace(/border-radius: var\(--radius-sm\);/g, 'border-radius: var(--radius-full);');

fs.writeFileSync('src/lib/components/home/TestimonialsSection.svelte', svelte);
console.log('Testimonials updated');
