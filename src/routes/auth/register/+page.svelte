<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { notifications } from '$lib/stores';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-primary.webp';
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

	// Calculate password strength
	$effect(() => {
		let strength = 0;
		const password = formData.password;

		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;

		passwordStrength = strength;
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

	// Handle server form errors
	$effect(() => {
		if (form?.message) {
			errors.general = form.message;
		} else {
			errors.general = '';
		}
	});

	function getPasswordStrengthText() {
		switch (passwordStrength) {
			case 0:
			case 1:
				return 'Bardzo słabe';
			case 2:
				return 'Słabe';
			case 3:
				return 'Średnie';
			case 4:
				return 'Silne';
			case 5:
				return 'Bardzo silne';
			default:
				return '';
		}
	}

	function getPasswordStrengthColor() {
		switch (passwordStrength) {
			case 0:
			case 1:
				return 'bg-danger';
			case 2:
				return 'bg-[--ft-accent]';
			case 3:
				return 'bg-warning';
			case 4:
				return 'bg-success';
			case 5:
				return 'bg-success';
			default:
				return 'bg-[--ft-line]';
		}
	}
</script>

<svelte:head>
	<title>Rejestracja - FixTar</title>
	<meta name="description" content="Utwórz konto w sklepie FixTar" />
</svelte:head>

<div class="ft-section-lg min-h-screen">
	<div class="ft-container">
		<div class="mx-auto max-w-md">
			<!-- Simplified Logo Section -->
			<div class="mb-8 text-center">
				<img
					src={FixTarLogo}
					alt="FixTar"
					class="mx-auto mb-4 h-12 w-auto"
					width="120"
					height="48"
				/>
				<h1 class="mb-2 text-2xl font-bold text-[--ft-text]">Rejestracja</h1>
				<p class="text-[--ft-text-muted]">Utwórz nowe konto</p>
			</div>

			<!-- Register Card -->
			<Card class="p-6">
				<form
					method="POST"
					use:enhance={({ formData: submitFormData, cancel }) => {
						if (!validateForm()) {
							cancel();
							return;
						}
						loading = true;

						// Add form data to the FormData object
						submitFormData.append('firstName', formData.firstName);
						submitFormData.append('lastName', formData.lastName);

						return async ({ result, update }) => {
							loading = false;
							if (result.type === 'redirect' || result.type === 'success') {
								notifications.success('Witaj w FixTar! Twoje konto zostało utworzone.');
								goto(result.type === 'redirect' ? result.location : '/auth/login');
							} else if (result.type === 'failure') {
								const message =
									typeof result.data?.message === 'string'
										? result.data.message
										: 'Rejestracja nie powiodła się. Spróbuj ponownie.';
								errors.general = message;
								notifications.error('Błąd rejestracji. Sprawdź dane i spróbuj ponownie.');
								await update();
							}
						};
					}}
					class="space-y-4"
				>
					{#if errors.general}
						<div
							class="bg-danger/5 border-danger/30 text-danger rounded-lg border px-4 py-3 text-sm"
						>
							{errors.general}
						</div>
					{/if}

					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Input
							name="firstName"
							label="Imię"
							value={formData.firstName}
							oninput={(e) => (formData.firstName = e.currentTarget.value)}
							error={errors.firstName}
							required
							autocomplete="given-name"
							placeholder="Jan"
						/>

						<Input
							name="lastName"
							label="Nazwisko"
							value={formData.lastName}
							oninput={(e) => (formData.lastName = e.currentTarget.value)}
							error={errors.lastName}
							required
							autocomplete="family-name"
							placeholder="Kowalski"
						/>
					</div>

					<Input
						type="email"
						name="email"
						label="Email"
						value={formData.email}
						oninput={(e) => (formData.email = e.currentTarget.value)}
						error={errors.email}
						required
						autocomplete="email"
						placeholder="jan.kowalski@example.com"
					/>

					<div>
						<Input
							type="password"
							name="password"
							label="Hasło"
							value={formData.password}
							oninput={(e) => (formData.password = e.currentTarget.value)}
							error={errors.password}
							required
							autocomplete="new-password"
							placeholder="Minimum 8 znaków"
						/>

						{#if formData.password}
							<div class="mt-2">
								<div class="mb-1 flex items-center justify-between">
									<span class="text-xs text-[--ft-text-muted]">Siła hasła</span>
									<span class="text-xs text-[--ft-text-muted]">{getPasswordStrengthText()}</span>
								</div>
								<div class="h-1 w-full rounded-full bg-[--ft-frost]">
									<div
										class="h-1 rounded-full transition-[width,background-color] duration-300 {getPasswordStrengthColor()}"
										style="width: {(passwordStrength / 5) * 100}%"
									></div>
								</div>
							</div>
						{/if}
					</div>

					<Input
						type="password"
						name="confirmPassword"
						label="Potwierdź hasło"
						value={formData.confirmPassword}
						oninput={(e) => (formData.confirmPassword = e.currentTarget.value)}
						error={errors.confirmPassword}
						required
						autocomplete="new-password"
						placeholder="Powtórz hasło"
					/>

					<div class="space-y-3">
						<div>
							<label class="flex cursor-pointer items-start text-sm">
								<input
									type="checkbox"
									name="acceptTerms"
									bind:checked={formData.acceptTerms}
									class="mt-1 h-4 w-4 rounded border-[--ft-line] text-[--ft-accent] focus:ring-[--ft-accent]"
								/>
								<span class="ml-2 text-[--ft-text]">
									Akceptuję
									<a
										href="/regulamin"
										class="text-[--ft-accent] underline hover:text-[--ft-accent]"
										target="_blank">Regulamin</a
									>
									i
									<a
										href="/polityka-prywatnosci"
										class="text-[--ft-accent] underline hover:text-[--ft-accent]"
										target="_blank">Politykę Prywatności</a
									>
								</span>
							</label>
							{#if errors.acceptTerms}
								<p class="text-danger mt-1 text-sm">{errors.acceptTerms}</p>
							{/if}
						</div>

						<div>
							<label class="flex cursor-pointer items-start text-sm">
								<input
									type="checkbox"
									name="acceptMarketing"
									bind:checked={formData.acceptMarketing}
									class="mt-1 h-4 w-4 rounded border-[--ft-line] text-[--ft-accent] focus:ring-[--ft-accent]"
								/>
								<span class="ml-2 text-[--ft-text]">
									Wyrażam zgodę na otrzymywanie informacji handlowych <span
										class="text-[--ft-text-muted]">(opcjonalnie)</span
									>
								</span>
							</label>
						</div>
					</div>

					<Button type="submit" fullWidth disabled={loading} class="mt-6">
						{#if loading}
							<SpinnerGapIcon class="mr-2 -ml-1 h-4 w-4 animate-spin" aria-hidden="true" />
							Tworzenie konta...
						{:else}
							Utwórz konto
						{/if}
					</Button>
				</form>

				<!-- Social Login -->
				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-[--ft-line]"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-[--ft-frost] px-2 text-[--ft-text-muted]">lub</span>
						</div>
					</div>

					<div class="mt-4 space-y-2">
						<button type="button" class="social-login-button" aria-label="Zarejestruj przez Google">
							<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-google-icon" />
							</svg>
							<span class="ml-2">Google</span>
						</button>

						<button type="button" class="social-login-button" aria-label="Zarejestruj przez GitHub">
							<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-github-icon" />
							</svg>
							<span class="ml-2">GitHub</span>
						</button>
					</div>
				</div>
			</Card>

			<!-- Login LinkIcon -->
			<div class="mt-6 text-center">
				<p class="text-sm text-[--ft-text-muted]">
					Masz już konto?
					<a href="/auth/login" class="font-medium text-[--ft-accent] hover:text-[--ft-accent]">
						Zaloguj się
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.social-login-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.75rem;
		min-height: 44px;
		border: 1px solid var(--ft-line);
		border-radius: 0.5rem;
		background: var(--ft-surface);
		font-size: 0.875rem;
		color: var(--ft-text);
		transition:
			border-color 0.2s,
			background-color 0.2s;
		cursor: pointer;
	}

	.social-login-button:hover {
		border-color: var(--ft-cta);
		background-color: var(--ft-frost);
	}
</style>
