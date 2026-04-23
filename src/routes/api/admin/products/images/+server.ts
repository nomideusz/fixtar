import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateProductImages, updateProductMainImage } from '$lib/server/products';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const productId = typeof body.productId === 'string' ? body.productId.trim() : '';

		if (!productId) {
			return json({ error: 'Missing productId' }, { status: 400 });
		}

		// Full-order update: { productId, mainImage, gallery }
		if (typeof body.mainImage === 'string' && Array.isArray(body.gallery)) {
			const gallery = body.gallery.filter((img: unknown): img is string => typeof img === 'string');
			await updateProductImages(productId, body.mainImage.trim(), gallery);
			return json({ success: true, productId });
		}

		// Legacy: { productId, image } — set as main
		if (typeof body.image === 'string' && body.image.trim()) {
			await updateProductMainImage(productId, body.image.trim());
			return json({ success: true, productId, image: body.image.trim() });
		}

		return json({ error: 'Missing image or gallery payload' }, { status: 400 });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to update product images';
		const clientError =
			message === 'Product not found' ||
			message === 'Invalid main image' ||
			message.startsWith('Selected') ||
			message.startsWith('Gallery contains');
		const status = clientError ? 400 : 500;

		console.error('Error updating product images:', err);
		return json({ error: message }, { status });
	}
};
