import fs from 'fs';
let css = fs.readFileSync('src/app.css', 'utf-8');
css = css.replace(/--color-cta-light: rgba\(227, 24, 55, 0\.08\);/g, '--color-cta-light: rgba(59, 130, 246, 0.08);');
css = css.replace(/rgba\(0, 80, 160, 0\.1\)/g, 'rgba(59, 130, 246, 0.1)');
fs.writeFileSync('src/app.css', css);
