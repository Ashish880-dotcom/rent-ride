"use client";

import { useState, useEffect } from "react";

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

export function VehicleReviewPanel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      setLoading(true);
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

      // Combine both lists
      const allVehicles = [
        ...(pendingData.vehicles || []),
        ...(awaitingPaymentData.vehicles || []),
      ];

      setVehicles(allVehicles);
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
      await fetchPendingVehicles();
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
      await fetchPendingVehicles();
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
      await fetchPendingVehicles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading pending vehicles...</div>
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

  if (vehicles.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          No vehicles pending review or awaiting payment confirmation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vehicle Review Panel</h2>

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
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
                    <h3 className="text-xl font-bold">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">
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
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per Day</p>
                    <p className="font-medium text-blue-600">
                      ${vehicle.pricePerDay.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{vehicle.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm">{vehicle.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  {vehicle.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAcceptForPayment(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
