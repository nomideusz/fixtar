import fs from 'fs';
let css = fs.readFileSync('src/lib/components/ui/ProductCard.svelte', 'utf8');

css = css.replace(/\.floating-cart-btn\s*\{[^}]+\}/g, match => {
    return match.replace(/color: #ffffff;/, 'color: var(--ft-cta-text);');
});

fs.writeFileSync('src/lib/components/ui/ProductCard.svelte', css);
