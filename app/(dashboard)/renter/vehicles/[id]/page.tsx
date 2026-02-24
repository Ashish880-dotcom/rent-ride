"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FeedbackList from "@/features/vehicles/components/FeedbackList";
import BookingRequestForm from "@/features/bookings/components/BookingRequestForm";
import { Breadcrumb } from "@/core/components/Breadcrumb";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description: string | null;
  images: string[];
  status: string;
  owner: {
    id: string;
    email: string;
  };
}

export default function VehicleDetailsPage() {
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch vehicle details");
      }

      setVehicle(data.vehicle);
      setAverageRating(data.averageRating);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch vehicle details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    alert("Booking request submitted successfully!");
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Vehicle not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/renter" },
            { label: "Vehicles", href: "/renter/vehicles" },
            {
              label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            },
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-gray-600">({averageRating.toFixed(1)})</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {vehicle.images.length > 0 ? (
            <div>
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200">
                <img
                  src={vehicle.images[selectedImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Vehicle Information and Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Make</p>
                  <p className="font-semibold">{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{vehicle.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per Day</p>
                  <p className="font-semibold text-blue-600 text-xl">
                    ${vehicle.pricePerDay.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        vehicle.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </p>
                </div>
              </div>

              {vehicle.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{vehicle.description}</p>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <FeedbackList vehicleId={vehicleId} />
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            {showBookingForm ? (
              <BookingRequestForm
                vehicle={vehicle}
                onSuccess={handleBookingSuccess}
                onCancel={handleBookingCancel}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    ${vehicle.pricePerDay.toFixed(2)}
                  </p>
                  <p className="text-gray-600">per day</p>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Now
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3">Vehicle Owner</h3>
                  <p className="text-gray-700">{vehicle.owner.email}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3">Location</h3>
                  <p className="text-gray-700">{vehicle.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
