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
					{#each FOOTER_SHOP as link (link.href)}
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
					{#each FOOTER_LEGAL as link (link.href)}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>

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
		margin-top: auto;
		border-top: 1px solid var(--ft-line);
		background: var(--ft-surface);
	}

	.footer-inner {
		max-width: var(--ft-container);
		margin-inline: auto;
		padding: clamp(40px, 5vh, 56px) var(--ft-gutter);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
	}

	@media (min-width: 768px) {
		.footer-grid {
			grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 1fr));
			gap: 40px;
		}
	}

	.footer-brand-col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footer-brand {
		display: inline-block;
		font-family: var(--font-sans);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: -0.02em;
		color: var(--ft-text-strong);
		text-decoration: none;
	}

	.footer-brand:hover {
		color: var(--ft-accent-text);
	}

	.footer-desc {
		max-width: 28ch;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
	}

	.footer-social {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 4px;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		color: var(--ft-text-muted);
		transition:
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.social-link:hover {
		border-color: var(--ft-dark);
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footer-col-title {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-text-muted);
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.footer-nav a {
		font-size: 0.9375rem;
		color: var(--ft-text);
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.footer-nav a:hover {
		color: var(--ft-accent-text);
	}

	.footer-bottom {
		border-top: 1px solid var(--ft-line);
	}

	.footer-bottom-inner {
		max-width: var(--ft-container);
		margin-inline: auto;
		padding: 16px var(--ft-gutter);
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
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		color: var(--ft-text-faint);
	}

	.footer-payments {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px;
	}

	.pay-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 32px;
		color: var(--ft-text-muted);
	}

	.pay-text-logo {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--ft-text-muted);
	}
</style>
