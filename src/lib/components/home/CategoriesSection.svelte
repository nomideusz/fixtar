<script lang="ts">
	import { ArrowRightIcon } from 'phosphor-svelte';
	import grinderImg from '$lib/images/banners/banner-grinder-sparks-1.webp';
	import sawImg from '$lib/images/banners/banner-extreme-closeup-1.webp';
	import drillImg from '$lib/images/banners/banner-workshop-cordless-drill-1.webp';
	import gardenImg from '$lib/images/banners/banner-garden-trimmer.webp';
	import hammerImg from '$lib/images/banners/banner-construction-hammer-drill-1.webp';
	import impactImg from '$lib/images/banners/banner-impact-wrench-wheel.webp';

	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	const IMAGE_MAP: Record<string, string> = {
		'szlifierki-i-polerki': grinderImg,
		szlifierki: grinderImg,
		'pily-i-pilarki': sawImg,
		pilarki: sawImg,
		'wiertarki-i-wkretarki': drillImg,
		wkretarki: drillImg,
		ogrody: gardenImg,
		'ogrody-i-akcesoria': gardenImg,
		'pneumatyczne-i-budowlane': impactImg,
		'narzedzia-budowlane': impactImg,
		mloty: hammerImg,
		mlotowiertarki: hammerImg,
		'mloty-i-mlotowiertarki': hammerImg,
		frezarki: grinderImg,
		odkurzacze: drillImg,
		kompresory: impactImg,
		'narzedzia-reczne': hammerImg
	};

	function displayName(c: Category): string {
		if (c.slug === 'pneumatyczne-i-budowlane') return 'Narzędzia<br/>budowlane';
		return c.name.replace(/\s+i\s+/i, '<br/>I ');
	}

	function imageFor(slug: string): string | undefined {
		return IMAGE_MAP[slug];
	}

	function plural(count: number): string {
		if (count === 1) return '1 produkt';
		const lastTwo = count % 100;
		const last = count % 10;
		if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} produkty`;
		return `${count} produktów`;
	}

	const shown = $derived(categories.slice(0, 6));
</script>

{#if shown.length > 0}
	<section class="categories ft-section" aria-label="Kategorie">
		<div class="ft-container">
			<div class="section-head">
				<div>
					<p class="ft-eyebrow">Kategorie</p>
					<h2>Przeglądaj kategorie</h2>
				</div>
				<a href="/products" class="see-all">
					Zobacz wszystkie
					<ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
				</a>
			</div>

			<div class="cat-grid ft-stagger">
				{#each shown as category (category.id)}
					{@const img = imageFor(category.slug)}
					<div class="cat-cell">
						<a class="cat-card" href="/products?category={category.slug}" aria-label={category.name}>
							<div class="cat-tile">
								<div class="cat-inner">
									{#if img}
										<img src={img} alt="" class="cat-img" loading="lazy" />
									{/if}
									<span class="cat-dim" aria-hidden="true"></span>
									<span class="cat-bg" aria-hidden="true"></span>
								</div>

								<span class="cat-body">
									<span class="cat-text">
										<h3 class="cat-name">{@html displayName(category)}</h3>
										<span class="cat-count">{plural(category.count)}</span>
									</span>
									<span class="cat-arrow" aria-hidden="true">
										<ArrowRightIcon size={18} weight="bold" />
									</span>
								</span>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 28px;
		gap: 24px;
		flex-wrap: wrap;
	}

	.section-head h2 {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(30px, 3.2vw, 40px);
		letter-spacing: -0.005em;
		text-transform: uppercase;
		margin: 6px 0 0;
		line-height: 1;
		color: var(--ft-text);
	}

	.see-all {
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ft-cta);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding-bottom: 4px;
		border-bottom: 2px solid var(--ft-cta);
		text-decoration: none;
		transition:
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.see-all:hover {
		color: var(--ft-cta-hover);
		border-bottom-color: var(--ft-cta-hover);
	}

	.cat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.cat-cell {
		min-width: 0;
	}

	.cat-card {
		position: relative;
		height: 200px;
		display: block;
		text-decoration: none;
		color: #fff;
		cursor: pointer;
		isolation: isolate;
	}

	/* Sheared tile — the parallelogram outline */
	.cat-tile {
		position: absolute;
		inset: 0;
		border-radius: 6px;
		overflow: hidden;
		background: var(--ft-ink-900);
		transform: skewX(-14deg);
		transition:
			transform var(--dur-med) ease,
			filter var(--dur-med) ease;
	}

	/* Push outer columns past the grid bounds so the OUTER edges of row 1 and 3 look straight */
	.cat-cell:nth-child(3n + 1) .cat-tile {
		left: -40px;
	}

	.cat-cell:nth-child(3n + 3) .cat-tile {
		right: -40px;
	}

	.cat-card:hover .cat-tile {
		filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
		z-index: 10;
	}

	/* Counter-skewed inner — holds image and overlay, upright */
	.cat-inner {
		position: absolute;
		inset: 0 -40px;
		transform: skewX(14deg);
	}

	.cat-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
		transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.cat-card:hover .cat-img {
		transform: scale(1.04);
	}

	/* Gradient overlay — dark on left, fading to transparent toward right */
	.cat-dim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			100deg,
			rgba(13, 16, 20, 0.88) 0%,
			rgba(29, 34, 40, 0.7) 30%,
			rgba(29, 34, 40, 0.35) 55%,
			rgba(29, 34, 40, 0.15) 80%,
			rgba(29, 34, 40, 0.3) 100%
		);
		z-index: 1;
		pointer-events: none;
	}

	/* Subtle cyan accent + sparks */
	.cat-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(60% 80% at 80% 50%, rgba(63, 152, 162, 0.22), transparent 60%),
			radial-gradient(1px 1px at 22% 70%, rgba(255, 255, 255, 0.35), transparent 50%),
			radial-gradient(1px 1px at 65% 28%, rgba(255, 255, 255, 0.4), transparent 50%);
		z-index: 1;
		pointer-events: none;
	}

	.cat-bg::before {
		content: '';
		position: absolute;
		right: -10%;
		top: 50%;
		width: 80%;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--ft-cyan) 50%, transparent);
		transform: rotate(-15deg);
		opacity: 0.35;
	}

	/* Content body — counter-skewed back so text stays upright */
	.cat-body {
		position: absolute;
		inset: 0;
		z-index: 2;
		padding: 24px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: 12px;
		transform: skewX(14deg);
	}

	.cat-cell:nth-child(3n + 1) .cat-body {
		padding-left: 56px;
	}

	.cat-cell:nth-child(3n + 3) .cat-body {
		padding-right: 56px;
	}

	.cat-text {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.cat-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-style: italic;
		font-size: 26px;
		line-height: 1;
		letter-spacing: 0.005em;
		text-transform: uppercase;
		margin: 0;
		color: #fff;
	}

	.cat-count {
		font-size: 12px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		font-weight: 500;
	}

	.cat-arrow {
		position: absolute;
		right: 24px;
		bottom: 20px;
		width: 44px;
		height: 44px;
		border-radius: 8px;
		background: var(--ft-cta);
		display: grid;
		place-items: center;
		color: #fff;
		transition:
			background-color var(--dur-fast) ease,
			transform var(--dur-fast) ease;
	}

	.cat-cell:nth-child(3n + 3) .cat-arrow {
		right: 56px;
	}

	.cat-card:hover .cat-arrow {
		background: var(--ft-cta-hover);
		transform: translateX(3px);
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 900px) {
		.cat-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		/* Reset 3-col shifts */
		.cat-cell:nth-child(3n + 1) .cat-tile,
		.cat-cell:nth-child(3n + 3) .cat-tile {
			left: 0;
			right: 0;
		}

		.cat-cell:nth-child(3n + 1) .cat-body,
		.cat-cell:nth-child(3n + 3) .cat-body {
			padding: 24px;
		}

		.cat-cell:nth-child(3n + 3) .cat-arrow {
			right: 24px;
		}

		/* Apply 2-col shifts */
		.cat-cell:nth-child(2n + 1) .cat-tile {
			left: -40px;
		}
		.cat-cell:nth-child(2n + 1) .cat-body {
			padding-left: 56px;
		}

		.cat-cell:nth-child(2n) .cat-tile {
			right: -40px;
		}
		.cat-cell:nth-child(2n) .cat-body {
			padding-right: 56px;
		}
		.cat-cell:nth-child(2n) .cat-arrow {
			right: 56px;
		}
	}

	@media (max-width: 560px) {
		.cat-grid {
			grid-template-columns: 1fr;
		}

		.cat-card {
			height: 180px;
		}

		.cat-name {
			font-size: 22px;
		}

		/* Reset 2-col shifts */
		.cat-cell:nth-child(2n + 1) .cat-tile,
		.cat-cell:nth-child(2n) .cat-tile {
			left: -30px;
			right: -30px;
		}
		.cat-cell:nth-child(2n + 1) .cat-body,
		.cat-cell:nth-child(2n) .cat-body {
			padding-left: 48px;
			padding-right: 24px;
		}
		.cat-cell:nth-child(2n) .cat-arrow {
			right: 24px;
		}
	}
</style>
