import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection viewer...');

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
 * Gets a single collection by ID or name
 * @param pb PocketBase client instance
 * @param idOrName Collection ID or name
 * @param fields Optional fields to include in the response
 * @returns The requested collection or null if not found
 */
export async function getCollection(
  pb: PocketBase,
  idOrName: string,
  fields?: string
) {
  try {
    const options: Record<string, any> = {};
    if (fields) options.fields = fields;
    
    return await pb.collections.getOne(idOrName, options);
  } catch (error) {
    console.error(`Error getting collection "${idOrName}":`, error);
    return null;
  }
}

/**
 * View a collection and its fields
 */
async function viewCollection(collectionIdOrName?: string) {
  try {
    console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
    
    // Create and authenticate client
    const pb = createClient();
    const authenticated = await authenticate(pb);
    
    if (!authenticated) {
      console.error('Failed to authenticate. Check your credentials in .env file.');
      return null;
    }
    
    // Use argument or prompt for collection name
    const collectionName = collectionIdOrName || process.argv[2];
    if (!collectionName) {
      console.error('Please provide a collection ID or name as an argument');
      console.log('Usage: npm run view-collection <collectionIdOrName>');
      return null;
    }
    
    console.log(`Fetching collection "${collectionName}"...`);
    
    // Get the collection details
    const collection = await getCollection(pb, collectionName);
    
    if (!collection) {
      console.error(`Collection "${collectionName}" not found`);
      return null;
    }
    
    console.log('\nCollection Details:');
    console.log(`- ID: ${collection.id}`);
    console.log(`- Name: ${collection.name}`);
    console.log(`- Type: ${collection.type}`);
    console.log(`- System: ${collection.system ? 'Yes' : 'No'}`);
    
    console.log('\nFields:');
    collection.fields.forEach((field: any) => {
      console.log(`- ${field.name} (${field.type})${field.required ? ' (required)' : ''}${field.system ? ' (system)' : ''}`);
    });
    
    return collection;
  } catch (error) {
    console.error('Error viewing collection:', error);
    throw error;
  }
}

// Run the collection viewer
console.log('Running viewCollection...');
viewCollection()
  .then(collection => {
    if (collection) {
      console.log('\nSuccessfully retrieved collection');
    } else {
      console.log('\nFailed to retrieve collection');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error in viewCollection:', err);
    process.exit(1);
  });

/**
 * API Reference
 * 
 * GET /api/collections/collectionIdOrName
 * 
 * Path parameters:
 * - collectionIdOrName: ID or name of the collection to view
 * 
 * Query parameters:
 * - fields: Comma separated string of fields to return
 *   Example: ?fields=*,expand.relField.name
 *   Field modifiers:
 *   - :excerpt(maxLength, withEllipsis?): Returns a short plain text version
 *     Example: ?fields=*,description:excerpt(200,true)
 * 
 * Response example:
 * {
 *   "id": "_pbc_2287844090",
 *   "name": "posts",
 *   "type": "base",
 *   "system": false,
 *   "listRule": null,
 *   "viewRule": null,
 *   "createRule": null,
 *   "updateRule": null,
 *   "deleteRule": null,
 *   "fields": [
 *     {
 *       "id": "text3208210256",
 *       "name": "id",
 *       "type": "text",
 *       "system": true,
 *       "required": true,
 *       "unique": false,
 *       "options": {}
 *     },
 *     ...
 *   ],
 *   "indexes": []
 * }
 */