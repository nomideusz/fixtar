// Podstawowe typy danych dla aplikacji

// Common types shared across the application

// Product
export interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	category: string;
	description?: string;
	rating?: number;
	reviewCount?: number;
	inStock?: boolean;
	discount?: number;
	originalPrice?: number;
	tags?: string[];
	specifications?: Record<string, string>;
	relatedProducts?: string[];
}

// Cart
export interface CartItem {
	id: string; // Product id for identification
	product: Product;
	quantity: number;
}

export interface UserAddress {
	id: string;
	street: string;
	city: string;
	state?: string;
	postalCode: string;
	country: string;
	isDefault?: boolean;
	type?: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	phoneNumber?: string;
	photoUrl?: string;
	firstName?: string;
	lastName?: string;
	addresses?: UserAddress[];
	role?: 'user' | 'admin';
	isActive?: boolean;
	lastLogin?: string;
	createdAt?: string;
}

// Category type
export interface Category {
	id: string;
	name: string;
	image?: string;
	count?: number;
	description?: string;
	namepl?: string;
}
