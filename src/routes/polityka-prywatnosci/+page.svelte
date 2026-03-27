<svelte:head>
	<title>Polityka prywatności — FixTar</title>
</svelte:head>

<div class="ft-container ft-section">
	<h1 class="legal-title">Polityka prywatności</h1>
	<p class="legal-updated">Ostatnia aktualizacja: 27 marca 2026</p>

	<div class="legal-body">
		<section>
			<h2>1. Administrator danych</h2>
			<p>Administratorem danych osobowych jest właściciel sklepu internetowego FixTar (dalej: "Administrator").</p>
			<p>Kontakt z Administratorem możliwy jest za pośrednictwem formularza kontaktowego na stronie lub drogą mailową.</p>
		</section>

		<section>
			<h2>2. Zakres zbieranych danych</h2>
			<p>W ramach korzystania ze Sklepu zbieramy następujące dane:</p>
			<ul>
				<li><strong>Dane konta</strong> — imię, adres email, hasło (zaszyfrowane).</li>
				<li><strong>Dane zamówienia</strong> — imię, nazwisko, adres dostawy, numer telefonu, adres email, NIP (opcjonalnie).</li>
				<li><strong>Dane płatności</strong> — dane płatnicze są przetwarzane wyłącznie przez operatora płatności (Przelewy24) i nie są przechowywane w naszych systemach.</li>
				<li><strong>Dane techniczne</strong> — adres IP, typ przeglądarki, system operacyjny, w celach bezpieczeństwa i diagnostyki.</li>
			</ul>
		</section>

		<section>
			<h2>3. Cel przetwarzania danych</h2>
			<p>Dane osobowe przetwarzane są w celu:</p>
			<ul>
				<li>Realizacji zamówień i dostawy produktów.</li>
				<li>Obsługi konta użytkownika.</li>
				<li>Kontaktu w sprawie zamówienia.</li>
				<li>Wysyłki newslettera (za zgodą użytkownika).</li>
				<li>Wypełnienia obowiązków prawnych (np. wystawienie faktury).</li>
			</ul>
		</section>

		<section>
			<h2>4. Podstawy prawne przetwarzania</h2>
			<ul>
				<li><strong>Art. 6 ust. 1 lit. b RODO</strong> — wykonanie umowy (realizacja zamówienia).</li>
				<li><strong>Art. 6 ust. 1 lit. a RODO</strong> — zgoda (newsletter, marketing).</li>
				<li><strong>Art. 6 ust. 1 lit. c RODO</strong> — obowiązek prawny (dokumentacja podatkowa).</li>
				<li><strong>Art. 6 ust. 1 lit. f RODO</strong> — prawnie uzasadniony interes (bezpieczeństwo, analityka).</li>
			</ul>
		</section>

		<section>
			<h2>5. Udostępnianie danych</h2>
			<p>Dane osobowe mogą być udostępniane:</p>
			<ul>
				<li>Firmom kurierskim — w celu realizacji dostawy (InPost, DPD, ORLEN Paczka).</li>
				<li>Operatorowi płatności — Przelewy24 (PayPro S.A.).</li>
				<li>Dostawcy usług hostingowych — Vercel, Turso.</li>
			</ul>
			<p>Dane nie są przekazywane do państw trzecich poza EOG, chyba że wymaga tego działanie usług technicznych (np. serwery Vercel), z zachowaniem odpowiednich zabezpieczeń.</p>
		</section>

		<section>
			<h2>6. Okres przechowywania</h2>
			<ul>
				<li>Dane konta — do momentu usunięcia konta przez użytkownika.</li>
				<li>Dane zamówień — 5 lat od końca roku podatkowego (obowiązek rachunkowy).</li>
				<li>Dane marketingowe — do wycofania zgody.</li>
			</ul>
		</section>

		<section>
			<h2>7. Prawa użytkownika</h2>
			<p>Każdy użytkownik ma prawo do:</p>
			<ul>
				<li>Dostępu do swoich danych osobowych.</li>
				<li>Sprostowania nieprawidłowych danych.</li>
				<li>Usunięcia danych ("prawo do bycia zapomnianym").</li>
				<li>Ograniczenia przetwarzania.</li>
				<li>Przenoszenia danych.</li>
				<li>Wniesienia sprzeciwu wobec przetwarzania.</li>
				<li>Wycofania zgody w dowolnym momencie.</li>
				<li>Wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
			</ul>
			<p>W celu realizacji powyższych praw prosimy o kontakt drogą mailową.</p>
		</section>

		<section>
			<h2>8. Pliki cookies</h2>
			<p>Sklep wykorzystuje pliki cookies w celu:</p>
			<ul>
				<li>Utrzymania sesji użytkownika (logowanie).</li>
				<li>Zapamiętania zawartości koszyka.</li>
				<li>Zapamiętania preferencji (motyw, język).</li>
			</ul>
			<p>Nie stosujemy cookies śledzących ani reklamowych. Użytkownik może zarządzać plikami cookies w ustawieniach przeglądarki.</p>
		</section>

		<section>
			<h2>9. Bezpieczeństwo</h2>
			<p>Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych, w tym:</p>
			<ul>
				<li>Szyfrowanie połączenia (SSL/TLS).</li>
				<li>Hashowanie haseł.</li>
				<li>Ograniczony dostęp do danych.</li>
			</ul>
		</section>

		<section>
			<h2>10. Zmiany polityki prywatności</h2>
			<p>Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności. O istotnych zmianach użytkownicy zostaną poinformowani za pośrednictwem strony Sklepu.</p>
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
