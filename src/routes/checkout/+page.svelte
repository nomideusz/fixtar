<script lang="ts">
	import { cart } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import type { PageData, ActionData } from './$types';
	
	// Get data from server
	let { data, form }: { data: PageData; form?: ActionData } = $props();
	

	// Form data
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
	
	// Initialize from user data
	$effect(() => {
		if (data.user?.email) {
			formData.email = data.user.email;
		}
		
		// Pre-fill from default address if available
		const defaultAddress = data.addresses?.find((addr: any) => addr.default);
		if (defaultAddress) {
			formData.street = defaultAddress.street || '';
			formData.city = defaultAddress.city || '';
			formData.postalCode = defaultAddress.postalCode || '';
		}
	});
	
	let processing = $state(false);
	let errors = $state<Record<string, string>>({});
	let selectedShipping = $state<any>(null);
	let selectedPayment = $state<any>(null);
	
	// Initialize selections when data is loaded
	$effect(() => {
		if (!selectedShipping && data.shippingMethods && data.shippingMethods.length > 0) {
			selectedShipping = data.shippingMethods[0];
		}
		if (!selectedPayment && data.paymentMethods && data.paymentMethods.length > 0) {
			selectedPayment = data.paymentMethods[0];
		}
	});
	
	// Update form data when selections change
	$effect(() => {
		if (selectedShipping) {
			formData.shippingMethod = selectedShipping.id;
		}
		if (selectedPayment) {
			formData.paymentMethod = selectedPayment.code || selectedPayment.id;
		}
	});
	
	// Calculate totals
	let subtotal = $derived(cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
	let shippingCost = $derived(
		!selectedShipping ? 0 :
		(selectedShipping.freeShippingThreshold && subtotal >= selectedShipping.freeShippingThreshold) ? 0 :
		selectedShipping.cost || 0
	);
	let paymentFee = $derived(
		!selectedPayment ? 0 :
		!selectedPayment.processingFee ? 0 :
		selectedPayment.feeType === 'percentage' ? 
			subtotal * (selectedPayment.processingFee / 100) :
			selectedPayment.processingFee
	);
	let tax = $derived(subtotal * 0.23); // 23% VAT in Poland
	let total = $derived(subtotal + shippingCost + paymentFee + tax);
	
	function validateForm() {
		errors = {};
		
		// Check if cart is empty
		if (cart.items.length === 0) {
			errors.cart = 'Koszyk jest pusty';
			return false;
		}
		
		if (!formData.email || !formData.email.includes('@')) {
			errors.email = 'Podaj prawidłowy adres email';
		}
		
		if (!formData.firstName) errors.firstName = 'Imię jest wymagane';
		if (!formData.lastName) errors.lastName = 'Nazwisko jest wymagane';
		if (!formData.street) errors.street = 'Ulica jest wymagana';
		if (!formData.city) errors.city = 'Miasto jest wymagane';
		if (!formData.voivodeship) errors.voivodeship = 'Województwo jest wymagane';
		if (!formData.postalCode || !/^\d{2}-\d{3}$/.test(formData.postalCode)) {
			errors.postalCode = 'Podaj kod pocztowy w formacie XX-XXX';
		}
		if (!formData.phone || !/^[\d\s+\-()]+$/.test(formData.phone)) {
			errors.phone = 'Podaj prawidłowy numer telefonu';
		}
		
		// NIP validation if provided
		if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/\D/g, ''))) {
			errors.nip = 'Podaj prawidłowy NIP (10 cyfr)';
		}
		
		if (!formData.paymentMethod) errors.paymentMethod = 'Wybierz metodę płatności';
		if (!formData.shippingMethod) errors.shippingMethod = 'Wybierz metodę dostawy';
		
		return Object.keys(errors).length === 0;
	}
	
	// Format postal code as user types
	function formatPostalCode(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');
		
		if (value.length >= 2) {
			value = value.slice(0, 2) + '-' + value.slice(2, 5);
		}
		
		formData.postalCode = value;
	}
	
	// Format phone number
	function formatPhone(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');
		
		// Format as Polish phone number
		if (value.length > 0 && !value.startsWith('48')) {
			// Add Polish country code if not present
			value = '48' + value;
		}
		
		// Format: +48 XXX XXX XXX
		if (value.length > 2) {
			const countryCode = value.slice(0, 2);
			const rest = value.slice(2);
			
			let formatted = '+' + countryCode;
			if (rest.length > 0) {
				formatted += ' ' + rest.slice(0, 3);
				if (rest.length > 3) {
					formatted += ' ' + rest.slice(3, 6);
					if (rest.length > 6) {
						formatted += ' ' + rest.slice(6, 9);
					}
				}
			}
			
			formData.phone = formatted;
		} else {
			formData.phone = value;
		}
	}
	
	// Handle form results
	$effect(() => {
		if (form?.success && form?.redirectUrl) {
			// Clear cart and redirect on success
			cart.clear();
			goto(form.redirectUrl);
		} else if (form?.message) {
			// Show error message
			console.error('Checkout error:', form.message);
		}
	});
</script>

<svelte:head>
	<title>Finalizacja Zamówienia - FixTar</title>
	<meta name="description" content="Bezpieczna finalizacja zamówienia - wypełnij dane dostawy i płatności" />
</svelte:head>

<!-- Professional Checkout Hero -->
<Hero
	title="Finalizacja Zamówienia"
	subtitle="Bezpiecznie sfinalizuj swoje zakupy - potrzebujesz tylko kilku kliknięć"
	centered={true}
	className="bg-linear-to-br from-accent-50 via-white to-brand-50"
/>

<div class="bg-neutral-50 min-h-screen">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
		{#if cart.items.length === 0}
			<!-- Enhanced Empty Cart State -->
			<Card class="p-16 text-center max-w-2xl mx-auto">
				<div class="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
					<svg class="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<h2 class="text-3xl font-bold text-neutral-900 mb-4">Twój koszyk jest pusty</h2>
				<p class="text-lg text-neutral-600 mb-8">Dodaj produkty do koszyka, aby przejść do finalizacji zamówienia</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button href="/products" class="text-lg px-8 py-4">
						Przeglądaj produkty
					</Button>
					<Button href="/" variant="outline" class="text-lg px-8 py-4">
						Wróć do strony głównej
					</Button>
				</div>
			</Card>
		{:else}
			<!-- Checkout Progress Indicator -->
			<div class="mb-12">
				<div class="flex items-center justify-center space-x-4">
					<div class="flex items-center">
						<div class="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
						<span class="ml-3 text-sm font-medium text-brand-600">Koszyk</span>
					</div>
					<div class="w-16 h-1 bg-brand-600 rounded"></div>
					<div class="flex items-center">
						<div class="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
						<span class="ml-3 text-sm font-medium text-brand-600">Finalizacja</span>
					</div>
					<div class="w-16 h-1 bg-neutral-300 rounded"></div>
					<div class="flex items-center">
						<div class="w-10 h-10 bg-neutral-300 text-neutral-500 rounded-full flex items-center justify-center font-bold text-sm">3</div>
						<span class="ml-3 text-sm font-medium text-neutral-500">Potwierdzenie</span>
					</div>
				</div>
			</div>

			<form 
				method="POST" 
				action="?/placeOrder"
				use:enhance={({ formData }) => {
					if (!validateForm()) {
						return async () => {};
					}
					
					processing = true;
					
					// Add cart items and totals to formData BEFORE submission
					formData.append('items', JSON.stringify(cart.items.map(item => ({
						productId: item.productId,
						name: item.name,
						price: item.price,
						quantity: item.quantity
					}))));
					
					formData.append('subtotal', subtotal.toString());
					formData.append('shippingCost', shippingCost.toString());
					formData.append('tax', tax.toString());
					formData.append('total', total.toString());
					
					return async ({ result, update }) => {
						processing = false;
						
						if (result.type === 'redirect') {
							// Clear cart on successful order
							cart.clear();
						}
						
						await update();
					};
				}}
				class="grid grid-cols-1 xl:grid-cols-3 gap-8"
			>
				<!-- Enhanced Checkout Form -->
				<div class="xl:col-span-2 space-y-8">
					<!-- Contact Information -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
							<div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold text-neutral-900">Dane kontaktowe</h2>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="email"
								label="Adres email"
								name="email"
								value={formData.email}
								oninput={(e) => formData.email = e.currentTarget.value}
								error={errors.email}
								required
								placeholder="jan.kowalski@example.com"
								class="focus:ring-2 focus:ring-brand-500"
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
								class="focus:ring-2 focus:ring-brand-500"
							/>
						</div>
					</Card>
					
					<!-- Shipping Address -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
<div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
						<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold text-neutral-900">Adres dostawy</h2>
						</div>
						
						<div class="space-y-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="Imię"
									name="firstName"
									value={formData.firstName}
									oninput={(e) => formData.firstName = e.currentTarget.value}
									error={errors.firstName}
									required
									class="focus:ring-2 focus:ring-success"
								/>
								<Input
									label="Nazwisko"
									name="lastName"
									value={formData.lastName}
									oninput={(e) => formData.lastName = e.currentTarget.value}
									error={errors.lastName}
									required
									class="focus:ring-2 focus:ring-success"
								/>
							</div>
							
							<Input
								label="Firma (opcjonalnie)"
								name="company"
								value={formData.company}
								oninput={(e) => formData.company = e.currentTarget.value}
								placeholder="Nazwa firmy"
								class="focus:ring-2 focus:ring-success"
							/>
							
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="md:col-span-2">
									<Input
										label="Ulica i numer domu"
										name="street"
										value={formData.street}
										oninput={(e) => formData.street = e.currentTarget.value}
										error={errors.street}
										required
										placeholder="ul. Przykładowa 123"
										class="focus:ring-2 focus:ring-success"
									/>
								</div>
								<Input
									label="Nr lokalu"
									name="apartment"
									value={formData.apartment}
									oninput={(e) => formData.apartment = e.currentTarget.value}
									placeholder="10"
									class="focus:ring-2 focus:ring-success"
								/>
							</div>
							
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="Miasto"
									name="city"
									value={formData.city}
									oninput={(e) => formData.city = e.currentTarget.value}
									error={errors.city}
									required
									placeholder="Warszawa"
									class="focus:ring-2 focus:ring-success"
								/>
								<div>
									<label for="voivodeship" class="block text-sm font-semibold text-neutral-700 mb-2">
										Województwo
									</label>
									<select
										id="voivodeship"
										name="voivodeship"
										value={formData.voivodeship}
										onchange={(e) => formData.voivodeship = e.currentTarget.value}
										class="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:ring-2 focus:ring-success focus:border-success transition-colors {errors.voivodeship ? 'border-danger focus:ring-danger' : ''}"
										required
									>
										<option value="">Wybierz województwo</option>
										{#each data.voivodeships as voivodeship (voivodeship)}
											<option value={voivodeship}>{voivodeship}</option>
										{/each}
									</select>
									{#if errors.voivodeship}
										<p class="mt-2 text-sm text-danger">{errors.voivodeship}</p>
									{/if}
								</div>
							</div>
							
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="Kod pocztowy"
									name="postalCode"
									value={formData.postalCode}
									oninput={formatPostalCode}
									error={errors.postalCode}
									required
									placeholder="00-001"
									maxlength={6}
									class="focus:ring-2 focus:ring-success"
								/>
								<Input
									label="NIP (dla faktury)"
									name="nip"
									value={formData.nip}
									oninput={(e) => formData.nip = e.currentTarget.value}
									error={errors.nip}
									placeholder="1234567890"
									class="focus:ring-2 focus:ring-success"
								/>
							</div>
							
							{#if data.user}
								<label class="flex items-center">
									<input
										type="checkbox"
										name="saveAddress"
										bind:checked={formData.saveAddress}
										class="rounded border-neutral-300 text-success shadow-sm focus:ring-success h-4 w-4"
									/>
									<span class="ml-3 text-sm font-medium text-neutral-700">Zapisz adres do przyszłych zamówień</span>
								</label>
							{/if}
						</div>
					</Card>
					
					<!-- Enhanced Shipping Method -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
<div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold text-neutral-900">Metoda dostawy</h2>
						</div>
						
						{#if data.shippingMethods && data.shippingMethods.length > 0}
							<div class="space-y-4">
								{#each data.shippingMethods as method (method)}
									<label class="shipping-method-card {selectedShipping?.id === method.id ? 'selected' : ''}">
										<input
											type="radio"
											name="shippingMethod"
											value={method.id}
											checked={selectedShipping?.id === method.id}
											onchange={() => selectedShipping = method}
											class="sr-only"
										/>
										<div class="flex items-start p-6">
											<div class="shrink-0 mt-1">
												<div class="w-4 h-4 border-2 border-neutral-300 rounded-full relative {selectedShipping?.id === method.id ? 'border-accent-600' : ''}">
													{#if selectedShipping?.id === method.id}
														<div class="w-2 h-2 bg-accent-600 rounded-full absolute top-0.5 left-0.5"></div>
													{/if}
												</div>
											</div>
											<div class="ml-4 flex-1">
												<div class="flex justify-between items-start">
													<div>
														<h3 class="text-lg font-bold text-neutral-900">{method.name}</h3>
														<p class="text-sm text-neutral-600 mt-1">{method.description}</p>
														{#if method.estimatedDeliveryDays}
															<div class="flex items-center mt-2">
																<svg class="w-4 h-4 text-neutral-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
																</svg>
																<span class="text-sm text-neutral-500">
																	Dostawa: {method.estimatedDeliveryDays} dni roboczych
																</span>
															</div>
														{/if}
													</div>
													<div class="text-right">
														{#if method.freeShippingThreshold && subtotal >= method.freeShippingThreshold}
															<div class="text-lg font-bold text-success">Darmowa</div>
															<div class="text-sm text-neutral-500 line-through">{method.cost} zł</div>
														{:else}
															<div class="text-lg font-bold text-neutral-900">{method.cost} zł</div>
															{#if method.freeShippingThreshold}
																<div class="text-xs text-neutral-500">
																	Darmowa od {method.freeShippingThreshold} zł
																</div>
															{/if}
														{/if}
													</div>
												</div>
											</div>
										</div>
									</label>
								{/each}
							</div>
						{:else}
							<div class="text-center py-8">
								<div class="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
									<svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<p class="text-neutral-500">Brak dostępnych metod dostawy. Skontaktuj się z obsługą.</p>
							</div>
						{/if}
						{#if errors.shippingMethod}
							<p class="mt-3 text-sm text-danger">{errors.shippingMethod}</p>
						{/if}
					</Card>
					
					<!-- Enhanced Payment Method -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
							<div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold text-neutral-900">Metoda płatności</h2>
						</div>
						
						{#if data.paymentMethods && data.paymentMethods.length > 0}
							<div class="space-y-4">
								{#each data.paymentMethods as method (method)}
									<label class="payment-method-card {selectedPayment?.id === method.id ? 'selected' : ''}">
										<input
											type="radio"
											name="paymentMethod"
											value={method.code || method.id}
											checked={selectedPayment?.id === method.id}
											onchange={() => selectedPayment = method}
											class="sr-only"
										/>
										<div class="flex items-start p-6">
											<div class="shrink-0 mt-1">
												<div class="w-4 h-4 border-2 border-neutral-300 rounded-full relative {selectedPayment?.id === method.id ? 'border-brand-600' : ''}">
													{#if selectedPayment?.id === method.id}
														<div class="w-2 h-2 bg-brand-600 rounded-full absolute top-0.5 left-0.5"></div>
													{/if}
												</div>
											</div>
											<div class="ml-4 flex-1">
												<div class="flex justify-between items-start">
													<div>
														<h3 class="text-lg font-bold text-neutral-900">{method.name}</h3>
														<p class="text-sm text-neutral-600 mt-1">{method.description}</p>
													</div>
													{#if method.processingFee}
														<div class="text-right">
															<div class="text-sm text-neutral-600">
																+{method.feeType === 'percentage' ? `${method.processingFee}%` : `${method.processingFee} zł`}
															</div>
														</div>
													{/if}
												</div>
											</div>
										</div>
									</label>
								{/each}
							</div>
						{:else}
							<div class="text-center py-8">
								<div class="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
									<svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<p class="text-neutral-500">Brak dostępnych metod płatności. Skontaktuj się z obsługą.</p>
							</div>
						{/if}
						{#if errors.paymentMethod}
							<p class="mt-3 text-sm text-danger">{errors.paymentMethod}</p>
						{/if}
					</Card>
					
					<!-- Additional notes -->
					<Card class="p-8">
						<div class="flex items-center mb-6">
							<div class="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</div>
							<h2 class="text-2xl font-bold text-neutral-900">Dodatkowe informacje</h2>
						</div>
						<textarea
							name="notes"
							value={formData.notes}
							oninput={(e) => formData.notes = e.currentTarget.value}
							placeholder="Uwagi do zamówienia, specjalne instrukcje dostawy (opcjonalnie)"
							rows="4"
							class="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
						></textarea>
					</Card>
				</div>
				
				<!-- Enhanced Order Summary -->
				<div class="xl:col-span-1">
					<div class="sticky top-8">
						<Card class="p-8">
							<h2 class="text-2xl font-bold text-neutral-900 mb-6">Podsumowanie zamówienia</h2>
							
							<!-- Items with enhanced design -->
							<div class="space-y-4 mb-6">
								{#each cart.items as item (item)}
									<div class="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
										{#if item.image}
											<div class="w-16 h-16 rounded-lg overflow-hidden shrink-0">
												<img src={item.image} alt={item.name} class="w-full h-full object-cover">
											</div>
										{:else}
											<div class="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center shrink-0">
												<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
										{/if}
										<div class="flex-1 min-w-0">
											<h3 class="text-sm font-semibold text-neutral-900 truncate">{item.name}</h3>
											<p class="text-sm text-neutral-600">Ilość: {item.quantity}</p>
											<p class="text-sm font-bold text-brand-600">{(item.price * item.quantity).toFixed(2)} zł</p>
										</div>
									</div>
								{/each}
							</div>
							
							<!-- Enhanced Totals -->
							<div class="border-t border-neutral-200 pt-6 space-y-4">
								<div class="flex justify-between text-sm">
									<span class="text-neutral-600">Suma częściowa</span>
									<span class="font-semibold text-neutral-900">{subtotal.toFixed(2)} zł</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-neutral-600">Dostawa</span>
									<span class="font-semibold {shippingCost === 0 ? 'text-success' : 'text-neutral-900'}">
										{shippingCost === 0 ? 'Darmowa' : `${shippingCost.toFixed(2)} zł`}
									</span>
								</div>
								{#if paymentFee > 0}
									<div class="flex justify-between text-sm">
										<span class="text-neutral-600">Opłata za płatność</span>
										<span class="font-semibold text-neutral-900">{paymentFee.toFixed(2)} zł</span>
									</div>
								{/if}
								<div class="flex justify-between text-sm">
									<span class="text-neutral-600">VAT (23%)</span>
									<span class="font-semibold text-neutral-900">{tax.toFixed(2)} zł</span>
								</div>
								<div class="flex justify-between text-xl font-bold pt-4 border-t border-neutral-200">
									<span class="text-neutral-900">Do zapłaty</span>
									<span class="text-brand-600">{total.toFixed(2)} zł</span>
								</div>
							</div>
							
							<!-- Enhanced Submit Button -->
							<Button 
								type="submit" 
								fullWidth 
								size="lg" 
								disabled={processing}
								class="mt-8 bg-linear-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
							>
								{#if processing}
									<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Przetwarzanie zamówienia...
								{:else}
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Złóż zamówienie
								{/if}
							</Button>
							
							<!-- Enhanced Security & Legal Notes -->
							<div class="mt-6 p-4 bg-neutral-50 rounded-xl">
								<div class="flex items-center text-sm text-neutral-600 mb-3">
									<svg class="w-4 h-4 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
									Bezpieczne szyfrowane połączenie SSL
								</div>
								<div class="text-xs text-neutral-500 space-y-1">
									<p>Składając zamówienie, akceptujesz nasz</p>
									<p>
										<a href="/regulamin" class="underline hover:text-neutral-700 font-medium">Regulamin</a>
										&nbsp;i&nbsp;
										<a href="/polityka-prywatnosci" class="underline hover:text-neutral-700 font-medium">Politykę prywatności</a>
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>

<!-- Enhanced Error Message -->
{#if form?.message}
	<div class="fixed bottom-6 right-6 bg-danger text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md z-50">
		<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
		</svg>
		<span class="font-medium">{form.message}</span>
	</div>
{/if}

<style>
	.shipping-method-card {
		display: block;
		border: 2px solid var(--color-neutral-200);
		border-radius: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		background: white;
	}
	
	.shipping-method-card:hover {
		border-color: var(--color-accent-300);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	
	.shipping-method-card.selected {
		border-color: var(--color-accent-600);
		background: var(--color-accent-50);
		box-shadow: 0 0 0 1px var(--color-accent-600 / 0.1);
	}
	
	.payment-method-card {
		display: block;
		border: 2px solid var(--color-neutral-200);
		border-radius: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		background: white;
	}
	
	.payment-method-card:hover {
		border-color: var(--color-brand-400);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	
	.payment-method-card.selected {
		border-color: var(--color-brand-500);
		background: var(--color-brand-50);
		box-shadow: 0 0 0 1px var(--color-brand-500 / 0.1);
	}
</style> 



