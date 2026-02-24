import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection creator...');

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
 * Check if a collection exists
 * @param pb PocketBase client
 * @param name Collection name
 * @returns Boolean indicating if the collection exists
 */
async function collectionExists(pb: PocketBase, name: string): Promise<boolean> {
  try {
    await pb.collections.getOne(name);
    return true;
  } catch (error) {
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
async function createCartsCollection() {
    try {
      console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
      
      // Create and authenticate client
      const pb = createClient();
      const authenticated = await authenticate(pb);
      
      if (!authenticated) {
        console.error('Failed to authenticate. Check your credentials in .env file.');
        return false;
      }

      // Check if collection already exists
      const exists = await collectionExists(pb, 'carts');
      if (exists) {
        console.log('Collection "carts" already exists. Skipping creation.');
        return true;
      }

      const result = await pb.collections.create({
        name: 'carts',
        type: 'base',
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id = user.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id = user.id',
        deleteRule: '@request.auth.id = user.id',
        fields: [
            {
                name: 'user',
                type: 'relation',
                required: true,
                collectionId: '_pb_users_auth_',
                cascadeDelete: true,
                maxSelect: 1,
                displayFields: ['id', 'username', 'email']
            },
            {
                name: 'status',
                type: 'select',
                required: true,
                maxSelect: 1,
                values: ["active", "abandoned", "completed"]
            },
            {
                name: 'items',
                type: 'json',
                required: false
            },
            {
                name: 'shippingAddress',
                type: 'json',
                required: false
            },
            {
                name: 'billingAddress',
                type: 'json',
                required: false
            },
            {
                name: 'paymentMethod',
                type: 'text',
                required: false
            },
            {
                name: 'subtotal',
                type: 'number',
                required: false,
                min: 0
            },
            {
                name: 'tax',
                type: 'number',
                required: false,
                min: 0
            },
            {
                name: 'shippingCost',
                type: 'number',
                required: false,
                min: 0
            },
            {
                name: 'discount',
                type: 'number',
                required: false,
                min: 0
            },
            {
                name: 'total',
                type: 'number',
                required: false,
                min: 0
            },
            {
                name: 'notes',
                type: 'text',
                required: false
            },
            {
                name: 'lastActivity',
                type: 'date',
                required: false
            }
        ]
      });

      console.log('Collection created successfully:', result);
      return true;
    } catch (error) {
      console.error('Error creating collection:', error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createCartsCollection();
    if (success) {
      console.log('✅ Cart collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up cart collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 