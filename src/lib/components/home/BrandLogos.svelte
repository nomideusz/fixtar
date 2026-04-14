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
		<div class="brands-marquee">
			<div class="brands-track">
				{#each Array(4) as _, idx}
					<div class="brands-group" aria-hidden={idx > 0 ? 'true' : undefined}>
						{#each brands as brand (brand.slug + '-' + idx)}
							<a
								href="/products?search={brand.name}"
								class="brand-item"
								aria-label={idx === 0 ? `Pokaż produkty marki ${brand.name}` : undefined}
								tabindex={idx === 0 ? 0 : -1}
							>
								{brand.name}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.brands {
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
	}

	.brands-label {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0;
		color: var(--ft-text-muted);
		text-align: center;
		margin-bottom: 24px;
	}

	.brands-marquee {
		overflow: hidden;
		position: relative;
		mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-right: var(--ft-gutter, clamp(24px, 5vw, 80px));
	}

	.brands-track {
		display: flex;
		width: max-content;
		animation: scroll 25s linear infinite;
	}

	.brands-track:hover {
		animation-play-state: paused;
	}

	.brands-group {
		display: flex;
		align-items: center;
		gap: clamp(32px, 5vw, 64px);
		padding-right: clamp(32px, 5vw, 64px);
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% / 4));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.brands-track {
			animation: none;
			flex-wrap: wrap;
			justify-content: center;
			width: auto;
		}
		.brands-group:not(:first-child) {
			display: none;
		}
		.brands-marquee {
			mask-image: none;
			-webkit-mask-image: none;
		}
	}

	.brand-item {
		font-family: var(--font-sans);
		font-size: clamp(1rem, 2vw, 1.25rem);
		font-weight: 600;
		letter-spacing: -0.015em;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition:
			color 0.15s ease,
			transform 0.15s ease;
		padding: 8px 12px;
		min-height: 44px;
		display: flex;
		align-items: center;
		text-transform: none;
	}

	.brand-item:hover {
		color: var(--ft-accent);
		transform: translateY(-2px);
	}
</style>
