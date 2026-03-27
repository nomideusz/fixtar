<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';

	const { data } = $props<{ data: PageData }>();

	const favorites = $derived(data.favorites || []);

	let removing = $state<Record<string, boolean>>({});

	function startRemoving(productId: string) {
		removing = { ...removing, [productId]: true };
	}
</script>

<svelte:head>
	<title>Ulubione - FixTar</title>
	<meta name="description" content="Przeglądaj i zarządzaj swoimi ulubionymi produktami" />
</svelte:head>

<div>
	<!-- Page header -->
	<div class="mb-8">
		<h1 class="font-[--font-display] text-2xl font-bold text-[--ft-text-strong] mb-1">
			Ulubione
		</h1>
		<p class="text-sm text-[--ft-text-muted]">Produkty zapisane na później</p>
	</div>

	<!-- Empty state -->
	{#if favorites.length === 0}
		<div class="bg-[--ft-frost] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
			<svg
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
			{#each favorites as product (product.id)}
				<ProductCard {product} showBadges={true}>
					{#snippet actions()}
						<form
							method="POST"
							action="?/removeFavorite"
							use:enhance={() => {
								startRemoving(product.id);
								return ({ update }) => { update(); };
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
									       hover:text-[--ft-accent] hover:border-[--ft-accent]
									       disabled:opacity-50 disabled:cursor-not-allowed
									       transition-colors"
								>
									{removing[product.id] ? 'Usuwanie…' : 'Usuń'}
								</button>
							</div>
						</form>
					{/snippet}
				</ProductCard>
			{/each}
		</div>
	{/if}
</div>
