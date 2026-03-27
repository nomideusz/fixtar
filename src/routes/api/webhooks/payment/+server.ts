import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PaymentService } from '$lib/services/payment';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

const paymentService = new PaymentService();

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const provider = url.searchParams.get('provider');

		if (!provider) {
			return json({ status: 'ERROR', message: 'Provider not specified' }, { status: 400 });
		}

		const data = await request.json();
		const orderId = data.sessionId || data.orderId || data.order_id;

		const verification = await paymentService.verifyPayment(provider, data);

		if (verification.success && orderId) {
			// Update order status to completed
			await db
				.update(orders)
				.set({
					status: 'processing',
					updatedAt: new Date()
				})
				.where(eq(orders.id, orderId));

			console.log(`[webhook] Order ${orderId} payment verified via ${provider}`);
			return json({ status: 'OK' });
		}

		console.error(`[webhook] Verification failed for ${orderId}:`, verification.error);
		return json({ status: 'ERROR', message: 'Verification failed' }, { status: 400 });
	} catch (error) {
		console.error('[webhook] Error:', error);
		return json({ status: 'ERROR', message: 'Internal server error' }, { status: 500 });
	}
};
