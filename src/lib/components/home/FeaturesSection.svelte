<script lang="ts">
	const features = [
		{
			icon: 'M1 3v6h6M23 21v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
			title: 'Darmowe Zwroty',
			desc: '14 dni na zwrot'
		},
		{
			icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
			title: 'Gwarancja',
			desc: 'Pełna gwarancja producenta'
		},
		{
			icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
			title: 'Szybka Dostawa',
			desc: 'Darmowa od 299 zł'
		},
		{
			icon: 'M9 19c-4.286 1.35-4.286-2.55-6-3m12 5v-3.5c0-1 .099-1.405-.5-2 2.791-.3 5.5-1.366 5.5-6.04a4.567 4.567 0 00-1.333-3.21 4.192 4.192 0 00-.08-3.227s-1.05-.3-3.476 1.267a12.334 12.334 0 00-6.222 0C6.462 2.723 5.413 3.023 5.413 3.023a4.192 4.192 0 00-.08 3.227A4.566 4.566 0 004 9.486c0 4.64 2.709 5.68 5.5 6.014-.591.649-.56 1.1-.5 2V21',
			title: 'Wsparcie',
			desc: 'Pomoc w doborze narzędzi'
		}
	];
</script>

<section class="features" aria-label="Nasze atuty">
	<div class="features-inner">
		{#each features as feature (feature.title)}
			<div class="feature">
				<div class="feature-icon" aria-hidden="true">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d={feature.icon} />
					</svg>
				</div>
				<div class="feature-text">
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-desc">{feature.desc}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.features {
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
		background: var(--ft-surface);
	}

	.features-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 768px) {
		.features-inner {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 20px 16px;
	}

	/* Vertical dividers between items on desktop */
	@media (min-width: 768px) {
		.feature:not(:last-child) {
			border-right: 1px solid var(--ft-line);
		}
	}

	/* On mobile, 2x2 grid with bottom borders on top row */
	@media (max-width: 767px) {
		.feature:nth-child(-n+2) {
			border-bottom: 1px solid var(--ft-line);
		}

		.feature:nth-child(odd) {
			border-right: 1px solid var(--ft-line);
		}
	}

	.feature-icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-accent);
	}

	.feature-title {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.01em;
		margin-bottom: 1px;
	}

	.feature-desc {
		font-size: 0.72rem;
		color: var(--ft-text-muted);
		line-height: 1.4;
	}
</style>
