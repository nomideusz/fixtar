import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setAdminUser() {
  const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
  
  try {
    // Authenticate as admin
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD
    );
    
    console.log('✓ Authenticated as admin');
    
    // Get all users to find the admin user
    const users = await pb.collection('users').getFullList();
    console.log(`Found ${users.length} users`);
    
    // Find user by email (assuming admin user uses the same email)
    const adminUser = users.find(user => user.email === process.env.PB_ADMIN_EMAIL);
    
    if (adminUser) {
      console.log(`Found admin user: ${adminUser.email} (ID: ${adminUser.id})`);
      console.log(`Current isAdmin status: ${adminUser.isAdmin}`);
      console.log(`Username: ${adminUser.username}`);
      
      if (!adminUser.isAdmin) {
        try {
          // Update user to set isAdmin flag
          await pb.collection('users').update(adminUser.id, {
            isAdmin: true
          });
          console.log('✓ Set isAdmin flag to true');
        } catch (updateError) {
          console.error('Update error details:', JSON.stringify(updateError.response, null, 2));
          
          // Try alternative approach - include all required fields
          console.log('Trying alternative approach with all current data...');
          
          // Generate username from email if empty
          const username = adminUser.username || adminUser.email.split('@')[0];
          
          await pb.collection('users').update(adminUser.id, {
            username: username,
            email: adminUser.email,
            isAdmin: true
          });
          console.log('✓ Set isAdmin flag to true (alternative approach)');
        }
      } else {
        console.log('✓ User already has admin privileges');
      }
    } else {
      console.log('❌ Admin user not found in users collection');
      console.log('Available users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

setAdminUser(); 