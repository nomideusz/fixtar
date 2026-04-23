<script lang="ts">
	import { StarIcon } from 'phosphor-svelte';
	import avatar1 from '$lib/images/avatars/avatar1.png';
	import avatar2 from '$lib/images/avatars/avatar2.png';
	import avatar3 from '$lib/images/avatars/avatar3.png';

	const testimonials = [
		{
			name: 'Marek K.',
			role: 'Elektryk',
			text: 'Zamówiłem szlifierkę Bavaria — świetna jakość w rozsądnej cenie. Dostawa następnego dnia, paczka solidnie zabezpieczona.',
			rating: 5,
			avatar: avatar1
		},
		{
			name: 'Anna W.',
			role: 'Właścicielka warsztatu',
			text: 'Korzystam z FixTar od roku. Konkurencyjne ceny, szybka wysyłka i profesjonalna obsługa klienta. Polecam każdemu rzemieślnikowi.',
			rating: 5,
			avatar: avatar2
		},
		{
			name: 'Tomasz P.',
			role: 'Majsterkowicz',
			text: 'Wiertarka Eurotec, którą kupiłem, działa bez zarzutu od 6 miesięcy. Gwarancja daje spokój ducha. Na pewno wrócę po więcej.',
			rating: 5,
			avatar: avatar3
		}
	];

	const stats = [
		{ value: '2 500+', label: 'produktów' },
		{ value: '15 000+', label: 'zamówień' },
		{ value: '4.8 / 5', label: 'ocena klientów' },
		{ value: '98%', label: 'pozytywnych opinii' }
	];
</script>

<section class="testimonials ft-section">
	<div class="ft-container">
		<div class="t-header">
			<span class="ft-label">opinie klientów</span>
			<h2 class="t-title">Zaufały nam tysiące profesjonalistów</h2>
		</div>

		<div class="t-grid ft-stagger">
			{#each testimonials as t (t.name)}
				<article class="t-card">
					<div class="t-stars" aria-label="Ocena {t.rating} z 5">
						{#each Array(5) as _, s (s)}
							<span class="t-star" class:is-filled={s < t.rating}>
								<StarIcon size={14} weight="fill" aria-hidden="true" />
							</span>
						{/each}
					</div>

					<blockquote class="t-quote">{t.text}</blockquote>

					<footer class="t-author">
						<div class="t-avatar" aria-hidden="true">
							<img
								src={t.avatar}
								alt=""
								width="40"
								height="40"
								loading="lazy"
							/>
						</div>
						<div class="t-author-meta">
							<span class="t-name">{t.name}</span>
							<span class="t-role">{t.role}</span>
						</div>
					</footer>
				</article>
			{/each}
		</div>

		<dl class="t-stats">
			{#each stats as s (s.label)}
				<div class="t-stat">
					<dt class="t-stat-value">{s.value}</dt>
					<dd class="t-stat-label">{s.label}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	.t-header {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 32px;
	}

	.t-title {
		font-family: var(--font-sans);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.15;
		max-width: 22ch;
	}

	/* ── Grid ── */
	.t-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 640px) {
		.t-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
		}
	}

	@media (min-width: 1024px) {
		.t-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ── Card ── */
	.t-card {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		transition: border-color var(--dur-fast) ease;
	}

	.t-card:hover {
		border-color: var(--ft-text-strong);
	}

	.t-stars {
		display: flex;
		gap: 2px;
	}

	.t-star {
		color: var(--ft-line);
		display: inline-flex;
	}

	.t-star.is-filled {
		color: var(--ft-text-strong);
	}

	.t-quote {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--ft-text);
		margin: 0;
	}

	.t-author {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: auto;
		padding-top: 4px;
	}

	.t-avatar {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-full);
		background: var(--ft-frost);
		overflow: hidden;
		flex-shrink: 0;
	}

	.t-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.t-author-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.t-name {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--ft-text-strong);
	}

	.t-role {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--ft-text-faint);
		letter-spacing: 0.02em;
	}

	/* ── Stats strip ── */
	.t-stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0;
		margin: clamp(32px, 5vh, 48px) 0 0;
		padding: 20px 0 0;
		border-top: 1px solid var(--ft-line);
	}

	@media (min-width: 640px) {
		.t-stats {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.t-stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 4px;
	}

	.t-stat-value {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text-strong);
		letter-spacing: 0.01em;
	}

	.t-stat-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--ft-text-faint);
		letter-spacing: 0.02em;
		text-transform: lowercase;
	}
</style>
