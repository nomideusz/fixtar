<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import type { PageData } from './$types';

	// Get real data from server
	const { data } = $props<{ data: PageData }>();

	// Calculate real stats from user data
	const stats = $derived.by(() => {
		const orders = data.orders || [];
		const favorites = data.favorites || [];

		return {
			totalOrders: orders.length,
			totalSpent: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
			favoriteItems: favorites.length,
			rewardPoints: Math.floor(
				orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) * 0.1
			) // 10% of spending as points
		};
	});

	// Use real recent orders (limit to 3 most recent)
	const recentOrders = $derived.by(() => {
		return (data.orders || []).slice(0, 3).map((order: any) => ({
			id: order.orderNumber || order.id,
			date: new Date(order.created).toLocaleDateString('pl-PL'),
			total: order.total || 0,
			status: order.status || 'processing',
			items: 1 // We'd need order items data to get exact count
		}));
	});

	function getStatusColor(status: string): string {
		switch (status) {
			case 'delivered':
			case 'completed':
				return 'bg-success/10 text-success-dark';
			case 'shipped':
			case 'shipping':
				return 'bg-brand-100 text-brand-800';
			case 'processing':
			case 'pending':
				return 'bg-warning/10 text-warning-dark';
			case 'cancelled':
				return 'bg-danger/10 text-danger-dark';
			default:
				return 'bg-neutral-100 text-neutral-200';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'delivered':
			case 'completed':
				return 'Dostarczono';
			case 'shipped':
			case 'shipping':
				return 'Wysłano';
			case 'processing':
			case 'pending':
				return 'Przetwarzane';
			case 'cancelled':
				return 'Anulowano';
			default:
				return 'Nieznany';
		}
	}

	// Format member since date from user creation
	const memberSince = $derived(
		userStore.current && typeof userStore.current === 'object' && 'created' in userStore.current
			? new Date(userStore.current.created as string).toLocaleDateString('pl-PL', {
					year: 'numeric',
					month: 'long'
				})
			: 'Niedawno'
	);

	// Quick actions data with Polish labels
	const quickActions = [
		{
			title: 'Zamówienia',
			description: 'Śledź i zarządzaj swoimi zamówieniami',
			href: '/account/orders',
			icon: 'orders',
			color: 'from-brand-500/100 to-brand-600'
		},
		{
			title: 'Adresy',
			description: 'Zarządzaj adresami dostawy',
			href: '/account/addresses',
			icon: 'addresses',
			color: 'from-success to-success'
		},
		{
			title: 'Ulubione',
			description: 'Przeglądaj ulubione produkty',
			href: '/account/favorites',
			icon: 'favorites',
			color: 'from-accent-500 to-accent-600'
		},
		{
			title: 'Ustawienia',
			description: 'Zaktualizuj preferencje konta',
			href: '/account/settings',
			icon: 'settings',
			color: 'from-brand-500/100 to-brand-600'
		}
	];

	// Account features
	const accountFeatures = $derived([
		{
			title: 'Szybkie Zamówienia',
			description: 'Ponownie zamów poprzednie produkty jednym kliknięciem',
			completed: stats.totalOrders > 0
		},
		{
			title: 'Program Lojalnościowy',
			description: 'Zbieraj punkty i wymieniaj je na nagrody',
			completed: stats.rewardPoints > 0
		},
		{
			title: 'Personalizowane Rekomendacje',
			description: 'Otrzymuj propozycje dopasowane do Twoich preferencji',
			completed: stats.favoriteItems > 0
		},
		{
			title: 'Wsparcie Premium',
			description: 'Priorytetowa obsługa klienta dla stałych klientów',
			completed: stats.totalSpent > 500
		}
	]);
</script>

<svelte:head>
	<title>Moje Konto - FixTar</title>
	<meta
		name="description"
		content="Panel konta użytkownika FixTar - zarządzaj zamówieniami, adresami i ustawieniami"
	/>
</svelte:head>

<!-- Professional Account Hero -->
<Hero
	title="Moje Konto"
	subtitle="Zarządzaj swoim kontem, śledź zamówienia i personalizuj swoje doświadczenia zakupowe"
	centered={true}
/>

<div>
	<div class="mx-auto max-w-screen-2xl px-6 py-16 sm:px-8 lg:px-12">
		{#if !userStore.current}
			<!-- Enhanced Login Prompt -->
			<div class="mx-auto max-w-2xl">
				<Card class="p-12 text-center">
					<div
						class="from-brand-500/100/20 to-accent-500/100/20 mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br"
					>
						<svg
							class="text-brand-600 h-10 w-10"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h2 class="mb-4 text-3xl font-bold text-white">Witaj w Swoim Koncie</h2>
					<p class="mx-auto mb-8 max-w-md text-lg text-neutral-400">
						Zaloguj się, aby uzyskać dostęp do panelu konta i zarządzać swoimi zamówieniami
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button href="/auth/login" class="px-8 py-4 text-lg">Zaloguj się</Button>
						<Button href="/auth/register" variant="outline" class="px-8 py-4 text-lg">
							Utwórz konto
						</Button>
					</div>
				</Card>
			</div>
		{:else}
			<!-- Account Dashboard -->
			<div class="space-y-12">
				<!-- Welcome Section -->
				<section>
					<Card class="border-2 border-white/10 bg-linear-to-br from-white/5 to-white/3 p-8">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="mb-6 lg:mb-0">
								<div class="mb-4 flex items-center">
									<div
										class="from-brand-500/100/20 to-accent-500/100/20 mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br"
									>
										<svg
											class="text-brand-600 h-8 w-8"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<div>
										<h1 class="text-3xl font-bold text-white">
											Witaj ponownie, {userStore.current?.username || 'Użytkowniku'}!
										</h1>
										<p class="mt-1 text-lg text-neutral-400">
											Zarządzaj swoim kontem i śledź zamówienia
										</p>
									</div>
								</div>
								{#if stats.totalOrders > 0}
									<div
										class="bg-success/10 text-success-dark inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
									>
										<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Zweryfikowany klient
									</div>
								{/if}
							</div>
							<div class="text-center lg:text-right">
								<p class="mb-1 text-sm text-neutral-500">Członek od</p>
								<p class="text-xl font-bold text-white">{memberSince}</p>
							</div>
						</div>
					</Card>
				</section>

				<!-- Stats Grid -->
				<section>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<Card hover class="group p-6 text-center">
							<div
								class="from-brand-500/100/20 to-brand-500/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
							>
								<svg
									class="text-brand-600 h-8 w-8"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
							</div>
							<div
								class="text-brand-600 mb-2 text-3xl font-bold transition-transform duration-200 group-hover:scale-105"
							>
								{stats.totalOrders}
							</div>
							<div class="font-medium text-neutral-400">Łączne zamówienia</div>
						</Card>

						<Card hover class="group p-6 text-center">
							<div
								class="from-success/10 to-success/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
							>
								<svg
									class="text-success h-8 w-8"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
							</div>
							<div
								class="text-success mb-2 text-3xl font-bold transition-transform duration-200 group-hover:scale-105"
							>
								{stats.totalSpent.toFixed(2)} zł
							</div>
							<div class="font-medium text-neutral-400">Łączne wydatki</div>
						</Card>

						<Card hover class="group p-6 text-center">
							<div
								class="from-accent-100 to-accent-200 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
							>
								<svg
									class="text-accent-600 h-8 w-8"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</div>
							<div
								class="text-accent-600 mb-2 text-3xl font-bold transition-transform duration-200 group-hover:scale-105"
							>
								{stats.favoriteItems}
							</div>
							<div class="font-medium text-neutral-400">Ulubione produkty</div>
						</Card>

						<Card hover class="group p-6 text-center">
							<div
								class="from-brand-500/100/20 to-brand-500/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
							>
								<svg
									class="text-brand-600 h-8 w-8"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							</div>
							<div
								class="text-brand-600 mb-2 text-3xl font-bold transition-transform duration-200 group-hover:scale-105"
							>
								{stats.rewardPoints}
							</div>
							<div class="font-medium text-neutral-400">Punkty lojalnościowe</div>
						</Card>
					</div>
				</section>

				<!-- Quick Actions Grid -->
				<section>
					<div class="mb-8">
						<h2 class="mb-4 text-2xl font-bold text-white">Szybkie akcje</h2>
						<p class="text-neutral-400">Zarządzaj swoim kontem i zamówieniami</p>
					</div>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each quickActions as action (action)}
							<Card hover class="group">
								<div class="relative overflow-hidden">
									<div
										class="absolute inset-0 bg-linear-to-br {action.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10"
									></div>
									<div class="relative p-6">
										<div
											class="h-12 w-12 bg-linear-to-br {action.color} mb-4 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
										>
											{#if action.icon === 'orders'}
												<svg
													class="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
													/>
												</svg>
											{:else if action.icon === 'addresses'}
												<svg
													class="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
											{:else if action.icon === 'favorites'}
												<svg
													class="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
													/>
												</svg>
											{:else if action.icon === 'settings'}
												<svg
													class="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
											{/if}
										</div>
										<h3
											class="group-hover:text-brand-600 mb-2 text-lg font-bold text-white transition-colors duration-200"
										>
											{action.title}
										</h3>
										<p class="mb-4 text-sm leading-relaxed text-neutral-400">
											{action.description}
										</p>
										<Button
											href={action.href}
											variant="outline"
											size="sm"
											class="group-hover:border-brand-500 group-hover:text-brand-600 w-full transition-colors duration-200"
										>
											Przejdź
										</Button>
									</div>
								</div>
							</Card>
						{/each}
					</div>
				</section>

				<!-- Account Features -->
				<section>
					<div class="mb-8">
						<h2 class="mb-4 text-2xl font-bold text-white">Funkcje konta</h2>
						<p class="text-neutral-400">Odblokuj dodatkowe korzyści</p>
					</div>

					<Card class="p-8">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							{#each accountFeatures as feature (feature)}
								<div class="flex items-start">
									<div class="mt-1 shrink-0">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full {feature.completed
												? 'bg-success/10'
												: 'bg-white/10'}"
										>
											{#if feature.completed}
												<svg
													class="text-success h-4 w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											{:else}
												<svg
													class="h-4 w-4 text-neutral-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 6v6m0 0v6m0-6h6m-6 0H6"
													/>
												</svg>
											{/if}
										</div>
									</div>
									<div class="ml-4">
										<h4
											class="font-semibold text-white {feature.completed ? '' : 'opacity-75'}"
										>
											{feature.title}
										</h4>
										<p
											class="mt-1 text-sm text-neutral-400 {feature.completed ? '' : 'opacity-75'}"
										>
											{feature.description}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</Card>
				</section>

				<!-- Recent Orders -->
				<section>
					<Card class="p-8">
						<div class="mb-8 flex items-center justify-between">
							<div>
								<h2 class="mb-2 text-2xl font-bold text-white">Ostatnie zamówienia</h2>
								<p class="text-neutral-400">Śledź status swoich zamówień</p>
							</div>
							<Button href="/account/orders" variant="outline">Zobacz wszystkie</Button>
						</div>

						{#if recentOrders.length === 0}
							<div class="py-12 text-center">
								<div
									class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"
								>
									<svg
										class="h-8 w-8 text-neutral-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
								</div>
								<h3 class="mb-2 text-lg font-semibold text-white">Brak zamówień</h3>
								<p class="mb-6 text-neutral-400">
									Rozpocznij zakupy i zobacz swoje zamówienia tutaj
								</p>
								<Button href="/products">Rozpocznij zakupy</Button>
							</div>
						{:else}
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead>
										<tr class="border-b border-white/10">
											<th class="px-4 py-4 text-left font-semibold text-white"
												>Numer zamówienia</th
											>
											<th class="px-4 py-4 text-left font-semibold text-white">Data</th>
											<th class="px-4 py-4 text-left font-semibold text-white">Produkty</th>
											<th class="px-4 py-4 text-left font-semibold text-white">Suma</th>
											<th class="px-4 py-4 text-left font-semibold text-white">Status</th>
											<th class="px-4 py-4 text-right font-semibold text-white">Akcja</th>
										</tr>
									</thead>
									<tbody>
										{#each recentOrders as order (order)}
											<tr
												class="border-b border-neutral-100 transition-colors duration-150 hover:bg-white/5"
											>
												<td class="px-4 py-4">
													<span class="text-brand-600 font-medium">#{order.id}</span>
												</td>
												<td class="px-4 py-4 text-neutral-400">{order.date}</td>
												<td class="px-4 py-4 text-neutral-400"
													>{order.items} {order.items === 1 ? 'produkt' : 'produkty'}</td
												>
												<td class="px-4 py-4 font-semibold text-white"
													>{order.total.toFixed(2)} zł</td
												>
												<td class="px-4 py-4">
													<span
														class="inline-flex rounded-full px-3 py-1 text-xs font-semibold {getStatusColor(
															order.status
														)}"
													>
														{getStatusText(order.status)}
													</span>
												</td>
												<td class="px-4 py-4 text-right">
													<Button
														href="/account/orders/{order.id}"
														variant="ghost"
														size="sm"
														class="text-brand-600 hover:text-brand-700"
													>
														Zobacz szczegóły
													</Button>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</Card>
				</section>

				<!-- Support Section -->
				<section>
					<Card class="from-brand-500/100/8 to-accent-500/100/8 border-2 border-white/10 bg-linear-to-br p-8">
						<div class="text-center">
							<h3 class="mb-4 text-xl font-bold text-white">Potrzebujesz pomocy?</h3>
							<p class="mx-auto mb-6 max-w-md text-neutral-400">
								Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twojego konta
							</p>
							<div class="flex flex-col justify-center gap-4 sm:flex-row">
								<Button href="/contact" variant="outline">Skontaktuj się z nami</Button>
								<Button href="/help">Centrum pomocy</Button>
							</div>
						</div>
					</Card>
				</section>
			</div>
		{/if}
	</div>
</div>
