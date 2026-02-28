import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import {
  createPayment,
  getUserPayments,
} from "@/features/payments/services/paymentService";
import { PaymentMethod } from "@/generated/prisma";

/**
 * POST /api/payments - Create a payment for a booking
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, paymentMethod } = body;

    if (!bookingId || !paymentMethod) {
      return NextResponse.json(
        { error: "Booking ID and payment method are required" },
        { status: 400 },
      );
    }

    // Verify booking belongs to user
    const { prisma } = await import("@/core/lib/prisma");
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to create payment for this booking" },
        { status: 403 },
      );
    }

    // Check if payment already exists
    if (booking.payment) {
      return NextResponse.json(
        { error: "Payment already exists for this booking" },
        { status: 400 },
      );
    }

    // Create payment
    const payment = await createPayment({
      bookingId,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod as PaymentMethod,
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/payments - Get user's payments
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await getUserPayments(session.user.id);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
