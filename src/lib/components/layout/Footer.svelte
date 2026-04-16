<script lang="ts">
	import { userStore } from '$lib/stores';
	import { FOOTER_SHOP, FOOTER_LEGAL } from '$lib/config/navigation';
	import {
		FacebookLogoIcon,
		InstagramLogoIcon,
		YoutubeLogoIcon,
		TiktokLogoIcon
	} from 'phosphor-svelte';

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-grid">
			<!-- Brand -->
			<div class="footer-brand-col">
				<a href="/" class="footer-brand">FixTar</a>
				<p class="footer-desc">Profesjonalne elektronarzędzia w konkurencyjnych cenach. Kraków.</p>
				<div class="footer-social">
					<a
						href="https://facebook.com"
						class="social-link"
						aria-label="Facebook"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FacebookLogoIcon size={24} weight="light" aria-hidden="true" />
					</a>
					<a
						href="https://instagram.com"
						class="social-link"
						aria-label="Instagram"
						target="_blank"
						rel="noopener noreferrer"
					>
						<InstagramLogoIcon size={24} weight="light" aria-hidden="true" />
					</a>
					<a
						href="https://youtube.com"
						class="social-link"
						aria-label="YouTube"
						target="_blank"
						rel="noopener noreferrer"
					>
						<YoutubeLogoIcon size={24} weight="light" aria-hidden="true" />
					</a>
					<a
						href="https://tiktok.com"
						class="social-link"
						aria-label="TikTok"
						target="_blank"
						rel="noopener noreferrer"
					>
						<TiktokLogoIcon size={24} weight="light" aria-hidden="true" />
					</a>
				</div>
			</div>

			<!-- Shop links -->
			<div class="footer-col">
				<h4 class="footer-col-title">Sklep</h4>
				<nav class="footer-nav" aria-label="Sklep">
					{#each FOOTER_SHOP as link}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
			</div>

			<!-- Account links -->
			{#if userStore.current}
				<div class="footer-col">
					<h4 class="footer-col-title">Konto</h4>
					<nav class="footer-nav" aria-label="Konto">
						<a href="/account">Moje konto</a>
						<a href="/account/orders">Zamówienia</a>
						<a href="/account/addresses">Adresy</a>
					</nav>
				</div>
			{/if}

			<!-- Legal links -->
			<div class="footer-col">
				<h4 class="footer-col-title">Informacje</h4>
				<nav class="footer-nav" aria-label="Informacje">
					{#each FOOTER_LEGAL as link}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="footer-bottom">
		<div class="footer-bottom-inner">
			<span class="footer-copy">&copy; {year} FixTar. Wszelkie prawa zastrzeżone.</span>
			<div class="footer-payments" aria-label="Metody płatności">
				<span class="pay-chip" aria-label="BLIK">
					<span class="pay-text-logo">BLIK</span>
				</span>
				<span class="pay-chip" aria-label="Visa">
					<svg width="48" height="16" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-visa" />
					</svg>
				</span>
				<span class="pay-chip" aria-label="Mastercard">
					<svg width="30" height="18" fill="currentColor" aria-hidden="true">
						<use href="/sprite.svg#icon-mastercard" />
					</svg>
				</span>
				<span class="pay-chip" aria-label="Przelew bankowy">
					<span class="pay-text-logo">Przelew</span>
				</span>
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
		grid-template-columns: 1fr 1fr;
		gap: 32px 24px;
	}

	@media (min-width: 768px) {
		.footer-grid {
			grid-template-columns: 2fr 1fr 1fr 1fr;
			gap: 48px;
		}
	}

	/* ── Brand ── */
	.footer-brand {
		display: inline-block;
		font-family: var(--font-sans);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-dark);
		text-decoration: none;
		margin-bottom: 8px;
	}

	.footer-brand:hover {
		color: var(--ft-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
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
		gap: 16px;
	}

	.social-link {
		color: var(--ft-text-muted);
		transition:
			color var(--dur-fast) ease,
			transform var(--dur-fast) ease;
	}

	.social-link:hover {
		color: var(--ft-dark);
		transform: translateY(-2px);
	}

	/* ── Columns ── */
	.footer-col-title {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0;
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
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.footer-nav a:hover {
		color: var(--ft-dark);
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
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	@media (min-width: 768px) {
		.footer-bottom-inner {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.footer-copy {
		font-size: 0.68rem;
		color: var(--ft-text-faint);
	}

	.footer-payments {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.pay-chip {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		color: var(--ft-text-muted);
	}

	.pay-text-logo {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--ft-text-muted);
	}
</style>
