import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { approveKYC } from "@/features/kyc/services/kycService";

/**
 * PATCH /api/kyc/[id]/approve - Approve a KYC submission (Admin only)
 * Requirements: 3.5
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 403 }
      );
    }

    // Get KYC ID from params
    const { id } = await params;

    // Approve KYC
    const kyc = await approveKYC(id);

    return NextResponse.json({
      message: "KYC approved successfully",
      kyc: {
        id: kyc.id,
        status: kyc.status,
        updatedAt: kyc.updatedAt,
      },
    });
  } catch (error) {
    console.error("KYC approval error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to approve KYC" },
      { status: 500 }
    );
  }
}
