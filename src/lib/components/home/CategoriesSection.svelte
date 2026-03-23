<script lang="ts">
	import imgDrill from '$lib/images/banners/hero-workshop-cordless-drill-1.png';
	import imgGrinder from '$lib/images/banners/hero-grinder-sparks-1.png';
	import imgHammer from '$lib/images/banners/hero-construction-hammer-drill-1.png';
	import imgGarden from '$lib/images/banners/hero-garden-trimmer.png';
	import imgSaw from '$lib/images/banners/hero-dramatic-workshop-1.png';
	import imgAccessories from '$lib/images/banners/hero-extreme-closeup-1.png';
	import imgFlatlay from '$lib/images/banners/hero-topdown-flatlay-1.png';
	import imgImpact from '$lib/images/banners/hero-impact-wrench-wheel.png';

	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	const categoryImages: Record<string, { src: string; alt: string }> = {
		'wiertarki-i-wkretarki': { src: imgDrill, alt: 'Wiertarka akumulatorowa w warsztacie' },
		'szlifierki-i-polerki': { src: imgGrinder, alt: 'Szlifierka kątowa z iskrami' },
		'mloty-i-mlotowiertarki': { src: imgHammer, alt: 'Młotowiertarka na budowie' },
		'mlotowiertarki': { src: imgHammer, alt: 'Młotowiertarka na budowie' },
		'mloty': { src: imgHammer, alt: 'Młot udarowy' },
		'dom-i-ogrod': { src: imgGarden, alt: 'Narzędzia ogrodowe' },
		'ogrod': { src: imgGarden, alt: 'Narzędzia ogrodowe' },
		'pily-i-pilarki': { src: imgSaw, alt: 'Pilarki i piły — warsztat profesjonalny' },
		'pilarki': { src: imgSaw, alt: 'Pilarki i piły' },
		'zestawy-i-akcesoria': { src: imgAccessories, alt: 'Akcesoria i zestawy narzędziowe' },
		'akcesoria': { src: imgAccessories, alt: 'Akcesoria narzędziowe' },
		'klucze-udarowe': { src: imgImpact, alt: 'Klucz udarowy przy kole' },
		'spawarki': { src: imgFlatlay, alt: 'Profesjonalne narzędzia spawalnicze' }
	};
</script>

<section class="categories ft-section">
	<div class="ft-container">
		<h2 class="categories-title">Kategorie</h2>

		<div class="categories-grid">
			{#each categories as category (category.id)}
				{@const img = categoryImages[category.slug]}
				<a href="/products?category={category.slug}" class="cat-card">
					<div class="cat-image">
						{#if img}
							<img
								src={img.src}
								alt={img.alt}
								width="480"
								height="360"
								loading="lazy"
								class="cat-photo"
							/>
						{/if}
						<span class="cat-overlay">{category.name}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories-title {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		font-weight: 700;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		margin-bottom: 32px;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.cat-card {
		display: block;
		text-decoration: none;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.cat-image {
		position: relative;
		aspect-ratio: 4 / 3;
		background: var(--ft-frost);
		overflow: hidden;
		border-radius: var(--radius-md);
	}

	.cat-photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 350ms ease;
	}

	.cat-card:hover .cat-photo {
		transform: scale(1.04);
	}

	.cat-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24px 12px 10px;
		background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.45) 100%);
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.01em;
		line-height: 1.2;
	}

	/* Frost fallback: overlay still shows name, just no photo */
	.cat-image:not(:has(.cat-photo)) .cat-overlay {
		background: none;
		color: var(--ft-text-strong);
	}
</style>
