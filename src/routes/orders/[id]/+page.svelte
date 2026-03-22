<script lang="ts">
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

	// --- Status Config ---

	const statusConfig: Record<string, { label: string; color: string; iconPath: string }> = {
		pending: { label: 'Oczekuje', color: 'bg-warning/10 text-warning-dark', iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
		processing: { label: 'W realizacji', color: 'bg-brand-100 text-brand-800', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
		shipped: { label: 'Wysłane', color: 'bg-accent-100 text-accent-800', iconPath: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
		delivered: { label: 'Dostarczone', color: 'bg-success/10 text-success-dark', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
		cancelled: { label: 'Anulowane', color: 'bg-danger/10 text-danger-dark', iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
		refunded: { label: 'Zwrócone', color: 'bg-[--ft-frost] text-[--ft-text-muted]', iconPath: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' }
	};

	const defaultStatus = { label: 'Nieznany', color: 'bg-[--ft-frost] text-[--ft-text-muted]', iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };

	const paymentLabels: Record<string, string> = {
		blik: 'BLIK',
		card: 'Karta płatnicza',
		przelewy24: 'Przelewy24',
		payu: 'PayU',
		bank_transfer: 'Przelew tradycyjny',
		cod: 'Płatność przy odbiorze'
	};

	const shippingLabels: Record<string, string> = {
		standard: 'Dostawa standardowa',
		express: 'Dostawa ekspresowa',
		pickup: 'Odbiór osobisty'
	};

	// --- Derived ---

	const order = $derived(data.order);
	const currentStatus = $derived(statusConfig[order.status] || defaultStatus);
	const statusLevel = $derived.by(() => {
		const levels: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
		return levels[order.status] ?? -1;
	});

	// Timeline steps — data-driven instead of repeated if/else blocks
	const timelineSteps = $derived([
		{
			label: 'Zamówienie złożone',
			detail: formatDate(order.created),
			bgClass: 'bg-success/10',
			iconClass: 'text-success',
			visible: true
		},
		{
			label: 'Płatność potwierdzona',
			detail: 'Zamówienie w realizacji',
			bgClass: 'bg-brand-100',
			iconClass: 'text-brand-600',
			visible: statusLevel >= 1
		},
		{
			label: 'Zamówienie wysłane',
			detail: 'Paczka w drodze do Ciebie',
			bgClass: 'bg-accent-100',
			iconClass: 'text-accent-600',
			visible: statusLevel >= 2
		},
		{
			label: 'Zamówienie dostarczone',
			detail: 'Paczka została dostarczona',
			bgClass: 'bg-success/10',
			iconClass: 'text-success',
			visible: statusLevel >= 3
		}
	].filter((step) => step.visible));

	// --- Helpers ---

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString('pl-PL');
	}

	function downloadInvoice() {
		alert('Funkcja pobierania faktury będzie dostępna wkrótce');
	}

	function trackShipment() {
		alert('Śledzenie przesyłki będzie dostępne wkrótce');
	}

	function requestReturn() {
		alert('Zgłaszanie zwrotu będzie dostępne wkrótce');
	}
</script>

<svelte:head>
	<title>Zamówienie {order.orderNumber} - FixTar</title>
	<meta name="description" content="Szczegóły zamówienia {order.orderNumber}" />
</svelte:head>

<div class="min-h-screen">
	<div class="ft-container ft-section">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-[--ft-text]">
						Zamówienie {order.orderNumber}
					</h1>
					<p class="mt-1 text-[--ft-text-muted]">
						Złożone {formatDate(order.created)}
					</p>
				</div>

				<div class="text-right">
					<p class="mb-1 text-sm text-[--ft-text-muted]">Status zamówienia</p>
					<CustomBadge customClass={currentStatus.color}>
						<svg class="mr-1 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={currentStatus.iconPath} />
						</svg>
						{currentStatus.label}
					</CustomBadge>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Order Items -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Produkty w zamówieniu</h2>

					<div class="space-y-4">
						{#each order.items as item}
							<div class="flex items-center space-x-4 rounded-lg bg-[--ft-frost] p-4">
								<div class="shrink-0">
									{#if item.product?.mainImage}
										<img
											src={item.product.mainImage}
											alt={item.product?.name || 'Produkt'}
											class="h-16 w-16 rounded-lg object-cover"
										/>
									{:else}
										<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-[--ft-frost]">
											<svg class="h-8 w-8 text-[--ft-text-muted]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									{/if}
								</div>

								<div class="flex-1">
									<h3 class="font-medium text-[--ft-text]">
										{item.product?.name || `Produkt ID: ${item.productId}`}
									</h3>
									{#if item.product?.sku}
										<p class="text-sm text-[--ft-text-muted]">SKU: {item.product.sku}</p>
									{/if}
									<div class="mt-2 flex items-center space-x-4">
										<span class="text-sm text-[--ft-text-muted]">Ilość: {item.quantity}</span>
										<span class="text-sm text-[--ft-text-muted]">Cena: {formatPrice(item.price, 'PLN')}</span>
									</div>
								</div>

								<div class="text-right">
									<p class="font-semibold text-[--ft-text]">
										{formatPrice(item.price * item.quantity, 'PLN')}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</Card>

				<!-- Order Timeline -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Historia zamówienia</h2>

					<div class="space-y-4">
						{#each timelineSteps as step (step.label)}
							<div class="flex items-center space-x-4">
								<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {step.bgClass}">
									<svg class="h-4 w-4 {step.iconClass}" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
								<div>
									<p class="font-medium text-[--ft-text]">{step.label}</p>
									<p class="text-sm text-[--ft-text-muted]">{step.detail}</p>
								</div>
							</div>
						{/each}
					</div>
				</Card>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Order Summary -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Podsumowanie</h2>

					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-[--ft-text-muted]">Wartość produktów:</span>
							<span class="font-medium">{formatPrice(order.subtotal, 'PLN')}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-[--ft-text-muted]">Dostawa:</span>
							<span class="font-medium">{formatPrice(order.shippingCost, 'PLN')}</span>
						</div>
						{#if order.tax > 0}
							<div class="flex justify-between">
								<span class="text-[--ft-text-muted]">VAT:</span>
								<span class="font-medium">{formatPrice(order.tax, 'PLN')}</span>
							</div>
						{/if}
						<div class="border-t pt-3">
							<div class="flex justify-between">
								<span class="text-lg font-semibold text-[--ft-text]">Razem:</span>
								<span class="text-lg font-bold text-[--ft-text]">{formatPrice(order.total, 'PLN')}</span>
							</div>
						</div>
					</div>
				</Card>

				<!-- Payment & Shipping Info -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Informacje o płatności i dostawie</h2>

					<div class="space-y-4">
						<div>
							<h3 class="mb-2 font-medium text-[--ft-text]">Metoda płatności</h3>
							<p class="text-[--ft-text-muted]">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
						</div>
						<div>
							<h3 class="mb-2 font-medium text-[--ft-text]">Metoda dostawy</h3>
							<p class="text-[--ft-text-muted]">{shippingLabels[order.shippingMethod] || order.shippingMethod}</p>
						</div>
					</div>
				</Card>

				<!-- Shipping Address -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Adres dostawy</h2>

					<div class="text-[--ft-text-muted]">
						<p class="font-medium text-[--ft-text]">
							{order.shippingAddress.firstName} {order.shippingAddress.lastName}
						</p>
						<p>{order.shippingAddress.street}</p>
						<p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
						<p>{order.shippingAddress.country}</p>

						{#if order.metadata?.email}
							<p class="mt-3"><span class="font-medium">Email:</span> {order.metadata.email}</p>
						{/if}
						{#if order.metadata?.phone}
							<p><span class="font-medium">Telefon:</span> {order.metadata.phone}</p>
						{/if}
					</div>
				</Card>

				<!-- Actions -->
				<Card class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-[--ft-text]">Akcje</h2>

					<div class="space-y-3">
						<Button onclick={downloadInvoice} variant="outline" class="w-full">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Pobierz fakturę
						</Button>

						{#if order.status === 'shipped' || order.status === 'processing'}
							<Button onclick={trackShipment} variant="outline" class="w-full">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Śledź przesyłkę
							</Button>
						{/if}

						{#if order.status === 'delivered'}
							<Button onclick={requestReturn} variant="outline" class="w-full">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
								</svg>
								Zgłoś zwrot
							</Button>
						{/if}

						<Button href="/account/orders" variant="outline" class="w-full">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
