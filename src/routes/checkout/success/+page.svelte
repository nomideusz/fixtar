<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { CheckIcon, FileTextIcon, WarningCircleIcon, CreditCardIcon, PackageIcon, MapPinIcon, LightningIcon, ArrowRightIcon, ShoppingBagIcon, InfoIcon, ImageSquareIcon } from 'phosphor-svelte';

	// Get data from server
	const { data } = $props<{ data: PageData }>();

	// CheckIcon if payment method fell back
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

<PageHeader title="Zamówienie Potwierdzone!" description="Dziękujemy za zakupy w FixTar - Twoje zamówienie zostało pomyślnie złożone i zostanie szybko przetworzone" />

<div class="min-h-screen">
	<div class="ft-container ft-section-lg">
		<!-- Success Header -->
		<div class="mb-12 text-center">
			<div class="relative mb-8 inline-block">
				<div
					class="bg-success/10 absolute inset-0 scale-110 transform animate-pulse rounded-full"
				></div>
				<div
					class="bg-success relative mx-auto flex h-24 w-24 items-center justify-center rounded-full shadow-xl"
				>
					<CheckIcon class="h-12 w-12 text-white" weight="bold" aria-hidden="true" />
				</div>
			</div>

			<!-- Order Number Display -->
			<div class="mb-8 inline-flex items-center gap-3 bg-[--ft-frost] rounded-xl py-3 px-4 sm:gap-4 sm:py-4 sm:px-6">
				<div class="bg-[--ft-surface] flex h-12 w-12 items-center justify-center rounded-xl">
					<FileTextIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
				</div>
				<div class="text-left">
					<p class="text-sm font-medium text-[--ft-text-muted]">Numer zamówienia</p>
					<p class="text-2xl font-bold text-[--ft-text]">#{orderNumber}</p>
				</div>
			</div>
		</div>

		<!-- Fallback notification -->
		{#if isFallback && data.order?.metadata?.paymentDetails?.originalMethod}
			<div class="mx-auto mb-8 max-w-4xl">
				<div class="border border-[--ft-line] rounded-xl p-6 bg-[--ft-frost]">
					<div class="flex items-start space-x-4">
						<div class="shrink-0">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
								<WarningCircleIcon class="h-5 w-5 text-amber-600" aria-hidden="true" />
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
				</div>
			</div>
		{/if}

		<!-- Bank Transfer Details (if applicable) -->
		{#if data.order?.paymentMethod === 'bank_transfer' && data.order?.metadata?.paymentDetails?.bankDetails}
			<div class="mx-auto mb-12 max-w-4xl">
				<div class="bg-[--ft-frost] border border-[--ft-line] rounded-xl p-4 sm:p-8">
					<div class="mb-6 flex items-center">
						<div class="bg-[--ft-surface] mr-4 flex h-12 w-12 items-center justify-center rounded-xl">
							<CreditCardIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
						</div>
						<h3 class="text-[--ft-text-strong] text-2xl font-bold">Dane do przelewu</h3>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">Nazwa odbiorcy</h4>
							<p
								class="rounded-xl border border-[--ft-line] bg-[--ft-surface] p-3 text-lg font-bold text-[--ft-text]"
							>
								{data.order.metadata.paymentDetails.bankDetails.accountName}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">Bank</h4>
							<p
								class="rounded-xl border border-[--ft-line] bg-[--ft-surface] p-3 text-lg font-bold text-[--ft-text]"
							>
								{data.order.metadata.paymentDetails.bankDetails.bankName}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">Numer konta</h4>
							<p
								class="rounded-xl border border-[--ft-line] bg-[--ft-surface] p-3 font-mono text-lg font-bold tracking-wider text-[--ft-text]"
							>
								{data.order.metadata.paymentDetails.bankDetails.accountNumber}
							</p>
						</div>

						<div>
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">SWIFT</h4>
							<p
								class="rounded-xl border border-[--ft-line] bg-[--ft-surface] p-3 font-mono text-lg font-bold text-[--ft-text]"
							>
								{data.order.metadata.paymentDetails.bankDetails.swift}
							</p>
						</div>

						<div class="md:col-span-2">
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">Tytuł przelewu</h4>
							<p
								class="bg-warning/10 border-warning/30 rounded-xl border-2 p-4 text-center text-lg font-bold text-[--ft-text]"
							>
								{data.order.metadata.paymentDetails.bankDetails.reference}
							</p>
						</div>

						<div class="md:col-span-2">
							<h4 class="mb-2 text-sm font-semibold text-[--ft-text]">Kwota do zapłaty</h4>
							<p
								class="text-[--ft-accent] rounded-xl border border-[--ft-line] bg-[--ft-surface] p-4 text-center text-3xl font-bold"
							>
								{data.order.metadata.paymentDetails.bankDetails.amount}
							</p>
						</div>
					</div>

					<div class="bg-warning/10 border-warning/30 mt-6 rounded-xl border p-4">
						<div class="flex items-start space-x-3">
							<WarningCircleIcon class="text-warning mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
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
				</div>
			</div>
		{/if}

		<!-- Action Links -->
		<div class="mb-16 text-center">
			<p class="mb-8 text-lg text-[--ft-text-muted]">
				Wysłaliśmy email z potwierdzeniem zamówienia i szczegółami dostawy na podany adres.
			</p>

			<div class="flex flex-col justify-center gap-6 sm:flex-row">
				<a
					href="/account/orders"
					class="inline-flex items-center gap-2 text-[--ft-accent] font-medium hover:underline"
				>
					<FileTextIcon class="h-5 w-5" aria-hidden="true" />
					Moje zamówienia
				</a>
				<a
					href="/products"
					class="inline-flex items-center gap-2 text-[--ft-text-muted] hover:text-[--ft-text]"
				>
					<ShoppingBagIcon class="h-5 w-5" aria-hidden="true" />
					Kontynuuj zakupy
				</a>
			</div>
		</div>

		{#if data.order}
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- Order Items -->
				<div class="border border-[--ft-line] rounded-xl p-4 sm:p-8">
					<div class="mb-6 flex items-center">
						<div class="bg-success/10 mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
							<PackageIcon class="text-success h-5 w-5" aria-hidden="true" />
						</div>
						<h3 class="text-2xl font-bold text-[--ft-text]">Zamówione produkty</h3>
					</div>

					{#if data.order.items && data.order.items.length > 0}
						<div class="space-y-4">
							{#each data.order.items as item (item)}
								<div
									class="flex flex-col gap-3 rounded-xl bg-[--ft-frost] p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
								>
									<div class="flex items-center gap-3">
										{#if item.image}
											<div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
												<img src={item.image} alt={item.name} class="h-full w-full object-cover" width="80" height="80" loading="lazy" />
											</div>
										{:else}
											<div
												class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[--ft-frost] sm:h-20 sm:w-20"
											>
												<ImageSquareIcon class="h-8 w-8 text-[--ft-text-muted] sm:h-10 sm:w-10" aria-hidden="true" />
											</div>
										{/if}

										<div class="min-w-0 flex-1">
											<h4 class="truncate text-base font-bold text-[--ft-text] sm:text-lg">{item.name}</h4>
											<div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-2">
												<span class="text-sm text-[--ft-text-muted]"
													>Ilość: <strong>{item.quantity}</strong></span
												>
												<span class="text-sm text-[--ft-text-muted]"
													>Cena: <strong>{formatCurrency(item.price)}</strong></span
												>
											</div>
										</div>
									</div>

									<div class="text-right sm:shrink-0">
										<p class="text-[--ft-accent] text-lg font-bold sm:text-xl">
											{formatCurrency(item.price * item.quantity)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--ft-frost]"
							>
								<PackageIcon class="h-8 w-8 text-[--ft-text-muted]" aria-hidden="true" />
							</div>
							<p class="text-[--ft-text-muted]">Brak szczegółów produktów w zamówieniu</p>
						</div>
					{/if}
				</div>

				<!-- Shipping & Payment InfoIcon -->
				<div class="space-y-8">
					<!-- Shipping Address -->
					<div class="border border-[--ft-line] rounded-xl p-4 sm:p-8">
						<div class="mb-6 flex items-center">
							<div class="bg-[--ft-frost] mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
								<MapPinIcon class="text-[--ft-accent] h-5 w-5" aria-hidden="true" />
							</div>
							<h3 class="text-2xl font-bold text-[--ft-text]">Adres dostawy</h3>
						</div>

						{#if data.order.shippingAddress}
							<div class="rounded-xl bg-[--ft-frost] p-6">
								<div class="space-y-2">
									<p class="text-lg font-bold text-[--ft-text]">
										{data.order.shippingAddress.firstName}
										{data.order.shippingAddress.lastName}
									</p>
									{#if data.order.shippingAddress.company}
										<p class="font-medium text-[--ft-text-muted]">{data.order.shippingAddress.company}</p>
									{/if}
									<p class="text-[--ft-text-muted]">{data.order.shippingAddress.street}</p>
									{#if data.order.shippingAddress.apartment}
										<p class="text-[--ft-text-muted]">
											Mieszkanie {data.order.shippingAddress.apartment}
										</p>
									{/if}
									<p class="text-[--ft-text-muted]">
										{data.order.shippingAddress.postalCode}
										{data.order.shippingAddress.city}
									</p>
									<p class="text-[--ft-text-muted]">{data.order.shippingAddress.voivodeship}</p>
								</div>
							</div>
						{:else}
							<p class="text-[--ft-text-muted]">Brak danych adresowych</p>
						{/if}
					</div>

					<!-- Payment & Shipping Methods -->
					<div class="border border-[--ft-line] rounded-xl p-4 sm:p-8">
						<div class="mb-6 flex items-center">
							<div class="bg-[--ft-frost] mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
								<LightningIcon class="text-[--ft-accent] h-5 w-5" aria-hidden="true" />
							</div>
							<h3 class="text-2xl font-bold text-[--ft-text]">Szczegóły zamówienia</h3>
						</div>

						<div class="space-y-6">
							<div class="flex items-center justify-between rounded-xl bg-[--ft-frost] p-4">
								<div class="flex items-center">
									<CreditCardIcon class="mr-3 h-5 w-5 text-[--ft-text-muted]" aria-hidden="true" />
									<span class="font-medium text-[--ft-text]">Płatność</span>
								</div>
								<span class="font-bold text-[--ft-text]">
									{getPaymentMethodName(data.order.paymentMethod || 'card')}
								</span>
							</div>

							<div class="flex items-center justify-between rounded-xl bg-[--ft-frost] p-4">
								<div class="flex items-center">
									<ArrowRightIcon class="mr-3 h-5 w-5 text-[--ft-text-muted]" aria-hidden="true" />
									<span class="font-medium text-[--ft-text]">Dostawa</span>
								</div>
								<span class="font-bold text-[--ft-text]">
									{getShippingMethodName(data.order.shippingMethod || 'standard')}
								</span>
							</div>

							{#if data.order.total}
								<div
									class="bg-success/5 border-success/20 flex items-center justify-between rounded-xl border-2 p-4"
								>
									<div class="flex items-center">
										<CreditCardIcon class="text-success mr-3 h-5 w-5" aria-hidden="true" />
										<span class="text-success font-semibold">Łączna kwota</span>
									</div>
									<span class="text-success text-xl font-bold">
										{formatCurrency(data.order.total)}
									</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Next Steps -->
		<div class="mx-auto mt-16 max-w-4xl">
			<div class="border border-[--ft-line] rounded-xl p-4 sm:p-8">
				<div class="text-center">
					<div
						class="bg-[--ft-frost] mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
					>
						<InfoIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
					</div>
					<h3 class="mb-4 text-2xl font-bold text-[--ft-text]">Co dalej?</h3>
					<div class="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
						<div class="flex items-start space-x-3">
							<div
								class="bg-success/10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-success text-sm font-bold">1</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-[--ft-text]">Potwierdzenie email</h4>
								<p class="text-sm text-[--ft-text-muted]">
									Sprawdź swoją skrzynkę pocztową w poszukiwaniu emaila z potwierdzeniem
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="bg-[--ft-frost] mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-[--ft-accent] text-sm font-bold">2</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-[--ft-text]">Przygotowanie</h4>
								<p class="text-sm text-[--ft-text-muted]">Przygotowujemy Twoje zamówienie do wysyłki</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="bg-[--ft-frost] mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<span class="text-[--ft-accent] text-sm font-bold">3</span>
							</div>
							<div>
								<h4 class="mb-1 font-bold text-[--ft-text]">Dostawa</h4>
								<p class="text-sm text-[--ft-text-muted]">
									Otrzymasz powiadomienie o wysyłce z numerem do śledzenia
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
