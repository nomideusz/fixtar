<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CustomBadge from '$lib/components/ui/CustomBadge.svelte';
	import { formatPrice } from '$lib/utils';

	interface Props {
		data: {
			order: any;
			user: any;
		};
	}

	let { data }: Props = $props();

	// Order status configuration
	const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
		pending: { label: 'Oczekuje', color: 'bg-warning/10 text-warning-dark', icon: '🕒' },
		processing: { label: 'W realizacji', color: 'bg-brand-100 text-brand-800', icon: '⚙️' },
		shipped: { label: 'Wysłane', color: 'bg-accent-100 text-accent-800', icon: '🚚' },
		delivered: { label: 'Dostarczone', color: 'bg-success/10 text-success-dark', icon: '✅' },
		cancelled: { label: 'Anulowane', color: 'bg-danger/10 text-danger-dark', icon: '❌' },
		refunded: { label: 'Zwrócone', color: 'bg-neutral-100 text-neutral-200', icon: '💰' }
	};

	// Payment method labels
	const paymentMethodLabels: Record<string, string> = {
		blik: 'BLIK',
		card: 'Karta płatnicza',
		przelewy24: 'Przelewy24',
		payu: 'PayU',
		bank_transfer: 'Przelew tradycyjny',
		cod: 'Płatność przy odbiorze'
	};

	// Shipping method labels
	const shippingMethodLabels: Record<string, string> = {
		standard: 'Dostawa standardowa',
		express: 'Dostawa ekspresowa',
		pickup: 'Odbiór osobisty'
	};

	function getStatusConfig(status: string) {
		return (
			statusConfig[status] || {
				label: status,
				color: 'bg-neutral-100 text-neutral-200',
				icon: '❓'
			}
		);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('pl-PL');
	}

	function downloadInvoice() {
		// TODO: Implement invoice download
		alert('Funkcja pobierania faktury będzie dostępna wkrótce');
	}

	function trackShipment() {
		// TODO: Implement shipment tracking
		alert('Śledzenie przesyłki będzie dostępne wkrótce');
	}

	function requestReturn() {
		// TODO: Implement return request
		alert('Zgłaszanie zwrotu będzie dostępne wkrótce');
	}
</script>

<svelte:head>
	<title>Zamówienie {data.order.orderNumber} - FixTar</title>
	<meta name="description" content="Szczegóły zamówienia {data.order.orderNumber}" />
</svelte:head>

<div class="min-h-screen">
	<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-white">
						Zamówienie {data.order.orderNumber}
					</h1>
					<p class="mt-1 text-neutral-400">
						Złożone {formatDate(data.order.created)}
					</p>
				</div>

				<div class="flex items-center space-x-4">
					<!-- Order Status -->
					<div class="text-right">
						<p class="mb-1 text-sm text-neutral-500">Status zamówienia</p>
						<CustomBadge customClass={getStatusConfig(data.order.status).color}>
							{getStatusConfig(data.order.status).icon}
							{getStatusConfig(data.order.status).label}
						</CustomBadge>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Order Items -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">Produkty w zamówieniu</h2>

					<div class="space-y-4">
						{#each data.order.items as item}
							<div class="flex items-center space-x-4 rounded-lg bg-white/5 p-4">
								<!-- Product Image -->
								<div class="shrink-0">
									{#if item.product?.mainImage}
										<img
											src={item.product.mainImage}
											alt={item.product?.name || 'Produkt'}
											class="h-16 w-16 rounded-lg object-cover"
										/>
									{:else}
										<div
											class="flex h-16 w-16 items-center justify-center rounded-lg bg-white/10"
										>
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
								</div>

								<!-- Product Details -->
								<div class="flex-1">
									<h3 class="font-medium text-white">
										{item.product?.name || `Produkt ID: ${item.productId}`}
									</h3>
									{#if item.product?.sku}
										<p class="text-sm text-neutral-500">SKU: {item.product.sku}</p>
									{/if}
									<div class="mt-2 flex items-center space-x-4">
										<span class="text-sm text-neutral-400">Ilość: {item.quantity}</span>
										<span class="text-sm text-neutral-400"
											>Cena: {formatPrice(item.price, 'PLN')}</span
										>
									</div>
								</div>

								<!-- Item Total -->
								<div class="text-right">
									<p class="font-semibold text-white">
										{formatPrice(item.price * item.quantity, 'PLN')}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</Card>

				<!-- Order Timeline -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">Historia zamówienia</h2>

					<div class="space-y-4">
						<div class="flex items-center space-x-4">
							<div
								class="bg-success/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<svg class="text-success h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<p class="font-medium text-white">Zamówienie złożone</p>
								<p class="text-sm text-neutral-500">{formatDate(data.order.created)}</p>
							</div>
						</div>

						{#if data.order.status !== 'pending'}
							<div class="flex items-center space-x-4">
								<div
									class="bg-brand-100 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
								>
									<svg class="text-brand-600 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<p class="font-medium text-white">Płatność potwierdzona</p>
									<p class="text-sm text-neutral-500">Zamówienie w realizacji</p>
								</div>
							</div>
						{/if}

						{#if data.order.status === 'shipped' || data.order.status === 'delivered'}
							<div class="flex items-center space-x-4">
								<div
									class="bg-accent-100 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
								>
									<svg class="text-accent-600 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<p class="font-medium text-white">Zamówienie wysłane</p>
									<p class="text-sm text-neutral-500">Paczka w drodze do Ciebie</p>
								</div>
							</div>
						{/if}

						{#if data.order.status === 'delivered'}
							<div class="flex items-center space-x-4">
								<div
									class="bg-success/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
								>
									<svg class="text-success h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<p class="font-medium text-white">Zamówienie dostarczone</p>
									<p class="text-sm text-neutral-500">Paczka została dostarczona</p>
								</div>
							</div>
						{/if}
					</div>
				</Card>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Order Summary -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">Podsumowanie</h2>

					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-neutral-400">Wartość produktów:</span>
							<span class="font-medium">{formatPrice(data.order.subtotal, 'PLN')}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-neutral-400">Dostawa:</span>
							<span class="font-medium">{formatPrice(data.order.shippingCost, 'PLN')}</span>
						</div>

						{#if data.order.tax > 0}
							<div class="flex justify-between">
								<span class="text-neutral-400">VAT:</span>
								<span class="font-medium">{formatPrice(data.order.tax, 'PLN')}</span>
							</div>
						{/if}

						<div class="border-t pt-3">
							<div class="flex justify-between">
								<span class="text-lg font-semibold text-white">Razem:</span>
								<span class="text-lg font-bold text-white"
									>{formatPrice(data.order.total, 'PLN')}</span
								>
							</div>
						</div>
					</div>
				</Card>

				<!-- Payment & Shipping Info -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">
						Informacje o płatności i dostawie
					</h2>

					<div class="space-y-4">
						<div>
							<h3 class="mb-2 font-medium text-white">Metoda płatności</h3>
							<p class="text-neutral-400">
								{paymentMethodLabels[data.order.paymentMethod] || data.order.paymentMethod}
							</p>
						</div>

						<div>
							<h3 class="mb-2 font-medium text-white">Metoda dostawy</h3>
							<p class="text-neutral-400">
								{shippingMethodLabels[data.order.shippingMethod] || data.order.shippingMethod}
							</p>
						</div>
					</div>
				</Card>

				<!-- Shipping Address -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">Adres dostawy</h2>

					<div class="text-neutral-400">
						<p class="font-medium text-white">
							{data.order.shippingAddress.firstName}
							{data.order.shippingAddress.lastName}
						</p>
						<p>{data.order.shippingAddress.street}</p>
						<p>{data.order.shippingAddress.postalCode} {data.order.shippingAddress.city}</p>
						<p>{data.order.shippingAddress.country}</p>

						{#if data.order.metadata?.email}
							<p class="mt-3">
								<span class="font-medium">Email:</span>
								{data.order.metadata.email}
							</p>
						{/if}

						{#if data.order.metadata?.phone}
							<p>
								<span class="font-medium">Telefon:</span>
								{data.order.metadata.phone}
							</p>
						{/if}
					</div>
				</Card>

				<!-- Actions -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-white">Akcje</h2>

					<div class="space-y-3">
						<Button onclick={downloadInvoice} variant="outline" class="w-full">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							Pobierz fakturę
						</Button>

						{#if data.order.status === 'shipped' || data.order.status === 'processing'}
							<Button onclick={trackShipment} variant="outline" class="w-full">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								Śledź przesyłkę
							</Button>
						{/if}

						{#if data.order.status === 'delivered'}
							<Button onclick={requestReturn} variant="outline" class="w-full">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
									/>
								</svg>
								Zgłoś zwrot
							</Button>
						{/if}

						<Button href="/account/orders" variant="outline" class="w-full">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
							Wszystkie zamówienia
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</div>
