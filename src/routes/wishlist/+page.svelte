<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { HeartIcon } from 'phosphor-svelte';
</script>

<svelte:head>
	<title>Lista Życzeń - FixTar</title>
	<meta name="description" content="Twoja lista życzeń w FixTar" />
</svelte:head>

<div class="ft-container ft-section">
	<h1 class="mb-6 text-2xl font-bold text-[--ft-text] sm:mb-8 sm:text-3xl">Lista Życzeń</h1>

	<div class="py-8 text-center sm:py-16">
		<HeartIcon class="mx-auto h-16 w-16 text-[--ft-text-muted] sm:h-24 sm:w-24" weight="thin" aria-hidden="true" />
		<h2 class="mt-4 text-xl font-semibold text-[--ft-text]">Twoja lista jest pusta</h2>
		<p class="mt-2 text-[--ft-text-muted]">Dodaj produkty do listy życzeń, aby śledzić swoje ulubione narzędzia</p>
		<Button href="/products" class="mt-6">Przeglądaj Produkty</Button>
	</div>
</div>
