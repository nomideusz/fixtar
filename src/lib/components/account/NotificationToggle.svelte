<script lang="ts">
	interface Props {
		name: string;
		checked: boolean;
		title: string;
		description: string;
	}

	let { name, checked = $bindable(), title, description }: Props = $props();
</script>

<label class="flex items-center">
	<input
		type="checkbox"
		{name}
		bind:checked
		class="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-[--ft-line] bg-[--ft-frost] focus:ring-2"
	/>
	<div class="ml-3">
		<div class="font-medium text-[--ft-text]">{title}</div>
		<div class="text-sm text-[--ft-text-muted]">{description}</div>
	</div>
</label>
