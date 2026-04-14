import fs from 'fs';

let svelte = fs.readFileSync('src/lib/components/layout/Navbar.svelte', 'utf-8');

// Remove 4px top border
svelte = svelte.replace(/border-top: 4px solid var\(--ft-cta\);/g, '');

// Soften nav links
svelte = svelte.replace(/\.nav-link \{[\s\S]*?\}/g, `.nav-link {
		position: relative;
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--ft-text-strong);
		padding: 8px 12px;
		border-radius: var(--radius-full);
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}`);
	
svelte = svelte.replace(/font-weight: 800;/g, 'font-weight: 600;');

// Soften action labels
svelte = svelte.replace(/text-transform: uppercase;/g, 'text-transform: none;');
svelte = svelte.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0;');
svelte = svelte.replace(/font-size: 0\.65rem;/g, 'font-size: 0.8rem;');
svelte = svelte.replace(/font-weight: 700;/g, 'font-weight: 500;');

// Cart button
svelte = svelte.replace(/\.nav-cart-btn \{[\s\S]*?\}/g, `.nav-cart-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 16px;
		margin-left: 4px;
		border-radius: var(--radius-full);
		color: #ffffff;
		background: var(--ft-cta);
		border: 1px solid var(--ft-cta);
		cursor: pointer;
		text-decoration: none;
		position: relative;
		transition: all 0.2s ease;
		box-shadow: var(--ft-shadow-md);
	}`);
svelte = svelte.replace(/\.nav-cart-btn:hover \{[\s\S]*?\}/g, `.nav-cart-btn:hover {
		background: var(--ft-cta-hover);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: var(--ft-shadow-lg);
	}`);
	
svelte = svelte.replace(/\.nav-cart-btn:active \{[\s\S]*?\}/g, `.nav-cart-btn:active {
		transform: translateY(0);
		box-shadow: var(--ft-shadow-sm);
	}`);

fs.writeFileSync('src/lib/components/layout/Navbar.svelte', svelte);
console.log('Navbar updated');
