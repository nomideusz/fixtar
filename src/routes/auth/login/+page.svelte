<script lang="ts">
	import { enhance } from '$app/forms';
	import { notifications } from '$lib/stores';
	import type { ActionData } from './$types';
	import { SpinnerGapIcon } from 'phosphor-svelte';

	const { form } = $props<{ form?: ActionData }>();

	let emailInput = $state('');
	let password = $state('');
	let loading = $state(false);
	let rememberMe = $state(false);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (form?.email) emailInput = form.email;
	});

	$effect(() => {
		errors.general = form?.message ?? '';
	});

	let email = $derived(emailInput);

	function validateForm() {
		errors = {};
		if (!email || !email.includes('@')) errors.email = 'Podaj prawidłowy adres email';
		if (!password || password.length < 6) errors.password = 'Hasło musi mieć co najmniej 6 znaków';
		return Object.keys(errors).length === 0;
	}
</script>

<svelte:head>
	<title>Logowanie — FixTar</title>
	<meta name="description" content="Zaloguj się do swojego konta FixTar" />
</svelte:head>

<section class="ft-container auth-page">
	<div class="auth-inner">
		<header class="auth-head">
			<p class="ft-label">konto</p>
			<h1 class="auth-title">Zaloguj się</h1>
			<p class="auth-subtitle">Wprowadź dane dostępowe do swojego konta FixTar.</p>
		</header>

		<form
			method="POST"
			use:enhance={({ cancel }) => {
				if (!validateForm()) {
					cancel();
					return;
				}
				loading = true;
				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'redirect') {
						notifications.success('Witaj z powrotem!');
						window.location.assign(result.location);
					} else if (result.type === 'success') {
						notifications.success('Witaj z powrotem!');
						window.location.assign('/account');
					} else if (result.type === 'failure') {
						const msg = result.data?.message;
						errors.general =
							typeof msg === 'string' ? msg : 'Błąd logowania. Sprawdź dane i spróbuj ponownie.';
						await update();
					} else if (result.type === 'error') {
						errors.general = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
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

			<label class="field">
				<span class="field-label">Email</span>
				<input
					type="email"
					name="email"
					value={email}
					oninput={(e) => (emailInput = e.currentTarget.value)}
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
					value={password}
					oninput={(e) => (password = e.currentTarget.value)}
					placeholder="Twoje hasło"
					autocomplete="current-password"
					class="input"
					class:input--error={errors.password}
					required
				/>
				{#if errors.password}<span class="field-error">{errors.password}</span>{/if}
			</label>

			<div class="row-between">
				<label class="checkbox">
					<input type="checkbox" name="rememberMe" bind:checked={rememberMe} />
					<span>Zapamiętaj mnie</span>
				</label>
				<a href="/auth/forgot-password" class="inline-link">Zapomniałeś hasła?</a>
			</div>

			<button type="submit" class="submit" disabled={loading}>
				{#if loading}
					<SpinnerGapIcon class="h-4 w-4 animate-spin" aria-hidden="true" />
					Logowanie…
				{:else}
					Zaloguj się
				{/if}
			</button>

			<div class="divider" aria-hidden="true"><span>lub</span></div>

			<div class="social-stack">
				<button type="button" class="social-btn" aria-label="Zaloguj przez Google">
					<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-google-icon" />
					</svg>
					Google
				</button>
				<button type="button" class="social-btn" aria-label="Zaloguj przez GitHub">
					<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-github-icon" />
					</svg>
					GitHub
				</button>
			</div>
		</form>

		<p class="auth-footer">
			Nie masz konta?
			<a href="/auth/register" class="inline-link inline-link--strong">Zarejestruj się</a>
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

	.row-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	.checkbox {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: var(--ft-text);
		cursor: pointer;
	}

	.checkbox input {
		width: 16px;
		height: 16px;
		accent-color: var(--ft-text-strong);
	}

	.inline-link {
		color: var(--ft-text-muted);
		font-size: 0.875rem;
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
