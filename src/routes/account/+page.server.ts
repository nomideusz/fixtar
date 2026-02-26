import { fail, redirect } from '@sveltejs/kit';
import { logoutUser, deleteSessionCookie } from '$lib/server/auth';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

// Define types for our data
interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	mainImage: string;
	slug: string;
	// Add other product fields as needed
}

interface Order {
	id: string;
	orderNumber?: string;
	created: string;
	status?: string;
	total: number;
}

interface Cart {
	id: string;
	status: string;
	items: any[];
	[key: string]: any;
}

// Collection interface for PocketBase
interface Collection {
	name: string;
	[key: string]: any;
}

export const actions: Actions = {
	logout: async (event) => {
		logoutUser(event.locals.pb);
		deleteSessionCookie(event);

		event.cookies.set('pb-auth', '', {
			path: '/',
			expires: new Date(0),
			maxAge: 0,
			httpOnly: true
		});

		event.cookies.set('pb-auth_exists', '', {
			path: '/',
			expires: new Date(0),
			maxAge: 0,
			httpOnly: false
		});

		return redirect(302, '/auth/login');
	}
};

export const load = (async ({ locals, fetch }) => {
	// Get PocketBase instance and authenticated user
	const pb = locals.pb;
	const user = locals.user;
	
	// If no user is authenticated, return empty data
	if (!user) {
		console.log("Account page: No authenticated user found");
		return {
			orders: [],
			cart: null,
			favorites: []
		};
	}
	
	// Log user data for debugging
	console.log(`Account page: Authenticated as ${user.username || user.email} (ID: ${user.id})`);
	
	try {
		// Create empty placeholders
		let orders: Order[] = [];
		let cart: Cart | null = null;
		let favorites: Product[] = [];
		
		// Check if collections exist by listing them first
		const collections: Collection[] = await pb.collections.getFullList().catch(e => {
			console.error("Could not get collections:", e);
			return [];
		});
		
		const collectionMap: Record<string, boolean> = {};
		collections.forEach(collection => {
			collectionMap[collection.name] = true;
		});
		
		console.log("Available collections:", Object.keys(collectionMap).join(", "));
		
		// Only attempt to query orders if the collection exists
		if (collectionMap['orders']) {
			// Try to fetch orders without any filters first
			try {
				const sampleOrder = await pb.collection('orders').getFirstListItem("").catch(() => null);
				console.log("Sample order structure:", sampleOrder ? Object.keys(sampleOrder) : "No orders found");
				
				// Now try with proper filters based on schema
				if (sampleOrder) {
					// Check which field contains the user reference
					const userFieldName = Object.keys(sampleOrder).find(key => 
						key === 'user' || key === 'userId' || key === 'user_id'
					) || 'user';
					
					console.log(`Using field "${userFieldName}" for user reference in orders`);
					
					// Use the discovered field name
					orders = await pb.collection('orders').getList(1, 5, {
						filter: `${userFieldName} = "${user.id}"`,
						sort: '-created'
					}).then(res => res.items.map((item: any) => ({
						id: item.id || '',
						orderNumber: item.orderNumber || item.id || '',
						created: item.created || new Date().toISOString(),
						status: item.status || 'processing',
						total: typeof item.total === 'number' ? item.total : 0
					}))).catch(e => {
						console.error(`Error fetching orders with ${userFieldName} filter:`, e);
						return [];
					});
				}
			} catch (e) {
				console.error("Error getting sample order:", e);
			}
		}
		
		// Only attempt to query carts if the collection exists
		if (collectionMap['carts']) {
			try {
				const sampleCart = await pb.collection('carts').getFirstListItem("").catch(() => null);
				console.log("Sample cart structure:", sampleCart ? Object.keys(sampleCart) : "No carts found");
				
				if (sampleCart) {
					// Check which field contains the user reference
					const userFieldName = Object.keys(sampleCart).find(key => 
						key === 'user' || key === 'userId' || key === 'user_id'
					) || 'user';
					
					console.log(`Using field "${userFieldName}" for user reference in carts`);
					
					// Use the discovered field name
					cart = (await pb.collection('carts').getFirstListItem(
						`${userFieldName} = "${user.id}" && status = "active"`
					).catch(() => null)) as unknown as Cart | null;
				}
			} catch (e) {
				console.error("Error getting sample cart:", e);
			}
		}
		
		// Fetch user's wishlist items - this is stored in the user object itself
		const wishlistItems: string[] = user.wishlist ? (Array.isArray(user.wishlist) ? user.wishlist : []) : [];
		console.log(`User has ${wishlistItems.length} items in wishlist`);
		
		// Only attempt to get product details if we have wishlist items and products collection exists
		if (wishlistItems.length > 0 && collectionMap['products']) {
			try {
				// Build a filter for wishlist items
				const idFilters = wishlistItems.map((id: string) => `id = "${id}"`).join(' || ');
				
				if (idFilters) {
					const result = await pb.collection('products').getFullList({
						filter: idFilters,
						sort: 'name'
					}).catch(e => {
						console.error("Error fetching product details:", e);
						return [];
					});
					
					favorites = result as unknown as Product[];
				}
			} catch (e) {
				console.error("Error processing wishlist:", e);
			}
		}
		
		return {
			orders,
			cart,
			favorites
		};
	} catch (error) {
		console.error('Error fetching account data:', error);
		return {
			orders: [],
			cart: null,
			favorites: [],
			error: 'Failed to load account data'
		};
	}
}) satisfies PageServerLoad;

