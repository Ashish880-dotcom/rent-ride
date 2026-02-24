import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";
import type { Role, KYCStatus } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role") as Role | null;
    const kycStatusFilter = searchParams.get("kycStatus") as KYCStatus | null;

    // Build where clause
    const where: any = {};
    if (roleFilter) {
      where.role = roleFilter;
    }
    if (kycStatusFilter) {
      where.kyc = {
        status: kycStatusFilter,
      };
    }

    // Fetch all users with KYC status and statistics
    const users = await prisma.user.findMany({
      where,
      include: {
        kyc: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the response to include statistics
    const usersWithStats = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      kycStatus: user.kyc?.status || null,
      vehicleCount: user._count.vehicles,
      bookingCount: user._count.bookings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
