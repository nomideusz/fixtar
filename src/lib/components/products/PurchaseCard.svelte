<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { MinusIcon, PlusIcon, ShoppingCartSimpleIcon, LightningIcon, CheckIcon, ShieldCheckIcon } from 'phosphor-svelte';

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

<Card class="border-[--ft-line] border bg-[--ft-surface] p-6 shadow-none">
	<div class="space-y-6">
		<!-- Quantity Selector -->
		<div>
			<label for="quantity" class="mb-3 block text-sm font-semibold text-[--ft-text]">Ilość</label>
			<div class="flex items-center gap-4">
				<div class="flex items-center border border-[--ft-line] bg-[--ft-surface]">
					<Button variant="ghost" size="sm" onclick={() => adjustQuantity(-1)} disabled={quantity <= 1} class="border-0">
						<MinusIcon size={16} weight="bold" aria-hidden="true" />
					</Button>
					<div class="min-w-15 px-4 py-2 text-center text-lg font-semibold text-[--ft-text]">{quantity}</div>
					<Button variant="ghost" size="sm" onclick={() => adjustQuantity(1)} disabled={quantity >= maxQuantity} class="border-0">
						<PlusIcon size={16} weight="bold" aria-hidden="true" />
					</Button>
				</div>

				{#if lowStockQuantity && lowStockQuantity <= lowStockThreshold}
					<span class="text-warning text-sm font-medium">Tylko {lowStockQuantity} sztuk w magazynie</span>
				{/if}
			</div>
		</div>

		<!-- Total Price -->
		<div class="flex items-center justify-between rounded-xl border border-[--ft-line] bg-[--ft-surface] px-4 py-4">
			<span class="text-sm font-semibold uppercase tracking-wider text-[--ft-text-muted]">Łączna cena:</span>
			<span class="text-money text-2xl font-bold">{(price * quantity).toFixed(2).replace('.', ',')} zł</span>
		</div>

		<!-- Add to Cart -->
		<Button onclick={() => onAddToCart(quantity)} class="w-full py-4 text-lg font-semibold transition-colors duration-200" size="lg">
			<ShoppingCartSimpleIcon size={20} weight="light" class="mr-2" aria-hidden="true" />
			Dodaj do koszyka
		</Button>

		<!-- Buy Now -->
		<button class="buy-now-btn" onclick={() => onBuyNow(quantity)}>
			<LightningIcon size={20} weight="fill" aria-hidden="true" />
			Kup teraz
		</button>

		<!-- Perks -->
		<div class="grid grid-cols-1 gap-4 text-sm text-[--ft-text-faint] sm:grid-cols-2">
			<div class="flex items-center gap-2">
				<CheckIcon size={16} weight="bold" class="text-success" aria-hidden="true" />
				Darmowa dostawa od 200 zł
			</div>
			<div class="flex items-center gap-2">
				<ShieldCheckIcon size={16} weight="light" class="text-[--ft-accent]" aria-hidden="true" />
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
		color: var(--ft-bg);
	}
</style>
