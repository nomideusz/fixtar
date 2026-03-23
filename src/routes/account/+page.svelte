<script lang="ts">
	import { userStore } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import StatCard from '$lib/components/account/StatCard.svelte';
	import QuickActionCard from '$lib/components/account/QuickActionCard.svelte';
	import RecentOrdersTable from '$lib/components/account/RecentOrdersTable.svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	// --- Derived Stats ---

	const stats = $derived.by(() => {
		const orders = data.orders || [];
		const favorites = data.favorites || [];
		const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

		return {
			totalOrders: orders.length,
			totalSpent,
			favoriteItems: favorites.length,
			rewardPoints: Math.floor(totalSpent * 0.1)
		};
	});

	const recentOrders = $derived(
		(data.orders || []).slice(0, 3).map((order: any) => ({
			id: order.orderNumber || order.id,
			date: new Date(order.created).toLocaleDateString('pl-PL'),
			total: order.total || 0,
			status: order.status || 'processing',
			items: 1
		}))
	);

	const memberSince = $derived(
		userStore.current && typeof userStore.current === 'object' && 'created' in userStore.current
			? new Date(userStore.current.created as string).toLocaleDateString('pl-PL', {
					year: 'numeric',
					month: 'long'
				})
			: 'Niedawno'
	);

	// --- Account Features ---

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

<div>
		{#if !userStore.current}
			<!-- Login Prompt -->
			<div class="mx-auto max-w-2xl">
				<Card class="p-12 text-center">
					<div
						class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[--ft-accent]/20"
					>
						<svg
							class="text-[--ft-accent] h-10 w-10"
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
					<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">Witaj w Swoim Koncie</h2>
					<p class="mx-auto mb-8 max-w-md text-lg text-[--ft-text-muted]">
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
			<div class="space-y-12">
				<!-- Welcome Section -->
				<section>
					<Card class="border-2 border-[--ft-line] bg-linear-to-br from-[--ft-frost] to-[--ft-surface] p-8">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="mb-6 lg:mb-0">
								<div class="mb-4 flex items-center">
									<div
										class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-[--ft-accent]/20"
									>
										<svg
											class="text-[--ft-accent] h-8 w-8"
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
										<h1 class="text-3xl font-bold text-[--ft-text]">
											Witaj ponownie, {userStore.current?.username || 'Użytkowniku'}!
										</h1>
										<p class="mt-1 text-lg text-[--ft-text-muted]">
											Zarządzaj swoim kontem i śledź zamówienia
										</p>
									</div>
								</div>
								{#if stats.totalOrders > 0}
									<div
										class="bg-success/10 text-success-dark inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
									>
										<svg
											class="mr-2 h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
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
								<p class="mb-1 text-sm text-[--ft-text-muted]">Członek od</p>
								<p class="text-xl font-bold text-[--ft-text]">{memberSince}</p>
							</div>
						</div>
					</Card>
				</section>

				<!-- Stats Grid -->
				<section>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<StatCard value={stats.totalOrders} label="Łączne zamówienia">
							{#snippet icon()}
								<svg class="text-[--ft-accent] h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
							{/snippet}
						</StatCard>

						<StatCard
							value="{stats.totalSpent.toFixed(2)} zł"
							label="Łączne wydatki"
							valueClass="text-[--ft-accent]"
						>
							{#snippet icon()}
								<svg class="text-success h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
								</svg>
							{/snippet}
						</StatCard>

						<StatCard
							value={stats.favoriteItems}
							label="Ulubione produkty"
							valueClass="text-[--ft-accent]"
						>
							{#snippet icon()}
								<svg class="text-accent-600 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							{/snippet}
						</StatCard>

						<StatCard value={stats.rewardPoints} label="Punkty lojalnościowe">
							{#snippet icon()}
								<svg class="text-[--ft-accent] h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
								</svg>
							{/snippet}
						</StatCard>
					</div>
				</section>

				<!-- Quick Actions -->
				<section>
					<div class="mb-8">
						<h2 class="mb-4 text-2xl font-bold text-[--ft-text]">Szybkie akcje</h2>
						<p class="text-[--ft-text-muted]">Zarządzaj swoim kontem i zamówieniami</p>
					</div>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<QuickActionCard
							title="Zamówienia"
							description="Śledź i zarządzaj swoimi zamówieniami"
							href="/account/orders"
						>
							{#snippet icon()}
								<svg class="h-6 w-6 text-[--ft-text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Adresy"
							description="Zarządzaj adresami dostawy"
							href="/account/addresses"
						>
							{#snippet icon()}
								<svg class="h-6 w-6 text-[--ft-text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Ulubione"
							description="Przeglądaj ulubione produkty"
							href="/account/favorites"
						>
							{#snippet icon()}
								<svg class="h-6 w-6 text-[--ft-text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Ustawienia"
							description="Zaktualizuj preferencje konta"
							href="/account/settings"
						>
							{#snippet icon()}
								<svg class="h-6 w-6 text-[--ft-text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							{/snippet}
						</QuickActionCard>
					</div>
				</section>

				<!-- Account Features -->
				<section>
					<div class="mb-8">
						<h2 class="mb-4 text-2xl font-bold text-[--ft-text]">Funkcje konta</h2>
						<p class="text-[--ft-text-muted]">Odblokuj dodatkowe korzyści</p>
					</div>

					<Card class="p-8">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							{#each accountFeatures as feature (feature)}
								<div class="flex items-start">
									<div class="mt-1 shrink-0">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full {feature.completed
												? 'bg-success/10'
												: 'bg-[--ft-frost]'}"
										>
											<svg
												class="h-4 w-4 {feature.completed ? 'text-success' : 'text-[--ft-text-muted]'}"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d={feature.completed ? 'M5 13l4 4L19 7' : 'M12 6v6m0 0v6m0-6h6m-6 0H6'}
												/>
											</svg>
										</div>
									</div>
									<div class="ml-4">
										<h4
											class="font-semibold text-[--ft-text] {feature.completed ? '' : 'opacity-75'}"
										>
											{feature.title}
										</h4>
										<p
											class="mt-1 text-sm text-[--ft-text-muted] {feature.completed ? '' : 'opacity-75'}"
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
					<RecentOrdersTable orders={recentOrders} />
				</section>

				<!-- Support Section -->
				<section>
					<Card
						class="border-2 border-[--ft-line] bg-[--ft-accent]/8 p-8"
					>
						<div class="text-center">
							<h3 class="mb-4 text-xl font-bold text-[--ft-text]">Potrzebujesz pomocy?</h3>
							<p class="mx-auto mb-6 max-w-md text-[--ft-text-muted]">
								Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twojego
								konta
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
