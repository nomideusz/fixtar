import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection creator...');

// Load environment variables from .env file
dotenv.config();
console.log('Environment loaded, PB URL:', process.env.POCKETBASE_URL);

/**
 * Collection types supported by PocketBase
 */
type CollectionType = 'base' | 'auth' | 'view';

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
 * Create a new base collection
 * @param pb PocketBase client instance
 * @param name Collection name
 * @param fields Collection fields configuration
 * @param options Additional collection options
 * @returns The created collection or null on failure
 */
export async function createBaseCollection(
  pb: PocketBase,
  name: string,
  fields: any[] = [],
  options: Record<string, any> = {}
) {
  try {
    console.log(`Creating base collection "${name}"...`);
    const data = {
      name,
      type: 'base',
      fields,
      ...options
    };
    
    return await pb.collections.create(data);
  } catch (error) {
    console.error(`Error creating base collection "${name}":`, error);
    return null;
  }
}

/**
 * Create a new auth collection
 * @param pb PocketBase client instance
 * @param name Collection name
 * @param fields Collection fields configuration
 * @param options Additional collection options
 * @returns The created collection or null on failure
 */
export async function createAuthCollection(
  pb: PocketBase,
  name: string,
  fields: any[] = [],
  options: Record<string, any> = {}
) {
  try {
    console.log(`Creating auth collection "${name}"...`);
    const data = {
      name,
      type: 'auth',
      fields,
      passwordAuth: {
        enabled: true,
        identityFields: ['email']
      },
      ...options
    };
    
    return await pb.collections.create(data);
  } catch (error) {
    console.error(`Error creating auth collection "${name}":`, error);
    return null;
  }
}

/**
 * Create a new view collection
 * @param pb PocketBase client instance
 * @param name Collection name
 * @param viewQuery SQL query for the view
 * @param options Additional collection options
 * @returns The created collection or null on failure
 */
export async function createViewCollection(
  pb: PocketBase,
  name: string,
  viewQuery: string,
  options: Record<string, any> = {}
) {
  try {
    console.log(`Creating view collection "${name}"...`);
    const data = {
      name,
      type: 'view',
      viewQuery,
      ...options
    };
    
    return await pb.collections.create(data);
  } catch (error) {
    console.error(`Error creating view collection "${name}":`, error);
    return null;
  }
}

/**
 * Example: Create collections
 */
async function createExampleCollections() {
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
    const collectionType = process.argv[3] as CollectionType || 'base';
    
    if (!collectionName) {
      console.error('Please provide a collection name as an argument');
      console.log('Usage: npm run create-collection -- <name> [type]');
      console.log('Types: base (default), auth, view');
      return false;
    }
    
    // Define type for result to fix 'never' type errors
    let result: any = null;
    
    // Create different collection types based on the type argument
    switch (collectionType) {
      case 'auth':
        result = await createAuthCollection(pb, collectionName, [
          {
            name: 'name',
            type: 'text'
          }
        ], {
          createRule: 'id = @request.auth.id',
          updateRule: 'id = @request.auth.id',
          deleteRule: 'id = @request.auth.id'
        });
        break;
        
      case 'view':
        result = await createViewCollection(
          pb, 
          collectionName,
          'SELECT id, created, updated FROM _superusers',
          {
            listRule: '@request.auth.id != ""'
          }
        );
        break;
        
      case 'base':
      default:
        result = await createBaseCollection(pb, collectionName, [
          {
            name: 'title',
            type: 'text',
            required: true,
            min: 3
          },
          {
            name: 'content',
            type: 'text'
          },
          {
            name: 'active',
            type: 'bool'
          }
        ]);
        break;
    }
    
    if (result) {
      console.log(`\nCollection "${collectionName}" (${collectionType}) created successfully:`);
      console.log(`- ID: ${result.id}`);
      console.log(`- Name: ${result.name}`);
      console.log(`- Type: ${result.type}`);
      
      if (result.fields) {
        console.log('\nFields:');
        result.fields.forEach((field: any) => {
          console.log(`- ${field.name} (${field.type})${field.required ? ' (required)' : ''}`);
        });
      }
      
      return true;
    } else {
      console.error(`Failed to create collection "${collectionName}"`);
      return false;
    }
  } catch (error) {
    console.error('Error creating collections:', error);
    return false;
  }
}

// Run the collection creator
console.log('Running createExampleCollections...');
createExampleCollections()
  .then(success => {
    console.log(success ? '\nCollection created successfully' : '\nFailed to create collection');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Error in createExampleCollections:', err);
    process.exit(1);
  });

/**
 * API Reference
 * 
 * POST /api/collections
 * 
 * Body Parameters:
 * {
 *   "id": "string (optional)", // 15 char string for collection ID (auto-generated if not set)
 *   "name": "string (required)", // Unique collection name
 *   "type": "base|view|auth", // Collection type (default: "base")
 *   "fields": [ // Optional for "view" collections (auto-populated from viewQuery)
 *     {
 *       "name": "string",
 *       "type": "text|number|bool|email|url|date|select|relation|file|...",
 *       "required": boolean,
 *       "unique": boolean,
 *       "options": {}
 *     }
 *   ],
 *   "indexes": ["string"], // Collection indexes (not for "view" collections)
 *   "system": boolean, // Mark as system to prevent rename/delete/rule changes
 *   
 *   // API rules
 *   "listRule": "string|null", 
 *   "viewRule": "string|null",
 *   "createRule": "string|null",
 *   "updateRule": "string|null",
 *   "deleteRule": "string|null",
 *   
 *   // View options
 *   "viewQuery": "string (required for view collections)",
 *   
 *   // Auth options - see documentation for full details
 *   "manageRule": "string|null", // Additional admin-like permissions
 *   "authRule": "string|null", // Post-authentication constraints
 *   "passwordAuth": {
 *     "enabled": boolean,
 *     "identityFields": ["string"]
 *   }
 *   // Additional auth options available...
 * }
 */