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
		return data.categories.filter(
			(category) =>
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
		if (name.includes('pilark') || name.includes('chainsaw') || name.includes('piła')) return '🪚';
		if (name.includes('wiertark') || name.includes('wkrętar') || name.includes('drill')) return '🔩';
		if (name.includes('szlifierk') || name.includes('grinder')) return '⚙️';
		if (name.includes('spawark') || name.includes('weld')) return '🔥';
		if (name.includes('ogrodn') || name.includes('garden')) return '🌿';
		if (name.includes('kompresor') || name.includes('compressor')) return '💨';
		if (name.includes('pomiar') || name.includes('measur')) return '📏';
		return '🔧';
	}
</script>

<svelte:head>
	<title>Categories - FixTar</title>
	<meta name="description" content="Browse our wide range of product categories at FixTar" />
</svelte:head>

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<!-- Header -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-white">Product Categories</h1>
		<p class="mx-auto max-w-2xl text-xl text-neutral-400">
			Explore our wide range of products organized by category
		</p>
	</div>

	<!-- Search Bar -->
	<div class="mx-auto mb-8 max-w-md">
		<div class="relative">
			<Input
				type="search"
				placeholder="Search categories..."
				value={searchQuery}
				oninput={(e) => (searchQuery = e.currentTarget.value)}
				class="pr-10 pl-10"
			/>
			<div class="absolute inset-y-0 left-0 flex items-center pl-3">
				<svg class="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			{#if searchQuery}
				<button
					onclick={clearSearch}
					class="absolute inset-y-0 right-0 flex items-center pr-3"
					aria-label="Clear search"
				>
					<svg
						class="h-5 w-5 text-neutral-400 hover:text-neutral-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>

	{#if data.error}
		<Card class="p-8 text-center">
			<div class="text-danger mb-4">
				<svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-medium text-white">Error Loading Categories</h3>
			<p class="mb-4 text-neutral-400">{data.error}</p>
			<Button onclick={() => window.location.reload()}>Try Again</Button>
		</Card>
	{:else if filteredCategories.length === 0}
		<Card class="p-12 text-center">
			<div class="mb-4 text-neutral-400">
				<svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-medium text-white">
				{searchQuery ? 'No categories found' : 'No categories available'}
			</h3>
			<p class="mb-6 text-neutral-400">
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
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredCategories as category (category)}
				<Card
					class="group transform cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<button onclick={() => viewCategory(category)} class="w-full text-left">
						<!-- Category Image -->
						<div class="relative mb-4 h-48 overflow-hidden bg-white/10">
							{#if category.image}
								<img
									src={category.image}
									alt={category.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							{:else}
								<div
									class="from-brand-500/10 to-accent-500/100/20 flex h-full w-full items-center justify-center bg-linear-to-br"
								>
									<span class="text-6xl">{getCategoryIcon(category.name)}</span>
								</div>
							{/if}

							<!-- Featured Badge -->
							{#if category.featured}
								<div class="absolute top-3 left-3">
									<span
										class="bg-warning rounded-full px-2 py-1 text-xs font-medium text-white"
									>
										Featured
									</span>
								</div>
							{/if}

							<!-- Product Count -->
							<div class="absolute right-3 bottom-3">
								<span
									class="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-neutral-300 backdrop-blur-sm"
								>
									{category.productCount} product{category.productCount !== 1 ? 's' : ''}
								</span>
							</div>
						</div>

						<!-- Category Info -->
						<div class="p-4">
							<h3
								class="group-hover:text-brand-600 mb-2 text-xl font-semibold text-white transition-colors"
							>
								{category.name}
							</h3>
							{#if category.description}
								<p class="line-clamp-2 text-sm text-neutral-400">
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
				<p class="text-neutral-400">
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
