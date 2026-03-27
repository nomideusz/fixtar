<script lang="ts">
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
		<svg
			class="ml-1 h-4 w-4 {currentOrder === 'asc' ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	{/if}
</button>
