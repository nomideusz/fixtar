<script lang="ts">
	interface Tab {
		id: string;
		label: string;
		count?: number;
		href?: string;
	}

	interface Props {
		tabs: Tab[];
		active: string;
		onSelect?: (id: string) => void;
	}

	let { tabs, active, onSelect }: Props = $props();
</script>

<div class="tabs" role="tablist">
	{#each tabs as tab (tab.id)}
		{@const isActive = tab.id === active}
		{#if tab.href}
			<a
				href={tab.href}
				class="tab"
				class:is-active={isActive}
				role="tab"
				aria-selected={isActive}
			>
				{tab.label}
				{#if tab.count !== undefined}
					<span class="count">{tab.count}</span>
				{/if}
			</a>
		{:else}
			<button
				type="button"
				class="tab"
				class:is-active={isActive}
				role="tab"
				aria-selected={isActive}
				onclick={() => onSelect?.(tab.id)}
			>
				{tab.label}
				{#if tab.count !== undefined}
					<span class="count">{tab.count}</span>
				{/if}
			</button>
		{/if}
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--ft-line);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs::-webkit-scrollbar {
		display: none;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 20px;
		background: transparent;
		border: 0;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		color: var(--ft-ink-500);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
		transition:
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.tab:hover {
		color: var(--ft-ink-900);
	}

	.tab.is-active {
		color: var(--ft-ink-900);
		border-bottom-color: var(--ft-cyan);
	}

	.count {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--ft-ink-400);
		background: var(--ft-frost);
		padding: 2px 6px;
		border-radius: var(--radius-full);
		font-weight: 500;
	}

	.tab.is-active .count {
		color: var(--ft-cyan-700);
		background: var(--ft-cyan-050);
	}
</style>
