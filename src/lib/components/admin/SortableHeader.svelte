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

<button
	onclick={() => onSort(field)}
	class="flex items-center gap-1 text-[--ft-text-muted] transition-colors duration-150 hover:text-[--ft-text]"
>
	<span>{label}</span>
	{#if isActive}
		<CaretDownIcon
			class="h-4 w-4 text-[--ft-accent] {currentOrder === 'asc' ? 'rotate-180' : ''}"
			aria-hidden="true"
		/>
	{/if}
</button>
