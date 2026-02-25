"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/core/contexts/ThemeContext";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description?: string | null;
  images: string[];
  status: string;
  owner: {
    id: string;
    email: string;
  };
  createdAt: string;
}

type ViewMode = "pending" | "all";

export function VehicleReviewPanel() {
  const { isDark } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("pending");

  useEffect(() => {
    fetchVehicles();
  }, [viewMode]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      if (viewMode === "pending") {
        // Fetch both PENDING and AWAITING_PAYMENT vehicles
        const [pendingResponse, awaitingPaymentResponse] = await Promise.all([
          fetch("/api/vehicles?status=PENDING"),
          fetch("/api/vehicles?status=AWAITING_PAYMENT"),
        ]);

        if (!pendingResponse.ok || !awaitingPaymentResponse.ok) {
          throw new Error("Failed to fetch vehicles for review");
        }

        const pendingData = await pendingResponse.json();
        const awaitingPaymentData = await awaitingPaymentResponse.json();

        // Combine both lists and remove duplicates
        const allVehicles = [
          ...(pendingData.vehicles || []),
          ...(awaitingPaymentData.vehicles || []),
        ];

        // Remove duplicates by ID
        const uniqueVehicles = allVehicles.filter(
          (vehicle, index, self) =>
            index === self.findIndex((v) => v.id === vehicle.id),
        );

        setVehicles(uniqueVehicles);
      } else {
        // Fetch all vehicles
        const response = await fetch("/api/vehicles");

        if (!response.ok) {
          throw new Error("Failed to fetch all vehicles");
        }

        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptForPayment = async (vehicleId: string) => {
    try {
      setActionLoading(vehicleId);
      const response = await fetch(
        `/api/vehicles/${vehicleId}/accept-payment`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to accept vehicle for payment");
      }

      // Refresh the list
      await fetchVehicles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmPayment = async (vehicleId: string) => {
    try {
      setActionLoading(vehicleId);
      const response = await fetch(
        `/api/vehicles/${vehicleId}/confirm-payment`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to confirm payment");
      }

      // Refresh the list
      await fetchVehicles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to reject this vehicle?")) {
      return;
    }

    try {
      setActionLoading(vehicleId);
      const response = await fetch(`/api/vehicles/${vehicleId}/reject`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject vehicle");
      }

      // Refresh the list
      await fetchVehicles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this vehicle? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setActionLoading(vehicleId);
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete vehicle");
      }

      // Refresh the list
      await fetchVehicles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div
          className={`text-lg ${isDark ? "text-neutral-400" : "text-gray-600"}`}
        >
          Loading vehicles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Vehicle Management
        </h2>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("pending")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === "pending"
                ? `${isDark ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`
                : `${isDark ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === "all"
                ? `${isDark ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`
                : `${isDark ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
            }`}
          >
            All Vehicles
          </button>
        </div>
      </div>

      {vehicles.length === 0 && (
        <div
          className={`p-8 rounded-lg shadow-md text-center ${isDark ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}
        >
          <p className={isDark ? "text-neutral-400" : "text-gray-600"}>
            {viewMode === "pending"
              ? "No vehicles pending review or awaiting payment confirmation."
              : "No vehicles found in the system."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {vehicles.map((vehicle, index) => (
          <div
            key={`${vehicle.id}-${index}`}
            className={`p-6 rounded-lg shadow-md border ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vehicle Images */}
              <div>
                {vehicle.images.length > 0 && (
                  <div className="space-y-2">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    {vehicle.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {vehicle.images.slice(1, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${vehicle.make} ${vehicle.model} ${index + 2}`}
                            className="w-full h-20 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Owner: {vehicle.owner.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : vehicle.status === "AWAITING_PAYMENT"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Year
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {vehicle.year}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Price per Day
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-amber-500" : "text-blue-600"}`}
                    >
                      Rs.{vehicle.pricePerDay.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Location
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {vehicle.location}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Submitted
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mb-4">
                    <p
                      className={`text-sm mb-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
                    >
                      Description
                    </p>
                    <p
                      className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-900"}`}
                    >
                      {vehicle.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 flex-wrap">
                  {vehicle.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAcceptForPayment(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                        className={`px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed ${isDark ? "bg-amber-600 hover:bg-amber-700 text-white disabled:bg-neutral-700 disabled:text-neutral-500" : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"}`}
                      >
                        {actionLoading === vehicle.id
                          ? "Processing..."
                          : "Accept for Payment"}
                      </button>
                      <button
                        onClick={() => handleReject(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {actionLoading === vehicle.id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </>
                  )}

                  {vehicle.status === "AWAITING_PAYMENT" && (
                    <>
                      <button
                        onClick={() => handleConfirmPayment(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {actionLoading === vehicle.id
                          ? "Processing..."
                          : "Confirm Payment & Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {actionLoading === vehicle.id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </>
                  )}

                  {/* Delete button available for all vehicles in "All Vehicles" view */}
                  {viewMode === "all" && (
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      disabled={actionLoading === vehicle.id}
                      className={`px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed ${isDark ? "bg-neutral-700 hover:bg-neutral-600 text-white disabled:bg-neutral-800 disabled:text-neutral-600" : "bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-400"}`}
                    >
                      {actionLoading === vehicle.id
                        ? "Deleting..."
                        : "Delete Vehicle"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
