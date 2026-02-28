# Payment Gateway Integration Guide

## Overview

This document provides comprehensive instructions for integrating Stripe, eSewa, and Khalti payment gateways into the RentRide platform.

## Supported Payment Gateways

### 1. Stripe (International Cards)

- Credit Cards
- Debit Cards
- International payments
- Automatic currency conversion

### 2. eSewa (Nepal)

- Popular digital wallet in Nepal
- Bank transfers
- eSewa wallet payments

### 3. Khalti (Nepal)

- Digital wallet for Nepal
- Mobile banking
- Khalti wallet payments

## Setup Instructions

### Environment Variables

Add the following to your `.env` file:

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# eSewa Configuration
ESEWA_MERCHANT_ID="your_esewa_merchant_id"
ESEWA_SECRET_KEY="your_esewa_secret_key"
ESEWA_ENVIRONMENT="test" # test or production

# Khalti Configuration
KHALTI_PUBLIC_KEY="your_khalti_public_key"
KHALTI_SECRET_KEY="your_khalti_secret_key"
KHALTI_ENVIRONMENT="test" # test or production
```

### 1. Stripe Setup

#### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete business verification

#### Step 2: Get API Keys

1. Go to Dashboard → Developers → API keys
2. Copy your Publishable key (starts with `pk_test_`)
3. Copy your Secret key (starts with `sk_test_`)
4. Add them to `.env` file

#### Step 3: Set Up Webhooks (Optional but Recommended)

1. Go to Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/payments/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add to `.env`

#### Step 4: Test Cards

Use these test cards in test mode:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`
- Any future expiry date and any 3-digit CVC

### 2. eSewa Setup

#### Step 1: Create eSewa Merchant Account

1. Go to [https://esewa.com.np](https://esewa.com.np)
2. Apply for merchant account
3. Submit required documents
4. Wait for approval (usually 3-5 business days)

#### Step 2: Get Merchant Credentials

1. Log in to eSewa merchant portal
2. Go to Settings → API Credentials
3. Copy your Merchant ID
4. Copy your Secret Key
5. Add them to `.env` file

#### Step 3: Test Environment

For testing, use eSewa's UAT environment:

- Set `ESEWA_ENVIRONMENT="test"`
- Use test merchant credentials provided by eSewa
- Test URL: `https://uat.esewa.com.np`

#### Step 4: Configure Return URLs

Ensure these URLs are whitelisted in your eSewa merchant account:

- Success URL: `https://yourdomain.com/api/payments/esewa/verify`
- Failure URL: `https://yourdomain.com/renter/bookings/[id]/payment?status=failed`

### 3. Khalti Setup

#### Step 1: Create Khalti Merchant Account

1. Go to [https://khalti.com](https://khalti.com)
2. Sign up for merchant account
3. Complete KYC verification
4. Submit business documents

#### Step 2: Get API Keys

1. Log in to Khalti merchant dashboard
2. Go to Settings → API Keys
3. Copy your Public Key
4. Copy your Secret Key
5. Add them to `.env` file

#### Step 3: Test Environment

For testing:

- Set `KHALTI_ENVIRONMENT="test"`
- Use test credentials from Khalti
- Test URL: `https://a.khalti.com`

#### Step 4: Test Credentials

Khalti provides test credentials:

- Test Mobile: `9800000000` to `9800000010`
- Test MPIN: `1111`
- Test OTP: `987654`

## Payment Flow

### For Renters:

1. **Create Booking**
   - Renter selects vehicle and dates
   - System creates booking with PENDING status
   - Redirects to payment page

2. **Select Payment Method**
   - Choose from: Credit Card, Debit Card, eSewa, Khalti, Bank Transfer
   - Click "Continue"

3. **Complete Payment**
   - **Stripe (Cards)**: Enter card details in secure form
   - **eSewa**: Redirected to eSewa portal, login and confirm
   - **Khalti**: Redirected to Khalti portal, login and confirm
   - **Bank Transfer**: Manual transfer with instructions

4. **Payment Verification**
   - System verifies payment with gateway
   - Updates payment status to COMPLETED
   - Redirects back to bookings page

5. **Booking Confirmation**
   - Owner can now accept the booking
   - Booking status changes to CONFIRMED

### For Owners:

1. **View Booking Requests**
   - See all pending bookings
   - Check payment status

2. **Accept Booking**
   - Can only accept if payment is COMPLETED
   - System validates payment before accepting

3. **Manage Bookings**
   - Track active rentals
   - Complete bookings after rental period

## API Endpoints

### Stripe

- `POST /api/payments/stripe/create-intent` - Create payment intent
- `POST /api/payments/stripe/webhook` - Handle webhooks (to be implemented)

### eSewa

- `POST /api/payments/esewa/initiate` - Initiate payment
- `GET /api/payments/esewa/verify` - Verify payment callback

### Khalti

- `POST /api/payments/khalti/initiate` - Initiate payment
- `GET /api/payments/khalti/verify` - Verify payment callback

### General

- `POST /api/payments` - Create payment record
- `GET /api/payments` - Get user payments
- `POST /api/payments/[id]/confirm` - Confirm payment (fallback)

## Security Considerations

### 1. API Key Security

- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Use different keys for test and production

### 2. Payment Verification

- Always verify payments on server-side
- Don't trust client-side payment status
- Validate webhook signatures
- Check payment amounts match booking amounts

### 3. PCI Compliance (for Stripe)

- Never store card details
- Use Stripe Elements for card input
- Let Stripe handle sensitive data
- Implement 3D Secure authentication

### 4. Data Protection

- Encrypt payment details in database
- Log payment transactions securely
- Implement rate limiting on payment APIs
- Monitor for suspicious activity

## Testing

### Test Mode

All gateways support test mode:

- Set environment to "test" in `.env`
- Use test API keys
- Use test payment methods
- No real money is charged

### Test Scenarios

#### Successful Payment

1. Create booking
2. Select payment method
3. Use test credentials
4. Verify payment completes
5. Check booking can be accepted

#### Failed Payment

1. Create booking
2. Select payment method
3. Use failing test credentials
4. Verify payment fails
5. Check booking remains pending
6. Verify "Retry Payment" button appears

#### Payment Timeout

1. Create booking
2. Initiate payment
3. Don't complete payment
4. Wait for timeout
5. Verify payment status is FAILED

## Production Deployment

### Pre-launch Checklist

- [ ] Replace test API keys with production keys
- [ ] Set environment to "production"
- [ ] Configure production webhook URLs
- [ ] Test all payment methods in production
- [ ] Set up payment monitoring
- [ ] Configure email notifications
- [ ] Implement payment receipts
- [ ] Set up refund process
- [ ] Configure payment retry logic
- [ ] Test error handling

### Monitoring

Monitor these metrics:

- Payment success rate
- Payment failure reasons
- Average payment time
- Gateway response times
- Webhook delivery success
- Refund requests

### Error Handling

Common errors and solutions:

1. **Payment Intent Creation Failed**
   - Check API keys are correct
   - Verify amount is valid
   - Check network connectivity

2. **eSewa Verification Failed**
   - Verify merchant ID is correct
   - Check return URLs are whitelisted
   - Ensure amount matches

3. **Khalti Payment Timeout**
   - Check API endpoint is accessible
   - Verify secret key is correct
   - Check payment expiry time

## Refunds

### Stripe Refunds

- Automatic through API
- Full or partial refunds supported
- Instant processing

### eSewa Refunds

- Manual through merchant portal
- Contact eSewa support
- Processing time: 3-5 business days

### Khalti Refunds

- Automatic through API
- Full or partial refunds supported
- Processing time: 1-2 business days

## Support

### Stripe Support

- Email: support@stripe.com
- Docs: https://stripe.com/docs
- Dashboard: https://dashboard.stripe.com

### eSewa Support

- Email: merchant@esewa.com.np
- Phone: +977-1-5970577
- Website: https://esewa.com.np

### Khalti Support

- Email: support@khalti.com
- Phone: +977-5970522
- Website: https://khalti.com

## Troubleshooting

### Common Issues

1. **"Payment gateway not configured"**
   - Check environment variables are set
   - Verify API keys are correct
   - Restart server after adding keys

2. **"Payment verification failed"**
   - Check webhook URLs are accessible
   - Verify callback URLs are correct
   - Check payment gateway logs

3. **"Transaction not found"**
   - Verify transaction ID is correct
   - Check payment was actually completed
   - Contact gateway support

## Future Enhancements

- [ ] Add payment installments
- [ ] Implement saved payment methods
- [ ] Add payment reminders
- [ ] Generate payment receipts (PDF)
- [ ] Add payment analytics dashboard
- [ ] Implement automatic refunds
- [ ] Add payment dispute resolution
- [ ] Support more payment methods
- [ ] Add payment scheduling
- [ ] Implement payment webhooks for all gateways

## Notes

- All amounts are stored in NPR (Nepali Rupees)
- Stripe automatically handles currency conversion
- eSewa and Khalti only support NPR
- Payment records are never deleted, only marked as failed/refunded
- Always test in test mode before going live
- Keep payment gateway SDKs updated
- Monitor gateway status pages for outages
