<script lang="ts">
	import CountdownTimer from '$lib/components/ui/CountdownTimer.svelte';

	// Mock deals data — will be replaced with real DB data
	const flashDeals = [
		{
			id: 1,
			title: 'Szlifierka kątowa Bavaria 2000W',
			description: 'Profesjonalna szlifierka z regulacją obrotów i tarczą 125mm.',
			originalPrice: 349,
			salePrice: 249,
			discount: 29,
			image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
			validUntil: getRelativeDate(2),
			badge: 'Oferta błyskawiczna'
		},
		{
			id: 2,
			title: 'Wiertarka udarowa Eurotec 1100W',
			description: 'Wiertarka z uchwytem szybkozaciskowym i funkcją udaru.',
			originalPrice: 279,
			salePrice: 199,
			discount: 29,
			image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400',
			validUntil: getRelativeDate(1),
			badge: 'Ostatnie sztuki'
		}
	];

	const seasonalDeals = [
		{
			id: 3,
			title: 'Wyprzedaż sezonowa',
			description: 'Do -50% na wybrane elektronarzędzia z kolekcji wiosna 2026.',
			discount: 50,
			image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
			validUntil: getRelativeDate(30),
			href: '/products'
		},
		{
			id: 4,
			title: 'Kup 2 — trzeci gratis',
			description: 'Na wszystkie akcesoria i osprzęt. Najtańszy produkt gratis.',
			discount: 0,
			image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400',
			validUntil: getRelativeDate(14),
			href: '/products?category=zestawy-i-akcesoria',
			label: 'B2G1'
		},
		{
			id: 5,
			title: 'Zestawy startowe -20%',
			description: 'Kompletne zestawy narzędzi dla początkujących i profesjonalistów.',
			discount: 20,
			image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
			validUntil: getRelativeDate(21),
			href: '/products'
		}
	];

	function getRelativeDate(daysFromNow: number): string {
		const d = new Date();
		d.setDate(d.getDate() + daysFromNow);
		d.setHours(23, 59, 59, 0);
		return d.toISOString();
	}

	function formatPrice(price: number): string {
		return price.toFixed(2).replace('.', ',') + ' zł';
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('pl-PL', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Promocje — FixTar</title>
	<meta name="description" content="Sprawdź aktualne promocje i oferty specjalne na elektronarzędzia. Oferty błyskawiczne, wyprzedaże sezonowe i zestawy w niższych cenach." />
</svelte:head>

<div class="ft-container ft-section">
	<!-- Page header -->
	<div class="page-header">
		<h4 class="ft-label">Oferty specjalne</h4>
		<h1 class="page-title">Promocje</h1>
		<p class="page-desc">Nie przegap okazji — sprawdź nasze aktualne promocje i oferty limitowane.</p>
	</div>

	<!-- Flash deals -->
	{#if flashDeals.length > 0}
		<section class="deals-section" aria-label="Oferty błyskawiczne">
			<div class="section-header">
				<h2 class="section-title">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
					Oferty błyskawiczne
				</h2>
				<p class="section-hint">Ograniczony czas — kupuj zanim wygasną!</p>
			</div>

			<div class="flash-grid ft-stagger">
				{#each flashDeals as deal (deal.id)}
					<article class="flash-card ft-card">
						<div class="flash-image">
							<img src={deal.image} alt={deal.title} width="400" height="240" loading="lazy" />
							{#if deal.badge}
								<span class="flash-badge">{deal.badge}</span>
							{/if}
							<span class="flash-discount">-{deal.discount}%</span>
						</div>
						<div class="flash-body">
							<h3 class="flash-title">{deal.title}</h3>
							<p class="flash-desc">{deal.description}</p>

							<div class="flash-pricing">
								<span class="flash-original">{formatPrice(deal.originalPrice)}</span>
								<span class="flash-sale">{formatPrice(deal.salePrice)}</span>
							</div>

							<div class="flash-countdown">
								<span class="flash-countdown-label">Oferta kończy się za:</span>
								<CountdownTimer targetDate={deal.validUntil} />
							</div>

							<a href="/products" class="flash-cta btn-primary">
								Kup teraz
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
								</svg>
							</a>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Seasonal promotions -->
	<section class="deals-section" aria-label="Promocje sezonowe">
		<div class="section-header">
			<h2 class="section-title">Promocje sezonowe</h2>
		</div>

		<div class="seasonal-grid ft-stagger">
			{#each seasonalDeals as deal (deal.id)}
				<a href={deal.href} class="seasonal-card ft-card">
					<div class="seasonal-image">
						<img src={deal.image} alt={deal.title} width="400" height="200" loading="lazy" />
						<span class="seasonal-badge">
							{deal.label || `-${deal.discount}%`}
						</span>
					</div>
					<div class="seasonal-body">
						<h3 class="seasonal-title">{deal.title}</h3>
						<p class="seasonal-desc">{deal.description}</p>
						<div class="seasonal-footer">
							<span class="seasonal-date">Do {formatDate(deal.validUntil)}</span>
							<span class="seasonal-cta">
								Sprawdź
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
								</svg>
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Newsletter CTA -->
	<section class="deals-newsletter" aria-label="Newsletter">
		<div class="newsletter-inner">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="newsletter-icon">
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
			<div>
				<h3 class="newsletter-title">Nie chcesz przegapić kolejnej promocji?</h3>
				<p class="newsletter-desc">Zapisz się do newslettera i otrzymaj <strong>5% rabatu</strong> na pierwsze zamówienie.</p>
			</div>
			<a href="/#newsletter" class="btn-secondary newsletter-btn">Zapisz się</a>
		</div>
	</section>
</div>

<style>
	/* ── Page header ── */
	.page-header {
		margin-bottom: clamp(32px, 4vh, 48px);
	}

	.page-title {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		margin-top: 6px;
	}

	.page-desc {
		font-size: 0.88rem;
		color: var(--ft-text-muted);
		margin-top: 6px;
		max-width: 480px;
	}

	/* ── Section ── */
	.deals-section {
		margin-bottom: clamp(40px, 5vh, 56px);
	}

	.section-header {
		margin-bottom: 24px;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
	}

	.section-title svg {
		color: var(--ft-cta);
	}

	.section-hint {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
		margin-top: 4px;
	}

	/* ── Flash deals ── */
	.flash-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	@media (min-width: 768px) {
		.flash-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.flash-card {
		overflow: hidden;
	}

	.flash-image {
		position: relative;
		aspect-ratio: 5 / 3;
		overflow: hidden;
		background: var(--ft-frost);
	}

	.flash-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.flash-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: white;
		background: var(--ft-dark);
		padding: 5px 10px;
		border-radius: var(--radius-sm);
	}

	.flash-discount {
		position: absolute;
		top: 12px;
		right: 12px;
		font-family: var(--font-display);
		font-size: 0.88rem;
		font-weight: 800;
		color: white;
		background: var(--ft-cta);
		padding: 4px 10px;
		border-radius: var(--radius-sm);
	}

	.flash-body {
		padding: 20px;
	}

	.flash-title {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.01em;
	}

	.flash-desc {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		line-height: 1.5;
		margin-top: 6px;
	}

	.flash-pricing {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 14px;
	}

	.flash-original {
		font-size: 0.82rem;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	.flash-sale {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--ft-cta);
		letter-spacing: -0.02em;
	}

	.flash-countdown {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--ft-line);
	}

	.flash-countdown-label {
		display: block;
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		margin-bottom: 8px;
	}

	.flash-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		margin-top: 16px;
		text-decoration: none;
	}

	/* ── Seasonal deals ── */
	.seasonal-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	@media (min-width: 640px) {
		.seasonal-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.seasonal-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.seasonal-card {
		overflow: hidden;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		transition: border-color var(--dur-med) ease, box-shadow var(--dur-med) ease, transform var(--dur-med) ease;
	}

	.seasonal-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--ft-shadow-md);
	}

	.seasonal-image {
		position: relative;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		background: var(--ft-frost);
	}

	.seasonal-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 350ms ease;
	}

	.seasonal-card:hover .seasonal-image img {
		transform: scale(1.03);
	}

	.seasonal-badge {
		position: absolute;
		top: 10px;
		right: 10px;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 800;
		color: white;
		background: var(--ft-cta);
		padding: 4px 10px;
		border-radius: var(--radius-sm);
	}

	.seasonal-body {
		padding: 16px 20px 20px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.seasonal-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.01em;
	}

	.seasonal-desc {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		line-height: 1.5;
		margin-top: 4px;
		flex: 1;
	}

	.seasonal-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px solid var(--ft-line);
	}

	.seasonal-date {
		font-size: 0.72rem;
		color: var(--ft-text-faint);
	}

	.seasonal-cta {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-cta);
		transition: gap var(--dur-fast) ease;
	}

	.seasonal-card:hover .seasonal-cta {
		gap: 7px;
	}

	/* ── Newsletter CTA ── */
	.deals-newsletter {
		margin-top: clamp(40px, 5vh, 56px);
		padding: 28px 32px;
		border-radius: var(--radius-md);
		background: var(--ft-frost);
		border: 1px solid var(--ft-line);
		display: flex;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
	}

	.newsletter-icon {
		color: var(--ft-accent);
		flex-shrink: 0;
	}

	.newsletter-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark);
	}

	.newsletter-desc {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		margin-top: 2px;
	}

	.newsletter-desc strong {
		color: var(--ft-cta);
		font-weight: 700;
	}

	.newsletter-btn {
		margin-left: auto;
		text-decoration: none;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.deals-newsletter {
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
			padding: 20px 24px;
		}

		.newsletter-btn {
			margin-left: 0;
			width: 100%;
			justify-content: center;
		}
	}
</style>
