"use client";

import { useState } from "react";
import { BookingStatus } from "@/generated/prisma";
import { FeedbackSubmissionSchema } from "@/core/utils/validation";
import { z } from "zod";

interface FeedbackFormProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  onSuccess?: () => void;
}

export default function FeedbackForm({
  bookingId,
  bookingStatus,
  onSuccess,
}: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    rating?: string;
    comment?: string;
  }>({});
  const [success, setSuccess] = useState<boolean>(false);

  // Only show form for COMPLETED bookings
  if (bookingStatus !== BookingStatus.COMPLETED) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess(false);

    // Client-side validation using Zod
    try {
      FeedbackSubmissionSchema.parse({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { rating?: string; comment?: string } = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as "rating" | "comment";
          if (field === "rating" || field === "comment") {
            errors[field] = error.message;
          }
        });
        setFieldErrors(errors);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSuccess(true);
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="text-3xl transition-colors focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            <span
              className={
                star <= (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">
          Thank you for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          {renderStars()}
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating} star{rating !== 1 ? "s" : ""}
            </p>
          )}
          {fieldErrors.rating && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setFieldErrors((prev) => ({ ...prev, comment: undefined }));
            }}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.comment ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Share your experience with this rental..."
            maxLength={1000}
          />
          {fieldErrors.comment && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.comment}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
