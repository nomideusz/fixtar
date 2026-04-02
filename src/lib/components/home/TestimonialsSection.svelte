<script lang="ts">
	import { StarIcon } from 'phosphor-svelte';
	// TODO: Import your avatar images here once you place them in the project
	// import avatar1 from '$lib/images/avatars/avatar1.jpg';
	// import avatar2 from '$lib/images/avatars/avatar2.jpg';
	// import avatar3 from '$lib/images/avatars/avatar3.jpg';

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
			rating: 5,
			// avatar: avatar1
			avatar: null // Replace with imported avatar
		},
		{
			name: 'Anna W.',
			role: 'Właścicielka warsztatu',
			text: 'Korzystam z FixTar od roku. Konkurencyjne ceny, szybka wysyłka i profesjonalna obsługa klienta. Polecam każdemu rzemieślnikowi.',
			rating: 5,
			// avatar: avatar2
			avatar: null // Replace with imported avatar
		},
		{
			name: 'Tomasz P.',
			role: 'Majsterkowicz',
			text: 'Wiertarka Eurotec, którą kupiłem, działa bez zarzutu od 6 miesięcy. Gwarancja daje spokój ducha. Na pewno wrócę po więcej.',
			rating: 5,
			// avatar: avatar3
			avatar: null // Replace with imported avatar
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
							<span style="color: {s < t.rating ? 'var(--ft-cta)' : 'var(--ft-line)'}">
								<StarIcon size={14} weight="fill" aria-hidden="true" />
							</span>
						{/each}
					</div>

					<blockquote class="testimonial-text">
						"{t.text}"
					</blockquote>

					<div class="testimonial-author">
						<div class="author-avatar" aria-hidden="true">
							{#if t.avatar}
								<img src={t.avatar} alt="" class="avatar-img" width="40" height="40" loading="lazy" />
							{:else}
								{t.name.charAt(0)}
							{/if}
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
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 800;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.stat-label {
		display: block;
		font-size: 0.72rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-text-muted);
		margin-top: 8px;
		font-weight: 600;
	}

	/* ── Header ── */
	.testimonials-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.testimonials-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 800;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		margin-top: 8px;
		text-transform: uppercase;
		line-height: 1.1;
	}

	/* ── Grid ── */
	.testimonials-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 16px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		margin: 0 calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px)) 16px;
	}

	.testimonials-grid::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 640px) {
		.testimonials-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			margin: 0;
			padding: 0;
			overflow: visible;
		}

		.testimonial-card {
			flex: auto;
		}
	}

	@media (min-width: 1024px) {
		.testimonials-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ── Card ── */
	.testimonial-card {
		flex: 0 0 85%;
		scroll-snap-align: center;
		padding: clamp(24px, 4vw, 32px);
		animation: ft-fade-up 0.4s var(--ease-out) both;
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		border-radius: var(--radius-sm);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.testimonial-card:hover {
		border-color: var(--ft-dark);
	}

	.stars {
		display: flex;
		gap: 2px;
		margin-bottom: 14px;
	}

	.testimonial-text {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--ft-text-strong);
		margin-bottom: 24px;
		font-style: normal;
		font-weight: 500;
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.author-avatar {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-sm);
		background: var(--ft-text-strong);
		color: var(--ft-surface);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.author-name {
		display: block;
		font-size: 0.85rem;
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--ft-text-strong);
		text-transform: uppercase;
	}

	.author-role {
		display: block;
		font-size: 0.7rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-text-muted);
	}
</style>
