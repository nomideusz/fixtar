<script lang="ts">
	import { cart } from '$lib/stores';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/Input.svelte';
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
		useShippingAsBilling: true,
		saveAddress: false
	});

	let processing = $state(false);
	let errors = $state<Record<string, string>>({});
	let selectedShipping = $state<any>(null);
	let selectedPayment = $state<any>(null);
	let showNotes = $state(false);

	// --- Initialization ---

	$effect(() => {
		if (data.user?.email) formData.email = data.user.email;
		const defaultAddress = data.addresses?.find((addr: any) => addr.default);
		if (defaultAddress) {
			formData.street = defaultAddress.street || '';
			formData.city = defaultAddress.city || '';
			formData.postalCode = defaultAddress.postalCode || '';
		}
	});

	$effect(() => {
		if (!selectedShipping && data.shippingMethods?.length > 0) selectedShipping = data.shippingMethods[0];
		if (!selectedPayment && data.paymentMethods?.length > 0) selectedPayment = data.paymentMethods[0];
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
		if (cart.items.length === 0) { errors.cart = 'Koszyk jest pusty'; return false; }
		if (!formData.email || !formData.email.includes('@')) errors.email = 'Podaj prawidłowy adres email';
		if (!formData.firstName) errors.firstName = 'Imię jest wymagane';
		if (!formData.lastName) errors.lastName = 'Nazwisko jest wymagane';
		if (!formData.street) errors.street = 'Ulica jest wymagana';
		if (!formData.city) errors.city = 'Miasto jest wymagane';
		if (!formData.voivodeship) errors.voivodeship = 'Województwo jest wymagane';
		if (!formData.postalCode || !/^\d{2}-\d{3}$/.test(formData.postalCode)) errors.postalCode = 'Format: XX-XXX';
		if (!formData.phone || !/^[\d\s+\-()]+$/.test(formData.phone)) errors.phone = 'Podaj numer telefonu';
		if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/\D/g, ''))) errors.nip = 'NIP: 10 cyfr';
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

	function bindField(field: keyof typeof formData) {
		return (e: Event) => { (formData as any)[field] = (e.currentTarget as HTMLInputElement).value; };
	}

	function formatPrice(v: number): string {
		return v.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

<svelte:head>
	<title>Zamówienie — FixTar</title>
</svelte:head>

<div class="ft-container checkout-page">
	{#if cart.items.length === 0}
		<div class="checkout-empty">
			<ShoppingCartSimpleIcon size={48} weight="light" aria-hidden="true" />
			<h2>Koszyk jest pusty</h2>
			<a href="/products">Przeglądaj produkty</a>
		</div>
	{:else}
		<!-- Progress -->
		<nav class="checkout-progress" aria-label="Postęp zamówienia">
			<span class="step done">1. Koszyk</span>
			<span class="step-line done"></span>
			<span class="step active">2. Zamówienie</span>
			<span class="step-line"></span>
			<span class="step">3. Gotowe</span>
		</nav>

		<form
			method="POST"
			action="?/placeOrder"
			use:enhance={({ formData: fd }) => {
				if (!validateForm()) return async () => {};
				processing = true;
				fd.append('items', JSON.stringify(cart.items.map((item) => ({
					productId: item.productId, name: item.name, price: item.price, quantity: item.quantity
				}))));
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
			class="checkout-grid"
		>
			<!-- Left: Form -->
			<div class="checkout-form">
				<!-- Contact -->
				<fieldset class="checkout-section">
					<legend class="section-label">Kontakt</legend>
					<div class="field-row">
						<Input type="email" label="Email" name="email" value={formData.email} oninput={bindField('email')} error={errors.email} required placeholder="jan@example.com" />
						<Input type="tel" label="Telefon" name="phone" value={formData.phone} oninput={formatPhone} error={errors.phone} required placeholder="+48 123 456 789" />
					</div>
				</fieldset>

				<!-- Address -->
				<fieldset class="checkout-section">
					<legend class="section-label">Adres dostawy</legend>
					<div class="field-row">
						<Input label="Imię" name="firstName" value={formData.firstName} oninput={bindField('firstName')} error={errors.firstName} required />
						<Input label="Nazwisko" name="lastName" value={formData.lastName} oninput={bindField('lastName')} error={errors.lastName} required />
					</div>
					<div class="field-row field-row--3">
						<div class="col-span-2">
							<Input label="Ulica i numer" name="street" value={formData.street} oninput={bindField('street')} error={errors.street} required placeholder="ul. Przykładowa 123" />
						</div>
						<Input label="Lokal" name="apartment" value={formData.apartment} oninput={bindField('apartment')} placeholder="10" />
					</div>
					<div class="field-row">
						<Input label="Miasto" name="city" value={formData.city} oninput={bindField('city')} error={errors.city} required />
						<div>
							<label for="voivodeship" class="select-label">Województwo</label>
							<select id="voivodeship" name="voivodeship" value={formData.voivodeship} onchange={bindField('voivodeship')} class="select-field" class:select-error={errors.voivodeship} required>
								<option value="">Wybierz</option>
								{#each data.voivodeships as v (v)}<option value={v}>{v}</option>{/each}
							</select>
							{#if errors.voivodeship}<p class="field-error">{errors.voivodeship}</p>{/if}
						</div>
					</div>
					<div class="field-row">
						<Input label="Kod pocztowy" name="postalCode" value={formData.postalCode} oninput={formatPostalCode} error={errors.postalCode} required placeholder="00-001" maxlength={6} />
						<Input label="NIP (opcjonalnie)" name="nip" value={formData.nip} oninput={bindField('nip')} error={errors.nip} placeholder="1234567890" />
					</div>
					<Input label="Firma (opcjonalnie)" name="company" value={formData.company} oninput={bindField('company')} placeholder="Nazwa firmy" />
					{#if data.user}
						<label class="checkbox-row">
							<input type="checkbox" name="saveAddress" bind:checked={formData.saveAddress} />
							<span>Zapisz adres na przyszłość</span>
						</label>
					{/if}
				</fieldset>

				<!-- Shipping -->
				<fieldset class="checkout-section">
					<legend class="section-label">Dostawa</legend>
					{#if data.shippingMethods?.length > 0}
						<div class="method-list">
							{#each data.shippingMethods as method (method.id)}
								{@const isSelected = selectedShipping?.id === method.id}
								{@const isFree = method.freeShippingThreshold && subtotal >= method.freeShippingThreshold}
								<label class="method-option" class:method-selected={isSelected}>
									<input type="radio" name="shippingMethod" value={method.id} checked={isSelected} onchange={() => (selectedShipping = method)} class="sr-only" />
									<div class="method-radio" class:checked={isSelected}>{#if isSelected}<div class="method-dot"></div>{/if}</div>
									<div class="method-info">
										<span class="method-name">{method.name}</span>
										{#if method.estimatedDeliveryDays}
											<span class="method-meta"><ClockIcon size={12} aria-hidden="true" /> {method.estimatedDeliveryDays} dni</span>
										{/if}
									</div>
									<span class="method-price" class:method-free={isFree}>
										{isFree ? 'Darmowa' : formatPrice(method.cost)}
									</span>
								</label>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-[--ft-text-muted]">Brak dostępnych metod dostawy.</p>
					{/if}
					{#if errors.shippingMethod}<p class="field-error">{errors.shippingMethod}</p>{/if}
				</fieldset>

				<!-- Payment -->
				<fieldset class="checkout-section">
					<legend class="section-label">Płatność</legend>
					{#if data.paymentMethods?.length > 0}
						<div class="method-list">
							{#each data.paymentMethods as method (method.id)}
								{@const isSelected = selectedPayment?.id === method.id}
								<label class="method-option" class:method-selected={isSelected}>
									<input type="radio" name="paymentMethod" value={method.code || method.id} checked={isSelected} onchange={() => (selectedPayment = method)} class="sr-only" />
									<div class="method-radio" class:checked={isSelected}>{#if isSelected}<div class="method-dot"></div>{/if}</div>
									<div class="method-info">
										<span class="method-name">{method.name}</span>
										<span class="method-desc">{method.description}</span>
									</div>
									{#if method.processingFee}
										<span class="method-fee">+{(method as any).feeType === 'percentage' ? `${method.processingFee}%` : `${method.processingFee} zł`}</span>
									{/if}
								</label>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-[--ft-text-muted]">Brak dostępnych metod płatności.</p>
					{/if}
					{#if errors.paymentMethod}<p class="field-error">{errors.paymentMethod}</p>{/if}
				</fieldset>

				<!-- Notes toggle -->
				<div class="notes-toggle">
					<button type="button" onclick={() => (showNotes = !showNotes)} class="notes-btn">
						{showNotes ? '− Ukryj uwagi' : '+ Dodaj uwagi do zamówienia'}
					</button>
					{#if showNotes}
						<textarea
							name="notes"
							value={formData.notes}
							oninput={bindField('notes')}
							placeholder="Uwagi do zamówienia (opcjonalnie)"
							rows="3"
							class="notes-textarea"
						></textarea>
					{/if}
				</div>
			</div>

			<!-- Right: Summary -->
			<div class="checkout-summary">
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

<style>
	.checkout-page {
		padding-top: clamp(24px, 3vh, 40px);
		padding-bottom: clamp(48px, 6vh, 80px);
	}

	/* ── Empty state ── */
	.checkout-empty {
		text-align: center;
		padding: clamp(48px, 8vh, 96px) 0;
		color: var(--ft-text-muted);
	}

	.checkout-empty :global(svg) {
		color: var(--ft-text-faint);
		margin: 0 auto 16px;
	}

	.checkout-empty h2 {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.checkout-empty a {
		color: var(--ft-accent);
		font-weight: 600;
		font-size: 0.88rem;
	}

	/* ── Progress ── */
	.checkout-progress {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		margin-bottom: clamp(24px, 3vh, 36px);
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.step {
		color: var(--ft-text-faint);
		padding: 0 8px;
	}

	.step.done { color: var(--ft-accent); }
	.step.active { color: var(--ft-dark); }

	.step-line {
		width: 32px;
		height: 1px;
		background: var(--ft-line);
	}

	.step-line.done { background: var(--ft-accent); }

	/* ── Grid ── */
	.checkout-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
	}

	@media (min-width: 1024px) {
		.checkout-grid {
			grid-template-columns: 1fr 380px;
			gap: 40px;
		}
	}

	/* ── Form sections ── */
	.checkout-form {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.checkout-section {
		border: none;
		padding: 0;
		margin: 0;
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid var(--ft-line);
	}

	.section-label {
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-dark);
		margin-bottom: 16px;
	}

	/* ── Field rows ── */
	.field-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin-bottom: 12px;
	}

	@media (min-width: 640px) {
		.field-row { grid-template-columns: 1fr 1fr; }
		.field-row--3 { grid-template-columns: 2fr 1fr; }
	}

	.col-span-2 { grid-column: span 1; }
	@media (min-width: 640px) { .col-span-2 { grid-column: span 1; } }

	.select-label {
		display: block;
		margin-bottom: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.select-field {
		width: 100%;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm, 6px);
		background: var(--ft-surface);
		color: var(--ft-dark);
		font-family: var(--font-sans);
		padding: 10px 14px;
		font-size: 0.95rem;
		transition: border-color 0.15s;
	}

	.select-field:focus {
		outline: none;
		border-color: var(--ft-cta);
		box-shadow: 0 0 0 3px var(--ft-cta-light);
	}

	.select-error { border-color: var(--color-danger); }

	.field-error {
		margin-top: 4px;
		font-size: 0.78rem;
		color: var(--color-danger);
	}

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		font-size: 0.85rem;
		color: var(--ft-text);
		cursor: pointer;
	}

	.checkbox-row input {
		width: 16px;
		height: 16px;
		border-radius: 3px;
		border: 1px solid var(--ft-line);
		accent-color: var(--ft-accent);
	}

	/* ── Method cards (compact) ── */
	.method-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.method-option {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: border-color 0.15s, background-color 0.15s;
		background: var(--ft-surface);
	}

	.method-option:hover { border-color: var(--ft-accent); }

	.method-selected {
		border-color: var(--ft-accent);
		background: var(--ft-frost);
	}

	.method-radio {
		position: relative;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid var(--ft-line);
		flex-shrink: 0;
		transition: border-color 0.15s;
	}

	.method-radio.checked { border-color: var(--ft-accent); }

	.method-dot {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ft-accent);
	}

	.method-info {
		flex: 1;
		min-width: 0;
	}

	.method-name {
		display: block;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.method-desc {
		display: block;
		font-size: 0.75rem;
		color: var(--ft-text-muted);
	}

	.method-meta {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 0.72rem;
		color: var(--ft-text-muted);
	}

	.method-price {
		font-family: var(--font-display);
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--ft-dark);
		flex-shrink: 0;
	}

	.method-free { color: var(--color-success); }

	.method-fee {
		font-size: 0.75rem;
		color: var(--ft-text-muted);
		flex-shrink: 0;
	}

	/* ── Notes ── */
	.notes-toggle {
		padding-top: 8px;
	}

	.notes-btn {
		background: none;
		border: none;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		cursor: pointer;
		padding: 0;
		transition: color 0.15s;
	}

	.notes-btn:hover { color: var(--ft-dark); }

	.notes-textarea {
		width: 100%;
		margin-top: 10px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		padding: 10px 14px;
		font-size: 0.88rem;
		font-family: var(--font-sans);
		resize: none;
		color: var(--ft-dark);
		transition: border-color 0.15s;
	}

	.notes-textarea:focus {
		outline: none;
		border-color: var(--ft-cta);
		box-shadow: 0 0 0 3px var(--ft-cta-light);
	}

	/* ── Summary column ── */
	.checkout-summary {
		/* Handled by OrderSummary sticky */
	}
</style>
