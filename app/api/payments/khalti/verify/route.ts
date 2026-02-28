import { NextRequest, NextResponse } from "next/server";
import { verifyKhaltiPayment } from "@/features/payments/services/khaltiService";
import { prisma } from "@/core/lib/prisma";

/**
 * GET /api/payments/khalti/verify
 * Verify Khalti payment callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");
    const purchaseOrderId = searchParams.get("purchase_order_id");

    if (!pidx || !purchaseOrderId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings?error=invalid_payment`,
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: purchaseOrderId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/renter/bookings?error=payment_not_found`,
      );
    }

    // Check if payment was completed
    if (status === "Completed") {
      // Verify payment with Khalti
      const verification = await verifyKhaltiPayment(pidx);

      if (verification.status === "Completed") {
        // Update payment status
        await prisma.payment.update({
          where: { id: purchaseOrderId },
          data: {
            paymentStatus: "COMPLETED",
            transactionId: verification.transactionId,
            paidAt: new Date(),
            paymentDetails: JSON.stringify({
              pidx: verification.pidx,
              fee: verification.fee,
              amount: verification.amount,
            }),
          },
        });

        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/renter/bookings?payment=success`,
        );
      }
    }

    // Payment failed or not completed
    await prisma.payment.update({
      where: { id: purchaseOrderId },
      data: {
        paymentStatus: "FAILED",
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/renter/bookings/${payment.bookingId}/payment?status=failed`,
    );
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/renter/bookings?error=verification_failed`,
    );
  }
}
