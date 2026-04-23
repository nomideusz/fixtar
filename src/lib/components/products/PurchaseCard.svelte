<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import {
		MinusIcon,
		PlusIcon,
		ShoppingCartSimpleIcon,
		LightningIcon,
		CheckIcon,
		ShieldCheckIcon
	} from 'phosphor-svelte';

	interface Props {
		price: number;
		maxQuantity: number;
		lowStockThreshold?: number;
		lowStockQuantity?: number;
		onAddToCart: (quantity: number) => void;
		onBuyNow: (quantity: number) => void;
	}

	let {
		price,
		maxQuantity,
		lowStockThreshold = 10,
		lowStockQuantity,
		onAddToCart,
		onBuyNow
	}: Props = $props();

	let quantity = $state(1);

	function adjustQuantity(delta: number) {
		const newQty = quantity + delta;
		if (newQty >= 1 && newQty <= maxQuantity) quantity = newQty;
	}

	const totalPrice = $derived((price * quantity).toFixed(2).replace('.', ','));
</script>

<Card class="purchase-card ft-purchase-card" padding="lg">
	<div class="purchase-stack">
		<div class="purchase-block">
			<label for="quantity" class="purchase-label">ilość</label>

			<div class="purchase-quantity-row">
				<div class="purchase-quantity" role="group" aria-label="Wybór ilości">
					<Button
						variant="ghost"
						size="sm"
						onclick={() => adjustQuantity(-1)}
						disabled={quantity <= 1}
						class="purchase-qty-btn"
					>
						<MinusIcon size={16} weight="bold" aria-hidden="true" />
					</Button>

					<div class="purchase-qty-value">{quantity}</div>

					<Button
						variant="ghost"
						size="sm"
						onclick={() => adjustQuantity(1)}
						disabled={quantity >= maxQuantity}
						class="purchase-qty-btn"
					>
						<PlusIcon size={16} weight="bold" aria-hidden="true" />
					</Button>
				</div>

				{#if lowStockQuantity && lowStockQuantity <= lowStockThreshold}
					<p class="purchase-stock-note">Tylko {lowStockQuantity} sztuk w magazynie</p>
				{/if}
			</div>
		</div>

		<div class="purchase-total">
			<span class="purchase-total-label">łączna cena</span>
			<span class="purchase-total-value">{totalPrice} zł</span>
		</div>

		<div class="purchase-actions">
			<Button onclick={() => onAddToCart(quantity)} class="w-full" size="lg">
				<ShoppingCartSimpleIcon size={20} weight="light" aria-hidden="true" />
				Dodaj do koszyka
			</Button>

			<button class="buy-now-btn" onclick={() => onBuyNow(quantity)}>
				<LightningIcon size={20} weight="fill" aria-hidden="true" />
				Kup teraz
			</button>
		</div>

		<div class="purchase-perks">
			<div class="purchase-perk">
				<CheckIcon size={16} weight="bold" class="text-success" aria-hidden="true" />
				<span>Darmowa dostawa od 200 zł</span>
			</div>
			<div class="purchase-perk">
				<ShieldCheckIcon
					size={16}
					weight="light"
					class="purchase-perk-icon ft-purchase-perk-icon"
					aria-hidden="true"
				/>
				<span>Gwarancja producenta</span>
			</div>
		</div>
	</div>
</Card>

<style>
	:global(.ft-purchase-card) {
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
	}

	.purchase-stack {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.purchase-block {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.purchase-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-text-muted);
	}

	.purchase-quantity-row {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.purchase-quantity {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		width: fit-content;
	}

	.purchase-qty-value {
		min-width: 56px;
		padding: 0 16px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-left: 1px solid var(--ft-line);
		border-right: 1px solid var(--ft-line);
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 400;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text);
	}

	:global(.purchase-qty-btn) {
		border-radius: 0 !important;
		border: 0 !important;
		min-width: 44px;
		padding-inline: 12px;
	}

	.purchase-stock-note {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-warning);
	}

	.purchase-total {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		background: var(--ft-surface);
	}

	.purchase-total-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-text-muted);
	}

	.purchase-total-value {
		font-family: var(--font-mono);
		font-size: clamp(1.25rem, 3vw, 1.5rem);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--ft-accent-text);
	}

	.purchase-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.purchase-perks {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		padding-top: 4px;
		color: var(--ft-text-muted);
		font-size: 0.9375rem;
	}

	.purchase-perk {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	:global(.ft-purchase-perk-icon) {
		color: var(--ft-accent-text);
	}

	.buy-now-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 48px;
		padding: 14px 32px;
		font-family: var(--font-sans);
		font-size: 1rem;
		font-weight: 400;
		color: var(--ft-accent-text);
		background: transparent;
		border: 1px solid var(--ft-accent-text);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.buy-now-btn:hover {
		background: var(--ft-accent-text);
		color: var(--ft-surface);
		border-color: var(--ft-accent-text);
	}

	@media (min-width: 640px) {
		.purchase-perks {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
