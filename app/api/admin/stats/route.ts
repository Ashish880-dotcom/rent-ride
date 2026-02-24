import { NextResponse } from "next/server";
import { prisma } from "@/core/lib/prisma";

export async function GET() {
  try {
    // Count pending KYC submissions
    const pendingKYC = await prisma.kYC.count({
      where: {
        status: "PENDING",
      },
    });

    // Count pending vehicles (PENDING + AWAITING_PAYMENT)
    const pendingVehicles = await prisma.vehicle.count({
      where: {
        status: {
          in: ["PENDING", "AWAITING_PAYMENT"],
        },
      },
    });

    // Count total users
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      pendingKYC,
      pendingVehicles,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
