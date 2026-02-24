import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { submitFeedback } from "@/features/bookings/services/feedbackService";
import { FeedbackSubmissionSchema } from "@/core/utils/validation";
import { Role } from "@/generated/prisma";
import { z } from "zod";

/**
 * POST /api/bookings/[id]/feedback - Submit feedback for a completed booking
 * Only the renter who made the booking can submit feedback
 * Validates booking is COMPLETED and rating is between 1-5
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user has USER role (renters)
    if (session.user.role !== Role.USER && session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only renters can submit feedback" },
        { status: 403 },
      );
    }

    const { id: bookingId } = await params;

    // Parse and validate request body using centralized schema
    const body = await request.json();
    const validationResult = FeedbackSubmissionSchema.safeParse({
      bookingId,
      ...body,
    });

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

    const { rating, comment } = validationResult.data;

    // Submit feedback
    const feedback = await submitFeedback({
      bookingId,
      userId: session.user.id,
      rating,
      comment,
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (
        error.message.includes("completed bookings") ||
        error.message.includes("Only the renter") ||
        error.message.includes("already been submitted")
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
