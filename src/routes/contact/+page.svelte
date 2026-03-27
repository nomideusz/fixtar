<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { notifications } from '$lib/stores';
	import { MapPinIcon, EnvelopeIcon, SpinnerGapIcon, PaperPlaneTiltIcon } from 'phosphor-svelte';

	let formData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let sending = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		sending = true;

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			notifications.success('Wiadomość wysłana. Odpowiemy najszybciej jak to możliwe.');
			formData = { name: '', email: '', subject: '', message: '' };
		} catch {
			notifications.error('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
		} finally {
			sending = false;
		}
	}
</script>

<svelte:head>
	<title>Kontakt — FixTar</title>
	<meta name="description" content="Skontaktuj się z FixTar. Kraków, ul. Kobierzyńska 63 lok. 77." />
</svelte:head>

<div class="ft-container ft-section">
	<div class="contact">
		<div class="contact-header">
			<h4 class="ft-label">Kontakt</h4>
			<h1 class="contact-title">Napisz do nas</h1>
			<p class="contact-lead">Masz pytanie o produkt, zamówienie lub dostawę? Odpowiadamy w ciągu 24 godzin.</p>
		</div>

		<div class="contact-grid">
			<!-- Form -->
			<form onsubmit={handleSubmit} class="contact-form">
				<div class="field-row">
					<Input label="Imię i nazwisko" name="name" bind:value={formData.name} placeholder="Jan Kowalski" required disabled={sending} />
					<Input label="Email" name="email" type="email" bind:value={formData.email} placeholder="jan@example.com" required disabled={sending} />
				</div>

				<Input label="Temat" name="subject" bind:value={formData.subject} placeholder="W czym możemy pomóc?" required disabled={sending} />

				<div>
					<label for="message" class="field-label">Wiadomość</label>
					<textarea
						id="message"
						bind:value={formData.message}
						placeholder="Opisz swoje pytanie..."
						required
						disabled={sending}
						rows="5"
						class="field-textarea"
					></textarea>
				</div>

				<button type="submit" disabled={sending} class="submit-btn">
					{#if sending}
						<SpinnerGapIcon size={18} class="animate-spin" aria-hidden="true" />
						Wysyłanie...
					{:else}
						<PaperPlaneTiltIcon size={18} aria-hidden="true" />
						Wyślij wiadomość
					{/if}
				</button>
			</form>

			<!-- Info sidebar -->
			<div class="contact-info">
				<div class="info-card">
					<h3 class="info-card-title">Dane kontaktowe</h3>

					<div class="info-item">
						<MapPinIcon size={16} aria-hidden="true" />
						<div>
							<p>FIXTAR Vsevolod Tarkhanov</p>
							<p>ul. Kobierzyńska 63 lok. 77</p>
							<p>30-363 Kraków</p>
						</div>
					</div>

					<div class="info-item">
						<EnvelopeIcon size={16} aria-hidden="true" />
						<div>
							<a href="mailto:kontakt@fixtar.pl">kontakt@fixtar.pl</a>
						</div>
					</div>
				</div>

				<div class="info-card">
					<h3 class="info-card-title">Dane firmy</h3>
					<div class="company-row">
						<span class="company-label">NIP</span>
						<span>6762661281</span>
					</div>
					<div class="company-row">
						<span class="company-label">REGON</span>
						<span>527557200</span>
					</div>
				</div>

				<div class="info-card">
					<h3 class="info-card-title">FAQ</h3>
					<div class="faq-list">
						<details class="faq-item">
							<summary>Jak długo trwa dostawa?</summary>
							<p>Zamówienia realizujemy w ciągu 24h. Dostawa kurierem zajmuje 1-3 dni robocze.</p>
						</details>
						<details class="faq-item">
							<summary>Czy mogę zwrócić produkt?</summary>
							<p>Tak, masz 14 dni na zwrot bez podania przyczyny. Produkt musi być w oryginalnym stanie.</p>
						</details>
						<details class="faq-item">
							<summary>Ile kosztuje dostawa?</summary>
							<p>Darmowa dostawa od 299 zł. Poniżej tej kwoty koszt zależy od wybranej metody.</p>
						</details>
						<details class="faq-item">
							<summary>Czy wystawiacie faktury?</summary>
							<p>Tak. Podaj NIP przy składaniu zamówienia, a faktura zostanie wystawiona automatycznie.</p>
						</details>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.contact {
		max-width: 960px;
	}

	/* ── Header ── */
	.contact-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		margin-top: 6px;
	}

	.contact-lead {
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		margin-top: 8px;
		max-width: 480px;
	}

	/* ── Grid ── */
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
		margin-top: clamp(28px, 4vh, 40px);
	}

	@media (min-width: 768px) {
		.contact-grid {
			grid-template-columns: 1fr 320px;
			gap: 40px;
		}
	}

	/* ── Form ── */
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 14px;
	}

	@media (min-width: 480px) {
		.field-row { grid-template-columns: 1fr 1fr; }
	}

	.field-label {
		display: block;
		margin-bottom: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.field-textarea {
		width: 100%;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		padding: 10px 14px;
		font-size: 0.95rem;
		font-family: var(--font-sans);
		color: var(--ft-dark);
		resize: none;
		transition: border-color 0.15s;
	}

	.field-textarea:focus {
		outline: none;
		border-color: var(--ft-cta);
		box-shadow: 0 0 0 3px var(--ft-cta-light);
	}

	.field-textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		height: 48px;
		background: var(--ft-dark);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		transition: opacity 0.15s;
		margin-top: 4px;
	}

	.submit-btn:hover:not(:disabled) { opacity: 0.85; }
	.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

	/* ── Info sidebar ── */
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.info-card {
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		padding: 20px;
	}

	.info-card-title {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-dark);
		margin-bottom: 14px;
	}

	.info-item {
		display: flex;
		gap: 10px;
		margin-bottom: 12px;
		font-size: 0.85rem;
		color: var(--ft-text);
	}

	.info-item :global(svg) {
		color: var(--ft-text-faint);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.info-item a {
		color: var(--ft-accent);
		text-decoration: none;
	}

	.info-item a:hover { text-decoration: underline; }

	.info-item:last-child { margin-bottom: 0; }

	.company-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--ft-text);
		padding: 6px 0;
		border-bottom: 1px solid var(--ft-line);
	}

	.company-row:last-child { border-bottom: none; }

	.company-label {
		font-weight: 600;
		color: var(--ft-text-muted);
	}

	/* ── FAQ ── */
	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.faq-item {
		border-bottom: 1px solid var(--ft-line);
		padding: 10px 0;
	}

	.faq-item:last-child { border-bottom: none; }

	.faq-item summary {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ft-dark);
		cursor: pointer;
		list-style: none;
	}

	.faq-item summary::-webkit-details-marker { display: none; }

	.faq-item summary::before {
		content: '+ ';
		color: var(--ft-text-faint);
	}

	.faq-item[open] summary::before {
		content: '- ';
	}

	.faq-item p {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		margin-top: 6px;
		padding-left: 14px;
	}
</style>
