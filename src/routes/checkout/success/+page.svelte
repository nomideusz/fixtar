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
	const orderNumber = $derived(
		data.order?.orderNumber || 'PL' + Math.random().toString(36).substr(2, 9).toUpperCase()
	);

	// Format currency
	function formatCurrency(amount: number): string {
		return `${amount.toFixed(2)} zł`;
	}

	// Get payment method display name
	function getPaymentMethodName(method: string): string {
		const methods: Record<string, string> = {
			blik: 'BLIK',
			card: 'Karta płatnicza',
			bank_transfer: 'Przelew tradycyjny',
			przelewy24: 'Przelewy24',
			cod: 'Płatność przy odbiorze'
		};
		return methods[method] || method;
	}

	// Get shipping method display name
	function getShippingMethodName(method: string): string {
		const methods: Record<string, string> = {
			standard: 'Poczta Polska',
			express: 'Kurier DPD',
			inpost: 'InPost Paczkomat'
		};
		return methods[method] || method;
	}
</script>

<svelte:head>
	<title>Zamówienie Potwierdzone - FixTar</title>
	<meta
		name="description"
		content="Twoje zamówienie zostało złożone pomyślnie - dziękujemy za zakupy"
	/>
</svelte:head>

<!-- Professional Success Hero -->
<Hero
	title="Zamówienie Potwierdzone!"
	subtitle="Dziękujemy za zakupy w FixTar - Twoje zamówienie zostało pomyślnie złożone i zostanie szybko przetworzone"
	centered={true}
/>

<div class="min-h-screen">
	<div class="mx-auto max-w-screen-2xl px-6 py-16 sm:px-8 lg:px-12">
		<!-- Enhanced Success Header -->
		<div class="mb-12 text-center">
			<div class="relative mb-8 inline-block">
				<div
					class="bg-success/10 absolute inset-0 scale-110 transform animate-pulse rounded-full"
				></div>
				<div
					class="bg-success relative mx-auto flex h-24 w-24 items-center justify-center rounded-full shadow-xl"
				>
					<svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
			</div>

			<!-- Order Number Display -->
			<Card
				class="from-brand-500/100/8 to-success/5 border-success/20 mb-8 inline-block border-2 bg-linear-to-r p-6"
			>
				<div class="flex items-center space-x-4">
					<div class="bg-brand-100 flex h-12 w-12 items-center justify-center rounded-xl">
						<svg
							class="text-brand-600 h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div class="text-left">
						<p class="text-sm font-medium text-neutral-400">Numer zamówienia</p>
						<p class="text-2xl font-bold text-white">#{orderNumber}</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Fallback notification -->
		{#if isFallback && data.order?.metadata?.paymentDetails?.originalMethod}
			<div class="mx-auto mb-8 max-w-4xl">
				<Card class="border-2 border-amber-500/20 bg-amber-500/10 p-6">
					<div class="flex items-start space-x-4">
						<div class="shrink-0">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
								<svg
									class="h-5 w-5 text-amber-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 class="mb-2 text-lg font-bold text-amber-800">Zmiana metody płatności</h3>
							<p class="text-amber-700">
								Wybrana metoda płatności <strong
									>{getPaymentMethodName(data.order.metadata.paymentDetails.originalMethod)}</strong
								>
								była czasowo niedostępna. Zamówienie zostało automatycznie przekierowane do płatności
								przelewem tradycyjnym.
							</p>
						</div>
					</div>
				</Card>
			</div>
		{/if}

		<!-- Bank Transfer Details (if applicable) -->
		{#if data.order?.paymentMethod === 'bank_transfer' && data.order?.metadata?.paymentDetails?.bankDetails}
			<div class="mx-auto mb-12 max-w-4xl">
				<Card class="bg-brand-500/10 border-brand-500/20 border-2 p-8">
					<div class="mb-6 flex items-center">
						<div class="bg-brand-100 mr-4 flex h-12 w-12 items-center justify-center rounded-xl">
							<svg
								class="text-brand-600 h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								/>
							</svg>
						</div>
						<h3 class="text-brand-900 text-2xl font-bold">Dane do przelewu</h3>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">Nazwa odbiorcy</h4>
							<p
								class="rounded-xl border border-white/10 bg-white/5 p-3 text-lg font-bold text-white"
							>
								{data.order.metadata.paymentDetails.bankDetails.accountName}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">Bank</h4>
							<p
								class="rounded-xl border border-white/10 bg-white/5 p-3 text-lg font-bold text-white"
							>
								{data.order.metadata.paymentDetails.bankDetails.bankName}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">Numer konta</h4>
							<p
								class="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-lg font-bold tracking-wider text-white"
							>
								{data.order.metadata.paymentDetails.bankDetails.accountNumber}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">SWIFT</h4>
							<p
								class="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-lg font-bold text-white"
							>
								{data.order.metadata.paymentDetails.bankDetails.swift}
							</p>
						</div>

						<div class="md:col-span-2">
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">Tytuł przelewu</h4>
							<p
								class="bg-warning/10 border-warning/30 rounded-xl border-2 p-4 text-center text-lg font-bold text-white"
							>
								{data.order.metadata.paymentDetails.bankDetails.reference}
							</p>
						</div>

						<div class="md:col-span-2">
							<h4 class="mb-2 text-sm font-semibold text-neutral-300">Kwota do zapłaty</h4>
							<p
								class="text-brand-600 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-3xl font-bold"
							>
								{data.order.metadata.paymentDetails.bankDetails.amount}
							</p>
						</div>
					</div>

					<div class="bg-warning/10 border-warning/30 mt-6 rounded-xl border p-4">
						<div class="flex items-start space-x-3">
							<svg
								class="text-warning mt-0.5 h-5 w-5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<div>
								<p class="text-warning-dark mb-1 font-bold">Ważne instrukcje płatności:</p>
								<ul class="text-warning-dark space-y-1 text-sm">
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
		<div class="mb-16 text-center">
			<p class="mb-8 text-lg text-neutral-400">
				Wysłaliśmy email z potwierdzeniem zamówienia i szczegółami dostawy na podany adres.
			</p>

			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button
					href="/account/orders"
					class="from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 transform rounded-2xl bg-linear-to-r px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Moje zamówienia
				</Button>
				<Button
					href="/products"
					variant="outline"
					class="hover:border-brand-500 hover:text-brand-600 rounded-2xl border-2 border-white/15 px-8 py-4 text-lg font-bold transition-all duration-300"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					Kontynuuj zakupy
				</Button>
			</div>
		</div>

		{#if data.order}
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- Enhanced Order Items -->
				<Card class="p-8">
					<div class="mb-6 flex items-center">
						<div class="bg-success/10 mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
							<svg
								class="text-success h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
								/>
							</svg>
						</div>
						<h3 class="text-2xl font-bold text-white">Zamówione produkty</h3>
					</div>

					{#if data.order.items && data.order.items.length > 0}
						<div class="space-y-4">
							{#each data.order.items as item (item)}
								<div
									class="flex items-center space-x-4 rounded-xl bg-white/5 p-4 transition-colors duration-200 hover:bg-white/10"
								>
									{#if item.image}
										<div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
											<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
										</div>
									{:else}
										<div
											class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/10"
										>
											<svg
												class="h-10 w-10 text-neutral-400"
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

									<div class="min-w-0 flex-1">
										<h4 class="truncate text-lg font-bold text-white">{item.name}</h4>
										<div class="mt-2 flex items-center space-x-4">
											<span class="text-sm text-neutral-400"
												>Ilość: <strong>{item.quantity}</strong></span
											>
											<span class="text-sm text-neutral-400"
												>Cena: <strong>{formatCurrency(item.price)}</strong></span
											>
										</div>
									</div>

									<div class="text-right">
										<p class="text-brand-600 text-xl font-bold">
											{formatCurrency(item.price * item.quantity)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"
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
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
									/>
								</svg>
							</div>
							<p class="text-neutral-400">Brak szczegółów produktów w zamówieniu</p>
						</div>
					{/if}
				</Card>

				<!-- Enhanced Shipping & Payment Info -->
				<div class="space-y-8">
					<!-- Shipping Address -->
					<Card class="p-8">
						<div class="mb-6 flex items-center">
							<div class="bg-brand-100 mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
								<svg
									class="text-brand-600 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
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
							</div>
							<h3 class="text-2xl font-bold text-white">Adres dostawy</h3>
						</div>

						{#if data.order.shippingAddress}
							<div class="rounded-xl bg-white/5 p-6">
								<div class="space-y-2">
									<p class="text-lg font-bold text-white">
										{data.order.shippingAddress.firstName}
										{data.order.shippingAddress.lastName}
									</p>
									{#if data.order.shippingAddress.company}
										<p class="font-medium text-neutral-400">{data.order.shippingAddress.company}</p>
									{/if}
									<p class="text-neutral-400">{data.order.shippingAddress.street}</p>
									{#if data.order.shippingAddress.apartment}
										<p class="text-neutral-400">
											Mieszkanie {data.order.shippingAddress.apartment}
										</p>
									{/if}
									<p class="text-neutral-400">
										{data.order.shippingAddress.postalCode}
										{data.order.shippingAddress.city}
									</p>
									<p class="text-neutral-400">{data.order.shippingAddress.voivodeship}</p>
								</div>
							</div>
						{:else}
							<p class="text-neutral-400">Brak danych adresowych</p>
						{/if}
					</Card>

					<!-- Payment & Shipping Methods -->
					<Card class="p-8">
						<div class="mb-6 flex items-center">
							<div class="bg-accent-100 mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
								<svg
									class="text-accent-600 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 class="text-2xl font-bold text-white">Szczegóły zamówienia</h3>
						</div>

						<div class="space-y-6">
							<div class="flex items-center justify-between rounded-xl bg-white/5 p-4">
								<div class="flex items-center">
									<svg
										class="mr-3 h-5 w-5 text-neutral-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
										/>
									</svg>
									<span class="font-medium text-neutral-300">Płatność</span>
								</div>
								<span class="font-bold text-white">
									{getPaymentMethodName(data.order.paymentMethod || 'card')}
								</span>
							</div>

							<div class="flex items-center justify-between rounded-xl bg-white/5 p-4">
								<div class="flex items-center">
									<svg
										class="mr-3 h-5 w-5 text-neutral-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
									<span class="font-medium text-neutral-300">Dostawa</span>
								</div>
								<span class="font-bold text-white">
									{getShippingMethodName(data.order.shippingMethod || 'standard')}
								</span>
							</div>

							{#if data.order.total}
								<div
									class="bg-success/5 border-success/20 flex items-center justify-between rounded-xl border-2 p-4"
								>
									<div class="flex items-center">
										<svg
											class="text-success mr-3 h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
											/>
										</svg>
										<span class="text-success font-semibold">Łączna kwota</span>
									</div>
									<span class="text-success text-xl font-bold">
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
		<div class="mx-auto mt-16 max-w-4xl">
			<Card class="from-brand-500/100/8 to-accent-500/100/8 border-2 border-white/10 bg-linear-to-br p-8">
				<div class="text-center">
					<div
						class="bg-brand-100 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
					>
						<svg
							class="text-brand-600 h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="mb-4 text-2xl font-bold text-white">Co dalej?</h3>
					<div class="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
						<div class="flex items-start space-x-3">
							<div
								class="bg-success/10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-success text-sm font-bold">1</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-white">Potwierdzenie email</h4>
								<p class="text-sm text-neutral-400">
									Sprawdź swoją skrzynkę pocztową w poszukiwaniu emaila z potwierdzeniem
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="bg-brand-100 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-brand-600 text-sm font-bold">2</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-white">Przygotowanie</h4>
								<p class="text-sm text-neutral-400">Przygotowujemy Twoje zamówienie do wysyłki</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="bg-accent-100 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-accent-600 text-sm font-bold">3</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-white">Dostawa</h4>
								<p class="text-sm text-neutral-400">
									Otrzymasz powiadomienie o wysyłce z numerem do śledzenia
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>
