<script lang="ts">
	const features = [
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Gwarancja i Serwis',
			description: 'Pełna gwarancja producenta oraz profesjonalny serwis techniczny',
			color: '#16a34a',
			colorRgb: '22, 163, 74'
		},
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Ekspresowa Dostawa',
			description: 'Szybka wysyłka w 24h na terenie całego kraju',
			color: '#378a92',
			colorRgb: '55, 138, 146'
		},
		{
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Wsparcie Eksperckie',
			description: 'Doradztwo techniczne i pomoc w doborze narzędzi',
			color: '#0d9488',
			colorRgb: '13, 148, 136'
		}
	];
</script>

<section class="features-section">
	<div class="features-container">
		<!-- Header -->
		<div class="features-header">
			<h2 class="features-title">
				Dlaczego <span class="features-accent">FixTar</span>?
			</h2>
			<p class="features-subtitle">
				Najlepsze marki, profesjonalny serwis i konkurencyjne ceny elektronarzędzi
			</p>
		</div>

		<!-- Cards -->
		<div class="features-grid">
			{#each features as feature (feature.title)}
				<div
					class="feature-card"
					style="--fc: {feature.color}; --fc-rgb: {feature.colorRgb};"
				>
					<div class="feature-icon">
						<svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={feature.icon}
							/>
						</svg>
					</div>
					<h3 class="feature-name">{feature.title}</h3>
					<p class="feature-desc">{feature.description}</p>
					<div class="feature-line"></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ══════════════════════════════════════
	   FEATURES — Dark Industrial Cards
	   ══════════════════════════════════════ */

	.features-section {
		position: relative;
		padding: 6rem 0 7rem;
		background: var(--ft-dark-deeper, #090e13);
		overflow: hidden;
	}

	/* Subtle noise texture */
	.features-section::before {
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0.02;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
		pointer-events: none;
	}

	/* Top divider — thin teal line */
	.features-section::after {
		content: '';
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(55, 138, 146, 0.2), transparent);
		pointer-events: none;
	}

	.features-container {
		position: relative;
		z-index: 1;
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	@media (min-width: 640px)  { .features-container { padding: 0 2rem; } }
	@media (min-width: 1024px) { .features-container { padding: 0 3rem; } }

	/* ── Header ── */
	.features-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.features-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 5vw, 3.75rem);
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		letter-spacing: -0.02em;
		margin-bottom: 1.25rem;
	}

	.features-accent {
		color: var(--color-brand-500, #378a92);
	}

	.features-subtitle {
		font-size: 1.15rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		max-width: 36rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* ── Grid ── */
	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.features-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.75rem;
		}
	}

	/* ── Card ── */
	.feature-card {
		position: relative;
		padding: 2.5rem 2rem;
		background: var(--ft-dark-card, rgba(255, 255, 255, 0.02));
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		border-radius: 0.25rem;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.feature-card:hover {
		background: var(--ft-dark-card-hover, rgba(255, 255, 255, 0.04));
		border-color: rgba(var(--fc-rgb), 0.15);
		transform: translateY(-3px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	/* ── Icon ── */
	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		margin-bottom: 1.5rem;
		background: rgba(var(--fc-rgb), 0.08);
		border: 1px solid rgba(var(--fc-rgb), 0.12);
		border-radius: 0.125rem;
		color: var(--fc);
		transition: all 0.3s ease;
	}

	.feature-card:hover .feature-icon {
		background: rgba(var(--fc-rgb), 0.12);
		box-shadow: 0 0 20px rgba(var(--fc-rgb), 0.1);
	}

	/* ── Name ── */
	.feature-name {
		font-family: var(--font-heading);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		margin-bottom: 0.75rem;
		transition: color 0.3s;
	}

	.feature-card:hover .feature-name {
		color: var(--fc);
	}

	/* ── Description ── */
	.feature-desc {
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
	}

	/* ── Bottom accent line ── */
	.feature-line {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 2px;
		background: var(--fc);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.feature-card:hover .feature-line {
		transform: scaleX(1);
	}
</style>
