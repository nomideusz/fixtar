/** Brands shown on /products facet row — match product titles (case-insensitive). */
export const CATALOG_BRANDS = [
	{ slug: 'bavaria', label: 'Bavaria', patterns: ['bavaria'] },
	{ slug: 'magnum', label: 'Magnum', patterns: ['magnum'] },
	{ slug: 'eurotec', label: 'Eurotec', patterns: ['eurotec'] },
	{ slug: 'sterling', label: 'Sterling', patterns: ['sterling'] },
	{ slug: 'graphite', label: 'Graphite', patterns: ['graphite'] },
	{ slug: 'yato', label: 'Yato', patterns: ['yato'] }
] as const;

export type CatalogBrandSlug = (typeof CATALOG_BRANDS)[number]['slug'];

export function detectCatalogBrandSlug(name: string): CatalogBrandSlug | null {
	const lower = name.toLowerCase();
	for (const b of CATALOG_BRANDS) {
		if (b.patterns.some((p) => lower.includes(p))) return b.slug;
	}
	return null;
}

export function productMatchesBrandSlug(name: string, slug: string): boolean {
	const b = CATALOG_BRANDS.find((x) => x.slug === slug);
	if (!b) return false;
	const lower = name.toLowerCase();
	return b.patterns.some((p) => lower.includes(p));
}
