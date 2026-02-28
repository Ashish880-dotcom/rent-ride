"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/core/contexts/ThemeContext";

interface KYCData {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  documentImage: string;
  status: string;
  createdAt: string;
}

export default function RenterKYCPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "passport",
    documentNumber: "",
    documentImage: "",
  });

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const response = await fetch("/api/kyc/status");
      if (response.ok) {
        const data = await response.json();
        if (data.kyc) {
          setKycData(data.kyc);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        documentImage: reader.result as string,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

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

      setSuccess(
        "KYC submitted successfully! Your submission is pending review.",
      );
      setTimeout(() => {
        fetchKYCStatus();
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit KYC");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
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

  // If KYC already exists, show status
  if (kycData) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1
            className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            KYC Verification Status
          </h1>

          <div
            className={`rounded-lg border p-6 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Your KYC Status
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  kycData.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : kycData.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {kycData.status}
              </span>
            </div>

            {kycData.status === "APPROVED" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-green-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      Your KYC verification is approved. You can now book and
                      rent vehicles on the platform.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {kycData.status === "PENDING" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-yellow-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Waiting for KYC approval from the admin. You can browse
                      vehicles but cannot book until your KYC is approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {kycData.status === "REJECTED" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      Your KYC verification was rejected. Please submit new
                      documents to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-400" : "text-gray-700"}`}
                >
                  Full Name
                </label>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {kycData.fullName}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-400" : "text-gray-700"}`}
                >
                  Document Type
                </label>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {kycData.documentType}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-400" : "text-gray-700"}`}
                >
                  Document Number
                </label>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {kycData.documentNumber}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-400" : "text-gray-700"}`}
                >
                  Submitted On
                </label>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {new Date(kycData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push("/renter")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show KYC submission form
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1
          className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          KYC Verification
        </h1>
        <p className={`mb-8 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Complete your KYC verification to start booking and renting vehicles
          on RentRide
        </p>

        <div
          className={`rounded-lg border p-6 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}`}
        >
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
                placeholder="Enter your full legal name"
                required
              />
            </div>

            {/* Document Type */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Document Type *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
                required
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>

            {/* Document Number */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Document Number *
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) =>
                  setFormData({ ...formData, documentNumber: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
                placeholder="Enter document number"
                required
              />
            </div>

            {/* Document Image */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Document Image *
              </label>
              <label
                className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                  isDark
                    ? "border-neutral-600 hover:border-amber-500 bg-neutral-900 hover:bg-neutral-800"
                    : "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50"
                }`}
              >
                <svg
                  className={`w-6 h-6 mr-2 ${isDark ? "text-neutral-400" : "text-gray-400"}`}
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
                <span
                  className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-600"}`}
                >
                  {formData.documentImage
                    ? "Image uploaded"
                    : "Click to upload document image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  required={!formData.documentImage}
                />
              </label>
              <p
                className={`mt-1 text-xs ${isDark ? "text-neutral-500" : "text-gray-500"}`}
              >
                Upload a clear photo of your document (Max 5MB)
              </p>

              {formData.documentImage && (
                <div className="mt-3">
                  <img
                    src={formData.documentImage}
                    alt="Document preview"
                    className="max-w-xs rounded border"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/renter")}
                className={`flex-1 py-2 px-4 rounded-md border font-medium transition-colors ${
                  isDark
                    ? "border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : isDark
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {submitting ? "Submitting..." : "Submit KYC"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
