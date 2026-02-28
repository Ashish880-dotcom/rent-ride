"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface KYCSubmission {
  id: string;
  userId: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  documentImage: string;
  status: string;
  createdAt: string;
  user: User;
}

/**
 * KYC Review Panel Component
 * Admin interface to review and approve/reject pending KYC submissions
 * Requirements: 3.4, 3.5, 3.6
 */
export default function KYCReviewPanel() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch pending KYC submissions
  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/kyc/pending");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch submissions");
      }

      setSubmissions(data.submissions);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch submissions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load submissions on mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle approve action
  const handleApprove = async (kycId: string) => {
    setProcessingId(kycId);
    setError("");

    try {
      const response = await fetch(`/api/kyc/${kycId}/approve`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve KYC");
      }

      // Remove approved submission from list
      setSubmissions((prev) => prev.filter((sub) => sub.id !== kycId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to approve KYC",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject action
  const handleReject = async (kycId: string) => {
    setProcessingId(kycId);
    setError("");

    try {
      const response = await fetch(`/api/kyc/${kycId}/reject`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject KYC");
      }

      // Remove rejected submission from list
      setSubmissions((prev) => prev.filter((sub) => sub.id !== kycId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reject KYC");
    } finally {
      setProcessingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Pending KYC Submissions
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No pending KYC submissions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Document Image - Takes up more space */}
                <div className="lg:col-span-2">
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Document Image
                  </h3>
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={submission.documentImage}
                      alt="Document"
                      className="h-64 w-full object-cover rounded border-2 border-gray-300 dark:border-gray-600"
                    />
                    <a
                      href={submission.documentImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>

                {/* User Information and KYC Details - Compact */}
                <div className="space-y-3">
                  {/* User Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">
                      User Information
                    </h3>
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Email:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 break-words">
                          {submission.user.email}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Role:
                        </span>{" "}
                        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                          {submission.user.role}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Submitted:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-200 text-xs">
                          {formatDate(submission.createdAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* KYC Details */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">
                      KYC Details
                    </h3>
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Full Name:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-200">
                          {submission.fullName}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Document Type:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-200">
                          {submission.documentType}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Document Number:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-200">
                          {submission.documentNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleApprove(submission.id)}
                  disabled={processingId === submission.id}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                    processingId === submission.id
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  }`}
                >
                  {processingId === submission.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(submission.id)}
                  disabled={processingId === submission.id}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                    processingId === submission.id
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                  }`}
                >
                  {processingId === submission.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
