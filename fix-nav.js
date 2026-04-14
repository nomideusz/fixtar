import fs from 'fs';
let code = fs.readFileSync('src/lib/components/layout/Navbar.svelte', 'utf8');

code = code.replace(/color: #ffffff;\n\t\tbackground: var\(--ft-cta\);/g, 'color: var(--ft-cta-text);\n\t\tbackground: var(--ft-cta);');
code = code.replace(/\.nav-cart-btn:hover \.cart-badge\s*\{[^}]+\}/g, match => {
    return match.replace(/color: #ffffff;/, 'color: var(--ft-cta-text);').replace(/border-color: #ffffff;/, 'border-color: var(--ft-cta-text);');
});

fs.writeFileSync('src/lib/components/layout/Navbar.svelte', code);
