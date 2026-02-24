import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase categories collection creator...');

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
 * Create the categories collection
 */
async function createCategoriesCollection() {
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
      const exists = await collectionExists(pb, 'categories');
      if (exists) {
        console.log('Collection "categories" already exists. Skipping creation.');
        return true;
      }

      // First create the collection with minimal schema
      console.log('Creating categories collection...');
      const initialCollection = await pb.collections.create({
        name: 'categories',
        type: 'base'
      });

      // After creation, update with full schema including self-relation
      console.log('Collection created. Updating with complete schema...');
      await pb.collections.update(initialCollection.id, {
        name: 'categories',
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
            name: 'slug',
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
            name: 'parent',
            type: 'relation',
            required: false,
            collectionId: initialCollection.id, // Self-relation
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: ['name']
          },
          {
            name: 'image',
            type: 'file',
            required: false,
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: [
              'image/jpeg',
              'image/png',
              'image/webp',
              'image/svg+xml'
            ]
          },
          {
            name: 'featured',
            type: 'bool',
            required: false
          },
          {
            name: 'displayOrder',
            type: 'number',
            required: false,
            min: 0
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

      console.log('Categories collection created and updated successfully!');
      return true;
    } catch (error) {
      console.error('Error creating categories collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createCategoriesCollection();
    if (success) {
      console.log('✅ Categories collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up categories collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 