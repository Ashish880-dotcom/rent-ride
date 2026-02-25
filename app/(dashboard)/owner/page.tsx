"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/core/contexts/ThemeContext";
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
  const { isDark } = useTheme();

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4 py-8">
          <h1
            className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Owner Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
    >
      {/* Hero Section with Background */}
      <div
        className={`relative border-b transition-colors duration-200 ${isDark ? "bg-neutral-950 border-neutral-800" : "bg-gradient-to-r from-green-600 to-green-800 border-green-700"}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: isDark
              ? "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920')"
              : "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl md:text-5xl font-serif mb-3 transition-colors duration-200 ${isDark ? "text-white" : "text-white"}`}
              >
                Owner Dashboard
              </h1>
              <p
                className={`text-lg transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-green-100"}`}
              >
                Manage your vehicles and rental bookings
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={`px-6 py-3 font-medium rounded-lg border transition-all flex items-center gap-2 ${
                isDark
                  ? "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 hover:border-amber-600"
                  : "bg-white hover:bg-green-50 text-green-900 border-green-200 hover:border-green-300"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"}`}
          >
            <h3
              className={`text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-500"}`}
            >
              My Vehicles
            </h3>
            <p
              className={`text-3xl font-bold transition-colors duration-200 ${isDark ? "text-amber-500" : "text-blue-600"}`}
            >
              {stats?.vehicleCount || 0}
            </p>
          </div>

          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-orange-500 shadow-sm"}`}
          >
            <h3
              className={`text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-500"}`}
            >
              Pending Booking Requests
            </h3>
            <p
              className={`text-3xl font-bold transition-colors duration-200 ${isDark ? "text-amber-500" : "text-orange-600"}`}
            >
              {stats?.pendingRequests || 0}
            </p>
          </div>

          <div
            className={`rounded-lg p-6 border transition-colors duration-200 ${isDark ? "bg-neutral-800 border-neutral-700 hover:border-amber-600" : "bg-white border-gray-200 hover:border-green-500 shadow-sm"}`}
          >
            <h3
              className={`text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? "text-neutral-400" : "text-gray-500"}`}
            >
              Active Rentals
            </h3>
            <p
              className={`text-3xl font-bold transition-colors duration-200 ${isDark ? "text-amber-500" : "text-green-600"}`}
            >
              {stats?.activeRentals || 0}
            </p>
          </div>
        </div>

        {/* Pending Requests Alert */}
        {stats && stats.pendingRequests > 0 && (
          <div
            className={`border-l-4 p-4 mb-8 transition-colors duration-200 ${isDark ? "bg-amber-600/10 border-amber-600" : "bg-yellow-50 border-yellow-400"}`}
          >
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className={`h-5 w-5 ${isDark ? "text-amber-500" : "text-yellow-400"}`}
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
                <p
                  className={`text-sm ${isDark ? "text-amber-200" : "text-yellow-700"}`}
                >
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
            href="/owner/kyc"
            className={`block rounded-lg transition-all p-6 ${isDark ? "bg-neutral-800 border border-neutral-700 hover:border-amber-600" : "bg-white shadow hover:shadow-lg"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                KYC Verification
              </h3>
              <svg
                className={`h-8 w-8 ${isDark ? "text-amber-500" : "text-purple-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p
              className={`mb-4 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
            >
              Complete KYC verification to list vehicles.
            </p>
            <div
              className={`font-medium ${isDark ? "text-amber-500" : "text-purple-600"}`}
            >
              Verify Identity →
            </div>
          </Link>

          <Link
            href="/owner/vehicles/new"
            className={`block rounded-lg transition-all p-6 ${isDark ? "bg-neutral-800 border border-neutral-700 hover:border-amber-600" : "bg-white shadow hover:shadow-lg"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Add Vehicle
              </h3>
              <svg
                className={`h-8 w-8 ${isDark ? "text-amber-500" : "text-blue-600"}`}
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
            <p
              className={`mb-4 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
            >
              List a new vehicle for rent on the platform.
            </p>
            <div
              className={`font-medium ${isDark ? "text-amber-500" : "text-blue-600"}`}
            >
              Add New Vehicle →
            </div>
          </Link>

          <Link
            href="/owner/vehicles"
            className={`block rounded-lg transition-all p-6 ${isDark ? "bg-neutral-800 border border-neutral-700 hover:border-amber-600" : "bg-white shadow hover:shadow-lg"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Manage Vehicles
              </h3>
              <svg
                className={`h-8 w-8 ${isDark ? "text-amber-500" : "text-green-600"}`}
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
            <p
              className={`mb-4 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
            >
              View and manage all your listed vehicles.
            </p>
            <div
              className={`font-medium ${isDark ? "text-amber-500" : "text-green-600"}`}
            >
              Go to My Vehicles →
            </div>
          </Link>

          <Link
            href="/owner/bookings"
            className={`block rounded-lg transition-all p-6 ${isDark ? "bg-neutral-800 border border-neutral-700 hover:border-amber-600" : "bg-white shadow hover:shadow-lg"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                View Bookings
              </h3>
              {stats && stats.pendingRequests > 0 && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? "bg-amber-600 text-neutral-900" : "bg-red-500 text-white"}`}
                >
                  {stats.pendingRequests}
                </span>
              )}
            </div>
            <p
              className={`mb-4 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
            >
              Manage booking requests and active rentals.
            </p>
            <div
              className={`font-medium ${isDark ? "text-amber-500" : "text-orange-600"}`}
            >
              Go to Bookings →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
