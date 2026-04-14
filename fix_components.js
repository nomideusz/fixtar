import fs from 'fs';

let css = fs.readFileSync('src/app.css', 'utf-8');

// Change card styling to have softer border/shadow and hover
css = css.replace(/\.ft-card \{[\s\S]*?\}/, `.ft-card {
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		box-shadow: var(--ft-shadow-sm);
		transition:
			border-color var(--dur-med) ease,
			box-shadow var(--dur-med) ease,
			transform var(--dur-med) ease;
	}`);
	
css = css.replace(/\.ft-card:hover \{[\s\S]*?\}/, `.ft-card:hover {
		border-color: var(--ft-line);
		box-shadow: var(--ft-shadow-md);
		transform: translateY(-2px);
	}`);

// Change button styles: remove uppercase, tracking, make rounded-full
css = css.replace(/text-transform: uppercase;/g, 'text-transform: none;');
css = css.replace(/letter-spacing: 0\.1em;/g, 'letter-spacing: 0;');
css = css.replace(/border-radius: var\(--radius-sm\);/g, 'border-radius: var(--radius-full);');

// Change h1/h2/h3 letter spacing and weight
css = css.replace(/letter-spacing: -0\.03em;/g, 'letter-spacing: -0.015em;');
css = css.replace(/font-weight: 700;/g, 'font-weight: 600;');

// Update the actual app.css file
fs.writeFileSync('src/app.css', css);
console.log('components updated');
