<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		/** First featured product to showcase on the right side */
		featuredProduct?: Product;
		scrollY?: number;
	}

	let { featuredProduct, scrollY = 0 }: Props = $props();

	const stats = [
		{ value: '5000+', label: 'Zadowolonych Klientów' },
		{ value: '1200+', label: 'Produktów w Ofercie' },
		{ value: '99%', label: 'Pozytywnych Opinii' }
	] as const;
</script>

<section class="relative min-h-screen flex items-center overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900">
		<div class="absolute inset-0 bg-black/20"></div>
	</div>

	<!-- Decorative orbs -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float"></div>
		<div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float-delayed"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 max-w-screen-2xl mx-auto px-6 py-32 sm:px-8 lg:px-12 w-full" style="transform: translateY({scrollY * 0.3}px)">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<!-- Left -->
			<div class="text-center lg:text-left">
				<div class="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white mb-8">
					<span class="relative flex h-3 w-3 mr-3">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
					</span>
					<span class="text-sm font-medium">Profesjonalne narzędzia najlepszych marek</span>
				</div>

				<h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8">
					<span class="text-white">Narzędzia</span><br />
					<span class="text-brand-400">Naty</span><br />
					<span class="text-white">i Seby</span>
				</h1>

				<p class="text-xl sm:text-2xl text-neutral-200 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
					Pilarki, wiertarki, szlifierki i więcej. Stihl, Makita, Bosch, DeWalt — najwyższa jakość w konkurencyjnych cenach.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<Button href="/products" class="shadow-2xl">Przeglądaj Produkty</Button>
					<Button href="/contact" variant="glass">
						<span class="flex items-center">
							Skontaktuj się z nami
							<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</Button>
				</div>

				<div class="grid grid-cols-3 gap-8 mt-16">
					{#each stats as stat (stat.label)}
						<div class="text-center lg:text-left">
							<p class="text-3xl font-bold text-white">{stat.value}</p>
							<p class="text-sm text-neutral-300 mt-1">{stat.label}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right: featured product showcase -->
			<div class="hidden lg:block">
				{#if featuredProduct}
					<div class="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl animate-float-subtle">
						<div class="flex flex-col h-full">
							<div class="mb-4 flex justify-between items-start">
								<span class="px-4 py-2 bg-brand-500/80 text-white text-sm font-bold rounded-full">⭐ Polecany</span>
								{#if featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price}
									<span class="px-4 py-2 bg-danger/80 text-white text-sm font-bold rounded-full">
										-{Math.round(((featuredProduct.compareAtPrice - featuredProduct.price) / featuredProduct.compareAtPrice) * 100)}%
									</span>
								{/if}
							</div>

							<div class="bg-linear-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-64">
								{#if featuredProduct.mainImage}
									<img src={featuredProduct.mainImage} alt={featuredProduct.name} class="max-w-full max-h-64 object-contain hover:scale-105 transition-transform duration-500" />
								{:else}
									<svg class="w-32 h-32 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								{/if}
							</div>

							<h3 class="text-xl font-bold text-white mb-2 line-clamp-2">{featuredProduct.name}</h3>
							<div class="flex items-center gap-3 mb-4">
								<p class="text-3xl font-bold text-brand-400">{featuredProduct.price.toFixed(2)} zł</p>
								{#if featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price}
									<p class="text-xl text-neutral-400 line-through">{featuredProduct.compareAtPrice.toFixed(2)} zł</p>
								{/if}
							</div>
							<a href="/products/{featuredProduct.slug || featuredProduct.id}" class="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-2xl shadow-lg transition-all duration-300">
								Zobacz Produkt
								<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
							</a>
						</div>
					</div>
				{:else}
					<!-- Fallback -->
					<div class="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl flex items-center justify-center min-h-96 animate-float-subtle">
						<div class="text-center">
							<div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-white mb-4">Profesjonalne Narzędzia</h3>
							<a href="/products" class="inline-flex items-center justify-center px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-2xl shadow-lg transition-all duration-300">Przeglądaj Produkty</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
			<div class="w-1 h-3 bg-white rounded-full mt-2 animate-scroll"></div>
		</div>
	</div>
</section>

<style>
	@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
	@keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
	@keyframes float-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
	@keyframes scroll { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(10px); opacity: 0; } }

	.animate-float { animation: float 6s ease-in-out infinite; }
	.animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
	.animate-float-subtle { animation: float-subtle 4s ease-in-out infinite; }
	.animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
</style>
