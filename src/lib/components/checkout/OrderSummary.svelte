<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
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
		return value.toFixed(2) + ' zł';
	}
</script>

{#snippet imagePlaceholder()}
	<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[--ft-frost]">
		<svg
			class="h-8 w-8 text-[--ft-text-muted]"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		</svg>
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
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
						</div>
					{:else}
						{@render imagePlaceholder()}
					{/if}
					<div class="min-w-0 flex-1">
						<h3 class="truncate text-sm font-semibold text-[--ft-text]">{item.name}</h3>
						<p class="text-sm text-[--ft-text-muted]">Ilość: {item.quantity}</p>
						<p class="text-brand-600 text-sm font-bold">
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
				<span class="text-brand-600">{formatPrice(total)}</span>
			</div>
		</div>

		<!-- Submit Button -->
		<Button
			type="submit"
			fullWidth
			size="lg"
			disabled={processing}
			class="from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 mt-8 transform rounded-2xl bg-linear-to-r py-4 text-lg font-bold text-[--ft-text] shadow-lg transition-all duration-300 hover:scale-105"
		>
			{#if processing}
				<svg
					class="mr-3 -ml-1 h-5 w-5 animate-spin text-[--ft-text]"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Przetwarzanie zamówienia...
			{:else}
				<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Złóż zamówienie
			{/if}
		</Button>

		<!-- Security & Legal Notes -->
		<div class="mt-6 rounded-xl bg-[--ft-frost] p-4">
			<div class="mb-3 flex items-center text-sm text-[--ft-text-muted]">
				<svg
					class="text-success mr-2 h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
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
