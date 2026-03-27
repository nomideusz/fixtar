<script lang="ts">
	let { data } = $props();

	const post = $derived(data.post);

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('pl-PL', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function toISO(date: Date): string {
		return date.toISOString().slice(0, 10);
	}
</script>

<svelte:head>
	<title>{post.title} — Blog FixTar</title>
	<meta name="description" content={post.description} />
</svelte:head>

<div class="ft-container ft-section">
	<article class="article">
		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Nawigacja">
			<a href="/">Strona główna</a>
			<span aria-hidden="true">/</span>
			<a href="/blog">Blog</a>
			<span aria-hidden="true">/</span>
			<span>{post.title}</span>
		</nav>

		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<time datetime={toISO(post.publishAt)}>{formatDate(post.publishAt)}</time>
				<span class="article-tag">{post.tag}</span>
			</div>
			<h1 class="article-title">{post.title}</h1>
			<p class="article-lead">{post.description}</p>
		</header>

		<!-- Body -->
		<div class="article-body">
			{#each post.content as block}
				{#if block.startsWith('### ')}
					<h3>{block.slice(4)}</h3>
				{:else if block.startsWith('## ')}
					<h2>{block.slice(3)}</h2>
				{:else}
					<p>{@html block.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>
				{/if}
			{/each}
		</div>

		<!-- Footer CTA -->
		<div class="article-cta">
			<p>Szukasz narzędzi?</p>
			<div class="cta-links">
				<a href="/products">Przeglądaj ofertę</a>
				<a href="/contact" class="cta-secondary">Zapytaj o doradztwo</a>
			</div>
		</div>

		<div class="article-back">
			<a href="/blog">← Wróć do bloga</a>
		</div>
	</article>
</div>

<style>
	.article {
		max-width: 680px;
	}

	/* ── Breadcrumb ── */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		color: var(--ft-text-faint);
		margin-bottom: 28px;
		flex-wrap: wrap;
	}

	.breadcrumb a {
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.breadcrumb a:hover {
		color: var(--ft-accent);
	}

	/* ── Header ── */
	.article-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	.article-meta time {
		font-size: 0.72rem;
		color: var(--ft-text-faint);
	}

	.article-tag {
		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-accent);
		background: var(--ft-frost);
		padding: 2px 8px;
		border-radius: 2px;
	}

	.article-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		line-height: 1.25;
	}

	.article-lead {
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--ft-text);
		margin-top: 12px;
	}

	/* ── Body ── */
	.article-body {
		margin-top: clamp(28px, 4vh, 40px);
		padding-top: clamp(28px, 4vh, 40px);
		border-top: 1px solid var(--ft-line);
	}

	.article-body h2 {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 32px;
		margin-bottom: 12px;
	}

	.article-body h3 {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-top: 24px;
		margin-bottom: 6px;
	}

	.article-body p {
		font-size: 0.88rem;
		line-height: 1.75;
		color: var(--ft-text);
		margin-bottom: 14px;
	}

	.article-body :global(strong) {
		font-weight: 600;
		color: var(--ft-dark);
	}

	/* ── CTA ── */
	.article-cta {
		margin-top: clamp(36px, 5vh, 48px);
		padding: 28px 32px;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		border: 1px solid var(--ft-line);
	}

	.article-cta p {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.cta-links {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.cta-links a {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ft-accent);
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.cta-links a:hover {
		opacity: 0.7;
	}

	.cta-secondary {
		color: var(--ft-text-muted) !important;
	}

	/* ── Back link ── */
	.article-back {
		margin-top: 24px;
	}

	.article-back a {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.article-back a:hover {
		color: var(--ft-accent);
	}
</style>
