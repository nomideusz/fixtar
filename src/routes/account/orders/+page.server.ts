import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { getBaseLinkerService } from '$lib/services/baselinker';
import type { BaseLinkerOrder } from '$lib/services/baselinker';

/**
 * Map BaseLinker numeric status IDs to string statuses.
 * These are cached after first fetch from getOrderStatusList().
 */
let statusCache: Map<number, string> | null = null;

async function getStatusMap(): Promise<Map<number, string>> {
	if (statusCache) return statusCache;
	try {
		const service = getBaseLinkerService();
		const { statuses } = await service.getOrderStatusList();
		statusCache = new Map();
		for (const [, s] of Object.entries(statuses)) {
			const name = (s.name_for_customer || s.name || '').toLowerCase();
			statusCache.set(s.id, mapStatusName(name));
		}
		return statusCache;
	} catch {
		return new Map();
	}
}

/** Map Polish/BaseLinker status names to our internal status keys */
function mapStatusName(name: string): string {
	const n = name.toLowerCase();
	if (n.includes('dostarcz') || n.includes('deliver') || n.includes('odebran')) return 'delivered';
	if (n.includes('wysłan') || n.includes('wyslano') || n.includes('ship') || n.includes('nadano')) return 'shipped';
	if (n.includes('realizacj') || n.includes('process') || n.includes('kompletow')) return 'processing';
	if (n.includes('anulow') || n.includes('cancel') || n.includes('zwrot')) return 'cancelled';
	if (n.includes('opłacon') || n.includes('oplacono') || n.includes('paid')) return 'processing';
	if (n.includes('now') || n.includes('new') || n.includes('pending')) return 'pending';
	return 'processing';
}

function blOrderToLocal(bl: BaseLinkerOrder, statusMap: Map<number, string>) {
	const status = statusMap.get(bl.order_status_id) || 'processing';
	const total = bl.products.reduce((s, p) => s + p.price_brutto * p.quantity, 0) + bl.delivery_price;
	const subtotal = bl.products.reduce((s, p) => s + p.price_brutto * p.quantity, 0);

	return {
		id: `bl-${bl.order_id}`,
		orderNumber: bl.shop_order_id ? String(bl.shop_order_id) : String(bl.order_id),
		baselinkerOrderId: bl.order_id,
		status,
		total: Math.round(total * 100),
		subtotal: Math.round(subtotal * 100),
		shippingCost: Math.round(bl.delivery_price * 100),
		paymentMethod: bl.payment_method || null,
		shippingMethod: bl.delivery_method || null,
		email: bl.email,
		phone: bl.phone || null,
		shippingAddress: JSON.stringify({
			fullName: bl.delivery_fullname,
			company: bl.delivery_company,
			street: bl.delivery_address,
			city: bl.delivery_city,
			postalCode: bl.delivery_postcode,
			country: bl.delivery_country_code
		}),
		items: JSON.stringify(
			bl.products.map((p) => ({
				name: p.name,
				sku: p.sku,
				price: p.price_brutto,
				quantity: p.quantity,
				productId: p.product_id
			}))
		),
		createdAt: new Date(bl.date_add * 1000),
		updatedAt: new Date()
	};
}

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	try {
		// 1. Try fetching from BaseLinker by user email
		const service = getBaseLinkerService();
		const statusMap = await getStatusMap();
		const { orders: blOrders } = await service.getOrders({
			filter_email: locals.user.email
		});

		// 2. Upsert BaseLinker orders into local DB for caching
		for (const bl of blOrders) {
			const local = blOrderToLocal(bl, statusMap);
			await db
				.insert(orders)
				.values({
					...local,
					userId: locals.user.id
				})
				.onConflictDoUpdate({
					target: orders.id,
					set: {
						status: local.status,
						total: local.total,
						shippingCost: local.shippingCost,
						paymentMethod: local.paymentMethod,
						shippingMethod: local.shippingMethod,
						items: local.items,
						updatedAt: new Date()
					}
				});
		}

		// 3. Fetch all orders for this user from DB (includes any local-only orders too)
		const userOrders = await db
			.select()
			.from(orders)
			.where(eq(orders.userId, locals.user.id))
			.orderBy(desc(orders.createdAt));

		return {
			orders: userOrders.map((o) => ({
				id: o.id,
				orderNumber: o.orderNumber,
				created: o.createdAt.toISOString(),
				status: o.status,
				total: o.total / 100,
				paymentMethod: o.paymentMethod,
				shippingMethod: o.shippingMethod
			})),
			totalOrders: userOrders.length,
			totalPages: 1,
			page: 1
		};
	} catch (err: any) {
		console.error('[orders] Failed to load orders:', err.message);

		// Fallback: try local DB only
		try {
			const userOrders = await db
				.select()
				.from(orders)
				.where(eq(orders.userId, locals.user.id))
				.orderBy(desc(orders.createdAt));

			return {
				orders: userOrders.map((o) => ({
					id: o.id,
					orderNumber: o.orderNumber,
					created: o.createdAt.toISOString(),
					status: o.status,
					total: o.total / 100,
					paymentMethod: o.paymentMethod,
					shippingMethod: o.shippingMethod
				})),
				totalOrders: userOrders.length,
				totalPages: 1,
				page: 1
			};
		} catch {
			return {
				orders: [],
				totalOrders: 0,
				totalPages: 1,
				page: 1,
				error: 'Nie udało się pobrać zamówień. Spróbuj ponownie później.'
			};
		}
	}
}) satisfies PageServerLoad;
