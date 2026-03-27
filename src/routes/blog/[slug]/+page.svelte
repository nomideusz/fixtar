<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { page } from '$app/stores';

	// For now, a single hardcoded article. In the future this will come from a CMS or DB.
	const articles: Record<string, {
		title: string;
		description: string;
		date: string;
		dateISO: string;
		tag: string;
		content: string[];
	}> = {
		'jak-wybrac-wiertarke-udarowa': {
			title: 'Jak wybrać wiertarkę udarową? Kompletny poradnik',
			description: 'Wiertarka udarowa to jedno z najważniejszych narzędzi w warsztacie. Podpowiadamy, na co zwrócić uwagę przy zakupie.',
			date: '25 marca 2026',
			dateISO: '2026-03-25',
			tag: 'Poradnik',
			content: [
				'Wiertarka udarowa to uniwersalne narzędzie, bez którego trudno sobie wyobrazić jakikolwiek remont czy prace wykończeniowe. Łączy funkcję wiercenia z mechanizmem udaru, dzięki czemu radzi sobie nie tylko z drewnem i metalem, ale również z betonem i cegłą.',

				'## Na co zwrócić uwagę przy wyborze?',

				'### 1. Moc silnika',
				'Dla prac domowych wystarczy wiertarka o mocy 600–800 W. Do profesjonalnego użytku szukaj modeli od 1000 W wzwyż. Pamiętaj — większa moc to nie tylko szybsze wiercenie, ale też mniejsze ryzyko przegrzania przy długich sesjach pracy.',

				'### 2. Energia udaru',
				'Mierzona w dżulach (J), określa siłę pojedynczego uderzenia. Do wiercenia w betonie potrzebujesz minimum 2,5 J. Profesjonalne młotowiertarki oferują nawet 8–12 J.',

				'### 3. Rodzaj uchwytu',
				'Dwa najpopularniejsze standardy to **SDS-Plus** (do lżejszych prac, wiertła 4–26 mm) i **SDS-Max** (ciężkie kucie i wiercenie, wiertła 12–52 mm). Do typowego warsztatu domowego SDS-Plus w zupełności wystarczy.',

				'### 4. Funkcje dodatkowe',
				'Szukaj modeli z regulacją obrotów, rewersem (przydatny do wykręcania wkrętów), ogranicznikiem momentu obrotowego i antywibracyjnym uchwytem. Te funkcje znacząco poprawiają komfort i bezpieczeństwo pracy.',

				'### 5. Zasilanie: sieciowa czy akumulatorowa?',
				'Wiertarki sieciowe oferują stałą moc i nieograniczony czas pracy. Akumulatorowe (18V lub 36V) dają mobilność, ale wymagają zapasowego akumulatora przy dłuższych pracach. Dla prac na budowie — akumulatorowa. Do warsztatu — sieciowa.',

				'## Popularne marki w FixTar',
				'W naszym sklepie znajdziesz wiertarki udarowe od sprawdzonych producentów: **Bavaria**, **Graphite**, **Yato** i **Magnum**. Każdy model jest testowany przed dodaniem do oferty, żebyś miał pewność, że kupujesz solidne narzędzie.',

				'## Podsumowanie',
				'Dobra wiertarka udarowa to inwestycja na lata. Nie oszczędzaj na mocy — lepiej mieć zapas niż męczyć się z za słabym narzędziem. Zwróć uwagę na uchwyt SDS-Plus, regulację obrotów i ergonomię. A jeśli masz wątpliwości — napisz do nas, pomożemy dobrać model do Twoich potrzeb.',
			]
		}
	};

	const slug = $derived($page.params.slug ?? '');
	const article = $derived(articles[slug]);

	$effect(() => {
		if (!article) {
			error(404, 'Artykuł nie został znaleziony');
		}
	});
</script>

<svelte:head>
	<title>{article ? article.title + ' — Blog FixTar' : 'Blog — FixTar'}</title>
	{#if article}
		<meta name="description" content={article.description} />
	{/if}
</svelte:head>

{#if article}
<div class="ft-container ft-section">
	<article class="article">
		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Nawigacja">
			<a href="/">Strona główna</a>
			<span aria-hidden="true">/</span>
			<a href="/blog">Blog</a>
			<span aria-hidden="true">/</span>
			<span>{article.title}</span>
		</nav>

		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<time datetime={article.dateISO}>{article.date}</time>
				<span class="article-tag">{article.tag}</span>
			</div>
			<h1 class="article-title">{article.title}</h1>
			<p class="article-lead">{article.description}</p>
		</header>

		<!-- Body -->
		<div class="article-body">
			{#each article.content as block}
				{#if block.startsWith('### ')}
					<h3>{block.slice(4)}</h3>
				{:else if block.startsWith('## ')}
					<h2>{block.slice(3)}</h2>
				{:else}
					<p>{@html block.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>
				{/if}
			{/each}
		</div>

		<!-- Footer CTA -->
		<div class="article-cta">
			<p>Szukasz wiertarki udarowej?</p>
			<div class="cta-links">
				<a href="/products">Przeglądaj ofertę</a>
				<a href="/contact" class="cta-secondary">Zapytaj o doradztwo</a>
			</div>
		</div>

		<div class="article-back">
			<a href="/blog">← Wróć do bloga</a>
		</div>
	</article>
</div>
{/if}

<style>
	.article {
		max-width: 680px;
	}

	/* ── Breadcrumb ── */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		color: var(--ft-text-faint);
		margin-bottom: 28px;
		flex-wrap: wrap;
	}

	.breadcrumb a {
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.breadcrumb a:hover {
		color: var(--ft-accent);
	}

	/* ── Header ── */
	.article-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	.article-meta time {
		font-size: 0.72rem;
		color: var(--ft-text-faint);
	}

	.article-tag {
		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-accent);
		background: var(--ft-frost);
		padding: 2px 8px;
		border-radius: 2px;
	}

	.article-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		line-height: 1.25;
	}

	.article-lead {
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--ft-text);
		margin-top: 12px;
	}

	/* ── Body ── */
	.article-body {
		margin-top: clamp(28px, 4vh, 40px);
		padding-top: clamp(28px, 4vh, 40px);
		border-top: 1px solid var(--ft-line);
	}

	.article-body h2 {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 32px;
		margin-bottom: 12px;
	}

	.article-body h3 {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-top: 24px;
		margin-bottom: 6px;
	}

	.article-body p {
		font-size: 0.88rem;
		line-height: 1.75;
		color: var(--ft-text);
		margin-bottom: 14px;
	}

	.article-body :global(strong) {
		font-weight: 600;
		color: var(--ft-dark);
	}

	/* ── CTA ── */
	.article-cta {
		margin-top: clamp(36px, 5vh, 48px);
		padding: 28px 32px;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		border: 1px solid var(--ft-line);
	}

	.article-cta p {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.cta-links {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.cta-links a {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ft-accent);
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.cta-links a:hover {
		opacity: 0.7;
	}

	.cta-secondary {
		color: var(--ft-text-muted) !important;
	}

	/* ── Back link ── */
	.article-back {
		margin-top: 24px;
	}

	.article-back a {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.article-back a:hover {
		color: var(--ft-accent);
	}
</style>
