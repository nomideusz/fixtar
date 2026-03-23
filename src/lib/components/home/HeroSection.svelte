<script lang="ts">
	import { onMount } from 'svelte';

	interface Slide {
		kicker: string;
		headline: string;
		subline: string;
		link: { text: string; href: string };
	}

	interface Props {
		totalProducts?: number;
	}

	let { totalProducts = 0 }: Props = $props();

	const slides: Slide[] = [
		{
			kicker: 'Elektronarzędzia · Serwis · Dostawa 24h',
			headline: 'Precyzja w Każdym Cięciu',
			subline: 'Szlifierki, wiertarki, piły i młotowiertarki od sprawdzonych producentów.',
			link: { text: 'Przeglądaj produkty', href: '/products' }
		},
		{
			kicker: 'Outlet · Okazje · Niższe ceny',
			headline: 'Moc, Której Potrzebujesz',
			subline: 'Sprawdzone narzędzia w niższych cenach. Ta sama jakość, lepsza oferta.',
			link: { text: 'Zobacz promocje', href: '/deals' }
		},
		{
			kicker: 'Gwarancja · Zwroty · Wsparcie',
			headline: 'Narzędzia Na Lata',
			subline: 'Pełna gwarancja producenta, 14 dni na zwrot i eksperckie doradztwo.',
			link: { text: 'O nas', href: '/about' }
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
	onmouseenter={() => paused = true}
	onmouseleave={() => paused = false}
>
	<!-- Full-bleed image area — placeholder until real photography -->
	<div class="hero-image">
		<div class="hero-image-placeholder" aria-hidden="true">
			<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<polyline points="21 15 16 10 5 21" />
			</svg>
			<span>1920 × 600</span>
		</div>
	</div>

	<!-- Text overlay -->
	<div class="hero-overlay">
		<div class="hero-content" aria-live="polite">
			{#key current}
				<span class="hero-kicker">{slide.kicker}</span>
				<h1 class="hero-headline">{slide.headline}</h1>
				<p class="hero-subline">{slide.subline}</p>
				<a href={slide.link.href} class="hero-link">
					{slide.link.text}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
				</a>
			{/key}
		</div>
	</div>

	<!-- Slide indicators — minimal dots -->
	<div class="hero-indicators" role="tablist" aria-label="Slajdy">
		{#each slides as _, i}
			<button
				class="hero-indicator"
				class:is-active={i === current}
				role="tab"
				aria-selected={i === current}
				aria-label="Slajd {i + 1}"
				onclick={() => goto(i)}
			>
				{#if i === current}
					<span class="indicator-fill"></span>
				{/if}
			</button>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	/* ── Full-bleed image ── */
	.hero-image {
		width: 100%;
		height: clamp(360px, 56vh, 600px);
		background: var(--ft-frost);
	}

	.hero-image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		color: var(--ft-text-faint);
		background:
			linear-gradient(135deg, var(--ft-frost) 0%, #e4e9ef 100%);
	}

	.hero-image-placeholder span {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		opacity: 0.5;
	}

	/* ── Text overlay — positioned over image ── */
	.hero-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.55) 0%,
			rgba(0, 0, 0, 0.25) 40%,
			transparent 70%
		);
	}

	.hero-content {
		max-width: var(--ft-container);
		width: 100%;
		margin: 0 auto;
		padding: clamp(32px, 5vh, 56px) var(--ft-gutter);
		padding-right: 40%;
	}

	@media (max-width: 768px) {
		.hero-content {
			padding-right: var(--ft-gutter);
		}
	}

	.hero-kicker {
		display: block;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.65);
		margin-bottom: 12px;
		animation: heroFadeUp 0.4s ease both;
	}

	.hero-headline {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4.5vw, 3rem);
		font-weight: 800;
		line-height: 1.08;
		letter-spacing: -0.03em;
		color: white;
		margin-bottom: 12px;
		animation: heroFadeUp 0.4s 0.08s ease both;
	}

	.hero-subline {
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.7);
		max-width: 420px;
		margin-bottom: 20px;
		animation: heroFadeUp 0.4s 0.14s ease both;
	}

	.hero-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: gap 0.2s ease;
		animation: heroFadeUp 0.4s 0.2s ease both;
	}

	.hero-link:hover {
		gap: 12px;
		color: white;
	}

	@keyframes heroFadeUp {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── Indicators ── */
	.hero-indicators {
		position: absolute;
		bottom: clamp(16px, 3vh, 24px);
		right: var(--ft-gutter);
		display: flex;
		gap: 6px;
		z-index: 5;
	}

	.hero-indicator {
		width: 28px;
		height: 3px;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		border-radius: 2px;
		cursor: pointer;
		padding: 0;
		overflow: hidden;
		position: relative;
		transition: background 0.2s ease;
	}

	.hero-indicator.is-active {
		background: rgba(255, 255, 255, 0.2);
	}

	.indicator-fill {
		position: absolute;
		inset: 0;
		background: white;
		border-radius: 2px;
		animation: indicatorFill 6s linear forwards;
	}

	@keyframes indicatorFill {
		from { transform: scaleX(0); transform-origin: left; }
		to { transform: scaleX(1); transform-origin: left; }
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-kicker,
		.hero-headline,
		.hero-subline,
		.hero-link {
			animation: none;
		}
	}
</style>
