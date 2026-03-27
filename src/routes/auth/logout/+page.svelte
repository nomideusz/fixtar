<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-primary.webp';
	import { SpinnerGapIcon, CheckIcon, WarningCircleIcon, HouseIcon, SignInIcon, ShoppingBagIcon, ShieldCheckIcon } from 'phosphor-svelte';

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

<PageHeader title="Do zobaczenia!" description="Wylogowywanie z Twojego konta FixTar - dziękujemy za odwiedziny" />

<div class="min-h-screen">
	<div class="ft-container ft-section-lg">
		<div class="mx-auto max-w-md">
			<!-- Enhanced Logo Section -->
			<div class="mb-8 text-center">
				<div class="relative mb-6 inline-block">
					<div
						class="bg-[--ft-frost] absolute inset-0 scale-110 transform rounded-full opacity-30"
					></div>
					<img src={FixTarLogo} alt="FixTar" class="relative mx-auto h-16 w-auto" width="120" height="64" />
				</div>
			</div>

			<!-- Professional Logout Card -->
			<Card class="p-8 text-center shadow-xl">
				<div class="mb-8">
					{#if logoutStage === 'processing'}
						<div class="relative inline-block">
							<div class="bg-[--ft-frost] absolute inset-0 animate-pulse rounded-full"></div>
							<div
								class="bg-[--ft-accent] relative mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-xl"
							>
								<SpinnerGapIcon class="h-10 w-10 animate-spin text-[--ft-text]" aria-hidden="true" />
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
								<CheckIcon class="h-10 w-10 text-[--ft-text]" weight="bold" aria-hidden="true" />
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
								<WarningCircleIcon class="h-10 w-10 text-[--ft-text]" aria-hidden="true" />
							</div>
						</div>
					{/if}
				</div>

				<div class="mb-8">
					{#if logoutStage === 'processing'}
						<h1 class="mb-4 text-3xl font-bold text-[--ft-text]">Wylogowywanie...</h1>
						<p class="mb-6 text-lg text-[--ft-text-muted]">Prosimy czekać, kończymy sesję</p>
						<div class="flex items-center justify-center space-x-2">
							<div class="bg-[--ft-accent] h-2 w-2 animate-bounce rounded-full"></div>
							<div
								class="bg-[--ft-accent] h-2 w-2 animate-bounce rounded-full"
								style="animation-delay: 0.1s"
							></div>
							<div
								class="bg-[--ft-accent] h-2 w-2 animate-bounce rounded-full"
								style="animation-delay: 0.2s"
							></div>
						</div>
					{:else if logoutStage === 'complete'}
						<h1 class="mb-4 text-3xl font-bold text-[--ft-text]">Zostałeś wylogowany</h1>
						<p class="mb-6 text-lg text-[--ft-text-muted]">Dziękujemy za skorzystanie z FixTar</p>
						<div class="bg-success/5 border-success-light mb-6 rounded-xl border-2 p-4">
							<p class="text-success-dark text-sm font-medium">
								Przekierowanie za {countdown}
								{countdown === 1 ? 'sekundę' : 'sekundy'}...
							</p>
						</div>
					{:else}
						<h1 class="mb-4 text-3xl font-bold text-[--ft-text]">Wystąpił błąd</h1>
						<p class="mb-6 text-lg text-[--ft-text-muted]">Nie udało się zakończyć sesji</p>
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
							class="rounded-2xl bg-[--ft-accent] px-8 py-3 font-bold text-white hover:bg-[--ft-accent-hover] transition-colors duration-200"
						>
							<HouseIcon class="mr-2 h-5 w-5" aria-hidden="true" />
							Wróć do strony głównej
						</Button>

						<div class="flex flex-col justify-center gap-3 sm:flex-row">
							<Button
								href="/auth/login"
								variant="outline"
								class="hover:border-[--ft-accent] hover:text-[--ft-accent] border-2 border-[--ft-line] font-medium transition-colors duration-200"
							>
								<SignInIcon class="mr-2 h-4 w-4" aria-hidden="true" />
								Zaloguj ponownie
							</Button>

							<Button
								href="/products"
								variant="outline"
								class="hover:border-success hover:text-success border-2 border-[--ft-line] font-medium transition-colors duration-200"
							>
								<ShoppingBagIcon class="mr-2 h-4 w-4" aria-hidden="true" />
								Przeglądaj produkty
							</Button>
						</div>
					</div>
				{:else if logoutStage === 'error'}
					<Button
						onclick={redirectNow}
						class="rounded-2xl bg-[--ft-accent] px-8 py-3 font-bold text-white hover:bg-[--ft-accent-hover] transition-colors duration-200"
					>
						<HouseIcon class="mr-2 h-5 w-5" aria-hidden="true" />
						Przejdź do strony głównej
					</Button>
				{/if}
			</Card>

			<!-- Security & Privacy InfoIcon -->
			<div class="mt-8 text-center">
				<div class="rounded-xl bg-[--ft-frost] p-6 shadow-md">
					<div class="mb-3 flex items-center justify-center text-sm text-[--ft-text-muted]">
						<ShieldCheckIcon class="text-success mr-2 h-4 w-4" aria-hidden="true" />
						Twoja sesja została bezpiecznie zakończona
					</div>
					<div class="space-y-1 text-xs text-[--ft-text-muted]">
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

	@media (prefers-reduced-motion: reduce) {
		.animate-bounce {
			animation: none;
		}
		:global(.animate-spin) {
			animation: none;
		}
	}
</style>
