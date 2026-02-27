<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>Lista Życzeń - FixTar</title>
	<meta name="description" content="Twoja lista życzeń w FixTar" />
</svelte:head>

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<h1 class="mb-8 text-3xl font-bold text-white">Lista Życzeń</h1>

	<div class="py-16 text-center">
		<svg
			class="mx-auto h-24 w-24 text-neutral-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
				d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
			/>
		</svg>
		<h2 class="mt-4 text-xl font-semibold text-white">Twoja lista jest pusta</h2>
		<p class="mt-2 text-neutral-400">Dodaj produkty do listy życzeń, aby śledzić swoje ulubione narzędzia</p>
		<Button href="/products" class="mt-6">Przeglądaj Produkty</Button>
	</div>
</div>
