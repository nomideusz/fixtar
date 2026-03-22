// Test Polish character detection
import { formatProductDescription } from './src/lib/utils/html.ts';

const testText = `Test polskich znaków:
- Ładowanie
- Włóczka
- Młotek
- Łącznik
- Koło
- Włóknina

Specyfikacja:
- Waga: 2.5kg
- Wysokość: 150mm
- Materiał: Stal nierdzewna

Model: Ł-2000XL`;

console.log('=== POLISH CHARACTER TEST ===');
console.log('Input:', testText);
console.log('Output:', formatProductDescription(testText));

// Test individual character detection
const testWords = ['Ładowanie', 'Włóczka', 'ładowanie', 'włóczka', 'Młotek', 'młotek'];
testWords.forEach(word => {
	const result = formatProductDescription(word);
	console.log(`"${word}" -> "${result}"`);
});
