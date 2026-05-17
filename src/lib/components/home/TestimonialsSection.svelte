<script lang="ts">
	import { StarIcon, CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	const testimonials = [
		{
			name: 'Marek K.',
			role: 'Elektryk',
			text: 'Zamówiłem szlifierkę Bavaria — świetna jakość w rozsądnej cenie. Dostawa następnego dnia, paczka solidnie zabezpieczona.',
			rating: 5,
			initials: 'MK',
			gradient: 'linear-gradient(135deg, #378A92 0%, #1D2228 100%)'
		},
		{
			name: 'Anna W.',
			role: 'Właścicielka warsztatu',
			text: 'Korzystam z FixTar od roku. Konkurencyjne ceny, szybka wysyłka i <strong>profesjonalna obsługa klienta</strong>. Polecam każdemu rzemieślnikowi.',
			rating: 5,
			initials: 'AW',
			gradient: 'linear-gradient(135deg, #FF8A1F, #1D2228)'
		},
		{
			name: 'Tomasz P.',
			role: 'Majsterkowicz',
			text: 'Wiertarka Eurotec, którą kupiłem, działa bez zarzutu od 6 miesięcy. Gwarancja daje spokój ducha. Na pewno wrócę po więcej.',
			rating: 5,
			initials: 'TP',
			gradient: 'linear-gradient(135deg, #378A92 0%, #1D2228 100%)'
		}
	];
</script>

<section class="testimonials ft-section" aria-label="Opinie klientów">
	<div class="ft-container">
		<div class="section-head">
			<div>
				<p class="kicker">Opinie klientów</p>
				<h2>
					Zaufali nam tysiące <span class="accent">profesjonalistów</span>
				</h2>
			</div>
			<div class="test-arrows">
				<button class="test-arrow" aria-label="Poprzednia">
					<CaretLeftIcon size={16} weight="bold" aria-hidden="true" />
				</button>
				<button class="test-arrow" aria-label="Następna">
					<CaretRightIcon size={16} weight="bold" aria-hidden="true" />
				</button>
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
						<span class="avatar" style="background: {t.gradient};" aria-hidden="true">
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

	.kicker {
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--ft-text-faint);
		font-weight: 600;
		margin: 0 0 8px;
	}

	.section-head h2 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(30px, 3.2vw, 40px);
		letter-spacing: 0.01em;
		text-transform: uppercase;
		margin: 0;
		line-height: 1;
		max-width: 22ch;
	}

	.section-head h2 .accent {
		color: var(--ft-cyan);
	}

	.test-arrows {
		display: flex;
		gap: 8px;
	}

	.test-arrow {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: #fff;
		border: 1px solid var(--ft-line);
		display: grid;
		place-items: center;
		color: var(--ft-text);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.test-arrow:hover {
		background: var(--ft-text);
		color: #fff;
		border-color: var(--ft-text);
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
		color: var(--ft-cta);
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
		color: #fff;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-weight: 700;
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
