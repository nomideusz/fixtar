<script lang="ts">
	import { ArrowRightIcon, TagIcon, ShoppingCartSimpleIcon } from 'phosphor-svelte';
	import CountdownTimer from '$lib/components/ui/CountdownTimer.svelte';
	import { cart, notifications } from '$lib/stores';

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

	function getTomorrowMidnight(): string {
		const d = new Date();
		d.setDate(d.getDate() + 1);
		d.setHours(0, 0, 0, 0);
		return d.toISOString();
	}

	const flashDeals = $derived(data.deals?.slice(0, 2) || []);
	const seasonalDeals = $derived(data.deals?.slice(2) || []);

	function addToCart(deal: Deal, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!deal.inStock) return;

		cart.addItem({
			productId: deal.id,
			name: deal.name,
			price: deal.price,
			image: deal.image
		});
		notifications.success(`Dodano ${deal.name} do koszyka`);
	}
</script>

<svelte:head>
	<title>Promocje — FixTar</title>
	<meta
		name="description"
		content="Sprawdź aktualne promocje i oferty specjalne na elektronarzędzia."
	/>
</svelte:head>

<div class="ft-container ft-section">
	<div class="page-header">
		<h1 class="page-title">Oferty specjalne</h1>
		<p class="page-desc">
			Produkty z obniżoną ceną — promocje zarządzane bezpośrednio przez nasz magazyn.
		</p>
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
		<!-- Tier 1: Flash Deals -->
		{#if flashDeals.length > 0}
			<section class="tier-section">
				<h2 class="tier-title">Oferty Błyskawiczne</h2>
				<div class="flash-grid ft-stagger">
					{#each flashDeals as deal}
						<div class="flash-card ft-card">
							<a href="/products/{deal.slug}" class="flash-img-link">
								<div class="flash-img-wrap">
									{#if deal.image}
										<img src={deal.image} alt={deal.name} loading="lazy" />
									{:else}
										<div class="placeholder"></div>
									{/if}
									<span class="hud-badge">-{deal.discountPercent}%</span>
								</div>
							</a>
							<div class="flash-body">
								{#if deal.category}
									<span class="deal-category">{deal.category}</span>
								{/if}
								<h3 class="deal-name"><a href="/products/{deal.slug}">{deal.name}</a></h3>
								<p class="deal-desc">{deal.description}</p>

								<div class="flash-price-row">
									<span class="price-sale">{formatPrice(deal.price)}</span>
									<span class="price-old">{formatPrice(deal.compareAtPrice)}</span>
								</div>

								<div class="flash-timer-wrap">
									<CountdownTimer targetDate={getTomorrowMidnight()} />
								</div>

								<button
									class="btn-cta flash-btn"
									disabled={!deal.inStock}
									onclick={(e) => addToCart(deal, e)}
								>
									<ShoppingCartSimpleIcon size={20} weight="bold" />
									{deal.inStock ? 'Kup teraz' : 'Brak w magazynie'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Tier 2: Seasonal Deals -->
		{#if seasonalDeals.length > 0}
			<section class="tier-section">
				<h2 class="tier-title">Wszystkie Promocje</h2>
				<p class="deals-count">{seasonalDeals.length} produktów</p>

				<div class="seasonal-grid ft-stagger">
					{#each seasonalDeals as deal}
						<div class="seasonal-card ft-card">
							<a href="/products/{deal.slug}" class="seasonal-img-link">
								<div class="seasonal-img-wrap">
									{#if deal.image}
										<img src={deal.image} alt={deal.name} loading="lazy" />
									{:else}
										<div class="placeholder"></div>
									{/if}
									<span class="hud-badge">-{deal.discountPercent}%</span>
								</div>
							</a>
							<div class="seasonal-body">
								{#if deal.category}
									<span class="deal-category">{deal.category}</span>
								{/if}
								<h3 class="deal-name"><a href="/products/{deal.slug}">{deal.name}</a></h3>
								<p class="deal-desc">{deal.description}</p>
								<div class="seasonal-date">Do wyczerpania zapasów</div>

								<div class="seasonal-bottom">
									<div class="price-wrap">
										<span class="price-sale">{formatPrice(deal.price)}</span>
										<span class="price-old">{formatPrice(deal.compareAtPrice)}</span>
									</div>
									<a href="/products/{deal.slug}" class="seasonal-link">
										Sprawdź <ArrowRightIcon weight="bold" />
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	/* ── Header ── */
	.page-header {
		margin-bottom: clamp(32px, 5vh, 48px);
		border-bottom: 2px solid var(--ft-dark);
		padding-bottom: 16px;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		color: var(--ft-dark);
		text-transform: uppercase;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.page-desc {
		font-size: 0.95rem;
		color: var(--ft-text-muted);
		margin-top: 12px;
		max-width: 600px;
	}

	.tier-section {
		margin-bottom: clamp(48px, 8vh, 80px);
	}

	.tier-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 800;
		text-transform: uppercase;
		border-left: 4px solid var(--ft-cta);
		padding-left: 12px;
		margin-bottom: 24px;
	}

	/* ── Empty State ── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 64px 0;
		color: var(--ft-text-muted);
	}

	.empty-state :global(svg) {
		color: var(--ft-text-faint);
		margin-bottom: 16px;
	}

	.empty-title {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--ft-dark);
		margin: 16px 0 8px;
		text-transform: uppercase;
	}

	.empty-actions {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin-top: 24px;
	}

	/* ── Flash Deals (Tier 1) ── */
	.flash-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	@media (min-width: 900px) {
		.flash-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.flash-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--ft-line);
		border-radius: 0;
		overflow: hidden;
	}

	@media (min-width: 600px) {
		.flash-card {
			flex-direction: row;
		}
	}

	.flash-img-link {
		flex: 0 0 45%;
		display: block;
		background: #fff;
		border-right: 1px solid var(--ft-line);
	}

	.flash-img-wrap {
		position: relative;
		aspect-ratio: 1;
		padding: 24px;
	}

	.flash-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 0.4s ease;
	}

	.flash-card:hover .flash-img-wrap img {
		transform: scale(1.05);
	}

	.hud-badge {
		position: absolute;
		top: 12px;
		right: 12px;
		background: var(--ft-cta);
		color: #fff;
		font-family: var(--font-mono);
		font-weight: 800;
		font-size: 0.8rem;
		padding: 4px 8px;
	}

	.flash-body {
		padding: 24px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.deal-category {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--ft-text-muted);
		margin-bottom: 8px;
	}

	.deal-name {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 12px;
	}

	.deal-name a {
		color: inherit;
	}

	.deal-name a:hover {
		color: var(--ft-accent);
	}

	.deal-desc {
		font-size: 0.85rem;
		color: var(--ft-text-muted);
		margin-bottom: 16px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.flash-price-row {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin: auto 0 20px;
	}

	.price-sale {
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--ft-cta);
	}

	.price-old {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--ft-text-faint);
		text-decoration: line-through;
		font-weight: 600;
	}

	.flash-timer-wrap {
		margin-bottom: 20px;
	}

	.flash-btn {
		width: 100%;
	}

	/* ── Seasonal Deals (Tier 2) ── */
	.deals-count {
		font-size: 0.85rem;
		color: var(--ft-text-muted);
		margin-top: -16px;
		margin-bottom: 24px;
	}

	.seasonal-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 20px;
	}

	@media (min-width: 600px) {
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
		display: flex;
		flex-direction: column;
		border: 1px solid var(--ft-line);
		border-radius: 0;
	}

	.seasonal-img-link {
		display: block;
		border-bottom: 1px solid var(--ft-line);
		background: #fff;
	}

	.seasonal-img-wrap {
		position: relative;
		aspect-ratio: 1;
		padding: 24px;
	}

	.seasonal-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 0.4s ease;
	}

	.seasonal-card:hover .seasonal-img-wrap img {
		transform: scale(1.06);
	}

	.seasonal-body {
		padding: 24px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.seasonal-bottom {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding-top: 16px;
	}

	.price-wrap {
		display: flex;
		flex-direction: column;
	}

	.seasonal-date {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--ft-text-muted);
		background: var(--ft-frost);
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		align-self: flex-start;
		margin-top: auto;
		margin-bottom: 12px;
	}

	.seasonal-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--ft-accent);
	}

	.seasonal-link :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.seasonal-link:hover {
		color: var(--ft-cta);
	}

	.seasonal-link:hover :global(svg) {
		transform: translateX(4px);
	}
</style>
