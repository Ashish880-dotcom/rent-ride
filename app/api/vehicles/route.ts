import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { vehicleService } from "@/features/vehicles/services/vehicleService";
import { prisma } from "@/core/lib/prisma";
import {
  VehicleListingSchema,
  VehicleFilterSchema,
} from "@/core/utils/validation";
import { z } from "zod";
import { KYCStatus, Role, VehicleStatus } from "@/generated/prisma";
import { withCache, CacheTTL, cache } from "@/core/utils/cache";
import { logError, createErrorContext } from "@/core/utils/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has OWNER role (ONLY owners can create vehicles through this endpoint)
    if (session.user.role !== Role.OWNER) {
      return NextResponse.json(
        {
          error: "Only vehicle owners can list vehicles through this endpoint",
        },
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

    const context = createErrorContext(
      "vehicle_creation",
      false,
      session?.user?.id,
    );
    logError(error, context);
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

    // Validate and sanitize query parameters
    const filterParams = {
      location: searchParams.get("location") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      status: searchParams.get("status") || undefined,
    };

    const validationResult = VehicleFilterSchema.safeParse(filterParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid filter parameters",
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { location, minPrice, maxPrice, status } = validationResult.data;

    // If user is not authenticated (guest) or is a regular USER (renter), return only APPROVED vehicles
    // This allows public browsing while maintaining quality control
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
    const session = await auth();
    const context = createErrorContext(
      "vehicle_list_fetch",
      !session?.user,
      session?.user?.id,
    );
    logError(error, context);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
