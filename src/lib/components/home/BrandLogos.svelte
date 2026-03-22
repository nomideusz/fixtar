<script lang="ts">
	const brands = ['Bavaria', 'Magnum', 'Eurotec', 'Sterling'];
</script>

<section class="brands">
	<div class="brands-inner">
		<div class="brands-label">Zaufane marki</div>
		<div class="brands-row">
			{#each brands as brand (brand)}
				<a href="/products?search={brand}" class="brand-item">
					<span class="brand-name">{brand}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.brands {
		padding: clamp(32px, 4vh, 48px) 0;
	}

	.brands-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		text-align: center;
	}

	.brands-label {
		font-size: 0.64rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ft-text-faint);
		margin-bottom: 20px;
	}

	.brands-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
		flex-wrap: wrap;
	}

	.brand-item {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		padding: 8px 16px;
		transition: all var(--dur-fast) ease;
	}

	.brand-name {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-text-faint);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		transition: color var(--dur-fast) ease;
	}

	.brand-item:hover .brand-name {
		color: var(--ft-accent);
	}

	@media (max-width: 640px) {
		.brands-row {
			gap: 20px;
		}

		.brand-name {
			font-size: 1rem;
		}
	}
</style>
