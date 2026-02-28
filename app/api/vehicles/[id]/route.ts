import { NextRequest, NextResponse } from "next/server";
import { vehicleService } from "@/features/vehicles/services/vehicleService";
import { auth } from "@/core/lib/auth";
import { Role, VehicleStatus } from "@/generated/prisma";
import { logError, createErrorContext } from "@/core/utils/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const { id: vehicleId } = await params;

    const vehicle = await vehicleService.getVehicleById(vehicleId);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // If no session (guest user), only return APPROVED vehicles
    if (!session?.user) {
      if (vehicle.status !== VehicleStatus.APPROVED) {
        return NextResponse.json(
          { error: "Vehicle not found" },
          { status: 404 },
        );
      }
    }

    // Calculate average rating
    const averageRating =
      vehicle.feedbacks.length > 0
        ? vehicle.feedbacks.reduce(
            (sum, feedback) => sum + feedback.rating,
            0,
          ) / vehicle.feedbacks.length
        : 0;

    return NextResponse.json({
      vehicle,
      averageRating,
    });
  } catch (error) {
    const session = await auth();
    const context = createErrorContext(
      "vehicle_detail_fetch",
      !session?.user,
      session?.user?.id,
      (await params).id,
    );
    logError(error, context);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete vehicles
    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only admins can delete vehicles" },
        { status: 403 },
      );
    }

    const { id: vehicleId } = await params;
    await vehicleService.deleteVehicle(vehicleId);

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    const session = await auth();
    const context = createErrorContext(
      "vehicle_deletion",
      false,
      session?.user?.id,
      (await params).id,
    );
    logError(error, context);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
