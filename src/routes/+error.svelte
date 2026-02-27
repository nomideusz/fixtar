<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Simple error handling without complex language context
	let showDecorations = $state(false);

	onMount(() => {
		setTimeout(() => {
			showDecorations = true;
		}, 100);
	});

	// Popular categories - simple array
	const popularCategories = [
		{ id: 'chainsaws', name: 'Pilarki łańcuchowe', icon: '🪚' },
		{ id: 'drills', name: 'Wiertarki i wkrętarki', icon: '🔩' },
		{ id: 'grinders', name: 'Szlifierki', icon: '⚙️' },
		{ id: 'garden-tools', name: 'Narzędzia ogrodowe', icon: '🌿' },
		{ id: 'welding', name: 'Spawarki', icon: '🔥' }
	];

	// Handle search
	let searchQuery = $state('');
	function handleSearch() {
		if (!browser) return;
		if (searchQuery) {
			window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
		}
	}
</script>

<svelte:head>
	<title>Page Not Found - FixTar</title>
	<meta name="description" content="The page you're looking for doesn't exist" />
</svelte:head>

<div class="relative mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Decorative elements -->
	{#if browser && showDecorations}
		<div
			class="bg-brand-600/10 absolute top-1/3 right-0 -z-10 h-72 w-72 rounded-full opacity-70 blur-3xl filter transition-opacity duration-1000 ease-out"
		></div>
		<div
			class="bg-accent-600/10 absolute top-2/3 left-1/4 -z-10 h-64 w-64 rounded-full opacity-70 blur-3xl filter transition-opacity delay-300 duration-1000 ease-out"
		></div>
		<div
			class="bg-accent-600/10 absolute right-1/4 bottom-1/3 -z-10 h-80 w-80 rounded-full opacity-70 blur-3xl filter transition-opacity delay-700 duration-1000 ease-out"
		></div>
	{/if}

	<div class="mb-12 text-center">
		<div
			class="bg-brand-100 text-brand-800 mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium"
		>
			Error {$page.status || 404}
		</div>

		<h1
			class="from-brand-600 to-accent-600 mb-4 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl"
		>
			Page Not Found
		</h1>

		<p class="mx-auto mb-8 max-w-3xl text-xl text-neutral-400">
			The page you're looking for doesn't exist or has been moved.
		</p>

		<p class="mb-10 text-lg text-neutral-500 italic">Don't worry, let's get you back on track!</p>

		<div class="mb-12 flex flex-wrap justify-center gap-4">
			<a href="/" class="btn-primary px-6 py-3 text-lg"> Back to Home </a>
			<a href="/contact" class="btn-secondary px-6 py-3 text-lg"> Contact Support </a>
		</div>
	</div>

	<!-- Help section -->
	<div class="mx-auto max-w-3xl">
		<div class="card mb-10">
			<div class="mb-4 flex items-center gap-3">
				<h2 class="text-xl font-bold text-white">Here are some suggestions:</h2>
			</div>

			<!-- Popular categories -->
			<div class="mb-6">
				<h3 class="mb-3 text-lg font-medium text-neutral-200">Popular Categories</h3>

				<div class="flex flex-wrap gap-2">
					{#each popularCategories as category (category)}
						<a
							href="/products?category={category.id}"
							class="bg-brand-100 text-brand-800 hover:bg-brand-200 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors"
						>
							<span class="text-xl">{category.icon}</span>
							{category.name}
						</a>
					{/each}
				</div>
			</div>

			<!-- Search -->
			<div>
				<h3 class="mb-3 text-lg font-medium text-neutral-200">Search our site</h3>

				<div class="flex gap-2">
					<input
						type="text"
						placeholder="pilarka, wiertarka, szlifierka..."
						bind:value={searchQuery}
						class="input flex-1"
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button type="button" class="btn-primary" onclick={handleSearch}> Search </button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom animations */
	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-15px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	@keyframes float-reverse {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(15px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	@keyframes float-slow {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	/* Removed unused animations */
</style>
