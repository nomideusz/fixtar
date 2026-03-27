<script lang="ts">
	import { CaretDownIcon } from 'phosphor-svelte';

	interface Props {
		label: string;
		field: string;
		currentField: string;
		currentOrder: string;
		onSort: (field: string) => void;
	}

	let { label, field, currentField, currentOrder, onSort }: Props = $props();

	const isActive = $derived(currentField === field);
</script>

<button onclick={() => onSort(field)} class="hover:text-[--ft-accent] flex items-center">
	{label}
	{#if isActive}
		<CaretDownIcon class="ml-1 h-4 w-4 {currentOrder === 'asc' ? 'rotate-180' : ''}" aria-hidden="true" />
	{/if}
</button>
