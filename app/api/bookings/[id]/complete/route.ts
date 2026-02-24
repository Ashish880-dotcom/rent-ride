import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { completeBooking } from "@/features/bookings/services/bookingService";
import { Role } from "@/generated/prisma";

/**
 * PATCH /api/bookings/[id]/complete - Mark a booking as completed
 * Only the vehicle owner can complete bookings
 * Validates that the end date has passed
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user has OWNER or ADMIN role
    if (session.user.role !== Role.OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only vehicle owners can complete bookings" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Complete the booking
    const booking = await completeBooking(id, session.user.id);

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error completing booking:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes("End date has not passed")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
