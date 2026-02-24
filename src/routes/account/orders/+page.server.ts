import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define Order interface
interface Order {
    id: string;
    orderNumber?: string;
    created: string;
    status?: string;
    total: number;
}

export const load = (async ({ locals, url }) => {
    // Get PocketBase instance and authenticated user
    const pb = locals.pb;
    const user = locals.user;
    
    // If no user is authenticated, return error
    if (!user) {
        throw error(401, 'Unauthorized');
    }
    
    try {
        // Get query parameters for pagination
        const page = Number(url.searchParams.get('page') || '1');
        const perPage = Number(url.searchParams.get('perPage') || '10');
        
        // Check if PocketBase is initialized
        if (!pb || typeof pb.collection !== 'function') {
            console.error('PocketBase instance is not properly initialized');
            return {
                orders: [],
                totalOrders: 0,
                totalPages: 1,
                page: 1,
                error: 'Database connection issue'
            };
        }
        
        // Log user data for debugging
        console.log(`Orders page: User ID=${user.id}, Username=${user.username || user.email}`);
        
        // Since we know the orders collection exists, let's try to access it directly
        try {
            // Try different possible field names for user reference
            const possibleUserFields = ['user', 'userId', 'user_id'];
            let ordersResult = null;
            let userFieldName = 'user'; // default
            
            // Try each possible user field name
            for (const fieldName of possibleUserFields) {
                try {
                    console.log(`Trying to fetch orders with field: ${fieldName}`);
                    
                    // Start with a simpler query - no sorting first
                    ordersResult = await pb.collection('orders').getList(page, perPage, {
                        filter: `${fieldName} = "${user.id}"`
                    });
                    
                    userFieldName = fieldName;
                    console.log(`Successfully fetched orders using field: ${fieldName}`);
                    break;
                } catch (e: any) {
                    console.log(`Field ${fieldName} failed:`, e.message);
                    continue;
                }
            }
            
            // If we got results, try to apply sorting in a separate query
            if (ordersResult) {
                try {
                    // Try with sorting
                    const sortedResult = await pb.collection('orders').getList(page, perPage, {
                        filter: `${userFieldName} = "${user.id}"`,
                        sort: '-created'
                    });
                    ordersResult = sortedResult;
                    console.log('Applied sorting successfully');
                } catch (e: any) {
                    console.log('Sorting failed, using unsorted results:', e.message);
                    // Keep the unsorted results
                }
            }
            
            // If no field worked, the orders collection might not be set up correctly
            if (!ordersResult) {
                console.log('No valid user field found for orders collection');
                return {
                    orders: [],
                    totalOrders: 0,
                    totalPages: 1,
                    page,
                    error: 'Orders collection is not properly configured. Please contact support.'
                };
            }
            
            // Transform the data to ensure it matches expected format
            const orders: Order[] = ordersResult.items.map((item: any) => ({
                id: item.id || '',
                orderNumber: item.orderNumber || item.id || '',
                created: item.created || new Date().toISOString(),
                status: item.status || 'processing',
                total: typeof item.total === 'number' ? item.total : 0
            }));
            
            console.log(`Successfully loaded ${orders.length} orders for user`);
            
            return {
                orders,
                totalOrders: ordersResult.totalItems,
                totalPages: ordersResult.totalPages,
                page
            };
            
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            
            // Provide more specific error messages based on the error type
            let errorMessage = 'Failed to load orders';
            if (err.status === 400) {
                errorMessage = 'Orders collection is not accessible. This feature may not be set up yet.';
            } else if (err.status === 403) {
                errorMessage = 'You do not have permission to view orders.';
            } else if (err.status === 404) {
                errorMessage = 'Orders collection not found. This feature is not available.';
            }
            
            return {
                orders: [],
                totalOrders: 0,
                totalPages: 1,
                page,
                error: errorMessage
            };
        }
        
    } catch (err) {
        console.error('Error in orders load function:', err);
        return {
            orders: [],
            totalOrders: 0,
            totalPages: 1,
            page: 1,
            error: 'Failed to load orders'
        };
    }
}) satisfies PageServerLoad; 