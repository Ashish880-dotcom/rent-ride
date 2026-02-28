import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { createEsewaPayment } from "@/features/payments/services/esewaService";
import { prisma } from "@/core/lib/prisma";

/**
 * POST /api/payments/esewa/initiate
 * Initiate eSewa payment
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

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/api/payments/esewa/verify?payment_id=${paymentId}`;
    const failureUrl = `${baseUrl}/renter/bookings/${payment.bookingId}/payment?status=failed`;

    // Create eSewa payment
    const esewaPayment = createEsewaPayment({
      amount: payment.amount,
      transactionId: payment.id,
      productName: `Booking ${payment.bookingId}`,
      successUrl,
      failureUrl,
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentGateway: "ESEWA",
        paymentStatus: "PROCESSING",
      },
    });

    return NextResponse.json({
      paymentUrl: esewaPayment.paymentUrl,
      paymentData: esewaPayment.paymentData,
    });
  } catch (error) {
    console.error("Error initiating eSewa payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate eSewa payment",
      },
      { status: 500 },
    );
  }
}
