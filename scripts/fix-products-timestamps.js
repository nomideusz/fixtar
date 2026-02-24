import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

async function fixProductsTimestamps() {
  try {
    console.log('🔧 Fixing products collection timestamp fields...');
    
    // Authenticate as admin
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD
    );
    console.log('✅ Authenticated as admin');
    
    // Get the current products collection
    const collection = await pb.collections.getOne('products');
    console.log('�� Current collection info:');
    console.log('Name:', collection.name);
    console.log('Type:', collection.type);
    console.log('ID:', collection.id);
    
    // Check if schema exists and log it safely
    if (collection.schema && Array.isArray(collection.schema)) {
      console.log('Fields:', collection.schema.map(f => `${f.name} (${f.type})`));
      
      // Check if created/updated fields exist and their types
      const createdField = collection.schema.find(f => f.name === 'created');
      const updatedField = collection.schema.find(f => f.name === 'updated');
      
      console.log('⏰ Timestamp fields:');
      console.log('  created:', createdField ? `${createdField.type}` : 'not found');
      console.log('  updated:', updatedField ? `${updatedField.type}` : 'not found');
      
      // If created/updated fields exist as text fields, remove them
      // PocketBase automatically manages these as system fields
      let needsUpdate = false;
      let newSchema = collection.schema.slice();
      
      if (createdField && createdField.type === 'text') {
        console.log('❌ Found "created" as text field - removing it');
        newSchema = newSchema.filter(f => f.name !== 'created');
        needsUpdate = true;
      }
      
      if (updatedField && updatedField.type === 'text') {
        console.log('❌ Found "updated" as text field - removing it');
        newSchema = newSchema.filter(f => f.name !== 'updated');
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('🔄 Updating collection schema...');
        
        await pb.collections.update(collection.id, {
          schema: newSchema
        });
        
        console.log('✅ Collection schema updated successfully!');
        console.log('📝 Note: PocketBase will now automatically manage created/updated timestamps');
        
        // Get updated collection to verify
        const updatedCollection = await pb.collections.getOne('products');
        if (updatedCollection.schema && Array.isArray(updatedCollection.schema)) {
          console.log('📋 Updated schema fields:');
          console.log(updatedCollection.schema.map(f => `${f.name} (${f.type})`));
        }
        
      } else {
        console.log('✅ No timestamp field issues found - collection is correctly configured');
      }
    } else {
      console.log('⚠️ Collection schema not found or invalid format');
      console.log('Full collection object:', JSON.stringify(collection, null, 2));
    }
    
    // Now fix existing products with empty timestamps
    console.log('\n🔧 Fixing existing products with empty timestamps...');
    
    let page = 1;
    let hasMore = true;
    let totalFixed = 0;
    
    while (hasMore) {
      try {
        const products = await pb.collection('products').getList(page, 100, {
          filter: 'created = "" || updated = ""'
        });
        
        console.log(`📄 Processing page ${page} - ${products.items.length} products with empty timestamps`);
        
        for (const product of products.items) {
          try {
            const updateData = {};
            
            // Remove empty timestamp fields - let PocketBase set them automatically
            if (product.created === '') {
              console.log(`⏰ Fixing created timestamp for product: ${product.name} (${product.sku})`);
              // We need to trigger an update to let PocketBase set the timestamp
              // We'll update the metadata to trigger this
              updateData.metadata = {
                ...product.metadata,
                timestampFixed: new Date().toISOString()
              };
            }
            
            if (product.updated === '') {
              console.log(`⏰ Fixing updated timestamp for product: ${product.name} (${product.sku})`);
              // Same approach - trigger update
              updateData.metadata = {
                ...product.metadata,
                timestampFixed: new Date().toISOString()
              };
            }
            
            if (Object.keys(updateData).length > 0) {
              await pb.collection('products').update(product.id, updateData);
              totalFixed++;
            }
            
          } catch (error) {
            console.error(`❌ Error fixing product ${product.id}:`, error.message);
          }
        }
        
        hasMore = products.items.length === 100;
        page++;
      } catch (error) {
        console.error(`❌ Error processing page ${page}:`, error.message);
        break;
      }
    }
    
    console.log(`\n✅ Fixed ${totalFixed} products with empty timestamps`);
    console.log('🎉 Timestamp fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing timestamps:', error);
    throw error;
  }
}

// Run the fix
fixProductsTimestamps()
  .then(() => {
    console.log('\n🎯 All done! Products should now have proper timestamps.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to fix timestamps:', error);
    process.exit(1);
  }); 