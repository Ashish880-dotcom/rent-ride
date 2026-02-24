"use client";

import { useEffect, useState } from "react";
import BookingList from "@/features/bookings/components/BookingList";
import FeedbackForm from "@/features/bookings/components/FeedbackForm";
import { BookingStatus } from "@/generated/prisma";

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

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: BookingStatus;
  totalPrice: number;
  vehicle: Vehicle;
  createdAt: string | Date;
  feedback?: {
    id: string;
    rating: number;
    comment: string | null;
  };
}

export default function RenterBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState<
    string | null
  >(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/renter");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data.bookings || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Count active bookings (pending + confirmed)
  const activeCount = bookings.filter(
    (b) =>
      b.status === BookingStatus.PENDING ||
      b.status === BookingStatus.CONFIRMED,
  ).length;

  // Get completed bookings without feedback
  const completedWithoutFeedback = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED && !b.feedback,
  );

  const handleFeedbackSuccess = () => {
    setSelectedBookingForFeedback(null);
    fetchBookings(); // Refresh to update feedback status
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600">
          View and manage your vehicle rental bookings
        </p>
      </div>

      {/* Active Bookings Info */}
      {activeCount > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You have{" "}
                <span className="font-medium">
                  {activeCount} active booking{activeCount > 1 ? "s" : ""}
                </span>
                . Check the status of your pending and confirmed rentals below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Reminder */}
      {completedWithoutFeedback.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                You have{" "}
                <span className="font-medium">
                  {completedWithoutFeedback.length} completed rental
                  {completedWithoutFeedback.length > 1 ? "s" : ""}
                </span>{" "}
                waiting for your feedback. Share your experience to help other
                renters!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking List */}
      <BookingList
        bookings={bookings}
        isOwner={false}
        onRefresh={fetchBookings}
      />

      {/* Feedback Section for Completed Bookings */}
      {completedWithoutFeedback.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Leave Feedback</h2>
          <div className="space-y-6">
            {completedWithoutFeedback.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {booking.vehicle.year} {booking.vehicle.make}{" "}
                    {booking.vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Rental completed on{" "}
                    {new Date(booking.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <FeedbackForm
                  bookingId={booking.id}
                  bookingStatus={booking.status}
                  onSuccess={handleFeedbackSuccess}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Bookings with Feedback */}
      {bookings.some(
        (b) => b.status === BookingStatus.COMPLETED && b.feedback,
      ) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">
            Your Feedback History
          </h2>
          <div className="space-y-4">
            {bookings
              .filter((b) => b.status === BookingStatus.COMPLETED && b.feedback)
              .map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {booking.vehicle.year} {booking.vehicle.make}{" "}
                        {booking.vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl mr-1">★</span>
                      <span className="font-bold text-lg">
                        {booking.feedback?.rating}
                      </span>
                    </div>
                  </div>
                  {booking.feedback?.comment && (
                    <p className="text-gray-700 italic">
                      "{booking.feedback.comment}"
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
