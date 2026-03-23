<script lang="ts">
	const year = new Date().getFullYear();

	let email = $state('');
	let subscribed = $state(false);

	function handleNewsletterSubmit(e: Event) {
		e.preventDefault();
		if (!email.trim()) return;
		subscribed = true;
	}
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-grid">
			<!-- Brand -->
			<div class="footer-brand-col">
				<a href="/" class="footer-brand">fixtar.pl</a>
				<p class="footer-desc">
					Profesjonalne elektronarzędzia w konkurencyjnych cenach.
				</p>
				<div class="footer-social">
					<a href="https://facebook.com" class="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</a>
					<a href="https://instagram.com" class="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
						</svg>
					</a>
					<a href="https://youtube.com" class="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
						</svg>
					</a>
				</div>
			</div>

			<!-- Shop links -->
			<div class="footer-col">
				<h4 class="footer-col-title">Sklep</h4>
				<nav class="footer-nav" aria-label="Sklep">
					<a href="/products">Wszystkie produkty</a>
					<a href="/deals">Promocje</a>
					<a href="/search">Szukaj</a>
				</nav>
			</div>

			<!-- Help links -->
			<div class="footer-col">
				<h4 class="footer-col-title">Pomoc</h4>
				<nav class="footer-nav" aria-label="Pomoc">
					<a href="/contact">Kontakt</a>
					<a href="/about">O nas</a>
				</nav>
			</div>

			<!-- Newsletter -->
			<div class="footer-col">
				<h4 class="footer-col-title">Newsletter</h4>
				{#if subscribed}
					<p class="newsletter-ok">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<polyline points="20 6 9 17 4 12" />
						</svg>
						Dziękujemy za zapisanie się!
					</p>
				{:else}
					<p class="newsletter-desc">Bądź na bieżąco z nowościami i promocjami.</p>
					<form class="newsletter-form" onsubmit={handleNewsletterSubmit}>
						<label for="footer-newsletter-email" class="sr-only">Adres email</label>
						<input
							id="footer-newsletter-email"
							type="email"
							placeholder="Twój email"
							bind:value={email}
							required
							class="newsletter-input"
						/>
						<button type="submit" class="newsletter-btn" aria-label="Zapisz się">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
							</svg>
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="footer-bottom">
		<div class="footer-bottom-inner">
			<span class="footer-copy">&copy; {year} FixTar. Wszelkie prawa zastrzeżone.</span>
			<div class="footer-payments">
				<span class="pay-icon">BLIK</span>
				<span class="pay-icon">Visa</span>
				<span class="pay-icon">Mastercard</span>
				<span class="pay-icon">PayPal</span>
				<span class="pay-icon">Przelew</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--ft-line);
		margin-top: auto;
	}

	.footer-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: clamp(32px, 4vh, 48px) var(--ft-gutter);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
	}

	@media (min-width: 640px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 28px 40px;
		}
	}

	@media (min-width: 1024px) {
		.footer-grid {
			grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
			gap: 48px;
		}
	}

	/* ── Brand ── */
	.footer-brand {
		display: inline-block;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		color: var(--ft-dark);
		text-decoration: none;
		margin-bottom: 8px;
	}

	.footer-brand:hover {
		color: var(--ft-accent);
	}

	.footer-desc {
		font-size: 0.78rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		margin-bottom: 14px;
		max-width: 260px;
	}

	.footer-social {
		display: flex;
		gap: 6px;
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		color: var(--ft-text-muted);
		transition: color var(--dur-fast) ease;
	}

	.social-link:hover {
		color: var(--ft-dark);
	}

	/* ── Columns ── */
	.footer-col-title {
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.footer-nav a {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		transition: color var(--dur-fast) ease;
	}

	.footer-nav a:hover {
		color: var(--ft-dark);
	}

	/* ── Newsletter ── */
	.newsletter-desc {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
		line-height: 1.5;
		margin-bottom: 10px;
	}

	.newsletter-form {
		display: flex;
		gap: 0;
	}

	.newsletter-input {
		flex: 1;
		min-width: 0;
		padding: 9px 12px;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--ft-text);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-right: none;
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
		outline: none;
		transition: border-color var(--dur-fast) ease;
	}

	.newsletter-input:focus {
		border-color: var(--ft-accent);
	}

	.newsletter-input::placeholder {
		color: var(--ft-text-faint);
	}

	.newsletter-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		background: var(--ft-dark);
		color: white;
		border: 1px solid var(--ft-dark);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		cursor: pointer;
		transition: background var(--dur-fast) ease;
	}

	.newsletter-btn:hover {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
	}

	.newsletter-ok {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.78rem;
		color: var(--color-success);
		font-weight: 500;
	}

	/* ── Bottom bar ── */
	.footer-bottom {
		border-top: 1px solid var(--ft-line);
		padding: 14px 0;
	}

	.footer-bottom-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 10px;
	}

	.footer-copy {
		font-size: 0.68rem;
		color: var(--ft-text-faint);
	}

	.footer-payments {
		display: flex;
		gap: 6px;
	}

	.pay-icon {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: var(--ft-frost);
		padding: 3px 8px;
		border-radius: 3px;
		letter-spacing: 0.02em;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
