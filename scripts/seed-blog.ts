/**
 * Seed blog_posts table in Turso.
 * Run: npx tsx scripts/seed-blog.ts
 */
import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!
});

// Create table
await client.execute(`
	CREATE TABLE IF NOT EXISTS blog_posts (
		id TEXT PRIMARY KEY,
		slug TEXT NOT NULL UNIQUE,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		tag TEXT NOT NULL DEFAULT 'Poradnik',
		content TEXT NOT NULL,
		publish_at INTEGER NOT NULL,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL
	)
`);

console.log('✓ blog_posts table created');

const now = Date.now();
const DAY = 86_400_000;

interface Post {
	id: string;
	slug: string;
	title: string;
	description: string;
	tag: string;
	content: string[];
	publishAt: number;
}

const posts: Post[] = [
	{
		id: 'blog-001',
		slug: 'jak-wybrac-wiertarke-udarowa',
		title: 'Jak wybrać wiertarkę udarową? Kompletny poradnik',
		description: 'Wiertarka udarowa to jedno z najważniejszych narzędzi w warsztacie. Podpowiadamy, na co zwrócić uwagę przy zakupie.',
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
			'Dobra wiertarka udarowa to inwestycja na lata. Nie oszczędzaj na mocy — lepiej mieć zapas niż męczyć się z za słabym narzędziem. Zwróć uwagę na uchwyt SDS-Plus, regulację obrotów i ergonomię. A jeśli masz wątpliwości — napisz do nas, pomożemy dobrać model do Twoich potrzeb.'
		],
		publishAt: now - 2 * DAY // already published
	},
	{
		id: 'blog-002',
		slug: 'konserwacja-elektronarzedzi-zima',
		title: 'Jak dbać o elektronarzędzia zimą? 7 praktycznych zasad',
		description: 'Mróz, wilgoć i kondensacja to wrogowie Twoich narzędzi. Sprawdź, jak prawidłowo przechowywać i konserwować sprzęt w sezonie zimowym.',
		tag: 'Konserwacja',
		content: [
			'Zima to trudny czas dla elektronarzędzi — zwłaszcza tych przechowywanych w nieogrzewanych garażach czy magazynach. Niska temperatura, wilgoć i skoki ciśnienia mogą prowadzić do korozji, uszkodzeń akumulatorów i awarii mechanizmów.',
			'## 7 zasad zimowej konserwacji',
			'### 1. Przechowuj w suchym miejscu',
			'Wilgoć to największy wróg elektronarzędzi. Jeśli musisz trzymać sprzęt w garażu, użyj szczelnych skrzynek lub pojemników z pochłaniaczami wilgoci. Unikaj bezpośredniego kontaktu narzędzi z betonową podłogą.',
			'### 2. Akumulatory przechowuj w cieple',
			'Baterie litowo-jonowe tracą pojemność w niskich temperaturach i mogą ulec trwałemu uszkodzeniu poniżej -10°C. Przechowuj akumulatory w domu, naładowane do ok. 50–70%. Nigdy nie ładuj zmrożonego akumulatora.',
			'### 3. Regularnie smaruj ruchome części',
			'Przed zimowym przechowywaniem nałóż cienką warstwę oleju maszynowego na prowadnice, wrzeciona i inne ruchome elementy. Zapobiegnie to korozji i ułatwi rozruch na wiosnę.',
			'### 4. Czyść po każdym użyciu',
			'Pył, trociny i odpryski betonu przyspieszają korozję. Po pracy wyczyść narzędzie sprężonym powietrzem lub miękką szczotką. Nie używaj wody — nawet „odrobina" może dostać się do wnętrza.',
			'### 5. Sprawdź przewody i wtyczki',
			'Mróz powoduje twardnienie osłon kabli, co może prowadzić do mikropęknięć izolacji. Przed sezonem sprawdź wzrokowo wszystkie przewody. Uszkodzone wymień natychmiast.',
			'### 6. Nie uruchamiaj na mrozie',
			'Silniki elektryczne potrzebują kilku minut na rozgrzanie, gdy temperatura otoczenia jest bliska zeru. Przed intensywną pracą pozwól narzędziu popracować na wolnych obrotach przez 1–2 minuty.',
			'### 7. Przeglądy przed sezonem',
			'Wiosna to idealny czas na serwis. Wymień zużyte szczotki węglowe, wyczyść filtry powietrza i sprawdź stan łożysk. Lepiej zapobiegać niż naprawiać.',
			'## Podsumowanie',
			'Kilka minut poświęconych na konserwację potrafi przedłużyć życie narzędzia o lata. Szczególnie akumulatory — to najdroższa część zestawu i najwrażliwsza na warunki przechowywania.'
		],
		publishAt: now - 1 * DAY
	},
	{
		id: 'blog-003',
		slug: 'szlifierka-katowa-zastosowania',
		title: 'Szlifierka kątowa — 10 zastosowań, o których nie wiedziałeś',
		description: 'Szlifierka kątowa to nie tylko cięcie metalu. Odkryj 10 nieoczywistych zastosowań tego wszechstronnego narzędzia.',
		tag: 'Poradnik',
		content: [
			'Szlifierka kątowa (popularnie „flex") to jedno z najczęściej kupowanych elektronarzędzi w Polsce. Większość osób kojarzy ją wyłącznie z cięciem metalu — a to zaledwie wierzchołek góry lodowej.',
			'## 10 zastosowań szlifierki kątowej',
			'### 1. Cięcie metalu',
			'Klasyka — tarcze tnące do metalu (125 mm lub 230 mm) poradzą sobie z prętami, rurami, kątownikami i blachą. Zawsze używaj osłony i okularów ochronnych.',
			'### 2. Cięcie płytek ceramicznych',
			'Z diamentową tarczą do płytek szlifierka tnie gres, terakotę i klinkier szybciej niż większość przecinarek stołowych. Idealna do docinania na budowie.',
			'### 3. Szlifowanie spawów',
			'Tarcza lamelkowa (listkowa) wygładza spoiny spawalnicze do poziomu lustrzanego. Dostępne gradacje od P40 (zgrubne) do P120 (wykończeniowe).',
			'### 4. Usuwanie rdzy',
			'Szczotka druciana na trzpieniu zamontowana w szlifierce skutecznie usuwa rdzę z konstrukcji stalowych, ogrodzeń i bram. Szybciej niż ręczne szlifowanie i efektywniej niż preparaty chemiczne.',
			'### 5. Cięcie betonu i cegły',
			'Diamentowa tarcza segmentowa tnie beton, cegłę i bloczki gazobetonowe. Przy większych pracach rozważ przystawkę do odsysania pyłu.',
			'### 6. Polerowanie',
			'Z filcową lub gąbkową nakładką polerską szlifierka zamienia się w polerkę. Nadaje się do lakieru samochodowego, kamienia naturalnego i stali nierdzewnej.',
			'### 7. Fazowanie krawędzi',
			'Tarcza lamelkowa pod kątem 45° tworzy równomierne fazy na krawędziach blach i profili stalowych — przygotowanie pod spawanie.',
			'### 8. Obróbka drewna',
			'Specjalne tarcze rzeźbiarskie (np. typu „lancelot") pozwalają na szybkie kształtowanie drewna. Uwaga — wymagają doświadczenia i szczególnej ostrożności.',
			'### 9. Cięcie rur PVC',
			'W instalacjach kanalizacyjnych szlifierka z cienką tarczą tnącą (1 mm) precyzyjnie docina rury PVC i PP bez ich deformowania.',
			'### 10. Ostrzenie narzędzi',
			'Z odpowiednią tarczą szlifierską naostrysz siekiery, motyki, łopaty i noże do kosiarek. Szybciej niż na tradycyjnym kole szlifierskim.',
			'## Bezpieczeństwo',
			'Szlifierka kątowa to narzędzie o wysokim ryzyku urazu. **Zawsze** używaj: okularów ochronnych, rękawic, osłony tarczy i ochronników słuchu. Nigdy nie zdejmuj osłony — to najczęstsza przyczyna poważnych wypadków.'
		],
		publishAt: now
	},
	{
		id: 'blog-004',
		slug: 'akumulatorowe-vs-sieciowe',
		title: 'Akumulatorowe czy sieciowe? Który typ narzędzi wybrać',
		description: 'Porównujemy zalety i wady narzędzi akumulatorowych i sieciowych. Sprawdź, które lepiej sprawdzą się w Twojej pracy.',
		tag: 'Porównanie',
		content: [
			'Jeszcze 10 lat temu odpowiedź była prosta — narzędzia sieciowe były zdecydowanie mocniejsze. Dziś, dzięki rozwojowi technologii litowo-jonowej, granica się zaciera. Ale nie zniknęła całkowicie.',
			'## Narzędzia akumulatorowe',
			'### Zalety',
			'**Mobilność** — brak kabla to wolność. Pracujesz na dachu, w ogrodzie, na budowie bez dostępu do prądu. Jeden akumulator 18V może zasilać kilkanaście narzędzi tego samego producenta.',
			'**Bezpieczeństwo** — brak kabla eliminuje ryzyko potknięcia i porażenia. Mniej ograniczeń w pracy na wysokości i w wilgotnych warunkach.',
			'**Szybki start** — wkładasz akumulator i pracujesz. Żadnego szukania przedłużacza, rozwijania kabla, szukania gniazdka.',
			'### Wady',
			'**Ograniczony czas pracy** — nawet najlepsze akumulatory 5.0 Ah wyczerpują się po 30–60 minutach intensywnej pracy. Rozwiązanie: drugi akumulator.',
			'**Wyższa cena** — zestaw z dwoma akumulatorami i ładowarką kosztuje 30–50% więcej niż odpowiednik sieciowy. Akumulatory to najdroższa część zestawu.',
			'**Mniejsza moc szczytowa** — w ekstremalnych zastosowaniach (np. ciągłe wiercenie w żelbecie) narzędzie sieciowe wciąż ma przewagę.',
			'## Narzędzia sieciowe',
			'### Zalety',
			'**Stała moc** — silnik zawsze pracuje z pełną mocą. Nie ma spadku wydajności przy rozładowaniu baterii. Idealne do długich, wymagających sesji.',
			'**Niższa cena wejścia** — płacisz za narzędzie, nie za akumulatory. Różnica potrafi wynosić kilkaset złotych.',
			'**Nieograniczony czas pracy** — dopóki jest prąd w gniazdku, narzędzie pracuje. Bez przerw na ładowanie.',
			'### Wady',
			'**Kabel** — ogranicza zasięg, plącze się, wymaga przedłużacza. Na budowie bez prądu — bezużyteczne.',
			'**Waga** — paradoksalnie, silniki sieciowe z transformatorem bywają cięższe od akumulatorowych odpowiedników.',
			'## Nasza rekomendacja',
			'**Warsztat domowy** — zacznij od sieciowych. Niższa cena, większa moc, brak martwienia się o akumulatory.',
			'**Praca w terenie** — bezwzględnie akumulatorowe. Mobilność jest bezcenna na budowie, przy remoncie dachu czy pracach ogrodowych.',
			'**Profesjonalista** — oba typy. Akumulatorowe do codziennej pracy, sieciowe jako backup do najtrudniejszych zadań.'
		],
		publishAt: now + 3 * DAY // scheduled for 3 days from now
	},
	{
		id: 'blog-005',
		slug: 'bezpieczenstwo-na-budowie',
		title: 'BHP na budowie — 5 zasad, które mogą uratować życie',
		description: 'Co roku w Polsce dochodzi do tysięcy wypadków na budowach. Większości można było uniknąć. Poznaj 5 kluczowych zasad bezpieczeństwa.',
		tag: 'Bezpieczeństwo',
		content: [
			'Według danych GUS, budownictwo to jedna z najbardziej wypadkogennych branż w Polsce. Co roku dochodzi do ponad 5000 wypadków, z których część kończy się trwałym kalectwem lub śmiercią. Większość z nich wynika z zaniedbania podstawowych zasad BHP.',
			'## 5 kluczowych zasad',
			'### 1. Środki ochrony indywidualnej (ŚOI)',
			'To nie sugestia — to obowiązek. **Kask** chroni przed spadającymi przedmiotami. **Okulary** przed odpryskami. **Rękawice** przed skaleczeniami. **Obuwie ochronne** (S3) przed przebiciu podeszwy gwoździem. **Ochronniki słuchu** przy pracy z głośnymi narzędziami (>85 dB).',
			'### 2. Sprawdzaj narzędzia przed użyciem',
			'Pęknięta tarcza w szlifierce może eksplodować z prędkością 80 m/s. Uszkodzony kabel grozi porażeniem. Luźny uchwyt wiertarki — utratą kontroli. Przed każdym użyciem: oględziny wizualne, test na biegu jałowym, sprawdzenie osłon.',
			'### 3. Zabezpieczaj stanowisko pracy',
			'Przy pracach na wysokości powyżej 1 metra — barierki lub szelki bezpieczeństwa. Przy cięciu — stabilne podparcie materiału. Przy wierceniu nad głową — okulary + maska przeciwpyłowa. Utrzymuj porządek — potkniecie się o kabel to jedna z najczęstszych przyczyn upadków.',
			'### 4. Znaj ograniczenia swoich narzędzi',
			'Każde narzędzie ma parametry, których nie wolno przekraczać. Tarcza tnąca 125 mm nie jest przeznaczona do szlifierki 230 mm. Wiertło do drewna nie nadaje się do betonu. Przedłużacz o zbyt małym przekroju zapłonie przy obciążeniu 2000 W. Czytaj instrukcje — serio.',
			'### 5. Pierwsza pomoc w zasięgu ręki',
			'Apteczka budowlana powinna zawierać: opatrunki jałowe, bandaże elastyczne, plaster z opatrunkiem, nożyczki, rękawiczki jednorazowe, koc termiczny. Każdy na budowie powinien znać numer 112 i podstawy tamowania krwotoku.',
			'## Inwestycja w bezpieczeństwo',
			'Dobry kask kosztuje 50 zł. Okulary ochronne — 20 zł. Rękawice — 15 zł. Razem to mniej niż jedna wizyta na izbie przyjęć. Nie oszczędzaj na ŚOI — to jedyna inwestycja, która dosłownie może uratować Ci życie.'
		],
		publishAt: now + 7 * DAY // scheduled for 1 week from now
	}
];

// Upsert posts
for (const post of posts) {
	await client.execute({
		sql: `INSERT OR REPLACE INTO blog_posts (id, slug, title, description, tag, content, publish_at, created_at, updated_at)
		      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			post.id,
			post.slug,
			post.title,
			post.description,
			post.tag,
			JSON.stringify(post.content),
			post.publishAt,
			now,
			now
		]
	});
	const status = post.publishAt <= now ? '✓ opublikowany' : `⏳ zaplanowany na ${new Date(post.publishAt).toLocaleDateString('pl-PL')}`;
	console.log(`  ${status} — ${post.title}`);
}

console.log(`\n✓ ${posts.length} artykułów zapisanych w Turso`);
