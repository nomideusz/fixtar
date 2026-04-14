import fs from 'fs';
let code = fs.readFileSync('src/lib/components/ui/Button.svelte', 'utf8');

code = code.replace(/\.btn--primary\s*\{[^}]+\}/, match => match.replace(/color: white;/, 'color: var(--ft-cta-text);'));
code = code.replace(/\.btn--outline:hover:not\(:disabled\)\s*\{[^}]+\}/, match => match.replace(/color: white;/, 'color: var(--ft-cta-text);'));

fs.writeFileSync('src/lib/components/ui/Button.svelte', code);
