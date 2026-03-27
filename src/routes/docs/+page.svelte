<script lang="ts">
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	let lang = $state<'pl' | 'uk'>('uk');
	const content = $derived(lang === 'pl' ? data.guidePl : data.guideUk);
</script>

<svelte:head>
	<title>Dokumentacja — FixTar</title>
</svelte:head>

<div class="ft-container docs-page">
	<div class="docs-header">
		<h1 class="docs-title">Dokumentacja</h1>
		<div class="lang-switch">
			<button class="lang-btn" class:active={lang === 'uk'} onclick={() => (lang = 'uk')}>Українська</button>
			<button class="lang-btn" class:active={lang === 'pl'} onclick={() => (lang = 'pl')}>Polski</button>
		</div>
	</div>

	<div class="docs-body">
		{@html content}
	</div>
</div>

<style>
	.docs-page {
		padding-top: clamp(24px, 3vh, 40px);
		padding-bottom: clamp(48px, 6vh, 80px);
		max-width: 800px;
	}

	.docs-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: clamp(24px, 3vh, 32px);
		flex-wrap: wrap;
		gap: 12px;
	}

	.docs-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
	}

	.lang-switch {
		display: flex;
		gap: 4px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.lang-btn {
		padding: 6px 14px;
		font-size: 0.78rem;
		font-weight: 600;
		border: none;
		background: var(--ft-surface);
		color: var(--ft-text-muted);
		cursor: pointer;
		transition: background-color 0.15s, color 0.15s;
	}

	.lang-btn.active {
		background: var(--ft-dark);
		color: white;
	}

	.lang-btn:not(.active):hover {
		background: var(--ft-frost);
		color: var(--ft-dark);
	}

	/* ── Markdown content ── */
	.docs-body :global(h1) {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--ft-dark);
		margin: 32px 0 16px;
		letter-spacing: -0.02em;
	}

	.docs-body :global(h1:first-child) {
		display: none; /* Title is in the page header */
	}

	.docs-body :global(h2) {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin: 28px 0 12px;
		padding-top: 20px;
		border-top: 1px solid var(--ft-line);
	}

	.docs-body :global(h3) {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin: 20px 0 8px;
	}

	.docs-body :global(h4) {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ft-dark);
		margin: 16px 0 6px;
	}

	.docs-body :global(p) {
		font-size: 0.88rem;
		line-height: 1.7;
		color: var(--ft-text);
		margin-bottom: 10px;
	}

	.docs-body :global(ul),
	.docs-body :global(ol) {
		font-size: 0.88rem;
		line-height: 1.7;
		color: var(--ft-text);
		padding-left: 20px;
		margin-bottom: 10px;
	}

	.docs-body :global(li) {
		margin-bottom: 4px;
	}

	.docs-body :global(strong) {
		font-weight: 700;
		color: var(--ft-dark);
	}

	.docs-body :global(code) {
		font-family: monospace;
		font-size: 0.82rem;
		background: var(--ft-frost);
		padding: 1px 5px;
		border-radius: 3px;
		color: var(--ft-dark);
	}

	.docs-body :global(pre) {
		background: var(--ft-frost);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		padding: 16px;
		margin: 12px 0;
		overflow-x: auto;
	}

	.docs-body :global(pre code) {
		background: none;
		padding: 0;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.docs-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
		margin: 12px 0;
	}

	.docs-body :global(th) {
		text-align: left;
		font-weight: 700;
		color: var(--ft-dark);
		padding: 8px 12px;
		border-bottom: 2px solid var(--ft-line);
		background: var(--ft-frost);
	}

	.docs-body :global(td) {
		padding: 8px 12px;
		border-bottom: 1px solid var(--ft-line);
		color: var(--ft-text);
	}

	.docs-body :global(a) {
		color: var(--ft-accent);
		text-decoration: none;
	}

	.docs-body :global(a:hover) {
		text-decoration: underline;
	}
</style>
