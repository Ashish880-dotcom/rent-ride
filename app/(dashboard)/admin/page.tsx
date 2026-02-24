"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface AdminStats {
  pendingKYC: number;
  pendingVehicles: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
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
      <div className="min-h-screen bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-neutral-800 rounded w-1/4 mb-8"></div>
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
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section with Background */}
      <div className="relative bg-neutral-950 border-b border-neutral-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">
                Admin Dashboard
              </h1>
              <p className="text-neutral-400 text-lg">
                Manage your platform with complete control
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
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-amber-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                Pending KYC
              </h3>
              <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {stats?.pendingKYC || 0}
            </p>
            <p className="text-neutral-500 text-sm">
              Submissions awaiting review
            </p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-amber-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                Pending Vehicles
              </h3>
              <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {stats?.pendingVehicles || 0}
            </p>
            <p className="text-neutral-500 text-sm">
              Listings awaiting approval
            </p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-amber-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                Total Users
              </h3>
              <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {stats?.totalUsers || 0}
            </p>
            <p className="text-neutral-500 text-sm">Registered on platform</p>
          </div>
        </div>

        {/* Pending Items Alert */}
        {stats && (stats.pendingKYC > 0 || stats.pendingVehicles > 0) && (
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
                  Action Required
                </h3>
                <p className="text-neutral-300 text-sm">
                  You have{" "}
                  {stats.pendingKYC > 0 && (
                    <span className="font-medium text-white">
                      {stats.pendingKYC} pending KYC submission
                      {stats.pendingKYC > 1 ? "s" : ""}
                    </span>
                  )}
                  {stats.pendingKYC > 0 && stats.pendingVehicles > 0 && " and "}
                  {stats.pendingVehicles > 0 && (
                    <span className="font-medium text-white">
                      {stats.pendingVehicles} pending vehicle
                      {stats.pendingVehicles > 1 ? "s" : ""}
                    </span>
                  )}{" "}
                  requiring your attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/kyc"
            className="group relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800')",
              }}
            />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-white">KYC Review</h3>
                {stats && stats.pendingKYC > 0 && (
                  <span className="bg-amber-600 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
                    {stats.pendingKYC}
                  </span>
                )}
              </div>
              <p className="text-neutral-400 mb-6">
                Review and approve pending KYC submissions from users.
              </p>
              <div className="flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                Go to KYC Review
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
              </div>
            </div>
          </Link>

          <Link
            href="/admin/vehicles"
            className="group relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800')",
              }}
            />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-white">
                  Vehicle Review
                </h3>
                {stats && stats.pendingVehicles > 0 && (
                  <span className="bg-amber-600 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
                    {stats.pendingVehicles}
                  </span>
                )}
              </div>
              <p className="text-neutral-400 mb-6">
                Review vehicle listings and confirm payments.
              </p>
              <div className="flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                Go to Vehicle Review
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="group relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800')",
              }}
            />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-white">
                  User Management
                </h3>
              </div>
              <p className="text-neutral-400 mb-6">
                View and manage all registered users on the platform.
              </p>
              <div className="flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                Go to User Management
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
