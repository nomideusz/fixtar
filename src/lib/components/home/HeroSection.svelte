<script lang="ts">
	import { onMount } from 'svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Slide {
		kicker: string;
		headline: string;
		headlineAccent?: string;
		description: string;
		cta: { text: string; href: string };
		gradient: string;
	}

	interface Props {
		featuredProduct?: Product;
		totalProducts?: number;
	}

	let { featuredProduct, totalProducts = 0 }: Props = $props();

	const slides: Slide[] = [
		{
			kicker: 'Elektronarzędzia · Serwis · Dostawa 24h',
			headline: 'Precyzja w Każdym',
			headlineAccent: 'Cięciu.',
			description: 'Szlifierki, wiertarki, piły i młotowiertarki. Profesjonalne marki w cenach, które docenisz.',
			cta: { text: 'Przeglądaj Produkty', href: '/products' },
			gradient: 'radial-gradient(ellipse 120% 80% at 80% 30%, rgba(1,71,131,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 20% 80%, rgba(255,107,0,0.06) 0%, transparent 50%)'
		},
		{
			kicker: 'Outlet · Okazje · Niższe ceny',
			headline: 'Moc, Której',
			headlineAccent: 'Potrzebujesz.',
			description: 'Sprawdzone narzędzia w niższych cenach. Ta sama jakość, lepsza oferta.',
			cta: { text: 'Zobacz Promocje', href: '/deals' },
			gradient: 'radial-gradient(ellipse 120% 80% at 70% 40%, rgba(255,107,0,0.1) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 10% 70%, rgba(1,71,131,0.08) 0%, transparent 50%)'
		},
		{
			kicker: 'Gwarancja · Zwroty · Wsparcie',
			headline: 'Narzędzia Na',
			headlineAccent: 'Lata.',
			description: 'Pełna gwarancja producenta, 14 dni na zwrot i eksperckie doradztwo techniczne.',
			cta: { text: 'O Nas', href: '/about' },
			gradient: 'radial-gradient(ellipse 120% 80% at 30% 30%, rgba(62,139,139,0.1) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 90% 80%, rgba(1,71,131,0.06) 0%, transparent 50%)'
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
	<!-- Slide background -->
	<div class="hero-bg" style="background-image: {slide.gradient}"></div>

	<!-- Photo placeholder area — will hold lifestyle images later -->
	<div class="hero-photo-area" aria-hidden="true">
		<div class="hero-photo-placeholder">
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
				<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
			</svg>
		</div>
	</div>

	<div class="hero-inner">
		<div class="hero-content" aria-live="polite">
			<div class="hero-kicker">{slide.kicker}</div>

			<h1 class="hero-title">
				{slide.headline}<br />
				{#if slide.headlineAccent}
					<span class="hero-accent">{slide.headlineAccent}</span>
				{/if}
			</h1>

			<p class="hero-desc">{slide.description}</p>

			<a href={slide.cta.href} class="hero-cta">
				{slide.cta.text}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
			</a>
		</div>
	</div>

	<!-- Slide indicators -->
	<div class="hero-dots" role="tablist" aria-label="Slajdy">
		{#each slides as _, i}
			<button
				class="hero-dot"
				class:is-active={i === current}
				role="tab"
				aria-selected={i === current}
				aria-label="Slajd {i + 1}"
				onclick={() => goto(i)}
			>
				{#if i === current}
					<span class="dot-progress"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Stats strip -->
	<div class="stats-strip">
		<div class="stats-inner">
			<div class="stat">
				<span class="stat-value">{totalProducts}+</span>
				<span class="stat-label">Produktów</span>
			</div>
			<span class="stat-dot" aria-hidden="true">·</span>
			<div class="stat">
				<span class="stat-value">4</span>
				<span class="stat-label">Marki</span>
			</div>
			<span class="stat-dot" aria-hidden="true">·</span>
			<div class="stat">
				<span class="stat-value">24h</span>
				<span class="stat-label">Wysyłka</span>
			</div>
			<span class="stat-dot" aria-hidden="true">·</span>
			<div class="stat">
				<span class="stat-value">14</span>
				<span class="stat-label">Dni na zwrot</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: clamp(480px, 70vh, 680px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* ── Background ── */
	.hero-bg {
		position: absolute;
		inset: 0;
		transition: background-image 0.8s ease;
		z-index: 0;
	}

	/* ── Photo placeholder — right side on desktop ── */
	.hero-photo-area {
		display: none;
	}

	@media (min-width: 1024px) {
		.hero-photo-area {
			display: flex;
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: 45%;
			align-items: center;
			justify-content: center;
			z-index: 1;
		}
	}

	.hero-photo-placeholder {
		width: 280px;
		height: 280px;
		border-radius: 50%;
		background: var(--ft-frost);
		border: 1px dashed var(--ft-line);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-text-faint);
		opacity: 0.5;
	}

	/* ── Content ── */
	.hero-inner {
		position: relative;
		z-index: 2;
		flex: 1;
		display: flex;
		align-items: center;
		max-width: var(--ft-container);
		width: 100%;
		margin: 0 auto;
		padding: clamp(100px, 12vh, 160px) var(--ft-gutter) clamp(60px, 8vh, 100px);
	}

	.hero-content {
		max-width: 560px;
	}

	.hero-kicker {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--ft-accent);
		margin-bottom: 20px;
		opacity: 0;
		animation: fadeUp 0.5s ease forwards;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 6vw, 4.2rem);
		font-weight: 800;
		line-height: 1.04;
		color: var(--ft-dark);
		letter-spacing: -0.04em;
		margin-bottom: 20px;
		opacity: 0;
		animation: fadeUp 0.5s 0.1s ease forwards;
	}

	.hero-accent {
		color: var(--ft-cta);
	}

	.hero-desc {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ft-text-muted);
		max-width: 440px;
		margin-bottom: 32px;
		opacity: 0;
		animation: fadeUp 0.5s 0.2s ease forwards;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: var(--ft-cta);
		color: white;
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		padding: 16px 36px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
		opacity: 0;
		animation: fadeUp 0.5s 0.3s ease forwards;
	}

	.hero-cta:hover {
		background: var(--ft-cta-hover);
		color: white;
		box-shadow: 0 6px 24px rgba(255, 107, 0, 0.25);
		transform: translateY(-1px);
	}

	/* ── Slide indicators ── */
	.hero-dots {
		position: absolute;
		bottom: clamp(80px, 10vh, 110px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 8px;
		z-index: 5;
	}

	.hero-dot {
		width: 32px;
		height: 3px;
		background: var(--ft-line);
		border: none;
		border-radius: 2px;
		cursor: pointer;
		padding: 0;
		overflow: hidden;
		position: relative;
		transition: background 0.2s ease;
	}

	.hero-dot.is-active {
		background: rgba(1, 71, 131, 0.2);
	}

	.dot-progress {
		position: absolute;
		inset: 0;
		background: var(--ft-cta);
		border-radius: 2px;
		animation: dotFill 6s linear forwards;
	}

	@keyframes dotFill {
		from { transform: scaleX(0); transform-origin: left; }
		to { transform: scaleX(1); transform-origin: left; }
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── Stats strip ── */
	.stats-strip {
		position: relative;
		z-index: 3;
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
		background: var(--ft-surface);
	}

	.stats-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 20px var(--ft-gutter);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ft-dark);
	}

	.stat-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
	}

	.stat-dot {
		color: var(--ft-text-faint);
		font-size: 0.8rem;
	}

	@media (max-width: 640px) {
		.stats-inner { gap: 16px 24px; }
		.stat-dot { display: none; }
	}
</style>
