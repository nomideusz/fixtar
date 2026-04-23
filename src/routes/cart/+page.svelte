<script lang="ts">
	import { cart } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { ShoppingCartSimpleIcon, ImageSquareIcon, MinusIcon, PlusIcon } from 'phosphor-svelte';

	let couponCode = $state('');
	let discount = $state(0);

	function applyCoupon() {
		// Simple coupon logic
		if (couponCode.toUpperCase() === 'SAVE10') {
			discount = 0.1; // 10% discount
		} else if (couponCode.toUpperCase() === 'SAVE20') {
			discount = 0.2; // 20% discount
		} else {
			discount = 0;
		}
	}

	let subtotal = $derived(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
	let discountAmount = $derived(subtotal * discount);
	let total = $derived(subtotal - discountAmount);
</script>

<svelte:head>
	<title>Shopping Cart - FixTar</title>
	<meta name="description" content="Review your shopping cart" />
</svelte:head>

<div class="ft-container ft-section">
	<div class="mb-6 border-b border-[--ft-line] pb-3 sm:mb-8">
		<h1 class="text-2xl text-[--ft-text] sm:text-3xl">Koszyk</h1>
	</div>

	{#if cart.items.length === 0}
		<div class="py-16 text-center">
			<ShoppingCartSimpleIcon
				class="mx-auto h-24 w-24 text-[--ft-text-muted]"
				weight="thin"
				aria-hidden="true"
			/>
			<h2 class="mt-4 text-xl text-[--ft-text]">Twój koszyk jest pusty</h2>
			<p class="mt-2 text-[--ft-text-muted]">Dodaj produkty do koszyka, aby rozpocząć zakupy</p>
			<Button href="/products" class="mt-6">Przeglądaj produkty</Button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Cart Items -->
			<div class="lg:col-span-2">
				<div class="border border-[--ft-line] bg-[--ft-surface] p-4 sm:p-6">
					<h2 class="mb-4 text-lg text-[--ft-text] sm:text-xl">Produkty ({cart.items.length})</h2>
					<div class="space-y-4">
						{#each cart.items as item (item)}
							<div
								class="flex flex-col gap-3 border-b border-[--ft-line] py-4 last:border-0 sm:flex-row sm:items-center sm:gap-4"
							>
								<div class="flex items-center gap-3 sm:gap-4">
									{#if item.image}
										<img
											src={item.image}
											alt={item.name}
											class="h-16 w-16 rounded-sm border border-[--ft-line] object-cover sm:h-20 sm:w-20"
											width="80"
											height="80"
											loading="lazy"
										/>
									{:else}
										<div
											class="flex h-16 w-16 items-center justify-center rounded-sm border border-[--ft-line] bg-[--ft-surface] sm:h-20 sm:w-20"
										>
											<ImageSquareIcon class="h-8 w-8 text-[--ft-text-muted]" aria-hidden="true" />
										</div>
									{/if}

									<div class="min-w-0 flex-1">
										<h3 class="truncate text-[--ft-text]">{item.name}</h3>
										<p class="font-mono text-[--ft-text-muted]">{item.price.toFixed(2)} zł</p>
									</div>
								</div>

								<div class="flex items-center justify-between gap-4 sm:justify-end">
									<div class="flex items-center gap-2">
										<button
											onclick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
											class="flex h-10 w-10 items-center justify-center rounded-sm border border-[--ft-line] bg-[--ft-surface] hover:bg-[--ft-frost]"
											aria-label="Zmniejsz ilość"
										>
											<MinusIcon class="h-4 w-4" aria-hidden="true" />
										</button>
										<span class="w-10 text-center font-mono text-[--ft-text]">{item.quantity}</span>
										<button
											onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
											class="flex h-10 w-10 items-center justify-center rounded-sm border border-[--ft-line] bg-[--ft-surface] hover:bg-[--ft-frost]"
											aria-label="Zwiększ ilość"
										>
											<PlusIcon class="h-4 w-4" aria-hidden="true" />
										</button>
									</div>

									<div class="text-right">
										<p class="font-mono text-[--ft-text]">
											{(item.price * item.quantity).toFixed(2)} zł
										</p>
										<button
											onclick={() => cart.removeItem(item.productId)}
											class="text-sm text-[--ft-text-muted] hover:text-[--ft-text]"
										>
											Usuń
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="border border-[--ft-line] bg-[--ft-surface] p-4 sm:p-6">
					<h2 class="mb-4 text-lg text-[--ft-text] sm:text-xl">Podsumowanie</h2>

					<!-- Coupon Code -->
					<div class="mb-4">
						<div class="flex flex-col gap-2 sm:flex-row">
							<Input
								type="text"
								label="Kod rabatowy"
								placeholder="Wpisz kod"
								value={couponCode}
								oninput={(e) => (couponCode = e.currentTarget.value)}
								class="flex-1"
							/>
							<Button onclick={applyCoupon} variant="secondary">Zastosuj</Button>
						</div>
						{#if discount > 0}
							<p class="text-success mt-2 font-mono text-sm">
								Kod zastosowany! {discount * 100}% zniżki
							</p>
						{/if}
					</div>

					<!-- Price Breakdown -->
					<div class="space-y-2 border-t py-4">
						<div class="flex justify-between">
							<span class="text-[--ft-text-muted]">Suma częściowa</span>
							<span class="font-mono text-[--ft-text]">{subtotal.toFixed(2)} zł</span>
						</div>
						{#if discount > 0}
							<div class="text-success flex justify-between">
								<span>Rabat</span>
								<span class="font-mono">-{discountAmount.toFixed(2)} zł</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span class="text-[--ft-text-muted]">Dostawa</span>
							<span class="font-mono text-[--ft-text]">Darmowa</span>
						</div>
					</div>

					<!-- Total -->
					<div class="flex justify-between border-t border-[--ft-line] py-4 text-lg">
						<span class="text-[--ft-text]">Razem</span>
						<span class="font-mono text-[--ft-accent]">{total.toFixed(2)} zł</span>
					</div>

					<!-- Checkout Button -->
					<Button href="/checkout" fullWidth size="lg">Przejdź do kasy</Button>

					<!-- Continue Shopping -->
					<div class="mt-4 text-center">
						<a
							href="/products"
							class="font-mono text-sm text-[--ft-text-muted] hover:text-[--ft-text]"
						>
							Kontynuuj zakupy
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
