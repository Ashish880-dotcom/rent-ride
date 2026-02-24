import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { getOwnerBookings } from "@/features/bookings/services/bookingService";
import { Role, BookingStatus } from "@/generated/prisma";

/**
 * GET /api/bookings/owner - Get all bookings for the current owner's vehicles
 * Returns bookings grouped by status
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user has OWNER or ADMIN role
    if (session.user.role !== Role.OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only owners can access this endpoint" },
        { status: 403 },
      );
    }

    // Get bookings for the owner's vehicles
    const bookings = await getOwnerBookings(session.user.id);

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
    console.error("Error fetching owner bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
