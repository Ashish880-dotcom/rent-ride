"use client";

import { useState } from "react";
import { BookingStatus } from "@/generated/prisma";
import { ConfirmModal } from "@/core/components/Modal";
import { useTheme } from "@/core/contexts/ThemeContext";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  images: string[];
  owner?: {
    id: string;
    email: string;
  };
}

interface Renter {
  id: string;
  email: string;
}

interface Payment {
  id: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  paidAt?: string;
}

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: BookingStatus;
  totalPrice: number;
  vehicle: Vehicle;
  renter?: Renter;
  createdAt: string | Date;
  payment?: Payment;
}

interface BookingCardProps {
  booking: Booking;
  isOwner?: boolean;
  onAccept?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  loading?: boolean;
}

export default function BookingCard({
  booking,
  isOwner = false,
  onAccept,
  onReject,
  onComplete,
  loading = false,
}: BookingCardProps) {
  const { isDark } = useTheme();
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const now = new Date();
  const canComplete =
    booking.status === BookingStatus.CONFIRMED && endDate < now;

  const getStatusColor = (status: BookingStatus) => {
    const baseClasses = isDark
      ? {
          PENDING:
            "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
          CONFIRMED:
            "bg-green-600/20 text-green-400 border border-green-600/30",
          COMPLETED: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
          REJECTED: "bg-red-600/20 text-red-400 border border-red-600/30",
          default:
            "bg-neutral-600/20 text-neutral-400 border border-neutral-600/30",
        }
      : {
          PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          CONFIRMED: "bg-green-100 text-green-800 border border-green-200",
          COMPLETED: "bg-blue-100 text-blue-800 border border-blue-200",
          REJECTED: "bg-red-100 text-red-800 border border-red-200",
          default: "bg-gray-100 text-gray-800 border border-gray-200",
        };

    switch (status) {
      case BookingStatus.PENDING:
        return baseClasses.PENDING;
      case BookingStatus.CONFIRMED:
        return baseClasses.CONFIRMED;
      case BookingStatus.COMPLETED:
        return baseClasses.COMPLETED;
      case BookingStatus.REJECTED:
        return baseClasses.REJECTED;
      default:
        return baseClasses.default;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const baseClasses = isDark
      ? {
          COMPLETED:
            "bg-green-600/20 text-green-400 border border-green-600/30",
          PENDING:
            "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
          PROCESSING: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
          FAILED: "bg-red-600/20 text-red-400 border border-red-600/30",
          REFUNDED:
            "bg-purple-600/20 text-purple-400 border border-purple-600/30",
          default:
            "bg-neutral-600/20 text-neutral-400 border border-neutral-600/30",
        }
      : {
          COMPLETED: "bg-green-100 text-green-800 border border-green-200",
          PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          PROCESSING: "bg-blue-100 text-blue-800 border border-blue-200",
          FAILED: "bg-red-100 text-red-800 border border-red-200",
          REFUNDED: "bg-purple-100 text-purple-800 border border-purple-200",
          default: "bg-gray-100 text-gray-800 border border-gray-200",
        };

    switch (status) {
      case "COMPLETED":
        return baseClasses.COMPLETED;
      case "PENDING":
        return baseClasses.PENDING;
      case "PROCESSING":
        return baseClasses.PROCESSING;
      case "FAILED":
        return baseClasses.FAILED;
      case "REFUNDED":
        return baseClasses.REFUNDED;
      default:
        return baseClasses.default;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
        isDark ? "bg-neutral-800 border border-neutral-700" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {booking.vehicle.year} {booking.vehicle.make}{" "}
            {booking.vehicle.model}
          </h3>
          <p
            className={`text-sm font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
          >
            {booking.vehicle.location}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Booking Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span
            className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
          >
            Start Date:
          </span>
          <span
            className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {formatDate(startDate)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span
            className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
          >
            End Date:
          </span>
          <span
            className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {formatDate(endDate)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span
            className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
          >
            Total Price:
          </span>
          <span
            className={`font-bold ${isDark ? "text-amber-500" : "text-blue-600"}`}
          >
            Rs.{booking.totalPrice.toFixed(2)}
          </span>
        </div>
        {booking.payment && (
          <div className="flex justify-between text-sm items-center">
            <span
              className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
            >
              Payment:
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(
                booking.payment.paymentStatus,
              )}`}
            >
              {booking.payment.paymentStatus}
            </span>
          </div>
        )}
        {isOwner && booking.renter && (
          <div className="flex justify-between text-sm">
            <span
              className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
            >
              Renter:
            </span>
            <span
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {booking.renter.email}
            </span>
          </div>
        )}
        {!isOwner && booking.vehicle.owner && (
          <div className="flex justify-between text-sm">
            <span
              className={`font-bold ${isDark ? "text-neutral-400" : "text-gray-700"}`}
            >
              Owner:
            </span>
            <span
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {booking.vehicle.owner.email}
            </span>
          </div>
        )}
      </div>

      {/* Vehicle Image */}
      {booking.vehicle.images && booking.vehicle.images.length > 0 && (
        <div className="mb-4">
          <img
            src={booking.vehicle.images[0]}
            alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}

      {/* Action Buttons for Owners */}
      {isOwner && (
        <div className="space-y-2 mt-4">
          {booking.status === BookingStatus.PENDING && (
            <>
              {/* Payment warning if payment not completed */}
              {(!booking.payment ||
                booking.payment.paymentStatus !== "COMPLETED") && (
                <div
                  className={`border rounded-md p-3 text-xs font-bold ${
                    isDark
                      ? "bg-yellow-600/10 border-yellow-600/30 text-yellow-400"
                      : "bg-yellow-50 border-yellow-200 text-yellow-800"
                  }`}
                >
                  <p className="font-bold mb-1">Payment Required</p>
                  <p>
                    Renter must complete payment before you can accept this
                    booking.
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept?.(booking.id)}
                  disabled={
                    loading ||
                    !booking.payment ||
                    booking.payment.paymentStatus !== "COMPLETED"
                  }
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  title={
                    !booking.payment ||
                    booking.payment.paymentStatus !== "COMPLETED"
                      ? "Payment must be completed first"
                      : ""
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowRejectConfirm(true)}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </>
          )}
          {canComplete && (
            <button
              onClick={() => onComplete?.(booking.id)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Mark as Completed
            </button>
          )}
        </div>
      )}

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={() => {
          onReject?.(booking.id);
          setShowRejectConfirm(false);
        }}
        title="Reject Booking"
        message="Are you sure you want to reject this booking request? This action cannot be undone."
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
