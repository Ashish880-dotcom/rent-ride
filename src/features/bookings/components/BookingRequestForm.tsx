"use client";

import { useState } from "react";
import { BookingRequestSchema } from "@/core/utils/validation";
import { z } from "zod";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description?: string | null;
  images: string[];
}

interface BookingRequestFormProps {
  vehicle: Vehicle;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookingRequestForm({
  vehicle,
  onSuccess,
  onCancel,
}: BookingRequestFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  // Calculate total price when dates change
  const calculatePrice = (start: string, end: string) => {
    if (!start || !end) {
      setTotalPrice(null);
      return;
    }

    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    if (startDateTime >= endDateTime) {
      setTotalPrice(null);
      return;
    }

    const days = Math.ceil(
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24),
    );
    setTotalPrice(days * vehicle.pricePerDay);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    calculatePrice(value, endDate);
    setError(null);
    setFieldErrors((prev) => ({ ...prev, startDate: undefined }));
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    calculatePrice(startDate, value);
    setError(null);
    setFieldErrors((prev) => ({ ...prev, endDate: undefined }));
  };

  const validateDates = (): boolean => {
    try {
      BookingRequestSchema.parse({
        vehicleId: vehicle.id,
        startDate,
        endDate,
      });
      setFieldErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { startDate?: string; endDate?: string } = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as "startDate" | "endDate";
          if (field === "startDate" || field === "endDate") {
            errors[field] = error.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate dates
    if (!validateDates()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Success
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Get minimum end date (day after start date)
  const minEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : minDate;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Request Booking</h2>

      {/* Vehicle Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-gray-600 mb-2">{vehicle.location}</p>
        <p className="text-xl font-bold text-blue-600">
          ${vehicle.pricePerDay.toFixed(2)} / day
        </p>
        {vehicle.description && (
          <p className="text-gray-700 mt-2">{vehicle.description}</p>
        )}
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={minDate}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.startDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.startDate && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={minEndDate}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.endDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.endDate && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.endDate}</p>
          )}
        </div>

        {/* Total Price Display */}
        {totalPrice !== null && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-2xl font-bold text-blue-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !startDate || !endDate}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
