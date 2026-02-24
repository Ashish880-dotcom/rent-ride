import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { getPendingSubmissions } from "@/features/kyc/services/kycService";

/**
 * GET /api/kyc/pending - List all pending KYC submissions (Admin only)
 * Requirements: 3.4
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get pending submissions
    const submissions = await getPendingSubmissions();

    return NextResponse.json({
      submissions,
    });
  } catch (error) {
    console.error("Get pending KYC submissions error:", error);

    return NextResponse.json(
      { error: "Failed to fetch pending submissions" },
      { status: 500 },
    );
  }
}
