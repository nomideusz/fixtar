# FixTar + BaseLinker — Przewodnik

## Spis treści

1. [Jak dziala integracja](#jak-dziala-integracja)
2. [Produkty](#produkty)
3. [Promocje i przeceny](#promocje-i-przeceny)
4. [Zamowienia](#zamowienia)
5. [Metody dostawy](#metody-dostawy)
6. [Platnosci (Przelewy24)](#platnosci-przelewy24)
7. [Panel administracyjny](#panel-administracyjny)
8. [Zmienne srodowiskowe](#zmienne-srodowiskowe)
9. [FAQ](#faq)

---

## Jak dziala integracja

BaseLinker jest centralnym zrodlem danych dla sklepu FixTar:

```
BaseLinker (magazyn, ceny, produkty)
    |
    |-- sync --> Turso DB (kopia lokalna) --> Sklep FixTar (frontend)
    |
    |<-- push -- Zamowienia ze sklepu
```

- **Produkty** sa synchronizowane z BaseLinker do lokalnej bazy danych (Turso)
- **Zamowienia** zlozrone w sklepie sa przesylane do BaseLinker
- **Statusy zamowien** sa pobierane z BaseLinker i wyswietlane klientowi
- **Ceny i stany magazynowe** — zrodlem prawdy jest zawsze BaseLinker

---

## Produkty

### Synchronizacja

Produkty sa pobierane z wybranego inventory w BaseLinker i zapisywane w bazie Turso.

**Co jest synchronizowane:**
- Nazwa, opis (HTML jest usuwany automatycznie)
- Cena (z domyslnej grupy cenowej)
- Zdjecia (pierwszy obraz z listy)
- Kategoria
- Stan magazynowy (suma ze wszystkich magazynow)
- SKU, EAN, waga
- Tagi

**Jak uruchomic sync:**
1. Wejdz na `/admin/baselinker`
2. Wybierz inventory z listy rozwijanej
3. Kliknij "Dry Run" aby zobaczyc co sie zmieni (bez zapisu)
4. Kliknij "Synchronizuj" aby zapisac produkty do bazy

**Lub przez API:**
```
POST /api/baselinker/sync
Body: { "inventoryId": 12345, "dryRun": false }
```

### Dodawanie nowych produktow

1. Dodaj produkt w BaseLinker (Produkty > Magazyn)
2. Wypelnij: nazwe, opis, cene, zdjecia, kategorie, stan magazynowy
3. Uruchom synchronizacje w panelu admina
4. Produkt pojawi sie w sklepie automatycznie

### Edycja produktow

Wszystkie zmiany robimy **w BaseLinker**, nie w sklepie:
- Zmiana ceny → BaseLinker > Produkty > edytuj cene
- Zmiana opisu → BaseLinker > Produkty > edytuj opis
- Zmiana zdjecia → BaseLinker > Produkty > edytuj zdjecia
- Po zmianach: uruchom sync

### Usuwanie produktow

Usun produkt z BaseLinker i uruchom sync — produkt zostanie zaktualizowany (stan = 0).

---

## Promocje i przeceny

Promocje sa w pelni zarzadzane przez BaseLinker. Sklep automatycznie wyswietla produkty z obnizzona cena na stronie `/deals`.

### Jak dodac promocje

1. W BaseLinker, wejdz do edycji produktu
2. Ustaw **cene regularna** (wyzssa) w polu `original_price` / cena poczatkowa
3. Ustaw **cene promocyjna** (nizssa) w polu ceny
4. Uruchom synchronizacje

**Wynik w sklepie:**
- Produkt pojawi sie na stronie `/deals`
- Wyswietli sie przekreslona cena oryginalna + cena promocyjna
- Automatyczny badge z procentem rabatu (np. "-25%")
- Na stronie glownej pojawi sie baner "Promocje — X produktow w nizszej cenie"

### Jak zakonczyc promocje

1. W BaseLinker, usun cene poczatkowa (original_price) lub ustaw ja rowna cenie sprzedazy
2. Uruchom sync
3. Produkt zniknie ze strony `/deals`

### Logika wyswietlania

- Strona `/deals` pokazuje TYLKO produkty gdzie `original_price > price`
- Sortowanie: najwyzszy rabat procentowy na gorze
- Baner na stronie glownej: widoczny gdy jest >= 1 produkt w promocji
- Gdy brak promocji: baner zmienia sie na "Darmowa dostawa od 299 zl"

---

## Zamowienia

### Przeplyw zamowienia

```
1. Klient sklada zamowienie w sklepie
2. Zamowienie zapisywane w bazie FixTar (status: pending)
3. Klient platci (P24 redirect lub pobranie)
4. Webhook P24 potwierdza platnosc → status: processing
5. Zamowienie przesylane do BaseLinker (pushOrder)
6. Realizacja w BaseLinker (pakowanie, wyslanie)
7. Statusy synchronizowane zwrotnie do sklepu
```

### Statusy zamowien

Sklep mapuje statusy BaseLinker na wewnetrzne:

| Status w sklepie | Slowa kluczowe BaseLinker |
|---|---|
| `delivered` | dostarczono, odebrano |
| `shipped` | wyslano, nadano |
| `processing` | w realizacji, oplacono, kompletowanie |
| `cancelled` | anulowano, zwrot |
| `pending` | nowe, oczekujace |

Mapowanie jest automatyczne na podstawie polskich nazw statusow w BaseLinker.

### Zamowienia z Allegro / Temu

Zamowienia z Allegro i Temu trafiaja do BaseLinker automatycznie. Gdy klient sklepu FixTar zaloguje sie tym samym emailem, zobaczy rowniez te zamowienia w zakladce "Moje zamowienia" (pobierane z BaseLinker po adresie email).

### pushOrder — tryb dev

Aktualnie `pushOrder` jest w trybie **mock** — nie tworzy prawdziwych zamowien w BaseLinker. Jest to celowe, poniewaz BaseLinker jest polaczony z live Allegro.

Aby wlaczyc: edytuj `src/lib/services/baselinker.ts`, metoda `pushOrder()` — odkomentuj prawdziwe wywolanie API.

---

## Metody dostawy

Metody dostawy sa przechowywane w bazie danych (tabela `shipping_methods`), nie w BaseLinker.

### Aktualne metody

| Metoda | Cena | Darmowa od | Czas | Nazwa w BL |
|---|---|---|---|---|
| InPost Paczkomat | 14,99 zl | 299 zl | ~2 dni | Inpost |
| Kurier DPD | 16,99 zl | 299 zl | ~2 dni | DPD |
| ORLEN Paczka | 10,99 zl | 299 zl | ~3 dni | Allegro Automat ORLEN Paczka |

### Zmiana cen / dodawanie metod

Edytuj bezposrednio w bazie Turso:

```sql
-- Zmiana ceny (w groszach!)
UPDATE shipping_methods SET cost = 1299 WHERE id = 'inpost-paczkomat';

-- Zmiana progu darmowej dostawy
UPDATE shipping_methods SET free_shipping_threshold = 19900 WHERE id = 'dpd-kurier';

-- Dodanie nowej metody
INSERT INTO shipping_methods (id, name, description, cost, free_shipping_threshold, estimated_days, baselinker_name, enabled, sort_order)
VALUES ('dhl-kurier', 'Kurier DHL', 'Dostawa DHL', 1899, 29900, 2, 'DHL', 1, 4);

-- Wylaczenie metody (nie usuwaj — wylacz)
UPDATE shipping_methods SET enabled = 0 WHERE id = 'orlen-paczka';
```

**Wazne:** Ceny i progi sa w groszach (1499 = 14,99 zl).

Kolumna `baselinker_name` mapuje nazwe metody dostawy do pola `delivery_method` w zamowieniu BaseLinker.

---

## Platnosci (Przelewy24)

### Aktualny stan

- **Platnosc przy odbiorze (COD)** — dziala, oplata +5 zl
- **Przelewy24 (BLIK, karta, przelew)** — gotowe, czeka na dane dostepu

### Konfiguracja P24

1. Zaloguj sie do panelu Przelewy24: https://panel.przelewy24.pl
2. Pobierz dane:
   - Merchant ID (ID sprzedawcy)
   - POS ID (zwykle taki sam jak Merchant ID)
   - Klucz CRC
   - Klucz API
3. Dodaj do pliku `.env`:

```env
P24_MERCHANT_ID=123456
P24_POS_ID=123456
P24_CRC=abcdef1234567890
P24_API_KEY=abcdef1234567890abcdef
```

4. Zrestartuj serwer
5. W checkoucie automatycznie pojawia sie BLIK, karta i przelew online

### Webhook P24

Przelewy24 musi byc skonfigurowane do wysylania webhookow na:

```
https://twoja-domena.pl/api/webhooks/payment?provider=przelewy24
```

Ustaw ten URL w panelu P24 jako "URL statusu transakcji".

### Przeplyw platnosci

```
1. Klient wybiera BLIK/karte/przelew w checkoucie
2. Sklep rejestruje transakcje w P24 API
3. P24 zwraca URL → klient jest przekierowany
4. Klient platci na stronie P24
5. P24 wysyla webhook do sklepu → zamowienie potwierdzone
6. Klient wraca na /checkout/success
```

### Testowanie

Bez danych P24 w `.env`, jedyna dostepna metoda to "Platnosc przy odbiorze". Po dodaniu danych, metody online pojawiaja sie automatycznie — nie trzeba zmieniac kodu.

---

## Panel administracyjny

### /admin/baselinker

- Sprawdzanie statusu polaczenia z BaseLinker
- Wybor inventory do synchronizacji
- Dry run (podglad zmian bez zapisu)
- Pelna synchronizacja produktow

### Dostep do bazy

Baza Turso jest dostepna przez:
- Turso CLI: `turso db shell fixtar`
- Dashboard: https://turso.tech/app

---

## Zmienne srodowiskowe

| Zmienna | Wymagana | Opis |
|---|---|---|
| `TURSO_DATABASE_URL` | Tak | URL bazy danych Turso |
| `TURSO_AUTH_TOKEN` | Tak | Token autoryzacji Turso |
| `BASELINKER_API_TOKEN` | Tak | Token API BaseLinker (Ustawienia > API) |
| `P24_MERCHANT_ID` | Nie* | ID sprzedawcy Przelewy24 |
| `P24_POS_ID` | Nie* | ID punktu sprzedazy (zwykle = Merchant ID) |
| `P24_CRC` | Nie* | Klucz CRC do podpisywania transakcji |
| `P24_API_KEY` | Nie* | Klucz API do autoryzacji requestow |
| `BETTER_AUTH_SECRET` | Tak | Klucz do podpisywania sesji |

*Bez danych P24 sklep dziala, ale bez platnosci online.

---

## FAQ

**P: Jak czesto synchronizowac produkty?**
O: Po kazdej zmianie w BaseLinker (ceny, opisy, nowe produkty). Mozna tez ustawic cron co kilka godzin.

**P: Czy edycja produktu w sklepie nadpisze dane?**
O: Nie ma mozliwosci edycji produktow w sklepie. Jedynym zrodlem jest BaseLinker. Nastepny sync nadpisze ewentualne reczne zmiany w bazie.

**P: Co jezeli klient zamowi produkt ktory jest juz wyprzedany?**
O: Stany magazynowe sa aktualne na moment ostatniego synca. Dla krytycznych produktow, synchronizuj czesciej.

**P: Czy zamowienia z Allegro widac w sklepie?**
O: Tak — jezeli klient uzyje tego samego adresu email. Zamowienia sa pobierane z BaseLinker i wyswietlane w "Moje zamowienia".

**P: Jak zmienic cene dostawy?**
O: Edytuj tabele `shipping_methods` w bazie Turso. Ceny sa w groszach.

**P: Jak dodac nowa metode platnosci?**
O: Aktualnie obslugiwane: Przelewy24 (BLIK, karta, przelew) i COD. Dodanie PayU lub innego providera wymaga implementacji nowego `PaymentProvider` w `src/lib/services/payment/`.
