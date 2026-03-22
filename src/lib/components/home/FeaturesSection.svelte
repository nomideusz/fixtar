<script lang="ts">
	const features = [
		{
			icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
			title: 'Gwarancja Producenta',
			description: 'Pełna gwarancja na wszystkie produkty oraz profesjonalny serwis techniczny.'
		},
		{
			icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
			title: 'Ekspresowa Dostawa',
			description: 'Szybka wysyłka w 24h. Darmowa dostawa przy zamówieniach powyżej 299 zł.'
		},
		{
			icon: 'M1 4v10h7l-3 7 13-11h-7l3-7z',
			iconAlt: true,
			title: 'Wsparcie Eksperckie',
			description: 'Doradztwo techniczne i pomoc w doborze odpowiednich narzędzi do Twojego projektu.'
		},
		{
			icon: 'M1 4l1 6h7l-3 7 13-11h-7z',
			iconAlt: true,
			title: 'Łatwe Zwroty',
			description: '14 dni na zwrot bez podawania przyczyny. Prosty proces, szybki zwrot pieniędzy.'
		}
	];

	/* Use distinct SVG paths per feature */
	const iconPaths = [
		/* Shield — Gwarancja */
		'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
		/* Lightning — Dostawa */
		'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
		/* Headphones — Wsparcie */
		'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
		/* Rotate — Zwroty */
		'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15'
	];
</script>

<section class="features">
	<div class="features-inner">
		{#each features as feature, i (feature.title)}
			<div class="feature ft-animate" style="animation-delay: {i * 60}ms">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d={iconPaths[i]} />
					</svg>
				</div>
				<div>
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-desc">{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.features {
		border-top: 1px solid var(--ft-line);
		padding: clamp(48px, 6vh, 64px) 0;
	}

	.features-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
	}

	@media (min-width: 640px) {
		.features-inner {
			grid-template-columns: repeat(2, 1fr);
			gap: 32px;
		}
	}

	@media (min-width: 1024px) {
		.features-inner {
			grid-template-columns: repeat(4, 1fr);
			gap: 40px;
		}
	}

	.feature {
		display: flex;
		gap: 14px;
		align-items: flex-start;
	}

	@media (min-width: 1024px) {
		.feature {
			flex-direction: column;
			text-align: center;
			align-items: center;
		}
	}

	.feature-icon {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		color: var(--ft-accent);
	}

	.feature-title {
		font-family: var(--font-sans);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--ft-dark);
		margin-bottom: 4px;
	}

	.feature-desc {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		line-height: 1.6;
	}
</style>
