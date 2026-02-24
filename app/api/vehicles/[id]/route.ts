import { NextRequest, NextResponse } from "next/server";
import { vehicleService } from "@/features/vehicles/services/vehicleService";
import { auth } from "@/core/lib/auth";
import { Role } from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: vehicleId } = await params;

    const vehicle = await vehicleService.getVehicleById(vehicleId);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
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
      feedbacks: vehicle.feedbacks,
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
