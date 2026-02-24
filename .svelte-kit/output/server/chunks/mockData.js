const mockCategories = [
  {
    id: "chainsaws",
    name: "Pilarki łańcuchowe",
    image: "https://images.unsplash.com/photo-1601001816339-74036f8d1e23?q=80&w=500&h=400&fit=crop",
    count: 18
  },
  {
    id: "drills",
    name: "Wiertarki i wkrętarki",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&h=400&fit=crop",
    count: 32
  },
  {
    id: "grinders",
    name: "Szlifierki",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&h=400&fit=crop",
    count: 22
  },
  {
    id: "saws",
    name: "Piły i pilarki",
    image: "https://images.unsplash.com/photo-1620230874645-0d85420003f2?q=80&w=500&h=400&fit=crop",
    count: 26
  },
  {
    id: "garden-tools",
    name: "Narzędzia ogrodowe",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop",
    count: 35
  },
  {
    id: "welding",
    name: "Spawarki",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&h=400&fit=crop",
    count: 14
  },
  {
    id: "compressors",
    name: "Kompresory",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=500&h=400&fit=crop",
    count: 12
  },
  {
    id: "measuring",
    name: "Narzędzia pomiarowe",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop",
    count: 28
  }
];
const mockProducts = [
  // Best Sellers
  {
    id: "best-1",
    name: "Stihl MS 261 C-M Pilarka łańcuchowa",
    price: 3299,
    image: "https://images.unsplash.com/photo-1601001816339-74036f8d1e23?q=80&w=500&h=400&fit=crop",
    category: "chainsaws",
    description: "Profesjonalna pilarka łańcuchowa Stihl z technologią M-Tronic. Idealna do prac leśnych i profesjonalnej wycinki drewna. Silnik 2-MIX o mocy 3,0 kW."
  },
  {
    id: "best-2",
    name: "Makita DHP486Z Wiertarko-wkrętarka 18V",
    price: 899,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&h=400&fit=crop",
    category: "drills",
    description: "Bezszczotkowa wiertarko-wkrętarka udarowa 18V LXT. Moment obrotowy 130 Nm, 2 biegi, oświetlenie LED."
  },
  {
    id: "best-3",
    name: "Bosch GWS 18V-15 SC Szlifierka kątowa",
    price: 1599,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&h=400&fit=crop",
    category: "grinders",
    description: "Akumulatorowa szlifierka kątowa 18V z technologią BITURBO. Tarcza 125mm, bezszczotkowy silnik, system KickBack Control."
  },
  {
    id: "best-4",
    name: "Husqvarna 135 Mark II Pilarka",
    price: 1699,
    image: "https://images.unsplash.com/photo-1620230874645-0d85420003f2?q=80&w=500&h=400&fit=crop",
    category: "chainsaws",
    description: "Lekka i wydajna pilarka łańcuchowa do użytku domowego. Silnik X-Torq, automatyczny oiler, waga zaledwie 4,7 kg."
  },
  // New Arrivals
  {
    id: "new-1",
    name: "Milwaukee M18 FUEL Piła tarczowa",
    price: 2199,
    image: "https://images.unsplash.com/photo-1620230874645-0d85420003f2?q=80&w=500&h=400&fit=crop",
    category: "saws",
    description: "Profesjonalna piła tarczowa 18V z silnikiem POWERSTATE. Tarcza 190mm, głębokość cięcia 66mm."
  },
  {
    id: "new-2",
    name: "DeWalt DCG405N Szlifierka kątowa 18V",
    price: 749,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&h=400&fit=crop",
    category: "grinders",
    description: "Kompaktowa szlifierka kątowa z bezszczotkowym silnikiem. Tarcza 125mm, E-Clutch, Perform & Protect."
  },
  {
    id: "new-3",
    name: "Stihl RMA 339 Kosiarka akumulatorowa",
    price: 1899,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop",
    category: "garden-tools",
    description: "Akumulatorowa kosiarka do trawników 36V. Szerokość koszenia 37cm, kosz 40l, regulacja wysokości koszenia."
  },
  {
    id: "new-4",
    name: "Migomat Sherman DIGIMIG 200 Synergic",
    price: 2799,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&h=400&fit=crop",
    category: "welding",
    description: "Spawarka synergiczna MIG/MAG z wyświetlaczem cyfrowym. Prąd spawania 200A, drut 0.6-1.0mm."
  },
  // Trending Products
  {
    id: "trend-1",
    name: "Karcher K 5 Premium Full Control Plus",
    price: 1699,
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=500&h=400&fit=crop",
    category: "garden-tools",
    description: "Myjka ciśnieniowa z chłodzonym wodą silnikiem indukcyjnym. Ciśnienie 145 bar, przepływ 500 l/h."
  },
  {
    id: "trend-2",
    name: "Bosch GLM 50 C Dalmierz laserowy",
    price: 599,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop",
    category: "measuring",
    description: "Profesjonalny dalmierz laserowy z Bluetooth. Zasięg 50m, dokładność ±1.5mm, kolorowy wyświetlacz."
  },
  {
    id: "trend-3",
    name: "Husqvarna 525BX Dmuchawa spalinowa",
    price: 1499,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&h=400&fit=crop",
    category: "garden-tools",
    description: "Profesjonalna dmuchawa plecakowa z silnikiem X-Torq. Prędkość powietrza 79.2 m/s, niska emisja spalin."
  },
  {
    id: "trend-4",
    name: "Stanley FATMAX Zestaw narzędzi 145 elem.",
    price: 899,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&h=400&fit=crop",
    category: "measuring",
    description: "Profesjonalny zestaw narzędzi ręcznych w walizce. 145 elementów: klucze, bity, nasadki, śrubokręty."
  },
  {
    id: "trend-5",
    name: "Einhell TE-AC 36/6/8 Li OF Kompresor",
    price: 1299,
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=500&h=400&fit=crop",
    category: "compressors",
    description: "Akumulatorowy kompresor bezolejowy 36V. Zbiornik 6L, ciśnienie max 8 bar, cichy i wydajny."
  }
];
mockProducts.filter((p) => p.id.startsWith("best-"));
mockProducts.filter((p) => p.id.startsWith("new-"));
mockProducts.filter((p) => p.id.startsWith("trend-"));
export {
  mockCategories as a,
  mockProducts as m
};
