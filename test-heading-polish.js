// Test Polish heading detection
import { formatProductDescription } from './src/lib/utils/html.ts';

const testText = `Główne Cechy i Zalety:
- Wysoka jakość wykonania
- Długa żywotność
- Łatwość obsługi

Specyfikacja:
- Moc: 1200W
- Waga: 5.2kg

główne cechy i zalety:
- inna wersja
- test`;

console.log('=== POLISH HEADING TEST ===');
console.log('Input:', testText);
console.log('Output:', formatProductDescription(testText));
