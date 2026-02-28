import { NextRequest, NextResponse } from "next/server";
import { verifyEsewaPayment } from "@/features/payments/services/esewaService";
import { prisma } from "@/core/lib/prisma";

/**
 * GET /api/payments/esewa/verify
 * Verify eSewa payment callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get("payment_id");
    const refId = searchParams.get("refId");
    const oid = searchParams.get("oid");

    if (!paymentId || !refId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings?error=invalid_payment`,
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings?error=payment_not_found`,
      );
    }

    // Verify payment with eSewa
    const isVerified = await verifyEsewaPayment(
      oid || paymentId,
      refId,
      payment.amount,
    );

    if (isVerified) {
      // Update payment status
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: "COMPLETED",
          transactionId: refId,
          paidAt: new Date(),
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings?payment=success`,
      );
    } else {
      // Payment verification failed
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings/${payment.bookingId}/payment?status=failed`,
      );
    }
  } catch (error) {
    console.error("Error verifying eSewa payment:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/renter/bookings?error=verification_failed`,
    );
  }
}
