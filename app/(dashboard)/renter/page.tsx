"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCardSkeleton } from "@/core/components/SkeletonLoader";

interface RenterStats {
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
}

export default function RenterDashboard() {
  const [stats, setStats] = useState<RenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/bookings/renter");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();

        // Calculate stats from bookings
        const activeBookings = data.filter(
          (b: any) => b.status === "ACCEPTED",
        ).length;
        const completedBookings = data.filter(
          (b: any) => b.status === "COMPLETED",
        ).length;
        const pendingBookings = data.filter(
          (b: any) => b.status === "PENDING",
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Renter Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
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
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Renter Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Active Bookings
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.activeBookings || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.pendingBookings || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Completed Bookings
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.completedBookings || 0}
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Link
          href="/renter/vehicles"
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Browse Vehicles</h3>
            <svg
              className="h-8 w-8 text-blue-600"
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
          <p className="text-gray-600 mb-4">
            Search and book vehicles available for rent.
          </p>
          <div className="text-blue-600 font-medium">Browse Vehicles →</div>
        </Link>

        <Link
          href="/renter/bookings"
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Bookings</h3>
            {stats && stats.pendingBookings > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingBookings}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            View and manage your booking requests and rentals.
          </p>
          <div className="text-green-600 font-medium">Go to My Bookings →</div>
        </Link>
      </div>
    </div>
  );
}
