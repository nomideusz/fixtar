<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	
	const { data, form } = $props<{ data: PageData; form?: ActionData }>();
	
	// Form states
	let isSubmitting = $state(false);
	let passwordSubmitting = $state(false);
	let verificationSubmitting = $state(false);
	let preferencesSubmitting = $state(false);
	
	// User data - use updated data from form response when available
	let currentUser = $derived(data.user);
	
	// Profile form data
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
	
	// Preferences form data
	let preferencesForm = $derived.by(() => {
		const user = data.user;
		return {
			emailNotifications: user?.preferences?.emailNotifications ?? true,
			smsNotifications: user?.preferences?.smsNotifications ?? false,
			marketingEmails: user?.preferences?.marketingEmails ?? true,
			orderUpdates: user?.preferences?.orderUpdates ?? true,
			newsletter: user?.preferences?.newsletter ?? false,
			language: user?.preferences?.language || 'pl',
			currency: user?.preferences?.currency || 'PLN',
			theme: user?.preferences?.theme || 'light'
		};
	});
	
	// Password form validation
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	
	// Password validation states
	let passwordErrors = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	
	// Profile validation states
	let profileErrors = $state({
		username: '',
		email: '',
		firstName: '',
		lastName: ''
	});
	
	// Password validation rules
	const validatePassword = (password: string) => {
		const errors = [];
		if (password.length < 8) {
			errors.push('Minimum 8 znaków');
		}
		if (!/[A-Z]/.test(password)) {
			errors.push('Zawiera wielką literę');
		}
		if (!/[a-z]/.test(password)) {
			errors.push('Zawiera małą literę');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('Zawiera cyfrę');
		}
		return errors;
	};

	// Email validation
	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};
	
	// Real-time validation
	$effect(() => {
		// Password validation
		if (newPassword) {
			const errors = validatePassword(newPassword);
			passwordErrors.newPassword = errors.length > 0 ? errors.join(', ') : '';
		}
		
		if (confirmPassword && newPassword !== confirmPassword) {
			passwordErrors.confirmPassword = 'Hasła się nie zgadzają';
		} else {
			passwordErrors.confirmPassword = '';
		}

		// Profile validation
		if (profileForm.email && !validateEmail(profileForm.email)) {
			profileErrors.email = 'Nieprawidłowy format email';
		} else {
			profileErrors.email = '';
		}

		if (profileForm.username && profileForm.username.length < 3) {
			profileErrors.username = 'Minimum 3 znaki';
		} else {
			profileErrors.username = '';
		}
	});

	// Settings sections configuration
	const settingsSections = [
		{
			id: 'profile',
			title: 'Informacje osobiste',
			description: 'Zarządzaj swoimi danymi osobowymi i kontaktowymi',
			icon: 'profile'
		},
		{
			id: 'security',
			title: 'Bezpieczeństwo',
			description: 'Zmień hasło i zarządzaj ustawieniami bezpieczeństwa',
			icon: 'security'
		},
		{
			id: 'notifications',
			title: 'Powiadomienia',
			description: 'Dostosuj preferencje powiadomień',
			icon: 'notifications'
		},
		{
			id: 'preferences',
			title: 'Preferencje',
			description: 'Personalizuj swoje doświadczenie',
			icon: 'preferences'
		}
	];

	let activeSection = $state('profile');
</script>

<svelte:head>
	<title>Ustawienia Konta - FixTar</title>
	<meta name="description" content="Zarządzaj ustawieniami konta, bezpieczeństwem i preferencjami" />
</svelte:head>

<!-- Professional Settings Hero -->
<Hero
	title="Ustawienia Konta"
	subtitle="Zarządzaj swoimi danymi osobowymi, bezpieczeństwem i preferencjami zakupowymi"
	centered={true}
	className="bg-linear-to-br from-accent-50 via-white to-brand-50"
/>

<div class="space-y-8">
	<!-- Settings Navigation -->
	<section>
		<Card class="p-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each settingsSections as section (section)}
					<button
						onclick={() => activeSection = section.id}
						class="settings-nav-item {activeSection === section.id ? 'settings-nav-active' : 'settings-nav-inactive'}"
					>
						<div class="flex items-center">
							<div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 {activeSection === section.id ? 'bg-brand-100' : 'bg-neutral-100'} transition-colors duration-200">
								{#if section.icon === 'profile'}
									<svg class="w-5 h-5 {activeSection === section.id ? 'text-brand-600' : 'text-neutral-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								{:else if section.icon === 'security'}
									<svg class="w-5 h-5 {activeSection === section.id ? 'text-brand-600' : 'text-neutral-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								{:else if section.icon === 'notifications'}
									<svg class="w-5 h-5 {activeSection === section.id ? 'text-brand-600' : 'text-neutral-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM9 7h6l3 3H6l3-3z" />
									</svg>
								{:else if section.icon === 'preferences'}
									<svg class="w-5 h-5 {activeSection === section.id ? 'text-brand-600' : 'text-neutral-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								{/if}
							</div>
							<div class="text-left">
								<div class="font-semibold text-neutral-900 text-sm">{section.title}</div>
								<div class="text-xs text-neutral-500 hidden sm:block">{section.description}</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Card>
	</section>

	<!-- Profile Settings -->
	{#if activeSection === 'profile'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-neutral-900 mb-2">Informacje osobiste</h2>
					<p class="text-neutral-600">Zaktualizuj swoje dane osobowe i kontaktowe</p>
				</div>

				<form
					method="POST"
					action="?/updateProfile"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'success') {
								notifications.success('Profil został zaktualizowany');
							} else if (result.type === 'failure') {
								notifications.error((result.data?.message as string) || 'Wystąpił błąd');
							}
							await update();
						};
					}}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Input
								label="Nazwa użytkownika"
								name="username"
								bind:value={profileForm.username}
								error={profileErrors.username}
								required
								placeholder="Wprowadź nazwę użytkownika"
							/>
						</div>
						
						<div>
							<Input
								label="Adres email"
								name="email"
								type="email"
								bind:value={profileForm.email}
								error={profileErrors.email}
								required
								placeholder="Wprowadź adres email"
							/>
						</div>
						
						<div>
							<Input
								label="Imię"
								name="firstName"
								bind:value={profileForm.firstName}
								error={profileErrors.firstName}
								placeholder="Wprowadź imię"
							/>
						</div>
						
						<div>
							<Input
								label="Nazwisko"
								name="lastName"
								bind:value={profileForm.lastName}
								error={profileErrors.lastName}
								placeholder="Wprowadź nazwisko"
							/>
						</div>
						
						<div>
							<Input
								label="Telefon"
								name="phone"
								type="tel"
								bind:value={profileForm.phone}
								placeholder="+48 123 456 789"
							/>
						</div>
						
						<div>
							<Input
								label="Firma (opcjonalnie)"
								name="company"
								bind:value={profileForm.company}
								placeholder="Nazwa firmy"
							/>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<Button 
							type="submit" 
							disabled={isSubmitting || !!profileErrors.username || !!profileErrors.email}
							loading={isSubmitting}
						>
							Zapisz zmiany
						</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- Security Settings -->
	{#if activeSection === 'security'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-neutral-900 mb-2">Bezpieczeństwo konta</h2>
					<p class="text-neutral-600">Zarządzaj hasłem i ustawieniami bezpieczeństwa</p>
				</div>

				<!-- Change Password -->
				<div class="mb-8">
					<h3 class="text-lg font-semibold text-neutral-900 mb-4">Zmiana hasła</h3>
					
					<form
						method="POST"
						action="?/changePassword"
						use:enhance={() => {
							passwordSubmitting = true;
							return async ({ result, update }) => {
								passwordSubmitting = false;
								if (result.type === 'success') {
									notifications.success('Hasło zostało zmienione');
									currentPassword = '';
									newPassword = '';
									confirmPassword = '';
								} else if (result.type === 'failure') {
								notifications.error((result.data?.message as string) || 'Wystąpił błąd');
								}
								await update();
							};
						}}
					>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<Input
									label="Obecne hasło"
									name="currentPassword"
									type="password"
									bind:value={currentPassword}
									error={passwordErrors.currentPassword}
									required
									placeholder="Wprowadź obecne hasło"
								/>
							</div>
							
							<div>
								<Input
									label="Nowe hasło"
									name="newPassword"
									type="password"
									bind:value={newPassword}
									error={passwordErrors.newPassword}
									required
									placeholder="Wprowadź nowe hasło"
								/>
							</div>
							
							<div>
								<Input
									label="Potwierdź hasło"
									name="confirmPassword"
									type="password"
									bind:value={confirmPassword}
									error={passwordErrors.confirmPassword}
									required
									placeholder="Potwierdź nowe hasło"
								/>
							</div>
						</div>

						<div class="mt-6">
							<Button 
								type="submit" 
								disabled={passwordSubmitting || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword || !currentPassword || !newPassword || !confirmPassword}
								loading={passwordSubmitting}
							>
								Zmień hasło
							</Button>
						</div>
					</form>
				</div>

				<!-- Security Features -->
				<div class="border-t border-neutral-200 pt-8">
					<h3 class="text-lg font-semibold text-neutral-900 mb-4">Dodatkowe zabezpieczenia</h3>
					
					<div class="space-y-4">
						<div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
							<div>
								<h4 class="font-medium text-neutral-900">Weryfikacja dwuetapowa</h4>
								<p class="text-sm text-neutral-600">Dodatkowa warstwa bezpieczeństwa dla Twojego konta</p>
							</div>
							<Button variant="outline" size="sm">
								{currentUser?.twoFactorEnabled ? 'Wyłącz' : 'Włącz'}
							</Button>
						</div>

						<div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
							<div>
								<h4 class="font-medium text-neutral-900">Aktywne sesje</h4>
								<p class="text-sm text-neutral-600">Zarządzaj urządzeniami zalogowanymi na Twoje konto</p>
							</div>
							<Button variant="outline" size="sm">
								Zarządzaj sesjami
							</Button>
						</div>
					</div>
				</div>
			</Card>
		</section>
	{/if}

	<!-- Notification Settings -->
	{#if activeSection === 'notifications'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-neutral-900 mb-2">Preferencje powiadomień</h2>
					<p class="text-neutral-600">Wybierz rodzaje powiadomień, które chcesz otrzymywać</p>
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
						<!-- Email Notifications -->
						<div>
							<h3 class="text-lg font-semibold text-neutral-900 mb-4">Powiadomienia email</h3>
							<div class="space-y-4">
								<label class="flex items-center">
									<input 
										type="checkbox" 
										name="orderUpdates"
										bind:checked={preferencesForm.orderUpdates}
										class="w-4 h-4 text-brand-600 bg-neutral-100 border-neutral-300 rounded focus:ring-brand-500 focus:ring-2"
									>
									<div class="ml-3">
										<div class="font-medium text-neutral-900">Aktualizacje zamówień</div>
										<div class="text-sm text-neutral-600">Otrzymuj powiadomienia o statusie zamówień</div>
									</div>
								</label>

								<label class="flex items-center">
									<input 
										type="checkbox" 
										name="marketingEmails"
										bind:checked={preferencesForm.marketingEmails}
										class="w-4 h-4 text-brand-600 bg-neutral-100 border-neutral-300 rounded focus:ring-brand-500 focus:ring-2"
									>
									<div class="ml-3">
										<div class="font-medium text-neutral-900">Promocje i oferty</div>
										<div class="text-sm text-neutral-600">Informacje o promocjach i nowych produktach</div>
									</div>
								</label>

								<label class="flex items-center">
									<input 
										type="checkbox" 
										name="newsletter"
										bind:checked={preferencesForm.newsletter}
										class="w-4 h-4 text-brand-600 bg-neutral-100 border-neutral-300 rounded focus:ring-brand-500 focus:ring-2"
									>
									<div class="ml-3">
										<div class="font-medium text-neutral-900">Newsletter</div>
										<div class="text-sm text-neutral-600">Miesięczny newsletter z nowościami</div>
									</div>
								</label>
							</div>
						</div>

						<!-- SMS Notifications -->
						<div class="border-t border-neutral-200 pt-6">
							<h3 class="text-lg font-semibold text-neutral-900 mb-4">Powiadomienia SMS</h3>
							<div class="space-y-4">
								<label class="flex items-center">
									<input 
										type="checkbox" 
										name="smsNotifications"
										bind:checked={preferencesForm.smsNotifications}
										class="w-4 h-4 text-brand-600 bg-neutral-100 border-neutral-300 rounded focus:ring-brand-500 focus:ring-2"
									>
									<div class="ml-3">
										<div class="font-medium text-neutral-900">Powiadomienia SMS</div>
										<div class="text-sm text-neutral-600">Otrzymuj SMS o ważnych aktualizacjach</div>
									</div>
								</label>
							</div>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<Button type="submit">
							Zapisz preferencje
						</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- General Preferences -->
	{#if activeSection === 'preferences'}
		<section>
			<Card class="p-8">
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-neutral-900 mb-2">Preferencje ogólne</h2>
					<p class="text-neutral-600">Dostosuj swoje doświadczenie zakupowe</p>
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
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<!-- Language & Region -->
						<div>
							<h3 class="text-lg font-semibold text-neutral-900 mb-4">Język i region</h3>
							<div class="space-y-4">
								<div>
									<label for="language" class="block text-sm font-medium text-neutral-700 mb-2">Język interfejsu</label>
									<select 
										id="language"
										name="language"
										bind:value={preferencesForm.language}
										class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
									>
										<option value="pl">Polski</option>
										<option value="en">English</option>
										<option value="de">Deutsch</option>
									</select>
								</div>

								<div>
									<label for="currency" class="block text-sm font-medium text-neutral-700 mb-2">Waluta</label>
									<select 
										id="currency"
										name="currency"
										bind:value={preferencesForm.currency}
										class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
									>
										<option value="PLN">PLN (złoty)</option>
										<option value="EUR">EUR (euro)</option>
										<option value="USD">USD (dolar)</option>
									</select>
								</div>
							</div>
						</div>

						<!-- Display -->
						<div>
							<h3 class="text-lg font-semibold text-neutral-900 mb-4">Wygląd</h3>
							<div class="space-y-4">
								<div>
									<label for="theme" class="block text-sm font-medium text-neutral-700 mb-2">Motyw</label>
									<select 
										id="theme"
										name="theme"
										bind:value={preferencesForm.theme}
										class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
									>
										<option value="light">Jasny</option>
										<option value="dark">Ciemny</option>
										<option value="auto">Automatyczny</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<Button 
							type="submit"
							loading={preferencesSubmitting}
							disabled={preferencesSubmitting}
						>
							Zapisz preferencje
						</Button>
					</div>
				</form>
			</Card>
		</section>
	{/if}

	<!-- Account Actions -->
	<section>
		<Card class="p-8 bg-linear-to-br from-danger/5 to-brand-50 border-2 border-danger/10">
			<div class="text-center">
				<h3 class="text-xl font-bold text-neutral-900 mb-4">Akcje konta</h3>
				<p class="text-neutral-600 mb-6">
					Zarządzaj swoim kontem lub usuń je całkowicie
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button href="/account/export" variant="outline">
						Eksportuj dane
					</Button>
					<Button variant="secondary">
							Usuń konto
						</Button>
				</div>
			</div>
		</Card>
	</section>
</div>

<style>
	.settings-nav-item {
		padding: 1rem;
		border-radius: 0.75rem;
		border: 1px solid transparent;
		transition: all 0.2s;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}
	
	.settings-nav-active {
		background-color: rgb(219 234 254);
		border-color: rgb(147 197 253);
		color: rgb(29 78 216);
	}
	
	.settings-nav-inactive {
		background-color: rgb(249 250 251);
		color: rgb(55 65 81);
	}
	
	.settings-nav-inactive:hover {
		background-color: rgb(239 246 255);
		border-color: rgb(191 219 254);
		color: rgb(37 99 235);
	}
</style>

