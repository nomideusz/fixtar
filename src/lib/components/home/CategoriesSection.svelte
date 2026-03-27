<script lang="ts">
	import imgDrill from '$lib/images/banners/hero-workshop-cordless-drill-1.png';
	import imgGrinder from '$lib/images/banners/hero-grinder-sparks-1.png';
	import imgHammer from '$lib/images/banners/hero-construction-hammer-drill-1.png';
	import imgGarden from '$lib/images/banners/hero-garden-trimmer.png';
	import imgSaw from '$lib/images/banners/hero-dramatic-workshop-1.png';
	import imgAccessories from '$lib/images/banners/hero-extreme-closeup-1.png';
	import imgFlatlay from '$lib/images/banners/hero-topdown-flatlay-1.png';
	import imgImpact from '$lib/images/banners/hero-impact-wrench-wheel.png';
	import imgProfessional from '$lib/images/banners/hero-professional-1.png';
	import imgWomanDrill from '$lib/images/banners/hero-woman-drill-shelf-1.png';
	import { WrenchIcon } from 'phosphor-svelte';

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
		'mlotowiertarki-i-mloty': { src: imgHammer, alt: 'Młoty i młotowiertarki' },
		'szlifierki-i-polerki': { src: imgGrinder, alt: 'Szlifierka kątowa z iskrami' },
		'pily-i-pilarki': { src: imgSaw, alt: 'Pilarki i piły — warsztat profesjonalny' },
		'pneumatyczne-i-budowlane': { src: imgProfessional, alt: 'Narzędzia dla profesjonalistów' },
		'ogrod-i-akcesoria': { src: imgGarden, alt: 'Narzędzia ogrodowe i akcesoria' }
	};

	function pluralProducts(count: number): string {
		if (count === 1) return '1 produkt';
		if (count >= 2 && count <= 4) return `${count} produkty`;
		return `${count} produktów`;
	}
</script>

<section class="categories ft-section">
	<div class="ft-container">
		<div class="categories-header">
			<h4 class="ft-label">Przeglądaj</h4>
			<h2 class="categories-title">Kategorie</h2>
		</div>

		<div class="categories-grid ft-stagger">
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
						{:else}
							<!-- Fallback icon for unmapped categories -->
							<div class="cat-fallback" aria-hidden="true">
								<WrenchIcon size={32} weight="light" />
							</div>
						{/if}
						<div class="cat-overlay">
							<span class="cat-name">{category.name}</span>
							<span class="cat-count">{pluralProducts(category.count)}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories-header {
		margin-bottom: 28px;
	}

	.categories-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 6px;
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
			grid-template-columns: repeat(6, 1fr);
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

	/* Fallback for categories without images */
	.cat-fallback {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-text-faint);
	}

	.cat-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 28px 12px 10px;
		background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.5) 100%);
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.cat-name {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.01em;
		line-height: 1.2;
	}

	.cat-count {
		font-size: 0.62rem;
		color: rgba(255, 255, 255, 0.65);
		font-weight: 400;
	}

	/* Frost fallback: no gradient needed, dark text */
	.cat-image:has(.cat-fallback) .cat-overlay {
		background: none;
	}

	.cat-image:has(.cat-fallback) .cat-name {
		color: var(--ft-dark);
	}

	.cat-image:has(.cat-fallback) .cat-count {
		color: var(--ft-text-muted);
	}
</style>
