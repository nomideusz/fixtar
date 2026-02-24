<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import FeaturedProducts from '$lib/components/home/FeaturedProducts.svelte';
	import FeaturesSection from '$lib/components/home/FeaturesSection.svelte';
	import NewsletterSection from '$lib/components/home/NewsletterSection.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			featuredProducts: Product[];
			totalProducts: number;
			error?: string;
		};
	}

	let { data }: Props = $props();
	let scrollY = $state(0);

	onMount(() => {
		const onScroll = () => { scrollY = window.scrollY; };
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:head>
	<title>FixTar - Profesjonalne Narzędzia i Elektronarzędzia</title>
	<meta name="description" content="Sklep z profesjonalnymi narzędziami - pilarki, wiertarki, szlifierki, spawarki. Stihl, Makita, Bosch, DeWalt, Milwaukee." />
</svelte:head>

<HeroSection featuredProduct={data.featuredProducts[0]} {scrollY} />
<FeaturedProducts products={data.featuredProducts} error={data.error} />
<FeaturesSection />
<NewsletterSection /> 



