<script lang="ts">
	const features = [
		{
			icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
			title: 'Gwarancja Producenta',
			desc: 'Pełna gwarancja na wszystkie produkty.'
		},
		{
			icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
			title: 'Dostawa 24h',
			desc: 'Darmowa wysyłka od 299 zł.'
		},
		{
			icon: 'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
			title: 'Wsparcie Techniczne',
			desc: 'Pomoc w doborze narzędzi.'
		},
		{
			icon: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
			title: '14 Dni Na Zwrot',
			desc: 'Prosty proces, szybki zwrot.'
		}
	];
</script>

<section class="features">
	<div class="features-inner">
		{#each features as feature, i (feature.title)}
			<div class="feature">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d={feature.icon} />
					</svg>
				</div>
				<h3 class="feature-title">{feature.title}</h3>
				<p class="feature-desc">{feature.desc}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.features {
		border-top: 1px solid var(--ft-line);
		padding: clamp(40px, 5vh, 56px) 0;
		background: var(--ft-surface);
	}

	.features-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}

	@media (min-width: 768px) {
		.features-inner {
			grid-template-columns: repeat(4, 1fr);
			gap: 32px;
		}
	}

	.feature {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.feature-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--ft-frost);
		color: var(--ft-accent);
		margin-bottom: 12px;
	}

	.feature-title {
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-bottom: 4px;
	}

	.feature-desc {
		font-size: 0.75rem;
		color: var(--ft-text-muted);
		line-height: 1.5;
	}
</style>
