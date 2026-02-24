import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection scaffolds fetcher...');

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
 * Get collection scaffolds (template collection types with default fields)
 * @param pb PocketBase client instance
 * @returns Collection scaffolds or null on failure
 */
export async function getCollectionScaffolds(pb: PocketBase) {
  try {
    console.log('Fetching collection scaffolds...');
    const scaffolds = await pb.collections.getScaffolds();
    return scaffolds;
  } catch (error) {
    console.error('Error fetching collection scaffolds:', error);
    return null;
  }
}

/**
 * Print scaffolds information
 */
async function printScaffolds() {
  try {
    console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
    
    // Create and authenticate client
    const pb = createClient();
    const authenticated = await authenticate(pb);
    
    if (!authenticated) {
      console.error('Failed to authenticate. Check your credentials in .env file.');
      return null;
    }
    
    // Get and display the scaffolds
    const scaffolds = await getCollectionScaffolds(pb);
    
    if (!scaffolds) {
      console.error('Failed to fetch collection scaffolds');
      return null;
    }
    
    console.log('\nCollection scaffolds:');
    console.log('====================');
    
    // Print available scaffold types
    for (const type in scaffolds) {
      console.log(`\nType: ${type}`);
      
      // Print fields for each type
      console.log('Default fields:');
      const fields = scaffolds[type].fields || [];
      
      if (fields.length === 0) {
        console.log('  No default fields');
      } else {
        fields.forEach((field: any) => {
          console.log(`  - ${field.name} (${field.type})${field.required ? ' (required)' : ''}`);
        });
      }
    }
    
    return scaffolds;
  } catch (error) {
    console.error('Error displaying scaffolds:', error);
    return null;
  }
}

// Run the scaffolds fetcher
console.log('Running printScaffolds...');
printScaffolds()
  .then(scaffolds => {
    if (scaffolds) {
      console.log('\nScaffolds retrieved successfully');
    } else {
      console.log('\nFailed to retrieve scaffolds');
    }
    process.exit(scaffolds ? 0 : 1);
  })
  .catch(err => {
    console.error('Error in printScaffolds:', err);
    process.exit(1);
  });

/**
 * API Reference
 * 
 * GET /api/collections/meta/scaffolds
 * 
 * Returns an object with all collection types and their default fields.
 * This is primarily used in the PocketBase Dashboard UI.
 * 
 * Requires admin authentication
 * 
 * Response contains template information for:
 * - base (regular collection)
 * - auth (authentication collection)
 * - view (view/query collection)
 */