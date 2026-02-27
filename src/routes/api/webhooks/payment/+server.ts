import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PaymentService } from '$lib/services/payment';

export const POST: RequestHandler = async ({ request, url }) => {
	const paymentService = new PaymentService();

	try {
		const provider = url.searchParams.get('provider');

		if (!provider) {
			return json({ status: 'ERROR', message: 'Provider not specified' }, { status: 400 });
		}

		const data = await request.json();

		// Verify payment with the appropriate provider
		const verification = await paymentService.verifyPayment(provider, data);

		if (verification.success) {
			const orderId = data.sessionId || data.orderId || data.order_id;

			if (orderId) {
				// TODO: Update order status in Turso DB (replace PocketBase collection call)
				console.warn('[TODO] webhooks/payment: update order', orderId, 'status in DB');
				// TODO: Send confirmation email
				// TODO: Clear cart (if we have user session)
				// TODO: Update inventory
			}

			return json({ status: 'OK' });
		}

		return json({ status: 'ERROR', message: 'Verification failed' }, { status: 400 });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ status: 'ERROR', message: 'Internal server error' }, { status: 500 });
	}
};
