import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const load = (async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const [order] = await db
		.select()
		.from(orders)
		.where(and(eq(orders.id, params.id), eq(orders.userId, locals.user.id)));

	if (!order) {
		throw error(404, 'Zamówienie nie zostało znalezione.');
	}

	const items = order.items ? JSON.parse(order.items) : [];
	const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

	return {
		order: {
			id: order.id,
			orderNumber: order.orderNumber,
			status: order.status,
			created: order.createdAt.toISOString(),
			items: items.map((item: any) => ({
				name: item.name,
				quantity: item.quantity,
				price: item.price,
				sku: item.sku || '',
				image: item.image || '',
				productId: item.productId || ''
			})),
			subtotal: order.subtotal / 100,
			shippingCost: order.shippingCost / 100,
			total: order.total / 100,
			paymentMethod: order.paymentMethod || '',
			shippingMethod: order.shippingMethod || '',
			shippingAddress,
			userComments: order.userComments || ''
		},
		user: locals.user
	};
}) satisfies PageServerLoad;
