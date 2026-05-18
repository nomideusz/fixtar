<script lang="ts">
	import { StarIcon } from 'phosphor-svelte';

	const testimonials = [
		{
			name: 'Marek K.',
			role: 'Elektryk',
			text: 'Zamówiłem szlifierkę Bavaria — świetna jakość w rozsądnej cenie. Dostawa następnego dnia, paczka solidnie zabezpieczona.',
			rating: 5,
			initials: 'MK',
			bg: 'var(--ft-cyan-050)',
			color: 'var(--ft-cyan-700)'
		},
		{
			name: 'Anna W.',
			role: 'Właścicielka warsztatu',
			text: 'Korzystam z FixTar od roku. Konkurencyjne ceny, szybka wysyłka i <strong>profesjonalna obsługa klienta</strong>. Polecam każdemu rzemieślnikowi.',
			rating: 5,
			initials: 'AW',
			bg: 'var(--ft-orange-050)',
			color: 'var(--ft-orange-700)'
		},
		{
			name: 'Tomasz P.',
			role: 'Majsterkowicz',
			text: 'Wiertarka Eurotec, którą kupiłem, działa bez zarzutu od 6 miesięcy. Gwarancja daje spokój ducha. Na pewno wrócę po więcej.',
			rating: 5,
			initials: 'TP',
			bg: 'var(--ft-ink-100)',
			color: 'var(--ft-ink-700)'
		}
	];
</script>

<section class="testimonials ft-section" aria-label="Opinie klientów">
	<div class="ft-container">
		<div class="section-head">
			<div>
				<p class="ft-eyebrow head-eyebrow">Opinie klientów</p>
				<h2>
					Zaufali nam tysiące <span class="accent">profesjonalistów</span>
				</h2>
			</div>
		</div>

		<div class="tests ft-stagger">
			{#each testimonials as t (t.name)}
				<article class="test">
					<span class="test-stars" aria-label="Ocena {t.rating} z 5">
						{#each Array(5) as _, i (i)}
							<StarIcon size={16} weight="fill" />
						{/each}
					</span>

					<blockquote class="test-quote">{@html t.text}</blockquote>

					<footer class="test-user">
						<span class="avatar" style="background: {t.bg}; color: {t.color};" aria-hidden="true">
							{t.initials}
						</span>
						<span class="who">
							<span class="name">{t.name}</span>
							<span class="role">{t.role}</span>
						</span>
					</footer>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.testimonials {
		background: var(--ft-frost);
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 28px;
		gap: 24px;
		flex-wrap: wrap;
	}

	.head-eyebrow {
		margin: 0 0 8px;
	}

	.section-head h2 {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(30px, 3.2vw, 40px);
		letter-spacing: -0.005em;
		text-transform: uppercase;
		margin: 0;
		line-height: 1;
		max-width: 22ch;
	}

	.section-head h2 .accent {
		color: var(--ft-cyan);
	}

	.tests {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}

	.test {
		background: #fff;
		border-radius: var(--radius-lg);
		padding: 28px;
		border: 1px solid var(--ft-line-2);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.test-stars {
		display: inline-flex;
		gap: 2px;
		color: var(--ft-warning);
	}

	.test-quote {
		margin: 0;
		font-size: 14px;
		color: var(--ft-text-muted);
		font-family: var(--font-sans);
		line-height: 1.55;
		font-style: normal;
	}

	.test-quote :global(strong) {
		color: var(--ft-text);
		font-weight: 600;
	}

	.test-user {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: auto;
		padding-top: 14px;
		border-top: 1px solid var(--ft-line-2);
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 14px;
		flex-shrink: 0;
	}

	.who {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 700;
		color: var(--ft-text);
	}

	.role {
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--ft-text-faint);
	}

	@media (max-width: 900px) {
		.tests {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}
</style>
