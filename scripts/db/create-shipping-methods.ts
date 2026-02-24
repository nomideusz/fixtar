import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase shipping methods collection creator...');

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
 * Create the shipping methods collection
 */
async function createShippingMethodsCollection() {
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
      const exists = await collectionExists(pb, 'shipping_methods');
      if (exists) {
        console.log('Collection "shipping_methods" already exists. Skipping creation.');
        return true;
      }

      console.log('Creating shipping_methods collection...');
      const result = await pb.collections.create({
        name: 'shipping_methods',
        type: 'base',
        listRule: '',  // Public access for listing
        viewRule: '',  // Public access for viewing
        createRule: '@request.auth.isAdmin = true',  // Only admins can create
        updateRule: '@request.auth.isAdmin = true',  // Only admins can update
        deleteRule: '@request.auth.isAdmin = true',   // Only admins can delete
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
            min: 2,
            max: 100
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            max: 500
          },
          {
            name: 'cost',
            type: 'number',
            required: true,
            min: 0
          },
          {
            name: 'freeShippingThreshold',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'active',
            type: 'bool',
            required: true
          },
          {
            name: 'estimatedDeliveryDays',
            type: 'text',
            required: false,
            max: 50
          },
          {
            name: 'icon',
            type: 'file',
            required: false,
            maxSelect: 1,
            maxSize: 1048576,
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/svg+xml'
            ]
          },
          {
            name: 'displayOrder',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'taxable',
            type: 'bool',
            required: false
          },
          {
            name: 'restrictions',
            type: 'json',
            required: false
          },
          {
            name: 'metadata',
            type: 'json',
            required: false
          }
        ]
      });

      console.log('Shipping methods collection created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating shipping methods collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createShippingMethodsCollection();
    if (success) {
      console.log('✅ Shipping methods collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up shipping methods collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 