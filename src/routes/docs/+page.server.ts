import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import guidePlRaw from '../../../docs/baselinker-guide.md?raw';
import guideUkRaw from '../../../docs/baselinker-guide-uk.md?raw';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	return {
		guidePl: renderMarkdown(guidePlRaw),
		guideUk: renderMarkdown(guideUkRaw)
	};
};

/**
 * Minimal markdown to HTML renderer.
 */
function renderMarkdown(md: string): string {
	if (!md) return '';

	const lines = md.split('\n');
	const html: string[] = [];
	let inCodeBlock = false;
	let inList = false;
	let listType = '';
	let inTable = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Code blocks
		if (line.startsWith('```')) {
			if (inCodeBlock) {
				html.push('</code></pre>');
				inCodeBlock = false;
			} else {
				inCodeBlock = true;
				html.push('<pre><code>');
			}
			continue;
		}
		if (inCodeBlock) {
			html.push(esc(line) + '\n');
			continue;
		}

		const trimmed = line.trim();

		// Close list if needed
		if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !/^\d+\.\s/.test(trimmed)) {
			html.push(listType === 'ul' ? '</ul>' : '</ol>');
			inList = false;
		}

		// Close table if needed
		if (inTable && !trimmed.startsWith('|')) {
			html.push('</tbody></table>');
			inTable = false;
		}

		if (!trimmed) continue;
		if (/^---+$/.test(trimmed)) continue;

		// Headings
		if (trimmed.startsWith('#### ')) {
			html.push(`<h4>${inline(trimmed.slice(5))}</h4>`);
		} else if (trimmed.startsWith('### ')) {
			html.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
		} else if (trimmed.startsWith('## ')) {
			html.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
		} else if (trimmed.startsWith('# ')) {
			html.push(`<h1>${inline(trimmed.slice(2))}</h1>`);
		}

		// Tables
		else if (trimmed.startsWith('|')) {
			if (!inTable) {
				inTable = true;
				const cells = trimmed.split('|').filter(Boolean).map(c => c.trim());
				html.push('<table><thead><tr>');
				for (const cell of cells) html.push(`<th>${inline(cell)}</th>`);
				html.push('</tr></thead>');
				if (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].includes('---')) i++;
				html.push('<tbody>');
			} else {
				const cells = trimmed.split('|').filter(Boolean).map(c => c.trim());
				html.push('<tr>');
				for (const cell of cells) html.push(`<td>${inline(cell)}</td>`);
				html.push('</tr>');
			}
		}

		// Unordered list
		else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
			if (!inList) { inList = true; listType = 'ul'; html.push('<ul>'); }
			html.push(`<li>${inline(trimmed.slice(2))}</li>`);
		}

		// Ordered list
		else if (/^\d+\.\s/.test(trimmed)) {
			if (!inList) { inList = true; listType = 'ol'; html.push('<ol>'); }
			html.push(`<li>${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`);
		}

		// Paragraph
		else {
			html.push(`<p>${inline(trimmed)}</p>`);
		}
	}

	if (inCodeBlock) html.push('</code></pre>');
	if (inList) html.push(listType === 'ul' ? '</ul>' : '</ol>');
	if (inTable) html.push('</tbody></table>');

	return html.join('\n');
}

function esc(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s: string): string {
	let out = esc(s);
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
	out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
	out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
	return out;
}
