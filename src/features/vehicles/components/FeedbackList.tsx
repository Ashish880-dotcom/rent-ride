"use client";

import { useEffect, useState } from "react";

interface Feedback {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  renterName: string;
}

interface FeedbackListProps {
  vehicleId: string;
}

export default function FeedbackList({ vehicleId }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFeedback();
  }, [vehicleId]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/feedback`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feedback");
      }

      setFeedbacks(data.feedbacks);
      setAverageRating(data.averageRating);
      setTotalFeedbacks(data.totalFeedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Average Rating Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
        {totalFeedbacks > 0 ? (
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-600">
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-600 mt-1">
                Based on {totalFeedbacks} review
                {totalFeedbacks !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet</p>
        )}
      </div>

      {/* Individual Feedback List */}
      {currentFeedbacks.length > 0 ? (
        <div className="space-y-4">
          {currentFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {feedback.renterName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(feedback.createdAt)}
                  </p>
                </div>
                {renderStars(feedback.rating)}
              </div>
              {feedback.comment && (
                <p className="text-gray-700 mt-2">{feedback.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-4">
          No reviews available yet
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
