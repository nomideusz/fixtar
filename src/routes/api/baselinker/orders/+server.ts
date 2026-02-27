import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBaseLinkerService } from '$lib/services/baselinker';

/**
 * POST /api/baselinker/orders
 * Push an order from FixTar to BaseLinker
 * Called after successful checkout
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const orderData = await request.json();

		if (!orderData.orderNumber || !orderData.email || !orderData.items?.length) {
			return json({ error: 'Missing required order fields' }, { status: 400 });
		}

		const service = getBaseLinkerService();
		const result = await service.pushOrder(orderData);

		if (result.success) {
			console.log(
				`[BaseLinker] Order ${orderData.orderNumber} pushed successfully. BL ID: ${result.baselinkerOrderId}`
			);
		} else {
			console.error(`[BaseLinker] Failed to push order ${orderData.orderNumber}:`, result.error);
		}

		return json(result);
	} catch (err: any) {
		console.error('[BaseLinker Orders API] Error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

/**
 * GET /api/baselinker/orders
 * Get orders from BaseLinker (for admin sync)
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const statusId = url.searchParams.get('status_id');
		const dateFrom = url.searchParams.get('date_from');

		const service = getBaseLinkerService();
		const result = await service.getOrders({
			...(statusId && { status_id: Number(statusId) }),
			...(dateFrom && { date_from: Number(dateFrom) }),
			get_unconfirmed_orders: true
		});

		return json(result);
	} catch (err: any) {
		console.error('[BaseLinker Orders API] Error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
