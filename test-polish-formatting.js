// Test Polish formatting functionality
import { formatProductDescription } from './src/lib/utils/html.ts';

const testText = `Profesjonalna pompa wodna do zastosowań domowych i przemysłowych.

Specyfikacja:
- Moc: 1200W
- Waga: 5.2kg
- Wysokość: 350mm
- Materiał: Stal nierdzewna

Zastosowanie:
1. Systemy irygacyjne
2. Przepompownie wody
3. Systemy chłodzenia

Charakterystyka:
* Końcówka wrzeciona 13mm
* 2-biegowa skrzynia biegów
* LED oświetlenie miejsca pracy

Nasza pompa gwarantuje niezawodność i wydajność. Model: PMP-2000XL`;

console.log('Input:', testText);
console.log('Output:', formatProductDescription(testText));
