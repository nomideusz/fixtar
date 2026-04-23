<script lang="ts">
	let { data } = $props();

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

	// Tag → icon mapping (SVG tool icons)
	const tagIcons: Record<string, string> = {
		Poradnik:
			'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
		Konserwacja:
			'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83',
		Porównanie:
			'M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z',
		Bezpieczeństwo: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
	};
</script>

<svelte:head>
	<title>Blog — FixTar</title>
	<meta
		name="description"
		content="Porady, recenzje i aktualności ze świata elektronarzędzi. Blog FixTar."
	/>
</svelte:head>

<div class="ft-container ft-section">
	<div class="blog">
		<div class="blog-header">
			<h4 class="ft-label">Blog</h4>
			<h1 class="blog-title">Poradnik narzędziowy</h1>
			<p class="blog-lead">
				Praktyczne porady, recenzje sprzętu i nowości ze świata profesjonalnych elektronarzędzi.
			</p>
		</div>

		<div class="posts-grid ft-stagger">
			{#each data.posts as post}
				<a href="/blog/{post.slug}" class="post-card">
					<div class="post-img">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d={tagIcons[post.tag] || tagIcons['Poradnik']} />
						</svg>
					</div>
					<div class="post-meta">
						<time datetime={toISO(post.publishAt)}>{formatDate(post.publishAt)}</time>
						<span class="post-tag">{post.tag}</span>
					</div>
					<h2 class="post-title">{post.title}</h2>
					<p class="post-excerpt">{post.description}</p>
				</a>
			{/each}
		</div>

		{#if data.posts.length === 0}
			<p class="empty-state">Brak artykułów. Wróć wkrótce!</p>
		{/if}
	</div>
</div>

<style>
	.blog {
		max-width: 800px;
	}

	.blog-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		margin-top: 6px;
	}

	.blog-lead {
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--ft-text);
		margin-top: 12px;
		max-width: 560px;
	}

	/* ── Posts grid ── */
	.posts-grid {
		margin-top: clamp(32px, 5vh, 48px);
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	@media (min-width: 640px) {
		.posts-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* ── Post card ── */
	.post-card {
		display: block;
		text-decoration: none;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--ft-surface);
		transition:
			transform 0.2s var(--ease-out),
			border-color 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-2px);
		border-color: var(--ft-accent);
	}

	.post-img {
		aspect-ratio: 16 / 9;
		background: var(--ft-frost);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-text-faint);
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 16px 20px 0;
	}

	.post-meta time {
		font-size: 0.72rem;
		color: var(--ft-text-faint);
	}

	.post-tag {
		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-accent-text);
		background: var(--ft-frost);
		padding: 2px 8px;
		border-radius: 2px;
	}

	.post-title {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		padding: 8px 20px 0;
		line-height: 1.4;
	}

	.post-excerpt {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		padding: 6px 20px 20px;
	}

	.empty-state {
		margin-top: 48px;
		font-size: 0.9rem;
		color: var(--ft-text-muted);
	}
</style>
