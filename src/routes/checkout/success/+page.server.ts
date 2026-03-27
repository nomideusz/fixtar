import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const orderId = url.searchParams.get('order');

	if (!orderId) {
		return { order: null, orderId: null };
	}

	const [order] = await db
		.select()
		.from(orders)
		.where(eq(orders.id, orderId));

	if (!order) {
		return { order: null, orderId };
	}

	const items = order.items ? JSON.parse(order.items) : [];
	const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

	return {
		orderId,
		order: {
			id: order.id,
			orderNumber: order.orderNumber,
			status: order.status,
			total: order.total / 100,
			subtotal: order.subtotal / 100,
			shippingCost: order.shippingCost / 100,
			paymentMethod: order.paymentMethod,
			shippingMethod: order.shippingMethod,
			items,
			shippingAddress,
			email: order.email,
			createdAt: order.createdAt.toISOString()
		}
	};
};
