import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPocketBaseClient } from '$lib/server/pocketbase';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Check if user is authenticated and is admin
		if (!locals.isAuthenticated || !locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// For now, any authenticated user can manage products
		// In production, you might want to check for admin role
		
		const { productIds, status, action } = await request.json();
		
		// Validate status
		if (!['active', 'draft', 'inactive'].includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}
		
		// Validate productIds
		if (!Array.isArray(productIds) || productIds.length === 0) {
			return json({ error: 'No products selected' }, { status: 400 });
		}

		// Create a fresh PocketBase client with admin auth
		const pb = createPocketBaseClient();
		
		// Authenticate as admin for this operation
		try {
			await pb.collection('_superusers').authWithPassword(
				env.PB_ADMIN_EMAIL as string,
				env.PB_ADMIN_PASSWORD as string
			);
		} catch (authError) {
			console.error('Admin auth failed:', authError);
			return json({ error: 'Authentication failed' }, { status: 500 });
		}
		
		// Update each product
		const results = [];
		const errors = [];
		
		for (const productId of productIds) {
			try {
				// Update product status using PocketBase client
				const updatedProduct = await pb.collection('products').update(productId, {
					status: status,
					updated: new Date().toISOString()
				});
				
				results.push({
					id: productId,
					status: updatedProduct.status,
					name: updatedProduct.name
				});
			} catch (error) {
				console.error(`Error updating product ${productId}:`, error);
				errors.push({
					id: productId,
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}
		
		return json({
			success: true,
			updated: results.length,
			errorsCount: errors.length,
			results,
			errors
		});
	} catch (error) {
		console.error('Error updating product statuses:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to update product statuses' 
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		// Check if user is authenticated
		if (!locals.isAuthenticated || !locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const productId = url.searchParams.get('id');
		
		if (!productId) {
			return json({ error: 'Product ID required' }, { status: 400 });
		}

		// Create a fresh PocketBase client with admin auth
		const pb = createPocketBaseClient();
		
		// Authenticate as admin for this operation
		try {
			await pb.collection('_superusers').authWithPassword(
				env.PB_ADMIN_EMAIL as string,
				env.PB_ADMIN_PASSWORD as string
			);
		} catch (authError) {
			console.error('Admin auth failed:', authError);
			return json({ error: 'Authentication failed' }, { status: 500 });
		}
		
		// Get product details
		const product = await pb.collection('products').getOne(productId);
		
		return json({
			id: product.id,
			name: product.name,
			sku: product.sku,
			status: product.status,
			price: product.price
		});
	} catch (error) {
		console.error('Error fetching product:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to fetch product' 
		}, { status: 500 });
	}
}; 