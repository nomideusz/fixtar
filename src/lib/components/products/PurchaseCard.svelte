<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		price: number;
		maxQuantity: number;
		lowStockThreshold?: number;
		lowStockQuantity?: number;
		onAddToCart: (quantity: number) => void;
		onBuyNow: (quantity: number) => void;
	}

	let { price, maxQuantity, lowStockThreshold = 10, lowStockQuantity, onAddToCart, onBuyNow }: Props = $props();

	let quantity = $state(1);

	function adjustQuantity(delta: number) {
		const newQty = quantity + delta;
		if (newQty >= 1 && newQty <= maxQuantity) quantity = newQty;
	}
</script>

<Card class="border-[--ft-accent]/20 border bg-[--ft-frost] p-6">
	<div class="space-y-6">
		<!-- Quantity Selector -->
		<div>
			<label for="quantity" class="mb-3 block text-sm font-semibold text-[--ft-text]">Ilość</label>
			<div class="flex items-center gap-4">
				<div class="flex items-center rounded-xl border border-[--ft-line] bg-[--ft-surface] shadow-sm">
					<Button variant="ghost" size="sm" onclick={() => adjustQuantity(-1)} disabled={quantity <= 1} class="rounded-l-xl rounded-r-none border-0">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
					</Button>
					<div class="min-w-15 px-4 py-2 text-center text-lg font-semibold text-[--ft-text]">{quantity}</div>
					<Button variant="ghost" size="sm" onclick={() => adjustQuantity(1)} disabled={quantity >= maxQuantity} class="rounded-l-none rounded-r-xl border-0">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
					</Button>
				</div>

				{#if lowStockQuantity && lowStockQuantity <= lowStockThreshold}
					<span class="text-warning text-sm font-medium">Tylko {lowStockQuantity} sztuk w magazynie</span>
				{/if}
			</div>
		</div>

		<!-- Total Price -->
		<div class="flex items-center justify-between rounded-xl border border-[--ft-line] bg-[--ft-surface] px-4 py-4">
			<span class="text-lg font-semibold text-[--ft-text]">Łączna cena:</span>
			<span class="text-[--ft-accent] text-2xl font-bold">{(price * quantity).toFixed(2)} zł</span>
		</div>

		<!-- Add to Cart -->
		<Button onclick={() => onAddToCart(quantity)} class="w-full py-4 text-lg font-semibold transition-colors duration-200" size="lg">
			<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			Dodaj do koszyka
		</Button>

		<!-- Buy Now -->
		<button class="buy-now-btn" onclick={() => onBuyNow(quantity)}>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			Kup teraz
		</button>

		<!-- Perks -->
		<div class="grid grid-cols-1 gap-4 text-sm text-[--ft-text-faint] sm:grid-cols-2">
			<div class="flex items-center gap-2">
				<svg class="text-success h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				Darmowa dostawa od 200 zł
			</div>
			<div class="flex items-center gap-2">
				<svg class="text-[--ft-accent] h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Gwarancja producenta
			</div>
		</div>
	</div>
</Card>

<style>
	.buy-now-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 48px;
		padding: 12px 20px;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-accent);
		background: transparent;
		border: 2px solid var(--ft-accent);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.buy-now-btn:hover {
		background: var(--ft-accent);
		color: white;
	}
</style>
