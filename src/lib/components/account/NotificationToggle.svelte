<script lang="ts">
	import Switch from '$lib/components/ui/Switch.svelte';

	interface Props {
		name: string;
		checked: boolean;
		title: string;
		description: string;
	}

	let { name, checked = $bindable(), title, description }: Props = $props();
</script>

<label class="toggle-row">
	<div class="text">
		<div class="title">{title}</div>
		<div class="desc">{description}</div>
	</div>
	<Switch bind:checked {name} />
</label>

<style>
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 0;
		cursor: pointer;
		min-width: 0;
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	.title {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		color: var(--ft-ink-900);
		line-height: 1.4;
	}

	.desc {
		font-size: 13px;
		color: var(--ft-ink-500);
		line-height: 1.4;
		margin-top: 2px;
	}
</style>
