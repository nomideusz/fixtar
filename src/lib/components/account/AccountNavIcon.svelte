<script lang="ts">
	import { SquaresFourIcon, ShoppingBagIcon, MapPinIcon, HeartIcon, GearIcon } from 'phosphor-svelte';

	interface Props {
		icon: string;
		class?: string;
	}

	let { icon, class: className = 'h-5 w-5' }: Props = $props();
</script>

{#if icon === 'overview'}
	<SquaresFourIcon class={className} size={20} aria-hidden="true" />
{:else if icon === 'orders'}
	<ShoppingBagIcon class={className} size={20} aria-hidden="true" />
{:else if icon === 'addresses'}
	<MapPinIcon class={className} size={20} aria-hidden="true" />
{:else if icon === 'favorites'}
	<HeartIcon class={className} size={20} aria-hidden="true" />
{:else if icon === 'settings'}
	<GearIcon class={className} size={20} aria-hidden="true" />
{/if}
