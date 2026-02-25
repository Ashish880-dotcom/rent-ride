"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  status: "PENDING" | "AWAITING_PAYMENT" | "APPROVED" | "REJECTED";
  images: string[];
}

export default function OwnerVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        setVehicles(data.vehicles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  const getStatusBadge = (status: Vehicle["status"]) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Review",
      },
      AWAITING_PAYMENT: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Awaiting Payment",
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Vehicles</h1>
        <Link
          href="/owner/vehicles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add New Vehicle
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No vehicles yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first vehicle.
          </p>
          <div className="mt-6">
            <Link
              href="/owner/vehicles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add New Vehicle
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950 rounded-xl shadow-2xl hover:shadow-amber-900/50 transition-all overflow-hidden border-2 border-amber-600/30"
            >
              {/* Vehicle Image */}
              <div className="h-48 bg-gray-900 relative">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-900 to-yellow-900">
                    <svg
                      className="h-16 w-16 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(vehicle.status)}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-5 bg-gradient-to-b from-amber-800/90 to-amber-950/90 backdrop-blur-sm">
                <h3 className="text-2xl font-black mb-3 text-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 px-3 py-2 rounded-lg tracking-wide shadow-lg">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-amber-200 text-sm mb-3 flex items-center font-medium">
                  <svg
                    className="inline h-4 w-4 mr-1.5 text-amber-400"
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
                  {vehicle.location}
                </p>
                <p className="text-3xl font-bold text-amber-400 mb-4 drop-shadow-lg">
                  ${vehicle.pricePerDay}/day
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {vehicle.status === "APPROVED" && (
                    <Link
                      href={`/owner/bookings?vehicleId=${vehicle.id}`}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold py-3 px-3 rounded-lg text-center transition-all shadow-lg hover:shadow-green-500/50"
                    >
                      View Bookings
                    </Link>
                  )}
                  {vehicle.status === "PENDING" && (
                    <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-950 text-sm font-bold py-3 px-3 rounded-lg text-center border-2 border-yellow-400 shadow-lg">
                      Under Review
                    </div>
                  )}
                  {vehicle.status === "AWAITING_PAYMENT" && (
                    <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold py-3 px-3 rounded-lg text-center border-2 border-blue-400 shadow-lg">
                      Payment Pending
                    </div>
                  )}
                  {vehicle.status === "REJECTED" && (
                    <div className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold py-3 px-3 rounded-lg text-center border-2 border-red-400 shadow-lg">
                      Rejected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
