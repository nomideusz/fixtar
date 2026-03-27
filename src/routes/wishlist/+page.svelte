<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { HeartIcon } from 'phosphor-svelte';
</script>

<svelte:head>
	<title>Lista Życzeń - FixTar</title>
	<meta name="description" content="Twoja lista życzeń w FixTar" />
</svelte:head>

<div class="ft-container ft-section">
	<h1 class="mb-8 text-3xl font-bold text-[--ft-text]">Lista Życzeń</h1>

	<div class="py-16 text-center">
		<HeartIcon class="mx-auto h-24 w-24 text-[--ft-text-muted]" weight="thin" aria-hidden="true" />
		<h2 class="mt-4 text-xl font-semibold text-[--ft-text]">Twoja lista jest pusta</h2>
		<p class="mt-2 text-[--ft-text-muted]">Dodaj produkty do listy życzeń, aby śledzić swoje ulubione narzędzia</p>
		<Button href="/products" class="mt-6">Przeglądaj Produkty</Button>
	</div>
</div>
