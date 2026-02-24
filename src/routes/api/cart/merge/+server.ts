import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthenticatedUser } from '$lib/server/auth';
import type { CartItem } from '$lib/types';

/**
 * POST to merge a guest cart with the authenticated user's server cart
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
		// Get guest cart data from request
		const { guestItems } = await request.json() as { guestItems: CartItem[] };
		
		if (!Array.isArray(guestItems)) {
			return json({ 
				success: false, 
				message: 'Invalid cart data format' 
			}, { status: 400 });
		}
		
		// In a real implementation, we'd use more sophisticated merging logic
		// This is a simple implementation that prioritizes guest cart items
		const pb = locals.pb;
		let serverItems: CartItem[] = [];
		let merged: CartItem[] = [];
		
		try {
			// Try to get existing user cart from server
			const existingCart = await pb.collection('user_carts').getFirstListItem(`user_id="${user.id}"`);
			serverItems = existingCart.items || [];
			
			// Merge the carts:
			// 1. Start with server items
			merged = [...serverItems];
			
			// 2. For each guest item, either update quantity or add as new
			for (const guestItem of guestItems) {
				const existingItemIndex = merged.findIndex(item => 
					item.product.id === guestItem.product.id
				);
				
				if (existingItemIndex >= 0) {
					// Update existing item quantity
					merged[existingItemIndex].quantity += guestItem.quantity;
				} else {
					// Add new item from guest cart
					merged.push(guestItem);
				}
			}
			
			// 3. Update the cart in the database
			await pb.collection('user_carts').update(existingCart.id, {
				items: merged,
				updated: new Date().toISOString()
			});
			
		} catch (e) {
			// User cart doesn't exist yet, just use guest cart
			merged = guestItems;
			
			// Create new cart with merged items
			await pb.collection('user_carts').create({
				user_id: user.id,
				items: merged,
				created: new Date().toISOString(),
				updated: new Date().toISOString()
			});
		}
		
		return json({ 
			success: true, 
			message: 'Carts merged successfully',
			items: merged,
			mergeStats: {
				guestItemCount: guestItems.length,
				serverItemCount: serverItems.length,
				mergedItemCount: merged.length
			}
		});
		
	} catch (err) {
		console.error('Error merging carts:', err);
		return json({ 
			success: false, 
			message: 'Error merging carts' 
		}, { status: 500 });
	}
}; 