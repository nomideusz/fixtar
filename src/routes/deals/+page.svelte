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
	<title>Deals - FixTar</title>
	<meta name="description" content="Check out our latest deals and special offers" />
</svelte:head>

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">Special Deals</h1>
		<p class="mt-2 text-neutral-400">Don't miss out on these amazing offers!</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each deals as deal (deal)}
			<Card class="overflow-hidden transition-shadow hover:shadow-xl">
				{#if deal.image}
					<img src={deal.image} alt={deal.title} class="h-48 w-full object-cover" />
				{/if}
				<div class="p-6">
					<div class="mb-2 flex items-start justify-between">
						<h3 class="text-xl font-semibold text-white">{deal.title}</h3>
						<span class="bg-danger/10 text-danger-dark rounded-full px-3 py-1 text-sm font-bold">
							{deal.discount}
						</span>
					</div>
					<p class="mb-4 text-neutral-400">{deal.description}</p>
					<p class="mb-4 text-sm text-neutral-500">Valid until: {deal.validUntil}</p>
					<Button href="/products" fullWidth>Shop Now</Button>
				</div>
			</Card>
		{/each}
	</div>

	<div class="border-brand-600/20 mt-12 border bg-neutral-900 p-8 text-center">
		<h2 class="mb-4 text-2xl font-bold text-white">Newsletter Exclusive Deals</h2>
		<p class="mb-6 text-neutral-400">
			Subscribe to our newsletter and get exclusive deals delivered to your inbox!
		</p>
		<div class="mx-auto flex max-w-md gap-4">
			<input
				type="email"
				placeholder="Enter your email"
				class="flex-1 border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
			/>
			<Button>Subscribe</Button>
		</div>
	</div>
</div>
