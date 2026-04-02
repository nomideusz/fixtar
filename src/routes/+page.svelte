<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import NavSearch from '$lib/components/layout/NavSearch.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import CategoriesSection from '$lib/components/home/CategoriesSection.svelte';
	import BrandLogos from '$lib/components/home/BrandLogos.svelte';
	import TestimonialsSection from '$lib/components/home/TestimonialsSection.svelte';
	import NewsletterSection from '$lib/components/home/NewsletterSection.svelte';
	import FlashSaleBanner from '$lib/components/home/FlashSaleBanner.svelte';
	import { lazyReveal } from '$lib/utils/lazy';

	interface Props {
		data: {
			featuredProducts: Product[];
			totalProducts: number;
			categories: Array<{ id: string; name: string; slug: string; count: number }>;
			dealsCount: number;
			error?: string;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>FixTar — Profesjonalne Elektronarzędzia</title>
	<meta
		name="description"
		content="Sklep z profesjonalnymi elektronarzędziami — szlifierki, wiertarki, młotowiertarki, piły. Bavaria, Magnum, Eurotec, Sterling. Dostawa 24h."
	/>
</svelte:head>

{#if data.dealsCount > 0}
	<FlashSaleBanner
		headline="Promocje — {data.dealsCount} {data.dealsCount === 1
			? 'produkt'
			: data.dealsCount < 5
				? 'produkty'
				: 'produktów'} w niższej cenie"
	/>
{:else}
	<FlashSaleBanner headline="Darmowa dostawa od 299 zł — sprawdź naszą ofertę" href="/products" />
{/if}
<HeroSection />

<div class="mobile-home-search">
	<div class="ft-container">
		<NavSearch />
	</div>
</div>

<CategoriesSection categories={data.categories} />
<div class="ft-lazy featured-wrap" use:lazyReveal>
	<FeaturedProducts products={data.featuredProducts} error={data.error} />
</div>
<div class="ft-lazy" use:lazyReveal>
	<BrandLogos />
</div>
<div class="ft-lazy" use:lazyReveal>
	<TestimonialsSection />
</div>
<div id="newsletter" class="ft-lazy" use:lazyReveal>
	<NewsletterSection />
</div>

<style>
	/* Reduce gap between Categories and Featured Products */
	.featured-wrap :global(.ft-section) {
		padding-top: 0;
	}

	.mobile-home-search {
		display: block;
		padding: 24px 0;
		background: var(--ft-surface);
		border-bottom: 1px solid var(--ft-line);
		position: relative;
		z-index: 40;
	}

	.mobile-home-search :global(.nav-search) {
		max-width: 100%;
	}

	@media (min-width: 768px) {
		.mobile-home-search {
			display: none;
		}
	}
</style>
