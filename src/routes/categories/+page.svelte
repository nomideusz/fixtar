<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Category } from '$lib/stores/products.svelte';

	interface Props {
		data: {
			categories: (Category & { productCount: number })[];
			error?: string;
		};
	}

	let { data }: Props = $props();

	// Local state for search
	let searchQuery = $state('');

	// Filtered categories based on search
	let filteredCategories = $derived.by(() => {
		if (!searchQuery.trim()) {
			return data.categories;
		}

		const query = searchQuery.toLowerCase();
		return data.categories.filter(category => 
			category.name.toLowerCase().includes(query) ||
			category.description?.toLowerCase().includes(query)
		);
	});

	// Clear search function
	function clearSearch() {
		searchQuery = '';
	}

	// Navigate to products page with category filter
	function viewCategory(category: Category) {
		goto(`/products?category=${category.id}`);
	}

	// Get category icon based on name
	function getCategoryIcon(categoryName: string): string {
		const name = categoryName.toLowerCase();
		if (name.includes('smartphone') || name.includes('phone')) return '📱';
		if (name.includes('laptop') || name.includes('computer')) return '💻';
		if (name.includes('audio') || name.includes('headphone') || name.includes('speaker')) return '🎧';
		if (name.includes('gaming') || name.includes('game')) return '🎮';
		if (name.includes('accessory') || name.includes('accessories')) return '🔌';
		if (name.includes('tablet')) return '📟';
		if (name.includes('electronic')) return '⚡';
		return '📦';
	}
</script>

<svelte:head>
	<title>Categories - FixTar</title>
	<meta name="description" content="Browse our wide range of product categories at FixTar" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="text-center mb-12">
		<h1 class="text-4xl font-bold text-neutral-900 mb-4">Product Categories</h1>
		<p class="text-xl text-neutral-600 max-w-2xl mx-auto">
			Explore our wide range of products organized by category
		</p>
	</div>

	<!-- Search Bar -->
	<div class="max-w-md mx-auto mb-8">
		<div class="relative">
			<Input
				type="search"
				placeholder="Search categories..."
				value={searchQuery}
				oninput={(e) => searchQuery = e.currentTarget.value}
				class="pl-10 pr-10"
			/>
			<div class="absolute inset-y-0 left-0 flex items-center pl-3">
				<svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			{#if searchQuery}
				<button
					onclick={clearSearch}
					class="absolute inset-y-0 right-0 flex items-center pr-3"
					aria-label="Clear search"
				>
					<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	{#if data.error}
		<Card class="p-8 text-center">
			<div class="text-danger mb-4">
				<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<h3 class="text-lg font-medium text-neutral-900 mb-2">Error Loading Categories</h3>
			<p class="text-neutral-600 mb-4">{data.error}</p>
			<Button onclick={() => window.location.reload()}>Try Again</Button>
		</Card>
	{:else if filteredCategories.length === 0}
		<Card class="p-12 text-center">
			<div class="text-neutral-400 mb-4">
				<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<h3 class="text-lg font-medium text-neutral-900 mb-2">
				{searchQuery ? 'No categories found' : 'No categories available'}
			</h3>
			<p class="text-neutral-600 mb-6">
				{#if searchQuery}
					No categories match your search for "{searchQuery}". Try different keywords.
				{:else}
					Categories will appear here once they are added to the database.
				{/if}
			</p>
			{#if searchQuery}
				<Button onclick={clearSearch} variant="secondary">Clear Search</Button>
			{:else}
				<Button href="/products">Browse All Products</Button>
			{/if}
		</Card>
	{:else}
		<!-- Categories Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredCategories as category (category)}
				<Card class="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
					<button onclick={() => viewCategory(category)} class="w-full text-left">
						<!-- Category Image -->
						<div class="relative overflow-hidden rounded-t-lg mb-4 h-48 bg-neutral-100">
							{#if category.image}
								<img 
									src={category.image} 
									alt={category.name}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									loading="lazy"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-50 to-accent-100">
									<span class="text-6xl">{getCategoryIcon(category.name)}</span>
								</div>
							{/if}
							
							<!-- Featured Badge -->
							{#if category.featured}
								<div class="absolute top-3 left-3">
									<span class="bg-warning text-neutral-900 px-2 py-1 rounded-full text-xs font-medium">
										Featured
									</span>
								</div>
							{/if}
							
							<!-- Product Count -->
							<div class="absolute bottom-3 right-3">
								<span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-700">
									{category.productCount} product{category.productCount !== 1 ? 's' : ''}
								</span>
							</div>
						</div>
						
						<!-- Category Info -->
						<div class="p-4">
							<h3 class="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">
								{category.name}
							</h3>
							{#if category.description}
								<p class="text-neutral-600 text-sm line-clamp-2">
									{category.description}
								</p>
							{/if}
						</div>
					</button>
				</Card>
			{/each}
		</div>

		<!-- Search Results Info -->
		{#if searchQuery}
			<div class="mt-8 text-center">
				<p class="text-neutral-600">
					Showing {filteredCategories.length} of {data.categories.length} categories
				</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>




