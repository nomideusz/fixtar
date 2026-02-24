XML
Integracja bezpośrednia poprzez plik XML

Moduł pobierania plików XML znajduje się pod adresem: https://xml.qoltec.pl/client

Oczekuje on zmiennej POST o kluczu 'code' i wartości takiej, jak klucz danego klienta (wartość klucza każdy klient otrzymuje od nas indywidualnie).

Odpowiada wywoływanym plikiem XML.

Przykład wywołania CURL w PHP:

<?php

$ch = curl_init();

curl_setopt($ch,CURLOPT_URL,"https://xml.qoltec.pl/client/");

curl_setopt($ch, CURLOPT_POST, 1);

curl_setopt($ch,CURLOPT_POSTFIELDS,"code=LM8YLGcA9LAmDBq1PKrTtOIT6SelbUoR");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$xml = curl_exec($ch);

curl_close ($ch);

//mamy xmla w zmiennej $xml;

echo $xml;

?>

 Struktura wygenerowanego pliku XML

Legenda:

nazwy elementów

nazwy atrybutów

wartości danych

 

<products photo="link do pobierania obrazów" files="link do pobierania plików produktów">

<categories>

Rodzic elementów kategorii głównych, zawiera elementy w postaci:

<cat id="id_kategorii">Nazwa_kategorii</cat>

</categories>

<subcategories>

Rodzic elementów podkategorii, zawiera elementy kategorii podrzędnych w postaci:

<cat id="id_podkategorii"parent="id_kategorii_nadrzędnej">Nazwa_podkategorii</cat>

</subcategories>

<featurestext>

Rodzic elementów parametrów, zawiera elementy nazw i id parametrów w postaci:

<feat id="id_parametru">Nazwa_parametru</feat>

</featurestext>

<featurestextarea>

Rodzic elementów parametrów, dla których typ w bazie danych oznaczony jest jako 'textarea' zawiera elementy nazw i id parametrów w postaci:

<feat id="id_parametru">Nazwa_parametru</feat>

</featurestextarea>

 Produkty posiadają strukturę następującą:

<product code="kod_produktu">

<url>link do produktu</url>

<name>nazwa produktu</name>

<ean>kod ean</ean>

<price>cena netto klienta</price>

<quan>ilość produktów przeliczona wg ustawień dla tego klienta</quan>

<uom>jednostka miary</uom>

<vat> stawka VAT</vat>

<shortdescription>krótki opis </shortdescription>

<descriptions>

Rodzic elementów szczegółowych opisów, zawiera elementy w postaci:

<description name="nagłówek sekcji opisu">tresć opisu</description>

</descriptions>

<features>    

Rodzic elementów danych technicznych, zawiera elementy w postaci:

<feature id="id nazwy danych - podane wyżej">wartość danych</feature>

</features>

<images>

Rodzic elementów obrazów, zawiera elementy w postaci:

<img>nazwa pliku obrazu</img>

Aby pobrać dany obraz należy odczytać katalog obrazów z  atrybutu "photo" elementu <products>. Pierwszy obraz na liście elementów jest obrazem głównym.

</images>

<categories>

Element zawiera wszyskie id kategorii podrzędnych, do których należy produkt, oddzielone  przecinkami.

</categories>

<table>serializowana ewentualna tabela produktu (jeżeli istnieje)</table>

<shortdata>

Rodzic elementów dodatkowych danych produktu (jeżeli istnieją). Zawiera elementy w postaci:

<data>

<title>tytuł/nagłówek danych</title>

<data>dane</data>

</data>

</shortdata>

<files>

Rodzic elementów plików do pobrania dla produktu (jeżeli istnieją). Zawiera elementy w postaci:

<file><title>Tytuł pliku</title>nazwa pliku do pobrania</file>

Aby pobrać plik należy odczytać główny katalog plików z atrybutu  "files" elementu <products>.

</files>

</product>

</products>