import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase payment methods collection creator...');

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
 * Create the payment methods collection
 */
async function createPaymentMethodsCollection() {
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
      const exists = await collectionExists(pb, 'payment_methods');
      if (exists) {
        console.log('Collection "payment_methods" already exists. Skipping creation.');
        return true;
      }

      console.log('Creating payment_methods collection...');
      const result = await pb.collections.create({
        name: 'payment_methods',
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
            name: 'code',
            type: 'text',
            required: true,
            min: 2,
            max: 50
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            max: 500
          },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: ['credit_card', 'bank_transfer', 'digital_wallet', 'cash_on_delivery', 'other']
          },
          {
            name: 'active',
            type: 'bool',
            required: true
          },
          {
            name: 'processingFee',
            type: 'number',
            required: false,
            min: 0
          },
          {
            name: 'feeType',
            type: 'select',
            required: false,
            values: ['percentage', 'fixed']
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
            name: 'instructions',
            type: 'text',
            required: false,
            max: 1000
          },
          {
            name: 'configuration',
            type: 'json',
            required: false
          },
          {
            name: 'supportedCurrencies',
            type: 'text',
            required: false,
            max: 200
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

      console.log('Payment methods collection created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating payment methods collection:', error);
      console.error(error);
      return false;
    }
}

// Main execution
async function main() {
  try {
    const success = await createPaymentMethodsCollection();
    if (success) {
      console.log('✅ Payment methods collection setup completed successfully!');
    } else {
      console.error('❌ Failed to set up payment methods collection.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main(); 