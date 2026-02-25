"use client";

import { useState, useEffect } from "react";
import { VehicleListingSchema } from "@/core/utils/validation";
import { z } from "zod";
import { useTheme } from "@/core/contexts/ThemeContext";

interface VehicleFormData {
  ownerId: string;
  make: string;
  model: string;
  year: number | "";
  pricePerDay: number | "";
  location: string;
  description: string;
  images: string[];
}

interface Owner {
  id: string;
  email: string;
}

interface FormErrors {
  ownerId?: string;
  make?: string;
  model?: string;
  year?: string;
  pricePerDay?: string;
  location?: string;
  description?: string;
  images?: string;
}

export function AdminAddVehicleForm() {
  const { isDark } = useTheme();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [formData, setFormData] = useState<VehicleFormData>({
    ownerId: "",
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch(
        "/api/admin/users?role=OWNER&kycStatus=APPROVED",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch owners");
      }
      const data = await response.json();
      setOwners(data.users || []);
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoadingOwners(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerId) {
      newErrors.ownerId = "Please select a vehicle owner";
    }

    try {
      VehicleListingSchema.parse({
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        pricePerDay: Number(formData.pricePerDay),
        location: formData.location,
        description: formData.description || undefined,
        images: formData.images,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((error) => {
          const field = error.path[0] as keyof FormErrors;
          newErrors[field] = error.message;
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: formData.ownerId,
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
        throw new Error(data.error || "Failed to add vehicle");
      }

      setSuccessMessage("Vehicle added successfully and approved!");

      // Reset form
      setFormData({
        ownerId: "",
        make: "",
        model: "",
        year: "",
        pricePerDay: "",
        location: "",
        description: "",
        images: [],
      });
      setImageInput("");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to add vehicle";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "year" || name === "pricePerDay") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) {
      return;
    }

    try {
      new URL(imageInput);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput],
      }));
      setImageInput("");
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

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 rounded-lg shadow-md ${isDark ? "bg-neutral-800 border border-neutral-700" : "bg-white"}`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}
      >
        Add Vehicle for Owner
      </h2>

      {successMessage && (
        <div
          className={`mb-4 p-4 border rounded ${isDark ? "bg-green-900/50 border-green-600 text-green-200" : "bg-green-100 border-green-400 text-green-700"}`}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className={`mb-4 p-4 border rounded ${isDark ? "bg-red-900/50 border-red-600 text-red-200" : "bg-red-100 border-red-400 text-red-700"}`}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Owner Selection */}
        <div>
          <label
            htmlFor="ownerId"
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Vehicle Owner *
          </label>
          {loadingOwners ? (
            <p
              className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-500"}`}
            >
              Loading owners...
            </p>
          ) : (
            <select
              id="ownerId"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
                errors.ownerId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select an owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.email}
                </option>
              ))}
            </select>
          )}
          {errors.ownerId && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerId}</p>
          )}
          {!loadingOwners && owners.length === 0 && (
            <p className="mt-1 text-sm text-yellow-600">
              No approved vehicle owners found. Owners must have approved KYC
              status.
            </p>
          )}
        </div>

        {/* Name of Vehicle */}
        <div>
          <label
            htmlFor="make"
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Name of Vehicle *
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
              errors.make ? "border-red-500" : ""
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
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Model *
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
              errors.model ? "border-red-500" : ""
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
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Year *
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
              errors.year ? "border-red-500" : ""
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
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Price Per Day (Rs.) *
          </label>
          <input
            type="number"
            id="pricePerDay"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
              errors.pricePerDay ? "border-red-500" : ""
            }`}
            placeholder="e.g., 50"
            min="0"
            step="0.01"
          />
          {errors.pricePerDay && (
            <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
              errors.location ? "border-red-500" : ""
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
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"}`}
            placeholder="Describe the vehicle, its features, condition, etc."
          />
        </div>

        {/* Images */}
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
          >
            Vehicle Images *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? "bg-neutral-900 text-white border-neutral-600 focus:ring-amber-500 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"} ${
                errors.images ? "border-red-500" : ""
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
              className={`px-4 py-2 rounded-md transition-colors ${isDark ? "bg-neutral-700 hover:bg-neutral-600 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}
            >
              Add
            </button>
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
          )}

          {formData.images.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded border ${isDark ? "bg-neutral-900 border-neutral-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <span
                    className={`text-sm truncate flex-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                  >
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
        <button
          type="submit"
          disabled={isSubmitting || loadingOwners || owners.length === 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting || loadingOwners || owners.length === 0
              ? `${isDark ? "bg-neutral-700 text-neutral-500" : "bg-gray-400 text-gray-200"} cursor-not-allowed`
              : `${isDark ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"} text-white`
          }`}
        >
          {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}
