<svelte:head>
	<title>Regulamin — FixTar</title>
</svelte:head>

<div class="ft-container ft-section">
	<h1 class="legal-title">Regulamin</h1>
	<p class="legal-updated">Ostatnia aktualizacja: 27 marca 2026</p>

	<div class="legal-body">
		<section>
			<h2>1. Postanowienia ogólne</h2>
			<p>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego FixTar, dostępnego pod adresem fixtar.vercel.app (dalej: "Sklep").</p>
			<p>Sklep prowadzony jest przez: FIXTAR Vsevolod Tarkhanov, ul. Kobierzyńska 63 lok. 77, 30-363 Kraków, NIP: 6762661281, REGON: 527557200.</p>
			<p>Sklep prowadzi sprzedaż elektronarzędzi i akcesoriów na terenie Rzeczypospolitej Polskiej.</p>
			<p>Korzystanie ze Sklepu oznacza akceptację niniejszego regulaminu.</p>
		</section>

		<section>
			<h2>2. Definicje</h2>
			<ul>
				<li><strong>Sprzedawca</strong> — właściciel sklepu FixTar.</li>
				<li><strong>Klient</strong> — osoba fizyczna, prawna lub jednostka organizacyjna składająca zamówienie w Sklepie.</li>
				<li><strong>Zamówienie</strong> — oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży.</li>
				<li><strong>Produkt</strong> — towar dostępny w ofercie Sklepu.</li>
			</ul>
		</section>

		<section>
			<h2>3. Składanie zamówień</h2>
			<p>Zamówienia można składać przez stronę internetową Sklepu 24 godziny na dobę, 7 dni w tygodniu.</p>
			<p>W celu złożenia zamówienia należy:</p>
			<ol>
				<li>Wybrać produkty i dodać je do koszyka.</li>
				<li>Wypełnić formularz zamówienia z danymi do dostawy.</li>
				<li>Wybrać metodę dostawy i płatności.</li>
				<li>Potwierdzić zamówienie klikając "Złóż zamówienie".</li>
			</ol>
			<p>Po złożeniu zamówienia Klient otrzyma potwierdzenie na podany adres email.</p>
		</section>

		<section>
			<h2>4. Ceny i płatności</h2>
			<p>Ceny produktów podane w Sklepie są cenami brutto (zawierają podatek VAT) i wyrażone są w złotych polskich (PLN).</p>
			<p>Dostępne metody płatności:</p>
			<ul>
				<li>Przelewy24 (BLIK, karta płatnicza, przelew online) — po aktywacji</li>
				<li>Płatność przy odbiorze (pobranie) — opłata dodatkowa 5,00 zł</li>
			</ul>
		</section>

		<section>
			<h2>5. Dostawa</h2>
			<p>Dostawa realizowana jest na terenie Polski za pośrednictwem firm kurierskich.</p>
			<p>Czas dostawy wynosi od 1 do 3 dni roboczych od momentu potwierdzenia płatności.</p>
			<p>Koszty dostawy są podane przy składaniu zamówienia. Darmowa dostawa obowiązuje dla zamówień powyżej 299 zł.</p>
		</section>

		<section>
			<h2>6. Prawo odstąpienia od umowy</h2>
			<p>Klient będący konsumentem ma prawo odstąpić od umowy w terminie 14 dni od dnia otrzymania towaru, bez podania przyczyny.</p>
			<p>Aby skorzystać z prawa odstąpienia, należy poinformować Sprzedawcę o swojej decyzji drogą mailową i odesłać towar w stanie nienaruszonym.</p>
			<p>Sprzedawca zwróci wszystkie otrzymane płatności w terminie 14 dni od dnia otrzymania zwróconego towaru.</p>
		</section>

		<section>
			<h2>7. Reklamacje</h2>
			<p>Sprzedawca jest zobowiązany dostarczyć towar wolny od wad.</p>
			<p>Reklamacje należy składać drogą mailową. Sprzedawca rozpatrzy reklamację w terminie 14 dni od daty jej otrzymania.</p>
		</section>

		<section>
			<h2>8. Postanowienia końcowe</h2>
			<p>Sprzedawca zastrzega sobie prawo do zmiany regulaminu. Zmiany wchodzą w życie z dniem ich opublikowania na stronie Sklepu.</p>
			<p>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego.</p>
		</section>
	</div>
</div>

<style>
	.legal-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
	}

	.legal-updated {
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		margin-top: 6px;
		margin-bottom: clamp(28px, 4vh, 40px);
	}

	.legal-body {
		max-width: 720px;
	}

	.legal-body section {
		margin-bottom: 32px;
	}

	.legal-body h2 {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-bottom: 10px;
	}

	.legal-body p {
		font-size: 0.88rem;
		line-height: 1.7;
		color: var(--ft-text);
		margin-bottom: 8px;
	}

	.legal-body ul,
	.legal-body ol {
		font-size: 0.88rem;
		line-height: 1.7;
		color: var(--ft-text);
		padding-left: 20px;
		margin-bottom: 8px;
	}

	.legal-body li {
		margin-bottom: 4px;
	}
</style>
