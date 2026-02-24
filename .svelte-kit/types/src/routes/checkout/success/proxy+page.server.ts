// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ url, locals }: Parameters<PageServerLoad>[0]) => {
	const pb = locals.pb;
	const orderId = url.searchParams.get('order');
	
	if (!orderId) {
		// If no order ID, just show generic success
		return {
			order: null
		};
	}
	
	try {
		// Fetch order details
		const order = await pb.collection('orders').getOne(orderId, {
			expand: 'user'
		});
		
		// For guest checkout, we allow viewing the order immediately after creation
		// In a real app, you might want to use session or email verification
		const user = locals.user;
		
		// Allow access if:
		// 1. It's the user's order
		// 2. User is admin
		// 3. It's a guest order (no user) and we're viewing it right after creation
		if (order.user && order.user !== user?.id && !user?.isAdmin) {
			throw error(403, 'Brak dostępu do tego zamówienia');
		}
		
		return {
			order
		};
	} catch (e) {
		console.error('Error fetching order:', e);
		// Return null order if not found
		return {
			order: null
		};
	}
}; 