# Advanced Product Description Formatting Examples

## Input Examples

### Basic Text with Lists
```
Profesjonalna pompa wodna do zastosowań domowych i przemysłowych.

Specyfikacja:
- Moc: 1200W
- Waga: 5.2kg
- Wysokość: 350mm
- Materiał: Stal nierdzewna

Zastosowanie:
1. Systemy irygacyjne
2. Przepompownie wody
3. Systemy chłodzenia

Nasza pompa gwarantuje niezawodność i wydajność.
```

### Technical Specifications with Measurements
```
Wiertarka udarowa DEWALT DCD771 to profesjonalne narzędzie do wiercenia.

Specyfikacja:
Moc: 720W
Maksymalne obroty: 1500 rpm
Moment obrotowy: 65 Nm
Waga: 2.1 kg
Napięcie: 18V

Cechy:
* Końcówka wrzeciona 13mm
* 2-biegowa skrzynia biegów
* LED oświetlenie miejsca pracy
* Uchwyt magnetyczny na bity

Model: DCD771C2
Wymiary: 200 x 80 x 250mm
```

### Emphasis and Quoted Text
```
Przedstawiamy *innowacyjny system* czyszczenia parowego.

Charakterystyka:
- "Najwyższa jakość wykonania"
- Szybkie nagrzewanie w 30 sekund
- Pojemność zbiornika: 1.5L

Nasz produkt jest *najlepszym wyborem* dla profesjonalistów.
```

## Expected Output Formatting

The system will automatically detect and format:
- **Headings**: Lines ending with colons, all caps text, "Specyfikacja:", "Cechy:", etc.
- **Lists**: Numbered (1., 2.), lettered (a., b.), and bullet (•, -, *) lists
- **Emphasis**: *asterisks* → <strong>, _underscores_ → <em>, ALL CAPS → <strong>
- **Technical specs**: Key: Value pairs, measurements (5kg, 1200W), model numbers
- **Quoted text**: "text in quotes" → <em>

## Visual Styling
- **H3**: Larger font with bottom border for main sections
- **H4**: Medium font for subsections  
- **Lists**: Proper indentation and spacing
- **Measurements**: Monospace font with background highlight
- **Model numbers**: Monospace font with subtle highlight
- **Bold/italic**: Appropriate color variations
