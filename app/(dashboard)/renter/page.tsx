"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/core/contexts/ThemeContext";

interface Booking {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  vehicle: {
    make: string;
    model: string;
    year: number;
    images: string[];
    pricePerDay: number;
  };
}

interface RenterStats {
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
}

export default function RenterDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<RenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch("/api/bookings/renter");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();

      // API returns { bookings, groupedBookings }
      const bookingsArray = data.bookings || [];
      setBookings(bookingsArray);

      // Calculate stats from bookings
      const activeBookings = bookingsArray.filter(
        (b: Booking) => b.status === "CONFIRMED",
      ).length;
      const completedBookings = bookingsArray.filter(
        (b: Booking) => b.status === "COMPLETED",
      ).length;
      const pendingBookings = bookingsArray.filter(
        (b: Booking) => b.status === "PENDING",
      ).length;

      setStats({
        activeBookings,
        completedBookings,
        pendingBookings,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
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
        <div
          className={`fixed inset-0 ${isDark ? "bg-neutral-900/90" : "bg-white/60"}`}
          style={{ zIndex: -1 }}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div
              className={`h-10 rounded w-1/4 mb-8 ${isDark ? "bg-neutral-800" : "bg-gray-200"}`}
            ></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-800 rounded-lg p-6 h-32"
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
          className={`fixed inset-0 ${isDark ? "bg-neutral-900/90" : "bg-white/60"}`}
          style={{ zIndex: -1 }}
        />

        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const activeRentals = bookings.filter((b) => b.status === "CONFIRMED");
  const pendingRequests = bookings.filter((b) => b.status === "PENDING");
  const completedRentals = bookings.filter((b) => b.status === "COMPLETED");

  return (
    <div className="min-h-screen relative">
      {/* Background Image for Entire Page */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
          zIndex: -1,
        }}
      />
      <div
        className={`fixed inset-0 ${isDark ? "bg-neutral-900/90" : "bg-white/60"}`}
        style={{ zIndex: -1 }}
      />

      {/* Hero Section with Background */}
      <div
        className={`relative border-b ${isDark ? "border-neutral-800" : "border-gray-200"}`}
      >
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl md:text-5xl font-serif mb-3 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Renter Dashboard
              </h1>
              <p
                className={`text-lg transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                Manage your vehicle rentals and bookings
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={`px-6 py-3 font-medium rounded-lg border transition-all flex items-center gap-2 ${
                isDark
                  ? "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 hover:border-amber-600"
                  : "bg-white hover:bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-300"
              }`}
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
          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                Active Rentals
              </h3>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? "bg-amber-600/10" : "bg-green-100"}`}
              >
                <svg
                  className={`w-6 h-6 ${isDark ? "text-amber-500" : "text-green-600"}`}
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
            <p
              className={`text-4xl font-bold mb-2 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {stats?.activeBookings || 0}
            </p>
            <p
              className={`text-sm transition-colors duration-200 ${isDark ? "text-neutral-500" : "text-gray-600"}`}
            >
              Currently renting
            </p>
          </div>

          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                Pending Approval
              </h3>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? "bg-amber-600/10" : "bg-yellow-100"}`}
              >
                <svg
                  className={`w-6 h-6 ${isDark ? "text-amber-500" : "text-yellow-600"}`}
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
            <p
              className={`text-4xl font-bold mb-2 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {stats?.pendingBookings || 0}
            </p>
            <p
              className={`text-sm transition-colors duration-200 ${isDark ? "text-neutral-500" : "text-gray-600"}`}
            >
              Awaiting owner response
            </p>
          </div>

          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                Completed
              </h3>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? "bg-amber-600/10" : "bg-blue-100"}`}
              >
                <svg
                  className={`w-6 h-6 ${isDark ? "text-amber-500" : "text-blue-600"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p
              className={`text-4xl font-bold mb-2 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {stats?.completedBookings || 0}
            </p>
            <p
              className={`text-sm transition-colors duration-200 ${isDark ? "text-neutral-500" : "text-gray-600"}`}
            >
              Past rentals
            </p>
          </div>
        </div>

        {/* Active Rentals Section */}
        {activeRentals.length > 0 && (
          <div className="mb-8">
            <h2
              className={`text-2xl font-serif mb-4 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Active Rentals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRentals.map((booking) => (
                <div
                  key={booking.id}
                  className={`rounded-lg overflow-hidden border transition-all ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"}`}
                >
                  <div className="flex">
                    <div className="w-32 h-32 bg-neutral-900 shrink-0">
                      {booking.vehicle.images.length > 0 ? (
                        <img
                          src={booking.vehicle.images[0]}
                          alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-neutral-600"
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
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">
                          {booking.vehicle.year} {booking.vehicle.make}{" "}
                          {booking.vehicle.model}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div
                        className={`space-y-1 text-sm mb-3 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                      >
                        <p>
                          <span
                            className={`font-medium ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                          >
                            From:
                          </span>{" "}
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span
                            className={`font-medium ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                          >
                            To:
                          </span>{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p
                          className={`text-lg font-bold ${isDark ? "text-amber-500" : "text-blue-600"}`}
                        >
                          Rs.{booking.totalPrice}
                        </p>
                      </div>
                      <Link
                        href={`/renter/bookings`}
                        className={`text-sm font-medium ${isDark ? "text-amber-500 hover:text-amber-400" : "text-blue-600 hover:text-blue-700"}`}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-white mb-4">
              Pending Approval
            </h2>
            <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-6 mb-4">
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
                    Awaiting Approval
                  </h3>
                  <p className="text-neutral-300 text-sm">
                    You have {pendingRequests.length} booking request
                    {pendingRequests.length > 1 ? "s" : ""} waiting for owner
                    approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingRequests.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
                >
                  <div className="flex">
                    <div className="w-32 h-32 bg-neutral-900 shrink-0">
                      {booking.vehicle.images.length > 0 ? (
                        <img
                          src={booking.vehicle.images[0]}
                          alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-neutral-600"
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
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">
                          {booking.vehicle.year} {booking.vehicle.make}{" "}
                          {booking.vehicle.model}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-neutral-400 mb-3">
                        <p>
                          <span className="font-medium text-neutral-300">
                            From:
                          </span>{" "}
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-300">
                            To:
                          </span>{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-bold text-white">
                          Rs.{booking.totalPrice}
                        </p>
                      </div>
                      <Link
                        href={`/renter/bookings`}
                        className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Demand Vehicles Alert */}
        {bookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-white mb-4">
              High Demand Alert
            </h2>
            <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-500 mb-2">
                    Popular Vehicles in Short Supply
                  </h3>
                  <p className="text-sm text-neutral-300 mb-3">
                    Some vehicles you've rented are in high demand. Book early
                    to secure your preferred dates for future rentals.
                  </p>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(
                        bookings.map(
                          (b) =>
                            `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`,
                        ),
                      ),
                    )
                      .slice(0, 3)
                      .map((vehicleName, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-neutral-200"
                        >
                          <svg
                            className="w-4 h-4 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">{vehicleName}</span>
                          <span className="text-neutral-400">
                            - Frequently booked
                          </span>
                        </div>
                      ))}
                  </div>
                  <Link
                    href="/renter/vehicles"
                    className="inline-flex items-center mt-4 text-sm font-medium text-amber-500 hover:text-amber-400"
                  >
                    Browse similar vehicles
                    <svg
                      className="w-4 h-4 ml-1"
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
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div
            className={`rounded-lg border p-12 text-center transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <svg
              className={`mx-auto h-16 w-16 mb-4 transition-colors duration-200 ${isDark ? "text-neutral-600" : "text-gray-400"}`}
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
            <h3
              className={`text-lg font-semibold mb-2 transition-colors duration-200 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              No Bookings Yet
            </h3>
            <p
              className={`mb-6 transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
            >
              Start exploring our vehicle collection and make your first
              booking!
            </p>
            <Link
              href="/renter/vehicles"
              className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${isDark ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
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
        )}

        {/* Quick Actions */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Link
              href="/renter/vehicles"
              className="group relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800')",
                }}
              />
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Browse More Vehicles
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Explore our vehicle collection
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/renter/bookings"
              className="group relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800')",
                }}
              />
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      View All Bookings
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Manage your rental history
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
