import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkOrdersSchema() {
	const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

	try {
		await pb
			.collection('_superusers')
			.authWithPassword(process.env.PB_ADMIN_EMAIL || '', process.env.PB_ADMIN_PASSWORD || '');

		const ordersCollection = await pb.collections.getOne('orders');
		console.log('Orders collection structure:');
		console.log(JSON.stringify(ordersCollection, null, 2));
	} catch (error) {
		console.error('Error:', error);
	}
}

checkOrdersSchema();
