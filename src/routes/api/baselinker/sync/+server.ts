import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBaseLinkerService } from '$lib/services/baselinker';

/**
 * POST /api/baselinker/sync
 * Trigger product sync from BaseLinker
 * Requires admin authentication
 * TODO: Wire up destination persistence (Turso DB) once BaseLinker service is updated
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// TODO: Check admin role once Better Auth roles are configured
	// if (locals.user.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	try {
		const body = await request.json().catch(() => ({}));
		const { inventoryId, dryRun = false } = body;

		if (!inventoryId) {
			return json({ error: 'inventoryId is required' }, { status: 400 });
		}

		const service = getBaseLinkerService();
		// TODO: Update BaseLinkerService.syncProducts signature to accept DB client instead of pb
		const result = await service.syncProducts(null as any, inventoryId, { dryRun });

		return json(result);
	} catch (err: any) {
		console.error('[BaseLinker Sync API] Error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

/**
 * GET /api/baselinker/sync
 * Get available inventories for sync configuration
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const service = getBaseLinkerService();
		const inventories = await service.getInventories();

		return json({ inventories });
	} catch (err: any) {
		console.error('[BaseLinker API] Error fetching inventories:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
