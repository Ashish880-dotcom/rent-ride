import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { vehicleService } from "@/features/vehicles/services/vehicleService";
import { prisma } from "@/core/lib/prisma";
import { VehicleListingSchema } from "@/core/utils/validation";
import { z } from "zod";
import { KYCStatus, Role, VehicleStatus } from "@/generated/prisma";
import { withCache, CacheTTL, cache } from "@/core/utils/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has OWNER role
    if (session.user.role !== Role.OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only vehicle owners can list vehicles" },
        { status: 403 },
      );
    }

    // Check if user has APPROVED KYC
    const userKYC = await prisma.kYC.findUnique({
      where: { userId: session.user.id },
    });

    if (!userKYC || userKYC.status !== KYCStatus.APPROVED) {
      return NextResponse.json(
        { error: "KYC approval required to list vehicles" },
        { status: 403 },
      );
    }

    // Parse and validate request body using centralized schema
    const body = await request.json();
    const validationResult = VehicleListingSchema.safeParse(body);

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

    // Create vehicle
    const vehicle = await vehicleService.createVehicle(
      session.user.id,
      validationResult.data,
    );

    // Invalidate vehicle cache when new vehicle is created
    cache.invalidatePattern("vehicles:.*");

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; meta?: any };

      // Handle unique constraint violations
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "A vehicle with these details already exists" },
          { status: 409 },
        );
      }

      // Handle foreign key constraint violations
      if (prismaError.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference: User not found" },
          { status: 400 },
        );
      }
    }

    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    const location = searchParams.get("location") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const status = searchParams.get("status") as VehicleStatus | undefined;

    // If user is not authenticated or is a regular USER, return only APPROVED vehicles
    if (!session?.user || session.user.role === Role.USER) {
      const cacheKey = `vehicles:approved:${location || "all"}:${minPrice || "0"}:${maxPrice || "inf"}`;
      const vehicles = await withCache(
        cacheKey,
        () =>
          vehicleService.getApprovedVehicles({
            location,
            minPrice,
            maxPrice,
          }),
        CacheTTL.MEDIUM,
      );
      return NextResponse.json({ vehicles });
    }

    // If user is OWNER, return their own vehicles
    if (session.user.role === Role.OWNER) {
      const vehicles = await vehicleService.getOwnerVehicles(session.user.id);
      return NextResponse.json({ vehicles });
    }

    // If user is ADMIN, return all vehicles (optionally filtered by status)
    if (session.user.role === Role.ADMIN) {
      if (
        status === VehicleStatus.PENDING ||
        status === VehicleStatus.AWAITING_PAYMENT
      ) {
        const vehicles = await vehicleService.getPendingVehicles();
        return NextResponse.json({ vehicles });
      }

      // Return all vehicles for admin
      const vehicles = await prisma.vehicle.findMany({
        where: status ? { status } : undefined,
        include: {
          owner: {
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
      return NextResponse.json({ vehicles });
    }

    return NextResponse.json({ vehicles: [] });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
