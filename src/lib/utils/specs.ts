/**
 * Extract quick specification highlights from product descriptions.
 * Parses common patterns like power (W/kW), speed (rpm), weight (kg),
 * voltage (V), disc size (mm), etc.
 * Returns up to 3 short spec badges for card display.
 */

interface QuickSpec {
	label: string;
	value: string;
}

const SPEC_PATTERNS: Array<{ pattern: RegExp; label: string; format: (match: RegExpMatchArray) => string }> = [
	// Power: 2000W, 2.5kW, 1200 W
	{ pattern: /(\d+(?:[.,]\d+)?)\s*kW\b/i, label: 'Moc', format: (m) => `${m[1]}kW` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*W\b/, label: 'Moc', format: (m) => `${m[1]}W` },
	// Voltage: 18V, 230V
	{ pattern: /(\d+(?:[.,]\d+)?)\s*V\b/, label: 'Napięcie', format: (m) => `${m[1]}V` },
	// Speed/RPM: 3000 rpm, 3000 obr/min
	{ pattern: /(\d[\d\s]*)\s*(?:rpm|obr\/min)/i, label: 'Obroty', format: (m) => `${m[1].replace(/\s/g, '')}rpm` },
	// Disc/blade size: 125mm, 230 mm
	{ pattern: /(?:tarcz|dysk|piła|średnic)[a-ząćęłńóśźż]*\s*(?:[:=]?\s*)(\d+)\s*mm/i, label: 'Tarcza', format: (m) => `${m[1]}mm` },
	// Weight: 2.5kg, 2,5 kg
	{ pattern: /(\d+(?:[.,]\d+)?)\s*kg\b/i, label: 'Waga', format: (m) => `${m[1].replace(',', '.')}kg` },
	// Capacity: 50L, 20l
	{ pattern: /(\d+(?:[.,]\d+)?)\s*[lL]\b/, label: 'Pojemność', format: (m) => `${m[1]}L` },
	// Pressure: 8 bar, 10bar
	{ pattern: /(\d+(?:[.,]\d+)?)\s*bar\b/i, label: 'Ciśnienie', format: (m) => `${m[1]}bar` },
	// Torque: 45Nm, 45 Nm
	{ pattern: /(\d+(?:[.,]\d+)?)\s*Nm\b/, label: 'Moment', format: (m) => `${m[1]}Nm` },
	// Teeth count: 48T, 48 zębów
	{ pattern: /(\d+)\s*[TZ](?:ębów|ęby)?\b/i, label: 'Zęby', format: (m) => `${m[1]}T` },
	// Amperage: 2.0Ah, 4Ah
	{ pattern: /(\d+(?:[.,]\d+)?)\s*Ah\b/i, label: 'Bateria', format: (m) => `${m[1]}Ah` },
];

/**
 * Extract up to `maxSpecs` quick specs from a product description.
 * Returns formatted spec strings like "2000W", "125mm", "2.5kg".
 */
export function extractQuickSpecs(description: string | undefined, maxSpecs = 3): QuickSpec[] {
	if (!description) return [];

	const text = description.replace(/<[^>]*>/g, ' ');
	const found: QuickSpec[] = [];
	const usedLabels = new Set<string>();

	for (const { pattern, label, format } of SPEC_PATTERNS) {
		if (found.length >= maxSpecs) break;
		if (usedLabels.has(label)) continue;

		const match = text.match(pattern);
		if (match) {
			found.push({ label, value: format(match) });
			usedLabels.add(label);
		}
	}

	return found;
}

/**
 * Format quick specs as a single display string: "2000W · 125mm · 2.5kg"
 */
export function formatQuickSpecs(description: string | undefined, maxSpecs = 3): string {
	return extractQuickSpecs(description, maxSpecs)
		.map(s => s.value)
		.join(' · ');
}

/**
 * Extract a full specification table from product description.
 * Looks for "Key: Value" patterns, list items with specs, and structured data.
 * Returns key-value pairs suitable for a spec table.
 */
export function extractSpecTable(description: string | undefined): Array<{ key: string; value: string }> {
	if (!description) return [];

	const text = description.replace(/<[^>]*>/g, '\n').replace(/&[^;]+;/g, ' ');
	const specs: Array<{ key: string; value: string }> = [];
	const seenKeys = new Set<string>();

	// Pattern 1: "Key: Value" or "Key - Value" lines
	const kvPattern = /^[\s•\-\*]*([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]{2,30})[\s]*[:–—-]\s*(.{2,80})$/gm;
	let match;
	while ((match = kvPattern.exec(text)) !== null) {
		const key = match[1].trim();
		const value = match[2].trim();
		const keyLower = key.toLowerCase();

		// Skip generic headings
		if (['opis', 'cechy', 'specyfikacja', 'uwagi', 'zastosowanie', 'funkcje', 'właściwości'].includes(keyLower)) continue;
		if (seenKeys.has(keyLower)) continue;

		seenKeys.add(keyLower);
		specs.push({ key, value });
	}

	// Pattern 2: Extract inline specs from text
	const inlinePatterns: Array<{ key: string; pattern: RegExp }> = [
		{ key: 'Moc', pattern: /(?:moc|power)[:\s]*(\d+(?:[.,]\d+)?\s*(?:W|kW))/i },
		{ key: 'Napięcie', pattern: /(?:napięcie|voltage)[:\s]*(\d+(?:[.,]\d+)?\s*V)/i },
		{ key: 'Obroty', pattern: /(?:obroty|prędkość obrotowa|rpm)[:\s]*(\d[\d\s]*\s*(?:rpm|obr\/min))/i },
		{ key: 'Waga', pattern: /(?:waga|masa|weight)[:\s]*(\d+(?:[.,]\d+)?\s*kg)/i },
		{ key: 'Średnica tarczy', pattern: /(?:średnica\s*(?:tarczy|dysku)?|disc\s*diameter)[:\s]*(\d+\s*mm)/i },
		{ key: 'Pojemność', pattern: /(?:pojemność|capacity)[:\s]*(\d+(?:[.,]\d+)?\s*[lL])/i },
		{ key: 'Ciśnienie', pattern: /(?:ciśnienie|pressure)[:\s]*(\d+(?:[.,]\d+)?\s*bar)/i },
		{ key: 'Moment obrotowy', pattern: /(?:moment\s*obrotowy?|torque)[:\s]*(\d+(?:[.,]\d+)?\s*Nm)/i },
		{ key: 'Bateria', pattern: /(?:bateria|akumulator|battery)[:\s]*(\d+(?:[.,]\d+)?\s*Ah)/i },
	];

	for (const { key, pattern } of inlinePatterns) {
		if (seenKeys.has(key.toLowerCase())) continue;
		const inlineMatch = text.match(pattern);
		if (inlineMatch) {
			seenKeys.add(key.toLowerCase());
			specs.push({ key, value: inlineMatch[1].trim() });
		}
	}

	return specs;
}
