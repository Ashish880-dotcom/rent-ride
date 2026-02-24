import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import {
  createBooking,
  checkConflicts,
  getRenterBookings,
  getOwnerBookings,
} from "@/features/bookings/services/bookingService";
import { prisma } from "@/core/lib/prisma";
import { BookingRequestSchema } from "@/core/utils/validation";
import { z } from "zod";
import { Role, KYCStatus, VehicleStatus } from "@/generated/prisma";

/**
 * POST /api/bookings - Create a new booking request
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user has USER role
    if (session.user.role !== Role.USER) {
      return NextResponse.json(
        { error: "Only users with USER role can create bookings" },
        { status: 403 },
      );
    }

    // Validate user has APPROVED KYC
    if (session.user.kycStatus !== KYCStatus.APPROVED) {
      return NextResponse.json(
        { error: "KYC approval required to create bookings" },
        { status: 403 },
      );
    }

    // Parse and validate request body using centralized schema
    const body = await request.json();
    const validationResult = BookingRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { vehicleId, startDate, endDate } = validationResult.data;

    // Check vehicle exists and has APPROVED status
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle.status !== VehicleStatus.APPROVED) {
      return NextResponse.json(
        { error: "Vehicle is not available for booking" },
        { status: 400 },
      );
    }

    // Check for conflicts
    const hasConflict = await checkConflicts(vehicleId, startDate, endDate);
    if (hasConflict) {
      return NextResponse.json(
        {
          error:
            "Booking conflict: Vehicle is already booked for the selected dates",
        },
        { status: 409 },
      );
    }

    // Create booking
    const booking = await createBooking({
      renterId: session.user.id,
      vehicleId,
      startDate,
      endDate,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; meta?: any };

      // Handle foreign key constraint violations
      if (prismaError.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference: Vehicle or user not found" },
          { status: 400 },
        );
      }
    }

    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/bookings - Get bookings with role-based filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let bookings;

    // Role-based filtering
    if (session.user.role === Role.USER) {
      // Renters see their own bookings
      bookings = await getRenterBookings(session.user.id);
    } else if (session.user.role === Role.OWNER) {
      // Owners see bookings for their vehicles
      bookings = await getOwnerBookings(session.user.id);
    } else if (session.user.role === Role.ADMIN) {
      // Admins see all bookings
      bookings = await prisma.booking.findMany({
        include: {
          vehicle: {
            include: {
              owner: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          renter: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
