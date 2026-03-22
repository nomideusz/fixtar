<script lang="ts">
	const features = [
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Gwarancja i Serwis',
			description: 'Pełna gwarancja producenta oraz profesjonalny serwis techniczny.'
		},
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Ekspresowa Dostawa',
			description: 'Szybka wysyłka w 24h na terenie całego kraju.'
		},
		{
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Wsparcie Eksperckie',
			description: 'Doradztwo techniczne i pomoc w doborze narzędzi.'
		}
	];
</script>

<section class="features">
	<div class="features-inner">
		{#each features as feature (feature.title)}
			<div class="feature">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d={feature.icon} />
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
		padding: 56px 0;
	}

	.features-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
	}

	@media (min-width: 768px) {
		.features-inner {
			grid-template-columns: repeat(3, 1fr);
			gap: 40px;
		}
	}

	.feature {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	@media (min-width: 768px) {
		.feature {
			flex-direction: column;
			text-align: center;
			align-items: center;
		}
	}

	.feature-icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--ft-frost);
		color: var(--ft-accent);
	}

	.feature-title {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ft-dark);
		margin-bottom: 4px;
	}

	.feature-desc {
		font-size: 0.85rem;
		color: var(--ft-text-muted);
		line-height: 1.6;
	}
</style>
