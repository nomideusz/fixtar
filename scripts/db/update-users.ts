import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase users collection updater...');

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

// Define a type for field definition
type FieldDefinition = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  system: boolean;
  hidden: boolean;
  presentable: boolean;
  max?: number;
  min?: number;
  collectionId?: string;
  cascadeDelete?: boolean;
  maxSelect?: number;
  displayFields?: string[];
  [key: string]: any;
};

/**
 * Update a collection by ID or name
 * @param pb PocketBase client instance
 * @param idOrName Collection ID or name
 * @param data Update data
 * @returns The updated collection or null on failure
 */
async function updateCollection(
  pb: PocketBase,
  idOrName: string,
  data: Record<string, any>
) {
  try {
    console.log(`Updating collection "${idOrName}"...`);
    return await pb.collections.update(idOrName, data);
  } catch (error) {
    console.error(`Error updating collection "${idOrName}":`, error);
    return null;
  }
}

/**
 * Update existing users collection with additional e-commerce fields
 */
async function updateUsersCollection() {
    try {
      console.log(`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`);
      
      // Create and authenticate client
      const pb = createClient();
      const authenticated = await authenticate(pb);
      
      if (!authenticated) {
        console.error('Failed to authenticate. Check your credentials in .env file.');
        return false;
      }

      // Get the users collection
      console.log('Fetching users collection...');
      const usersCollection = await pb.collections.getOne('users');
      console.log('Users collection fetched successfully');
      
      // Check for products collection to use for wishlists relation
      let productsId = '';
      try {
        const productsCollection = await pb.collections.getOne('products');
        productsId = productsCollection.id;
        console.log(`Found products collection with ID: ${productsId}`);
      } catch (error) {
        console.warn('Products collection not found. Wishlist relation will be skipped.');
      }
      
      // Get existing fields
      const existingFields = usersCollection.fields || [];
      console.log(`Existing fields: ${existingFields.length}`);
      
      // Map fields by name for easier lookup
      const fieldsByName = {};
      existingFields.forEach(field => {
        fieldsByName[field.name] = field;
      });
      
      // Define new fields to add if they don't already exist
      const newFields: FieldDefinition[] = [];
      
      // Add firstName if it doesn't exist
      if (!fieldsByName['firstName']) {
        newFields.push({
          id: '',
          name: 'firstName',
          type: 'text',
          required: false,
          system: false,
          hidden: false,
          presentable: false,
          max: 150
        });
      }
      
      // Add lastName if it doesn't exist
      if (!fieldsByName['lastName']) {
        newFields.push({
          id: '',
          name: 'lastName',
          type: 'text',
          required: false,
          system: false,
          hidden: false,
          presentable: false,
          max: 150
        });
      }
      
      // Add phone if it doesn't exist
      if (!fieldsByName['phone']) {
        newFields.push({
          id: '',
          name: 'phone',
          type: 'text',
          required: false,
          system: false,
          hidden: false,
          presentable: false,
          max: 30
        });
      }
      
      // Add addresses if it doesn't exist
      if (!fieldsByName['addresses']) {
        newFields.push({
          id: '',
          name: 'addresses',
          type: 'json',
          required: false,
          system: false,
          hidden: false,
          presentable: false
        });
      }
      
      // Add isAdmin if it doesn't exist
      if (!fieldsByName['isAdmin']) {
        newFields.push({
          id: '',
          name: 'isAdmin',
          type: 'bool',
          required: false,
          system: false,
          hidden: false,
          presentable: false
        });
      }
      
      // Add wishlist if it doesn't exist and products collection exists
      if (!fieldsByName['wishlist'] && productsId) {
        newFields.push({
          id: '',
          name: 'wishlist',
          type: 'relation',
          required: false,
          system: false,
          hidden: false,
          presentable: false,
          collectionId: productsId,
          cascadeDelete: false,
          maxSelect: 0, // Unlimited products in wishlist
          displayFields: ['name']
        });
      }
      
      if (newFields.length === 0) {
        console.log('No new fields to add.');
        return true;
      }
      
      console.log(`Found ${newFields.length} new fields to add.`);
      
      // Add new fields to the existing ones
      const updatedFields = [...existingFields];
      
      for (const newField of newFields) {
        console.log(`Adding field: ${newField.name}`);
        updatedFields.push(newField);
      }
      
      // Update the collection with all fields at once
      try {
        console.log('Updating users collection with new fields...');
        const updateData = {
          fields: updatedFields
        };
        
        const updatedCollection = await updateCollection(pb, 'users', updateData);
        
        if (updatedCollection) {
          console.log('Users collection updated successfully!');
          
          // List the fields that were added
          for (const field of newFields) {
            console.log(`Added field: ${field.name} (${field.type})`);
          }
          
          return true;
        } else {
          console.error('Failed to update users collection');
          return false;
        }
      } catch (error) {
        console.error('Error updating users collection:', error);
        return false;
      }
    } catch (error) {
      console.error('Error updating users collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await updateUsersCollection();
    if (success) {
      console.log('✅ Users collection update completed successfully!');
    } else {
      console.error('❌ Failed to update users collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 