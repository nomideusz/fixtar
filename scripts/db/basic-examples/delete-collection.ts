import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection deleter...');

// Load environment variables from .env file
dotenv.config();
console.log('Environment loaded, PB URL:', process.env.POCKETBASE_URL);

/**
 * Creates a PocketBase client with admin credentials
 */
function createClient() {
  // Load PocketBase URL from env vars or use default
  const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
  return pb;
}

/**
 * Authenticates as admin
 */
async function authenticate(pb: PocketBase) {
  if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
    console.warn('Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD env vars');
    console.log('Environment variables loaded:');
    Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')).forEach(key => {
      console.log(`  ${key}: ${process.env[key] ? '✓' : '✗'}`);
    });
    return false;
  }
  
  try {
    console.log(`Authenticating as ${process.env.PB_ADMIN_EMAIL}...`);
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL, 
      process.env.PB_ADMIN_PASSWORD
    );
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
}

/**
 * Delete a collection by ID or name
 * @param pb PocketBase client instance
 * @param idOrName Collection ID or name
 * @returns Boolean indicating success
 */
export async function deleteCollection(
  pb: PocketBase,
  idOrName: string
): Promise<boolean> {
  try {
    console.log(`Deleting collection "${idOrName}"...`);
    await pb.collections.delete(idOrName);
    console.log(`Collection "${idOrName}" deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting collection "${idOrName}":`, error);
    return false;
  }
}

/**
 * Example: Delete a collection
 */
async function deleteExampleCollection() {
  try {
    console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
    
    // Create and authenticate client
    const pb = createClient();
    const authenticated = await authenticate(pb);
    
    if (!authenticated) {
      console.error('Failed to authenticate. Check your credentials in .env file.');
      return false;
    }
    
    // Get collection name from command line argument
    const collectionName = process.argv[2];
    
    if (!collectionName) {
      console.error('Please provide a collection name as an argument');
      console.log('Usage: npm run delete-collection -- <collectionName>');
      return false;
    }
    
    // Confirm with the user - safety check for accidental execution
    console.log(`WARNING: You are about to delete collection "${collectionName}"`);
    console.log('This action is irreversible and will delete all collection data.');
    console.log('To proceed, pass the --confirm flag');
    
    const confirmed = process.argv.includes('--confirm');
    if (!confirmed) {
      console.log('Operation aborted. Add --confirm flag to proceed with deletion.');
      return false;
    }
    
    // Delete the collection
    const success = await deleteCollection(pb, collectionName);
    return success;
  } catch (error) {
    console.error('Error during collection deletion:', error);
    return false;
  }
}

// Run the collection deleter
console.log('Running deleteExampleCollection...');
deleteExampleCollection()
  .then(success => {
    console.log(success ? '\nCollection deleted successfully' : '\nFailed to delete collection');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Error in deleteExampleCollection:', err);
    process.exit(1);
  });

/**
 * API Reference
 * 
 * DELETE /api/collections/{collectionIdOrName}
 * 
 * Path parameters:
 * - collectionIdOrName: ID or name of the collection to delete
 * 
 * Requires admin authentication
 * This operation cannot be undone
 */
