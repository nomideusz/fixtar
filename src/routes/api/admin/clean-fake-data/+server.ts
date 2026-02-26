import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { pb } from '$lib/server/pocketbase';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check admin access
  if (!dev) {
    const isAdmin = locals.user?.isAdmin || 
                   request.headers.get('Authorization')?.startsWith('Bearer ');
    
    if (!isAdmin) {
      return json({ 
        success: false, 
        message: 'Unauthorized. Admin access required.'
      }, { status: 403 });
    }
  } else {
    console.log('[DEV MODE] Bypassing admin authentication for development');
  }

  try {
    const requestData = await request.json();
    const confirmClean = requestData.confirm === true;
    
    if (!confirmClean) {
      return json({
        success: false,
        message: 'You must confirm the cleanup by sending { "confirm": true }'
      }, { status: 400 });
    }

    console.log('[CLEAN] Starting fake data cleanup...');

    // Clean fake categories (externalId 1-10 are test data)
    const allCategories = await pb.collection('categories').getList(1, 200, {
      filter: 'metadata.source = "import_sync"'
    });

    console.log(`[CLEAN] Found ${allCategories.items.length} synced categories to review`);

    const fakeCategories = allCategories.items.filter(category => {
      const importId = parseInt(category.metadata?.externalId || '0', 10);
      return importId > 0 && importId <= 10; // Fake categories have IDs 1-10
    });

    console.log(`[CLEAN] Found ${fakeCategories.length} fake categories to remove`);

    for (const category of fakeCategories) {
      const importId = category.metadata?.externalId || 'unknown';
      console.log(`[CLEAN] Removing fake category: ${category.name} (importId: ${importId})`);
      await pb.collection('categories').delete(category.id);
    }

    // Clean products that reference fake categories or have fake SKUs
    const fakeProducts = await pb.collection('products').getList(1, 200, {
      filter: 'metadata.source = "import_sync"'
    });

    console.log(`[CLEAN] Found ${fakeProducts.items.length} synced products to review`);

    let removedProducts = 0;
    for (const product of fakeProducts.items) {
      // Check if product has fake category references
      const categories = Array.isArray(product.categories) ? product.categories : [];
      const hasFakeCategories = categories.some((catId: string) => {
        return fakeCategories.some(fakeCat => fakeCat.id === catId);
      });

      // Check if product has fake SKU (known test SKUs)
      const testSkus = ['51744', '50887', '50456', '57234', '52118'];
      const hasFakeSku = testSkus.includes(product.sku);

      if (hasFakeCategories || hasFakeSku) {
        console.log(`[CLEAN] Removing fake product: ${product.name} (SKU: ${product.sku})`);
        await pb.collection('products').delete(product.id);
        removedProducts++;
      }
    }

    console.log('[CLEAN] Fake data cleanup completed');

    return json({
      success: true,
      message: 'Fake data cleanup completed successfully',
      removed: {
        categories: fakeCategories.length,
        products: removedProducts
      }
    });

  } catch (error) {
    console.error('[CLEAN] Error during fake data cleanup:', error);
    return json({
      success: false,
      message: 'Failed to clean fake data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 