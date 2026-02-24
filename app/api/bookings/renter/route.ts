import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { getRenterBookings } from "@/features/bookings/services/bookingService";
import { Role, BookingStatus } from "@/generated/prisma";

/**
 * GET /api/bookings/renter - Get all bookings for the current renter
 * Returns bookings grouped by status
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookings for the renter
    const bookings = await getRenterBookings(session.user.id);

    // Group bookings by status
    const groupedBookings = {
      pending: bookings.filter((b) => b.status === BookingStatus.PENDING),
      confirmed: bookings.filter((b) => b.status === BookingStatus.CONFIRMED),
      completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED),
      rejected: bookings.filter((b) => b.status === BookingStatus.REJECTED),
    };

    return NextResponse.json({
      bookings,
      groupedBookings,
    });
  } catch (error) {
    console.error("Error fetching renter bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
