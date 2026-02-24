"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface RenterStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalSpent: number;
}

export default function RenterProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<RenterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRenterStats();
  }, []);

  const fetchRenterStats = async () => {
    try {
      const response = await fetch("/api/bookings/renter");
      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];

        // Calculate statistics
        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(
          (b: any) => b.status === "CONFIRMED",
        ).length;
        const completedBookings = bookings.filter(
          (b: any) => b.status === "COMPLETED",
        ).length;
        const pendingBookings = bookings.filter(
          (b: any) => b.status === "PENDING",
        ).length;
        const totalSpent = bookings
          .filter((b: any) => b.status === "COMPLETED")
          .reduce((sum: number, b: any) => sum + b.totalPrice, 0);

        setStats({
          totalBookings,
          activeBookings,
          completedBookings,
          pendingBookings,
          totalSpent,
        });
      }
    } catch (error) {
      console.error("Error fetching renter stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-neutral-800 rounded w-1/4 mb-8"></div>
            <div className="bg-neutral-800 rounded-lg p-6 space-y-4">
              <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
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
                My Profile
              </h1>
              <p className="text-neutral-400 text-lg">
                Manage your account and rental preferences
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Account Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-serif text-white">
                  Account Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-white">{session?.user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">
                    Account Type
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-600/20 text-amber-400 border border-amber-600/30">
                    Vehicle Renter
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">
                    Member Since
                  </label>
                  <p className="text-white">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Statistics */}
            <div className="bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-serif text-white">
                  Rental Statistics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-500"
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
                        <p className="text-2xl font-bold text-white">
                          {stats?.totalBookings || 0}
                        </p>
                        <p className="text-sm text-neutral-400">
                          Total Bookings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-500"
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
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {stats?.activeBookings || 0}
                        </p>
                        <p className="text-sm text-neutral-400">
                          Active Rentals
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-500"
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
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {stats?.completedBookings || 0}
                        </p>
                        <p className="text-sm text-neutral-400">Completed</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          ${stats?.totalSpent.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-sm text-neutral-400">Total Spent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {stats?.pendingBookings && stats.pendingBookings > 0 && (
                  <div className="mt-6 bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-amber-400 font-medium">
                          You have {stats.pendingBookings} booking
                          {stats.pendingBookings > 1 ? "s" : ""} pending
                          approval
                        </p>
                        <Link
                          href="/renter"
                          className="text-sm text-amber-500 hover:text-amber-400 underline mt-1 inline-block"
                        >
                          View pending bookings →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-serif text-white">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/renter/vehicles"
                  className="group flex items-center p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-amber-600 transition-all"
                >
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-500"
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
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-white">
                      Browse Vehicles
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Find your next ride
                    </p>
                  </div>
                </Link>

                <Link
                  href="/renter/bookings"
                  className="group flex items-center p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-amber-600 transition-all"
                >
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-500"
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
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-white">
                      My Bookings
                    </h3>
                    <p className="text-sm text-neutral-400">
                      View all bookings
                    </p>
                  </div>
                </Link>

                <Link
                  href="/renter"
                  className="group flex items-center p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-amber-600 transition-all"
                >
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-white">
                      Dashboard
                    </h3>
                    <p className="text-sm text-neutral-400">View your stats</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="p-6 border-b border-neutral-700">
                <h2 className="text-xl font-serif text-white">
                  Account Status
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Account Active
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Your account is in good standing and ready to book
                      vehicles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
