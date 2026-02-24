"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/core/components/Breadcrumb";

interface VehicleFormData {
  make: string;
  model: string;
  year: number | "";
  pricePerDay: number | "";
  location: string;
  description: string;
  images: string[];
}

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  pricePerDay?: string;
  location?: string;
  images?: string;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<VehicleFormData>({
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    description: "",
    images: [],
  });

  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.make.trim()) {
      newErrors.make = "Make is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (formData.year === "") {
      newErrors.year = "Year is required";
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }

    if (formData.pricePerDay === "") {
      newErrors.pricePerDay = "Price per day is required";
    } else if (formData.pricePerDay <= 0) {
      newErrors.pricePerDay = "Price must be positive";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: Number(formData.year),
          pricePerDay: Number(formData.pricePerDay),
          location: formData.location,
          description: formData.description || undefined,
          images: formData.images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Zod validation errors
          const errorMessages = data.details
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to submit vehicle listing");
      }

      // Redirect to vehicle management page after successful submission
      router.push("/owner/vehicles");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit vehicle listing",
      );
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (name === "year" || name === "pricePerDay") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Add image URL to the list
  const handleAddImage = () => {
    if (!imageInput.trim()) {
      return;
    }

    // Validate URL format
    try {
      new URL(imageInput);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput],
      }));
      setImageInput("");
      // Clear images error if exists
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: undefined }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        images: "Please enter a valid URL",
      }));
    }
  };

  // Remove image from the list
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/owner" },
            { label: "Vehicles", href: "/owner/vehicles" },
            { label: "Add New Vehicle" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Add New Vehicle</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Make */}
            <div>
              <label
                htmlFor="make"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Make *
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.make ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Toyota, Honda, Ford"
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">{errors.make}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.model ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Camry, Civic, F-150"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`e.g., ${new Date().getFullYear()}`}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            {/* Price Per Day */}
            <div>
              <label
                htmlFor="pricePerDay"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Per Day ($) *
              </label>
              <input
                type="number"
                id="pricePerDay"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pricePerDay ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 50"
                min="0"
                step="0.01"
              />
              {errors.pricePerDay && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pricePerDay}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., New York, NY"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your vehicle, its features, condition, etc."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Images *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.images ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Upload images to a secure storage service and paste the URLs
                here
              </p>

              {/* Image List */}
              {formData.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {image}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="ml-2 px-2 py-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/owner/vehicles")}
                className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Vehicle Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
