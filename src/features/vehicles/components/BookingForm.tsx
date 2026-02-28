"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  vehicleId: string;
}

export default function BookingForm({ vehicleId }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        setLoading(false);
        return;
      }

      if (new Date(startDate) >= new Date(endDate)) {
        setError("End date must be after start date");
        setLoading(false);
        return;
      }

      // Create booking
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const booking = await response.json();
      router.push(`/renter/bookings/${booking.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-neutral-400 text-sm font-medium mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-neutral-400 text-sm font-medium mb-2">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          min={startDate || new Date().toISOString().split("T")[0]}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-600 text-neutral-900 font-bold text-lg rounded-lg transition-colors uppercase tracking-wide disabled:cursor-not-allowed"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}
