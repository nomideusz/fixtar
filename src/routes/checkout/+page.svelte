<script lang="ts">
	import { cart } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/Input.svelte';
	import CheckoutProgress from '$lib/components/checkout/CheckoutProgress.svelte';
	import SectionHeader from '$lib/components/checkout/SectionHeader.svelte';
	import SelectableMethodCard from '$lib/components/checkout/SelectableMethodCard.svelte';
	import EmptyMethodsFallback from '$lib/components/checkout/EmptyMethodsFallback.svelte';
	import OrderSummary from '$lib/components/checkout/OrderSummary.svelte';
	import type { PageData, ActionData } from './$types';

	// --- Props ---

	let { data, form }: { data: PageData; form?: ActionData } = $props();

	// --- Form State ---

	let formData = $state({
		email: '',
		firstName: '',
		lastName: '',
		company: '',
		street: '',
		apartment: '',
		city: '',
		voivodeship: '',
		postalCode: '',
		phone: '',
		nip: '',
		paymentMethod: '',
		shippingMethod: '',
		notes: '',
		useShippingAsBilling: true,
		saveAddress: false
	});

	let processing = $state(false);
	let errors = $state<Record<string, string>>({});
	let selectedShipping = $state<any>(null);
	let selectedPayment = $state<any>(null);

	// --- Initialization Effects ---

	// Pre-fill user data
	$effect(() => {
		if (data.user?.email) {
			formData.email = data.user.email;
		}
		const defaultAddress = data.addresses?.find((addr: any) => addr.default);
		if (defaultAddress) {
			formData.street = defaultAddress.street || '';
			formData.city = defaultAddress.city || '';
			formData.postalCode = defaultAddress.postalCode || '';
		}
	});

	// Auto-select first shipping/payment method
	$effect(() => {
		if (!selectedShipping && data.shippingMethods?.length > 0) {
			selectedShipping = data.shippingMethods[0];
		}
		if (!selectedPayment && data.paymentMethods?.length > 0) {
			selectedPayment = data.paymentMethods[0];
		}
	});

	// Sync selections to form data
	$effect(() => {
		if (selectedShipping) formData.shippingMethod = selectedShipping.id;
		if (selectedPayment) formData.paymentMethod = selectedPayment.code || selectedPayment.id;
	});

	// Handle server responses
	$effect(() => {
		if (form?.success && form?.redirectUrl) {
			cart.clear();
			goto(form.redirectUrl);
		} else if (form?.message) {
			console.error('Checkout error:', form.message);
		}
	});

	// --- Calculated Totals ---

	const VAT_RATE = 0.23;

	let subtotal = $derived(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

	let shippingCost = $derived.by(() => {
		if (!selectedShipping) return 0;
		const { freeShippingThreshold, cost = 0 } = selectedShipping;
		return freeShippingThreshold && subtotal >= freeShippingThreshold ? 0 : cost;
	});

	let paymentFee = $derived.by(() => {
		if (!selectedPayment?.processingFee) return 0;
		return selectedPayment.feeType === 'percentage'
			? subtotal * (selectedPayment.processingFee / 100)
			: selectedPayment.processingFee;
	});

	let tax = $derived(subtotal * VAT_RATE);
	let total = $derived(subtotal + shippingCost + paymentFee + tax);

	// --- Progress Steps ---

	const checkoutSteps = [
		{ label: 'Koszyk', active: true },
		{ label: 'Finalizacja', active: true },
		{ label: 'Potwierdzenie', active: false }
	];

	// --- Validation ---

	function validateForm(): boolean {
		errors = {};

		if (cart.items.length === 0) {
			errors.cart = 'Koszyk jest pusty';
			return false;
		}

		if (!formData.email || !formData.email.includes('@'))
			errors.email = 'Podaj prawidłowy adres email';
		if (!formData.firstName) errors.firstName = 'Imię jest wymagane';
		if (!formData.lastName) errors.lastName = 'Nazwisko jest wymagane';
		if (!formData.street) errors.street = 'Ulica jest wymagana';
		if (!formData.city) errors.city = 'Miasto jest wymagane';
		if (!formData.voivodeship) errors.voivodeship = 'Województwo jest wymagane';

		if (!formData.postalCode || !/^\d{2}-\d{3}$/.test(formData.postalCode))
			errors.postalCode = 'Podaj kod pocztowy w formacie XX-XXX';

		if (!formData.phone || !/^[\d\s+\-()]+$/.test(formData.phone))
			errors.phone = 'Podaj prawidłowy numer telefonu';

		if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/\D/g, '')))
			errors.nip = 'Podaj prawidłowy NIP (10 cyfr)';

		if (!formData.paymentMethod) errors.paymentMethod = 'Wybierz metodę płatności';
		if (!formData.shippingMethod) errors.shippingMethod = 'Wybierz metodę dostawy';

		return Object.keys(errors).length === 0;
	}

	// --- Input Formatters ---

	function formatPostalCode(e: Event) {
		let value = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '');
		if (value.length >= 2) {
			value = value.slice(0, 2) + '-' + value.slice(2, 5);
		}
		formData.postalCode = value;
	}

	function formatPhone(e: Event) {
		let value = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '');

		if (value.length > 0 && !value.startsWith('48')) {
			value = '48' + value;
		}

		if (value.length > 2) {
			const rest = value.slice(2);
			let formatted = '+' + value.slice(0, 2);
			if (rest.length > 0) formatted += ' ' + rest.slice(0, 3);
			if (rest.length > 3) formatted += ' ' + rest.slice(3, 6);
			if (rest.length > 6) formatted += ' ' + rest.slice(6, 9);
			formData.phone = formatted;
		} else {
			formData.phone = value;
		}
	}

	// --- Helpers ---

	function bindField(field: keyof typeof formData) {
		return (e: Event) => {
			(formData as any)[field] = (e.currentTarget as HTMLInputElement).value;
		};
	}
</script>

<svelte:head>
	<title>Finalizacja Zamówienia - FixTar</title>
	<meta
		name="description"
		content="Bezpieczna finalizacja zamówienia - wypełnij dane dostawy i płatności"
	/>
</svelte:head>

<section class="border-b border-[--ft-line]">
	<div class="ft-container" style="padding-top: clamp(40px, 5vh, 56px); padding-bottom: clamp(40px, 5vh, 56px);">
		<div class="mx-auto max-w-3xl text-center">
			<h1 style="font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; color: var(--ft-dark); margin-bottom: 12px;">Finalizacja Zamówienia</h1>
			<p class="text-[--ft-text-muted]" style="font-size: 1rem; line-height: 1.7;">Bezpiecznie sfinalizuj swoje zakupy - potrzebujesz tylko kilku kliknięć</p>
		</div>
	</div>
</section>

<div class="min-h-screen">
	<div class="ft-container ft-section-lg">
		{#if cart.items.length === 0}
			<!-- Empty Cart -->
			<div class="mx-auto max-w-2xl py-16 text-center">
				<div
					class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[--ft-frost]"
				>
					<svg
						class="h-10 w-10 text-[--ft-text-muted]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
				</div>
				<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">Twój koszyk jest pusty</h2>
				<p class="mb-8 text-lg text-[--ft-text-muted]">
					Dodaj produkty do koszyka, aby przejść do finalizacji zamówienia
				</p>
				<div class="flex flex-col justify-center gap-6 sm:flex-row">
					<a href="/products" class="text-[--ft-accent] font-medium hover:underline">Przeglądaj produkty</a>
					<a href="/" class="text-[--ft-text-muted] hover:text-[--ft-text]">Wróć do strony głównej</a>
				</div>
			</div>
		{:else}
			<CheckoutProgress steps={checkoutSteps} />

			<form
				method="POST"
				action="?/placeOrder"
				use:enhance={({ formData: fd }) => {
					if (!validateForm()) {
						return async () => {};
					}

					processing = true;

					fd.append(
						'items',
						JSON.stringify(
							cart.items.map((item) => ({
								productId: item.productId,
								name: item.name,
								price: item.price,
								quantity: item.quantity
							}))
						)
					);
					fd.append('subtotal', subtotal.toString());
					fd.append('shippingCost', shippingCost.toString());
					fd.append('tax', tax.toString());
					fd.append('total', total.toString());

					return async ({ result, update }) => {
						processing = false;
						if (result.type === 'redirect') cart.clear();
						await update();
					};
				}}
				class="grid grid-cols-1 gap-8 xl:grid-cols-3"
			>
				<!-- Left Column: Form Sections -->
				<div class="space-y-8 xl:col-span-2">
					<!-- Contact Information -->
					<div class="border border-[--ft-line] rounded-xl p-8">
						<SectionHeader title="Dane kontaktowe" iconBgClass="bg-[--ft-frost]" iconColorClass="text-[--ft-accent]">
							{#snippet icon()}
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
									/>
								</svg>
							{/snippet}
						</SectionHeader>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Input
								type="email"
								label="Adres email"
								name="email"
								value={formData.email}
								oninput={bindField('email')}
								error={errors.email}
								required
								placeholder="jan.kowalski@example.com"
								class="focus:ring-[--ft-accent] focus:ring-2"
							/>
							<Input
								type="tel"
								label="Numer telefonu"
								name="phone"
								value={formData.phone}
								oninput={formatPhone}
								error={errors.phone}
								required
								placeholder="+48 123 456 789"
								class="focus:ring-[--ft-accent] focus:ring-2"
							/>
						</div>
					</div>

					<!-- Shipping Address -->
					<div class="border border-[--ft-line] rounded-xl p-8">
						<SectionHeader title="Adres dostawy" iconBgClass="bg-accent-100" iconColorClass="text-success">
							{#snippet icon()}
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
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
							{/snippet}
						</SectionHeader>

						<div class="space-y-6">
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Input
									label="Imię"
									name="firstName"
									value={formData.firstName}
									oninput={bindField('firstName')}
									error={errors.firstName}
									required
									class="focus:ring-success focus:ring-2"
								/>
								<Input
									label="Nazwisko"
									name="lastName"
									value={formData.lastName}
									oninput={bindField('lastName')}
									error={errors.lastName}
									required
									class="focus:ring-success focus:ring-2"
								/>
							</div>

							<Input
								label="Firma (opcjonalnie)"
								name="company"
								value={formData.company}
								oninput={bindField('company')}
								placeholder="Nazwa firmy"
								class="focus:ring-success focus:ring-2"
							/>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
								<div class="md:col-span-2">
									<Input
										label="Ulica i numer domu"
										name="street"
										value={formData.street}
										oninput={bindField('street')}
										error={errors.street}
										required
										placeholder="ul. Przykładowa 123"
										class="focus:ring-success focus:ring-2"
									/>
								</div>
								<Input
									label="Nr lokalu"
									name="apartment"
									value={formData.apartment}
									oninput={bindField('apartment')}
									placeholder="10"
									class="focus:ring-success focus:ring-2"
								/>
							</div>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Input
									label="Miasto"
									name="city"
									value={formData.city}
									oninput={bindField('city')}
									error={errors.city}
									required
									placeholder="Warszawa"
									class="focus:ring-success focus:ring-2"
								/>
								<div>
									<label
										for="voivodeship"
										class="mb-2 block text-sm font-semibold text-[--ft-text]"
									>
										Województwo
									</label>
									<select
										id="voivodeship"
										name="voivodeship"
										value={formData.voivodeship}
										onchange={bindField('voivodeship')}
										class="focus:ring-success focus:border-success w-full rounded-xl border border-[--ft-line] px-4 py-3 shadow-sm transition-colors focus:ring-2 {errors.voivodeship
											? 'border-danger focus:ring-danger'
											: ''}"
										required
									>
										<option value="">Wybierz województwo</option>
										{#each data.voivodeships as voivodeship (voivodeship)}
											<option value={voivodeship}>{voivodeship}</option>
										{/each}
									</select>
									{#if errors.voivodeship}
										<p class="text-danger mt-2 text-sm">{errors.voivodeship}</p>
									{/if}
								</div>
							</div>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Input
									label="Kod pocztowy"
									name="postalCode"
									value={formData.postalCode}
									oninput={formatPostalCode}
									error={errors.postalCode}
									required
									placeholder="00-001"
									maxlength={6}
									class="focus:ring-success focus:ring-2"
								/>
								<Input
									label="NIP (dla faktury)"
									name="nip"
									value={formData.nip}
									oninput={bindField('nip')}
									error={errors.nip}
									placeholder="1234567890"
									class="focus:ring-success focus:ring-2"
								/>
							</div>

							{#if data.user}
								<label class="flex items-center">
									<input
										type="checkbox"
										name="saveAddress"
										bind:checked={formData.saveAddress}
										class="text-success focus:ring-success h-4 w-4 rounded border-[--ft-line] shadow-sm"
									/>
									<span class="ml-3 text-sm font-medium text-[--ft-text]"
										>Zapisz adres do przyszłych zamówień</span
									>
								</label>
							{/if}
						</div>
					</div>

					<!-- Shipping Method -->
					<div class="border border-[--ft-line] rounded-xl p-8">
						<SectionHeader title="Metoda dostawy" iconBgClass="bg-accent-100" iconColorClass="text-accent-600">
							{#snippet icon()}
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							{/snippet}
						</SectionHeader>

						{#if data.shippingMethods?.length > 0}
							<div class="space-y-4">
								{#each data.shippingMethods as method (method)}
									<SelectableMethodCard
										name="shippingMethod"
										value={method.id}
										selected={selectedShipping?.id === method.id}
										onSelect={() => (selectedShipping = method)}
										variant="accent"
									>
										{#snippet details()}
											<div class="flex items-start justify-between">
												<div>
													<h3 class="text-lg font-bold text-[--ft-text]">{method.name}</h3>
													<p class="mt-1 text-sm text-[--ft-text-muted]">{method.description}</p>
													{#if method.estimatedDeliveryDays}
														<div class="mt-2 flex items-center">
															<svg
																class="mr-1 h-4 w-4 text-[--ft-text-muted]"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
															<span class="text-sm text-[--ft-text-muted]">
																Dostawa: {method.estimatedDeliveryDays} dni roboczych
															</span>
														</div>
													{/if}
												</div>
												<div class="text-right">
													{#if method.freeShippingThreshold && subtotal >= method.freeShippingThreshold}
														<div class="text-success text-lg font-bold">Darmowa</div>
														<div class="text-sm text-[--ft-text-muted] line-through">
															{method.cost} zł
														</div>
													{:else}
														<div class="text-lg font-bold text-[--ft-text]">
															{method.cost} zł
														</div>
														{#if method.freeShippingThreshold}
															<div class="text-xs text-[--ft-text-muted]">
																Darmowa od {method.freeShippingThreshold} zł
															</div>
														{/if}
													{/if}
												</div>
											</div>
										{/snippet}
									</SelectableMethodCard>
								{/each}
							</div>
						{:else}
							<EmptyMethodsFallback
								message="Brak dostępnych metod dostawy. Skontaktuj się z obsługą."
							/>
						{/if}
						{#if errors.shippingMethod}
							<p class="text-danger mt-3 text-sm">{errors.shippingMethod}</p>
						{/if}
					</div>

					<!-- Payment Method -->
					<div class="border border-[--ft-line] rounded-xl p-8">
						<SectionHeader title="Metoda płatności" iconBgClass="bg-[--ft-frost]" iconColorClass="text-[--ft-accent]">
							{#snippet icon()}
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
									/>
								</svg>
							{/snippet}
						</SectionHeader>

						{#if data.paymentMethods?.length > 0}
							<div class="space-y-4">
								{#each data.paymentMethods as method (method)}
									<SelectableMethodCard
										name="paymentMethod"
										value={method.code || method.id}
										selected={selectedPayment?.id === method.id}
										onSelect={() => (selectedPayment = method)}
										variant="brand"
									>
										{#snippet details()}
											<div class="flex items-start justify-between">
												<div>
													<h3 class="text-lg font-bold text-[--ft-text]">{method.name}</h3>
													<p class="mt-1 text-sm text-[--ft-text-muted]">{method.description}</p>
												</div>
												{#if method.processingFee}
													<div class="text-right">
														<div class="text-sm text-[--ft-text-muted]">
															+{method.feeType === 'percentage'
																? `${method.processingFee}%`
																: `${method.processingFee} zł`}
														</div>
													</div>
												{/if}
											</div>
										{/snippet}
									</SelectableMethodCard>
								{/each}
							</div>
						{:else}
							<EmptyMethodsFallback
								message="Brak dostępnych metod płatności. Skontaktuj się z obsługą."
							/>
						{/if}
						{#if errors.paymentMethod}
							<p class="text-danger mt-3 text-sm">{errors.paymentMethod}</p>
						{/if}
					</div>

					<!-- Additional Notes -->
					<div class="border border-[--ft-line] rounded-xl p-8">
						<SectionHeader title="Dodatkowe informacje">
							{#snippet icon()}
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							{/snippet}
						</SectionHeader>
						<textarea
							name="notes"
							value={formData.notes}
							oninput={bindField('notes')}
							placeholder="Uwagi do zamówienia, specjalne instrukcje dostawy (opcjonalnie)"
							rows="4"
							class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full resize-none rounded-xl border border-[--ft-line] px-4 py-3 shadow-sm transition-colors focus:ring-2"
						></textarea>
					</div>
				</div>

				<!-- Right Column: Order Summary -->
				<div class="xl:col-span-1">
					<OrderSummary
						items={cart.items}
						{subtotal}
						{shippingCost}
						{paymentFee}
						{tax}
						{total}
						{processing}
					/>
				</div>
			</form>
		{/if}
	</div>
</div>

<!-- Error Toast -->
{#if form?.message}
	<div
		class="bg-danger fixed right-6 bottom-6 z-50 flex max-w-md items-center space-x-3 rounded-xl px-6 py-4 !text-white shadow-2xl"
	>
		<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
		<span class="font-medium">{form.message}</span>
	</div>
{/if}
