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

	function displayName(c: Category) {
		if (c.slug === 'pneumatyczne-i-budowlane') return 'Narzędzia\nbudowlane';
		return c.name.replace(/\s+i\s+/i, '\nI ');
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

	const SPARK_POSITIONS = [
		'80% 50%',
		'50% 40%',
		'70% 60%',
		'30% 30%',
		'40% 70%',
		'60% 50%'
	];

	const shown = $derived(categories.slice(0, 6));
</script>

{#if shown.length > 0}
	<section class="categories ft-section" aria-label="Kategorie">
		<div class="ft-container">
			<div class="section-head">
				<div>
					<p class="kicker">Kategorie</p>
					<h2>Przeglądaj kategorie</h2>
				</div>
				<a href="/products" class="see-all">
					Zobacz wszystkie
					<ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
				</a>
			</div>

			<div class="cats ft-stagger">
				{#each shown as category, i (category.id)}
					{@const img = imageFor(category.slug)}
					{@const spark = SPARK_POSITIONS[i % SPARK_POSITIONS.length]}
					<a class="cat-wrap" href="/products?category={category.slug}">
						<div class="cat-tile">
							<div class="cat-inner">
								{#if img}
									<img src={img} alt="" class="cat-img" loading="lazy" />
								{/if}
								<span class="cat-dim" aria-hidden="true"></span>
								<span class="cat-bg" style="--spark: {spark};" aria-hidden="true"></span>
							</div>

							<span class="cat-body">
								<span class="cat-text">
									<h3 class="cat-name">{@html displayName(category).replace('\n', '<br/>')}</h3>
									<span class="cat-count">{plural(category.count)}</span>
								</span>
								<span class="cat-arrow" aria-hidden="true">
									<ArrowRightIcon size={18} weight="bold" />
								</span>
							</span>
						</div>
					</a>
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

	.kicker {
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--ft-text-faint);
		font-weight: 600;
		margin: 0 0 8px;
	}

	.section-head h2 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(30px, 3.2vw, 40px);
		letter-spacing: 0.01em;
		text-transform: uppercase;
		margin: 0;
		line-height: 1;
	}

	.see-all {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ft-cta);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-bottom: 2px solid var(--ft-cta);
		padding-bottom: 4px;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.see-all:hover {
		color: var(--ft-cta-hover);
	}

	.cats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.cat-wrap {
		position: relative;
		height: 200px;
		display: block;
		text-decoration: none;
		color: #fff;
		cursor: pointer;
		isolation: isolate;
	}

	.cat-tile {
		position: absolute;
		inset: 0;
		border-radius: 6px;
		overflow: hidden;
		background: var(--ft-dark);
		transform: skewX(-14deg);
		transition:
			transform var(--dur-med) ease,
			filter var(--dur-med) ease;
	}

	.cat-wrap:nth-child(3n + 1) .cat-tile {
		left: -40px;
	}

	.cat-wrap:nth-child(3n + 3) .cat-tile {
		right: -40px;
	}

	.cat-wrap:hover .cat-tile {
		transform: skewX(-14deg) translateY(-2px);
		filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
		z-index: 10;
	}

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
	}

	.cat-dim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			100deg,
			rgba(13, 16, 20, 0.82) 0%,
			rgba(29, 34, 40, 0.55) 35%,
			rgba(29, 34, 40, 0.18) 70%,
			rgba(29, 34, 40, 0.35) 100%
		);
		z-index: 1;
		pointer-events: none;
	}

	.cat-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(60% 80% at var(--spark, 80% 50%), rgba(55, 138, 146, 0.32), transparent 60%),
			radial-gradient(1px 1px at 22% 70%, rgba(255, 255, 255, 0.35), transparent 50%),
			radial-gradient(1px 1px at 65% 28%, rgba(255, 255, 255, 0.4), transparent 50%),
			radial-gradient(2px 2px at 80% 80%, rgba(255, 138, 31, 0.5), transparent 50%);
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
		opacity: 0.3;
	}

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

	.cat-wrap:nth-child(3n + 1) .cat-body {
		padding-left: 64px;
	}

	.cat-wrap:nth-child(3n + 3) .cat-body {
		padding-right: 64px;
	}

	.cat-text {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.cat-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 26px;
		line-height: 1;
		letter-spacing: 0.01em;
		text-transform: uppercase;
		font-style: italic;
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
		right: 44px;
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

	.cat-wrap:nth-child(3n + 3) .cat-arrow {
		right: 60px;
	}

	.cat-wrap:hover .cat-arrow {
		background: var(--ft-cta-hover);
		transform: translateX(3px);
	}

	@media (max-width: 900px) {
		.cats {
			grid-template-columns: repeat(2, 1fr);
		}

		/* Re-apply overrides for 2 columns */
		.cat-wrap:nth-child(3n + 1) .cat-tile,
		.cat-wrap:nth-child(3n + 3) .cat-tile {
			left: 0;
			right: 0;
		}

		.cat-wrap:nth-child(3n + 1) .cat-body,
		.cat-wrap:nth-child(3n + 3) .cat-body {
			padding: 24px;
		}
		.cat-wrap:nth-child(3n + 3) .cat-arrow {
			right: 44px;
		}

		/* Col 1 */
		.cat-wrap:nth-child(2n + 1) .cat-tile {
			left: -40px;
		}
		.cat-wrap:nth-child(2n + 1) .cat-body {
			padding-left: 64px;
		}

		/* Col 2 */
		.cat-wrap:nth-child(2n + 2) .cat-tile {
			right: -40px;
		}
		.cat-wrap:nth-child(2n + 2) .cat-body {
			padding-right: 64px;
		}
		.cat-wrap:nth-child(2n + 2) .cat-arrow {
			right: 60px;
		}
	}

	@media (max-width: 560px) {
		.cats {
			grid-template-columns: 1fr;
		}

		.cat-wrap {
			height: 180px;
		}

		.cat-name {
			font-size: 22px;
		}
	}
</style>
