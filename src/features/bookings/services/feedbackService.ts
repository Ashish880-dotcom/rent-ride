import prisma from "@/core/lib/prisma";
import { BookingStatus } from "@/generated/prisma";

interface SubmitFeedbackInput {
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
}

interface FeedbackWithRenter {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  renter: {
    id: string;
    email: string;
    kyc: {
      fullName: string;
    } | null;
  };
}

interface VehicleFeedbackResult {
  feedbacks: FeedbackWithRenter[];
  averageRating: number;
}

export async function submitFeedback(input: SubmitFeedbackInput) {
  const { bookingId, userId, rating, comment } = input;

  // Validate rating is between 1-5
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Fetch the booking with vehicle information
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      vehicle: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Validate booking has COMPLETED status
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Feedback can only be submitted for completed bookings");
  }

  // Validate user is the booking renter
  if (booking.renterId !== userId) {
    throw new Error("Only the renter can submit feedback for this booking");
  }

  // Check for duplicate feedback
  const existingFeedback = await prisma.feedback.findUnique({
    where: { bookingId },
  });

  if (existingFeedback) {
    throw new Error("Feedback has already been submitted for this booking");
  }

  // Create feedback
  const feedback = await prisma.feedback.create({
    data: {
      bookingId,
      vehicleId: booking.vehicleId,
      renterId: userId,
      rating,
      comment: comment || null,
    },
  });

  return feedback;
}

export async function getVehicleFeedback(
  vehicleId: string,
): Promise<VehicleFeedbackResult> {
  // Fetch all feedback for the vehicle
  const feedbacks = await prisma.feedback.findMany({
    where: { vehicleId },
    include: {
      renter: {
        select: {
          id: true,
          email: true,
          kyc: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate average rating
  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

  return {
    feedbacks,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
  };
}
