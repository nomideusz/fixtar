import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define Product interface
interface Product {
    id: string;
    name: string;
    price: number;
    mainImage: string;
    slug?: string;
    compareAtPrice?: number;
    featured?: boolean;
}

export const load = (async ({ locals }) => {
    // Get PocketBase instance and authenticated user
    const pb = locals.pb;
    const user = locals.user;
    
    // If no user is authenticated, return error
    if (!user) {
        throw error(401, 'Unauthorized');
    }
    
    try {
        // Extract wishlist item IDs from user record
        const wishlistItems: string[] = user.wishlist || [];
        let favorites: Product[] = [];
        
        if (wishlistItems.length > 0) {
            // Fetch detailed product information for wishlist items
            favorites = await pb.collection('products').getFullList({
                filter: wishlistItems.map((id: string) => `id = "${id}"`).join(' || '),
                sort: 'name'
            }) as unknown as Product[];
        }
        
        return {
            favorites,
            user
        };
    } catch (err) {
        console.error('Error fetching favorites:', err);
        throw error(500, 'Failed to load favorites');
    }
}) satisfies PageServerLoad;

// Add actions for adding/removing favorites
export const actions = {
    removeFavorite: async ({ request, locals }) => {
        const data = await request.formData();
        const productId = data.get('productId')?.toString();
        
        if (!productId) {
            return { success: false, error: 'Product ID is required' };
        }
        
        const pb = locals.pb;
        const user = locals.user;
        
        if (!user) {
            return { success: false, error: 'Authentication required' };
        }
        
        try {
            // Get current wishlist
            let wishlist: string[] = user.wishlist || [];
            
            // Remove the product from wishlist
            wishlist = wishlist.filter(id => id !== productId);
            
            // Update user record
            await pb.collection('users').update(user.id, {
                wishlist
            });
            
            return { success: true };
        } catch (err) {
            console.error('Error removing favorite:', err);
            return { success: false, error: 'Failed to remove item from favorites' };
        }
    }
}; 