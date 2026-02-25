"use client";

import { useEffect, useState } from "react";
import BookingList from "@/features/bookings/components/BookingList";
import { BookingStatus } from "@/generated/prisma";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  images: string[];
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
  renter: Renter;
  createdAt: string | Date;
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/owner");
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

  // Count pending requests
  const pendingCount = bookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
            zIndex: -1,
          }}
        />
        <div
          className="fixed inset-0 bg-neutral-900/90"
          style={{ zIndex: -1 }}
        />

        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
            zIndex: -1,
          }}
        />
        <div
          className="fixed inset-0 bg-neutral-900/90"
          style={{ zIndex: -1 }}
        />

        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
          zIndex: -1,
        }}
      />
      <div className="fixed inset-0 bg-neutral-900/90" style={{ zIndex: -1 }} />
      
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
        <p className="text-gray-600">
          Manage booking requests and active rentals for your vehicles
        </p>
      </div>

      {/* Pending Requests Alert */}
      {pendingCount > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have{" "}
                <span className="font-medium">
                  {pendingCount} pending booking request
                  {pendingCount > 1 ? "s" : ""}
                </span>{" "}
                requiring your attention. Review and respond to booking requests
                below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking List */}
      <BookingList
        bookings={bookings}
        isOwner={true}
        onRefresh={fetchBookings}
      />
    </div>
  );
}
