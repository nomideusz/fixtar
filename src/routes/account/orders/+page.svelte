<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import type { PageData } from './$types';

	// Get real data from server
	const { data } = $props<{ data: PageData }>();

	interface Order {
		id: string;
		orderNumber?: string;
		created: string;
		status: string;
		total?: number;
		paymentMethod?: string;
		shippingMethod?: string;
	}

	// Use real orders data from server
	const orders = $derived((data.orders || []) as Order[]);
	const hasError = $derived(!!data.error);
	const errorMessage = $derived(data.error || '');

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'delivered':
			case 'completed':
				return 'text-success-dark bg-success/10';
			case 'processing':
			case 'pending':
				return 'text-brand-800 bg-brand-100';
			case 'shipped':
			case 'shipping':
				return 'text-accent-800 bg-accent-100';
			case 'cancelled':
			case 'canceled':
				return 'text-danger-dark bg-danger/10';
			default:
				return 'text-neutral-800 bg-neutral-100';
		}
	}

	function formatStatus(status: string) {
		switch (status.toLowerCase()) {
			case 'delivered':
			case 'completed':
				return 'Dostarczono';
			case 'processing':
				return 'Przetwarzane';
			case 'pending':
				return 'Oczekuje';
			case 'shipped':
			case 'shipping':
				return 'Wysłano';
			case 'cancelled':
			case 'canceled':
				return 'Anulowano';
			default:
				return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Filter and sort functionality
	let statusFilter = $state('all');
	let sortBy = $state('date-desc');

	const filteredOrders = $derived(() => {
		let filtered = orders;

		if (statusFilter !== 'all') {
			filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter);
		}

		return filtered.sort((a, b) => {
			switch (sortBy) {
				case 'date-asc':
					return new Date(a.created).getTime() - new Date(b.created).getTime();
				case 'date-desc':
					return new Date(b.created).getTime() - new Date(a.created).getTime();
				case 'total-asc':
					return (a.total || 0) - (b.total || 0);
				case 'total-desc':
					return (b.total || 0) - (a.total || 0);
				default:
					return 0;
			}
		});
	});

	// Order statistics
	const orderStats = $derived(() => {
		const total = orders.length;
		const delivered = orders.filter(
			(o) => o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'completed'
		).length;
		const processing = orders.filter(
			(o) => o.status.toLowerCase() === 'processing' || o.status.toLowerCase() === 'pending'
		).length;
		const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

		return { total, delivered, processing, totalSpent };
	});
</script>

<svelte:head>
	<title>Moje Zamówienia - FixTar</title>
	<meta name="description" content="Zobacz historię swoich zamówień i śledź ich status" />
</svelte:head>

<!-- Professional Orders Hero -->
<Hero
	title="Moje Zamówienia"
	subtitle="Przeglądaj historię zamówień, śledź status dostaw i zarządzaj swoimi zakupami"
	centered={true}
	className="bg-linear-to-br from-brand-50 via-white to-accent-50"
/>

<div class="space-y-8">
	{#if hasError}
		<!-- Error State -->
		<Card class="p-8 text-center">
			<div class="bg-danger/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
				<svg class="text-danger h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-xl font-bold text-neutral-900">Wystąpił błąd</h3>
			<p class="mb-6 text-neutral-600">{errorMessage}</p>
			<Button href="/account">Wróć do konta</Button>
		</Card>
	{:else}
		<!-- Order Statistics -->
		<section>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card hover class="group p-6 text-center">
					<div
						class="from-brand-100 to-brand-200 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
					>
						<svg
							class="text-brand-600 h-6 w-6"
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
					<div class="text-brand-600 mb-1 text-2xl font-bold">{orderStats().total}</div>
					<div class="text-sm font-medium text-neutral-600">Łączne zamówienia</div>
				</Card>

				<Card hover class="group p-6 text-center">
					<div
						class="from-success/10 to-success-light mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
					>
						<svg class="text-success h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div class="text-success mb-1 text-2xl font-bold">{orderStats().delivered}</div>
					<div class="text-sm font-medium text-neutral-600">Dostarczone</div>
				</Card>

				<Card hover class="group p-6 text-center">
					<div
						class="from-brand-100 to-brand-200 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
					>
						<svg
							class="text-brand-600 h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="text-brand-600 mb-1 text-2xl font-bold">{orderStats().processing}</div>
					<div class="text-sm font-medium text-neutral-600">W trakcie</div>
				</Card>

				<Card hover class="group p-6 text-center">
					<div
						class="from-accent-100 to-accent-200 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
					>
						<svg
							class="text-accent-600 h-6 w-6"
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
					<div class="text-accent-600 mb-1 text-2xl font-bold">
						{orderStats().totalSpent.toFixed(2)} zł
					</div>
					<div class="text-sm font-medium text-neutral-600">Łączne wydatki</div>
				</Card>
			</div>
		</section>

		<!-- Filters and Sort -->
		<section>
			<Card class="p-6">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div class="flex flex-col gap-4 sm:flex-row">
						<!-- Status Filter -->
						<div>
							<label for="status-filter" class="mb-2 block text-sm font-medium text-neutral-700"
								>Filtruj po statusie</label
							>
							<select
								id="status-filter"
								bind:value={statusFilter}
								class="focus:ring-brand-500 rounded-lg border border-neutral-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
							>
								<option value="all">Wszystkie</option>
								<option value="delivered">Dostarczone</option>
								<option value="processing">Przetwarzane</option>
								<option value="shipped">Wysłane</option>
								<option value="cancelled">Anulowane</option>
							</select>
						</div>

						<!-- Sort -->
						<div>
							<label for="sort-filter" class="mb-2 block text-sm font-medium text-neutral-700">Sortuj według</label>
							<select
								id="sort-filter"
								bind:value={sortBy}
								class="focus:ring-brand-500 rounded-lg border border-neutral-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
							>
								<option value="date-desc">Data: najnowsze</option>
								<option value="date-asc">Data: najstarsze</option>
								<option value="total-desc">Kwota: malejąco</option>
								<option value="total-asc">Kwota: rosnąco</option>
							</select>
						</div>
					</div>

					<div class="text-sm text-neutral-600">
						Wyświetlam {filteredOrders().length} z {orders.length} zamówień
					</div>
				</div>
			</Card>
		</section>

		<!-- Orders List -->
		<section>
			{#if filteredOrders().length === 0}
				<!-- Empty State -->
				<Card class="p-12 text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100"
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
					<h3 class="mb-2 text-xl font-bold text-neutral-900">
						{statusFilter === 'all' ? 'Brak zamówień' : 'Brak zamówień z wybranym statusem'}
					</h3>
					<p class="mb-6 text-neutral-600">
						{statusFilter === 'all'
							? 'Rozpocznij zakupy i zobacz swoje zamówienia tutaj'
							: 'Spróbuj zmienić filtr lub dodać nowe zamówienia'}
					</p>
					<div class="flex flex-col justify-center gap-3 sm:flex-row">
						{#if statusFilter !== 'all'}
							<Button variant="outline" onclick={() => (statusFilter = 'all')}>
								Pokaż wszystkie
							</Button>
						{/if}
						<Button href="/products">Rozpocznij zakupy</Button>
					</div>
				</Card>
			{:else}
				<div class="space-y-4">
					{#each filteredOrders() as order (order)}
						<Card hover class="group">
							<div class="p-6">
								<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
									<div class="mb-4 flex-1 lg:mb-0">
										<div class="mb-3 flex items-center gap-4">
											<div>
												<h3
													class="group-hover:text-brand-600 text-lg font-bold text-neutral-900 transition-colors"
												>
													Zamówienie #{order.orderNumber || order.id}
												</h3>
												<p class="text-sm text-neutral-600">
													Złożone {formatDate(order.created)}
												</p>
											</div>
											<span
												class="inline-flex rounded-full px-3 py-1 text-xs font-semibold {getStatusColor(
													order.status
												)}"
											>
												{formatStatus(order.status)}
											</span>
										</div>

										<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
											<div>
												<span class="text-neutral-500">Suma zamówienia:</span>
												<span class="ml-1 font-semibold text-neutral-900"
													>{(order.total || 0).toFixed(2)} zł</span
												>
											</div>
											<div>
												<span class="text-neutral-500">Metoda płatności:</span>
												<span class="ml-1 font-semibold text-neutral-900"
													>{order.paymentMethod || 'Karta'}</span
												>
											</div>
											<div>
												<span class="text-neutral-500">Dostawa:</span>
												<span class="ml-1 font-semibold text-neutral-900"
													>{order.shippingMethod || 'Standardowa'}</span
												>
											</div>
										</div>
									</div>

									<div class="flex flex-col gap-3 sm:flex-row">
										<Button
											href="/account/orders/{order.id}"
											variant="outline"
											size="sm"
											class="group-hover:border-brand-500 group-hover:text-brand-600 transition-colors"
										>
											Zobacz szczegóły
										</Button>
										{#if order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed'}
											<Button href="/products?reorder={order.id}" size="sm">Zamów ponownie</Button>
										{/if}
									</div>
								</div>
							</div>
						</Card>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Quick Actions -->
		<section>
			<Card class="from-brand-50 to-accent-50 border-2 border-neutral-100 bg-linear-to-br p-8">
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-neutral-900">
						Potrzebujesz pomocy z zamówieniem?
					</h3>
					<p class="mb-6 text-neutral-600">
						Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twoich zamówień
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button href="/contact" variant="outline">Skontaktuj się z nami</Button>
						<Button href="/help/orders">Pomoc z zamówieniami</Button>
					</div>
				</div>
			</Card>
		</section>
	{/if}
</div>
