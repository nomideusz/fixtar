<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ImageSquareIcon, SpinnerGapIcon, LockIcon, CheckIcon } from 'phosphor-svelte';
	import type { CartItem } from '$lib/stores/cart.svelte';

	interface Props {
		items: CartItem[];
		subtotal: number;
		shippingCost: number;
		paymentFee: number;
		tax: number;
		total: number;
		processing: boolean;
	}

	let { items, subtotal, shippingCost, paymentFee, tax, total, processing }: Props = $props();

	function formatPrice(value: number): string {
		return value.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

{#snippet imagePlaceholder()}
	<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[--ft-frost]">
		<ImageSquareIcon size={32} weight="light" class="text-[--ft-text-muted]" aria-hidden="true" />
	</div>
{/snippet}

<div class="sticky top-8">
	<Card class="p-8">
		<h2 class="mb-6 text-2xl font-bold text-[--ft-text]">Podsumowanie zamówienia</h2>

		<!-- Items -->
		<div class="mb-6 space-y-4">
			{#each items as item (item)}
				<div class="flex items-center space-x-4 rounded-xl bg-[--ft-frost] p-4">
					{#if item.image}
						<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" width="64" height="64" loading="lazy" />
						</div>
					{:else}
						{@render imagePlaceholder()}
					{/if}
					<div class="min-w-0 flex-1">
						<h3 class="truncate text-sm font-semibold text-[--ft-text]">{item.name}</h3>
						<p class="text-sm text-[--ft-text-muted]">Ilość: {item.quantity}</p>
						<p class="text-money text-sm font-bold">
							{formatPrice(item.price * item.quantity)}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Totals -->
		<div class="space-y-4 border-t border-[--ft-line] pt-6">
			<div class="flex justify-between text-sm">
				<span class="text-[--ft-text-muted]">Suma częściowa</span>
				<span class="font-semibold text-[--ft-text]">{formatPrice(subtotal)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-[--ft-text-muted]">Dostawa</span>
				<span class="font-semibold {shippingCost === 0 ? 'text-success' : 'text-[--ft-text]'}">
					{shippingCost === 0 ? 'Darmowa' : formatPrice(shippingCost)}
				</span>
			</div>
			{#if paymentFee > 0}
				<div class="flex justify-between text-sm">
					<span class="text-[--ft-text-muted]">Opłata za płatność</span>
					<span class="font-semibold text-[--ft-text]">{formatPrice(paymentFee)}</span>
				</div>
			{/if}
			<div class="flex justify-between text-sm">
				<span class="text-[--ft-text-muted]">VAT (23%)</span>
				<span class="font-semibold text-[--ft-text]">{formatPrice(tax)}</span>
			</div>
			<div class="flex justify-between border-t border-[--ft-line] pt-4 text-xl font-bold">
				<span class="text-[--ft-text]">Do zapłaty</span>
				<span class="text-money">{formatPrice(total)}</span>
			</div>
		</div>

		<!-- Submit Button -->
		<Button
			type="submit"
			fullWidth
			size="lg"
			disabled={processing}
			class="mt-8 bg-[--ft-cta] py-4 text-lg font-bold text-white hover:bg-[--ft-cta-hover] transition-colors duration-200"
		>
			{#if processing}
				<SpinnerGapIcon size={20} weight="bold" class="mr-3 -ml-1 h-5 w-5 animate-spin" aria-hidden="true" />
				Przetwarzanie zamówienia...
			{:else}
				<CheckIcon size={16} weight="bold" class="mr-2 h-5 w-5" aria-hidden="true" />
				Złóż zamówienie
			{/if}
		</Button>

		<!-- Security & Legal Notes -->
		<div class="mt-6 rounded-xl bg-[--ft-frost] p-4">
			<div class="mb-3 flex items-center text-sm text-[--ft-text-muted]">
				<LockIcon size={20} weight="light" class="text-success mr-2 h-4 w-4" aria-hidden="true" />
				Bezpieczne szyfrowane połączenie SSL
			</div>
			<div class="space-y-1 text-xs text-[--ft-text-muted]">
				<p>Składając zamówienie, akceptujesz nasz</p>
				<p>
					<a href="/regulamin" class="font-medium underline hover:text-[--ft-text]">Regulamin</a>
					&nbsp;i&nbsp;
					<a href="/polityka-prywatnosci" class="font-medium underline hover:text-[--ft-text]"
						>Politykę prywatności</a
					>
				</p>
			</div>
		</div>
	</Card>
</div>
