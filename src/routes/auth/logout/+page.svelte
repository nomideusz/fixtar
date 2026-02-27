<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FixTarLogo from '$lib/img/logo-FixTar.webp';

	let logoutStage = $state<'processing' | 'complete' | 'error'>('processing');
	let countdown = $state(3);

	onMount(async () => {
		// Enhanced logout process
		try {
			// 1. Clear user from store
			userStore.logout();

			// 2. Clear localStorage
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('user');
				localStorage.removeItem('cart');
				localStorage.removeItem('preferences');
			}

			// 3. Call server logout endpoint
			try {
				await fetch('/auth/logout', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (e) {
				console.log('Server logout endpoint call failed, but proceeding with client logout');
			}

			// 4. Mark logout complete
			logoutStage = 'complete';
			notifications.success('Pomyślnie wylogowano');

			// 5. Start countdown and redirect
			const countdownInterval = setInterval(() => {
				countdown--;
				if (countdown <= 0) {
					clearInterval(countdownInterval);
					goto('/');
				}
			}, 1000);
		} catch (error) {
			console.error('Logout error:', error);
			logoutStage = 'error';
			notifications.error('Wystąpił błąd podczas wylogowywania');

			// Still redirect even if there's an error
			setTimeout(() => {
				goto('/');
			}, 2000);
		}
	});

	function redirectNow() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Wylogowywanie - FixTar</title>
	<meta name="description" content="Wylogowywanie z konta FixTar" />
</svelte:head>

<!-- Professional Auth Hero -->
<Hero
	title="Do zobaczenia!"
	subtitle="Wylogowywanie z Twojego konta FixTar - dziękujemy za odwiedziny"
	centered={true}
/>

<div class="min-h-screen">
	<div class="mx-auto max-w-screen-2xl px-6 py-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-md">
			<!-- Enhanced Logo Section -->
			<div class="mb-8 text-center">
				<div class="relative mb-6 inline-block">
					<div
						class="bg-brand-100 absolute inset-0 scale-110 transform rounded-full opacity-30"
					></div>
					<img src={FixTarLogo} alt="FixTar" class="relative mx-auto h-16 w-auto" />
				</div>
			</div>

			<!-- Professional Logout Card -->
			<Card class="p-8 text-center shadow-xl">
				<div class="mb-8">
					{#if logoutStage === 'processing'}
						<div class="relative inline-block">
							<div class="bg-brand-100 absolute inset-0 animate-pulse rounded-full"></div>
							<div
								class="bg-brand-600 relative mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-xl"
							>
								<svg class="h-10 w-10 animate-spin text-white" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							</div>
						</div>
					{:else if logoutStage === 'complete'}
						<div class="relative inline-block">
							<div
								class="bg-success/10 absolute inset-0 scale-110 transform animate-pulse rounded-full"
							></div>
							<div
								class="bg-success relative mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-xl"
							>
								<svg
									class="h-10 w-10 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
					{:else}
						<div class="relative inline-block">
							<div
								class="bg-danger/10 absolute inset-0 scale-110 transform rounded-full opacity-30"
							></div>
							<div
								class="bg-danger relative mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-xl"
							>
								<svg
									class="h-10 w-10 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
						</div>
					{/if}
				</div>

				<div class="mb-8">
					{#if logoutStage === 'processing'}
						<h1 class="mb-4 text-3xl font-bold text-white">Wylogowywanie...</h1>
						<p class="mb-6 text-lg text-neutral-400">Prosimy czekać, kończymy sesję</p>
						<div class="flex items-center justify-center space-x-2">
							<div class="bg-brand-600 h-2 w-2 animate-bounce rounded-full"></div>
							<div
								class="bg-brand-600 h-2 w-2 animate-bounce rounded-full"
								style="animation-delay: 0.1s"
							></div>
							<div
								class="bg-brand-600 h-2 w-2 animate-bounce rounded-full"
								style="animation-delay: 0.2s"
							></div>
						</div>
					{:else if logoutStage === 'complete'}
						<h1 class="mb-4 text-3xl font-bold text-white">Zostałeś wylogowany</h1>
						<p class="mb-6 text-lg text-neutral-400">Dziękujemy za skorzystanie z FixTar</p>
						<div class="bg-success/5 border-success-light mb-6 rounded-xl border-2 p-4">
							<p class="text-success-dark text-sm font-medium">
								Przekierowanie za {countdown}
								{countdown === 1 ? 'sekundę' : 'sekundy'}...
							</p>
						</div>
					{:else}
						<h1 class="mb-4 text-3xl font-bold text-white">Wystąpił błąd</h1>
						<p class="mb-6 text-lg text-neutral-400">Nie udało się zakończyć sesji</p>
						<div class="bg-danger/5 border-danger-light mb-6 rounded-xl border-2 p-4">
							<p class="text-danger-dark text-sm font-medium">
								Przekierowanie nastąpi automatycznie
							</p>
						</div>
					{/if}
				</div>

				{#if logoutStage === 'complete'}
					<div class="space-y-4">
						<Button
							onclick={redirectNow}
							class="from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 transform rounded-2xl bg-linear-to-r px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105"
						>
							<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Wróć do strony głównej
						</Button>

						<div class="flex flex-col justify-center gap-3 sm:flex-row">
							<Button
								href="/auth/login"
								variant="outline"
								class="hover:border-brand-500 hover:text-brand-600 border-2 border-white/15 font-medium transition-all duration-300"
							>
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
								Zaloguj ponownie
							</Button>

							<Button
								href="/products"
								variant="outline"
								class="hover:border-success hover:text-success border-2 border-white/15 font-medium transition-all duration-300"
							>
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
								Przeglądaj produkty
							</Button>
						</div>
					</div>
				{:else if logoutStage === 'error'}
					<Button
						onclick={redirectNow}
						class="from-danger to-brand-600 hover:from-danger-dark hover:to-brand-700 transform rounded-2xl bg-linear-to-r px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105"
					>
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Przejdź do strony głównej
					</Button>
				{/if}
			</Card>

			<!-- Security & Privacy Info -->
			<div class="mt-8 text-center">
				<div class="rounded-xl bg-white/5 p-6 shadow-md">
					<div class="mb-3 flex items-center justify-center text-sm text-neutral-400">
						<svg
							class="text-success mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
						Twoja sesja została bezpiecznie zakończona
					</div>
					<div class="space-y-1 text-xs text-neutral-500">
						<p>Wszystkie dane sesji zostały usunięte z przeglądarki</p>
						<p>Twoje konto pozostaje bezpieczne</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%,
		20%,
		53%,
		80%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		40%,
		43% {
			transform: translate3d(0, -30px, 0);
		}
		70% {
			transform: translate3d(0, -15px, 0);
		}
		90% {
			transform: translate3d(0, -4px, 0);
		}
	}

	.animate-bounce {
		animation: bounce 1s ease infinite;
	}
</style>
