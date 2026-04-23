<script lang="ts">
	import { onMount } from 'svelte';
	import heroConstruction from '$lib/images/hero/hero-construction-hammer-drill-01.webp';
	import heroForest from '$lib/images/hero/hero-man-casual-02.webp';
	import heroTool from '$lib/images/hero/hero-person-tool-01.webp';

	import bannerGrinder1 from '$lib/images/hero/banner-grinder-sparks-1.webp';
	import bannerImpact1 from '$lib/images/hero/banner-impact-wrench-wheel.webp';
	import bannerWorkshopDrill2 from '$lib/images/hero/banner-workshop-cordless-drill-2.webp';

	interface Slide {
		label: string;
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
			label: 'beton i rozbiórka',
			headline: 'Młotowiertarka Eurotec PRO-EX',
			subline: 'Mocne wiercenie i kucie w betonie.',
			href: '/products/mlotowiertarka-elektryczna-rh-2600-z1a4-26',
			image: heroConstruction,
			alt: 'Młotowiertarka Eurotec na budowie',
			mobilePosition: '65% center',
			desktopPosition: 'center 75%'
		},
		{
			label: 'cięcie i szlifowanie',
			headline: 'Szlifierka Kątowa Eurotec 125mm',
			subline: '2000W do cięcia i szlifowania.',
			href: '/products/szlifierka-katowa-euag-1800-ag-115g2-1',
			image: bannerGrinder1,
			alt: 'Szlifierka kątowa Eurotec w akcji',
			mobilePosition: '70% center',
			desktopPosition: 'center center'
		},
		{
			label: 'system akumulatorowy',
			headline: 'System Cordless PRO',
			subline: 'Pełna swoboda pracy bez kabla.',
			href: '/products/wkretarko-wiertarka-aku-z-udarem-chd21-jrcd2107-20st',
			image: bannerWorkshopDrill2,
			alt: 'Warsztatowa wiertarka akumulatorowa',
			mobilePosition: '45% center',
			desktopPosition: 'center 40%'
		},
		{
			label: 'warsztat i zestawy',
			headline: 'Wyposażenie Warsztatu',
			subline: 'Zestawy i akcesoria do codziennej pracy.',
			href: '/products/zestaw-kluczy-300el-eu-187c',
			image: heroForest,
			alt: 'Mężczyzna rąbiący drewno siekierą',
			mobilePosition: '55% center',
			desktopPosition: 'center 40%'
		},
		{
			label: 'serwis i pneumatyka',
			headline: 'Klucz Udarowy Pneumatyczny',
			subline: 'Mocny wybór do serwisu i warsztatu.',
			href: '/products/klucz-udarowy-kbv750-dsiw-450',
			image: bannerImpact1,
			alt: 'Klucz udarowy przy kole samochodu',
			mobilePosition: '35% center',
			desktopPosition: 'center 70%'
		},
		{
			label: 'narzędzia profesjonalne',
			headline: 'Precyzja i Niezawodność',
			subline: 'Sprzęt do pracy bez kompromisów.',
			href: '/products',
			image: heroTool,
			alt: 'Szlifierka kątowa Eurotec w serwisie',
			mobilePosition: '60% center',
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
	{#each slides as s, i (s.href)}
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

	<div class="hero-scrim" aria-hidden="true"></div>

	<div class="hero-text" aria-live="polite">
		{#key current}
			<div class="hero-copy">
				<p class="hero-label">{slide.label}</p>
				<h1 class="hero-headline">{slide.headline}</h1>
				<p class="hero-subline">{slide.subline}</p>
				<a href={slide.href} class="hero-link">Zobacz produkt</a>
			</div>
		{/key}
	</div>

	<div class="hero-dots" role="tablist" aria-label="Slajdy">
		{#each slides as slideItem, i (slideItem.href)}
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
		height: calc(100svh - 78px);
		min-height: 560px;
		overflow: hidden;
		background: var(--ft-frost);
		border-bottom: 1px solid var(--ft-line);
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 400ms var(--ease-out);
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

	.hero-scrim {
		position: absolute;
		inset: 0;
		z-index: 2;
		background:
			linear-gradient(
				to top,
				rgba(39, 45, 46, 0.68) 0%,
				rgba(39, 45, 46, 0.26) 34%,
				rgba(39, 45, 46, 0.08) 58%,
				transparent 78%
			),
			linear-gradient(
				to right,
				rgba(255, 255, 255, 0.08) 0%,
				rgba(255, 255, 255, 0.02) 28%,
				transparent 52%
			);
		pointer-events: none;
	}

	.hero-text {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		max-width: var(--ft-container, 1680px);
		margin-inline: auto;
		padding-inline: var(--ft-gutter, clamp(20px, 4vw, 64px));
		padding-bottom: clamp(28px, 4.5vh, 48px);
		pointer-events: none;
	}

	.hero-copy {
		max-width: min(64ch, 58vw);
	}

	.hero-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.78);
		margin-bottom: 12px;
		animation: fadeIn 240ms var(--ease-out) both;
	}

	.hero-headline {
		font-family: var(--font-sans);
		font-size: clamp(2.1rem, 4.8vw, 3.8rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.03em;
		color: white;
		max-width: min(16ch, 100%);
		margin-bottom: 12px;
		text-shadow: 0 2px 18px rgba(39, 45, 46, 0.18);
		animation: fadeIn 240ms var(--ease-out) both;
	}

	.hero-subline {
		font-size: clamp(0.98rem, 1.25vw, 1.05rem);
		font-weight: 400;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.88);
		max-width: min(52ch, 100%);
		margin-bottom: 22px;
		text-shadow: 0 1px 10px rgba(39, 45, 46, 0.14);
		animation: fadeIn 240ms 40ms var(--ease-out) both;
	}

	.hero-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 12px 22px;
		border: 1px solid rgba(255, 255, 255, 0.42);
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.14);
		color: white;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		text-decoration: none;
		pointer-events: auto;
		backdrop-filter: blur(8px);
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			transform var(--dur-fast) ease;
		animation: fadeIn 240ms 80ms var(--ease-out) both;
	}

	.hero-link:hover {
		background: rgba(255, 255, 255, 0.22);
		border-color: rgba(255, 255, 255, 0.62);
		color: white;
		transform: translateY(-1px);
	}

	.hero-link:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
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

	.hero-dots {
		position: absolute;
		bottom: clamp(24px, 4vh, 40px);
		right: var(--ft-gutter, clamp(20px, 4vw, 64px));
		display: flex;
		gap: 6px;
		z-index: 5;
	}

	.hero-dot {
		border: none;
		cursor: pointer;
		padding: 0;
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
		border: 1px solid rgba(255, 255, 255, 0.18);
		transition:
			background-color var(--dur-fast) ease,
			transform var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.hero-dot.is-active::after {
		background: white;
		border-color: white;
		transform: scale(1.1);
	}

	@media (max-width: 768px) {
		.hero {
			height: calc(100svh - 64px);
			min-height: 520px;
			max-height: none;
		}

		.hero-bg img {
			object-fit: cover;
			object-position: var(--mobile-pos, center center);
			width: 100%;
			height: 100%;
		}

		.hero-scrim {
			background:
				linear-gradient(
					to top,
					rgba(39, 45, 46, 0.74) 0%,
					rgba(39, 45, 46, 0.3) 42%,
					rgba(39, 45, 46, 0.08) 64%,
					transparent 82%
				),
				linear-gradient(to right, rgba(255, 255, 255, 0.06) 0%, transparent 48%);
		}

		.hero-dots {
			right: auto;
			left: 50%;
			transform: translateX(-50%);
			bottom: clamp(16px, 3vh, 24px);
		}

		.hero-text {
			padding-bottom: clamp(72px, 10vh, 96px);
		}

		.hero-copy {
			max-width: min(100%, 36rem);
		}

		.hero-label {
			margin-bottom: 10px;
		}

		.hero-headline {
			font-size: clamp(1.95rem, 8vw, 2.8rem);
			max-width: 13ch;
			margin-bottom: 10px;
		}

		.hero-subline {
			font-size: 0.96rem;
			line-height: 1.55;
			margin-bottom: 18px;
			max-width: 36ch;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-headline,
		.hero-subline,
		.hero-label,
		.hero-link {
			animation: none;
		}

		.hero-bg {
			transition: none;
		}
	}
</style>
