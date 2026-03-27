<script lang="ts">
	const brands = [
		{ name: 'Bavaria', slug: 'bavaria' },
		{ name: 'Magnum', slug: 'magnum' },
		{ name: 'Eurotec', slug: 'eurotec' },
		{ name: 'Sterling', slug: 'sterling' },
		{ name: 'Graphite', slug: 'graphite' },
		{ name: 'Yato', slug: 'yato' }
	];
</script>

<section class="brands ft-section-sm">
	<div class="ft-container">
		<p class="brands-label">Zaufane marki</p>
		<div class="brands-row">
			{#each brands as brand (brand.slug)}
				<a
					href="/products?search={brand.name}"
					class="brand-item"
					aria-label="Pokaż produkty marki {brand.name}"
				>
					{brand.name}
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.brands {
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
	}

	.brands-label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ft-text-faint);
		text-align: center;
		margin-bottom: 16px;
	}

	.brands-row {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px 32px;
	}

	.brand-item {
		font-family: var(--font-display);
		font-size: clamp(0.9rem, 1.5vw, 1.1rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--ft-text-faint);
		text-decoration: none;
		transition: color var(--dur-med) ease;
		padding: 8px 4px;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.brand-item:hover {
		color: var(--ft-accent);
	}
</style>
