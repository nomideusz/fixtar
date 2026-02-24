import { error, redirect } from '@sveltejs/kit';

// Define Address interface for type safety
interface Address {
    id: string;
    user: string;
    type: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    default: boolean;
    created?: string;
    updated?: string;
}

export const load = async ({ params, locals }: any) => {
    // Redirect to login if not authenticated
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }
    
    const pb = locals.pb;
    const user = locals.user;
    const addressId = params.id;
    
    try {
        // Try to get the address
        const address = await pb.collection('addresses').getOne(addressId);
        
        // Verify address belongs to user
        if (address.user !== user.id) {
            throw error(403, 'Not authorized to view this address');
        }
        
        return {
            user,
            address: {
                id: address.id,
                user: address.user,
                type: address.type || 'Home',
                street: address.street || '',
                city: address.city || '',
                postalCode: address.postalCode || '',
                country: address.country || '',
                default: address.default || false,
                created: address.created,
                updated: address.updated
            } as Address
        };
    } catch (err: any) {
        console.error('Error loading address:', err);
        
        if (err.status === 404) {
            throw error(404, 'Address not found');
        }
        
        throw error(500, 'Failed to load address');
    }
};

export const actions = {
    updateAddress: async ({ request, locals, params }: any) => {
        // Redirect to login if not authenticated
        if (!locals.user) {
            throw redirect(302, '/auth/login');
        }
        
        const pb = locals.pb;
        const user = locals.user;
        const addressId = params.id;
        
        try {
            const formData = await request.formData();
            const type = formData.get('type')?.toString();
            const street = formData.get('street')?.toString();
            const city = formData.get('city')?.toString();
            const postalCode = formData.get('postalCode')?.toString();
            const country = formData.get('country')?.toString();
            const setDefault = formData.get('default') === 'true';
            
            // Verify address belongs to user
            const address = await pb.collection('addresses').getOne(addressId).catch(() => null);
            if (!address || address.user !== user.id) {
                return {
                    success: false,
                    message: 'Not authorized to update this address'
                };
            }
            
            // If we're setting this as default, update all existing addresses to not be default
            if (setDefault) {
                try {
                    const addresses = await pb.collection('addresses').getFullList({
                        filter: `user = "${user.id}" && default = true && id != "${addressId}"`
                    });
                    
                    for (const addr of addresses) {
                        await pb.collection('addresses').update(addr.id, {
                            default: false
                        });
                    }
                } catch (err) {
                    console.error("Error updating existing default addresses:", err);
                }
            }
            
            // Update fields
            const updateData: Record<string, any> = {};
            if (type) updateData.type = type;
            if (street) updateData.street = street;
            if (city) updateData.city = city;
            if (postalCode) updateData.postalCode = postalCode;
            if (country) updateData.country = country;
            updateData.default = setDefault;
            
            const updatedAddress = await pb.collection('addresses').update(addressId, updateData);
            
            return { success: true, address: updatedAddress };
        } catch (err) {
            console.error('Error updating address:', err);
            return {
                success: false,
                message: 'Failed to update address'
            };
        }
    }
}; 