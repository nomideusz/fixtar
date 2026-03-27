<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
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

<FlashSaleBanner />
<HeroSection />
<CategoriesSection categories={data.categories} />
<div class="ft-lazy" use:lazyReveal>
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
