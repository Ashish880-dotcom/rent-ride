"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

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

interface Payment {
  id: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  paidAt?: string;
}

interface Booking {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  vehicle: Vehicle;
  createdAt: string;
  payment?: Payment;
}

export default function RenterBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "confirmed" | "completed"
  >("all");

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      case "COMPLETED":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      case "REJECTED":
        return "bg-red-600/20 text-red-400 border-red-600/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-600/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      case "PROCESSING":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      case "FAILED":
        return "bg-red-600/20 text-red-400 border-red-600/30";
      case "REFUNDED":
        return "bg-purple-600/20 text-purple-400 border-purple-600/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-600/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "PENDING":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "REJECTED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab.toUpperCase();
  });

  // Count bookings by status
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-neutral-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-800 rounded-lg p-6 h-64"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
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

      {/* Hero Section */}
      <div className="relative bg-neutral-950 border-b border-neutral-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">
                My Bookings
              </h1>
              <p className="text-neutral-400 text-lg">
                Track and manage all your vehicle rentals
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg border border-neutral-700 hover:border-amber-600 transition-all flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm uppercase tracking-wide mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm uppercase tracking-wide mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-white">
                  {confirmedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm uppercase tracking-wide mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-white">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Alert */}
        {pendingCount > 0 && (
          <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-amber-500"
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
              <div>
                <h3 className="text-amber-500 font-semibold mb-1">
                  Pending Approval
                </h3>
                <p className="text-neutral-300 text-sm">
                  You have{" "}
                  <span className="font-medium text-white">
                    {pendingCount} booking{pendingCount > 1 ? "s" : ""}
                  </span>{" "}
                  waiting for owner approval. You'll be notified once they
                  respond.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "bg-amber-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700"
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-amber-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "confirmed"
                ? "bg-amber-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700"
            }`}
          >
            Active ({confirmedCount})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-amber-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-neutral-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">
              No {activeTab !== "all" ? activeTab : ""} Bookings
            </h3>
            <p className="text-neutral-400 mb-6">
              {activeTab === "all"
                ? "You haven't made any bookings yet. Start exploring our vehicle collection!"
                : `You don't have any ${activeTab} bookings at the moment.`}
            </p>
            <Link
              href="/renter/vehicles"
              className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Vehicles
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all"
              >
                {/* Vehicle Image */}
                <div className="relative h-48 bg-neutral-900">
                  {booking.vehicle.images.length > 0 ? (
                    <img
                      src={booking.vehicle.images[0]}
                      alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-neutral-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {booking.vehicle.year} {booking.vehicle.make}{" "}
                    {booking.vehicle.model}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{booking.vehicle.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                      <span className="text-sm text-neutral-400">
                        Total Price
                      </span>
                      <span className="text-xl font-bold text-amber-500">
                        Rs.{booking.totalPrice}
                      </span>
                    </div>

                    {/* Payment Status */}
                    {booking.payment && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-neutral-400">
                          Payment
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.payment.paymentStatus)}`}
                        >
                          {booking.payment.paymentStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Pay Now Button - Show if booking is pending and no payment or payment is pending/failed */}
                    {booking.status === "PENDING" &&
                      (!booking.payment ||
                        booking.payment.paymentStatus === "PENDING" ||
                        booking.payment.paymentStatus === "FAILED") && (
                        <Link
                          href={`/renter/bookings/${booking.id}/payment`}
                          className="block w-full text-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                        >
                          {booking.payment?.paymentStatus === "FAILED"
                            ? "Retry Payment"
                            : "Pay Now"}
                        </Link>
                      )}

                    <Link
                      href={`/renter/vehicles/${booking.vehicleId}`}
                      className="block w-full text-center px-4 py-2 bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 hover:border-amber-600 transition-all"
                    >
                      View Vehicle Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
