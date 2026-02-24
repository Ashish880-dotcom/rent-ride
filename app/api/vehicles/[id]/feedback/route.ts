import { NextRequest, NextResponse } from "next/server";
import { getVehicleFeedback } from "@/features/bookings/services/feedbackService";

/**
 * GET /api/vehicles/[id]/feedback - Get all feedback for a vehicle
 * Public endpoint - no authentication required
 * Returns all feedback with renter information and average rating
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: vehicleId } = await params;

    // Fetch vehicle feedback
    const result = await getVehicleFeedback(vehicleId);

    // Transform feedback to include only renter name from KYC
    // and exclude sensitive data
    const feedbacksWithRenterInfo = result.feedbacks.map((feedback) => ({
      id: feedback.id,
      rating: feedback.rating,
      comment: feedback.comment,
      createdAt: feedback.createdAt,
      renterName: feedback.renter.kyc?.fullName || "Anonymous", // Use KYC fullName or fallback
    }));

    return NextResponse.json({
      feedbacks: feedbacksWithRenterInfo,
      averageRating: result.averageRating,
      totalFeedbacks: result.feedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching vehicle feedback:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
