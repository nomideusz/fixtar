<script lang="ts">
	import { CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	interface Props {
		current: number;
		total: number;
		buildHref?: (page: number) => string;
		onChange?: (page: number) => void;
	}

	let { current, total, buildHref, onChange }: Props = $props();

	function pages(curr: number, totalPages: number): (number | 'gap')[] {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const out: (number | 'gap')[] = [1];
		const start = Math.max(2, curr - 1);
		const end = Math.min(totalPages - 1, curr + 1);
		if (start > 2) out.push('gap');
		for (let i = start; i <= end; i++) out.push(i);
		if (end < totalPages - 1) out.push('gap');
		out.push(totalPages);
		return out;
	}

	const items = $derived(pages(current, total));
	const prevDisabled = $derived(current <= 1);
	const nextDisabled = $derived(current >= total);

	function go(p: number) {
		if (p < 1 || p > total || p === current) return;
		onChange?.(p);
	}
</script>

<nav class="pager" aria-label="Stronicowanie">
	{#if buildHref}
		<a
			class="nav"
			class:is-disabled={prevDisabled}
			href={prevDisabled ? undefined : buildHref(current - 1)}
			aria-disabled={prevDisabled}
		>
			<CaretLeftIcon size={14} weight="bold" aria-hidden="true" />
			Poprz.
		</a>
	{:else}
		<button class="nav" disabled={prevDisabled} onclick={() => go(current - 1)}>
			<CaretLeftIcon size={14} weight="bold" aria-hidden="true" />
			Poprz.
		</button>
	{/if}

	{#each items as item, i (i)}
		{#if item === 'gap'}
			<span class="gap" aria-hidden="true">…</span>
		{:else if item === current}
			<span class="page is-active" aria-current="page">{item}</span>
		{:else if buildHref}
			<a class="page" href={buildHref(item)}>{item}</a>
		{:else}
			<button class="page" onclick={() => go(item)}>{item}</button>
		{/if}
	{/each}

	{#if buildHref}
		<a
			class="nav"
			class:is-disabled={nextDisabled}
			href={nextDisabled ? undefined : buildHref(current + 1)}
			aria-disabled={nextDisabled}
		>
			Nast.
			<CaretRightIcon size={14} weight="bold" aria-hidden="true" />
		</a>
	{:else}
		<button class="nav" disabled={nextDisabled} onclick={() => go(current + 1)}>
			Nast.
			<CaretRightIcon size={14} weight="bold" aria-hidden="true" />
		</button>
	{/if}
</nav>

<style>
	.pager {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}

	.page,
	.nav {
		display: inline-grid;
		grid-auto-flow: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-width: 40px;
		height: 40px;
		padding: 0 10px;
		border: 1px solid var(--ft-line);
		background: #fff;
		color: var(--ft-ink-700);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		border-radius: var(--radius-sm);
		text-decoration: none;
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			background var(--dur-fast) ease;
	}

	.page:hover:not(.is-active),
	.nav:hover:not(:disabled):not(.is-disabled) {
		border-color: var(--ft-ink-900);
		color: var(--ft-ink-900);
	}

	.page.is-active {
		background: var(--ft-ink-900);
		color: #fff;
		border-color: var(--ft-ink-900);
		cursor: default;
	}

	.nav {
		padding: 0 14px;
	}

	.nav:disabled,
	.nav.is-disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}

	.gap {
		display: inline-grid;
		place-items: center;
		min-width: 24px;
		height: 40px;
		color: var(--ft-ink-400);
		font-family: var(--font-sans);
	}
</style>
