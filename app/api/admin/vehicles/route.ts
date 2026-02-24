import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { prisma } from "@/core/lib/prisma";
import { VehicleListingSchema } from "@/core/utils/validation";
import { Role, VehicleStatus, KYCStatus } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can add vehicles on behalf of owners
    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only admins can add vehicles for owners" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { ownerId, ...vehicleData } = body;

    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 },
      );
    }

    // Verify the owner exists and has OWNER role
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      include: {
        kyc: true,
      },
    });

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    if (owner.role !== Role.OWNER) {
      return NextResponse.json(
        { error: "Selected user is not a vehicle owner" },
        { status: 400 },
      );
    }

    // Check if owner has approved KYC
    if (!owner.kyc || owner.kyc.status !== KYCStatus.APPROVED) {
      return NextResponse.json(
        { error: "Owner must have approved KYC status" },
        { status: 400 },
      );
    }

    // Validate vehicle data
    const validationResult = VehicleListingSchema.safeParse(vehicleData);

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

    // Create vehicle with APPROVED status (admin bypass)
    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        make: validationResult.data.make,
        model: validationResult.data.model,
        year: validationResult.data.year,
        pricePerDay: validationResult.data.pricePerDay,
        location: validationResult.data.location,
        description: validationResult.data.description,
        images: validationResult.data.images,
        status: VehicleStatus.APPROVED, // Admin-added vehicles are auto-approved
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
