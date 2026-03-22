import { hasDOM } from './detection';

/**
 * HTML Sanitizer utilities
 * Provides safe HTML sanitization for user-generated content
 */

// Allowed HTML tags for product descriptions
const ALLOWED_TAGS = new Set([
	'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
	'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
]);

// Allowed attributes for specific tags
const ALLOWED_ATTRIBUTES = new Map([
	['*', ['class']],
	['a', ['href', 'title', 'target']],
	['span', ['style', 'class']],
	['div', ['style', 'class']],
	['li', ['class']],
	['ul', ['class']],
	['ol', ['class']],
	['h1', ['class']],
	['h2', ['class']],
	['h3', ['class']],
	['h4', ['class']],
	['h5', ['class']],
	['h6', ['class']]
]);

/**
 * Sanitizes HTML content by removing disallowed tags and attributes
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
	if (!html || typeof html !== 'string') {
		return '';
	}

	// Create a temporary DOM element to parse HTML
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = html;

	return (sanitizeNode(tempDiv) as Element).innerHTML;
}

/**
 * Recursively sanitizes a DOM node and its children
 * @param node - The DOM node to sanitize
 * @returns The sanitized node
 */
function sanitizeNode(node: Node): Node {
	const children = Array.from(node.childNodes);

	// Process child nodes first
	children.forEach(child => {
		if (child.nodeType === Node.ELEMENT_NODE) {
			const element = child as Element;
			const tagName = element.tagName.toLowerCase();

			if (!ALLOWED_TAGS.has(tagName)) {
				// Replace disallowed tag with its contents
				const parent = element.parentNode;
				if (parent) {
					while (element.firstChild) {
						parent.insertBefore(element.firstChild, element);
					}
					parent.removeChild(element);
				}
			} else {
				// Sanitize attributes
				sanitizeAttributes(element);
				// Recursively sanitize children
				sanitizeNode(element);
			}
		} else if (child.nodeType === Node.COMMENT_NODE) {
			// Remove comments
			child.parentNode?.removeChild(child);
		}
	});

	return node;
}

/**
 * Sanitizes element attributes based on allowed rules
 * @param element - The element to sanitize attributes for
 */
function sanitizeAttributes(element: Element): void {
	const attributes = Array.from(element.attributes);
	
	attributes.forEach(attr => {
		const tagName = element.tagName.toLowerCase();
		const allowedForTag = ALLOWED_ATTRIBUTES.get(tagName) || [];
		const allowedForAll = ALLOWED_ATTRIBUTES.get('*') || [];
		const allowedAttrs = [...allowedForTag, ...allowedForAll];

		if (!allowedAttrs.includes(attr.name)) {
			element.removeAttribute(attr.name);
		} else if (attr.name === 'href' && tagName === 'a') {
			// Additional security for href attributes
			const href = attr.value.toLowerCase();
			if (href.startsWith('javascript:') || href.startsWith('data:') || href.startsWith('vbscript:')) {
				element.removeAttribute(attr.name);
			}
		}
	});
}

/**
 * Server-side safe HTML sanitizer (fallback for SSR)
 * Uses the same formatting logic as client-side but with basic HTML entity encoding
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlServer(html: string): string {
	if (!html || typeof html !== 'string') {
		return '';
	}

	// Apply the same formatting logic as client-side
	const formatted = formatDescriptionText(html);
	
	// For server-side, we need to manually sanitize since we don't have DOM
	// Apply basic security filtering
	let sanitized = formatted;
	
	// Remove script tags and dangerous content
	sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
	sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
	sanitized = sanitized.replace(/javascript:/gi, '');
	sanitized = sanitized.replace(/data:/gi, '');
	sanitized = sanitized.replace(/vbscript:/gi, '');
	
	// Only allow safe tags and attributes
	const allowedTagPattern = /^<\/?(p|br|strong|b|em|i|u|span|div|ul|ol|li|h[1-6])(\s|>|\/>)/i;
	const lines = sanitized.split('\n');
	const safeLines = lines.filter(line => {
		const trimmed = line.trim();
		if (!trimmed) return true; // Keep empty lines
		if (trimmed.startsWith('<') && !allowedTagPattern.test(trimmed)) {
			// Skip disallowed tags
			return false;
		}
		return true;
	});
	
	return safeLines.join('\n');
}

/**
 * Formats and sanitizes product description
 * @param text - The description text to format
 * @returns Formatted and sanitized HTML string
 */
export function formatProductDescription(text: string): string {
	if (!text || typeof text !== 'string') {
		return '';
	}

	// Always apply formatting first
	const formatted = formatDescriptionText(text);

	// Check if we're in a browser environment with DOM access
	const hasDOMAccess = hasDOM();
	
	// Debug: Log environment detection
	if (typeof console !== 'undefined') {
		console.log('[formatProductDescription] Environment:', {
			hasDOMAccess,
			hasWindow: typeof window !== 'undefined',
			hasDocument: typeof document !== 'undefined',
			inputLength: text.length,
			outputLength: formatted.length
		});
	}
	
	if (hasDOMAccess) {
		// Use DOM-based sanitization for better security
		return sanitizeHtml(formatted);
	} else {
		// Use server-side fallback
		return sanitizeHtmlServer(formatted);
	}
}

/**
 * Formats description text with intelligent pattern detection
 * @param text - The text to format
 * @returns Formatted HTML string
 */
function formatDescriptionText(text: string): string {
	if (!text || typeof text !== 'string') {
		return '';
	}

	// First, normalize line endings and clean up whitespace
	let formatted = text
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
		.replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines to double
		.trim();

	// Detect and format lists
	formatted = formatLists(formatted);

	// Detect and format headings/subtitles
	formatted = formatHeadings(formatted);

	// Detect and format bold/emphasis text
	formatted = formatEmphasis(formatted);

	// Detect and format technical specifications
	formatted = formatSpecifications(formatted);

	// Split into paragraphs
	let paragraphs = formatted.split(/\n\s*\n/).filter(Boolean);

	// If no clear paragraphs, try sentence-based splitting
	if (paragraphs.length <= 1 && formatted.length > 200) {
		paragraphs = splitIntoSentences(formatted);
	}

	return paragraphs.map(p => `<p>${p}</p>`).join('');
}

/**
 * Detects and formats various list patterns
 */
function formatLists(text: string): string {
	// Store original lines for processing
	const lines = text.split('\n');
	const result: string[] = [];
	let inList = false;
	let listType: 'ul' | 'ol' | null = null;
	let listItems: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		
		// Check if this is a list item
		const isNumbered = /^\d+\.\s+/.test(line);
		const isLettered = /^[a-zA-Z]\.\s+/.test(line);
		const isBullet = /^[•\-\*]\s+/.test(line);
		
		if (isNumbered || isLettered || isBullet) {
			// Extract the content after the marker
			let content = line;
			if (isNumbered) {
				content = line.replace(/^\d+\.\s+/, '');
				listType = 'ol';
			} else if (isLettered) {
				content = line.replace(/^[a-zA-Z]\.\s+/, '');
				listType = 'ol';
			} else {
				content = line.replace(/^[•\-\*]\s+/, '');
				listType = 'ul';
			}
			
			if (!inList) {
				inList = true;
			}
			listItems.push(`<li>${content}</li>`);
		} else {
			if (inList) {
				// Close the list
				result.push(`<${listType}>${listItems.join('')}</${listType}>`);
				listItems = [];
				inList = false;
				listType = null;
			}
			result.push(lines[i]); // Keep original line with original spacing
		}
	}

	// Handle list at the end
	if (inList) {
		result.push(`<${listType}>${listItems.join('')}</${listType}>`);
	}

	return result.join('\n');
}

/**
 * Detects and formats headings based on patterns
 */
function formatHeadings(text: string): string {
	// Lines that look like headings (all caps, short, followed by colon)
	text = text.replace(/^([A-ZĄĆĘŁŃÓŚŹŻ\s]{2,30}):$/gmu, '<h3>$1:</h3>');
	
	// Lines with "Specyfikacja:", "Cechy:", "Zastosowanie:" etc.
	const headingPatterns = [
		/(^|\n)(Specyfikacja|Cechy|Zastosowanie|Funkcje|Właściwości|Parametry|Opis|Charakterystyka|Dane techniczne|Zawartość opakowania|Wymiary|Waga|Materiał|Kolor|Gwarancja|Główne cechy i zalety|Główne Cechy i Zalety|Główne zalety|Główne cechy):/gi,
		/(^|\n)(Features|Specifications|Description|Properties|Parameters|Dimensions|Weight|Material|Color|Warranty|Main Features|Main Benefits):/gi
	];
	
	headingPatterns.forEach(pattern => {
		text = text.replace(pattern, '$1<h3>$2:</h3>');
	});

	// Lines ending with colon that are short (likely headings) - include Polish characters
	text = text.replace(/^([^:\n]{1,50}):$/gmu, '<h4>$1:</h4>');
	
	// Additional pattern for Polish headings that might have mixed case
	text = text.replace(/^([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\s]{1,40}):$/gmu, '<h4>$1:</h4>');

	return text;
}

/**
 * Detects and formats emphasis (bold, italic) patterns
 */
function formatEmphasis(text: string): string {
	// Bold text using *asterisks* (but not at line start/end to avoid lists)
	text = text.replace(/(?<!^\s*)(\*([^*\n]+)\*)(?!\s*$)/gm, '<strong>$2</strong>');
	
	// Italic text using _underscores_ (but not at line start/end to avoid lists)
	text = text.replace(/(?<!^\s*)(_([^_\n]+)_(?!\s*$))/gm, '<em>$2</em>');
	
	// All caps words (likely emphasis) - include Polish letters
	text = text.replace(/\b([A-ZĄĆĘŁŃÓŚŹŻ]{3,})\b/gu, '<strong>$1</strong>');
	
	// Text in quotes (emphasis)
	text = text.replace(/"([^"]+)"/g, '<em>"$1"</em>');

	return text;
}

/**
 * Detects and formats technical specifications
 */
function formatSpecifications(text: string): string {
	// Key: Value patterns (like "Waga: 5kg", "Moc: 1200W") - include Polish letters
	text = text.replace(/\b([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]{1,20}):\s*([^,\n]+?)(?=,|\n|$)/gu, 
		'<strong>$1:</strong> $2');
	
	// Additional pattern for Polish words that might not match \b correctly
	text = text.replace(/([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]{1,20}):\s*([^,\n]+?)(?=,|\n|$)/gu, 
		'<strong>$1:</strong> $2');
	
	// Measurements and units
	text = text.replace(/\b(\d+(?:\.\d+)?)\s*(mm|cm|m|kg|g|W|V|A|Hz|bar|PS|kW|nm|μm|°C|°F|rpm|Nm|l|ml)\b/gi, 
		'<span class="measurement">$1$2</span>');
	
	// Model numbers and codes (include Polish letters in surrounding text)
	text = text.replace(/\b([A-ZĄĆĘŁŃÓŚŹŻ]{2,4}[-\s]?\d{3,6})\b/gu, '<span class="model">$1</span>');

	return text;
}

/**
 * Splits long text into sentences for better readability
 */
function splitIntoSentences(text: string): string[] {
	const sentences = text
		.split(/([.!?])\s+/)
		.reduce((acc: string[], part: string, index: number, arr: string[]) => {
			if (index % 2 === 0) {
				const sentence = part + (arr[index + 1] || '');
				if (sentence.trim()) {
					acc.push(sentence.trim());
				}
			}
			return acc;
		}, []);

	// Group sentences into paragraphs of 2-3 sentences each
	const paragraphs: string[] = [];
	for (let i = 0; i < sentences.length; i += 3) {
		paragraphs.push(sentences.slice(i, i + 3).join(' '));
	}

	return paragraphs.filter(p => p.length > 0);
}
