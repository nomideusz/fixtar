import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase reviews collection creator...');

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
 * Create the reviews collection
 */
async function createReviewsCollection() {
    try {
      console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
      
      // Create and authenticate client
      const pb = createClient();
      const authenticated = await authenticate(pb);
      
      if (!authenticated) {
        console.error('Failed to authenticate. Check your credentials in .env file.');
        return false;
      }

      // Check if reviews collection already exists
      const exists = await collectionExists(pb, 'reviews');
      if (exists) {
        console.log('Collection "reviews" already exists. Skipping creation.');
        return true;
      }

      // Check for products collection to use for relations
      const productsExists = await collectionExists(pb, 'products');
      if (!productsExists) {
        console.error('Products collection does not exist. Please create it first.');
        return false;
      }
      
      // Get products collection ID
      const productsCollection = await pb.collections.getOne('products');
      const productsId = productsCollection.id;

      console.log('Creating reviews collection...');
      const result = await pb.collections.create({
        name: 'reviews',
        type: 'base',
        listRule: '',  // Public access for reading reviews
        viewRule: '',  // Public access for viewing reviews
        createRule: '@request.auth.id != ""',  // Only authenticated users can create reviews
        updateRule: '@request.auth.id = user.id || @request.auth.isAdmin = true',  // Author or admin can update
        deleteRule: '@request.auth.id = user.id || @request.auth.isAdmin = true',  // Author or admin can delete
        fields: [
          {
            name: 'product',
            type: 'relation',
            required: true,
            collectionId: productsId,
            cascadeDelete: true, // If product is deleted, reviews are deleted too
            maxSelect: 1,
            displayFields: ['name']
          },
          {
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: ['id', 'username', 'email']
          },
          {
            name: 'rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5
          },
          {
            name: 'title',
            type: 'text',
            required: false,
            max: 100
          },
          {
            name: 'content',
            type: 'text',
            required: true,
            min: 5,
            max: 2000
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['pending', 'approved', 'rejected', 'spam']
          },
          {
            name: 'isPurchaseVerified',
            type: 'bool',
            required: false
          },
          {
            name: 'photos',
            type: 'file',
            required: false,
            maxSelect: 5,
            maxSize: 5242880,
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/webp'
            ]
          },
          {
            name: 'helpfulCount',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'reportCount',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'metadata',
            type: 'json',
            required: false
          }
        ]
      });

      console.log('Reviews collection created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating reviews collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createReviewsCollection();
    if (success) {
      console.log('✅ Reviews collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up reviews collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 