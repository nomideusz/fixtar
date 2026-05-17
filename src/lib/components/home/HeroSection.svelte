<script lang="ts">
	import { ArrowRightIcon, StarIcon } from 'phosphor-svelte';
	import heroConstruction from '$lib/images/hero/hero-construction-hammer-drill-01.webp';
</script>

<section class="hero" aria-label="Baner główny">
	<div class="hero-bg" aria-hidden="true">
		<img src={heroConstruction} alt="" loading="eager" fetchpriority="high" decoding="async" />
		<div class="hero-bg-overlay"></div>
	</div>

	<div class="ft-container">
		<div class="hero-content">
			<h1 class="hero-headline">
				<span class="headline-line">Twój dom.</span>
				<span class="headline-line is-teal">Twoja moc.</span>
			</h1>
			<p class="hero-lede">Profesjonalne narzędzia stworzone do ciężkiej pracy.</p>

			<div class="hero-cta">
				<a href="/products" class="btn-cta-teal">
					Zobacz produkty
					<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
				</a>
				<a href="/about" class="btn-outline">O marce</a>
			</div>

			<div class="hero-rating">
				<span class="stars" aria-hidden="true">
					{#each Array(5) as _, i (i)}
						<StarIcon size={15} weight="fill" />
					{/each}
				</span>
				<span class="score">4.8/5</span>
				<span class="basis">na podstawie 2 500+ opinii</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(80% 70% at 70% 50%, rgba(55, 138, 146, 0.15), transparent 60%),
			linear-gradient(110deg, #d8dde2 0%, #c2cad1 45%, #a7b1ba 100%);
		min-height: 540px;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}

	.hero-bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 70% center;
		display: block;
	}

	.hero-bg-overlay {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				90deg,
				rgba(244, 245, 247, 0.88) 0%,
				rgba(244, 245, 247, 0.45) 40%,
				rgba(244, 245, 247, 0) 65%,
				rgba(244, 245, 247, 0) 100%
			);
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		padding: 90px 0 88px;
		max-width: 600px;
	}

	.hero-headline {
		font-family: var(--font-display-condensed);
		font-weight: 500;
		font-style: italic;
		font-size: clamp(56px, 6.8vw, 92px);
		line-height: 0.9;
		letter-spacing: 0.005em;
		margin: 0 0 22px;
		text-transform: uppercase;
		color: var(--ft-text);
	}

	.headline-line {
		display: block;
	}

	.headline-line.is-teal {
		color: var(--ft-cyan);
	}

	.hero-lede {
		font-family: var(--font-sans);
		font-size: 16px;
		color: var(--ft-dark);
		max-width: 360px;
		margin: 0 0 30px;
		line-height: 1.55;
		font-weight: 500;
	}

	.hero-cta {
		display: flex;
		gap: 12px;
		margin-bottom: 28px;
		flex-wrap: wrap;
	}

	.btn-cta-teal,
	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 14px 22px;
		border-radius: var(--radius-sm);
		min-height: 48px;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
		border: 1.5px solid transparent;
	}

	.btn-cta-teal {
		background: var(--ft-cyan);
		color: #fff;
		border-color: var(--ft-cyan);
	}

	.btn-cta-teal:hover {
		background: var(--ft-cyan-600);
		border-color: var(--ft-cyan-600);
		color: #fff;
	}

	.btn-cta-teal :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.btn-cta-teal:hover :global(svg) {
		transform: translateX(3px);
	}

	.btn-outline {
		background: transparent;
		color: var(--ft-text);
		border-color: var(--ft-text);
	}

	.btn-outline:hover {
		background: var(--ft-text);
		color: #fff;
	}

	.hero-rating {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 13px;
		color: var(--ft-text-muted);
		flex-wrap: wrap;
	}

	.hero-rating .stars {
		display: inline-flex;
		gap: 2px;
		color: var(--ft-cta);
	}

	.hero-rating .score {
		color: var(--ft-text);
		font-weight: 700;
		font-family: var(--font-display);
	}

	@media (max-width: 768px) {
		.hero-content {
			padding: 60px 0 64px;
		}

		.hero-headline {
			font-size: clamp(56px, 14vw, 80px);
		}

		.hero-lede {
			max-width: 100%;
		}

		.hero-bg-overlay {
			background:
				linear-gradient(
					180deg,
					rgba(244, 245, 247, 0.7) 0%,
					rgba(244, 245, 247, 0.55) 40%,
					rgba(244, 245, 247, 0.85) 100%
				);
		}
	}

	@media (max-width: 480px) {
		.btn-cta-teal,
		.btn-outline {
			flex: 1 1 auto;
			justify-content: center;
		}
	}
</style>
