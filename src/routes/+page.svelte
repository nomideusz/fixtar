<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import TrustBar from '$lib/components/home/TrustBar.svelte';
	import CategoriesSection from '$lib/components/home/CategoriesSection.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import StatsBar from '$lib/components/home/StatsBar.svelte';
	import ClubSection from '$lib/components/home/ClubSection.svelte';
	import TestimonialsSection from '$lib/components/home/TestimonialsSection.svelte';
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
	<title>FIXTAR — Profesjonalne Elektronarzędzia</title>
	<meta
		name="description"
		content="Sklep z profesjonalnymi elektronarzędziami — szlifierki, wiertarki, młotowiertarki, piły. Bavaria, Magnum, Eurotec, Sterling. Dostawa 24h."
	/>
</svelte:head>

<HeroSection />

<TrustBar />

<CategoriesSection categories={data.categories} />

<div class="ft-lazy" use:lazyReveal>
	<FeaturedProducts products={data.featuredProducts} error={data.error} />
</div>

<div class="ft-lazy" use:lazyReveal>
	<StatsBar />
</div>

<div id="club" class="ft-lazy" use:lazyReveal>
	<ClubSection />
</div>

<div class="ft-lazy" use:lazyReveal>
	<TestimonialsSection />
</div>
