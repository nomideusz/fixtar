import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setProductFeatured } from '$lib/server/products';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
		const featured = Boolean(body.featured);

		if (!productId) {
			return json({ error: 'Missing productId' }, { status: 400 });
		}

		await setProductFeatured(productId, featured);
		return json({ success: true, productId, featured });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to update featured flag';
		const status = message === 'Product not found' ? 400 : 500;
		console.error('Error updating featured flag:', err);
		return json({ error: message }, { status });
	}
};
