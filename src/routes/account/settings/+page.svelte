<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SettingsNav from '$lib/components/account/SettingsNav.svelte';
	import NotificationToggle from '$lib/components/account/NotificationToggle.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	const { data, form } = $props<{ data: PageData; form?: ActionData }>();

	// --- Form Submission State ---

	let isSubmitting = $state(false);
	let passwordSubmitting = $state(false);
	let preferencesSubmitting = $state(false);

	// --- Derived User Data ---

	let currentUser = $derived(data.user);

	let profileForm = $derived.by(() => {
		const user = data.user;
		return {
			username: user?.username || '',
			email: user?.email || '',
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			phone: user?.phone || '',
			company: user?.company || ''
		};
	});

	let preferencesForm = $derived.by(() => {
		const prefs = data.user?.preferences;
		return {
			emailNotifications: prefs?.emailNotifications ?? true,
			smsNotifications: prefs?.smsNotifications ?? false,
			marketingEmails: prefs?.marketingEmails ?? true,
			orderUpdates: prefs?.orderUpdates ?? true,
			newsletter: prefs?.newsletter ?? false,
			language: prefs?.language || 'pl',
			currency: prefs?.currency || 'PLN',
			theme: prefs?.theme || 'light'
		};
	});

	// --- Password State ---

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	// --- Validation ---

	let passwordErrors = $state({ currentPassword: '', newPassword: '', confirmPassword: '' });
	let profileErrors = $state({ username: '', email: '', firstName: '', lastName: '' });

	function validatePassword(password: string): string[] {
		const errors: string[] = [];
		if (password.length < 8) errors.push('Minimum 8 znaków');
		if (!/[A-Z]/.test(password)) errors.push('Zawiera wielką literę');
		if (!/[a-z]/.test(password)) errors.push('Zawiera małą literę');
		if (!/[0-9]/.test(password)) errors.push('Zawiera cyfrę');
		return errors;
	}

	$effect(() => {
		// Password validation
		if (newPassword) {
			const errors = validatePassword(newPassword);
			passwordErrors.newPassword = errors.length > 0 ? errors.join(', ') : '';
		}
		passwordErrors.confirmPassword =
			confirmPassword && newPassword !== confirmPassword ? 'Hasła się nie zgadzają' : '';

		// Profile validation
		profileErrors.email =
			profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)
				? 'Nieprawidłowy format email'
				: '';
		profileErrors.username =
			profileForm.username && profileForm.username.length < 3 ? 'Minimum 3 znaki' : '';
	});

	const canSubmitPassword = $derived(
		!passwordSubmitting &&
			!passwordErrors.newPassword &&
			!passwordErrors.confirmPassword &&
			!!currentPassword &&
			!!newPassword &&
			!!confirmPassword
	);

	const canSubmitProfile = $derived(
		!isSubmitting && !profileErrors.username && !profileErrors.email
	);

	// --- Settings Navigation ---

	const settingsSections = [
		{
			id: 'profile',
			title: 'Informacje osobiste',
			description: 'Zarządzaj swoimi danymi osobowymi i kontaktowymi',
			iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		},
		{
			id: 'security',
			title: 'Bezpieczeństwo',
			description: 'Zmień hasło i zarządzaj ustawieniami bezpieczeństwa',
			iconPath:
				'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
		},
		{
			id: 'notifications',
			title: 'Powiadomienia',
			description: 'Dostosuj preferencje powiadomień',
			iconPath: 'M15 17h5l-5 5v-5zM9 7h6l3 3H6l3-3z'
		},
		{
			id: 'preferences',
			title: 'Preferencje',
			description: 'Personalizuj swoje doświadczenie',
			iconPath:
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
		}
	];

	let activeSection = $state('profile');

	// --- Form Enhance Helpers ---

	function profileEnhance() {
		isSubmitting = true;
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'success') {
				notifications.success('Profil został zaktualizowany');
			} else if (result.type === 'failure') {
				notifications.error(result.data?.message || 'Wystąpił błąd');
			}
			await update();
		};
	}

	function passwordEnhance() {
		passwordSubmitting = true;
		return async ({ result, update }: any) => {
			passwordSubmitting = false;
			if (result.type === 'success') {
				notifications.success('Hasło zostało zmienione');
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else if (result.type === 'failure') {
				notifications.error(result.data?.message || 'Wystąpił błąd');
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>Ustawienia Konta - FixTar</title>
	<meta
		name="description"
		content="Zarządzaj ustawieniami konta, bezpieczeństwem i preferencjami"
	/>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<section>
		<h1 class="text-2xl font-bold text-[--ft-text-strong]" style="font-family:var(--font-display);letter-spacing:-0.02em">Ustawienia Konta</h1>
		<p class="mt-1 text-[--ft-text-muted]">Zarządzaj swoimi danymi osobowymi, bezpieczeństwem i preferencjami zakupowymi</p>
	</section>

	<div class="space-y-8">
	<!-- Navigation -->
	<section>
		<SettingsNav
			sections={settingsSections}
			{activeSection}
			onSelect={(id) => (activeSection = id)}
		/>
	</section>

	<!-- Profile -->
	{#if activeSection === 'profile'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="mb-2 text-2xl font-bold text-[--ft-text]">Informacje osobiste</h2>
					<p class="text-[--ft-text-muted]">Zaktualizuj swoje dane osobowe i kontaktowe</p>
				</div>

				<form method="POST" action="?/updateProfile" use:enhance={() => profileEnhance()}>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Input label="Nazwa użytkownika" name="username" bind:value={profileForm.username} error={profileErrors.username} required placeholder="Wprowadź nazwę użytkownika" />
						<Input label="Adres email" name="email" type="email" bind:value={profileForm.email} error={profileErrors.email} required placeholder="Wprowadź adres email" />
						<Input label="Imię" name="firstName" bind:value={profileForm.firstName} error={profileErrors.firstName} placeholder="Wprowadź imię" />
						<Input label="Nazwisko" name="lastName" bind:value={profileForm.lastName} error={profileErrors.lastName} placeholder="Wprowadź nazwisko" />
						<Input label="Telefon" name="phone" type="tel" bind:value={profileForm.phone} placeholder="+48 123 456 789" />
						<Input label="Firma (opcjonalnie)" name="company" bind:value={profileForm.company} placeholder="Nazwa firmy" />
					</div>

					<div class="mt-8 flex justify-end">
						<Button type="submit" disabled={!canSubmitProfile} loading={isSubmitting}>
							Zapisz zmiany
						</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- Security -->
	{#if activeSection === 'security'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="mb-2 text-2xl font-bold text-[--ft-text]">Bezpieczeństwo konta</h2>
					<p class="text-[--ft-text-muted]">Zarządzaj hasłem i ustawieniami bezpieczeństwa</p>
				</div>

				<!-- Change Password -->
				<div class="mb-8">
					<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Zmiana hasła</h3>

					<form method="POST" action="?/changePassword" use:enhance={() => passwordEnhance()}>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Input label="Obecne hasło" name="currentPassword" type="password" bind:value={currentPassword} error={passwordErrors.currentPassword} required placeholder="Wprowadź obecne hasło" />
							<Input label="Nowe hasło" name="newPassword" type="password" bind:value={newPassword} error={passwordErrors.newPassword} required placeholder="Wprowadź nowe hasło" />
							<Input label="Potwierdź hasło" name="confirmPassword" type="password" bind:value={confirmPassword} error={passwordErrors.confirmPassword} required placeholder="Potwierdź nowe hasło" />
						</div>

						<div class="mt-6">
							<Button type="submit" disabled={!canSubmitPassword} loading={passwordSubmitting}>
								Zmień hasło
							</Button>
						</div>
					</form>
				</div>

				<!-- Security Features -->
				<div class="border-t border-[--ft-line] pt-8">
					<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Dodatkowe zabezpieczenia</h3>

					<div class="space-y-4">
						<div class="flex items-center justify-between rounded-lg bg-[--ft-frost] p-4">
							<div>
								<h4 class="font-medium text-[--ft-text]">Weryfikacja dwuetapowa</h4>
								<p class="text-sm text-[--ft-text-muted]">
									Dodatkowa warstwa bezpieczeństwa dla Twojego konta
								</p>
							</div>
							<Button variant="outline" size="sm">
								{currentUser?.twoFactorEnabled ? 'Wyłącz' : 'Włącz'}
							</Button>
						</div>

						<div class="flex items-center justify-between rounded-lg bg-[--ft-frost] p-4">
							<div>
								<h4 class="font-medium text-[--ft-text]">Aktywne sesje</h4>
								<p class="text-sm text-[--ft-text-muted]">
									Zarządzaj urządzeniami zalogowanymi na Twoje konto
								</p>
							</div>
							<Button variant="outline" size="sm">Zarządzaj sesjami</Button>
						</div>
					</div>
				</div>
			</Card>
		</section>
	{/if}

	<!-- Notifications -->
	{#if activeSection === 'notifications'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="mb-2 text-2xl font-bold text-[--ft-text]">Preferencje powiadomień</h2>
					<p class="text-[--ft-text-muted]">Wybierz rodzaje powiadomień, które chcesz otrzymywać</p>
				</div>

				<form
					method="POST"
					action="?/updateNotifications"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								notifications.success('Preferencje powiadomień zostały zaktualizowane');
							}
						};
					}}
				>
					<div class="space-y-6">
						<div>
							<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Powiadomienia email</h3>
							<div class="space-y-4">
								<NotificationToggle name="orderUpdates" bind:checked={preferencesForm.orderUpdates} title="Aktualizacje zamówień" description="Otrzymuj powiadomienia o statusie zamówień" />
								<NotificationToggle name="marketingEmails" bind:checked={preferencesForm.marketingEmails} title="Promocje i oferty" description="Informacje o promocjach i nowych produktach" />
								<NotificationToggle name="newsletter" bind:checked={preferencesForm.newsletter} title="Newsletter" description="Miesięczny newsletter z nowościami" />
							</div>
						</div>

						<div class="border-t border-[--ft-line] pt-6">
							<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Powiadomienia SMS</h3>
							<div class="space-y-4">
								<NotificationToggle name="smsNotifications" bind:checked={preferencesForm.smsNotifications} title="Powiadomienia SMS" description="Otrzymuj SMS o ważnych aktualizacjach" />
							</div>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<Button type="submit">Zapisz preferencje</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- Preferences -->
	{#if activeSection === 'preferences'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="mb-2 text-2xl font-bold text-[--ft-text]">Preferencje ogólne</h2>
					<p class="text-[--ft-text-muted]">Dostosuj swoje doświadczenie zakupowe</p>
				</div>

				<form
					method="POST"
					action="?/updatePreferences"
					use:enhance={() => {
						preferencesSubmitting = true;
						return async ({ result }) => {
							preferencesSubmitting = false;
							if (result.type === 'success') {
								notifications.success('Preferencje zostały zaktualizowane');
							}
						};
					}}
				>
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Język i region</h3>
							<div class="space-y-4">
								<div>
									<label for="language" class="mb-2 block text-sm font-medium text-[--ft-text]">Język interfejsu</label>
									<select id="language" name="language" bind:value={preferencesForm.language} class="focus:ring-brand-500 w-full rounded-lg border border-[--ft-line] px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
										<option value="pl">Polski</option>
										<option value="en">English</option>
										<option value="de">Deutsch</option>
									</select>
								</div>
								<div>
									<label for="currency" class="mb-2 block text-sm font-medium text-[--ft-text]">Waluta</label>
									<select id="currency" name="currency" bind:value={preferencesForm.currency} class="focus:ring-brand-500 w-full rounded-lg border border-[--ft-line] px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
										<option value="PLN">PLN (złoty)</option>
										<option value="EUR">EUR (euro)</option>
										<option value="USD">USD (dolar)</option>
									</select>
								</div>
							</div>
						</div>

						<div>
							<h3 class="mb-4 text-lg font-semibold text-[--ft-text]">Wygląd</h3>
							<div class="space-y-4">
								<div>
									<label for="theme" class="mb-2 block text-sm font-medium text-[--ft-text]">Motyw</label>
									<select id="theme" name="theme" bind:value={preferencesForm.theme} class="focus:ring-brand-500 w-full rounded-lg border border-[--ft-line] px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
										<option value="light">Jasny</option>
										<option value="dark">Ciemny</option>
										<option value="auto">Automatyczny</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<Button type="submit" loading={preferencesSubmitting} disabled={preferencesSubmitting}>
							Zapisz preferencje
						</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- Account Actions -->
	<section>
		<Card class="from-danger/5 to-brand-50 border-danger/10 border-2 bg-linear-to-br p-8">
			<div class="text-center">
				<h3 class="mb-4 text-xl font-bold text-[--ft-text]">Akcje konta</h3>
				<p class="mb-6 text-[--ft-text-muted]">Zarządzaj swoim kontem lub usuń je całkowicie</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<Button href="/account/export" variant="outline">Eksportuj dane</Button>
					<Button variant="secondary">Usuń konto</Button>
				</div>
			</div>
		</Card>
	</section>
</div>
</div>
