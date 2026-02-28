import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export interface CreateStripePaymentIntentParams {
  amount: number; // in paisa (smallest currency unit)
  currency?: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe Payment Intent
 */
export async function createStripePaymentIntent(
  params: CreateStripePaymentIntentParams,
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount), // Stripe expects amount in smallest currency unit
      currency: params.currency || "npr", // Nepali Rupee
      metadata: params.metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe payment intent creation failed:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create payment intent",
    );
  }
}

/**
 * Verify Stripe Payment Intent
 */
export async function verifyStripePayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error("Stripe payment verification failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to verify payment",
    );
  }
}

/**
 * Create Stripe Refund
 */
export async function createStripeRefund(paymentIntentId: string) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    };
  } catch (error) {
    console.error("Stripe refund creation failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create refund",
    );
  }
}

/**
 * Construct Stripe Webhook Event
 */
export function constructStripeWebhookEvent(
  payload: string | Buffer,
  signature: string,
) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook verification failed:", error);
    throw new Error("Invalid webhook signature");
  }
}
