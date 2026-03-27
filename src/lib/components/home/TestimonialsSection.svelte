<script lang="ts">
	const stats = [
		{ value: '2 500+', label: 'Produktów w ofercie' },
		{ value: '15 000+', label: 'Zrealizowanych zamówień' },
		{ value: '4.8/5', label: 'Ocena klientów' },
		{ value: '98%', label: 'Pozytywnych opinii' }
	];

	const testimonials = [
		{
			name: 'Marek K.',
			role: 'Elektryk',
			text: 'Zamówiłem szlifierkę Bavaria — świetna jakość w rozsądnej cenie. Dostawa następnego dnia, paczka solidnie zabezpieczona.',
			rating: 5
		},
		{
			name: 'Anna W.',
			role: 'Właścicielka warsztatu',
			text: 'Korzystam z FixTar od roku. Konkurencyjne ceny, szybka wysyłka i profesjonalna obsługa klienta. Polecam każdemu rzemieślnikowi.',
			rating: 5
		},
		{
			name: 'Tomasz P.',
			role: 'Majsterkowicz',
			text: 'Wiertarka Eurotec, którą kupiłem, działa bez zarzutu od 6 miesięcy. Gwarancja daje spokój ducha. Na pewno wrócę po więcej.',
			rating: 5
		}
	];
</script>

<section class="social-proof ft-section">
	<div class="ft-container">
		<!-- Stats strip -->
		<div class="stats-strip">
			{#each stats as stat, i}
				<div class="stat" style="animation-delay: {i * 80}ms">
					<span class="stat-value">{stat.value}</span>
					<span class="stat-label">{stat.label}</span>
				</div>
			{/each}
		</div>

		<!-- Testimonials -->
		<div class="testimonials-header">
			<h4 class="ft-label">Opinie klientów</h4>
			<h2 class="testimonials-title">Dołącz do tysięcy zadowolonych klientów</h2>
		</div>

		<div class="testimonials-grid">
			{#each testimonials as t, i}
				<div class="testimonial-card ft-card" style="animation-delay: {i * 100}ms">
					<!-- Stars -->
					<div class="stars" aria-label="Ocena {t.rating} z 5">
						{#each Array(5) as _, s}
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill={s < t.rating ? 'var(--ft-cta)' : 'none'}
								stroke={s < t.rating ? 'var(--ft-cta)' : 'var(--ft-line)'}
								stroke-width="2"
								aria-hidden="true"
							>
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
						{/each}
					</div>

					<blockquote class="testimonial-text">
						"{t.text}"
					</blockquote>

					<div class="testimonial-author">
						<div class="author-avatar" aria-hidden="true">
							{t.name.charAt(0)}
						</div>
						<div>
							<span class="author-name">{t.name}</span>
							<span class="author-role">{t.role}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ── Stats strip ── */
	.stats-strip {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin-bottom: clamp(40px, 5vh, 56px);
		padding-bottom: clamp(40px, 5vh, 56px);
		border-bottom: 1px solid var(--ft-line);
	}

	@media (min-width: 640px) {
		.stats-strip {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat {
		text-align: center;
		animation: ft-fade-up 0.4s var(--ease-out) both;
	}

	.stat-value {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		line-height: 1.2;
	}

	.stat-label {
		display: block;
		font-size: 0.72rem;
		color: var(--ft-text-muted);
		margin-top: 4px;
	}

	/* ── Header ── */
	.testimonials-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.testimonials-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 8px;
	}

	/* ── Grid ── */
	.testimonials-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	@media (min-width: 640px) {
		.testimonials-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.testimonials-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ── Card ── */
	.testimonial-card {
		padding: 24px;
		animation: ft-fade-up 0.4s var(--ease-out) both;
	}

	.stars {
		display: flex;
		gap: 2px;
		margin-bottom: 14px;
	}

	.testimonial-text {
		font-size: 0.88rem;
		line-height: 1.65;
		color: var(--ft-text);
		margin-bottom: 18px;
		font-style: normal;
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.author-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--ft-frost);
		color: var(--ft-accent);
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.author-name {
		display: block;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.author-role {
		display: block;
		font-size: 0.72rem;
		color: var(--ft-text-muted);
	}
</style>
