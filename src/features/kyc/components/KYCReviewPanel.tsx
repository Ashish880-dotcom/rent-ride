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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Pending KYC Submissions
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No pending KYC submissions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* User Information */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    User Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-gray-600">Email:</span>{" "}
                      {submission.user.email}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Role:</span>{" "}
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {submission.user.role}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Submitted:
                      </span>{" "}
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>

                {/* KYC Details */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    KYC Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-gray-600">
                        Full Name:
                      </span>{" "}
                      {submission.fullName}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Document Type:
                      </span>{" "}
                      {submission.documentType}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Document Number:
                      </span>{" "}
                      {submission.documentNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Image */}
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-600 mb-2">
                  Document Image
                </h3>
                <a
                  href={submission.documentImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  {submission.documentImage}
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(submission.id)}
                  disabled={processingId === submission.id}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                    processingId === submission.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {processingId === submission.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(submission.id)}
                  disabled={processingId === submission.id}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                    processingId === submission.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
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
