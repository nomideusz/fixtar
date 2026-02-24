import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

// Create a PocketBase instance
export const pb = browser 
	? new PocketBase(env.PUBLIC_POCKETBASE_URL || "https://k.xeon.pl")
	: null;

// Create a store for the current user
export const currentUser = writable(browser ? pb?.authStore?.record : null);

// Listen for changes to auth state
if (browser && pb) {
  pb.authStore.onChange((auth: any) => {
    console.log('Auth changed:', auth);
    currentUser.set(pb.authStore.record);
  });
}

/**
 * Initialize sync-related collections in PocketBase
 * Call this function from an admin-only route to ensure collections exist
 */
export async function initSyncCollections() {
  if (!browser || !pb) return false; // Server-side guard
  
  try {
    // Check if sync_sessions collection exists
    let syncSessionExists = false;
    try {
      await pb.collections.getOne('sync_sessions');
      syncSessionExists = true;
    } catch (err) {
      // Collection doesn't exist
    }

    // Create sync_sessions collection if it doesn't exist
    if (!syncSessionExists) {
      await pb.collections.create({
        name: 'sync_sessions',
        type: 'base',
        schema: [
          {
            name: 'type',
            type: 'text',
            required: true,
            options: {
              min: 2,
              max: 50
            }
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            options: {
              maxSelect: 1,
              values: ['pending', 'in_progress', 'completed', 'failed']
            }
          },
          {
            name: 'details',
            type: 'json',
          },
          {
            name: 'logs',
            type: 'json',
          },
          {
            name: 'summary',
            type: 'json',
          },
          {
            name: 'completed',
            type: 'date',
          }
        ],
        listRule: "@request.auth.isAdmin = true",
        viewRule: "@request.auth.isAdmin = true",
        createRule: "@request.auth.isAdmin = true",
        updateRule: "@request.auth.isAdmin = true",
        deleteRule: "@request.auth.isAdmin = true",
      });
      
      console.log('Created sync_sessions collection');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize sync collections:', error);
    return false;
  }
} 