<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import FeaturesSection from '$lib/components/home/FeaturesSection.svelte';
	import TikTokEmbed from '$lib/components/home/TikTokEmbed.svelte';

	interface Props {
		data: {
			featuredProducts: Product[];
			error?: string;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>FixTar - Profesjonalne Narzędzia i Elektronarzędzia</title>
	<meta
		name="description"
		content="Sklep z profesjonalnymi narzędziami - pilarki, wiertarki, szlifierki, spawarki. Stihl, Makita, Bosch, DeWalt, Milwaukee."
	/>
</svelte:head>

<HeroSection featuredProduct={data.featuredProducts[0]} />
<FeaturedProducts products={data.featuredProducts} error={data.error} />
<FeaturesSection />
<TikTokEmbed />
