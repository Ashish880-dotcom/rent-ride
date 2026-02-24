import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { submitKYC } from "@/features/kyc/services/kycService";
import { KYCSubmissionSchema } from "@/core/utils/validation";
import { z } from "zod";

/**
 * POST /api/kyc - Submit KYC information
 * Requirements: 3.1, 3.2, 3.3
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body using centralized schema
    const body = await request.json();
    const validationResult = KYCSubmissionSchema.safeParse(body);

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

    // Submit KYC
    const kyc = await submitKYC(session.user.id, validationResult.data);

    return NextResponse.json(
      {
        message: "KYC submitted successfully",
        kyc: {
          id: kyc.id,
          status: kyc.status,
          createdAt: kyc.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("KYC submission error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to submit KYC" },
      { status: 500 },
    );
  }
}
