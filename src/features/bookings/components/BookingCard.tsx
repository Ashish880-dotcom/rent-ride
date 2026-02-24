"use client";

import { useState } from "react";
import { BookingStatus } from "@/generated/prisma";
import { ConfirmModal } from "@/core/components/Modal";

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

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: BookingStatus;
  totalPrice: number;
  vehicle: Vehicle;
  renter?: Renter;
  createdAt: string | Date;
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
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const now = new Date();
  const canComplete =
    booking.status === BookingStatus.CONFIRMED && endDate < now;

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            {booking.vehicle.year} {booking.vehicle.make}{" "}
            {booking.vehicle.model}
          </h3>
          <p className="text-gray-600 text-sm">{booking.vehicle.location}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Booking Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-medium">{formatDate(startDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">End Date:</span>
          <span className="font-medium">{formatDate(endDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Price:</span>
          <span className="font-bold text-blue-600">
            ${booking.totalPrice.toFixed(2)}
          </span>
        </div>
        {isOwner && booking.renter && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Renter:</span>
            <span className="font-medium">{booking.renter.email}</span>
          </div>
        )}
        {!isOwner && booking.vehicle.owner && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Owner:</span>
            <span className="font-medium">{booking.vehicle.owner.email}</span>
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
        <div className="flex gap-2 mt-4">
          {booking.status === BookingStatus.PENDING && (
            <>
              <button
                onClick={() => onAccept?.(booking.id)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
