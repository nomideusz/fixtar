<script lang="ts">
	import { onMount } from 'svelte';
	import heroConstruction from '$lib/images/hero/hero-construction-hammer-drill-01.webp';
	import heroForest from '$lib/images/hero/hero-man-casual-02.webp';
	import heroTool from '$lib/images/hero/hero-person-tool-01.webp';

	import bannerGrinder1 from '$lib/images/hero/banner-grinder-sparks-1.webp';
	import bannerImpact1 from '$lib/images/hero/banner-impact-wrench-wheel.webp';
	import bannerWorkshopDrill2 from '$lib/images/hero/banner-workshop-cordless-drill-2.webp';

	interface Slide {
		headline: string;
		subline: string;
		href: string;
		image: string;
		alt: string;
		/** object-position for mobile crop (subject focus) */
		mobilePosition: string;
		/** object-position for desktop crop */
		desktopPosition: string;
		/** Whether to flip the image horizontally */
		flipped?: boolean;
		/** Whether the image should be slightly zoomed out */
		zoomedOut?: boolean;
	}

	const slides: Slide[] = [
		{
			headline: 'Młotowiertarka Eurotec PRO-EX',
			subline: 'Maksymalna siła uderzenia do najcięższych prac w betonie.',
			href: '/deals',
			image: heroConstruction,
			alt: 'Młotowiertarka Eurotec na budowie',
			mobilePosition: '65% center',
			desktopPosition: 'center 75%'
		},
		{
			headline: 'Szlifierka Kątowa Eurotec 125mm',
			subline: 'Iskry profesjonalizmu. Moc 2000W do najcięższych przecinań.',
			href: '/deals',
			image: bannerGrinder1,
			alt: 'Szlifierka kątowa Eurotec w akcji',
			mobilePosition: 'center center',
			desktopPosition: 'center center'
		},
		{
			headline: 'System Cordless PRO',
			subline: 'Pracuj bez kabli, bez ograniczeń. Moc sieciowa w wersji akumulatorowej.',
			href: '/products',
			image: bannerWorkshopDrill2,
			alt: 'Warsztatowa wiertarka akumulatorowa',
			mobilePosition: 'center center',
			desktopPosition: 'center 40%'
		},
		{
			headline: 'Wyposażenie Warsztatu',
			subline: 'Kompletne zestawy i akcesoria, które podniosą Twój profesjonalizm.',
			href: '/products',
			image: heroForest,
			alt: 'Mężczyzna rąbiący drewno siekierą',
			mobilePosition: 'center 55%',
			desktopPosition: 'center 40%'
		},
		{
			headline: 'Klucz Udarowy Pneumatyczny',
			subline: 'Niezastąpiony w serwisie opon. Moment obrotowy, który nie zna granic.',
			href: '/products',
			image: bannerImpact1,
			alt: 'Klucz udarowy przy kole samochodu',
			mobilePosition: 'center center',
			desktopPosition: 'center 70%'
		},
		{
			headline: 'Precyzja i Niezawodność',
			subline: 'Profesjonalne elektronarzędzia dla ekspertów, którzy nie uznają kompromisów.',
			href: '/products',
			image: heroTool,
			alt: 'Szlifierka kątowa Eurotec w serwisie',
			mobilePosition: 'center center',
			desktopPosition: 'center 90%'
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
		resetTimer();
	}

	function prev() {
		current = (current - 1 + slides.length) % slides.length;
		resetTimer();
	}

	let touchStartX = 0;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		const touchEndX = e.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > 50) {
			if (diff > 0) next();
			else prev();
		}
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
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	<!-- Background images -->
	{#each slides as s, i}
		<a
			href={s.href}
			class="hero-bg"
			class:is-active={i === current}
			tabindex={i === current ? 0 : -1}
			aria-hidden={i !== current}
			style="--mobile-pos:{s.mobilePosition}; --desktop-pos:{s.desktopPosition}"
		>
			<img
				src={s.image}
				alt={s.alt}
				width="1920"
				height="1072"
				loading={i === 0 ? 'eager' : 'lazy'}
				fetchpriority={i === 0 ? 'high' : 'auto'}
				decoding="async"
				class:is-flipped={s.flipped}
				class:is-zoomed-out={s.zoomedOut}
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
		height: calc(
			100svh - 150px
		); /* Fill standard desktop viewport (minus ~104px nav + 46px promo banner) */
		min-height: 480px;
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
		object-position: var(--desktop-pos, center 30%);
	}

	.hero-bg img.is-flipped {
		transform: scaleX(-1);
	}

	.hero-bg img.is-zoomed-out {
		transform: scale(0.9);
	}

	/* ── Scrim — subtle bottom gradient only ── */
	.hero-scrim {
		position: absolute;
		inset: 0;
		z-index: 2;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.2) 40%,
			transparent 65%
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
		max-width: min(420px, 100%);
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
			height: auto;
			aspect-ratio: 3 / 4;
			min-height: 480px;
			max-height: 680px;
		}

		.hero-bg img {
			object-fit: cover;
			object-position: var(--mobile-pos, center center);
			/* Ensure image covers properly on mobile */
			width: 100%;
			height: 100%;
		}

		.hero-scrim {
			background: linear-gradient(
				to top,
				rgba(0, 0, 0, 0.8) 0%,
				rgba(0, 0, 0, 0.3) 45%,
				transparent 75%
			);
		}

		.hero-dots {
			right: auto;
			left: 50%;
			transform: translateX(-50%);
			bottom: clamp(16px, 3vh, 24px);
			top: auto;
		}

		.hero-text {
			padding-bottom: clamp(56px, 8vh, 80px);
		}

		.hero-headline {
			font-size: clamp(1.6rem, 8vw, 2.2rem);
		}

		.hero-subline {
			font-size: 0.9rem;
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
