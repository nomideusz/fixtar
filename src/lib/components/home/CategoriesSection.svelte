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
						<span class="cat-name">{category.name}</span>
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
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 6px;
		border-left: 4px solid var(--ft-accent);
		padding-left: 14px;
		text-transform: uppercase;
		line-height: 1;
	}

	.categories-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 12px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-right: var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: 16px;
	}
	.categories-grid::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 640px) {
		.categories-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			margin: 0;
			padding: 0;
			overflow: visible;
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	.cat-card {
		display: flex;
		flex: 0 0 75%;
		height: 100%;
		scroll-snap-align: start;
		flex-direction: column;
		text-decoration: none;
		overflow: hidden;
		background: transparent;
		transition: transform 0.2s ease;
		/* Solid white structural block approach */
	}

	.cat-card:hover {
		/* Just rely on inner elements for hover */
	}

	.cat-image {
		position: relative;
		aspect-ratio: 4 / 3;
		background: var(--ft-frost);
		overflow: hidden;
		/* Remove border to let it sit flush */
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
		padding: 16px 16px 16px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		background: var(--ft-surface);
		position: relative;
	}

	.cat-info::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--ft-accent);
		transition: width 0.2s ease;
	}

	.cat-card:hover .cat-info::before {
		width: 6px;
	}

	.cat-name {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 800;
		color: var(--ft-text-strong);
		letter-spacing: 0.02em;
		line-height: 1.25;
		text-transform: uppercase;
		transition: color 0.2s ease;
	}

	.cat-card:hover .cat-name {
		color: var(--ft-accent);
	}

	@media (min-width: 640px) {
		.cat-card {
			flex: auto;
		}
	}
</style>
