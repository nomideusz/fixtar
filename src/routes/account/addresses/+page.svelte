<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	// Get real data from server
	const { data, form } = $props<{ data: PageData; form?: ActionData }>();

	// Use real addresses data from server
	let addresses = $derived(data.addresses || []);
	let isSubmitting = $state(false);
	const hasError = $derived(!!data.error);
	const errorMessage = $derived(data.error || '');

	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Akcja zakończona pomyślnie');
			// Reload the page to get fresh data
			window.location.reload();
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});

	function handleSetDefault(addressId: string) {
		isSubmitting = true;

		const formData = new FormData();
		formData.append('id', addressId);

		// Use fetch to call the server action
		fetch('?/setDefaultAddress', {
			method: 'POST',
			body: formData
		})
			.then((response) => {
				if (response.ok) {
					// Update local state immediately for better UX
					addresses = addresses.map((addr: any) => ({
						...addr,
						default: addr.id === addressId
					}));
					notifications.success('Domyślny adres zaktualizowany');
				} else {
					notifications.error('Nie udało się zaktualizować domyślnego adresu');
				}
			})
			.catch((err) => {
				console.error('Error setting default address:', err);
				notifications.error('Nie udało się zaktualizować domyślnego adresu');
			})
			.finally(() => {
				isSubmitting = false;
			});
	}

	function handleDelete(addressId: string) {
		if (addresses.length === 1) {
			notifications.error('Musisz mieć co najmniej jeden adres');
			return;
		}

		if (!confirm('Czy na pewno chcesz usunąć ten adres?')) {
			return;
		}

		// Find the form for this address and submit it
		const deleteForm = document.getElementById(`delete-form-${addressId}`) as HTMLFormElement;
		if (deleteForm) {
			deleteForm.requestSubmit();
		}
	}
</script>

<svelte:head>
	<title>Moje adresy - FixTar</title>
	<meta name="description" content="Zarządzaj adresami dostawy" />
</svelte:head>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[--ft-text]">Moje adresy</h1>
		<Button href="/account/addresses/new">Dodaj nowy adres</Button>
	</div>

	{#if hasError}
		<Card>
			<div class="py-12 text-center">
				<svg
					class="text-danger mx-auto mb-4 h-16 w-16"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium text-[--ft-text]">Błąd ładowania adresów</h3>
				<p class="mb-6 text-[--ft-text-muted]">{errorMessage}</p>
				<Button onclick={() => window.location.reload()}>Spróbuj ponownie</Button>
			</div>
		</Card>
	{:else if addresses.length === 0}
		<Card>
			<div class="py-12 text-center">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-[--ft-text-muted]"
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
				<h3 class="mb-2 text-lg font-medium text-[--ft-text]">Brak zapisanych adresów</h3>
				<p class="mb-6 text-[--ft-text-muted]">Dodaj adres, aby przyspieszyć składanie zamówień.</p>
				<Button href="/account/addresses/new">Dodaj pierwszy adres</Button>
			</div>
		</Card>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each addresses as address (address)}
				<Card>
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h3 class="flex items-center gap-2 font-semibold text-[--ft-text]">
								{address.type || 'Adres'}
								{#if address.default}
									<span
										class="rounded-full bg-[--ft-frost] px-2 py-1 text-xs font-medium text-[--ft-accent]"
									>
										Domyślny
									</span>
								{/if}
							</h3>
						</div>
						<div class="flex gap-2">
							<Button href="/account/addresses/{address.id}/edit" variant="ghost" size="sm">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</Button>
							<button
								onclick={() => handleDelete(address.id)}
								disabled={isSubmitting}
								class="hover:text-danger p-1 text-[--ft-text-muted] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Usuń adres"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>

							<!-- Hidden form for delete action -->
							<form
								id="delete-form-{address.id}"
								method="POST"
								action="?/removeAddress"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ update }) => {
										isSubmitting = false;
										await update();
									};
								}}
								style="display: none;"
							>
								<input type="hidden" name="id" value={address.id} />
							</form>
						</div>
					</div>

					<div class="mb-4 space-y-1 text-sm text-[--ft-text-muted]">
						<p>{address.street}</p>
						<p>{address.city} {address.postalCode}</p>
						<p>{address.country}</p>
					</div>

					{#if !address.default}
						<Button
							onclick={() => handleSetDefault(address.id)}
							disabled={isSubmitting}
							variant="secondary"
							size="sm"
							fullWidth
						>
							{isSubmitting ? 'Ustawianie...' : 'Ustaw jako domyślny'}
						</Button>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
