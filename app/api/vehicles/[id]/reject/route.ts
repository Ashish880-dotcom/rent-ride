import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { vehicleService } from "@/features/vehicles/services/vehicleService";
import { Role } from "@/generated/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has ADMIN role
    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only admins can reject vehicles" },
        { status: 403 },
      );
    }

    const { id: vehicleId } = await params;
    const vehicle = await vehicleService.rejectVehicle(vehicleId);

    return NextResponse.json({ vehicle });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error rejecting vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
