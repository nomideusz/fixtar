import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PaymentService } from '$lib/services/payment';
import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, url }) => {
  const pb = new PocketBase(env.POCKETBASE_URL || 'http://127.0.0.1:8090');
  const paymentService = new PaymentService();
  
  try {
    const provider = url.searchParams.get('provider');
    
    if (!provider) {
      return json({ status: 'ERROR', message: 'Provider not specified' }, { status: 400 });
    }
    
    const data = await request.json();
    
    // Verify payment with the appropriate provider
    const verification = await paymentService.verifyPayment(provider, data);
    
    if (verification.success) {
      // Update order status based on provider
      const orderId = data.sessionId || data.orderId || data.order_id;
      
      if (orderId) {
        await pb.collection('orders').update(orderId, {
          status: 'processing',
          paymentDetails: {
            provider,
            transactionId: verification.transactionId,
            status: 'completed',
            verifiedAt: new Date().toISOString()
          }
        });
        
        // TODO: Send confirmation email
        // TODO: Clear cart (if we have user session)
        // TODO: Update inventory
      }
      
      return json({ status: 'OK' });
    }
    
    return json({ status: 'ERROR', message: 'Verification failed' }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ status: 'ERROR', message: 'Internal server error' }, { status: 500 });
  }
}; 