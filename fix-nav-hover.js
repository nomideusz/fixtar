import fs from 'fs';
let code = fs.readFileSync('src/lib/components/layout/Navbar.svelte', 'utf8');

code = code.replace(/\.nav-cart-btn:hover\s*\{[^}]+\}/g, match => match.replace(/color: #ffffff;/, 'color: var(--ft-cta-text);'));

fs.writeFileSync('src/lib/components/layout/Navbar.svelte', code);
