/**
 * Format BaseLinker product descriptions into clean, structured HTML.
 *
 * BaseLinker descriptions are marketing-heavy plain text with:
 * - Emoji markers (✅ ⚡ ✨ ️) used as bullet prefixes
 * - Inline headings (short lines ending with colon, or ALL CAPS)
 * - "Key: Value" spec lines mixed in with prose
 * - No HTML structure — just raw text with newlines
 *
 * This formatter converts them into clean semantic HTML.
 */

export function formatProductDescription(text: string): string {
	if (!text || typeof text !== 'string') return '';

	// 1. Normalize
	let s = text
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	// 2. Strip HTML tags (descriptions are already stripped by sync, but just in case)
	s = s.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ');

	// 3. Split into lines and classify each
	const lines = s.split('\n').map((l) => l.trim()).filter(Boolean);
	const blocks: Array<{ type: 'heading' | 'bullet' | 'text'; content: string }> = [];

	for (const line of lines) {
		const cleaned = stripEmoji(line);
		if (!cleaned) continue;

		if (isHeading(cleaned)) {
			blocks.push({ type: 'heading', content: cleanHeading(cleaned) });
		} else if (isBullet(line)) {
			blocks.push({ type: 'bullet', content: cleaned });
		} else {
			blocks.push({ type: 'text', content: cleaned });
		}
	}

	// 4. Group consecutive bullets into lists, merge consecutive text into paragraphs
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
			// Collect consecutive text lines into one paragraph
			const parts: string[] = [];
			while (i < blocks.length && blocks[i].type === 'text') {
				parts.push(blocks[i].content);
				i++;
			}
			// Split long merged text into ~2-3 sentence paragraphs
			const merged = parts.join(' ');
			for (const para of splitParagraphs(merged)) {
				html.push(`<p>${esc(para)}</p>`);
			}
		}
	}

	return html.join('');
}

// --- Helpers ---

const EMOJI_RE = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u2705\u26A1\u2728\u2764\u2B50\u{1F525}\u{1F4A5}\u{1F6E0}\u{2714}\u{2716}️]/gu;

function stripEmoji(s: string): string {
	return s.replace(EMOJI_RE, '').replace(/\uFE0F/g, '').replace(/\s{2,}/g, ' ').trim();
}

function isHeading(line: string): boolean {
	// Short line ending with colon (section titles)
	if (line.length <= 60 && /^[^:]+:$/.test(line)) return true;
	// Short ALL-CAPS line (2+ words)
	if (line.length <= 80 && line === line.toUpperCase() && /\s/.test(line) && !/\d{3,}/.test(line)) return true;
	// Known heading keywords
	const headingKeywords = /^(Specyfikacja|Cechy|Zastosowanie|Funkcje|Parametry|Dane techniczne|Zawartość|Wymiary|Kompletny Zestaw|W Zestawie|Główne cechy|Główne zalety)/i;
	if (headingKeywords.test(line)) return true;
	return false;
}

function cleanHeading(line: string): string {
	return line.replace(/:$/, '').trim();
}

function isBullet(line: string): boolean {
	// Lines starting with emoji markers, bullet chars, or numbered prefixes
	if (/^[✅⚡✨🔧🛠️⭐️•\-\*]\s*/u.test(line)) return true;
	if (/^\d+\.\s+/.test(line)) return true;
	return false;
}

function splitParagraphs(text: string): string[] {
	if (text.length <= 250) return [text];

	// Split on sentence boundaries
	const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
	const paras: string[] = [];
	let current = '';

	for (const sentence of sentences) {
		if (current.length + sentence.length > 300 && current.length > 80) {
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
		.replace(/>/g, '&gt;');
}
