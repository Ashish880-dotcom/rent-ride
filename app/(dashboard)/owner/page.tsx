"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCardSkeleton } from "@/core/components/SkeletonLoader";

interface OwnerStats {
  vehicleCount: number;
  pendingRequests: number;
  activeRentals: number;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/owner/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStats(data);
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
        <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>
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
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Owner Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            My Vehicles
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.vehicleCount || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Pending Booking Requests
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.pendingRequests || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Active Rentals
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.activeRentals || 0}
          </p>
        </div>
      </div>

      {/* Pending Requests Alert */}
      {stats && stats.pendingRequests > 0 && (
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
                  {stats.pendingRequests} pending booking request
                  {stats.pendingRequests > 1 ? "s" : ""}
                </span>{" "}
                requiring your attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Link
          href="/owner/vehicles/new"
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Add Vehicle</h3>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            List a new vehicle for rent on the platform.
          </p>
          <div className="text-blue-600 font-medium">Add New Vehicle →</div>
        </Link>

        <Link
          href="/owner/vehicles"
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Manage Vehicles</h3>
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            View and manage all your listed vehicles.
          </p>
          <div className="text-green-600 font-medium">Go to My Vehicles →</div>
        </Link>

        <Link
          href="/owner/bookings"
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">View Bookings</h3>
            {stats && stats.pendingRequests > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingRequests}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            Manage booking requests and active rentals.
          </p>
          <div className="text-orange-600 font-medium">Go to Bookings →</div>
        </Link>
      </div>
    </div>
  );
}
