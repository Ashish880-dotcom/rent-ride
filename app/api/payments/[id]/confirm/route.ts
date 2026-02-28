import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import {
  confirmPayment,
  getPaymentByBookingId,
} from "@/features/payments/services/paymentService";
import { prisma } from "@/core/lib/prisma";
import { BookingStatus } from "@/generated/prisma";

/**
 * POST /api/payments/[id]/confirm - Confirm payment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: paymentId } = await params;
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify payment belongs to user
    if (payment.booking.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to confirm this payment" },
        { status: 403 },
      );
    }

    // Confirm payment
    const updatedPayment = await confirmPayment(paymentId, transactionId);

    // Note: Booking status remains PENDING until owner accepts
    // Owner can only accept after payment is COMPLETED

    return NextResponse.json({ payment: updatedPayment });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
