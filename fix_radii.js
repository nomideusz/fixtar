import fs from 'fs';

let css = fs.readFileSync('src/app.css', 'utf-8');

css = css.replace(/--radius-2xl: 0px;/g, "--radius-2xl: 2rem;");
css = css.replace(/--radius-3xl: 0px;/g, "--radius-3xl: 3rem;");

fs.writeFileSync('src/app.css', css);
console.log('radii updated');
