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
		refunded: { label: 'Zwrócone', color: 'bg-neutral-100 text-neutral-800', icon: '💰' }
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
		return statusConfig[status] || { label: status, color: 'bg-neutral-100 text-neutral-800', icon: '❓' };
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

<div class="bg-neutral-50 min-h-screen">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-neutral-900">
						Zamówienie {data.order.orderNumber}
					</h1>
					<p class="text-neutral-600 mt-1">
						Złożone {formatDate(data.order.created)}
					</p>
				</div>
				
				<div class="flex items-center space-x-4">
					<!-- Order Status -->
					<div class="text-right">
						<p class="text-sm text-neutral-500 mb-1">Status zamówienia</p>
											<CustomBadge customClass={getStatusConfig(data.order.status).color}>
						{getStatusConfig(data.order.status).icon} {getStatusConfig(data.order.status).label}
					</CustomBadge>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Order Items -->
				<Card class="p-6">
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Produkty w zamówieniu</h2>
					
					<div class="space-y-4">
						{#each data.order.items as item}
							<div class="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
								<!-- Product Image -->
								<div class="shrink-0">
									{#if item.product?.mainImage}
										<img 
											src={item.product.mainImage} 
											alt={item.product?.name || 'Produkt'}
											class="w-16 h-16 object-cover rounded-lg"
										/>
									{:else}
									<div class="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
										<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									{/if}
								</div>
								
								<!-- Product Details -->
								<div class="flex-1">
									<h3 class="font-medium text-neutral-900">
										{item.product?.name || `Produkt ID: ${item.productId}`}
									</h3>
									{#if item.product?.sku}
										<p class="text-sm text-neutral-500">SKU: {item.product.sku}</p>
									{/if}
									<div class="flex items-center space-x-4 mt-2">
										<span class="text-sm text-neutral-600">Ilość: {item.quantity}</span>
										<span class="text-sm text-neutral-600">Cena: {formatPrice(item.price, 'PLN')}</span>
									</div>
								</div>
								
								<!-- Item Total -->
								<div class="text-right">
									<p class="font-semibold text-neutral-900">
										{formatPrice(item.price * item.quantity, 'PLN')}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</Card>

				<!-- Order Timeline -->
				<Card class="p-6">
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Historia zamówienia</h2>
					
					<div class="space-y-4">
						<div class="flex items-center space-x-4">
<div class="shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
							<svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							</div>
							<div>
								<p class="font-medium text-neutral-900">Zamówienie złożone</p>
								<p class="text-sm text-neutral-500">{formatDate(data.order.created)}</p>
							</div>
						</div>
						
						{#if data.order.status !== 'pending'}
							<div class="flex items-center space-x-4">
								<div class="shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
								<div>
									<p class="font-medium text-neutral-900">Płatność potwierdzona</p>
									<p class="text-sm text-neutral-500">Zamówienie w realizacji</p>
								</div>
							</div>
						{/if}
						
						{#if data.order.status === 'shipped' || data.order.status === 'delivered'}
							<div class="flex items-center space-x-4">
								<div class="shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
								<div>
									<p class="font-medium text-neutral-900">Zamówienie wysłane</p>
									<p class="text-sm text-neutral-500">Paczka w drodze do Ciebie</p>
								</div>
							</div>
						{/if}
						
						{#if data.order.status === 'delivered'}
							<div class="flex items-center space-x-4">
								<div class="shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
								<div>
									<p class="font-medium text-neutral-900">Zamówienie dostarczone</p>
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
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Podsumowanie</h2>
					
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-neutral-600">Wartość produktów:</span>
							<span class="font-medium">{formatPrice(data.order.subtotal, 'PLN')}</span>
						</div>
						
						<div class="flex justify-between">
							<span class="text-neutral-600">Dostawa:</span>
							<span class="font-medium">{formatPrice(data.order.shippingCost, 'PLN')}</span>
						</div>
						
						{#if data.order.tax > 0}
							<div class="flex justify-between">
								<span class="text-neutral-600">VAT:</span>
								<span class="font-medium">{formatPrice(data.order.tax, 'PLN')}</span>
							</div>
						{/if}
						
						<div class="border-t pt-3">
							<div class="flex justify-between">
								<span class="text-lg font-semibold text-neutral-900">Razem:</span>
								<span class="text-lg font-bold text-neutral-900">{formatPrice(data.order.total, 'PLN')}</span>
							</div>
						</div>
					</div>
				</Card>

				<!-- Payment & Shipping Info -->
				<Card class="p-6">
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Informacje o płatności i dostawie</h2>
					
					<div class="space-y-4">
						<div>
							<h3 class="font-medium text-neutral-900 mb-2">Metoda płatności</h3>
							<p class="text-neutral-600">
								{paymentMethodLabels[data.order.paymentMethod] || data.order.paymentMethod}
							</p>
						</div>
						
						<div>
							<h3 class="font-medium text-neutral-900 mb-2">Metoda dostawy</h3>
							<p class="text-neutral-600">
								{shippingMethodLabels[data.order.shippingMethod] || data.order.shippingMethod}
							</p>
						</div>
					</div>
				</Card>

				<!-- Shipping Address -->
				<Card class="p-6">
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Adres dostawy</h2>
					
					<div class="text-neutral-600">
						<p class="font-medium text-neutral-900">
							{data.order.shippingAddress.firstName} {data.order.shippingAddress.lastName}
						</p>
						<p>{data.order.shippingAddress.street}</p>
						<p>{data.order.shippingAddress.postalCode} {data.order.shippingAddress.city}</p>
						<p>{data.order.shippingAddress.country}</p>
						
						{#if data.order.metadata?.email}
							<p class="mt-3">
								<span class="font-medium">Email:</span> {data.order.metadata.email}
							</p>
						{/if}
						
						{#if data.order.metadata?.phone}
							<p>
								<span class="font-medium">Telefon:</span> {data.order.metadata.phone}
							</p>
						{/if}
					</div>
				</Card>

				<!-- Actions -->
				<Card class="p-6">
					<h2 class="text-xl font-semibold text-neutral-900 mb-6">Akcje</h2>
					
					<div class="space-y-3">
						<Button onclick={downloadInvoice} variant="outline" class="w-full">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Pobierz fakturę
						</Button>
						
						{#if data.order.status === 'shipped' || data.order.status === 'processing'}
							<Button onclick={trackShipment} variant="outline" class="w-full">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Śledź przesyłkę
							</Button>
						{/if}
						
						{#if data.order.status === 'delivered'}
							<Button onclick={requestReturn} variant="outline" class="w-full">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
								</svg>
								Zgłoś zwrot
							</Button>
						{/if}
						
						<Button href="/account/orders" variant="outline" class="w-full">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
							Wszystkie zamówienia
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</div> 