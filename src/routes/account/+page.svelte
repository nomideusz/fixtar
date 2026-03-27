<script lang="ts">
	import { userStore } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { UserIcon, CheckCircleIcon, ShoppingBagIcon, CurrencyDollarIcon, HeartIcon, StarIcon, MapPinIcon, GearIcon, CheckIcon, PlusIcon } from 'phosphor-svelte';
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
				<Card class="p-6 text-center sm:p-12">
					<div
						class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[--ft-accent]/20"
					>
						<UserIcon class="text-[--ft-accent] h-10 w-10" aria-hidden="true" />
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
					<Card class="border-2 border-[--ft-line] bg-linear-to-br from-[--ft-frost] to-[--ft-surface] p-4 sm:p-8">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="mb-6 lg:mb-0">
								<div class="mb-4 flex items-center">
									<div
										class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-[--ft-accent]/20"
									>
										<UserIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
									</div>
									<div>
										<h1 class="text-xl font-bold text-[--ft-text] sm:text-3xl">
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
										<CheckCircleIcon class="mr-2 h-4 w-4" aria-hidden="true" />
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
								<ShoppingBagIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
							{/snippet}
						</StatCard>

						<StatCard
							value="{stats.totalSpent.toFixed(2)} zł"
							label="Łączne wydatki"
							valueClass="text-[--ft-accent]"
						>
							{#snippet icon()}
								<CurrencyDollarIcon class="text-success h-8 w-8" aria-hidden="true" />
							{/snippet}
						</StatCard>

						<StatCard
							value={stats.favoriteItems}
							label="Ulubione produkty"
							valueClass="text-[--ft-accent]"
						>
							{#snippet icon()}
								<HeartIcon class="text-accent-600 h-8 w-8" aria-hidden="true" />
							{/snippet}
						</StatCard>

						<StatCard value={stats.rewardPoints} label="Punkty lojalnościowe">
							{#snippet icon()}
								<StarIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
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
								<ShoppingBagIcon class="h-6 w-6 text-[--ft-text]" aria-hidden="true" />
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Adresy"
							description="Zarządzaj adresami dostawy"
							href="/account/addresses"
						>
							{#snippet icon()}
								<MapPinIcon class="h-6 w-6 text-[--ft-text]" aria-hidden="true" />
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Ulubione"
							description="Przeglądaj ulubione produkty"
							href="/account/favorites"
						>
							{#snippet icon()}
								<HeartIcon class="h-6 w-6 text-[--ft-text]" aria-hidden="true" />
							{/snippet}
						</QuickActionCard>

						<QuickActionCard
							title="Ustawienia"
							description="Zaktualizuj preferencje konta"
							href="/account/settings"
						>
							{#snippet icon()}
								<GearIcon class="h-6 w-6 text-[--ft-text]" aria-hidden="true" />
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

					<Card class="p-4 sm:p-8">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							{#each accountFeatures as feature (feature)}
								<div class="flex items-start">
									<div class="mt-1 shrink-0">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full {feature.completed
												? 'bg-success/10'
												: 'bg-[--ft-frost]'}"
										>
											{#if feature.completed}
												<CheckIcon class="h-4 w-4 text-success" aria-hidden="true" />
											{:else}
												<PlusIcon class="h-4 w-4 text-[--ft-text-muted]" aria-hidden="true" />
											{/if}
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
						class="border-2 border-[--ft-line] bg-[--ft-accent]/8 p-4 sm:p-8"
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
