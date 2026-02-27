/**
 * Script to update the sync_sessions collection with required fields
 * Run this script to add the missing fields to the existing collection
 */

// Configuration
const POCKETBASE_URL = 'https://k.xeon.pl';
let ADMIN_EMAIL = 'your-admin-email@example.com'; // Replace with your PocketBase admin email
let ADMIN_PASSWORD = 'your-admin-password'; // Replace with your PocketBase admin password

async function updateSyncSessionsCollection() {
	try {
		console.log('Connecting to PocketBase...');
		console.log('URL:', POCKETBASE_URL);

		// Login as superuser (admin) - using the correct endpoint
		const authUrl = `${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`;
		console.log('Auth URL:', authUrl);

		const authResponse = await fetch(authUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				identity: ADMIN_EMAIL,
				password: ADMIN_PASSWORD
			})
		});

		if (!authResponse.ok) {
			const errorText = await authResponse.text();
			console.error('Auth response:', authResponse.status, authResponse.statusText);
			console.error('Error details:', errorText);

			// Try alternate format for authentication
			if (authResponse.status === 404 || authResponse.status === 400) {
				console.log('Trying alternate authentication format...');

				// Try with email field instead of identity
				const altAuthResponse = await fetch(authUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: ADMIN_EMAIL,
						password: ADMIN_PASSWORD
					})
				});

				if (!altAuthResponse.ok) {
					const altErrorText = await altAuthResponse.text();
					console.error('Alternate auth also failed:', altErrorText);
					throw new Error(
						`Authentication failed. Make sure you're using PocketBase superuser (admin) credentials.`
					);
				}

				const altAuthData = await altAuthResponse.json();
				console.log('Authenticated successfully with alternate format');
				return await updateCollection(altAuthData.token);
			}

			throw new Error(
				`Authentication failed: ${authResponse.status} ${authResponse.statusText} - ${errorText}`
			);
		}

		const authData = await authResponse.json();
		const token = authData.token;

		console.log('Authenticated successfully');
		await updateCollection(token);
	} catch (error) {
		console.error('Error:', error);

		// Provide helpful guidance
		console.log('\n=== TROUBLESHOOTING ===');
		console.log('1. Make sure you are using your PocketBase SUPERUSER (admin) credentials');
		console.log('2. These are different from regular user accounts');
		console.log('3. You can access PocketBase Admin UI at:');
		console.log(`   ${POCKETBASE_URL}/_/`);
		console.log("4. If you don't have superuser access, you can manually add the fields:");
		console.log('   - Go to Collections → sync_sessions');
		console.log('   - Add these fields:');
		console.log('     • type (text, required, min: 2, max: 50)');
		console.log(
			'     • status (select, required, options: pending, in_progress, completed, failed)'
		);
		console.log('     • details (json)');
		console.log('     • logs (json)');
		console.log('     • summary (json)');
		console.log('     • completed (date)');

		process.exit(1);
	}
}

async function updateCollection(token) {
	try {
		// Get the existing collection
		const getResponse = await fetch(`${POCKETBASE_URL}/api/collections/sync_sessions`, {
			headers: {
				Authorization: token
			}
		});

		if (!getResponse.ok) {
			const errorText = await getResponse.text();
			throw new Error(
				`Failed to get collection: ${getResponse.status} ${getResponse.statusText} - ${errorText}`
			);
		}

		const collection = await getResponse.json();
		console.log('Collection response:', JSON.stringify(collection, null, 2));

		// Handle different response formats
		const schema = collection.schema || collection.fields || [];

		if (!Array.isArray(schema)) {
			console.error('Unexpected collection structure. Schema is not an array:', typeof schema);
			console.log('Full collection object:', collection);
			throw new Error('Collection schema is not in expected format');
		}

		console.log('Current collection schema fields:', schema.map((f) => f.name).join(', '));

		// Check if fields already exist
		const existingFields = schema.map((f) => f.name);
		const requiredFields = ['type', 'status', 'details', 'logs', 'summary', 'completed'];
		const missingFields = requiredFields.filter((field) => !existingFields.includes(field));

		if (missingFields.length === 0) {
			console.log('All required fields already exist! No update needed.');
			return;
		}

		console.log('Missing fields:', missingFields.join(', '));

		// Update the collection with new fields
		const newSchema = [...schema];

		if (missingFields.includes('type')) {
			newSchema.push({
				name: 'type',
				type: 'text',
				required: true,
				options: {
					min: 2,
					max: 50
				}
			});
		}

		if (missingFields.includes('status')) {
			newSchema.push({
				name: 'status',
				type: 'select',
				required: true,
				options: {
					maxSelect: 1,
					values: ['pending', 'in_progress', 'completed', 'failed']
				}
			});
		}

		if (missingFields.includes('details')) {
			newSchema.push({
				name: 'details',
				type: 'json'
			});
		}

		if (missingFields.includes('logs')) {
			newSchema.push({
				name: 'logs',
				type: 'json'
			});
		}

		if (missingFields.includes('summary')) {
			newSchema.push({
				name: 'summary',
				type: 'json'
			});
		}

		if (missingFields.includes('completed')) {
			newSchema.push({
				name: 'completed',
				type: 'date'
			});
		}

		console.log('Updating collection with new schema...');

		// Send update request - try both schema and fields
		const updatePayload =
			collection.schema !== undefined ? { schema: newSchema } : { fields: newSchema };

		console.log('Update payload:', JSON.stringify(updatePayload, null, 2));

		const updateResponse = await fetch(`${POCKETBASE_URL}/api/collections/${collection.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatePayload)
		});

		if (!updateResponse.ok) {
			const errorData = await updateResponse.text();
			throw new Error(
				`Failed to update collection: ${updateResponse.status} ${updateResponse.statusText} - ${errorData}`
			);
		}

		const result = await updateResponse.json();
		console.log('Collection updated successfully!');
		const resultSchema = result.schema || result.fields || [];
		console.log('Updated fields:', resultSchema.map((f) => f.name).join(', '));
	} catch (error) {
		console.error('Error in updateCollection:', error);
		throw error;
	}
}

// Check if we have the required environment variables or command line args
if (process.argv.length >= 4) {
	ADMIN_EMAIL = process.argv[2];
	ADMIN_PASSWORD = process.argv[3];
} else if (!ADMIN_EMAIL.includes('@') || ADMIN_PASSWORD === 'your-admin-password') {
	console.error('Please provide your PocketBase admin credentials:');
	console.error('  node scripts/update-sync-sessions-collection.js <admin-email> <admin-password>');
	console.error('Or update the ADMIN_EMAIL and ADMIN_PASSWORD constants in the script');
	process.exit(1);
}

updateSyncSessionsCollection();
