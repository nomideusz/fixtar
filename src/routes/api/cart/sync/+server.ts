import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthenticatedUser } from '$lib/server/auth';
import type { CartItem } from '$lib/types';

/**
 * GET cart data for the authenticated user
 */
export const GET: RequestHandler = async ({ locals, cookies }) => {
	// Check if user is authenticated
	const user = await getAuthenticatedUser(locals.pb, locals);
	
	if (!user) {
		return json({ 
			success: false, 
			message: 'Authentication required',
			items: [] 
		}, { status: 401 });
	}
	
	try {
		// In a real implementation, you would fetch cart from the database
		// For now, we'll use the PocketBase API to get the user's cart
		const pb = locals.pb;
		
		// Try to get the user's cart from PocketBase collection
		try {
			const userCart = await pb.collection('user_carts').getFirstListItem(`user_id="${user.id}"`);
			return json({ 
				success: true, 
				items: userCart.items || [],
				last_sync: userCart.updated 
			});
		} catch (e) {
			// If cart doesn't exist yet, return empty array
			console.log('User cart not found in database, will create on first sync');
			return json({ 
				success: true, 
				items: [],
				last_sync: null
			});
		}
	} catch (err) {
		console.error('Error fetching cart:', err);
		return json({ 
			success: false, 
			message: 'Error fetching cart',
			items: [] 
		}, { status: 500 });
	}
};

/**
 * POST to update the cart for the authenticated user
 */
export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	// Check if user is authenticated
	const user = await getAuthenticatedUser(locals.pb, locals);
	
	if (!user) {
		return json({ 
			success: false, 
			message: 'Authentication required' 
		}, { status: 401 });
	}
	
	try {
		// Get cart data from request
		const { items } = await request.json() as { items: CartItem[] };
		
		if (!Array.isArray(items)) {
			return json({ 
				success: false, 
				message: 'Invalid cart data format' 
			}, { status: 400 });
		}
		
		// In a real implementation, you would update the cart in the database
		const pb = locals.pb;
		
		try {
			// Try to get existing cart
			const existingCart = await pb.collection('user_carts').getFirstListItem(`user_id="${user.id}"`);
			
			// Update the existing cart
			await pb.collection('user_carts').update(existingCart.id, {
				items: items,
				updated: new Date().toISOString()
			});
			
			return json({ 
				success: true, 
				message: 'Cart updated successfully',
				last_sync: new Date().toISOString()
			});
		} catch (e) {
			// Cart doesn't exist yet, create a new one
			await pb.collection('user_carts').create({
				user_id: user.id,
				items: items,
				created: new Date().toISOString(),
				updated: new Date().toISOString()
			});
			
			return json({ 
				success: true, 
				message: 'Cart created successfully',
				last_sync: new Date().toISOString()
			});
		}
	} catch (err) {
		console.error('Error updating cart:', err);
		return json({ 
			success: false, 
			message: 'Error updating cart' 
		}, { status: 500 });
	}
}; 