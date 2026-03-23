<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import CategoriesSection from '$lib/components/home/CategoriesSection.svelte';

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

<HeroSection />
<FeaturedProducts products={data.featuredProducts} error={data.error} />
<CategoriesSection categories={data.categories} />
