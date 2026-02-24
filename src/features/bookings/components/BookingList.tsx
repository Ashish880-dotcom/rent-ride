"use client";

import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import { BookingStatus } from "@/generated/prisma";
import { useToast } from "@/core/components/Toast";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  images: string[];
  owner?: {
    id: string;
    email: string;
  };
}

interface Renter {
  id: string;
  email: string;
}

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: BookingStatus;
  totalPrice: number;
  vehicle: Vehicle;
  renter?: Renter;
  createdAt: string | Date;
}

interface BookingListProps {
  bookings: Booking[];
  isOwner?: boolean;
  onRefresh?: () => void;
}

export default function BookingList({
  bookings,
  isOwner = false,
  onRefresh,
}: BookingListProps) {
  const { showToast } = useToast();
  const [optimisticBookings, setOptimisticBookings] =
    useState<Booking[]>(bookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update optimistic bookings when bookings prop changes
  useEffect(() => {
    setOptimisticBookings(bookings);
  }, [bookings]);

  // Group bookings by status
  const groupedBookings = {
    pending: optimisticBookings.filter(
      (b) => b.status === BookingStatus.PENDING,
    ),
    confirmed: optimisticBookings.filter(
      (b) => b.status === BookingStatus.CONFIRMED,
    ),
    completed: optimisticBookings.filter(
      (b) => b.status === BookingStatus.COMPLETED,
    ),
    rejected: optimisticBookings.filter(
      (b) => b.status === BookingStatus.REJECTED,
    ),
  };

  const handleAction = async (
    bookingId: string,
    action: "accept" | "reject" | "complete",
  ) => {
    setLoading(true);
    setError(null);

    // Optimistic update
    const newStatus =
      action === "accept"
        ? BookingStatus.CONFIRMED
        : action === "reject"
          ? BookingStatus.REJECTED
          : BookingStatus.COMPLETED;

    const previousBookings = [...optimisticBookings];
    setOptimisticBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
    );

    try {
      const response = await fetch(`/api/bookings/${bookingId}/${action}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} booking`);
      }

      // Show success toast
      const actionText =
        action === "accept"
          ? "accepted"
          : action === "reject"
            ? "rejected"
            : "completed";
      showToast(`Booking ${actionText} successfully!`, "success");

      // Refresh the list to get server state
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticBookings(previousBookings);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderBookingGroup = (
    title: string,
    bookings: Booking[],
    statusColor: string,
  ) => {
    if (bookings.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${statusColor}`}>
          {title} ({bookings.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isOwner={isOwner}
              onAccept={(id) => handleAction(id, "accept")}
              onReject={(id) => handleAction(id, "reject")}
              onComplete={(id) => handleAction(id, "complete")}
              loading={loading}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {optimisticBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookings found</p>
          <p className="text-gray-400 text-sm mt-2">
            {isOwner
              ? "Bookings for your vehicles will appear here"
              : "Your booking requests will appear here"}
          </p>
        </div>
      )}

      {/* Pending Bookings */}
      {renderBookingGroup(
        "Pending Bookings",
        groupedBookings.pending,
        "text-yellow-600",
      )}

      {/* Confirmed Bookings */}
      {renderBookingGroup(
        "Confirmed Bookings",
        groupedBookings.confirmed,
        "text-green-600",
      )}

      {/* Completed Bookings */}
      {renderBookingGroup(
        "Completed Bookings",
        groupedBookings.completed,
        "text-blue-600",
      )}

      {/* Rejected Bookings */}
      {renderBookingGroup(
        "Rejected Bookings",
        groupedBookings.rejected,
        "text-red-600",
      )}
    </div>
  );
}
