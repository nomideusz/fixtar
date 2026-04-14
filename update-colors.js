import fs from 'fs';
let css = fs.readFileSync('src/app.css', 'utf8');

css = css.replace(/--ft-cta: #3b82f6;.*?\n/, '--ft-cta: #ccff00; /* Volt Green/Yellow */\n');
css = css.replace(/--ft-cta-hover: #2563eb;.*?\n/, '--ft-cta-hover: #b3e600; /* Darker Volt Green */\n');
css = css.replace(/--ft-cta-light: rgba\(59, 130, 246, 0.08\);.*?\n/, '--ft-cta-light: rgba(204, 255, 0, 0.15);\n\t--ft-cta-text: #111827;\n');

css = css.replace(/\.btn-cta\s*\{[^}]+\}/g, match => {
    return match.replace(/color: #ffffff;/, 'color: var(--ft-cta-text);');
});

fs.writeFileSync('src/app.css', css);
console.log('Updated app.css');
