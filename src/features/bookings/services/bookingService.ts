import { prisma } from "@/core/lib/prisma";
import { BookingStatus } from "@/generated/prisma";

export interface CreateBookingData {
  renterId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Check if there are any booking conflicts for a vehicle in the given date range
 * Considers PENDING, CONFIRMED, and COMPLETED bookings as conflicts
 */
export async function checkConflicts(
  vehicleId: string,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: string,
): Promise<boolean> {
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      vehicleId,
      status: {
        in: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.COMPLETED,
        ],
      },
      ...(excludeBookingId && {
        id: {
          not: excludeBookingId,
        },
      }),
      OR: [
        // New booking starts during existing booking
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gt: startDate } },
          ],
        },
        // New booking ends during existing booking
        {
          AND: [{ startDate: { lt: endDate } }, { endDate: { gte: endDate } }],
        },
        // New booking completely contains existing booking
        {
          AND: [
            { startDate: { gte: startDate } },
            { endDate: { lte: endDate } },
          ],
        },
      ],
    },
  });

  return conflictingBookings.length > 0;
}

/**
 * Calculate total price based on date range and vehicle price per day
 */
function calculateTotalPrice(
  startDate: Date,
  endDate: Date,
  pricePerDay: number,
): number {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return days * pricePerDay;
}

/**
 * Create a new booking with conflict validation
 */
export async function createBooking(data: CreateBookingData) {
  // Get vehicle to calculate price
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: data.vehicleId },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  // Check for conflicts
  const hasConflict = await checkConflicts(
    data.vehicleId,
    data.startDate,
    data.endDate,
  );

  if (hasConflict) {
    throw new Error(
      "Booking conflict: Vehicle is already booked for the selected dates",
    );
  }

  // Calculate total price
  const totalPrice = calculateTotalPrice(
    data.startDate,
    data.endDate,
    vehicle.pricePerDay,
  );

  // Create booking
  return await prisma.booking.create({
    data: {
      renterId: data.renterId,
      vehicleId: data.vehicleId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: BookingStatus.PENDING,
      totalPrice,
    },
    include: {
      vehicle: true,
      renter: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Get all bookings for a renter
 */
export async function getRenterBookings(renterId: string) {
  return await prisma.booking.findMany({
    where: { renterId },
    include: {
      vehicle: {
        include: {
          owner: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      feedback: {
        select: {
          id: true,
          rating: true,
          comment: true,
        },
      },
      payment: {
        select: {
          id: true,
          paymentStatus: true,
          paymentMethod: true,
          amount: true,
          paidAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get all bookings for vehicles owned by a specific owner
 */
export async function getOwnerBookings(ownerId: string) {
  return await prisma.booking.findMany({
    where: {
      vehicle: {
        ownerId,
      },
    },
    include: {
      vehicle: true,
      renter: {
        select: {
          id: true,
          email: true,
        },
      },
      payment: {
        select: {
          id: true,
          paymentStatus: true,
          paymentMethod: true,
          amount: true,
          paidAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Accept a booking request (update status to CONFIRMED)
 * Requires payment to be completed before accepting
 */
export async function acceptBooking(bookingId: string, ownerId: string) {
  // Verify the booking belongs to a vehicle owned by this user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      vehicle: true,
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.vehicle.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this vehicle");
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new Error("Only pending bookings can be accepted");
  }

  // Check if payment is completed
  if (!booking.payment || booking.payment.paymentStatus !== "COMPLETED") {
    throw new Error("Payment must be completed before accepting the booking");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CONFIRMED },
    include: {
      vehicle: true,
      renter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Reject a booking request (update status to REJECTED)
 */
export async function rejectBooking(bookingId: string, ownerId: string) {
  // Verify the booking belongs to a vehicle owned by this user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      vehicle: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.vehicle.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this vehicle");
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new Error("Only pending bookings can be rejected");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.REJECTED },
    include: {
      vehicle: true,
      renter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Complete a booking (update status to COMPLETED)
 * Validates that the end date has passed
 */
export async function completeBooking(bookingId: string, ownerId: string) {
  // Verify the booking belongs to a vehicle owned by this user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      vehicle: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.vehicle.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this vehicle");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("Only confirmed bookings can be completed");
  }

  // Validate end date has passed
  const now = new Date();
  if (booking.endDate > now) {
    throw new Error("Cannot complete booking: End date has not passed yet");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.COMPLETED },
    include: {
      vehicle: true,
      renter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get renter statistics
 * Returns count of active bookings (PENDING + CONFIRMED) and completed rentals
 */
export async function getRenterStats(renterId: string) {
  const [activeBookings, completedRentals] = await Promise.all([
    prisma.booking.count({
      where: {
        renterId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    }),
    prisma.booking.count({
      where: {
        renterId,
        status: BookingStatus.COMPLETED,
      },
    }),
  ]);

  return {
    activeBookings,
    completedRentals,
  };
}
