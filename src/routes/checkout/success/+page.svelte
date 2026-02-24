<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	
	// Get data from server
	const { data } = $props<{ data: PageData }>();
	
	// Check if payment method fell back
	const isFallback = $derived($page.url.searchParams.get('fallback') === 'true');
	
	// Use real order number or generate a placeholder
	const orderNumber = $derived(data.order?.orderNumber || 'PL' + Math.random().toString(36).substr(2, 9).toUpperCase());
	
	// Format currency
	function formatCurrency(amount: number): string {
		return `${amount.toFixed(2)} zł`;
	}
	
	// Get payment method display name
	function getPaymentMethodName(method: string): string {
		const methods: Record<string, string> = {
			'blik': 'BLIK',
			'card': 'Karta płatnicza',
			'bank_transfer': 'Przelew tradycyjny',
			'przelewy24': 'Przelewy24',
			'cod': 'Płatność przy odbiorze'
		};
		return methods[method] || method;
	}
	
	// Get shipping method display name
	function getShippingMethodName(method: string): string {
		const methods: Record<string, string> = {
			'standard': 'Poczta Polska',
			'express': 'Kurier DPD',
			'inpost': 'InPost Paczkomat'
		};
		return methods[method] || method;
	}
</script>

<svelte:head>
	<title>Zamówienie Potwierdzone - FixTar</title>
	<meta name="description" content="Twoje zamówienie zostało złożone pomyślnie - dziękujemy za zakupy" />
</svelte:head>

<!-- Professional Success Hero -->
<Hero
	title="Zamówienie Potwierdzone!"
	subtitle="Dziękujemy za zakupy w FixTar - Twoje zamówienie zostało pomyślnie złożone i zostanie szybko przetworzone"
	centered={true}
	className="bg-linear-to-br from-success/5 via-white to-accent-50"
/>

<div class="bg-neutral-50 min-h-screen">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
		<!-- Enhanced Success Header -->
		<div class="text-center mb-12">
			<div class="relative inline-block mb-8">
				<div class="absolute inset-0 bg-success/10 rounded-full transform scale-110 animate-pulse"></div>
				<div class="relative w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto shadow-xl">
					<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			</div>
			
			<!-- Order Number Display -->
			<Card class="inline-block p-6 mb-8 bg-linear-to-r from-brand-50 to-success/5 border-2 border-success/20">
				<div class="flex items-center space-x-4">
					<div class="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<div class="text-left">
						<p class="text-sm font-medium text-neutral-600">Numer zamówienia</p>
						<p class="text-2xl font-bold text-neutral-900">#{orderNumber}</p>
					</div>
				</div>
			</Card>
		</div>
		
		<!-- Fallback notification -->
		{#if isFallback && data.order?.metadata?.paymentDetails?.originalMethod}
			<div class="max-w-4xl mx-auto mb-8">
				<Card class="p-6 bg-amber-50 border-2 border-amber-200">
					<div class="flex items-start space-x-4">
						<div class="shrink-0">
							<div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
								<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
						</div>
						<div>
							<h3 class="text-lg font-bold text-amber-800 mb-2">Zmiana metody płatności</h3>
							<p class="text-amber-700">
								Wybrana metoda płatności <strong>{getPaymentMethodName(data.order.metadata.paymentDetails.originalMethod)}</strong> 
								była czasowo niedostępna. Zamówienie zostało automatycznie przekierowane do płatności przelewem tradycyjnym.
							</p>
						</div>
					</div>
				</Card>
			</div>
		{/if}
		
		<!-- Bank Transfer Details (if applicable) -->
		{#if data.order?.paymentMethod === 'bank_transfer' && data.order?.metadata?.paymentDetails?.bankDetails}
			<div class="max-w-4xl mx-auto mb-12">
				<Card class="p-8 bg-brand-50 border-2 border-brand-200">
					<div class="flex items-center mb-6">
						<div class="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mr-4">
							<svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
							</svg>
						</div>
						<h3 class="text-2xl font-bold text-brand-900">Dane do przelewu</h3>
					</div>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">Nazwa odbiorcy</h4>
							<p class="text-lg font-bold text-neutral-900 p-3 bg-white rounded-xl border border-neutral-200">{data.order.metadata.paymentDetails.bankDetails.accountName}</p>
						</div>
						
						<div>
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">Bank</h4>
							<p class="text-lg font-bold text-neutral-900 p-3 bg-white rounded-xl border border-neutral-200">{data.order.metadata.paymentDetails.bankDetails.bankName}</p>
						</div>
						
						<div>
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">Numer konta</h4>
							<p class="text-lg font-mono font-bold text-neutral-900 p-3 bg-white rounded-xl border border-neutral-200 tracking-wider">{data.order.metadata.paymentDetails.bankDetails.accountNumber}</p>
						</div>
						
						<div>
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">SWIFT</h4>
							<p class="text-lg font-mono font-bold text-neutral-900 p-3 bg-white rounded-xl border border-neutral-200">{data.order.metadata.paymentDetails.bankDetails.swift}</p>
						</div>
						
						<div class="md:col-span-2">
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">Tytuł przelewu</h4>
							<p class="text-lg font-bold text-neutral-900 p-4 bg-warning/10 rounded-xl border-2 border-warning/30 text-center">
								{data.order.metadata.paymentDetails.bankDetails.reference}
							</p>
						</div>
						
						<div class="md:col-span-2">
							<h4 class="text-sm font-semibold text-neutral-700 mb-2">Kwota do zapłaty</h4>
							<p class="text-3xl font-bold text-brand-600 p-4 bg-white rounded-xl border border-neutral-200 text-center">
								{data.order.metadata.paymentDetails.bankDetails.amount}
							</p>
						</div>
					</div>
					
					<div class="mt-6 p-4 bg-warning/10 rounded-xl border border-warning/30">
						<div class="flex items-start space-x-3">
							<svg class="w-5 h-5 text-warning mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<div>
								<p class="font-bold text-warning-dark mb-1">Ważne instrukcje płatności:</p>
								<ul class="text-sm text-warning-dark space-y-1">
									<li>• Prosimy o dokładne przepisanie tytułu przelewu</li>
									<li>• Pozwoli to na szybką identyfikację Twojej płatności</li>
									<li>• Zamówienie zostanie wysłane po otrzymaniu płatności</li>
								</ul>
							</div>
						</div>
					</div>
				</Card>
			</div>
		{/if}
		
		<!-- Action Buttons -->
		<div class="text-center mb-16">
			<p class="text-lg text-neutral-600 mb-8">
				Wysłaliśmy email z potwierdzeniem zamówienia i szczegółami dostawy na podany adres.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/account/orders" class="bg-linear-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Moje zamówienia
				</Button>
				<Button href="/products" variant="outline" class="font-bold py-4 px-8 rounded-2xl border-2 border-neutral-300 hover:border-brand-500 hover:text-brand-600 transition-all duration-300 text-lg">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
					Kontynuuj zakupy
				</Button>
			</div>
		</div>
		
		{#if data.order}
			<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Enhanced Order Items -->
				<Card class="p-8">
					<div class="flex items-center mb-6">
						<div class="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mr-3">
							<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
							</svg>
						</div>
						<h3 class="text-2xl font-bold text-neutral-900">Zamówione produkty</h3>
					</div>
					
					{#if data.order.items && data.order.items.length > 0}
						<div class="space-y-4">
							{#each data.order.items as item (item)}
						<div class="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-200">
								{#if item.image}
									<div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
										<img src={item.image} alt={item.name} class="w-full h-full object-cover">
									</div>
								{:else}
									<div class="w-20 h-20 bg-neutral-200 rounded-xl flex items-center justify-center shrink-0">
										<svg class="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									{/if}
									
									<div class="flex-1 min-w-0">
									<h4 class="text-lg font-bold text-neutral-900 truncate">{item.name}</h4>
									<div class="flex items-center space-x-4 mt-2">
										<span class="text-sm text-neutral-600">Ilość: <strong>{item.quantity}</strong></span>
										<span class="text-sm text-neutral-600">Cena: <strong>{formatCurrency(item.price)}</strong></span>
									</div>
								</div>
								
								<div class="text-right">
									<p class="text-xl font-bold text-brand-600">{formatCurrency(item.price * item.quantity)}</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center py-8">
						<div class="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
							</svg>
						</div>
						<p class="text-neutral-600">Brak szczegółów produktów w zamówieniu</p>
						</div>
					{/if}
				</Card>
				
				<!-- Enhanced Shipping & Payment Info -->
				<div class="space-y-8">
					<!-- Shipping Address -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mr-3">
								<svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-neutral-900">Adres dostawy</h3>
						</div>
						
						{#if data.order.shippingAddress}
							<div class="bg-neutral-50 rounded-xl p-6">
								<div class="space-y-2">
									<p class="text-lg font-bold text-neutral-900">
										{data.order.shippingAddress.firstName} {data.order.shippingAddress.lastName}
									</p>
									{#if data.order.shippingAddress.company}
										<p class="text-neutral-600 font-medium">{data.order.shippingAddress.company}</p>
									{/if}
									<p class="text-neutral-600">{data.order.shippingAddress.street}</p>
									{#if data.order.shippingAddress.apartment}
										<p class="text-neutral-600">Mieszkanie {data.order.shippingAddress.apartment}</p>
									{/if}
									<p class="text-neutral-600">
										{data.order.shippingAddress.postalCode} {data.order.shippingAddress.city}
									</p>
									<p class="text-neutral-600">{data.order.shippingAddress.voivodeship}</p>
								</div>
							</div>
						{:else}
							<p class="text-neutral-600">Brak danych adresowych</p>
						{/if}
					</Card>
					
					<!-- Payment & Shipping Methods -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
							<div class="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mr-3">
								<svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-neutral-900">Szczegóły zamówienia</h3>
						</div>
						
						<div class="space-y-6">
							<div class="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
								<div class="flex items-center">
									<svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
									<span class="font-medium text-neutral-700">Płatność</span>
								</div>
								<span class="font-bold text-neutral-900">
									{getPaymentMethodName(data.order.paymentMethod || 'card')}
								</span>
							</div>
							
							<div class="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
								<div class="flex items-center">
									<svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
									</svg>
									<span class="font-medium text-neutral-700">Dostawa</span>
								</div>
								<span class="font-bold text-neutral-900">
									{getShippingMethodName(data.order.shippingMethod || 'standard')}
								</span>
							</div>
							
							{#if data.order.total}
								<div class="flex justify-between items-center p-4 bg-success/5 rounded-xl border-2 border-success/20">
									<div class="flex items-center">
										<svg class="w-5 h-5 text-success mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
										</svg>
										<span class="font-semibold text-success">Łączna kwota</span>
									</div>
									<span class="text-xl font-bold text-success">
										{formatCurrency(data.order.total)}
									</span>
								</div>
							{/if}
						</div>
					</Card>
				</div>
			</div>
		{/if}
		
		<!-- Next Steps -->
		<div class="mt-16 max-w-4xl mx-auto">
			<Card class="p-8 bg-linear-to-br from-brand-50 to-accent-50 border-2 border-neutral-100">
				<div class="text-center">
					<div class="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-neutral-900 mb-4">Co dalej?</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
						<div class="flex items-start space-x-3">
							<div class="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0 mt-1">
								<span class="text-success font-bold text-sm">1</span>
							</div>
							<div>
								<h4 class="font-bold text-neutral-900 mb-1">Potwierdzenie email</h4>
								<p class="text-sm text-neutral-600">Sprawdź swoją skrzynkę pocztową w poszukiwaniu emaila z potwierdzeniem</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0 mt-1">
								<span class="text-brand-600 font-bold text-sm">2</span>
							</div>
							<div>
								<h4 class="font-bold text-neutral-900 mb-1">Przygotowanie</h4>
								<p class="text-sm text-neutral-600">Przygotowujemy Twoje zamówienie do wysyłki</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div class="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center shrink-0 mt-1">
								<span class="text-accent-600 font-bold text-sm">3</span>
							</div>
							<div>
								<h4 class="font-bold text-neutral-900 mb-1">Dostawa</h4>
								<p class="text-sm text-neutral-600">Otrzymasz powiadomienie o wysyłce z numerem do śledzenia</p>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div> 

