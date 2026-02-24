import { NextRequest, NextResponse } from "next/server";
import { vehicleService } from "@/features/vehicles/services/vehicleService";

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
