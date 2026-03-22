<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import CategoriesSection from '$lib/components/home/CategoriesSection.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import BrandLogos from '$lib/components/home/BrandLogos.svelte';
	import FeaturesSection from '$lib/components/home/FeaturesSection.svelte';

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
	<title>FixTar - Profesjonalne Narzędzia i Elektronarzędzia</title>
	<meta
		name="description"
		content="Sklep z profesjonalnymi elektronarzędziami - szlifierki, wiertarki, młotowiertarki, piły. Bavaria, Magnum, Eurotec, Sterling."
	/>
</svelte:head>

<HeroSection featuredProduct={data.featuredProducts[0]} totalProducts={data.totalProducts} />
<CategoriesSection categories={data.categories} />
<FeaturedProducts products={data.featuredProducts} error={data.error} />
<BrandLogos />
<FeaturesSection />
