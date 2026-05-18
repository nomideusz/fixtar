<script lang="ts">
	interface Person {
		initials: string;
		bg?: string;
		color?: string;
	}

	interface Props {
		people: Person[];
		max?: number;
		size?: 'sm' | 'md' | 'lg';
	}

	let { people, max = 4, size = 'md' }: Props = $props();

	const visible = $derived(people.slice(0, max));
	const overflow = $derived(Math.max(0, people.length - max));
</script>

<div class="group group-{size}">
	{#each visible as p, i (i)}
		<div
			class="avatar"
			style="background: {p.bg ?? 'var(--ft-ink-200)'}; color: {p.color ?? 'var(--ft-ink-700)'};"
		>
			{p.initials}
		</div>
	{/each}
	{#if overflow > 0}
		<div class="avatar more">+{overflow}</div>
	{/if}
</div>

<style>
	.group {
		display: inline-flex;
		align-items: center;
	}

	.avatar {
		border-radius: 999px;
		display: grid;
		place-items: center;
		font-family: var(--font-sans);
		font-weight: 600;
		border: 2px solid #fff;
		margin-left: -10px;
		flex-shrink: 0;
	}

	.avatar:first-child {
		margin-left: 0;
	}

	.avatar.more {
		font-family: var(--font-mono);
		font-weight: 500;
		background: var(--ft-ink-100);
		color: var(--ft-ink-700);
	}

	.group-sm .avatar {
		width: 28px;
		height: 28px;
		font-size: 11px;
	}

	.group-md .avatar {
		width: 40px;
		height: 40px;
		font-size: 13px;
	}

	.group-lg .avatar {
		width: 56px;
		height: 56px;
		font-size: 16px;
	}
</style>
