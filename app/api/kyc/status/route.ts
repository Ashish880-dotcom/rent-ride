import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { getUserKYCStatus } from "@/features/kyc/services/kycService";
import { prisma } from "@/core/lib/prisma";

/**
 * GET /api/kyc/status - Check user's KYC status
 * Requirements: 3.2, 3.3
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's full KYC data
    const kyc = await prisma.kYC.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      kyc,
    });
  } catch (error) {
    console.error("KYC status check error:", error);

    return NextResponse.json(
      { error: "Failed to check KYC status" },
      { status: 500 },
    );
  }
}
