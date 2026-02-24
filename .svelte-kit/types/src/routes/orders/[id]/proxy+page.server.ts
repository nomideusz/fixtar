// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Product } from '$lib/stores/products.svelte';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

interface OrderItem {
	id: string;
	productId: string;
	quantity: number;
	price: number;
	product?: Product;
}

interface Order {
	id: string;
	orderNumber: string;
	status: string;
	user?: string;
	items: OrderItem[];
	shippingAddress: {
		firstName: string;
		lastName: string;
		street: string;
		city: string;
		postalCode: string;
		country: string;
	};
	billingAddress?: {
		firstName: string;
		lastName: string;
		street: string;
		city: string;
		postalCode: string;
		country: string;
	};
	paymentMethod: string;
	shippingMethod: string;
	subtotal: number;
	tax: number;
	shippingCost: number;
	total: number;
	notes?: string;
	metadata?: {
		email: string;
		phone?: string;
		nip?: string;
		paymentDetails?: any;
	};
	created: string;
	updated: string;
}

export const load = async ({ params, locals, fetch }: Parameters<PageServerLoad>[0]) => {
	const orderId = params.id;
	
	if (!orderId) {
		throw error(404, 'Order not found');
	}

	try {
		// Get the order from PocketBase
		const orderResponse = await fetch(`${POCKETBASE_URL}/api/collections/orders/records/${orderId}`);
		
		if (!orderResponse.ok) {
			if (orderResponse.status === 404) {
				throw error(404, 'Order not found');
			}
			throw error(500, 'Failed to fetch order');
		}
		
		const order: Order = await orderResponse.json();
		
		// Check if user has permission to view this order
		const user = locals.user;
		if (!user) {
			// For guest orders, we could implement a token-based system
			// For now, redirect to login
			throw error(401, 'Please log in to view your orders');
		}
		
		// Check if this order belongs to the current user (unless admin)
		if (order.user !== user.id && user.role !== 'admin') {
			throw error(403, 'You do not have permission to view this order');
		}
		
		// Fetch product details for each order item
		const itemsWithProducts = await Promise.all(
			order.items.map(async (item) => {
				try {
					const productResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${item.productId}`);
					if (productResponse.ok) {
						const product = await productResponse.json();
						// Add proper image URLs
						return {
							...item,
							product: {
								...product,
								mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
								images: product.gallery ? product.gallery.map((img: string) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
							}
						};
					}
				} catch (error) {
					console.error(`Failed to fetch product ${item.productId}:`, error);
				}
				
				// Return item without product details if fetch failed
				return item;
			})
		);
		
		return {
			order: {
				...order,
				items: itemsWithProducts
			},
			user
		};
		
	} catch (err) {
		console.error('Error loading order:', err);
		
		if (err instanceof Response) {
			throw err; // Re-throw SvelteKit errors
		}
		
		throw error(500, 'Failed to load order details');
	}
}; 