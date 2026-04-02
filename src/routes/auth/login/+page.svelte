<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { notifications } from '$lib/stores';
	import type { ActionData } from './$types';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-primary.webp';
	import { SpinnerGapIcon } from 'phosphor-svelte';

	// Get form data from server
	const { form } = $props<{ form?: ActionData }>();

	let emailInput = $state('');
	let password = $state('');
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});
	let rememberMe = $state(false);

	// Sync email from form response
	$effect(() => {
		if (form?.email) {
			emailInput = form.email;
		}
	});

	// Reactive email value
	let email = $derived(emailInput);

	// Handle server form errors
	$effect(() => {
		if (form?.message) {
			errors.general = form.message;
		} else {
			errors.general = '';
		}
	});

	function validateForm() {
		errors = {};

		if (!email || !email.includes('@')) {
			errors.email = 'Podaj prawidłowy adres email';
		}

		if (!password || password.length < 6) {
			errors.password = 'Hasło musi mieć co najmniej 6 znaków';
		}

		return Object.keys(errors).length === 0;
	}
</script>

<svelte:head>
	<title>Logowanie - FixTar</title>
	<meta name="description" content="Zaloguj się do swojego konta FixTar" />
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
				<h1 class="mb-2 text-2xl font-bold text-[--ft-text]">Logowanie</h1>
				<p class="text-[--ft-text-muted]">Wprowadź swoje dane logowania</p>
			</div>

			<!-- Login Card -->
			<Card class="p-6">
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
								// Full page nav so the browser sends the session cookie with the next request
								window.location.assign(result.location);
							} else if (result.type === 'success') {
								notifications.success('Witaj z powrotem!');
								window.location.assign('/account');
							} else if (result.type === 'failure') {
								const message =
									result.data?.message || 'Błąd logowania. Sprawdź dane i spróbuj ponownie.';
								errors.general =
									typeof message === 'string'
										? message
										: 'Błąd logowania. Sprawdź dane i spróbuj ponownie.';
								await update();
							} else if (result.type === 'error') {
								errors.general = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
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

					<Input
						type="email"
						name="email"
						label="Email"
						value={email}
						oninput={(e) => (emailInput = e.currentTarget.value)}
						error={errors.email}
						required
						autocomplete="email"
						placeholder="jan.kowalski@example.com"
					/>

					<Input
						type="password"
						name="password"
						label="Hasło"
						value={password}
						oninput={(e) => (password = e.currentTarget.value)}
						error={errors.password}
						required
						autocomplete="current-password"
						placeholder="Wprowadź hasło"
					/>

					<div class="flex items-center justify-between text-sm">
						<label class="flex cursor-pointer items-center">
							<input
								type="checkbox"
								name="rememberMe"
								bind:checked={rememberMe}
								class="h-4 w-4 rounded border-[--ft-line] text-[--ft-accent] focus:ring-[--ft-accent]"
							/>
							<span class="ml-2 text-[--ft-text]">Zapamiętaj mnie</span>
						</label>

						<a href="/auth/forgot-password" class="text-[--ft-accent] hover:text-[--ft-accent]">
							Zapomniałeś hasła?
						</a>
					</div>

					<Button type="submit" fullWidth disabled={loading} class="mt-6">
						{#if loading}
							<SpinnerGapIcon class="mr-2 -ml-1 h-4 w-4 animate-spin" aria-hidden="true" />
							Logowanie...
						{:else}
							Zaloguj się
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
						<button type="button" class="social-login-button" aria-label="Zaloguj przez Google">
							<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-google-icon" />
							</svg>
							<span class="ml-2">Google</span>
						</button>

						<button type="button" class="social-login-button" aria-label="Zaloguj przez GitHub">
							<svg class="h-4 w-4" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-github-icon" />
							</svg>
							<span class="ml-2">GitHub</span>
						</button>
					</div>
				</div>
			</Card>

			<!-- Register LinkIcon -->
			<div class="mt-6 text-center">
				<p class="text-sm text-[--ft-text-muted]">
					Nie masz konta?
					<a href="/auth/register" class="font-medium text-[--ft-accent] hover:text-[--ft-accent]">
						Zarejestruj się
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
