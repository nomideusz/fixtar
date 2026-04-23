<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { notifications } from '$lib/stores';
	import { SpinnerGapIcon } from 'phosphor-svelte';

	const { form } = $props<{ form?: any }>();

	let formData = $state({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		acceptTerms: false,
		acceptMarketing: false
	});

	let loading = $state(false);
	let errors = $state<Record<string, string>>({});
	let passwordStrength = $state(0);

	$effect(() => {
		let strength = 0;
		const p = formData.password;
		if (p.length >= 8) strength++;
		if (/[A-Z]/.test(p)) strength++;
		if (/[a-z]/.test(p)) strength++;
		if (/[0-9]/.test(p)) strength++;
		if (/[^A-Za-z0-9]/.test(p)) strength++;
		passwordStrength = strength;
	});

	$effect(() => {
		errors.general = form?.message ?? '';
	});

	function validateForm() {
		errors = {};
		if (!formData.firstName.trim()) errors.firstName = 'Imię jest wymagane';
		if (!formData.lastName.trim()) errors.lastName = 'Nazwisko jest wymagane';
		if (!formData.email || !formData.email.includes('@')) {
			errors.email = 'Podaj prawidłowy adres email';
		}
		if (!formData.password || formData.password.length < 8) {
			errors.password = 'Hasło musi mieć co najmniej 8 znaków';
		}
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Hasła nie są identyczne';
		}
		if (!formData.acceptTerms) {
			errors.acceptTerms = 'Musisz zaakceptować regulamin i politykę prywatności';
		}
		return Object.keys(errors).length === 0;
	}

	const strengthLabel = $derived(
		['Bardzo słabe', 'Bardzo słabe', 'Słabe', 'Średnie', 'Silne', 'Bardzo silne'][passwordStrength]
	);

	const strengthColor = $derived.by(() => {
		if (passwordStrength <= 1) return 'var(--color-danger)';
		if (passwordStrength === 2) return 'var(--color-warning)';
		if (passwordStrength === 3) return 'var(--color-warning)';
		return 'var(--color-success)';
	});
</script>

<svelte:head>
	<title>Rejestracja — FixTar</title>
	<meta name="description" content="Utwórz konto w sklepie FixTar" />
</svelte:head>

<section class="ft-container auth-page">
	<div class="auth-inner">
		<header class="auth-head">
			<p class="ft-label">konto</p>
			<h1 class="auth-title">Utwórz konto</h1>
			<p class="auth-subtitle">Dołącz do FixTar — kilka sekund i gotowe.</p>
		</header>

		<form
			method="POST"
			use:enhance={({ formData: fd, cancel }) => {
				if (!validateForm()) {
					cancel();
					return;
				}
				loading = true;
				fd.append('firstName', formData.firstName);
				fd.append('lastName', formData.lastName);
				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'redirect' || result.type === 'success') {
						notifications.success('Witaj w FixTar! Twoje konto zostało utworzone.');
						goto(result.type === 'redirect' ? result.location : '/auth/login');
					} else if (result.type === 'failure') {
						const msg = result.data?.message;
						errors.general =
							typeof msg === 'string' ? msg : 'Rejestracja nie powiodła się. Spróbuj ponownie.';
						notifications.error('Błąd rejestracji. Sprawdź dane i spróbuj ponownie.');
						await update();
					}
				};
			}}
			class="auth-form"
			novalidate
		>
			{#if errors.general}
				<div class="form-error" role="alert">{errors.general}</div>
			{/if}

			<div class="row-2">
				<label class="field">
					<span class="field-label">Imię</span>
					<input
						name="firstName"
						value={formData.firstName}
						oninput={(e) => (formData.firstName = e.currentTarget.value)}
						placeholder="Jan"
						autocomplete="given-name"
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
						value={formData.lastName}
						oninput={(e) => (formData.lastName = e.currentTarget.value)}
						placeholder="Kowalski"
						autocomplete="family-name"
						class="input"
						class:input--error={errors.lastName}
						required
					/>
					{#if errors.lastName}<span class="field-error">{errors.lastName}</span>{/if}
				</label>
			</div>

			<label class="field">
				<span class="field-label">Email</span>
				<input
					type="email"
					name="email"
					value={formData.email}
					oninput={(e) => (formData.email = e.currentTarget.value)}
					placeholder="jan@example.com"
					autocomplete="email"
					class="input"
					class:input--error={errors.email}
					required
				/>
				{#if errors.email}<span class="field-error">{errors.email}</span>{/if}
			</label>

			<label class="field">
				<span class="field-label">Hasło</span>
				<input
					type="password"
					name="password"
					value={formData.password}
					oninput={(e) => (formData.password = e.currentTarget.value)}
					placeholder="Minimum 8 znaków"
					autocomplete="new-password"
					class="input"
					class:input--error={errors.password}
					required
				/>
				{#if errors.password}<span class="field-error">{errors.password}</span>{/if}

				{#if formData.password}
					<div class="strength">
						<div class="strength-track">
							<div
								class="strength-bar"
								style="width: {(passwordStrength / 5) * 100}%; background: {strengthColor};"
							></div>
						</div>
						<span class="strength-label">{strengthLabel}</span>
					</div>
				{/if}
			</label>

			<label class="field">
				<span class="field-label">Potwierdź hasło</span>
				<input
					type="password"
					name="confirmPassword"
					value={formData.confirmPassword}
					oninput={(e) => (formData.confirmPassword = e.currentTarget.value)}
					placeholder="Powtórz hasło"
					autocomplete="new-password"
					class="input"
					class:input--error={errors.confirmPassword}
					required
				/>
				{#if errors.confirmPassword}<span class="field-error">{errors.confirmPassword}</span>{/if}
			</label>

			<div class="consent">
				<label class="checkbox checkbox--start">
					<input
						type="checkbox"
						name="acceptTerms"
						bind:checked={formData.acceptTerms}
					/>
					<span>
						Akceptuję
						<a href="/regulamin" class="inline-link inline-link--strong" target="_blank">Regulamin</a>
						i
						<a href="/polityka-prywatnosci" class="inline-link inline-link--strong" target="_blank"
							>Politykę Prywatności</a
						>
					</span>
				</label>
				{#if errors.acceptTerms}<span class="field-error">{errors.acceptTerms}</span>{/if}

				<label class="checkbox checkbox--start">
					<input
						type="checkbox"
						name="acceptMarketing"
						bind:checked={formData.acceptMarketing}
					/>
					<span>
						Chcę otrzymywać nowości i promocje na email <span class="hint">(opcjonalnie)</span>
					</span>
				</label>
			</div>

			<button type="submit" class="submit" disabled={loading}>
				{#if loading}
					<SpinnerGapIcon class="h-4 w-4 animate-spin" aria-hidden="true" />
					Tworzenie konta…
				{:else}
					Utwórz konto
				{/if}
			</button>

			<div class="divider" aria-hidden="true"><span>lub</span></div>

			<div class="social-stack">
				<button type="button" class="social-btn" aria-label="Zarejestruj przez Google">
					<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-google-icon" />
					</svg>
					Google
				</button>
				<button type="button" class="social-btn" aria-label="Zarejestruj przez GitHub">
					<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-github-icon" />
					</svg>
					GitHub
				</button>
			</div>
		</form>

		<p class="auth-footer">
			Masz już konto?
			<a href="/auth/login" class="inline-link inline-link--strong">Zaloguj się</a>
		</p>
	</div>
</section>

<style>
	.auth-page {
		padding-top: clamp(40px, 8vh, 96px);
		padding-bottom: clamp(40px, 8vh, 96px);
	}

	.auth-inner {
		max-width: 440px;
		margin: 0 auto;
	}

	.auth-head {
		margin-bottom: clamp(24px, 4vh, 40px);
	}

	.auth-title {
		margin-top: 6px;
		font-family: var(--font-sans);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.auth-subtitle {
		margin-top: 12px;
		font-size: 0.9375rem;
		color: var(--ft-text-muted);
		line-height: 1.55;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.form-error {
		padding: 10px 14px;
		border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
		background: color-mix(in srgb, var(--color-danger) 6%, white);
		color: var(--color-danger);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
	}

	.row-2 {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 480px) {
		.row-2 {
			grid-template-columns: 1fr 1fr;
		}
	}

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

	.strength {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 2px;
	}

	.strength-track {
		flex: 1;
		height: 3px;
		background: var(--ft-line);
		border-radius: 2px;
		overflow: hidden;
	}

	.strength-bar {
		height: 100%;
		transition:
			width 260ms ease,
			background-color 260ms ease;
	}

	.strength-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--ft-text-muted);
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.consent {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.checkbox {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: var(--ft-text);
		cursor: pointer;
		line-height: 1.45;
	}

	.checkbox--start {
		align-items: flex-start;
	}

	.checkbox input {
		width: 16px;
		height: 16px;
		margin-top: 2px;
		accent-color: var(--ft-text-strong);
		flex-shrink: 0;
	}

	.hint {
		color: var(--ft-text-faint);
	}

	.inline-link {
		color: var(--ft-text-muted);
		font-size: inherit;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.inline-link:hover {
		color: var(--ft-text-strong);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.inline-link--strong {
		color: var(--ft-text-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 8px;
		padding: 12px 20px;
		border: 1px solid var(--ft-text-strong);
		border-radius: var(--radius-sm);
		background: var(--ft-text-strong);
		color: var(--ft-bg);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		min-height: 44px;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.submit:hover:not(:disabled) {
		background: var(--ft-cta);
		border-color: var(--ft-cta);
		color: var(--ft-cta-text);
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.divider {
		position: relative;
		margin: 16px 0 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--ft-text-faint);
		text-align: center;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--ft-line);
	}

	.divider span {
		position: relative;
		padding: 0 12px;
		background: var(--ft-bg);
	}

	.social-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.social-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 10px 14px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		min-height: 44px;
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.social-btn:hover {
		border-color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.auth-footer {
		margin-top: clamp(24px, 4vh, 32px);
		font-size: 0.9375rem;
		color: var(--ft-text-muted);
		text-align: center;
	}
</style>
