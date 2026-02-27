<script lang="ts">
	import FixTarLogoWhite from '$lib/img/logo-FixTar-white.webp';

	const year = new Date().getFullYear();

	const linkGroups = [
		{
			title: 'Produkty',
			links: ['Nowości', 'Bestsellery', 'Wyprzedaż', 'Kategorie'],
			href: '/products'
		},
		{ title: 'Firma', links: ['O Nas', 'Kariera', 'Blog', 'Kontakt'] },
		{ title: 'Pomoc', links: ['FAQ', 'Dostawa', 'Zwroty', 'Status Zamówienia'] },
		{ title: 'Prawne', links: ['Regulamin', 'Polityka Prywatności', 'Cookies', 'Licencje'] }
	] as const;

	const socials = ['facebook', 'twitter', 'instagram', 'linkedin'] as const;

	const socialPaths: Record<string, string> = {
		facebook:
			'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
		twitter:
			'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
		instagram:
			'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z',
		linkedin:
			'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
	};

	function linkHref(group: (typeof linkGroups)[number], link: string): string {
		if ('href' in group) return group.href;
		return `/${link.toLowerCase().replace(' ', '-')}`;
	}
</script>

<footer class="footer">
	<!-- Background layers -->
	<div class="footer__grid"></div>
	<div class="footer__noise"></div>
	<div class="footer__gradient"></div>

	<!-- Top divider line -->
	<div class="footer__divider"></div>

	<div class="footer__container">
		<!-- Top: logo + newsletter -->
		<div class="footer__top">
			<div class="footer__brand">
				<img src={FixTarLogoWhite} alt="FixTar" class="footer__logo" />
				<p class="footer__tagline">
					Dostarczamy wysokiej jakości produkty z pasją i zaangażowaniem. Twoja satysfakcja jest
					naszym priorytetem.
				</p>
				<div class="footer__socials">
					{#each socials as social (social)}
						<a
							href="https://{social}.com/FixTar"
							class="footer__social-icon"
							aria-label={social}
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d={socialPaths[social]} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<div class="footer__newsletter-wrap">
				<div class="footer__newsletter">
					<h3 class="footer__newsletter-title">Newsletter</h3>
					<p class="footer__newsletter-desc">Bądź na bieżąco z najnowszymi ofertami i promocjami</p>
					<form class="footer__newsletter-form">
						<input
							type="email"
							placeholder="Twój adres email"
							class="footer__newsletter-input"
							required
						/>
						<button type="submit" class="footer__newsletter-btn">Zapisz</button>
					</form>
				</div>
			</div>
		</div>

		<!-- Link columns -->
		<div class="footer__links">
			{#each linkGroups as group (group.title)}
				<div>
					<h4 class="footer__link-title">{group.title}</h4>
					<ul class="footer__link-list">
						{#each group.links as link (link)}
							<li><a href={linkHref(group, link)} class="footer__link">{link}</a></li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Bottom bar -->
		<div class="footer__bottom">
			<p class="footer__copyright">&copy; {year} FixTar. Wszelkie prawa zastrzeżone.</p>
			<div class="footer__payments">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg"
					alt="Visa"
					class="footer__payment-img"
				/>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
					alt="Mastercard"
					class="footer__payment-img"
				/>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
					alt="PayPal"
					class="footer__payment-img footer__payment-img--sm"
				/>
			</div>
		</div>
	</div>
</footer>

<style>
	/* ══════════════════════════════════════
	   FOOTER — Dark Industrial
	   Matches precision workshop aesthetic
	   of HeroSection / FeaturedProducts.
	   ══════════════════════════════════════ */

	.footer {
		position: relative;
		overflow: hidden;
		background: var(--ft-dark-deeper, #090e13);
		color: var(--ft-dark-text, #ffffff);
	}

	/* Blueprint grid texture */
	.footer__grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(rgba(55, 138, 146, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(55, 138, 146, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 100%, black 10%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 100%, black 10%, transparent 70%);
		pointer-events: none;
	}

	/* Subtle noise grain */
	.footer__noise {
		position: absolute;
		inset: 0;
		opacity: 0.02;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
		z-index: 0;
		pointer-events: none;
	}

	/* Brand/accent gradient overlay */
	.footer__gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(55, 138, 146, 0.04) 0%, transparent 40%, rgba(55, 138, 146, 0.02) 100%);
		z-index: 0;
		pointer-events: none;
	}

	/* Top divider — teal accent */
	.footer__divider {
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(55, 138, 146, 0.25), transparent);
		z-index: 1;
		pointer-events: none;
	}

	/* ── Container ── */
	.footer__container {
		position: relative;
		z-index: 2;
		max-width: 1536px;
		margin: 0 auto;
		padding: 5rem 1.5rem 2.5rem;
	}

	@media (min-width: 640px) {
		.footer__container { padding: 5rem 2rem 2.5rem; }
	}

	@media (min-width: 1024px) {
		.footer__container { padding: 5rem 3rem 2.5rem; }
	}

	/* ── Top section: brand + newsletter ── */
	.footer__top {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		margin-bottom: 4rem;
	}

	@media (min-width: 1024px) {
		.footer__top {
			grid-template-columns: 1fr 1fr;
			gap: 4rem;
		}
	}

	.footer__logo {
		height: 3rem;
		width: auto;
		margin-bottom: 1.5rem;
	}

	.footer__tagline {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		max-width: 26rem;
		margin-bottom: 2rem;
	}

	/* ── Social icons ── */
	.footer__socials {
		display: flex;
		gap: 0.5rem;
	}

	.footer__social-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		transition: all 0.25s ease;
		cursor: pointer;
	}

	.footer__social-icon:hover {
		border-color: var(--ft-dark-border-hover, rgba(55, 138, 146, 0.15));
		color: var(--ft-dark-text, #ffffff);
		background: var(--ft-dark-card-hover, rgba(255, 255, 255, 0.04));
		box-shadow: 0 0 12px rgba(55, 138, 146, 0.1);
	}

	/* ── Newsletter ── */
	.footer__newsletter {
		background: var(--ft-dark-card, rgba(255, 255, 255, 0.02));
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		padding: 2rem;
	}

	.footer__newsletter-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		margin-bottom: 0.75rem;
	}

	.footer__newsletter-desc {
		font-size: 0.95rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.footer__newsletter-form {
		display: flex;
		gap: 0.75rem;
	}

	.footer__newsletter-input {
		flex: 1;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		padding: 0.75rem 1.25rem;
		color: var(--ft-dark-text, #ffffff);
		font-size: 0.95rem;
		transition: border-color 0.2s;
	}

	.footer__newsletter-input::placeholder {
		color: var(--ft-dark-text-muted, rgba(255, 255, 255, 0.2));
	}

	.footer__newsletter-input:focus {
		outline: none;
		border-color: var(--ft-dark-border-hover, rgba(55, 138, 146, 0.15));
		box-shadow: 0 0 0 1px rgba(55, 138, 146, 0.08);
	}

	.footer__newsletter-btn {
		padding: 0.75rem 1.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #ffffff;
		background: var(--color-brand-600, #2f6d73);
		border: none;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.footer__newsletter-btn:hover {
		background: var(--color-brand-700, #256066);
		box-shadow: 0 4px 16px rgba(55, 138, 146, 0.2);
	}

	/* ── Link columns ── */
	.footer__links {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin-bottom: 4rem;
	}

	@media (min-width: 768px) {
		.footer__links {
			grid-template-columns: repeat(4, 1fr);
			gap: 2.5rem;
		}
	}

	.footer__link-title {
		font-family: var(--font-heading);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 1.5rem;
		position: relative;
	}

	/* Accent underline on link group title */
	.footer__link-title::after {
		content: '';
		display: block;
		width: 1.5rem;
		height: 2px;
		margin-top: 0.5rem;
		background: var(--color-brand-500, #378a92);
		opacity: 0.4;
	}

	.footer__link-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer__link {
		font-size: 0.9rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer__link:hover {
		color: var(--ft-dark-text, #ffffff);
	}

	/* ── Bottom bar ── */
	.footer__bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
	}

	@media (min-width: 768px) {
		.footer__bottom { flex-direction: row; }
	}

	.footer__copyright {
		font-size: 0.85rem;
		color: var(--ft-dark-text-muted, rgba(255, 255, 255, 0.2));
	}

	.footer__payments {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.footer__payment-img {
		height: 2rem;
		opacity: 0.35;
		transition: opacity 0.25s;
		filter: brightness(0) invert(1);
	}

	.footer__payment-img:hover {
		opacity: 0.7;
	}

	.footer__payment-img--sm {
		height: 1.5rem;
	}
</style>
