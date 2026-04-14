import fs from 'fs';

const css = fs.readFileSync('src/app.css', 'utf-8');

// Replace the font mappings
let updated = css.replace(/--font-sans: 'Barlow', system-ui, -apple-system, sans-serif;/g, "--font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;");
updated = updated.replace(/--font-display: 'Chakra Petch', system-ui, -apple-system, sans-serif;/g, "--font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;");
updated = updated.replace(/--font-mono: 'Barlow', system-ui, sans-serif;/g, "--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;");

// Update radii
updated = updated.replace(/--radius-sm: 0px;/g, "--radius-sm: 0.375rem;");
updated = updated.replace(/--radius-md: 0px;/g, "--radius-md: 0.75rem;");
updated = updated.replace(/--radius-lg: 0px;/g, "--radius-lg: 1rem;");
updated = updated.replace(/--radius-xl: 0px;/g, "--radius-xl: 1.5rem;");

// Update colors to be softer
updated = updated.replace(/--ft-dark: #0a0f1a;/g, "--ft-dark: #1f2937;");
updated = updated.replace(/--ft-text: #3e4652;/g, "--ft-text: #4b5563;");
updated = updated.replace(/--ft-text-strong: #0a0f1a;/g, "--ft-text-strong: #111827;");
updated = updated.replace(/--ft-text-muted: #8492a6;/g, "--ft-text-muted: #6b7280;");
updated = updated.replace(/--ft-text-faint: #cbd5e0;/g, "--ft-text-faint: #9ca3af;");

updated = updated.replace(/--ft-cta: #e31837;/g, "--ft-cta: #3b82f6;"); // Soft blue
updated = updated.replace(/--ft-cta-hover: #c2122c;/g, "--ft-cta-hover: #2563eb;");
updated = updated.replace(/--ft-cta-light: rgba\(227, 24, 55, 0.08\);/g, "--ft-cta-light: rgba(59, 130, 246, 0.08);");

updated = updated.replace(/--ft-accent: #0a0f1a;/g, "--ft-accent: #111827;");
updated = updated.replace(/--ft-accent-hover: #1f2937;/g, "--ft-accent-hover: #374151;");

updated = updated.replace(/--ft-line: #e2e8f0;/g, "--ft-line: #f3f4f6;");
updated = updated.replace(/--ft-frost: #f7fafc;/g, "--ft-frost: #f9fafb;");

// Shadows
updated = updated.replace(/--ft-shadow-sm: none;/g, "--ft-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);");
updated = updated.replace(/--ft-shadow-md: none;/g, "--ft-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);");
updated = updated.replace(/--ft-shadow-lg: none;/g, "--ft-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);");

fs.writeFileSync('src/app.css', updated);
console.log('done');
