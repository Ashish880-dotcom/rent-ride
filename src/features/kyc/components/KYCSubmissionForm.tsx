"use client";

import { useState } from "react";
import { KYCSubmissionSchema } from "@/core/utils/validation";
import { z } from "zod";

interface KYCFormData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  documentImage: string;
}

/**
 * KYC Submission Form Component
 * Allows users to submit their KYC information for verification
 * Requirements: 3.1, 3.2, 16.5
 */
export default function KYCSubmissionForm() {
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: "",
    documentType: "",
    documentNumber: "",
    documentImage: "",
  });

  const [errors, setErrors] = useState<Partial<KYCFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validate form data using Zod
  const validateForm = (): boolean => {
    try {
      KYCSubmissionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<KYCFormData> = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as keyof KYCFormData;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit KYC");
      }

      setSuccessMessage(
        "KYC submitted successfully! Your submission is pending review.",
      );

      // Reset form
      setFormData({
        fullName: "",
        documentType: "",
        documentNumber: "",
        documentImage: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit KYC",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof KYCFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        KYC Verification Submission
      </h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Document Type */}
        <div>
          <label
            htmlFor="documentType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Type *
          </label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.documentType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select document type</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
          {errors.documentType && (
            <p className="mt-1 text-sm text-red-600">{errors.documentType}</p>
          )}
        </div>

        {/* Document Number */}
        <div>
          <label
            htmlFor="documentNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Number *
          </label>
          <input
            type="text"
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.documentNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter document number"
          />
          {errors.documentNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>
          )}
        </div>

        {/* Document Image URL */}
        <div>
          <label
            htmlFor="documentImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Image URL *
          </label>
          <input
            type="text"
            id="documentImage"
            name="documentImage"
            value={formData.documentImage}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.documentImage ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://example.com/document.jpg"
          />
          {errors.documentImage && (
            <p className="mt-1 text-sm text-red-600">{errors.documentImage}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Upload your document to a secure storage service and paste the URL
            here
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
}
