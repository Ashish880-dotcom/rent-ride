import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { createKhaltiPayment } from "@/features/payments/services/khaltiService";
import { prisma } from "@/core/lib/prisma";

/**
 * POST /api/payments/khalti/initiate
 * Initiate Khalti payment
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
            renter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
    const returnUrl = `${baseUrl}/api/payments/khalti/verify`;
    const websiteUrl = baseUrl;

    // Create Khalti payment
    const khaltiPayment = await createKhaltiPayment({
      amount: payment.amount,
      purchaseOrderId: payment.id,
      purchaseOrderName: `Vehicle Booking ${payment.bookingId}`,
      returnUrl,
      websiteUrl,
      customerInfo: {
        name: payment.booking.renter.name || undefined,
        email: payment.booking.renter.email,
      },
    });

    // Update payment with Khalti pidx
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        transactionId: khaltiPayment.pidx,
        paymentGateway: "KHALTI",
        paymentStatus: "PROCESSING",
      },
    });

    return NextResponse.json({
      paymentUrl: khaltiPayment.paymentUrl,
      pidx: khaltiPayment.pidx,
      expiresAt: khaltiPayment.expiresAt,
      expiresIn: khaltiPayment.expiresIn,
    });
  } catch (error) {
    console.error("Error initiating Khalti payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate Khalti payment",
      },
      { status: 500 },
    );
  }
}
