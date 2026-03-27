<script lang="ts">
	import { onMount } from 'svelte';
	import heroWorkshop from '$lib/images/hero/hero-workshop-cordless-drill-01.webp';
	import heroConstruction from '$lib/images/hero/hero-construction-hammer-drill-01.webp';
	import heroForest from '$lib/images/hero/hero-man-casual-02.webp';

	interface Slide {
		headline: string;
		subline: string;
		href: string;
		image: string;
		alt: string;
	}

	const slides: Slide[] = [
		{
			headline: 'Precyzja w każdym cięciu',
			subline: 'Szlifierki, wiertarki, piły i młotowiertarki od sprawdzonych producentów.',
			href: '/products',
			image: heroWorkshop,
			alt: 'Wiertarka akumulatorowa Bavaria w warsztacie'
		},
		{
			headline: 'Moc, której potrzebujesz',
			subline: 'Sprawdzone narzędzia w niższych cenach — ta sama jakość, lepsza oferta.',
			href: '/deals',
			image: heroConstruction,
			alt: 'Młotowiertarka Eurotec na budowie'
		},
		{
			headline: 'Narzędzia na lata',
			subline: 'Pełna gwarancja producenta, 14 dni na zwrot i eksperckie doradztwo.',
			href: '/about',
			image: heroForest,
			alt: 'Mężczyzna rąbiący drewno siekierą w jesiennym lesie'
		}
	];

	let current = $state(0);
	let paused = $state(false);
	let interval: ReturnType<typeof setInterval>;

	function goto(index: number) {
		current = index;
		resetTimer();
	}

	function next() {
		current = (current + 1) % slides.length;
	}

	function resetTimer() {
		clearInterval(interval);
		interval = setInterval(() => {
			if (!paused) next();
		}, 6000);
	}

	onMount(() => {
		resetTimer();
		return () => clearInterval(interval);
	});

	const slide = $derived(slides[current]);
</script>

<section
	class="hero"
	aria-label="Baner główny"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
>
	<!-- Background images -->
	{#each slides as s, i}
		<a
			href={s.href}
			class="hero-bg"
			class:is-active={i === current}
			tabindex={i === current ? 0 : -1}
			aria-hidden={i !== current}
		>
			<img
				src={s.image}
				alt={s.alt}
				width="1920"
				height="1072"
				loading={i === 0 ? 'eager' : 'lazy'}
				fetchpriority={i === 0 ? 'high' : 'auto'}
				decoding="async"
				draggable="false"
			/>
		</a>
	{/each}

	<!-- Subtle bottom gradient for text legibility -->
	<div class="hero-scrim" aria-hidden="true"></div>

	<!-- Minimal text overlay -->
	<div class="hero-text" aria-live="polite">
		{#key current}
			<h1 class="hero-headline">{slide.headline}</h1>
			<p class="hero-subline">{slide.subline}</p>
			<a href={slide.href} class="btn-primary hero-btn" tabindex={current === current ? 0 : -1}>SPRAWDŹ OFERTĘ</a>
		{/key}
	</div>

	<!-- Dot indicators -->
	<div class="hero-dots" role="tablist" aria-label="Slajdy">
		{#each slides as _, i}
			<button
				class="hero-dot"
				class:is-active={i === current}
				role="tab"
				aria-selected={i === current}
				aria-label="Slajd {i + 1}"
				onclick={() => goto(i)}
			></button>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		aspect-ratio: 1920 / 1072;
		max-height: 80vh;
		overflow: hidden;
		background: var(--ft-frost);
	}

	/* ── Background images ── */
	.hero-bg {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 1s ease;
		z-index: 0;
		display: block;
	}

	.hero-bg.is-active {
		opacity: 1;
		z-index: 1;
	}

	.hero-bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
	}

	/* ── Scrim — subtle bottom gradient only ── */
	.hero-scrim {
		position: absolute;
		inset: 0;
		z-index: 2;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.5) 0%,
			rgba(0, 0, 0, 0.15) 35%,
			transparent 60%
		);
		pointer-events: none;
	}

	/* ── Text overlay — bottom-left, minimal ── */
	.hero-text {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		max-width: var(--ft-container, 1440px);
		margin: 0 auto;
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: clamp(32px, 5vh, 56px);
		pointer-events: none;
	}

	.hero-headline {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 4vw, 2.6rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: white;
		margin-bottom: 8px;
		animation: fadeIn 0.6s ease both;
	}

	.hero-subline {
		font-size: clamp(0.82rem, 1.2vw, 0.92rem);
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.7);
		max-width: 420px;
		animation: fadeIn 0.6s 0.1s ease both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-btn {
		margin-top: 28px;
		animation: fadeIn 0.6s 0.2s ease both;
	}

	/* ── Dot indicators ── */
	.hero-dots {
		position: absolute;
		bottom: clamp(32px, 5vh, 56px);
		right: var(--ft-gutter, clamp(24px, 5vw, 80px));
		display: flex;
		gap: 8px;
		z-index: 5;
	}

	.hero-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.35);
		border: none;
		cursor: pointer;
		padding: 0;
		transition: background 0.3s ease;
		/* 44px touch target */
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		position: relative;
	}

	.hero-dot::after {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.35);
		transition:
			background 0.3s ease,
			transform 0.3s ease;
	}

	.hero-dot.is-active::after {
		background: white;
		transform: scale(1.15);
	}

	/* ── Responsive ── */
	@media (max-width: 768px) {
		.hero {
			aspect-ratio: auto;
			height: clamp(320px, 55vh, 480px);
		}

		.hero-dots {
			right: auto;
			left: var(--ft-gutter, clamp(24px, 5vw, 80px));
			bottom: auto;
			top: clamp(32px, 5vh, 56px);
		}

		.hero-text {
			padding-bottom: clamp(24px, 4vh, 40px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-headline,
		.hero-subline {
			animation: none;
		}

		.hero-bg {
			transition: none;
		}
	}
</style>
