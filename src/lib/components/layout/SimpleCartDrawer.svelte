<script lang="ts">
	import { cart } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const itemLabel = $derived(
		cart.items.length === 1 ? 'produkt' : 'produktów'
	);
</script>

{#if open}
	<div class="fixed inset-0 z-50 overflow-hidden">
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
			role="button"
			tabindex="0"
			aria-label="Zamknij koszyk"
			onclick={onclose}
			onkeydown={(e) => e.key === 'Escape' && onclose()}
		></div>

		<!-- Drawer -->
		<div class="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl">
			<div class="flex h-full flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between p-6 bg-brand-600 text-white">
					<div>
						<h2 class="text-2xl font-bold">Koszyk</h2>
						<p class="text-sm opacity-90 mt-1">{cart.items.length} {itemLabel}</p>
					</div>
					<button onclick={onclose} class="p-2 hover:bg-white/20 rounded-xl transition-colors cursor-pointer" aria-label="Zamknij koszyk">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Items -->
				<div class="flex-1 overflow-y-auto p-6">
					{#if cart.items.length === 0}
						<div class="flex flex-col items-center justify-center h-full text-center">
							<div class="w-24 h-24 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
								<svg class="w-12 h-12 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<p class="text-neutral-800 text-xl font-semibold mb-2">Twój koszyk jest pusty</p>
							<p class="text-neutral-500">Odkryj nasze niesamowite produkty</p>
							<a href="/products" onclick={onclose} class="mt-6 inline-flex items-center justify-center px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 w-full">
								Przeglądaj Produkty
							</a>
						</div>
					{:else}
						<div class="space-y-4">
							{#each cart.items as item (item.productId)}
								<div class="group bg-neutral-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
									<div class="flex items-center gap-4">
										{#if item.image}
											<img src={item.image} alt={item.name} class="w-20 h-20 rounded-xl object-cover shadow-md" />
										{:else}
											<div class="w-20 h-20 rounded-xl bg-linear-to-br from-accent-100 to-brand-100 flex items-center justify-center">
												<svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
										{/if}

										<div class="flex-1">
											<h3 class="font-bold text-neutral-800">{item.name}</h3>
											<p class="text-lg font-bold text-brand-600">{item.price} zł</p>
										</div>

										<div class="flex items-center gap-2">
											<div class="flex items-center bg-white rounded-full shadow-md">
												<button onclick={() => cart.updateQuantity(item.productId, item.quantity - 1)} class="p-2 hover:bg-accent-100 rounded-l-full transition-colors cursor-pointer" aria-label="Mniej">
													<svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
												</button>
												<span class="px-4 font-bold text-neutral-800 min-w-10 text-center">{item.quantity}</span>
												<button onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)} class="p-2 hover:bg-accent-100 rounded-r-full transition-colors cursor-pointer" aria-label="Więcej">
													<svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
												</button>
											</div>
											<button onclick={() => cart.removeItem(item.productId)} class="p-2 text-danger hover:bg-danger-light rounded-xl transition-colors cursor-pointer" aria-label="Usuń">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Footer -->
				{#if cart.items.length > 0}
					<div class="p-6 bg-neutral-50 border-t border-neutral-200">
						<div class="flex justify-between items-center mb-6">
							<div>
								<p class="text-sm text-neutral-500">Suma całkowita</p>
								<p class="text-3xl font-bold text-brand-600">{cart.total.toFixed(2)} zł</p>
							</div>
							<div class="text-right">
								<p class="text-xs text-neutral-500">Darmowa dostawa od 200 zł</p>
							</div>
						</div>
						<Button href="/checkout" fullWidth onclick={onclose}>
							Przejdź do Płatności
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
