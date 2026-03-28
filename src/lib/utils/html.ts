/**
 * Unified BaseLinker product description parser.
 *
 * BaseLinker descriptions are marketing-heavy text stored as a SINGLE LINE with:
 * - No newlines — emoji markers (✅ ⚡ ⏩ ✨) act as inline separators
 * - Inline headings ("Dane Techniczne:", "W zestawie:")
 * - "Key: Value" spec lines mixed in with marketing prose
 * - Heavy repetition of the same selling points
 *
 * This parser splits the blob into structured data:
 * - specs:     key-value pairs (Moc: 4100W, Napięcie: 230V, etc.)
 * - contents:  "W zestawie" items
 * - html:      clean marketing prose, deduplicated, spec-free
 */

export interface ParsedDescription {
	/** Clean marketing prose as HTML (no specs, no duplicates) */
	html: string;
	/** Technical specifications extracted as key-value pairs */
	specs: Array<{ key: string; value: string }>;
	/** "W zestawie" / package contents */
	contents: string[];
}

/** Emoji and symbol markers used as separators in BaseLinker descriptions */
const MARKER_RE = /[✅⚡⏩✨🔧🛠⭐🔥💥❤🏆🚀💡🎯👉👍📦📌🔒🔑⚙️•❗❄☀⛅🌡➕➖\u2714\u2716\u25CF\u25AA\u25B6\u23E9\u2705\uFE0F]/gu;

/** Section heading patterns that start a spec block */
const SPEC_HEADING_RE = /^(Dane\s+[Tt]echniczne|Parametry\s+[Tt]echniczne|Specyfikacja\s+[Tt]echniczna|Parametry|Specyfikacja)\s*:?\s*$/i;

/** Section heading patterns that start a contents block */
const CONTENTS_HEADING_RE = /^(W\s+[Zz]estawie(?:\s+[\wąćęłńóśźż]+)?|Zestaw\s+[Zz]awiera|W\s+[Kk]omplecie|Kompletny\s+[Zz]estaw|Zawartość\s+(?:zestawu|opakowania))\s*:?\s*$/i;

/** Looser check — does this line START with a contents heading? (for mid-sentence detection) */
const CONTENTS_START_RE = /^(W\s+zestawie(?:\s+[\wąćęłńóśźż]+)?\s*:|Zestaw\s+zawiera\s*:|W\s+komplecie\s*:)/i;

/** Section heading patterns that start a features/benefits block (stays in HTML) */
const SECTION_HEADING_RE = /^(Cechy\s+produktu|Główne\s+(?:cechy|zalety)|Najważniejsze\s+zalety|Kluczowe\s+cechy|Zastosowanie|Funkcje|Opis\s+produktu)\s*:?\s*$/i;

/** A "Key: Value" spec line — short key (2-40 chars), then colon, then value with a unit */
const SPEC_KV_RE = /^([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń][^:]{1,40}?)\s*:\s*(.+)$/;

/** Value looks like a technical measurement (contains digits + units) */
const UNIT_RE = /\d+(?:[.,]\d+)?\s*(?:W|kW|V|Hz|RPM|obr\/min|mm|cm|m|kg|g|bar|Nm|Ah|mAh|J|dB|°|L|l|szt|sztuki?)\b/i;

// ─────────────────────────────────────────────────────────────

export function parseProductDescription(text: string): ParsedDescription {
	if (!text || typeof text !== 'string') return { html: '', specs: [], contents: [] };

	// 1. Normalize
	let s = text
		.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
		.replace(/&nbsp;/gi, ' ')
		.replace(/\\/g, ' ')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&[a-z]+;/gi, ' ')
		.trim();

	// 2. Split into logical lines using emoji markers + newlines
	const rawLines = splitOnMarkers(s);

	// 3. Clean lines: strip Allegro SEO title prefixes
	const lines = rawLines.map(stripAllegroPrefix).filter(l => l.length > 0);

	// 4. Walk through lines, classify into sections
	const specs: Array<{ key: string; value: string }> = [];
	const contents: string[] = [];
	const proseBlocks: Array<{ type: 'heading' | 'bullet' | 'text'; content: string }> = [];

	const seenSpecKeys = new Set<string>();
	let mode: 'prose' | 'specs' | 'contents' = 'prose';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		// Check for section heading transitions
		if (SPEC_HEADING_RE.test(line)) {
			mode = 'specs';
			continue;
		}
		if (CONTENTS_HEADING_RE.test(line)) {
			mode = 'contents';
			continue;
		}
		// Mid-line contents heading: "W zestawie: item1 item2"
		const contentsStart = CONTENTS_START_RE.exec(line);
		if (contentsStart) {
			mode = 'contents';
			const rest = line.substring(contentsStart[0].length).trim();
			if (rest && rest.length > 2) {
				contents.push(rest.replace(/^(?:x?\d+\s*x?\s*)/i, '').trim());
			}
			continue;
		}
		if (SECTION_HEADING_RE.test(line)) {
			mode = 'prose';
			proseBlocks.push({ type: 'heading', content: cleanHeading(line) });
			continue;
		}
		// Generic heading (short line ending with colon, ALL CAPS)
		if (isGenericHeading(line)) {
			// If the heading looks spec-like, switch to specs mode
			if (/techniczne|parametry|specyfikacja/i.test(line)) {
				mode = 'specs';
			} else if (/zestaw|komplecie|zawiera|zawartość/i.test(line)) {
				mode = 'contents';
			} else {
				mode = 'prose';
				proseBlocks.push({ type: 'heading', content: cleanHeading(line) });
			}
			continue;
		}

		// Process line based on current mode
		if (mode === 'specs') {
			const kv = tryParseSpec(line);
			if (kv) {
				// Check if spec value bleeds into a "W zestawie" section
				const bleed = kv.value.match(/^(.+?)\s+(W\s+zestawie[^:]*:?)\s*$/i);
				if (bleed) {
					// Truncate the value and switch to contents mode
					if (!seenSpecKeys.has(kv.key.toLowerCase())) {
						seenSpecKeys.add(kv.key.toLowerCase());
						specs.push({ key: kv.key, value: bleed[1].trim() });
					}
					mode = 'contents';
				} else if (!seenSpecKeys.has(kv.key.toLowerCase())) {
					seenSpecKeys.add(kv.key.toLowerCase());
					specs.push(kv);
				}
			} else if (line.length > 120 || !isShortLine(line)) {
				// Long text → switch back to prose
				mode = 'prose';
				proseBlocks.push({ type: 'text', content: line });
			}
			// Short non-KV lines in spec mode are skipped (noise like "x2 Zapasowe szczotki")
			// but could be contents items if short enough
			else if (line.length > 5 && line.length < 80) {
				// Stray item in spec block — might be a contents item misplaced
				// Keep in specs mode but don't output
			}
			continue;
		}

		if (mode === 'contents') {
			// Check if this is actually a spec line (misplaced in contents block)
			const contentsKv = tryParseSpec(line);
			if (contentsKv && isLikelySpec(contentsKv) && !seenSpecKeys.has(contentsKv.key.toLowerCase())) {
				seenSpecKeys.add(contentsKv.key.toLowerCase());
				specs.push(contentsKv);
				continue;
			}

			// Long lines (> 100 chars) or lines that look like prose → switch back
			if (line.length > 100 || (line.length > 60 && /[.!?]$/.test(line))) {
				mode = 'prose';
				proseBlocks.push({ type: 'text', content: line });
				continue;
			}

			// Strip quantity prefixes like "x1 ", "x2 ", "1x "
			const cleaned = line.replace(/^(?:x?\d+\s*x?\s*)/i, '').trim();
			if (cleaned && cleaned.length > 2) {
				contents.push(cleaned);
			}
			continue;
		}

		// prose mode — check if this is a stray spec line
		const kv = tryParseSpec(line);
		if (kv && isLikelySpec(kv) && !seenSpecKeys.has(kv.key.toLowerCase())) {
			// Check if spec value bleeds into a "W zestawie" section
			const bleed = kv.value.match(/^(.+?)\s+(W\s+zestawie[^:]*:?)\s*$/i);
			if (bleed) {
				seenSpecKeys.add(kv.key.toLowerCase());
				specs.push({ key: kv.key, value: bleed[1].trim() });
				mode = 'contents';
			} else {
				seenSpecKeys.add(kv.key.toLowerCase());
				specs.push(kv);
			}
			continue;
		}

		// Classify for prose
		if (isShortLine(line) && line.length < 100) {
			proseBlocks.push({ type: 'bullet', content: line });
		} else {
			proseBlocks.push({ type: 'text', content: line });
		}
	}

	// 4. Deduplicate prose
	const dedupedBlocks = deduplicateBlocks(proseBlocks);

	// 5. Build HTML from deduplicated prose
	const html = buildHtml(dedupedBlocks);

	return { html, specs, contents };
}

/**
 * Legacy wrapper — returns only the formatted HTML.
 */
export function formatProductDescription(text: string): string {
	return parseProductDescription(text).html;
}

// ─────────────────────────────────────────────────────────────
// Line splitting
// ─────────────────────────────────────────────────────────────

/** Patterns that act as section boundaries — split lines here when found mid-text */
const SECTION_BOUNDARY_RE = /\b(W\s+zestawie(?:\s+[\wąćęłńóśźż]+)?\s*:|Zestaw\s+zawiera\s*:|W\s+komplecie\s*:|Dane\s+[Tt]echniczne\s*:|Parametry\s*:|Specyfikacja\s*:)/gi;

function splitOnMarkers(text: string): string[] {
	const roughLines = text.split('\n');
	const result: string[] = [];

	for (const line of roughLines) {
		const positions: number[] = [];
		const re = new RegExp(MARKER_RE.source, 'gu');
		let match: RegExpExecArray | null;
		while ((match = re.exec(line)) !== null) {
			positions.push(match.index);
		}

		if (positions.length === 0) {
			const trimmed = line.trim();
			if (trimmed) result.push(...splitAtSectionBoundaries(trimmed));
		} else {
			const before = line.substring(0, positions[0]).trim();
			if (before) result.push(...splitAtSectionBoundaries(before));

			for (let i = 0; i < positions.length; i++) {
				const start = positions[i];
				const end = i + 1 < positions.length ? positions[i + 1] : line.length;
				const segment = stripLeadingEmoji(line.substring(start, end)).trim();
				if (segment) result.push(...splitAtSectionBoundaries(segment));
			}
		}
	}

	return result;
}

/**
 * Split a line at section boundary phrases ("W zestawie:", "Dane techniczne:", etc.)
 * that appear mid-text. E.g.:
 *   "Waga: 5kg W zestawie znajdziesz:" → ["Waga: 5kg", "W zestawie znajdziesz:"]
 */
function splitAtSectionBoundaries(line: string): string[] {
	const re = new RegExp(SECTION_BOUNDARY_RE.source, 'gi');
	let match: RegExpExecArray | null;
	const splits: number[] = [];

	while ((match = re.exec(line)) !== null) {
		// Only split if there's meaningful text before the boundary
		if (match.index > 10) {
			splits.push(match.index);
		}
	}

	if (splits.length === 0) return [line];

	const parts: string[] = [];
	let start = 0;
	for (const pos of splits) {
		const before = line.substring(start, pos).trim();
		if (before) parts.push(before);
		start = pos;
	}
	const rest = line.substring(start).trim();
	if (rest) parts.push(rest);

	return parts;
}

/**
 * Strip Allegro SEO title prefixes from lines.
 * Allegro listings often start with ALL-CAPS keyword spam:
 *   "MOCNA SZLIFIERKA DO GIPSU ŚCIAN SUFITÓW... Odkryj nową szlifierkę..."
 * We detect the transition from ALL-CAPS to mixed case and strip the prefix.
 */
function stripAllegroPrefix(line: string): string {
	if (line.length < 20) return line;

	// Find where ALL-CAPS section ends and normal mixed-case prose begins.
	// Detect transition: a Capitalized word (not ALL-CAPS, ≥4 letters with lowercase)
	// preceded by mostly uppercase content.
	const transition = line.match(
		/^(.{15,}?)\s+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{3,}.+)/
	);

	if (transition) {
		const capsPrefix = transition[1].trim();
		const restText = transition[2].trim();
		// Only strip if the prefix is mostly ALL-CAPS (>70% uppercase letters)
		const letters = capsPrefix.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '');
		const upperCount = (letters.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/g) || []).length;
		if (letters.length > 5 && upperCount / letters.length > 0.7 && restText.length > 20) {
			return restText;
		}
	}

	// Pure ALL-CAPS line (standalone) — strip entirely
	if (line === line.toUpperCase() && line.length > 15 && /\s/.test(line) && !/\d{4,}/.test(line)) {
		return '';
	}

	return line;
}

function stripLeadingEmoji(s: string): string {
	return s.replace(new RegExp(`^(?:${MARKER_RE.source}|\\uFE0F|\\s)+`, 'gu'), '').trim();
}

// ─────────────────────────────────────────────────────────────
// Classification helpers
// ─────────────────────────────────────────────────────────────

function isGenericHeading(line: string): boolean {
	// Short line ending with colon
	if (line.length <= 80 && /^[^:]+:\s*$/.test(line)) return true;
	// Short ALL-CAPS line (2+ words, > 8 chars, no big numbers)
	if (line.length <= 100 && line.length > 8 && line === line.toUpperCase() && /\s/.test(line) && !/\d{3,}/.test(line)) return true;
	// "W zestawie znajdziesz:" and similar verb forms
	if (/^(W\s+zestawie\s+\w+|Zestaw\s+\w+)\s*:\s*$/i.test(line)) return true;
	return false;
}

function cleanHeading(line: string): string {
	return line.replace(/:\s*$/, '').trim();
}

function isShortLine(line: string): boolean {
	return line.length <= 120;
}

/** Try to parse "Key: Value" from a line, with smart value truncation */
function tryParseSpec(line: string): { key: string; value: string } | null {
	const m = SPEC_KV_RE.exec(line);
	if (!m) return null;
	const key = m[1].trim();
	let value = m[2].trim();
	if (key.length < 2) return null;
	// Skip known non-spec patterns
	const keyLower = key.toLowerCase();
	if (['opis', 'cechy', 'uwagi', 'funkcje', 'właściwości', 'bezpieczeństwo', 'komfort', 'łatwa obsługa'].includes(keyLower)) return null;

	// 1. Strip leading weather/decorative emoji from value
	value = value.replace(/^[❄️☀️⛅🌡️\s]+/gu, '').trim();

	// 2. Strip marketing fluff after em-dash/dash
	// "10 m – idealny zasięg do pracy" → "10 m"
	// "60 BAR – gotowy na wymagające zadania" → "60 BAR"
	// But preserve ranges: "0-45°" or "od -35°C do +60°C"
	const dashFluff = value.match(/^(.+?)\s+[–—]\s+[a-ząćęłńóśźż]/i);
	if (dashFluff) {
		value = dashFluff[1].trim();
	}

	// 3. Smart value truncation for remaining long values
	if (value.length > 40) {
		const unitEnd = value.match(
			/^((?:od\s+)?[+-]?\d+(?:[.,]\d+)?\s*(?:W|kW|V|Hz|RPM|obr\/min|mm|cm|m|kg|g|bar|BAR|Nm|Ah|mAh|J|dB|°\s*C?|L|l|szt\.?|sztuki?)(?:\s*(?:x|×|do|[-–])\s*[+-]?[\d.,]+\s*(?:°\s*C?|mm|cm|m|kg|W|V|BAR)?)?)\s+[A-ZĄĆĘŁŃÓŚŹŻ]/i
		);
		if (unitEnd) {
			value = unitEnd[1].trim();
		} else if (value.length > 80) {
			return null;
		}
	}

	// 4. Final cleanup: remove trailing punctuation that's not part of a unit
	value = value.replace(/[,;]+$/, '').trim();

	return { key, value };
}

/** Is this key-value pair actually a technical spec (not marketing)? */
function isLikelySpec(kv: { key: string; value: string }): boolean {
	// Value contains a unit → almost certainly a spec
	if (UNIT_RE.test(kv.value)) return true;
	// Known spec key names
	const specKeys = /^(moc|napięcie|zasilanie|częstotliwość|obroty|prędkość|średnica|waga|masa|pojemność|ciśnienie|moment|bateria|akumulator|model|producent|długość|szerokość|wysokość|wymiary|gwarancja|klasa|typ|rodzaj|kolor|materiał|złączka|uchwyt|max|min)\b/i;
	if (specKeys.test(kv.key)) return true;
	// Short value with numbers
	if (kv.value.length <= 40 && /\d/.test(kv.value)) return true;
	return false;
}

// ─────────────────────────────────────────────────────────────
// Deduplication
// ─────────────────────────────────────────────────────────────

/**
 * Remove duplicate or near-duplicate blocks.
 * Uses normalized sentence fingerprints to detect repetition.
 */
/** Patterns that are pure marketing filler — remove entirely */
const MARKETING_FILLER_RE = /^(Nie zwlekaj!?|Nie czekaj!?|Zamów (?:teraz|już dziś)|Postaw na|Wybierz .{5,40} i (?:zyskaj|ciesz)|Z .{3,20} (?:praca|mieszanie|cięcie) .{5,40}(?:prostsze|łatwiejsze|efektywne)|Dołącz do Profesjonalistów)/i;

/** ALL-CAPS title lines that add no value — these are Allegro SEO titles */
const ALLEGRO_TITLE_RE = /^[A-ZĄĆĘŁŃÓŚŹŻ0-9\s,+\-\/().!]{15,}$/;

function deduplicateBlocks(blocks: Array<{ type: string; content: string }>): Array<{ type: string; content: string }> {
	const seenFingerprints = new Set<string>();
	const result: Array<{ type: string; content: string }> = [];

	for (const block of blocks) {
		// Skip ALL-CAPS Allegro SEO title lines
		if (block.type !== 'heading' && ALLEGRO_TITLE_RE.test(block.content) && block.content === block.content.toUpperCase()) {
			continue;
		}

		if (block.type === 'heading') {
			const fp = fingerprint(block.content);
			if (seenFingerprints.has(fp)) continue;
			seenFingerprints.add(fp);
			result.push(block);
			continue;
		}

		// For text/bullet blocks, extract sentence-level fingerprints
		const sentences = extractSentences(block.content);
		const novelSentences: string[] = [];

		for (const sentence of sentences) {
			// Skip pure marketing filler sentences
			if (MARKETING_FILLER_RE.test(sentence.trim())) continue;

			const fp = fingerprint(sentence);
			if (fp.length < 10) {
				novelSentences.push(sentence);
				continue;
			}
			if (!seenFingerprints.has(fp)) {
				seenFingerprints.add(fp);
				novelSentences.push(sentence);
			}
		}

		if (novelSentences.length > 0) {
			const joined = novelSentences.join(' ').trim();
			if (joined) {
				result.push({ type: block.type, content: joined });
			}
		}
	}

	return result;
}

/** Normalize text for fingerprinting: lowercase, strip punctuation, collapse whitespace */
function fingerprint(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-ząćęłńóśźż0-9\s]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Split text into sentences (rough but effective for Polish marketing copy) */
function extractSentences(text: string): string[] {
	// Split on sentence-ending punctuation followed by space or end
	const parts = text.split(/(?<=[.!?])\s+/);
	return parts.filter(p => p.trim().length > 0);
}

// ─────────────────────────────────────────────────────────────
// HTML generation
// ─────────────────────────────────────────────────────────────

function buildHtml(blocks: Array<{ type: string; content: string }>): string {
	const html: string[] = [];
	let i = 0;

	while (i < blocks.length) {
		const block = blocks[i];

		if (block.type === 'heading') {
			html.push(`<h3>${esc(block.content)}</h3>`);
			i++;
		} else if (block.type === 'bullet') {
			const items: string[] = [];
			while (i < blocks.length && blocks[i].type === 'bullet') {
				items.push(`<li>${esc(blocks[i].content)}</li>`);
				i++;
			}
			html.push(`<ul>${items.join('')}</ul>`);
		} else {
			const parts: string[] = [];
			while (i < blocks.length && blocks[i].type === 'text') {
				parts.push(blocks[i].content);
				i++;
			}
			for (const part of parts) {
				for (const para of splitParagraphs(part)) {
					html.push(`<p>${esc(para)}</p>`);
				}
			}
		}
	}

	return html.join('');
}

function splitParagraphs(text: string): string[] {
	if (text.length <= 300) return [text];
	const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
	const paras: string[] = [];
	let current = '';
	for (const sentence of sentences) {
		if (current.length + sentence.length > 350 && current.length > 80) {
			paras.push(current.trim());
			current = sentence;
		} else {
			current += sentence;
		}
	}
	if (current.trim()) paras.push(current.trim());
	return paras;
}

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
