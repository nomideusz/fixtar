import fs from 'fs';

let css = fs.readFileSync('src/app.css', 'utf-8');

css = css.replace(/#e31837/g, '#3b82f6'); // blue-500
css = css.replace(/#c2122c/g, '#2563eb'); // blue-600
css = css.replace(/#9e0e23/g, '#1d4ed8'); // blue-700

// Update some comments
css = css.replace(/Inspired by Honda Motorcycles/g, 'Inspired by Scandinavian minimalism');
css = css.replace(/4-color hierarchy: Black \(authority\) \+ Gray \(structure\) \+ Red \(action\) \+ Blue \(accent\)/g, 'Soft 4-color hierarchy: Slate, Blue, White, Cool Gray');

// Make the nav dot use the blue CTA
css = css.replace(/var\(--ft-cta\)/g, 'var(--ft-cta)');

fs.writeFileSync('src/app.css', css);
console.log('App colors updated');
