<svelte:head>
	<title>Blog — FixTar</title>
	<meta name="description" content="Porady, recenzje i aktualności ze świata elektronarzędzi. Blog FixTar." />
</svelte:head>

<div class="ft-container ft-section">
	<div class="blog">
		<div class="blog-header">
			<h4 class="ft-label">Blog</h4>
			<h1 class="blog-title">Poradnik narzędziowy</h1>
			<p class="blog-lead">Praktyczne porady, recenzje sprzętu i nowości ze świata profesjonalnych elektronarzędzi.</p>
		</div>

		<div class="posts-grid">
			<a href="/blog/jak-wybrac-wiertarke-udarowa" class="post-card">
				<div class="post-img">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
						<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
					</svg>
				</div>
				<div class="post-meta">
					<time datetime="2026-03-25">25 marca 2026</time>
					<span class="post-tag">Poradnik</span>
				</div>
				<h2 class="post-title">Jak wybrać wiertarkę udarową? Kompletny poradnik</h2>
				<p class="post-excerpt">Wiertarka udarowa to jedno z najważniejszych narzędzi w warsztacie. Podpowiadamy, na co zwrócić uwagę przy zakupie — od mocy silnika po rodzaj uchwytu.</p>
			</a>
		</div>
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
		transition: transform 0.2s var(--ease-out), border-color 0.2s ease;
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
		color: var(--ft-accent);
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
</style>
