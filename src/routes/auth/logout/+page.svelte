<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FixTarLogo from '$lib/img/logo-FixTar.png';
	
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
	className="bg-linear-to-br from-brand-50 via-white to-danger/5"
/>

<div class="bg-neutral-50 min-h-screen">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
		<div class="max-w-md mx-auto">
			<!-- Enhanced Logo Section -->
			<div class="text-center mb-8">
				<div class="relative inline-block mb-6">
					<div class="absolute inset-0 bg-brand-100 rounded-full transform scale-110 opacity-30"></div>
					<img 
						src={FixTarLogo} 
						alt="FixTar" 
						class="relative h-16 w-auto mx-auto"
					/>
				</div>
			</div>
			
			<!-- Professional Logout Card -->
			<Card class="p-8 shadow-xl text-center">
				<div class="mb-8">
					{#if logoutStage === 'processing'}
						<div class="relative inline-block">
					<div class="absolute inset-0 bg-brand-100 rounded-full animate-pulse"></div>
					<div class="relative w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
								<svg class="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							</div>
						</div>
					{:else if logoutStage === 'complete'}
						<div class="relative inline-block">
					<div class="absolute inset-0 bg-success/10 rounded-full transform scale-110 animate-pulse"></div>
					<div class="relative w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto shadow-xl">
								<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
								</svg>
							</div>
						</div>
					{:else}
						<div class="relative inline-block">
					<div class="absolute inset-0 bg-danger/10 rounded-full transform scale-110 opacity-30"></div>
					<div class="relative w-20 h-20 bg-danger rounded-full flex items-center justify-center mx-auto shadow-xl">
								<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
						</div>
					{/if}
				</div>
				
				<div class="mb-8">
					{#if logoutStage === 'processing'}
					<h1 class="text-3xl font-bold text-neutral-900 mb-4">Wylogowywanie...</h1>
					<p class="text-lg text-neutral-600 mb-6">Prosimy czekać, kończymy sesję</p>
					<div class="flex items-center justify-center space-x-2">
						<div class="w-2 h-2 bg-brand-600 rounded-full animate-bounce"></div>
						<div class="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
						<div class="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
						</div>
					{:else if logoutStage === 'complete'}
					<h1 class="text-3xl font-bold text-neutral-900 mb-4">Zostałeś wylogowany</h1>
					<p class="text-lg text-neutral-600 mb-6">Dziękujemy za skorzystanie z FixTar</p>
					<div class="bg-success/5 border-2 border-success-light rounded-xl p-4 mb-6">
						<p class="text-sm text-success-dark font-medium">
								Przekierowanie za {countdown} {countdown === 1 ? 'sekundę' : 'sekundy'}...
							</p>
						</div>
					{:else}
					<h1 class="text-3xl font-bold text-neutral-900 mb-4">Wystąpił błąd</h1>
					<p class="text-lg text-neutral-600 mb-6">Nie udało się zakończyć sesji</p>
					<div class="bg-danger/5 border-2 border-danger-light rounded-xl p-4 mb-6">
						<p class="text-sm text-danger-dark font-medium">
								Przekierowanie nastąpi automatycznie
							</p>
						</div>
					{/if}
				</div>
				
				{#if logoutStage === 'complete'}
					<div class="space-y-4">
						<Button 
							onclick={redirectNow}
							class="bg-linear-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							Wróć do strony głównej
						</Button>
						
						<div class="flex flex-col sm:flex-row gap-3 justify-center">
							<Button 
								href="/auth/login" 
								variant="outline"
								class="font-medium border-2 border-neutral-300 hover:border-brand-500 hover:text-brand-600 transition-all duration-300"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
								</svg>
								Zaloguj ponownie
							</Button>
							
							<Button 
								href="/products" 
								variant="outline"
								class="font-medium border-2 border-neutral-300 hover:border-success hover:text-success transition-all duration-300"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
								Przeglądaj produkty
							</Button>
						</div>
					</div>
				{:else if logoutStage === 'error'}
					<Button 
						onclick={redirectNow}
						class="bg-linear-to-r from-danger to-brand-600 hover:from-danger-dark hover:to-brand-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Przejdź do strony głównej
					</Button>
				{/if}
			</Card>
			
			<!-- Security & Privacy Info -->
			<div class="mt-8 text-center">
				<div class="bg-white rounded-xl p-6 shadow-md">
				<div class="flex items-center justify-center text-sm text-neutral-600 mb-3">
					<svg class="w-4 h-4 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					Twoja sesja została bezpiecznie zakończona
				</div>
				<div class="text-xs text-neutral-500 space-y-1">
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
		0%, 20%, 53%, 80%, 100% {
			transform: translate3d(0,0,0);
		}
		40%, 43% {
			transform: translate3d(0, -30px, 0);
		}
		70% {
			transform: translate3d(0, -15px, 0);
		}
		90% {
			transform: translate3d(0,-4px,0);
		}
	}
	
	.animate-bounce {
		animation: bounce 1s ease infinite;
	}
</style>

