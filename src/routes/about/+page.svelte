<script lang="ts">
	import sebaPhoto from '$lib/images/about/seba.webp';
	import nataPhoto from '$lib/images/about/nata.webp';
</script>

<svelte:head>
	<title>O nas — FixTar</title>
	<meta
		name="description"
		content="Poznaj zespół FixTar — sklep z profesjonalnymi elektronarzędziami."
	/>
</svelte:head>

<div class="ft-container ft-section">
	<div class="about">
		<!-- Header -->
		<div class="about-header">
			<h4 class="ft-label">O nas</h4>
			<h1 class="about-title">Narzędzia dla profesjonalistów</h1>
			<p class="about-lead">
				FixTar to sklep internetowy z elektronarzędziami, prowadzony z Krakowa przez ludzi, którzy
				sami z nich korzystają. Stawiamy na sprawdzone marki, uczciwe ceny i szybką dostawę.
			</p>
		</div>

		<!-- Team -->
		<section class="team">
			<div class="team-grid">
				<div class="team-card">
					<img
						src={sebaPhoto}
						alt="Seba"
						class="team-photo"
						width="400"
						height="400"
						loading="lazy"
					/>
					<div class="team-info">
						<h3 class="team-name">Seba</h3>
						<p class="team-role">Założyciel</p>
						<p class="team-bio">
							Odpowiada za asortyment, relacje z dostawcami i rozwój sklepu. Wieloletnie
							doświadczenie w branży narzędziowej.
						</p>
					</div>
				</div>
				<div class="team-card">
					<img
						src={nataPhoto}
						alt="Nata"
						class="team-photo"
						width="400"
						height="400"
						loading="lazy"
					/>
					<div class="team-info">
						<h3 class="team-name">Nata</h3>
						<p class="team-role">Obsługa klienta i logistyka</p>
						<p class="team-bio">
							Dba o sprawną realizację zamówień i kontakt z klientami. Jeśli masz pytanie —
							prawdopodobnie odpowie Nata.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Values -->
		<section class="values">
			<h2 class="section-title">Dlaczego FixTar</h2>
			<div class="values-grid">
				<div class="value-item">
					<h3>Sprawdzone marki</h3>
					<p>
						Sprzedajemy narzędzia marek, które znamy i którym ufamy. Każdy produkt jest testowany
						przed dodaniem do oferty.
					</p>
				</div>
				<div class="value-item">
					<h3>Uczciwe ceny</h3>
					<p>
						Bezpośrednia współpraca z producentami pozwala nam oferować konkurencyjne ceny bez
						pośredników.
					</p>
				</div>
				<div class="value-item">
					<h3>Szybka dostawa</h3>
					<p>Zamówienia realizujemy w ciągu 24 godzin. Darmowa dostawa od 299 zł.</p>
				</div>
				<div class="value-item">
					<h3>Wsparcie techniczne</h3>
					<p>
						Pomagamy dobrać narzędzie do zadania. Kontakt z nami to rozmowa z człowiekiem, nie z
						botem.
					</p>
				</div>
			</div>
		</section>

		<!-- Company info -->
		<section class="company-info">
			<h2 class="section-title">Dane firmy</h2>
			<div class="info-grid">
				<div>
					<span class="info-label">Nazwa</span>
					<span class="info-value">FIXTAR Vsevolod Tarkhanov</span>
				</div>
				<div>
					<span class="info-label">Adres</span>
					<span class="info-value">ul. Kobierzyńska 63 lok. 77, 30-363 Kraków</span>
				</div>
				<div>
					<span class="info-label">NIP</span>
					<span class="info-value">6762661281</span>
				</div>
				<div>
					<span class="info-label">REGON</span>
					<span class="info-value">527557200</span>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="about-cta">
			<p>Masz pytanie? Chcesz dobrać narzędzie?</p>
			<div class="cta-links">
				<a href="/contact">Napisz do nas</a>
				<a href="/products" class="cta-secondary">Przeglądaj produkty</a>
			</div>
		</section>
	</div>
</div>

<style>
	.about {
		max-width: 800px;
	}

	/* ── Header ── */
	.about-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		margin-top: 6px;
		line-height: 1.15;
	}

	.about-lead {
		font-size: 0.9375rem;
		line-height: 1.65;
		color: var(--ft-text-muted);
		margin-top: 12px;
		max-width: 56ch;
	}

	/* ── Team ── */
	.team {
		margin-top: clamp(32px, 5vh, 48px);
	}

	.team-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	@media (min-width: 640px) {
		.team-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.team-card {
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--ft-surface);
	}

	.team-photo {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center top;
		background: var(--ft-frost);
	}

	.team-info {
		padding: 20px;
	}

	.team-name {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.01em;
	}

	.team-role {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-accent-text);
		margin-top: 4px;
	}

	.team-bio {
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		margin-top: 8px;
	}

	/* ── Values ── */
	.values {
		margin-top: clamp(40px, 6vh, 56px);
		padding-top: clamp(32px, 4vh, 40px);
		border-top: 1px solid var(--ft-line);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		margin-bottom: 20px;
		line-height: 1.15;
	}

	.values-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	@media (min-width: 640px) {
		.values-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.value-item h3 {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--ft-text-strong);
		margin-bottom: 6px;
		letter-spacing: -0.01em;
	}

	.value-item p {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
	}

	/* ── Company info ── */
	.company-info {
		margin-top: clamp(40px, 6vh, 56px);
		padding-top: clamp(32px, 4vh, 40px);
		border-top: 1px solid var(--ft-line);
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 640px) {
		.info-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.info-label {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		color: var(--ft-text-faint);
		margin-bottom: 4px;
	}

	.info-value {
		display: block;
		font-size: 0.88rem;
		color: var(--ft-text);
	}

	/* ── CTA ── */
	.about-cta {
		margin-top: clamp(40px, 6vh, 56px);
		padding: 28px 32px;
		border-radius: var(--radius-md);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
	}

	.about-cta p {
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--ft-text);
		margin-bottom: 12px;
	}

	.cta-links {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.cta-links a {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-accent-text);
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.cta-links a:hover {
		color: var(--ft-text);
	}

	.cta-secondary {
		color: var(--ft-text-muted) !important;
	}
</style>
