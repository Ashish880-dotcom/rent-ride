import { NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { prisma } from "@/core/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Count owner's vehicles
    const vehicleCount = await prisma.vehicle.count({
      where: { ownerId: userId },
    });

    // Count pending booking requests for owner's vehicles
    const pendingRequests = await prisma.booking.count({
      where: {
        vehicle: {
          ownerId: userId,
        },
        status: "PENDING",
      },
    });

    // Count active rentals (CONFIRMED bookings)
    const activeRentals = await prisma.booking.count({
      where: {
        vehicle: {
          ownerId: userId,
        },
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({
      vehicleCount,
      pendingRequests,
      activeRentals,
    });
  } catch (error) {
    console.error("Error fetching owner stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
