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
			rewardPoints: Math.floor(orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) * 0.1) // 10% of spending as points
		};
	});

	// Use real recent orders (limit to 3 most recent)
	const recentOrders = $derived.by(() => {
		return (data.orders || [])
			.slice(0, 3)
			.map((order: any) => ({
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
				return 'bg-neutral-100 text-neutral-800';
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
			color: 'from-brand-500 to-brand-600'
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
			color: 'from-brand-500 to-brand-600'
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
	<meta name="description" content="Panel konta użytkownika FixTar - zarządzaj zamówieniami, adresami i ustawieniami" />
</svelte:head>

<!-- Professional Account Hero -->
<Hero
	title="Moje Konto"
	subtitle="Zarządzaj swoim kontem, śledź zamówienia i personalizuj swoje doświadczenia zakupowe"
	centered={true}
	className="bg-linear-to-br from-accent-50 via-white to-accent-50"
/>

<div class="bg-white">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
		{#if !userStore.current}
			<!-- Enhanced Login Prompt -->
			<div class="max-w-2xl mx-auto">
				<Card class="text-center p-12">
					<div class="w-20 h-20 bg-linear-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
						<svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h2 class="text-3xl font-bold text-neutral-900 mb-4">Witaj w Swoim Koncie</h2>
					<p class="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
						Zaloguj się, aby uzyskać dostęp do panelu konta i zarządzać swoimi zamówieniami
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button href="/auth/login" class="text-lg px-8 py-4">
							Zaloguj się
						</Button>
						<Button href="/auth/register" variant="outline" class="text-lg px-8 py-4">
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
					<Card class="p-8 bg-linear-to-br from-neutral-50 to-white border-2 border-neutral-100">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="mb-6 lg:mb-0">
								<div class="flex items-center mb-4">
									<div class="w-16 h-16 bg-linear-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center mr-4">
										<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<div>
										<h1 class="text-3xl font-bold text-neutral-900">
											Witaj ponownie, {userStore.current?.username || 'Użytkowniku'}!
										</h1>
										<p class="text-lg text-neutral-600 mt-1">Zarządzaj swoim kontem i śledź zamówienia</p>
									</div>
								</div>
								{#if stats.totalOrders > 0}
									<div class="inline-flex items-center px-4 py-2 bg-success/10 text-success-dark rounded-full text-sm font-semibold">
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										Zweryfikowany klient
									</div>
								{/if}
							</div>
							<div class="text-center lg:text-right">
								<p class="text-sm text-neutral-500 mb-1">Członek od</p>
								<p class="text-xl font-bold text-neutral-900">{memberSince}</p>
							</div>
						</div>
					</Card>
				</section>

				<!-- Stats Grid -->
				<section>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<Card hover class="group text-center p-6">
							<div class="w-16 h-16 bg-linear-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
								<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
							</div>
							<div class="text-3xl font-bold text-brand-600 mb-2 group-hover:scale-105 transition-transform duration-200">
								{stats.totalOrders}
							</div>
							<div class="text-neutral-600 font-medium">Łączne zamówienia</div>
						</Card>
						
						<Card hover class="group text-center p-6">
							<div class="w-16 h-16 bg-linear-to-br from-success/10 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
								<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
								</svg>
							</div>
							<div class="text-3xl font-bold text-success mb-2 group-hover:scale-105 transition-transform duration-200">
								{stats.totalSpent.toFixed(2)} zł
							</div>
							<div class="text-neutral-600 font-medium">Łączne wydatki</div>
						</Card>
						
						<Card hover class="group text-center p-6">
							<div class="w-16 h-16 bg-linear-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
								<svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</div>
							<div class="text-3xl font-bold text-accent-600 mb-2 group-hover:scale-105 transition-transform duration-200">
								{stats.favoriteItems}
							</div>
							<div class="text-neutral-600 font-medium">Ulubione produkty</div>
						</Card>
						
						<Card hover class="group text-center p-6">
							<div class="w-16 h-16 bg-linear-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
								<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
								</svg>
							</div>
							<div class="text-3xl font-bold text-brand-600 mb-2 group-hover:scale-105 transition-transform duration-200">
								{stats.rewardPoints}
							</div>
							<div class="text-neutral-600 font-medium">Punkty lojalnościowe</div>
						</Card>
					</div>
				</section>

				<!-- Quick Actions Grid -->
				<section>
					<div class="mb-8">
						<h2 class="text-2xl font-bold text-neutral-900 mb-4">Szybkie akcje</h2>
						<p class="text-neutral-600">Zarządzaj swoim kontem i zamówieniami</p>
					</div>
					
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{#each quickActions as action (action)}
							<Card hover class="group">
								<div class="relative overflow-hidden">
									<div class="absolute inset-0 bg-linear-to-br {action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
									<div class="relative p-6">
										<div class="w-12 h-12 bg-linear-to-br {action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
											{#if action.icon === 'orders'}
												<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
												</svg>
											{:else if action.icon === 'addresses'}
												<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
											{:else if action.icon === 'favorites'}
												<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
												</svg>
											{:else if action.icon === 'settings'}
												<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
											{/if}
										</div>
										<h3 class="text-lg font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors duration-200">
											{action.title}
										</h3>
										<p class="text-neutral-600 text-sm mb-4 leading-relaxed">
											{action.description}
										</p>
										<Button 
											href={action.href} 
											variant="outline" 
											size="sm"
											class="w-full group-hover:border-brand-500 group-hover:text-brand-600 transition-colors duration-200"
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
						<h2 class="text-2xl font-bold text-neutral-900 mb-4">Funkcje konta</h2>
						<p class="text-neutral-600">Odblokuj dodatkowe korzyści</p>
					</div>
					
					<Card class="p-8">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							{#each accountFeatures as feature (feature)}
								<div class="flex items-start">
									<div class="shrink-0 mt-1">
										<div class="w-6 h-6 rounded-full flex items-center justify-center {feature.completed ? 'bg-success/10' : 'bg-neutral-100'}">
											{#if feature.completed}
												<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
												</svg>
											{:else}
												<svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
												</svg>
											{/if}
										</div>
									</div>
									<div class="ml-4">
										<h4 class="font-semibold text-neutral-900 {feature.completed ? '' : 'opacity-75'}">{feature.title}</h4>
										<p class="text-sm text-neutral-600 mt-1 {feature.completed ? '' : 'opacity-75'}">{feature.description}</p>
									</div>
								</div>
							{/each}
						</div>
					</Card>
				</section>

				<!-- Recent Orders -->
				<section>
					<Card class="p-8">
						<div class="flex items-center justify-between mb-8">
							<div>
								<h2 class="text-2xl font-bold text-neutral-900 mb-2">Ostatnie zamówienia</h2>
								<p class="text-neutral-600">Śledź status swoich zamówień</p>
							</div>
							<Button href="/account/orders" variant="outline">
								Zobacz wszystkie
							</Button>
						</div>
						
						{#if recentOrders.length === 0}
							<div class="text-center py-12">
								<div class="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
									<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
									</svg>
								</div>
								<h3 class="text-lg font-semibold text-neutral-900 mb-2">Brak zamówień</h3>
								<p class="text-neutral-600 mb-6">Rozpocznij zakupy i zobacz swoje zamówienia tutaj</p>
								<Button href="/products">
									Rozpocznij zakupy
								</Button>
							</div>
						{:else}
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead>
										<tr class="border-b border-neutral-200">
											<th class="text-left py-4 px-4 font-semibold text-neutral-900">Numer zamówienia</th>
											<th class="text-left py-4 px-4 font-semibold text-neutral-900">Data</th>
											<th class="text-left py-4 px-4 font-semibold text-neutral-900">Produkty</th>
											<th class="text-left py-4 px-4 font-semibold text-neutral-900">Suma</th>
											<th class="text-left py-4 px-4 font-semibold text-neutral-900">Status</th>
											<th class="text-right py-4 px-4 font-semibold text-neutral-900">Akcja</th>
										</tr>
									</thead>
									<tbody>
										{#each recentOrders as order (order)}
											<tr class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150">
												<td class="py-4 px-4">
													<span class="font-medium text-brand-600">#{order.id}</span>
												</td>
												<td class="py-4 px-4 text-neutral-600">{order.date}</td>
												<td class="py-4 px-4 text-neutral-600">{order.items} {order.items === 1 ? 'produkt' : 'produkty'}</td>
												<td class="py-4 px-4 font-semibold text-neutral-900">{order.total.toFixed(2)} zł</td>
												<td class="py-4 px-4">
													<span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full {getStatusColor(order.status)}">
														{getStatusText(order.status)}
													</span>
												</td>
												<td class="py-4 px-4 text-right">
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
					<Card class="p-8 bg-linear-to-br from-brand-50 to-accent-50 border-2 border-neutral-100">
						<div class="text-center">
							<h3 class="text-xl font-bold text-neutral-900 mb-4">Potrzebujesz pomocy?</h3>
							<p class="text-neutral-600 mb-6 max-w-md mx-auto">
								Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twojego konta
							</p>
							<div class="flex flex-col sm:flex-row gap-4 justify-center">
								<Button href="/contact" variant="outline">
									Skontaktuj się z nami
								</Button>
								<Button href="/help">
									Centrum pomocy
								</Button>
							</div>
						</div>
					</Card>
				</section>
			</div>
		{/if}
	</div>
</div>




