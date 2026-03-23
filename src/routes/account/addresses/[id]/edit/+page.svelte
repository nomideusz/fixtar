<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	const { data, form } = $props<{ data: PageData; form?: any }>();

	let isSubmitting = $state(false);

	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Adres zaktualizowany pomyślnie');
			goto('/account/addresses');
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});

	// Get address data from server
	let address = $derived(data.address);
</script>

<svelte:head>
	<title>Edytuj adres - FixTar</title>
	<meta name="description" content="Edytuj adres dostawy" />
</svelte:head>

<div>
	<div class="mb-6 flex items-center gap-4">
		<Button href="/account/addresses" variant="ghost" size="sm">
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Powrót do adresów
		</Button>
		<h1 class="text-2xl font-bold text-[--ft-text]">Edytuj adres</h1>
	</div>

	{#if address}
		<div class="max-w-2xl">
			<Card>
				<form
					method="POST"
					action="?/updateAddress"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
				>
					<input type="hidden" name="id" value={address.id} />

					<div class="space-y-6">
						<div>
							<label for="type" class="mb-2 block text-sm font-medium text-[--ft-text]">
								Typ adresu
							</label>
							<select
								id="type"
								name="type"
								required
								value={address.type || 'Home'}
								class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 shadow-sm focus:outline-none"
							>
								<option value="Home">Dom</option>
								<option value="Work">Praca</option>
								<option value="Other">Inny</option>
							</select>
						</div>

						<div>
							<label for="street" class="mb-2 block text-sm font-medium text-[--ft-text]">
								Ulica *
							</label>
							<input
								type="text"
								id="street"
								name="street"
								required
								value={address.street || ''}
								placeholder="ul. Przykładowa 1"
								class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 shadow-sm focus:outline-none"
							/>
						</div>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label for="city" class="mb-2 block text-sm font-medium text-[--ft-text]">
									Miasto *
								</label>
								<input
									type="text"
									id="city"
									name="city"
									required
									value={address.city || ''}
									placeholder="Warszawa"
									class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 shadow-sm focus:outline-none"
								/>
							</div>

							<div>
								<label for="postalCode" class="mb-2 block text-sm font-medium text-[--ft-text]">
									Kod pocztowy *
								</label>
								<input
									type="text"
									id="postalCode"
									name="postalCode"
									required
									value={address.postalCode || ''}
									placeholder="00-001"
									class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 shadow-sm focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<label for="country" class="mb-2 block text-sm font-medium text-[--ft-text]">
								Kraj *
							</label>
							<select
								id="country"
								name="country"
								required
								value={address.country || ''}
								class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 shadow-sm focus:outline-none"
							>
								<option value="">Wybierz kraj</option>
								<option value="Poland">Polska</option>
								<option value="Germany">Niemcy</option>
								<option value="Czech Republic">Czechy</option>
								<option value="Slovakia">Słowacja</option>
								<option value="Lithuania">Litwa</option>
								<option value="Latvia">Łotwa</option>
								<option value="Estonia">Estonia</option>
								<option value="Other">Inny</option>
							</select>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="default"
								name="default"
								value="true"
								checked={address.default === true}
								class="text-[--ft-accent] focus:ring-[--ft-accent] h-4 w-4 rounded border-[--ft-line]"
							/>
							<label for="default" class="ml-2 block text-sm text-[--ft-text]">
								Ustaw jako adres domyślny
							</label>
						</div>
					</div>

					<div class="mt-6 flex gap-3 border-t border-[--ft-line] pt-6">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
						</Button>
						<Button type="button" variant="secondary" href="/account/addresses">Anuluj</Button>
					</div>
				</form>
			</Card>
		</div>
	{:else}
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
				<h3 class="mb-2 text-lg font-medium text-[--ft-text]">Nie znaleziono adresu</h3>
				<p class="mb-6 text-[--ft-text-muted]">Adres, który próbujesz edytować, nie istnieje.</p>
				<Button href="/account/addresses">Powrót do adresów</Button>
			</div>
		</Card>
	{/if}
</div>
