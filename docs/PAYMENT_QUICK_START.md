# Payment Gateway Quick Start Guide

## Quick Setup (5 Minutes)

### 1. Install Dependencies

Already installed: `stripe` and `axios`

### 2. Configure Environment Variables

Copy these to your `.env` file and replace with your actual keys:

```env
# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_PUBLIC_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# eSewa (Get from eSewa merchant portal)
ESEWA_MERCHANT_ID="EPAYTEST"
ESEWA_SECRET_KEY="8gBm/:&EnhH.1/q"
ESEWA_ENVIRONMENT="test"

# Khalti (Get from https://khalti.com/merchant)
KHALTI_PUBLIC_KEY="test_public_key_..."
KHALTI_SECRET_KEY="test_secret_key_..."
KHALTI_ENVIRONMENT="test"
```

### 3. Test Mode Credentials

#### Stripe Test Mode

- Already enabled by default with test keys
- Test card: `4242 4242 4242 4242`
- Any future expiry, any 3-digit CVC

#### eSewa Test Mode

- Merchant ID: `EPAYTEST`
- Use eSewa test account to complete payment
- Test URL: https://uat.esewa.com.np

#### Khalti Test Mode

- Test mobile: `9800000000` to `9800000010`
- Test MPIN: `1111`
- Test OTP: `987654`

### 4. Restart Your Server

```bash
npm run dev
```

### 5. Test Payment Flow

1. Go to: `http://localhost:3000/renter/vehicles`
2. Select a vehicle and create a booking
3. You'll be redirected to payment page
4. Choose a payment method:
   - **Credit/Debit Card**: Uses Stripe (currently mock, needs Stripe Elements integration)
   - **eSewa**: Redirects to eSewa portal
   - **Khalti**: Redirects to Khalti portal
5. Complete payment
6. Verify payment status in bookings

## What's Implemented

✅ Payment gateway services (Stripe, eSewa, Khalti)
✅ API routes for payment initiation
✅ Payment verification callbacks
✅ Payment status tracking
✅ Owner approval after payment
✅ Payment method selection
✅ Redirect flows for eSewa and Khalti

## What Needs Configuration

### For Production Use:

1. **Get Real API Keys**
   - Sign up for Stripe merchant account
   - Apply for eSewa merchant account
   - Register for Khalti merchant account

2. **Update Environment Variables**
   - Replace test keys with production keys
   - Set environment to "production"

3. **Configure Webhooks**
   - Set up Stripe webhooks
   - Whitelist callback URLs in eSewa
   - Configure Khalti return URLs

4. **Add Stripe Elements** (for card payments)
   - Integrate Stripe Elements in PaymentForm
   - Add client-side card validation
   - Implement 3D Secure

## Next Steps

### Immediate (Required for Production):

1. **Integrate Stripe Elements**
   - Replace mock card form with Stripe Elements
   - Add real-time card validation
   - Implement payment confirmation

2. **Test All Gateways**
   - Test eSewa payment flow
   - Test Khalti payment flow
   - Test Stripe payment flow
   - Test payment failures
   - Test refunds

3. **Add Error Handling**
   - Handle network failures
   - Handle gateway timeouts
   - Add retry logic
   - Show user-friendly errors

### Optional (Nice to Have):

1. **Payment Receipts**
   - Generate PDF receipts
   - Email receipts to users
   - Add receipt download

2. **Payment Analytics**
   - Track payment success rates
   - Monitor gateway performance
   - Generate payment reports

3. **Advanced Features**
   - Save payment methods
   - Automatic refunds
   - Payment reminders
   - Installment payments

## Testing Checklist

- [ ] Create booking
- [ ] Redirect to payment page
- [ ] Select eSewa → Complete payment → Verify success
- [ ] Select Khalti → Complete payment → Verify success
- [ ] Select Credit Card → Complete payment → Verify success
- [ ] Test payment failure
- [ ] Verify owner can accept after payment
- [ ] Verify owner cannot accept before payment
- [ ] Test payment retry
- [ ] Check payment status in database

## Troubleshooting

### "Payment gateway not configured"

- Check `.env` file has all keys
- Restart server after adding keys
- Verify keys don't have extra spaces

### "Payment verification failed"

- Check callback URLs are accessible
- Verify merchant IDs are correct
- Check gateway logs for errors

### "Cannot redirect to payment gateway"

- Check internet connection
- Verify gateway URLs are correct
- Check if gateway is in maintenance

## Support

If you encounter issues:

1. Check the detailed guide: `docs/PAYMENT_GATEWAY_INTEGRATION.md`
2. Review gateway documentation
3. Check server logs for errors
4. Test in test mode first
5. Contact gateway support if needed

## Important Notes

⚠️ **Security**

- Never commit API keys to git
- Use environment variables
- Keep keys secure
- Rotate keys regularly

⚠️ **Testing**

- Always test in test mode first
- Use test credentials only in test mode
- Never use real cards in test mode
- Verify all payment flows before production

⚠️ **Production**

- Get proper merchant accounts
- Complete KYC verification
- Set up monitoring
- Configure webhooks
- Test thoroughly before launch
