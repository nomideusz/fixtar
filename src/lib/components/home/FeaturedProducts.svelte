<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		products: Product[];
		error?: string;
	}

	let { products, error }: Props = $props();
</script>

<section class="py-24 relative bg-linear-to-b from-neutral-50 to-white">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
		<div class="text-center mb-20">
			<h2 class="text-6xl lg:text-7xl xl:text-8xl font-black text-neutral-900 mb-6">Wybrane Produkty</h2>
			<p class="text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto">
				Starannie wyselekcjonowane produkty, które pokochają nasi klienci
			</p>
		</div>

		{#if error}
			<div class="relative bg-white rounded-3xl p-12 shadow-xl text-center">
				<div class="w-24 h-24 mx-auto mb-6 bg-danger-light rounded-full flex items-center justify-center">
					<svg class="w-12 h-12 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-neutral-900 mb-4">Ups! Coś poszło nie tak</h3>
				<p class="text-neutral-600 mb-8">{error}</p>
				<Button href="/products">Spróbuj Ponownie</Button>
			</div>
		{:else if products.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
				{#each products.slice(0, 8) as product, i (product.id)}
					<div class="{i === 0 ? 'md:col-span-2 md:row-span-2' : ''} {i === 3 ? 'lg:col-span-2' : ''}">
						{#if i === 0}
							<!-- Featured large card -->
							<div class="group h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
								<div class="h-full min-h-125 p-8 flex flex-col">
									<div class="flex-1">
										<span class="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-full mb-6">🔥 Bestseller</span>
										<h3 class="text-3xl font-bold text-neutral-900 mb-4 group-hover:text-brand-700 transition-colors">{product.name}</h3>
										<p class="text-neutral-600 text-lg mb-6 line-clamp-3">{product.description || 'Odkryj najwyższą jakość i innowacyjny design'}</p>
										<p class="text-4xl font-bold text-brand-600">{product.price} zł</p>
									</div>
									{#if product.mainImage}
										<div class="mt-6 relative h-64 rounded-2xl overflow-hidden shrink-0">
											<img src={product.mainImage} alt={product.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
										</div>
									{/if}
								</div>
							</div>
						{:else}
							<ProductCard {product} />
						{/if}
					</div>
				{/each}
			</div>

			<div class="mt-20 text-center">
				<Button href="/products" class="group text-lg px-12 py-6 rounded-full shadow-2xl">
					<span class="flex items-center">
						Zobacz Wszystkie Produkty
						<svg class="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</span>
				</Button>
			</div>
		{:else}
			<div class="bg-white rounded-3xl p-16 shadow-xl text-center">
				<div class="w-32 h-32 mx-auto mb-8 bg-accent-100 rounded-full flex items-center justify-center">
					<svg class="w-16 h-16 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
				</div>
				<h3 class="text-3xl font-bold text-neutral-900 mb-4">Przygotowujemy Coś Specjalnego</h3>
				<p class="text-xl text-neutral-600 mb-8 max-w-md mx-auto">Nasza nowa kolekcja już wkrótce.</p>
				<Button href="/contact">Powiadom Mnie</Button>
			</div>
		{/if}
	</div>
</section>
