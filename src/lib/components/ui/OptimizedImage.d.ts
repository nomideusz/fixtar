export interface OptimizedImageProps {
	src?: string; // Główne źródło obrazka
	alt?: string; // Tekst alternatywny (dostępność)
	className?: string; // Dodatkowe klasy CSS
	width?: number | null; // Szerokość obrazka
	height?: number | null; // Wysokość obrazka
	lazy?: boolean; // Czy używać lazy loading
	placeholder?: string | null; // URL placeholdera
	style?: string; // Inline styles
	quality?: number; // Quality parameter for CDN-based images (1-100)
	fetchPriority?: 'auto' | 'high' | 'low'; // Resource fetch priority
	generatePlaceholder?: boolean; // Auto-generate a placeholder

	// Dla responsywnych obrazów
	srcset?: string | null; // Opcjonalny zestaw srcset
	sizes?: string | null; // Opcjonalny atrybut sizes
	autoSrcSet?: boolean; // Auto-generate srcSet based on width
	breakpoints?: number[]; // Breakpoints for srcSet generation

	// Dla obrazów WebP/AVIF
	srcWebp?: string | null; // Opcjonalne źródło w formacie WebP
	srcsetWebp?: string | null; // Opcjonalny zestaw srcset w formacie WebP
	format?: 'auto' | 'webp' | 'avif' | 'jpeg'; // Preferred format

	// Advanced options
	rootMargin?: string;
	threshold?: number;
	onLoad?: (img: HTMLImageElement) => void;
	onError?: (img: HTMLImageElement) => void;

	// High quality options
	loadHighResOnIdle?: boolean;
	highResQuality?: number;
	idleTimeout?: number;

	// New responsive options
	maxWidth?: number | null;
	useDpr?: boolean;
	fitStrategy?: 'cover' | 'contain' | 'fill';

	// Render functions
	errorFallback?: () => { t: string; c?: string; h: string | (() => any) };
}
