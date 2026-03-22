<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Mock deals data
	const deals = [
		{
			id: 1,
			title: 'Wyprzedaż sezonowa',
			description: 'Do -50% na wybrane elektronarzędzia',
			discount: '50%',
			image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
			validUntil: '2026-08-31'
		},
		{
			id: 2,
			title: 'Kup 2 – trzeci gratis',
			description: 'Na wszystkie akcesoria i osprzęt',
			discount: 'B2G1',
			image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400',
			validUntil: '2026-07-31'
		},
		{
			id: 3,
			title: 'Oferta błyskawiczna',
			description: 'Promocja 24h na spawarki i szlifierki',
			discount: '30%',
			image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
			validUntil: '2026-06-30'
		}
	];
</script>

<svelte:head>
	<title>Promocje - FixTar</title>
	<meta name="description" content="Sprawdź nasze najnowsze promocje i oferty specjalne" />
</svelte:head>

<div class="ft-container ft-section">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-[--ft-text]">Promocje</h1>
		<p class="mt-2 text-[--ft-text-muted]">Nie przegap tych wyjątkowych okazji!</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each deals as deal (deal.id)}
			<Card class="overflow-hidden transition-shadow hover:shadow-xl">
				{#if deal.image}
					<img src={deal.image} alt={deal.title} class="h-48 w-full object-cover" width="400" height="192" />
				{/if}
				<div class="p-6">
					<div class="mb-2 flex items-start justify-between">
						<h3 class="text-xl font-semibold text-[--ft-text]">{deal.title}</h3>
						<span class="rounded-full bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] px-3 py-1 text-sm font-bold text-[--color-danger]">
							{deal.discount}
						</span>
					</div>
					<p class="mb-4 text-[--ft-text-muted]">{deal.description}</p>
					<p class="mb-4 text-sm text-[--ft-text-muted]">Ważne do: {deal.validUntil}</p>
					<Button href="/products" fullWidth>Kup teraz</Button>
				</div>
			</Card>
		{/each}
	</div>

	<div class="mt-12 rounded-lg border border-[--ft-line] bg-[--ft-frost] p-8 text-center">
		<h2 class="mb-4 text-2xl font-bold text-[--ft-text]">Ekskluzywne oferty w newsletterze</h2>
		<p class="mb-6 text-[--ft-text-muted]">
			Zapisz się do newslettera i otrzymuj ekskluzywne oferty prosto na swoją skrzynkę!
		</p>
		<div class="mx-auto flex max-w-md gap-4">
			<label for="newsletter-email" class="sr-only">Adres e-mail</label>
			<input
				id="newsletter-email"
				type="email"
				placeholder="Wpisz swój adres e-mail"
				class="input flex-1"
			/>
			<Button>Zapisz się</Button>
		</div>
	</div>
</div>
