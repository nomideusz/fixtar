<script lang="ts">
	import StatCard from '$lib/components/account/StatCard.svelte';
	import { getOrderStatus } from '$lib/utils/order-status';
	import { WarningIcon, ShoppingBagIcon, CheckIcon, ClockIcon, CurrencyDollarIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	// --- Types ---

	interface Order {
		id: string;
		orderNumber?: string;
		created: string;
		status: string;
		total?: number;
		paymentMethod?: string;
		shippingMethod?: string;
	}

	// --- Derived Data ---

	const orders = $derived((data.orders || []) as Order[]);

	const orderStats = $derived.by(() => {
		const lowerStatuses = orders.map((o) => o.status.toLowerCase());
		return {
			total: orders.length,
			delivered: lowerStatuses.filter((s) => s === 'delivered' || s === 'completed').length,
			processing: lowerStatuses.filter((s) => s === 'processing' || s === 'pending').length,
			totalSpent: orders.reduce((sum, o) => sum + (o.total || 0), 0)
		};
	});

	// --- Filters ---

	let statusFilter = $state('all');
	let sortBy = $state('date-desc');

	const filteredOrders = $derived.by(() => {
		let filtered =
			statusFilter === 'all'
				? orders
				: orders.filter((o) => o.status.toLowerCase() === statusFilter);

		return filtered.toSorted((a, b) => {
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

	// --- Helpers ---

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function isCompleted(status: string): boolean {
		const s = status.toLowerCase();
		return s === 'delivered' || s === 'completed';
	}
</script>

<svelte:head>
	<title>Moje Zamówienia - FixTar</title>
	<meta name="description" content="Zobacz historię swoich zamówień i śledź ich status" />
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<section>
		<h1 class="text-2xl font-bold text-[--ft-text-strong]" style="font-family:var(--font-display);letter-spacing:-0.02em">Moje Zamówienia</h1>
		<p class="mt-1 text-[--ft-text-muted]">Przeglądaj historię zamówień, śledź status dostaw i zarządzaj swoimi zakupami</p>
	</section>

	<div class="space-y-8">
	{#if data.error}
		<!-- Error State -->
		<div class="py-8 text-center">
			<div
				class="bg-danger/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
			>
				<WarningIcon class="text-danger h-8 w-8" aria-hidden="true" />
			</div>
			<h3 class="mb-2 text-xl font-bold text-[--ft-text]">Wystąpił błąd</h3>
			<p class="mb-6 text-[--ft-text-muted]">{data.error}</p>
			<a href="/account" class="text-[--ft-accent] font-medium hover:underline">Wróć do konta</a>
		</div>
	{:else}
		<!-- Stats -->
		<section>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard value={orderStats.total} label="Łączne zamówienia">
					{#snippet icon()}
						<ShoppingBagIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
					{/snippet}
				</StatCard>

				<StatCard value={orderStats.delivered} label="Dostarczone" valueClass="text-[--ft-accent]">
					{#snippet icon()}
						<CheckIcon class="text-success h-6 w-6" aria-hidden="true" />
					{/snippet}
				</StatCard>

				<StatCard value={orderStats.processing} label="W trakcie">
					{#snippet icon()}
						<ClockIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
					{/snippet}
				</StatCard>

				<StatCard value="{orderStats.totalSpent.toFixed(2)} zł" label="Łączne wydatki" valueClass="text-[--ft-accent]">
					{#snippet icon()}
						<CurrencyDollarIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
					{/snippet}
				</StatCard>
			</div>
		</section>

		<!-- Filters -->
		<section>
			<div class="py-4 border-b border-[--ft-line]">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div class="flex flex-col gap-4 sm:flex-row">
						<div>
							<label for="status-filter" class="mb-2 block text-sm font-medium text-[--ft-text]">Filtruj po statusie</label>
							<select id="status-filter" bind:value={statusFilter} class="focus:ring-[--ft-accent] rounded-lg border border-[--ft-line] px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
								<option value="all">Wszystkie</option>
								<option value="delivered">Dostarczone</option>
								<option value="processing">Przetwarzane</option>
								<option value="shipped">Wysłane</option>
								<option value="cancelled">Anulowane</option>
							</select>
						</div>

						<div>
							<label for="sort-filter" class="mb-2 block text-sm font-medium text-[--ft-text]">Sortuj według</label>
							<select id="sort-filter" bind:value={sortBy} class="focus:ring-[--ft-accent] rounded-lg border border-[--ft-line] px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
								<option value="date-desc">Data: najnowsze</option>
								<option value="date-asc">Data: najstarsze</option>
								<option value="total-desc">Kwota: malejąco</option>
								<option value="total-asc">Kwota: rosnąco</option>
							</select>
						</div>
					</div>

					<div class="text-sm text-[--ft-text-muted]">
						Wyświetlam {filteredOrders.length} z {orders.length} zamówień
					</div>
				</div>
			</div>
		</section>

		<!-- Orders ListIcon -->
		<section>
			{#if filteredOrders.length === 0}
				<div class="py-12 text-center">
					<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--ft-frost]">
						<ShoppingBagIcon class="h-8 w-8 text-[--ft-text-muted]" aria-hidden="true" />
					</div>
					<h3 class="mb-2 text-xl font-bold text-[--ft-text]">
						{statusFilter === 'all' ? 'Brak zamówień' : 'Brak zamówień z wybranym statusem'}
					</h3>
					<p class="mb-6 text-[--ft-text-muted]">
						{statusFilter === 'all'
							? 'Rozpocznij zakupy i zobacz swoje zamówienia tutaj'
							: 'Spróbuj zmienić filtr lub dodać nowe zamówienia'}
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						{#if statusFilter !== 'all'}
							<button
								onclick={() => (statusFilter = 'all')}
								class="text-[--ft-text-muted] hover:text-[--ft-text] font-medium"
							>Pokaż wszystkie</button>
						{/if}
						<a href="/products" class="text-[--ft-accent] font-medium hover:underline">Rozpocznij zakupy</a>
					</div>
				</div>
			{:else}
				<div class="space-y-0 divide-y divide-[--ft-line]">
					{#each filteredOrders as order (order)}
						{@const status = getOrderStatus(order.status)}
						<div class="group py-6">
							<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
								<div class="mb-4 flex-1 lg:mb-0">
									<div class="mb-3 flex items-center gap-4">
										<div>
											<h3 class="text-lg font-bold text-[--ft-text]">
												Zamówienie #{order.orderNumber || order.id}
											</h3>
											<p class="text-sm text-[--ft-text-muted]">Złożone {formatDate(order.created)}</p>
										</div>
										<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold {status.colorClass}">
											{status.label}
										</span>
									</div>

									<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
										<div>
											<span class="text-[--ft-text-muted]">Suma zamówienia:</span>
											<span class="ml-1 font-semibold text-[--ft-text]">{(order.total || 0).toFixed(2)} zł</span>
										</div>
										<div>
											<span class="text-[--ft-text-muted]">Metoda płatności:</span>
											<span class="ml-1 font-semibold text-[--ft-text]">{order.paymentMethod || 'Karta'}</span>
										</div>
										<div>
											<span class="text-[--ft-text-muted]">Dostawa:</span>
											<span class="ml-1 font-semibold text-[--ft-text]">{order.shippingMethod || 'Standardowa'}</span>
										</div>
									</div>
								</div>

								<div class="flex flex-col gap-3 sm:flex-row">
									<a
										href="/orders/{order.id}"
										class="text-sm font-medium text-[--ft-accent] hover:underline"
									>
										Zobacz szczegóły
									</a>
									{#if isCompleted(order.status)}
										<a
											href="/products?reorder={order.id}"
											class="text-sm font-medium text-[--ft-text-muted] hover:text-[--ft-text]"
										>Zamów ponownie</a>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Support -->
		<section>
			<div class="bg-[--ft-frost] rounded-lg p-8 text-center">
				<h3 class="mb-4 text-xl font-bold text-[--ft-text]">Potrzebujesz pomocy z zamówieniem?</h3>
				<p class="mb-6 text-[--ft-text-muted]">Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twoich zamówień</p>
				<div class="flex flex-col justify-center gap-6 sm:flex-row">
					<a href="/contact" class="text-[--ft-accent] font-medium hover:underline">Skontaktuj się z nami</a>
					<a href="/help/orders" class="text-[--ft-text-muted] hover:text-[--ft-text]">Pomoc z zamówieniami</a>
				</div>
			</div>
		</section>
	{/if}
</div>
</div>
