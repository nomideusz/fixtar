<script lang="ts">
	import { cart } from '$lib/stores';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import OrderSummary from '$lib/components/checkout/OrderSummary.svelte';
	import type { PageData, ActionData } from './$types';
	import { ShoppingCartSimpleIcon, ClockIcon } from 'phosphor-svelte';

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
		saveAddress: false
	});

	let processing = $state(false);
	let errors = $state<Record<string, string>>({});
	let selectedShipping = $state<any>(null);
	let selectedPayment = $state<any>(null);
	let showCompany = $state(false);
	let showNotes = $state(false);

	// --- Initialization ---
	$effect(() => {
		if (data.user?.email && !formData.email) formData.email = data.user.email;
		const defaultAddress = data.addresses?.find((addr: any) => addr.default);
		if (defaultAddress && !formData.street) {
			formData.street = defaultAddress.street || '';
			formData.city = defaultAddress.city || '';
			formData.postalCode = defaultAddress.postalCode || '';
		}
	});

	$effect(() => {
		if (!selectedShipping && data.shippingMethods?.length > 0)
			selectedShipping = data.shippingMethods[0];
		if (!selectedPayment && data.paymentMethods?.length > 0)
			selectedPayment = data.paymentMethods[0];
	});

	$effect(() => {
		if (selectedShipping) formData.shippingMethod = selectedShipping.id;
		if (selectedPayment) formData.paymentMethod = selectedPayment.code || selectedPayment.id;
	});

	$effect(() => {
		if (form?.message) notifications.error(form.message);
	});

	// --- Totals ---
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
			errors.postalCode = 'Format: XX-XXX';
		if (!formData.phone || !/^[\d\s+\-()]+$/.test(formData.phone))
			errors.phone = 'Podaj numer telefonu';
		if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/\D/g, '')))
			errors.nip = 'NIP: 10 cyfr';
		if (!formData.paymentMethod) errors.paymentMethod = 'Wybierz metodę płatności';
		if (!formData.shippingMethod) errors.shippingMethod = 'Wybierz metodę dostawy';
		return Object.keys(errors).length === 0;
	}

	// --- Formatters ---
	function formatPostalCode(e: Event) {
		let value = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '');
		if (value.length >= 2) value = value.slice(0, 2) + '-' + value.slice(2, 5);
		formData.postalCode = value;
	}

	function formatPhone(e: Event) {
		let value = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, '');
		if (value.length > 0 && !value.startsWith('48')) value = '48' + value;
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

	function formatPrice(v: number): string {
		return v.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

<svelte:head>
	<title>Zamówienie — FixTar</title>
</svelte:head>

<section class="ft-container ft-section">
	{#if cart.items.length === 0}
		<div class="empty">
			<ShoppingCartSimpleIcon size={40} weight="regular" aria-hidden="true" />
			<h2>Koszyk jest pusty</h2>
			<a href="/products" class="empty-link">Przeglądaj produkty →</a>
		</div>
	{:else}
		<header class="page-head">
			<p class="ft-label">krok 2 z 3</p>
			<h1 class="page-title">Zamówienie</h1>
		</header>

		<form
			method="POST"
			action="?/placeOrder"
			use:enhance={({ formData: fd }) => {
				if (!validateForm()) return async () => {};
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
			class="grid"
		>
			<div class="form-col">
				<!-- Contact -->
				<section class="group">
					<p class="ft-label group-label">kontakt</p>

					<label class="field">
						<span class="field-label">Email</span>
						<input
							type="email"
							name="email"
							bind:value={formData.email}
							placeholder="jan@example.com"
							class="input"
							class:input--error={errors.email}
							required
						/>
						{#if errors.email}<span class="field-error">{errors.email}</span>{/if}
					</label>

					<label class="field">
						<span class="field-label">Telefon</span>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							oninput={formatPhone}
							placeholder="+48 123 456 789"
							class="input"
							class:input--error={errors.phone}
							required
						/>
						{#if errors.phone}<span class="field-error">{errors.phone}</span>{/if}
					</label>
				</section>

				<!-- Shipping Address -->
				<section class="group">
					<p class="ft-label group-label">adres dostawy</p>

					<div class="row row--2">
						<label class="field">
							<span class="field-label">Imię</span>
							<input
								name="firstName"
								bind:value={formData.firstName}
								class="input"
								class:input--error={errors.firstName}
								required
							/>
							{#if errors.firstName}<span class="field-error">{errors.firstName}</span>{/if}
						</label>
						<label class="field">
							<span class="field-label">Nazwisko</span>
							<input
								name="lastName"
								bind:value={formData.lastName}
								class="input"
								class:input--error={errors.lastName}
								required
							/>
							{#if errors.lastName}<span class="field-error">{errors.lastName}</span>{/if}
						</label>
					</div>

					<div class="row row--street">
						<label class="field">
							<span class="field-label">Ulica i numer</span>
							<input
								name="street"
								bind:value={formData.street}
								placeholder="ul. Przykładowa 123"
								class="input"
								class:input--error={errors.street}
								required
							/>
							{#if errors.street}<span class="field-error">{errors.street}</span>{/if}
						</label>
						<label class="field">
							<span class="field-label">Lokal</span>
							<input
								name="apartment"
								bind:value={formData.apartment}
								placeholder="10"
								class="input"
							/>
						</label>
					</div>

					<div class="row row--2">
						<label class="field">
							<span class="field-label">Kod pocztowy</span>
							<input
								name="postalCode"
								value={formData.postalCode}
								oninput={formatPostalCode}
								placeholder="00-001"
								maxlength={6}
								class="input"
								class:input--error={errors.postalCode}
								required
							/>
							{#if errors.postalCode}<span class="field-error">{errors.postalCode}</span>{/if}
						</label>
						<label class="field">
							<span class="field-label">Miasto</span>
							<input
								name="city"
								bind:value={formData.city}
								class="input"
								class:input--error={errors.city}
								required
							/>
							{#if errors.city}<span class="field-error">{errors.city}</span>{/if}
						</label>
					</div>

					<label class="field">
						<span class="field-label">Województwo</span>
						<select
							name="voivodeship"
							bind:value={formData.voivodeship}
							class="input select"
							class:input--error={errors.voivodeship}
							required
						>
							<option value="">Wybierz województwo</option>
							{#each data.voivodeships as v (v)}
								<option value={v}>{v}</option>
							{/each}
						</select>
						{#if errors.voivodeship}<span class="field-error">{errors.voivodeship}</span>{/if}
					</label>

					<!-- Company info collapsed by default -->
					{#if !showCompany}
						<button type="button" class="toggle" onclick={() => (showCompany = true)}>
							+ Kupuję na firmę (NIP, dane do faktury)
						</button>
					{:else}
						<div class="row row--2">
							<label class="field">
								<span class="field-label">NIP</span>
								<input
									name="nip"
									bind:value={formData.nip}
									placeholder="1234567890"
									class="input"
									class:input--error={errors.nip}
								/>
								{#if errors.nip}<span class="field-error">{errors.nip}</span>{/if}
							</label>
							<label class="field">
								<span class="field-label">Firma</span>
								<input
									name="company"
									bind:value={formData.company}
									placeholder="Nazwa firmy"
									class="input"
								/>
							</label>
						</div>
					{/if}

					{#if data.user}
						<label class="checkbox">
							<input type="checkbox" name="saveAddress" bind:checked={formData.saveAddress} />
							<span>Zapisz adres na przyszłość</span>
						</label>
					{/if}
				</section>

				<!-- Shipping method -->
				<section class="group">
					<p class="ft-label group-label">dostawa</p>
					<div class="methods">
						{#each data.shippingMethods ?? [] as method (method.id)}
							{@const isSelected = selectedShipping?.id === method.id}
							{@const isFree =
								method.freeShippingThreshold && subtotal >= method.freeShippingThreshold}
							<label class="method" class:method--active={isSelected}>
								<input
									type="radio"
									name="shippingMethod"
									value={method.id}
									checked={isSelected}
									onchange={() => (selectedShipping = method)}
									class="method-radio"
								/>
								<span class="method-body">
									<span class="method-name">{method.name}</span>
									{#if method.estimatedDeliveryDays}
										<span class="method-meta">
											<ClockIcon size={12} aria-hidden="true" />
											{method.estimatedDeliveryDays} dni
										</span>
									{/if}
								</span>
								<span class="method-price" class:method-free={isFree}>
									{isFree ? 'gratis' : formatPrice(method.cost)}
								</span>
							</label>
						{/each}
					</div>
					{#if errors.shippingMethod}<span class="field-error">{errors.shippingMethod}</span>{/if}
				</section>

				<!-- Payment method -->
				<section class="group">
					<p class="ft-label group-label">płatność</p>
					<div class="methods">
						{#each data.paymentMethods ?? [] as method (method.id)}
							{@const isSelected = selectedPayment?.id === method.id}
							<label class="method" class:method--active={isSelected}>
								<input
									type="radio"
									name="paymentMethod"
									value={method.code || method.id}
									checked={isSelected}
									onchange={() => (selectedPayment = method)}
									class="method-radio"
								/>
								<span class="method-body">
									<span class="method-name">{method.name}</span>
									{#if method.description}
										<span class="method-meta">{method.description}</span>
									{/if}
								</span>
								{#if method.processingFee}
									<span class="method-price">
										+{(method as any).feeType === 'percentage'
											? `${method.processingFee}%`
											: `${method.processingFee} zł`}
									</span>
								{/if}
							</label>
						{/each}
					</div>
					{#if errors.paymentMethod}<span class="field-error">{errors.paymentMethod}</span>{/if}
				</section>

				<!-- Notes -->
				<section class="group">
					{#if !showNotes}
						<button type="button" class="toggle" onclick={() => (showNotes = true)}>
							+ Dodaj uwagi do zamówienia
						</button>
					{:else}
						<label class="field">
							<span class="field-label">Uwagi</span>
							<textarea
								name="notes"
								bind:value={formData.notes}
								rows="3"
								placeholder="np. dzwonić przed doręczeniem"
								class="input textarea"
							></textarea>
						</label>
					{/if}
				</section>
			</div>

			<aside class="summary-col">
				<OrderSummary
					items={cart.items}
					{subtotal}
					{shippingCost}
					{paymentFee}
					{tax}
					{total}
					{processing}
				/>
			</aside>
		</form>
	{/if}
</section>

<style>
	/* ── Page head ── */
	.page-head {
		margin-bottom: clamp(24px, 4vh, 40px);
	}

	.page-title {
		margin-top: 6px;
		font-family: var(--font-sans);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	/* ── Empty ── */
	.empty {
		text-align: center;
		padding: clamp(48px, 8vh, 96px) 0;
		color: var(--ft-text-muted);
	}

	.empty :global(svg) {
		color: var(--ft-text-faint);
		margin: 0 auto 16px;
		display: block;
	}

	.empty h2 {
		font-family: var(--font-sans);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--ft-text-strong);
		margin-bottom: 12px;
		letter-spacing: -0.01em;
	}

	.empty-link {
		color: var(--ft-text);
		text-decoration: none;
		font-size: 0.9375rem;
	}

	.empty-link:hover {
		color: var(--ft-text-strong);
	}

	/* ── Grid: form + summary ── */
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		align-items: start;
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: minmax(0, 560px) minmax(0, 400px);
			gap: 64px;
			justify-content: space-between;
		}
	}

	.form-col {
		display: flex;
		flex-direction: column;
		gap: clamp(32px, 5vh, 48px);
	}

	/* ── Groups ── */
	.group-label {
		margin-bottom: 16px;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* ── Fields ── */
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 0.8125rem;
		color: var(--ft-text-muted);
	}

	.field-error {
		margin-top: 2px;
		font-size: 0.8125rem;
		color: var(--color-danger);
	}

	.input {
		width: 100%;
		padding: 10px 14px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		min-height: 44px;
		transition: border-color var(--dur-fast) ease;
	}

	.input::placeholder {
		color: var(--ft-text-faint);
	}

	.input:focus {
		outline: none;
		border-color: var(--ft-text-strong);
	}

	.input--error {
		border-color: var(--color-danger);
	}

	.textarea {
		resize: vertical;
		min-height: 88px;
	}

	.select {
		appearance: none;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7276'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 16px;
		padding-right: 36px;
	}

	/* ── Rows ── */
	.row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 560px) {
		.row--2 {
			grid-template-columns: 1fr 1fr;
		}
		.row--street {
			grid-template-columns: 1fr 100px;
		}
	}

	/* ── Checkbox ── */
	.checkbox {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
		font-size: 0.875rem;
		color: var(--ft-text);
		cursor: pointer;
	}

	.checkbox input {
		width: 16px;
		height: 16px;
		accent-color: var(--ft-text-strong);
	}

	/* ── Toggle link ── */
	.toggle {
		align-self: flex-start;
		background: none;
		border: none;
		padding: 4px 0;
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--ft-text-muted);
		cursor: pointer;
		transition: color var(--dur-fast) ease;
	}

	.toggle:hover {
		color: var(--ft-text-strong);
	}

	/* ── Methods (radio list) ── */
	.methods {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.method {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.method:hover:not(.method--active) {
		border-color: var(--ft-text-muted);
	}

	.method--active {
		border-color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.method-radio {
		width: 16px;
		height: 16px;
		margin: 0;
		accent-color: var(--ft-text-strong);
		flex-shrink: 0;
	}

	.method-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.method-name {
		font-size: 0.9375rem;
		color: var(--ft-text);
	}

	.method-meta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.8125rem;
		color: var(--ft-text-muted);
	}

	.method-price {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text);
		flex-shrink: 0;
	}

	.method-free {
		color: var(--color-success);
	}

	/* ── Summary column sticky on desktop ── */
	.summary-col {
		position: relative;
	}

	@media (min-width: 960px) {
		.summary-col {
			position: sticky;
			top: 96px;
		}
	}
</style>
