import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { rejectKYC } from "@/features/kyc/services/kycService";

/**
 * PATCH /api/kyc/[id]/reject - Reject a KYC submission (Admin only)
 * Requirements: 3.6
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    // Get KYC ID from params
    const { id } = await params;

    // Reject KYC
    const kyc = await rejectKYC(id);

    return NextResponse.json({
      message: "KYC rejected successfully",
      kyc: {
        id: kyc.id,
        status: kyc.status,
        updatedAt: kyc.updatedAt,
      },
    });
  } catch (error) {
    console.error("KYC rejection error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to reject KYC" },
      { status: 500 },
    );
  }
}
