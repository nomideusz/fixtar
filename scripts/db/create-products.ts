import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase products collection creator...');

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
 * Create the products collection
 */
async function createProductsCollection() {
    try {
      console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
      
      // Create and authenticate client
      const pb = createClient();
      const authenticated = await authenticate(pb);
      
      if (!authenticated) {
        console.error('Failed to authenticate. Check your credentials in .env file.');
        return false;
      }

      // Ensure categories collection exists
      const categoriesExists = await collectionExists(pb, 'categories');
      if (!categoriesExists) {
        console.error('Categories collection does not exist. Please create it first.');
        return false;
      }

      // Get categories collection ID
      const categoriesCollection = await pb.collections.getOne('categories');
      
      // Check if products collection already exists
      const exists = await collectionExists(pb, 'products');
      if (exists) {
        console.log('Collection "products" already exists. Skipping creation.');
        return true;
      }

      console.log('Creating products collection...');
      const result = await pb.collections.create({
        name: 'products',
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
            max: 200
          },
          {
            name: 'slug',
            type: 'text',
            required: true,
            min: 2,
            max: 200
          },
          {
            name: 'description',
            type: 'editor',
            required: false
          },
          {
            name: 'shortDescription',
            type: 'text',
            required: false,
            max: 500
          },
          {
            name: 'price',
            type: 'number',
            required: true,
            min: 0
          },
          {
            name: 'compareAtPrice',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'cost',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'sku',
            type: 'text',
            required: true,
            min: 2,
            max: 100
          },
          {
            name: 'barcode',
            type: 'text',
            required: false,
            max: 100
          },
          {
            name: 'categories',
            type: 'relation',
            required: false,
            collectionId: categoriesCollection.id,
            cascadeDelete: false,
            maxSelect: 0, // Multiple categories (0 means unlimited)
            displayFields: ['name']
          },
          {
            name: 'mainImage',
            type: 'file',
            required: false,
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/webp'
            ]
          },
          {
            name: 'gallery',
            type: 'file',
            required: false,
            maxSelect: 10,
            maxSize: 5242880,
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/webp'
            ]
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['draft', 'active', 'archived']
          },
          {
            name: 'inventory',
            type: 'json',
            required: false
          },
          {
            name: 'variants',
            type: 'json',
            required: false
          },
          {
            name: 'attributes',
            type: 'json',
            required: false
          },
          {
            name: 'weight',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'dimensions',
            type: 'json',
            required: false
          },
          {
            name: 'featured',
            type: 'bool',
            required: false
          },
          {
            name: 'shipping',
            type: 'json',
            required: false
          },
          {
            name: 'taxable',
            type: 'bool',
            required: false
          },
          {
            name: 'taxClass',
            type: 'text',
            required: false
          },
          {
            name: 'seo',
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

      console.log('Products collection created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating products collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createProductsCollection();
    if (success) {
      console.log('✅ Products collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up products collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 