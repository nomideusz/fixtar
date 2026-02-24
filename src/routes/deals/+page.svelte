<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	
	// Mock deals data
	const deals = [
		{
			id: 1,
			title: 'Summer Sale',
			description: 'Up to 50% off on selected items',
			discount: '50%',
			image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
			validUntil: '2024-08-31'
		},
		{
			id: 2,
			title: 'Buy 2 Get 1 Free',
			description: 'On all accessories',
			discount: 'B2G1',
			image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
			validUntil: '2024-07-31'
		},
		{
			id: 3,
			title: 'Flash Deal',
			description: '24-hour special on electronics',
			discount: '30%',
			image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
			validUntil: '2024-06-30'
		}
	];
</script>

<svelte:head>
	<title>Deals - FixTar</title>
	<meta name="description" content="Check out our latest deals and special offers" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Special Deals</h1>
		<p class="mt-2 text-neutral-600">Don't miss out on these amazing offers!</p>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each deals as deal (deal)}
			<Card class="overflow-hidden hover:shadow-xl transition-shadow">
				{#if deal.image}
					<img src={deal.image} alt={deal.title} class="w-full h-48 object-cover">
				{/if}
				<div class="p-6">
					<div class="flex justify-between items-start mb-2">
						<h3 class="text-xl font-semibold text-neutral-900">{deal.title}</h3>
						<span class="bg-danger/10 text-danger-dark text-sm font-bold px-3 py-1 rounded-full">
							{deal.discount}
						</span>
					</div>
					<p class="text-neutral-600 mb-4">{deal.description}</p>
					<p class="text-sm text-neutral-500 mb-4">Valid until: {deal.validUntil}</p>
					<Button href="/products" fullWidth>Shop Now</Button>
				</div>
			</Card>
		{/each}
	</div>
	
	<div class="mt-12 bg-brand-50 rounded-lg p-8 text-center">
		<h2 class="text-2xl font-bold text-neutral-900 mb-4">Newsletter Exclusive Deals</h2>
		<p class="text-neutral-600 mb-6">Subscribe to our newsletter and get exclusive deals delivered to your inbox!</p>
		<div class="max-w-md mx-auto flex gap-4">
			<input
				type="email"
				placeholder="Enter your email"
				class="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
			>
			<Button>Subscribe</Button>
		</div>
	</div>
</div>




