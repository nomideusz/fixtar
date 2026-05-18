<script lang="ts">
	import { ArrowRightIcon, StarIcon } from 'phosphor-svelte';
	import heroConstruction from '$lib/images/hero/hero-construction-hammer-drill-01.webp';
</script>

<section class="hero" aria-label="Baner główny">
	<!-- Full-bleed photo across the entire viewport -->
	<div class="hero-photo" aria-hidden="true">
		<img src={heroConstruction} alt="" loading="eager" fetchpriority="high" decoding="async" />
	</div>

	<!-- Left-side fade gradient: opaque surface on the left, transparent on the right -->
	<div class="hero-veil" aria-hidden="true"></div>

	<!-- Subtle cyan radial accent far right -->
	<div class="hero-glow" aria-hidden="true"></div>

	<!-- "Stamp" chip floats free on the photo -->
	<div class="stamp" aria-hidden="true">
		<span class="stamp-dot"></span>
		<span class="stamp-label">Młotowiertarka · 20V</span>
	</div>

	<div class="ft-container hero-inner">
		<div class="hero-content">
			<h1 class="hero-headline">
				<span class="headline-line">Twój dom.</span>
				<span class="headline-line is-accent">Twoja moc.</span>
			</h1>
			<p class="hero-lede">
				Profesjonalne narzędzia stworzone do ciężkiej pracy — projektowane w Europie, objęte 2-letnią gwarancją.
			</p>

			<div class="hero-cta">
				<a href="/products" class="btn btn-teal">
					Zobacz produkty
					<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
				</a>
				<a href="/about" class="btn btn-outline">O marce</a>
			</div>

			<div class="hero-rating">
				<span class="stars" aria-hidden="true">
					{#each Array(5) as _, i (i)}
						<StarIcon size={16} weight="fill" />
					{/each}
				</span>
				<span class="score-text">
					<b>4.8/5</b><span>na podstawie 2 500+ opinii</span>
				</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		background: #edf0f3;
		min-height: clamp(480px, 70vh, 640px);
	}

	/* Full-width photo (100vw) */
	.hero-photo {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 65% center;
	}

	/* Left-side veil — opaque surface fading to transparent so photo reads on the right */
	.hero-veil {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			linear-gradient(
				90deg,
				#fafbfc 0%,
				#fafbfc 22%,
				rgba(250, 251, 252, 0.96) 32%,
				rgba(250, 251, 252, 0.85) 42%,
				rgba(250, 251, 252, 0.6) 52%,
				rgba(250, 251, 252, 0.32) 64%,
				rgba(250, 251, 252, 0.1) 76%,
				transparent 88%
			),
			linear-gradient(180deg, transparent 65%, rgba(237, 240, 243, 0.5) 100%);
	}

	/* Subtle cyan accent on the right side */
	.hero-glow {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: radial-gradient(
			ellipse at 92% 50%,
			rgba(63, 152, 162, 0.1) 0%,
			transparent 50%
		);
	}

	/* Stamp chip — bottom right of viewport */
	.stamp {
		position: absolute;
		right: clamp(24px, 4vw, 48px);
		bottom: clamp(24px, 4vh, 40px);
		z-index: 3;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: var(--radius-sm);
		box-shadow: 0 4px 12px rgba(29, 34, 40, 0.08);
	}

	.stamp-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--ft-cyan);
		box-shadow: 0 0 8px var(--ft-cyan);
	}

	.stamp-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ft-ink-700);
		font-weight: 500;
	}

	/* Content overlay — sits left, on top of the photo+veil */
	.hero-inner {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		min-height: clamp(480px, 70vh, 640px);
	}

	.hero-content {
		max-width: 540px;
		padding: 64px 0;
	}

	.hero-headline {
		font-family: var(--font-display);
		font-weight: 500;
		font-style: italic;
		font-size: clamp(48px, 6.4vw, 84px);
		line-height: 0.95;
		letter-spacing: -0.02em;
		text-transform: uppercase;
		margin: 0 0 24px;
		color: var(--ft-ink-900);
	}

	.headline-line {
		display: block;
	}

	.headline-line.is-accent {
		color: var(--ft-cyan);
	}

	.hero-lede {
		font-family: var(--font-sans);
		font-size: 17px;
		line-height: 1.5;
		color: var(--ft-ink-600);
		max-width: 380px;
		margin: 0 0 32px;
	}

	.hero-cta {
		display: flex;
		gap: 12px;
		margin-bottom: 36px;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 16px 24px;
		border-radius: var(--radius-sm);
		min-height: 52px;
		border: 1px solid transparent;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.btn-teal {
		background: var(--ft-cyan);
		color: #fff;
		border-color: var(--ft-cyan);
	}

	.btn-teal:hover {
		background: var(--ft-cyan-600);
		border-color: var(--ft-cyan-600);
		color: #fff;
	}

	.btn-teal :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.btn-teal:hover :global(svg) {
		transform: translateX(3px);
	}

	.btn-outline {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(6px);
		color: var(--ft-ink-900);
		border-color: var(--ft-ink-300);
	}

	.btn-outline:hover {
		background: #fff;
		border-color: var(--ft-ink-900);
		color: var(--ft-ink-900);
	}

	.hero-rating {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}

	.hero-rating .stars {
		display: inline-flex;
		gap: 2px;
		color: var(--ft-cta);
	}

	.score-text {
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		font-size: 14px;
		color: var(--ft-ink-600);
	}

	.score-text b {
		color: var(--ft-ink-900);
		font-weight: 700;
	}

	/* Responsive — at smaller widths the veil becomes top-to-bottom instead of left-to-right */
	@media (max-width: 760px) {
		.hero {
			min-height: clamp(560px, 80vh, 720px);
		}

		.hero-photo img {
			object-position: 60% 30%;
		}

		.hero-veil {
			background:
				linear-gradient(
					180deg,
					#fafbfc 0%,
					rgba(250, 251, 252, 0.94) 25%,
					rgba(250, 251, 252, 0.65) 42%,
					rgba(250, 251, 252, 0.2) 58%,
					transparent 75%
				);
		}

		.hero-inner {
			min-height: clamp(560px, 80vh, 720px);
			align-items: flex-start;
		}

		.hero-content {
			padding-top: 48px;
		}

		.stamp {
			right: 20px;
			bottom: 20px;
		}
	}

	@media (max-width: 480px) {
		.btn {
			flex: 1 1 auto;
		}

		.stamp {
			display: none;
		}
	}
</style>
