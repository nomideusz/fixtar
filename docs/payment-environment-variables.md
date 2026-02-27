# Payment Environment Variables

Add these environment variables to your `.env` file when implementing payment providers:

## Przelewy24

```env
# Przelewy24 Configuration
P24_MERCHANT_ID=your_merchant_id
P24_POS_ID=your_pos_id
P24_CRC_KEY=your_crc_key
P24_API_KEY=your_api_key
P24_TEST_MODE=true  # Set to false for production
P24_WEBHOOK_SECRET=your_webhook_secret
```

## PayU

```env
# PayU Configuration
PAYU_POS_ID=your_pos_id
PAYU_SECOND_KEY=your_second_key
PAYU_OAUTH_CLIENT_ID=your_client_id
PAYU_OAUTH_CLIENT_SECRET=your_client_secret
PAYU_TEST_MODE=true  # Set to false for production
```

## Stripe

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Bank Transfer Settings

Update the bank details in `src/lib/services/payment/bank-transfer.ts` with your actual bank account information.

## Testing Payment Providers

1. **Przelewy24 Sandbox**:
   - Register at: https://sandbox.przelewy24.pl/
   - Test cards: Any valid card number
   - Test BLIK: 777123

2. **PayU Sandbox**:
   - Register at: https://secure.snd.payu.com/
   - Documentation: https://developers.payu.com/

3. **Stripe Test Mode**:
   - Test cards: https://stripe.com/docs/testing
   - Polish card: 4000 0048 4000 0006
