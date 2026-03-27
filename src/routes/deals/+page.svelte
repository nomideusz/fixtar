<script lang="ts">
	import { ArrowRightIcon, BellIcon, TagIcon } from 'phosphor-svelte';

	interface Deal {
		id: string;
		slug: string;
		name: string;
		description: string;
		price: number;
		compareAtPrice: number;
		discountPercent: number;
		image?: string;
		category: string;
		inStock: boolean;
	}

	interface Props {
		data: {
			deals: Deal[];
			error?: string;
		};
	}

	let { data }: Props = $props();

	function formatPrice(price: number): string {
		return price.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

<svelte:head>
	<title>Promocje — FixTar</title>
	<meta name="description" content="Sprawdź aktualne promocje i oferty specjalne na elektronarzędzia." />
</svelte:head>

<div class="ft-container ft-section">
	<!-- Page header -->
	<div class="page-header">
		<h4 class="ft-label">Oferty specjalne</h4>
		<h1 class="page-title">Promocje</h1>
		<p class="page-desc">Produkty z obniżoną ceną — promocje zarządzane bezpośrednio przez nasz magazyn.</p>
	</div>

	{#if data.error}
		<div class="empty-state">
			<p>{data.error}</p>
			<a href="/products" class="btn-secondary">Przeglądaj produkty</a>
		</div>
	{:else if data.deals.length === 0}
		<div class="empty-state">
			<TagIcon size={48} weight="light" aria-hidden="true" />
			<h2 class="empty-title">Aktualnie brak promocji</h2>
			<p>Nowe promocje pojawiają się regularnie — wróć wkrótce lub zapisz się do newslettera.</p>
			<div class="empty-actions">
				<a href="/products" class="btn-primary">Przeglądaj produkty</a>
				<a href="/#newsletter" class="btn-secondary">Zapisz się do newslettera</a>
			</div>
		</div>
	{:else}
		<p class="deals-count">{data.deals.length} {data.deals.length === 1 ? 'produkt' : data.deals.length < 5 ? 'produkty' : 'produktów'} w promocji</p>

		<div class="deals-grid ft-stagger">
			{#each data.deals as deal (deal.id)}
				<a href="/products/{deal.slug}" class="deal-card ft-card">
					<div class="deal-image">
						{#if deal.image}
							<img src={deal.image} alt={deal.name} width="400" height="300" loading="lazy" />
						{:else}
							<div class="deal-image-placeholder"></div>
						{/if}
						<span class="deal-badge">-{deal.discountPercent}%</span>
					</div>
					<div class="deal-body">
						{#if deal.category}
							<span class="deal-category">{deal.category}</span>
						{/if}
						<h3 class="deal-name">{deal.name}</h3>
						<div class="deal-pricing">
							<span class="deal-original">{formatPrice(deal.compareAtPrice)}</span>
							<span class="deal-sale">{formatPrice(deal.price)}</span>
						</div>
						{#if !deal.inStock}
							<span class="deal-oos">Niedostępny</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<div class="more-link">
			<a href="/products" class="btn-secondary">
				Zobacz wszystkie produkty
				<ArrowRightIcon weight="bold" aria-hidden="true" />
			</a>
		</div>
	{/if}

	<!-- Newsletter CTA -->
	<section class="deals-newsletter" aria-label="Newsletter">
		<div class="newsletter-inner">
			<BellIcon class="newsletter-icon" aria-hidden="true" />
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

	/* ── Empty state ── */
	.empty-state {
		text-align: center;
		padding: clamp(48px, 8vh, 80px) 0;
		color: var(--ft-text-muted);
	}

	.empty-state :global(svg) {
		color: var(--ft-text-faint);
		margin-bottom: 16px;
	}

	.empty-title {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-bottom: 6px;
	}

	.empty-state p {
		font-size: 0.88rem;
		margin-bottom: 24px;
	}

	.empty-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* ── Deals count ── */
	.deals-count {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		margin-bottom: 20px;
	}

	/* ── Deals grid ── */
	.deals-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	@media (min-width: 640px) {
		.deals-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.deals-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 20px;
		}
	}

	/* ── Deal card ── */
	.deal-card {
		overflow: hidden;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		transition: border-color var(--dur-med) ease, transform var(--dur-med) var(--ease-out);
	}

	.deal-card:hover {
		border-color: var(--ft-accent);
		transform: translateY(-2px);
	}

	.deal-image {
		position: relative;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background: var(--ft-frost);
	}

	.deal-image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 8px;
		transition: transform 350ms ease;
	}

	.deal-card:hover .deal-image img {
		transform: scale(1.04);
	}

	.deal-image-placeholder {
		width: 100%;
		height: 100%;
		background: var(--ft-frost);
	}

	.deal-badge {
		position: absolute;
		top: 8px;
		right: 8px;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 800;
		color: white;
		background: var(--ft-cta);
		padding: 3px 8px;
		border-radius: var(--radius-sm);
	}

	.deal-body {
		padding: 12px 14px 16px;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.deal-category {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-text-faint);
	}

	.deal-name {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.01em;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.deal-pricing {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: auto;
		padding-top: 8px;
	}

	.deal-original {
		font-size: 0.78rem;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	.deal-sale {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--ft-cta);
		letter-spacing: -0.02em;
	}

	.deal-oos {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: var(--ft-frost);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		width: fit-content;
		margin-top: 4px;
	}

	/* ── More link ── */
	.more-link {
		text-align: center;
		margin: clamp(32px, 4vh, 48px) 0;
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

	:global(.newsletter-icon) {
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
