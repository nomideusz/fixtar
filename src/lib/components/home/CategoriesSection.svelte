<script lang="ts">
	import imgDrill from '$lib/images/banners/banner-workshop-cordless-drill-1.webp';
	import imgGrinder from '$lib/images/banners/banner-grinder-sparks-1.webp';
	import imgHammer from '$lib/images/banners/banner-construction-hammer-drill-1.webp';
	import imgGarden from '$lib/images/banners/banner-garden-trimmer.webp';
	import imgSaw from '$lib/images/banners/banner-dramatic-workshop-1.webp';
	import imgAccessories from '$lib/images/banners/banner-extreme-closeup-1.webp';
	import imgFlatlay from '$lib/images/banners/banner-topdown-flatlay-1.webp';
	import imgImpact from '$lib/images/banners/banner-impact-wrench-wheel.webp';
	import imgProfessional from '$lib/images/banners/banner-professional-1.webp';
	import imgWomanDrill from '$lib/images/banners/banner-woman-drill-shelf-1.webp';
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
</script>

<section class="categories ft-section">
	<div class="ft-container">
		<div class="categories-header">
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
					</div>
					<div class="cat-info">
						<span class="cat-name"
							>{category.slug === 'pneumatyczne-i-budowlane'
								? 'Narzędzia Budowlane'
								: category.name}</span
						>
						<!-- Product count removed for minimal design -->
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories-header {
		margin-bottom: 32px;
	}

	.categories-title {
		font-family: var(--font-sans);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 600;
		color: var(--ft-dark);
		letter-spacing: -0.015em;
		margin-top: 6px;
		
		
		text-transform: none;
		line-height: 1;
	}

	/* Mobile: 2-column grid of text blocks */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 1fr;
		gap: 12px;
		margin: 0;
		padding: 0 0 16px 0;
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
		display: flex;
		flex-direction: column;
		text-decoration: none;
		overflow: hidden;
		background: var(--ft-surface);
		transition: transform 0.2s ease;
		border: 1px solid var(--ft-line); border-radius: var(--radius-2xl);
	}

	.cat-card:hover {
		transform: translateY(-2px);
	}

	/* Hide image on mobile, show on tablet+ */
	.cat-image {
		display: none;
	}

	@media (min-width: 640px) {
		.cat-image {
			display: block;
			position: relative;
			aspect-ratio: 4 / 3;
			background: var(--ft-frost);
			overflow: hidden;
			
		}
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

	.cat-info {
		padding: 16px 12px 16px 16px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		background: var(--ft-surface);
		position: relative;
	}

	

	.cat-card:hover 

	.cat-name {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		letter-spacing: 0.02em;
		line-height: 1.25;
		text-transform: none;
		transition: color 0.2s ease;
	}

	@media (min-width: 640px) {
		.cat-name {
			font-size: 1rem;
		}

		.cat-info {
			padding: 16px 16px 16px 20px;
		}
	}

	.cat-card:hover .cat-name {
		color: var(--ft-accent);
	}
</style>
