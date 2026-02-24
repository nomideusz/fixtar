// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    // Redirect to login if not authenticated
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }
    
    return {
        user: locals.user
    };
};

export const actions = {
    addAddress: async ({ request, locals }: import('./$types').RequestEvent) => {
        // Redirect to login if not authenticated
        if (!locals.user) {
            throw redirect(302, '/auth/login');
        }
        
        // Get PocketBase instance and authenticated user
        const pb = locals.pb;
        const user = locals.user;
        
        // Authenticate the PocketBase client with the user's session
        if (locals.token) {
            try {
                pb.authStore.save(locals.token, user);
                console.log('PocketBase client authenticated with user token');
            } catch (authError) {
                console.error('Failed to authenticate PocketBase client:', authError);
            }
        } else {
            console.warn('No token available in locals');
        }
        
        try {
            const formData = await request.formData();
            const type = formData.get('type')?.toString() || 'Home';
            const street = formData.get('street')?.toString();
            const city = formData.get('city')?.toString();
            const postalCode = formData.get('postalCode')?.toString();
            const country = formData.get('country')?.toString();
            const setDefault = formData.get('default') === 'true';
            
            if (!street || !city || !postalCode || !country) {
                return {
                    success: false,
                    message: 'All address fields are required'
                };
            }
            
            // Make sure PocketBase client is properly authenticated
            console.log('Current PB auth state:', pb.authStore.isValid, pb.authStore.token ? 'token present' : 'no token');
            console.log('User from locals:', user.id, user.email);
            
            // Try to authenticate with the current user's session
            if (!pb.authStore.isValid) {
                console.log('PB client not authenticated, trying to set auth...');
                try {
                    // Get the auth token from the request cookies
                    const authCookie = request.headers.get('cookie')?.split(';')
                        .find(c => c.trim().startsWith('pb_auth='))
                        ?.split('=')[1];
                    
                    if (authCookie) {
                        console.log('Found auth cookie, setting token...');
                        pb.authStore.save(decodeURIComponent(authCookie), null);
                    } else {
                        console.log('No auth cookie found');
                    }
                } catch (authError) {
                    console.error('Failed to set auth token:', authError);
                }
            }
            
            console.log('Final PB auth state:', pb.authStore.isValid, pb.authStore.token ? 'token present' : 'no token');
            
            // Check if addresses collection exists and fix create rule if needed
            try {
                // Try to access the collection first
                await pb.collection('addresses').getList(1, 1);
                console.log('Addresses collection exists');
                
                // Check if the create rule needs to be fixed
                try {
                    const collection = await pb.collections.getOne('pbc_199332750');
                    console.log('Current create rule:', collection.createRule);
                    
                    if (collection.createRule === '@request.auth.id = user.id') {
                        console.log('Fixing addresses collection create rule...');
                        await pb.collections.update('pbc_199332750', {
                            createRule: '@request.auth.id = @request.data.user'
                        });
                        console.log('Addresses collection create rule fixed');
                    } else if (collection.createRule !== '@request.auth.id = @request.data.user') {
                        console.log('Create rule needs manual fix. Current:', collection.createRule);
                        console.log('Should be: @request.auth.id = @request.data.user');
                    }
                } catch (ruleErr: any) {
                    console.error('Error checking/fixing create rule:', ruleErr);
                    console.log('You may need to manually update the addresses collection create rule to: @request.auth.id = @request.data.user');
                }
            } catch (collectionErr: any) {
                if (collectionErr.status === 404) {
                    console.log('Addresses collection not found, creating...');
                    try {
                        await pb.collections.create({
                            name: 'addresses',
                            type: 'base',
                            createRule: '@request.auth.id != "" && @request.auth.id = @request.data.user',
                            updateRule: '@request.auth.id != "" && @request.auth.id = user',
                            deleteRule: '@request.auth.id != "" && @request.auth.id = user',
                            listRule: '@request.auth.id != "" && @request.auth.id = user',
                            viewRule: '@request.auth.id != "" && @request.auth.id = user',
                            schema: [
                                {
                                    name: 'user',
                                    type: 'relation',
                                    required: true,
                                    options: {
                                        collectionId: '_pb_users_auth_',
                                        cascadeDelete: true,
                                        minSelect: null,
                                        maxSelect: 1,
                                        displayFields: []
                                    }
                                },
                                {
                                    name: 'type',
                                    type: 'text',
                                    required: true,
                                    options: {
                                        min: null,
                                        max: null,
                                        pattern: ''
                                    }
                                },
                                {
                                    name: 'street',
                                    type: 'text',
                                    required: true,
                                    options: {
                                        min: null,
                                        max: null,
                                        pattern: ''
                                    }
                                },
                                {
                                    name: 'city',
                                    type: 'text',
                                    required: true,
                                    options: {
                                        min: null,
                                        max: null,
                                        pattern: ''
                                    }
                                },
                                {
                                    name: 'postalCode',
                                    type: 'text',
                                    required: true,
                                    options: {
                                        min: null,
                                        max: null,
                                        pattern: ''
                                    }
                                },
                                {
                                    name: 'country',
                                    type: 'text',
                                    required: true,
                                    options: {
                                        min: null,
                                        max: null,
                                        pattern: ''
                                    }
                                },
                                {
                                    name: 'default',
                                    type: 'bool',
                                    required: false,
                                    options: {}
                                }
                            ]
                        });
                        console.log('Addresses collection created successfully');
                    } catch (createErr: any) {
                        console.error('Failed to create addresses collection:', createErr);
                        return {
                            success: false,
                            message: 'Failed to initialize addresses feature'
                        };
                    }
                } else {
                    console.error('Error checking addresses collection:', collectionErr);
                }
            }
            
            // If we're setting this as default, update all existing addresses to not be default
            if (setDefault) {
                try {
                    // Get existing addresses and update them
                    const addresses = await pb.collection('addresses').getFullList({
                        filter: `user = "${user.id}" && default = true`
                    });
                    
                    // Update each to not be default
                    for (const address of addresses) {
                        await pb.collection('addresses').update(address.id, {
                            default: false
                        });
                    }
                } catch (err) {
                    console.error("Error updating existing default addresses:", err);
                }
            }
            
            // If this is the first address, make it default regardless of input
            let isDefault = setDefault;
            try {
                const addressCount = await pb.collection('addresses').getList(1, 1, {
                    filter: `user = "${user.id}"`
                });
                
                if (addressCount.totalItems === 0) {
                    isDefault = true;
                }
            } catch (err) {
                console.error("Error checking address count:", err);
            }
            
            // Create new address with minimal required fields first
            const minimalData = {
                user: user.id,
                type: type || 'Home',
                street: street || '',
                city: city || '',
                postalCode: postalCode || ''
            };
            
            console.log('Trying minimal address data first:', minimalData);
            
            try {
                const newAddress = await pb.collection('addresses').create(minimalData);
                console.log('Minimal address created successfully:', newAddress);
                
                // Now try to update with all fields
                if (country || isDefault !== undefined) {
                    const updateData: any = {};
                    if (country) updateData.country = country;
                    if (isDefault !== undefined) updateData.default = isDefault;
                    
                    console.log('Updating with additional fields:', updateData);
                    const updatedAddress = await pb.collection('addresses').update(newAddress.id, updateData);
                    console.log('Address updated successfully:', updatedAddress);
                    return { success: true, address: updatedAddress };
                }
                
                return { success: true, address: newAddress };
            } catch (createError: any) {
                console.error('Minimal create failed:', createError);
                console.error('Error response:', createError.response);
                console.error('Error data:', createError.data);
                
                // Try without user field to test if that's the issue
                const testData = {
                    type: type || 'Home',
                    street: street || '',
                    city: city || '',
                    postalCode: postalCode || ''
                };
                
                console.log('Trying without user field:', testData);
                try {
                    const testAddress = await pb.collection('addresses').create(testData);
                    console.log('Created without user field - this should not happen!', testAddress);
                } catch (testError: any) {
                    console.error('Test create also failed:', testError.data);
                }
                
                throw createError;
            }
        } catch (err: any) {
            console.error('Error adding address:', err);
            console.error('Error details:', err.response || err.data || err);
            return {
                success: false,
                message: err.response?.message || err.message || 'Failed to add address'
            };
        }
    }
}; ;null as any as Actions;