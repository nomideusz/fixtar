export interface NavLink {
	label: string;
	href: string;
	badge?: boolean;
}

export const MAIN_NAV: NavLink[] = [
	{ href: '/products', label: 'Produkty', badge: false },
	{ href: '/deals', label: 'Promocje', badge: true },
	{ href: '/contact', label: 'Kontakt', badge: false }
];

export const FOOTER_SHOP: NavLink[] = [
	{ href: '/products', label: 'Produkty' },
	{ href: '/deals', label: 'Promocje' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Kontakt' },
	{ href: '/about', label: 'O nas' }
];

export const FOOTER_LEGAL: NavLink[] = [
	{ href: '/regulamin', label: 'Regulamin' },
	{ href: '/polityka-prywatnosci', label: 'Polityka prywatności' }
];
