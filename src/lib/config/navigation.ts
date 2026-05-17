export interface NavLink {
	label: string;
	href: string;
	badge?: boolean;
	hasCaret?: boolean;
}

export const MAIN_NAV: NavLink[] = [
	{ href: '/products', label: 'Produkty', hasCaret: true },
	{ href: '/deals', label: 'Promocje', badge: true },
	{ href: '/about', label: 'O marce' },
	{ href: '/contact', label: 'Serwis' },
	{ href: '/contact', label: 'Kontakt' }
];

export const FOOTER_SHOP: NavLink[] = [
	{ href: '/products', label: 'Produkty' },
	{ href: '/deals', label: 'Promocje' },
	{ href: '/products?sort=new', label: 'Nowości' },
	{ href: '/products?sort=bestsellers', label: 'Bestsellery' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Kontakt' }
];

export const FOOTER_INFO: NavLink[] = [
	{ href: '/about', label: 'O nas' },
	{ href: '/contact', label: 'Serwis' },
	{ href: '/contact', label: 'Dostawa i płatności' },
	{ href: '/contact', label: 'Zwroty i reklamacje' },
	{ href: '/regulamin', label: 'Regulamin' },
	{ href: '/polityka-prywatnosci', label: 'Polityka prywatności' }
];

export const FOOTER_LEGAL: NavLink[] = [
	{ href: '/regulamin', label: 'Regulamin' },
	{ href: '/polityka-prywatnosci', label: 'Polityka prywatności' }
];
