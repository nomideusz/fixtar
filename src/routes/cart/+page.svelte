<script lang="ts">
	import { cart } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

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

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<h1 class="mb-8 text-3xl font-bold text-white">Shopping Cart</h1>

	{#if cart.items.length === 0}
		<div class="py-16 text-center">
			<svg
				class="mx-auto h-24 w-24 text-neutral-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<h2 class="mt-4 text-xl font-semibold text-white">Your cart is empty</h2>
			<p class="mt-2 text-neutral-400">Start shopping to add items to your cart</p>
			<Button href="/products" class="mt-6">Browse Products</Button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Cart Items -->
			<div class="lg:col-span-2">
				<div class="border border-white/10 bg-white/5 p-6">
					<h2 class="mb-4 text-xl font-semibold">Cart Items ({cart.items.length})</h2>
					<div class="space-y-4">
						{#each cart.items as item (item)}
							<div class="flex items-center space-x-4 border-b py-4 last:border-0">
								{#if item.image}
									<img src={item.image} alt={item.name} class="h-20 w-20 rounded object-cover" />
								{:else}
									<div class="flex h-20 w-20 items-center justify-center rounded bg-white/10">
										<svg
											class="h-8 w-8 text-neutral-400"
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
								{/if}

								<div class="flex-1">
									<h3 class="font-medium text-white">{item.name}</h3>
									<p class="text-neutral-400">${item.price.toFixed(2)}</p>
								</div>

								<div class="flex items-center space-x-2">
									<button
										onclick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
										class="rounded border border-white/15 p-1 hover:bg-white/10"
										aria-label="Decrease quantity"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M20 12H4"
											/>
										</svg>
									</button>
									<span class="w-12 text-center font-medium">{item.quantity}</span>
									<button
										onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
										class="rounded border border-white/15 p-1 hover:bg-white/10"
										aria-label="Increase quantity"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
								</div>

								<div class="text-right">
									<p class="font-medium text-white">
										${(item.price * item.quantity).toFixed(2)}
									</p>
									<button
										onclick={() => cart.removeItem(item.productId)}
										class="text-danger hover:text-danger text-sm"
									>
										Remove
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="border border-white/10 bg-white/5 p-6">
					<h2 class="mb-4 text-xl font-semibold">Order Summary</h2>

					<!-- Coupon Code -->
					<div class="mb-4">
						<div class="flex space-x-2">
							<Input
								type="text"
								label="Coupon Code"
								placeholder="Enter code"
								value={couponCode}
								oninput={(e) => (couponCode = e.currentTarget.value)}
								class="flex-1"
							/>
							<Button onclick={applyCoupon} variant="secondary">Apply</Button>
						</div>
						{#if discount > 0}
							<p class="text-success mt-2 text-sm">Coupon applied! {discount * 100}% off</p>
						{/if}
					</div>

					<!-- Price Breakdown -->
					<div class="space-y-2 border-t py-4">
						<div class="flex justify-between">
							<span class="text-neutral-400">Subtotal</span>
							<span class="font-medium">${subtotal.toFixed(2)}</span>
						</div>
						{#if discount > 0}
							<div class="text-success flex justify-between">
								<span>Discount</span>
								<span>-${discountAmount.toFixed(2)}</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span class="text-neutral-400">Shipping</span>
							<span class="font-medium">Free</span>
						</div>
					</div>

					<!-- Total -->
					<div class="flex justify-between border-t py-4 text-lg font-semibold">
						<span>Total</span>
						<span>${total.toFixed(2)}</span>
					</div>

					<!-- Checkout Button -->
					<Button href="/checkout" fullWidth size="lg">Proceed to Checkout</Button>

					<!-- Continue Shopping -->
					<div class="mt-4 text-center">
						<a href="/products" class="text-brand-600 hover:text-brand-800 text-sm">
							Continue Shopping
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
