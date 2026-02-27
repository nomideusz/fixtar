import type { Product, Category } from '$lib/types';

// Mock Categories - Power Tools & Equipment
export const mockCategories: Category[] = [
	{
		id: 'chainsaws',
		name: 'Pilarki łańcuchowe',
		image: '/img/pila1.png',
		count: 18
	},
	{
		id: 'drills',
		name: 'Wiertarki i wkrętarki',
		image: '/img/wkretarka1.jpg',
		count: 32
	},
	{
		id: 'grinders',
		name: 'Szlifierki',
		image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=500&h=400&fit=crop',
		count: 22
	},
	{
		id: 'saws',
		name: 'Piły i pilarki',
		image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&h=400&fit=crop',
		count: 26
	},
	{
		id: 'garden-tools',
		name: 'Narzędzia ogrodowe',
		image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop',
		count: 35
	},
	{
		id: 'welding',
		name: 'Spawarki',
		image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&h=400&fit=crop',
		count: 14
	},
	{
		id: 'compressors',
		name: 'Kompresory',
		image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop',
		count: 12
	},
	{
		id: 'measuring',
		name: 'Narzędzia pomiarowe',
		image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop',
		count: 28
	}
];

// Mock Products - Power Tools & Equipment
// Each product uses a unique, relevant image
export const mockProducts: Product[] = [
	// Best Sellers
	{
		id: 'best-1',
		name: 'Stihl MS 261 C-M Pilarka łańcuchowa',
		price: 3299.0,
		image: '/img/chainsaw-hero.png',
		category: 'chainsaws',
		description:
			'Profesjonalna pilarka łańcuchowa Stihl z technologią M-Tronic. Idealna do prac leśnych i profesjonalnej wycinki drewna. Silnik 2-MIX o mocy 3,0 kW.'
	},
	{
		id: 'best-2',
		name: 'Makita DHP486Z Wiertarko-wkrętarka 18V',
		price: 899.0,
		image: '/img/wkretarka1.jpg',
		category: 'drills',
		description:
			'Bezszczotkowa wiertarko-wkrętarka udarowa 18V LXT. Moment obrotowy 130 Nm, 2 biegi, oświetlenie LED.'
	},
	{
		id: 'best-3',
		name: 'Bosch GWS 18V-15 SC Szlifierka kątowa',
		price: 1599.0,
		image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=500&h=400&fit=crop',
		category: 'grinders',
		description:
			'Akumulatorowa szlifierka kątowa 18V z technologią BITURBO. Tarcza 125mm, bezszczotkowy silnik, system KickBack Control.'
	},
	{
		id: 'best-4',
		name: 'Husqvarna 135 Mark II Pilarka',
		price: 1699.0,
		image: '/img/pila1.webp',
		category: 'chainsaws',
		description:
			'Lekka i wydajna pilarka łańcuchowa do użytku domowego. Silnik X-Torq, automatyczny oiler, waga zaledwie 4,7 kg.'
	},

	// New Arrivals
	{
		id: 'new-1',
		name: 'Milwaukee M18 FUEL Piła tarczowa',
		price: 2199.0,
		image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=500&h=400&fit=crop',
		category: 'saws',
		description:
			'Profesjonalna piła tarczowa 18V z silnikiem POWERSTATE. Tarcza 190mm, głębokość cięcia 66mm.'
	},
	{
		id: 'new-2',
		name: 'DeWalt DCG405N Szlifierka kątowa 18V',
		price: 749.0,
		image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=500&h=400&fit=crop',
		category: 'grinders',
		description:
			'Kompaktowa szlifierka kątowa z bezszczotkowym silnikiem. Tarcza 125mm, E-Clutch, Perform & Protect.'
	},
	{
		id: 'new-3',
		name: 'Stihl RMA 339 Kosiarka akumulatorowa',
		price: 1899.0,
		image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop',
		category: 'garden-tools',
		description:
			'Akumulatorowa kosiarka do trawników 36V. Szerokość koszenia 37cm, kosz 40l, regulacja wysokości koszenia.'
	},
	{
		id: 'new-4',
		name: 'Migomat Sherman DIGIMIG 200 Synergic',
		price: 2799.0,
		image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&h=400&fit=crop',
		category: 'welding',
		description:
			'Spawarka synergiczna MIG/MAG z wyświetlaczem cyfrowym. Prąd spawania 200A, drut 0.6-1.0mm.'
	},

	// Trending Products
	{
		id: 'trend-1',
		name: 'Karcher K 5 Premium Full Control Plus',
		price: 1699.0,
		image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&h=400&fit=crop',
		category: 'garden-tools',
		description:
			'Myjka ciśnieniowa z chłodzonym wodą silnikiem indukcyjnym. Ciśnienie 145 bar, przepływ 500 l/h.'
	},
	{
		id: 'trend-2',
		name: 'Bosch GLM 50 C Dalmierz laserowy',
		price: 599.0,
		image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop',
		category: 'measuring',
		description:
			'Profesjonalny dalmierz laserowy z Bluetooth. Zasięg 50m, dokładność ±1.5mm, kolorowy wyświetlacz.'
	},
	{
		id: 'trend-3',
		name: 'Husqvarna 525BX Dmuchawa spalinowa',
		price: 1499.0,
		image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop',
		category: 'garden-tools',
		description:
			'Profesjonalna dmuchawa plecakowa z silnikiem X-Torq. Prędkość powietrza 79.2 m/s, niska emisja spalin.'
	},
	{
		id: 'trend-4',
		name: 'Stanley FATMAX Zestaw narzędzi 145 elem.',
		price: 899.0,
		image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop',
		category: 'measuring',
		description:
			'Profesjonalny zestaw narzędzi ręcznych w walizce. 145 elementów: klucze, bity, nasadki, śrubokręty.'
	},
	{
		id: 'trend-5',
		name: 'Einhell TE-AC 36/6/8 Li OF Kompresor',
		price: 1299.0,
		image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop',
		category: 'compressors',
		description:
			'Akumulatorowy kompresor bezolejowy 36V. Zbiornik 6L, ciśnienie max 8 bar, cichy i wydajny.'
	}
];

// Group products by collection for easy access
export const bestSellers = mockProducts.filter((p) => p.id.startsWith('best-'));
export const newArrivals = mockProducts.filter((p) => p.id.startsWith('new-'));
export const trendingProducts = mockProducts.filter((p) => p.id.startsWith('trend-'));

// Hero carousel data
export const heroProducts = [
	{
		id: 1,
		title: 'Stihl MS 261 C-M',
		subtitle:
			'Profesjonalna pilarka łańcuchowa z technologią M-Tronic. Niezawodna moc dla wymagających zadań leśnych i budowlanych.',
		image: '/img/pila1.png',
		badge: 'BESTSELLER',
		badgeColor: 'green',
		price: 3299.0,
		discount: 0,
		href: '/products?product=best-1'
	},
	{
		id: 2,
		title: 'Makita DHP486Z 18V',
		subtitle:
			'Bezszczotkowa wiertarko-wkrętarka udarowa. Moment obrotowy 130 Nm, niezawodna w każdych warunkach.',
		image: '/img/wkretarka1.webp',
		badge: 'NOWOŚĆ',
		badgeColor: 'blue',
		price: 899.0,
		discount: 10,
		href: '/products?product=best-2'
	},
	{
		id: 3,
		title: 'Bosch BITURBO Szlifierka',
		subtitle:
			'Akumulatorowa szlifierka kątowa 18V z bezszczotkowym silnikiem i systemem KickBack Control.',
		image:
			'https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=1165&auto=format&fit=crop',
		badge: 'POLECANY',
		badgeColor: 'purple',
		price: 1599.0,
		discount: 15,
		href: '/products?product=best-3'
	},
	{
		id: 4,
		title: 'Milwaukee M18 FUEL',
		subtitle:
			'Profesjonalna piła tarczowa z silnikiem POWERSTATE. Moc i precyzja dla wymagających.',
		image:
			'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=500&auto=format&fit=crop',
		badge: 'POPULARNY',
		badgeColor: 'orange',
		price: 2199.0,
		discount: 0,
		href: '/products?product=new-1'
	}
];
