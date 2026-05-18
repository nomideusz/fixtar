<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { MagnifyingGlassIcon } from 'phosphor-svelte';

	interface Props {
		icon?: Component;
		title: string;
		description?: string;
		children?: Snippet;
	}

	let { icon = MagnifyingGlassIcon, title, description, children }: Props = $props();

	const Icon = $derived(icon);
</script>

<div class="empty">
	<span class="ico" aria-hidden="true">
		<Icon size={28} weight="regular" />
	</span>
	<h4 class="title">{title}</h4>
	{#if description}
		<p class="desc">{description}</p>
	{/if}
	{#if children}
		<div class="action">{@render children()}</div>
	{/if}
</div>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 48px 24px;
		gap: 16px;
		background: #fff;
		border: 1px dashed var(--ft-line);
		border-radius: var(--radius-md);
	}

	.ico {
		width: 64px;
		height: 64px;
		border-radius: 999px;
		background: var(--ft-frost);
		display: grid;
		place-items: center;
		color: var(--ft-ink-400);
	}

	.title {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 28px;
		text-transform: uppercase;
		letter-spacing: -0.005em;
		margin: 0;
		color: var(--ft-text);
		line-height: 1;
	}

	.desc {
		color: var(--ft-ink-500);
		margin: 0;
		max-width: 360px;
		font-size: 14px;
		line-height: 1.55;
	}

	.action {
		margin-top: 8px;
	}
</style>
