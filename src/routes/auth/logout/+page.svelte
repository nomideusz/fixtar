<script lang="ts">
	import { userStore, notifications } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { SpinnerGapIcon, CheckIcon, WarningCircleIcon } from 'phosphor-svelte';

	let stage = $state<'processing' | 'complete' | 'error'>('processing');
	let countdown = $state(3);

	onMount(async () => {
		try {
			userStore.logout();

			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('user');
				localStorage.removeItem('cart');
				localStorage.removeItem('preferences');
			}

			try {
				await fetch('/auth/logout', {
					method: 'POST',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' }
				});
			} catch {
				// server-side logout failed; client state is already cleared
			}

			stage = 'complete';
			notifications.success('Pomyślnie wylogowano');

			const tick = setInterval(() => {
				countdown--;
				if (countdown <= 0) {
					clearInterval(tick);
					goto('/');
				}
			}, 1000);
		} catch (error) {
			console.error('Logout error:', error);
			stage = 'error';
			notifications.error('Wystąpił błąd podczas wylogowywania');
			setTimeout(() => goto('/'), 2000);
		}
	});
</script>

<svelte:head>
	<title>Wylogowywanie — FixTar</title>
	<meta name="description" content="Wylogowywanie z konta FixTar" />
</svelte:head>

<section class="ft-container logout-page">
	<div class="logout-inner">
		<p class="ft-label">konto</p>

		{#if stage === 'processing'}
			<h1 class="logout-title">
				<SpinnerGapIcon class="inline-icon animate-spin" aria-hidden="true" />
				Wylogowywanie…
			</h1>
			<p class="logout-subtitle">Kończymy Twoją sesję.</p>
		{:else if stage === 'complete'}
			<h1 class="logout-title">
				<CheckIcon class="inline-icon" weight="bold" aria-hidden="true" />
				Do zobaczenia
			</h1>
			<p class="logout-subtitle">
				Wylogowano pomyślnie. Przekierowanie za {countdown}
				{countdown === 1 ? 'sekundę' : 'sekundy'}…
			</p>
		{:else}
			<h1 class="logout-title">
				<WarningCircleIcon class="inline-icon" aria-hidden="true" />
				Coś poszło nie tak
			</h1>
			<p class="logout-subtitle">Nie udało się zakończyć sesji. Za chwilę przekierujemy Cię na stronę główną.</p>
		{/if}

		<div class="logout-actions">
			<a href="/" class="btn btn--primary">Strona główna</a>
			{#if stage !== 'processing'}
				<a href="/auth/login" class="btn btn--ghost">Zaloguj ponownie</a>
				<a href="/products" class="btn btn--ghost">Przeglądaj produkty</a>
			{/if}
		</div>
	</div>
</section>

<style>
	.logout-page {
		padding-top: clamp(40px, 8vh, 96px);
		padding-bottom: clamp(40px, 8vh, 96px);
	}

	.logout-inner {
		max-width: 480px;
		margin: 0 auto;
		text-align: center;
	}

	.logout-title {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
		font-family: var(--font-sans);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	:global(.logout-page .inline-icon) {
		width: 24px;
		height: 24px;
		color: var(--ft-text-muted);
	}

	.logout-subtitle {
		margin-top: 12px;
		font-size: 0.9375rem;
		color: var(--ft-text-muted);
		line-height: 1.55;
	}

	.logout-actions {
		margin-top: clamp(24px, 4vh, 32px);
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 18px;
		min-height: 44px;
		border-radius: var(--radius-sm);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.btn--primary {
		border: 1px solid var(--ft-text-strong);
		background: var(--ft-text-strong);
		color: var(--ft-bg);
	}

	.btn--primary:hover {
		background: var(--ft-cta);
		border-color: var(--ft-cta);
		color: var(--ft-cta-text);
	}

	.btn--ghost {
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		color: var(--ft-text);
	}

	.btn--ghost:hover {
		border-color: var(--ft-text-strong);
		color: var(--ft-text-strong);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.logout-page .animate-spin) {
			animation: none;
		}
	}
</style>
