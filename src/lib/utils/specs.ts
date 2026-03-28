/**
 * Specification extraction utilities.
 *
 * Quick specs — up to 3 badge-like values for product cards (e.g., "2000W · 125mm · 2.5kg")
 * Full specs  — extracted from the unified parser in html.ts for the product detail page
 */

import { parseProductDescription } from './html';

interface QuickSpec {
	label: string;
	value: string;
}

const SPEC_PATTERNS: Array<{ pattern: RegExp; label: string; format: (match: RegExpMatchArray) => string }> = [
	{ pattern: /(\d+(?:[.,]\d+)?)\s*kW\b/i, label: 'Moc', format: (m) => `${m[1]}kW` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*W\b/, label: 'Moc', format: (m) => `${m[1]}W` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*V\b/, label: 'Napięcie', format: (m) => `${m[1]}V` },
	{ pattern: /(\d[\d\s]*)\s*(?:rpm|obr\/min)/i, label: 'Obroty', format: (m) => `${m[1].replace(/\s/g, '')}rpm` },
	{ pattern: /(?:tarcz|dysk|piła|średnic)[a-ząćęłńóśźż]*\s*(?:[:=]?\s*)(\d+)\s*mm/i, label: 'Tarcza', format: (m) => `${m[1]}mm` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*kg\b/i, label: 'Waga', format: (m) => `${m[1].replace(',', '.')}kg` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*[lL]\b/, label: 'Pojemność', format: (m) => `${m[1]}L` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*bar\b/i, label: 'Ciśnienie', format: (m) => `${m[1]}bar` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*Nm\b/, label: 'Moment', format: (m) => `${m[1]}Nm` },
	{ pattern: /(\d+)\s*[TZ](?:ębów|ęby)?\b/i, label: 'Zęby', format: (m) => `${m[1]}T` },
	{ pattern: /(\d+(?:[.,]\d+)?)\s*Ah\b/i, label: 'Bateria', format: (m) => `${m[1]}Ah` },
];

/**
 * Extract up to `maxSpecs` quick specs from a product description.
 * Used for product cards — returns compact badge values.
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
 * Extract a full specification table from a product description.
 * Delegates to the unified parser in html.ts.
 */
export function extractSpecTable(description: string | undefined): Array<{ key: string; value: string }> {
	if (!description) return [];
	return parseProductDescription(description).specs;
}

/**
 * Extract "W zestawie" contents from a product description.
 */
export function extractContents(description: string | undefined): string[] {
	if (!description) return [];
	return parseProductDescription(description).contents;
}
