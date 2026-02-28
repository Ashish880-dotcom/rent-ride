"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/core/contexts/ThemeContext";
import PaymentForm from "@/features/payments/components/PaymentForm";

interface Booking {
  id: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  status: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    images: string[];
  };
  payment?: {
    id: string;
    paymentStatus: string;
    amount: number;
  };
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch booking");
      }

      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    router.push("/renter/bookings");
  };

  const handleCancel = () => {
    router.push("/renter/bookings");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div
              className={`h-8 rounded w-1/4 mb-8 ${isDark ? "bg-neutral-800" : "bg-gray-200"}`}
            ></div>
            <div
              className={`rounded-lg p-6 ${isDark ? "bg-neutral-800" : "bg-white"}`}
            >
              <div
                className={`h-4 rounded w-3/4 mb-4 ${isDark ? "bg-neutral-700" : "bg-gray-200"}`}
              ></div>
              <div
                className={`h-4 rounded w-1/2 ${isDark ? "bg-neutral-700" : "bg-gray-200"}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Booking not found"}
          </div>
          <button
            onClick={() => router.push("/renter/bookings")}
            className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  // Check if payment already completed
  if (booking.payment && booking.payment.paymentStatus === "COMPLETED") {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Payment already completed for this booking.
          </div>
          <button
            onClick={() => router.push("/renter/bookings")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1
          className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Complete Payment
        </h1>

        <PaymentForm
          booking={booking}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
