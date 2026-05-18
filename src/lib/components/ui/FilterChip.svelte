<script lang="ts">
	import { XIcon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		active?: boolean;
		removable?: boolean;
		onClick?: () => void;
		onRemove?: () => void;
		href?: string;
		children?: Snippet;
	}

	let { active = false, removable = false, onClick, onRemove, href, children }: Props = $props();

	const Tag = $derived(href ? 'a' : 'button');
</script>

<svelte:element
	this={Tag}
	class="chip"
	class:is-active={active}
	type={href ? undefined : 'button'}
	{href}
	role={href ? 'link' : 'button'}
	onclick={(e: Event) => {
		if (!href) {
			e.preventDefault();
			onClick?.();
		}
	}}
>
	{#if children}{@render children()}{/if}
	{#if removable}
		<button
			type="button"
			class="x"
			aria-label="Usuń filtr"
			onclick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				onRemove?.();
			}}
		>
			<XIcon size={12} weight="bold" aria-hidden="true" />
		</button>
	{/if}
</svelte:element>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #fff;
		border: 1px solid var(--ft-line);
		padding: 7px 12px;
		border-radius: var(--radius-full);
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 500;
		color: var(--ft-ink-700);
		cursor: pointer;
		text-decoration: none;
		transition:
			background var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.chip:hover {
		border-color: var(--ft-ink-900);
		color: var(--ft-ink-900);
	}

	.chip.is-active {
		background: var(--ft-ink-900);
		color: #fff;
		border-color: var(--ft-ink-900);
	}

	.chip.is-active:hover {
		background: var(--ft-ink-800);
	}

	.x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 0;
		color: currentColor;
		opacity: 0.6;
		padding: 0;
		margin-left: 2px;
		cursor: pointer;
		line-height: 1;
		transition: opacity var(--dur-fast) ease;
	}

	.x:hover {
		opacity: 1;
	}
</style>
