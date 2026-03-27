<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { CaretLeftIcon } from 'phosphor-svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';

	const { form } = $props<{ form?: ActionData }>();

	let isSubmitting = $state(false);

	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Adres dodany pomyślnie');
			goto('/account/addresses');
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>Dodaj nowy adres - FixTar</title>
	<meta name="description" content="Dodaj nowy adres dostawy" />
</svelte:head>

<div>
	<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
		<Button href="/account/addresses" variant="ghost" size="sm">
			<CaretLeftIcon class="mr-2 h-4 w-4" aria-hidden="true" />
			Powrót
		</Button>
		<h1 class="text-xl font-bold text-[--ft-text] sm:text-2xl">Dodaj nowy adres</h1>
	</div>

	<div class="max-w-2xl">
		<Card>
			<form
				method="POST"
				action="?/addAddress"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<div class="space-y-6">
					<div>
						<label for="type" class="mb-2 block text-sm font-medium text-[--ft-text]">
							Typ adresu
						</label>
						<select
							id="type"
							name="type"
							required
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
							class="text-[--ft-accent] focus:ring-[--ft-accent] h-4 w-4 rounded border-[--ft-line]"
						/>
						<label for="default" class="ml-2 block text-sm text-[--ft-text]">
							Ustaw jako adres domyślny
						</label>
					</div>
				</div>

				<div class="mt-6 flex flex-col gap-3 border-t border-[--ft-line] pt-6 sm:flex-row">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Dodawanie adresu...' : 'Dodaj adres'}
					</Button>
					<Button type="button" variant="secondary" href="/account/addresses">Anuluj</Button>
				</div>
			</form>
		</Card>
	</div>
</div>
