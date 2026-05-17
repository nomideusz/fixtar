<script lang="ts">
	import { FOOTER_SHOP, FOOTER_INFO } from '$lib/config/navigation';
	import {
		FacebookLogoIcon,
		InstagramLogoIcon,
		YoutubeLogoIcon,
		TiktokLogoIcon,
		PhoneIcon,
		EnvelopeIcon,
		ChatCircleIcon,
		InfoIcon,
		ShieldCheckIcon,
		ArrowCounterClockwiseIcon,
		LockIcon,
		UsersIcon
	} from 'phosphor-svelte';
	import FixtarLogo from './FixtarLogo.svelte';

	const year = new Date().getFullYear();

	const safeItems = [
		{ icon: ShieldCheckIcon, label: '2 lata gwarancji' },
		{ icon: ArrowCounterClockwiseIcon, label: '14 dni na zwrot' },
		{ icon: LockIcon, label: 'Bezpieczne płatności' },
		{ icon: UsersIcon, label: 'Ochrona kupującego' }
	];
</script>

<footer class="footer">
	<div class="ft-container">
		<div class="footer-grid">
			<div class="footer-brand">
				<a href="/" aria-label="FIXTAR — Strona główna" class="brand-link">
					<FixtarLogo inverted />
				</a>
				<p class="footer-desc">
					Profesjonalne elektronarzędzia w konkurencyjnych cenach. Stworzone do ciężkiej pracy.
				</p>
				<div class="social">
					<a
						href="https://facebook.com"
						aria-label="Facebook"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FacebookLogoIcon size={14} weight="fill" aria-hidden="true" />
					</a>
					<a
						href="https://instagram.com"
						aria-label="Instagram"
						target="_blank"
						rel="noopener noreferrer"
					>
						<InstagramLogoIcon size={14} weight="regular" aria-hidden="true" />
					</a>
					<a
						href="https://youtube.com"
						aria-label="YouTube"
						target="_blank"
						rel="noopener noreferrer"
					>
						<YoutubeLogoIcon size={14} weight="fill" aria-hidden="true" />
					</a>
					<a
						href="https://tiktok.com"
						aria-label="TikTok"
						target="_blank"
						rel="noopener noreferrer"
					>
						<TiktokLogoIcon size={14} weight="fill" aria-hidden="true" />
					</a>
				</div>
			</div>

			<div>
				<h4>Sklep</h4>
				<ul>
					{#each FOOTER_SHOP as link (link.href + link.label)}
						<li><a href={link.href}>{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<h4>Informacje</h4>
				<ul>
					{#each FOOTER_INFO as link (link.href + link.label)}
						<li><a href={link.href}>{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<h4>Pomoc</h4>
				<div class="contact-list">
					<div class="contact-line">
						<span class="ico" aria-hidden="true">
							<PhoneIcon size={18} weight="regular" />
						</span>
						<div class="text">
							<a href="tel:+48123456789">+48 123 456 789</a>
							<small>Pon. – Pt. 8:00 – 17:00</small>
						</div>
					</div>
					<div class="contact-line">
						<span class="ico" aria-hidden="true">
							<EnvelopeIcon size={18} weight="regular" />
						</span>
						<div class="text">
							<a href="mailto:kontakt@fixtar.pl">kontakt@fixtar.pl</a>
						</div>
					</div>
					<div class="contact-line">
						<span class="ico" aria-hidden="true">
							<ChatCircleIcon size={18} weight="regular" />
						</span>
						<div class="text">Czat na żywo</div>
					</div>
					<div class="contact-line">
						<span class="ico" aria-hidden="true">
							<InfoIcon size={18} weight="regular" />
						</span>
						<div class="text"><a href="/contact">FAQ</a></div>
					</div>
				</div>
			</div>

			<div>
				<h4>Bezpieczne zakupy</h4>
				<div class="safe-list">
					{#each safeItems as item (item.label)}
						{@const Icon = item.icon}
						<div class="safe-item">
							<span class="ico" aria-hidden="true">
								<Icon size={18} weight="regular" />
							</span>
							{item.label}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<span class="copy">&copy; {year} FiXTAR. Wszelkie prawa zastrzeżone.</span>
			<div class="payments" aria-label="Metody płatności">
				<span class="pay-chip" style="color:#1A1F71;">VISA</span>
				<span class="pay-chip" style="color:#EB001B;">●●</span>
				<span class="pay-chip"
					><span style="color:#1D5DAA;">Przelewy</span><span style="color:#FF6B00;">24</span></span
				>
				<span class="pay-chip pay-chip-blik">blik</span>
			</div>
			<span class="eu-flag">
				<span class="circle" aria-hidden="true"></span>
				Made in EU
			</span>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--ft-dark);
		color: rgba(255, 255, 255, 0.7);
		padding: 64px 0 24px;
		font-size: 14px;
		margin-top: auto;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1.2fr 1.2fr;
		gap: 40px;
		padding-bottom: 48px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.brand-link {
		display: inline-flex;
		align-items: center;
	}

	.footer-desc {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
		max-width: 230px;
		margin: 14px 0 22px;
		line-height: 1.6;
	}

	.social {
		display: flex;
		gap: 8px;
	}

	.social a {
		width: 34px;
		height: 34px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.06);
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.7);
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.social a:hover {
		background: var(--ft-cyan);
		color: #fff;
	}

	.footer h4 {
		font-family: var(--font-sans);
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.5);
		margin: 0 0 18px;
	}

	.footer ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.footer ul a,
	.contact-line a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.footer ul a:hover,
	.contact-line a:hover {
		color: var(--ft-cyan);
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.contact-line {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.contact-line .ico {
		color: var(--ft-cyan);
		flex: 0 0 auto;
		margin-top: 2px;
	}

	.contact-line .text {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
		display: flex;
		flex-direction: column;
	}

	.contact-line .text small {
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
		margin-top: 2px;
	}

	.safe-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.safe-item {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
	}

	.safe-item .ico {
		color: var(--ft-cyan);
		display: inline-flex;
	}

	.footer-bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding-top: 22px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		gap: 16px;
	}

	.copy {
		font-family: var(--font-sans);
	}

	.payments {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px;
	}

	.pay-chip {
		background: rgba(255, 255, 255, 0.95);
		color: var(--ft-text);
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.04em;
		padding: 6px 10px;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		line-height: 1;
		min-height: 24px;
	}

	.pay-chip-blik {
		background: #000;
		color: #fff;
	}

	.eu-flag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: rgba(255, 255, 255, 0.5);
	}

	.eu-flag .circle {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px dashed rgba(255, 255, 255, 0.45);
	}

	@media (max-width: 1100px) {
		.footer-grid {
			grid-template-columns: 1.4fr 1fr 1fr;
			gap: 32px;
		}
	}

	@media (max-width: 700px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 28px;
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 480px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
