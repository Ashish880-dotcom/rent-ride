"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/core/components/Breadcrumb";

interface VehicleFormData {
  name: string;
  model: string;
  year: number | "";
  pricePerDay: number | "";
  location: string;
  description: string;
  images: string[];
}

interface FormErrors {
  name?: string;
  model?: string;
  year?: string;
  pricePerDay?: string;
  location?: string;
  images?: string;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    description: "",
    images: [],
  });

  const [imageInput, setImageInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required";
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
    setSuccessMessage("");

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
          make: formData.name, // Send name as make to API
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

      // Show success message
      setSuccessMessage("Vehicle added successfully! Redirecting...");

      // Redirect to vehicle management page after 3 seconds
      setTimeout(() => {
        router.push("/owner/vehicles");
      }, 3000);
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

  // Handle file upload from local device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setErrors((prev) => ({ ...prev, images: undefined }));

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select only image files");
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image size must be less than 5MB");
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, base64String],
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        images:
          error instanceof Error ? error.message : "Failed to upload image",
      }));
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = "";
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

        <h1 className="text-3xl font-bold mb-8 text-amber-100">
          Add New Vehicle
        </h1>

        <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 border border-neutral-700">
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded-lg">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-900/50 border border-green-600 text-green-200 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (was Make) */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-amber-200 mb-1"
              >
                Vehicle Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-900 text-white placeholder-gray-500 ${
                  errors.name ? "border-red-500" : "border-neutral-600"
                }`}
                placeholder="e.g., Toyota Camry, Honda Civic, Ford F-150"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-amber-200 mb-1"
              >
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-950/50 text-amber-100 placeholder-amber-700 ${
                  errors.model ? "border-red-500" : "border-amber-600/50"
                }`}
                placeholder="e.g., Camry, Civic, F-150"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-400">{errors.model}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-amber-200 mb-1"
              >
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-950/50 text-amber-100 placeholder-amber-700 ${
                  errors.year ? "border-red-500" : "border-amber-600/50"
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
                Price Per Day (Rs.) *
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

              {/* File Upload */}
              <div className="mb-3">
                <label
                  htmlFor="imageFile"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50"
                >
                  <svg
                    className="w-6 h-6 text-gray-400 mr-2"
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
                  <span className="text-sm text-gray-600">
                    {uploadingImage
                      ? "Uploading..."
                      : "Click to upload images from your device"}
                  </span>
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF (Max 5MB per image)
                </p>
              </div>

              {/* URL Input (Alternative) */}
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-2">Or add image URL:</p>
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
                    Add URL
                  </button>
                </div>
              </div>

              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}

              {/* Image Preview List */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images ({formData.images.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/owner/vehicles")}
                className="flex-1 py-3 px-4 rounded-lg border-2 border-amber-600/50 text-amber-200 font-bold hover:bg-amber-900/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all shadow-lg ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
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
