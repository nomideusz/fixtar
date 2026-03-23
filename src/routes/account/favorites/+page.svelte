<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { enhance } from '$app/forms';

	const { data } = $props<{ data: PageData }>();

	const favorites = $derived(data.favorites || []);

	let visible = $state(false);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('pl-PL', {
			style: 'currency',
			currency: 'PLN'
		}).format(amount);
	}

	let removing = $state<Record<string, boolean>>({});

	function startRemoving(productId: string) {
		removing = { ...removing, [productId]: true };
	}

	function calculateDiscount(price: number, compareAtPrice: number): number {
		if (!compareAtPrice || compareAtPrice <= price) return 0;
		return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
	}

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>Ulubione - FixTar</title>
	<meta name="description" content="Przeglądaj i zarządzaj swoimi ulubionymi produktami" />
</svelte:head>

<div in:fade={{ duration: 300 }}>
	<!-- Page header -->
	<div class="mb-8" in:fly={{ y: -16, duration: 400, delay: 150 }}>
		<h1 class="font-[--font-display] text-2xl font-bold text-[--ft-text-strong] mb-1">
			Ulubione
		</h1>
		<p class="text-sm text-[--ft-text-muted]">Produkty zapisane na później</p>
	</div>

	<!-- Empty state -->
	{#if favorites.length === 0}
		<div
			class="bg-[--ft-frost] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center"
			in:fly={{ y: 20, duration: 500, delay: 300 }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-12 h-12 text-[--ft-text-faint]"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
				/>
			</svg>
			<p class="text-[--ft-text-muted] text-base">Nie masz jeszcze ulubionych produktów.</p>
			<a
				href="/products"
				class="mt-2 text-sm font-medium text-[--ft-accent] underline underline-offset-4 hover:opacity-80 transition-opacity"
			>
				Przeglądaj produkty
			</a>
		</div>

	<!-- Products grid -->
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each favorites as product, i (product.id)}
				{#if visible}
					<div
						in:scale={{
							duration: 400,
							delay: 300 + i * 100,
							start: 0.8,
							easing: elasticOut
						}}
						class="group bg-[--ft-surface] border border-[--ft-line] rounded-xl overflow-hidden
						       flex flex-col transition-all duration-300
						       hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
					>
						<!-- Badges -->
						<div class="relative">
							<a
								href="/products/{product.slug || product.id}"
								class="block aspect-square overflow-hidden bg-[--ft-frost]"
							>
								<img
									src={product.mainImage}
									alt={product.name}
									width="400"
									height="400"
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</a>

							{#if product.featured || (product.compareAtPrice && product.compareAtPrice > product.price)}
								<div class="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
									{#if product.featured}
										<span
											class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
											       bg-[--ft-accent] text-white"
										>
											Polecany
										</span>
									{/if}
									{#if product.compareAtPrice && product.compareAtPrice > product.price}
										<span
											class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
											       bg-red-500 text-white"
										>
											−{calculateDiscount(product.price, product.compareAtPrice)}%
										</span>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Details -->
						<div class="flex flex-col flex-1 p-4 gap-3">
							<h3 class="font-[--font-body] text-sm font-medium leading-snug">
								<a
									href="/products/{product.slug || product.id}"
									class="text-[--ft-text] hover:text-[--ft-accent] transition-colors"
								>
									{product.name}
								</a>
							</h3>

							<div class="flex items-baseline gap-2">
								<span class="text-base font-semibold text-[--ft-text-strong]">
									{formatCurrency(product.price)}
								</span>
								{#if product.compareAtPrice && product.compareAtPrice > product.price}
									<span class="text-sm text-[--ft-text-muted] line-through">
										{formatCurrency(product.compareAtPrice)}
									</span>
								{/if}
							</div>

							<!-- Actions -->
							<form
								method="POST"
								action="?/removeFavorite"
								class="mt-auto"
								use:enhance={() => {
									startRemoving(product.id);
									return ({ update }) => {
										update();
									};
								}}
							>
								<input type="hidden" name="productId" value={product.id} />

								<div class="flex gap-2">
									<a
										href="/products/{product.slug || product.id}"
										class="flex-1 inline-flex items-center justify-center min-h-[44px] px-3
										       text-sm font-medium rounded-lg
										       bg-[--ft-accent] text-white
										       hover:opacity-90 active:opacity-80
										       transition-opacity"
									>
										Zobacz szczegóły
									</a>

									<button
										type="submit"
										disabled={removing[product.id]}
										class="flex-1 inline-flex items-center justify-center min-h-[44px] px-3
										       text-sm font-medium rounded-lg
										       border border-[--ft-line] text-[--ft-text-muted]
										       hover:text-red-500 hover:border-red-300
										       disabled:opacity-50 disabled:cursor-not-allowed
										       transition-colors"
									>
										{#if removing[product.id]}
											Usuwanie…
										{:else}
											Usuń
										{/if}
									</button>
								</div>
							</form>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
