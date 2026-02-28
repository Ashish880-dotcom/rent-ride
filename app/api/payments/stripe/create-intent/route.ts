import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { createStripePaymentIntent } from "@/features/payments/services/stripeService";
import { prisma } from "@/core/lib/prisma";

/**
 * POST /api/payments/stripe/create-intent
 * Create a Stripe Payment Intent
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 },
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            renter: true,
            vehicle: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify the payment belongs to the current user
    if (payment.booking.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to access this payment" },
        { status: 403 },
      );
    }

    // Create Stripe Payment Intent
    const { clientSecret, paymentIntentId } = await createStripePaymentIntent({
      amount: Math.round(payment.amount * 100), // Convert to paisa
      currency: "npr",
      metadata: {
        paymentId: payment.id,
        bookingId: payment.bookingId,
        renterId: payment.booking.renterId,
      },
    });

    // Update payment with Stripe payment intent ID
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        transactionId: paymentIntentId,
        paymentGateway: "STRIPE",
        paymentStatus: "PROCESSING",
      },
    });

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}
