"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/core/contexts/ThemeContext";

interface Booking {
  id: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
}

interface PaymentFormProps {
  booking: Booking;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  booking,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"method" | "details" | "confirm">("method");

  // Payment details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // For other payment methods
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handlePaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create payment record
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      const paymentId = data.payment.id;

      // Handle different payment methods
      if (paymentMethod === "ESEWA") {
        // Initiate eSewa payment
        const esewaResponse = await fetch("/api/payments/esewa/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId }),
        });

        const esewaData = await esewaResponse.json();

        if (!esewaResponse.ok) {
          throw new Error(
            esewaData.error || "Failed to initiate eSewa payment",
          );
        }

        // Redirect to eSewa payment page
        const form = document.createElement("form");
        form.method = "POST";
        form.action = esewaData.paymentUrl;

        Object.keys(esewaData.paymentData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = esewaData.paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      } else if (paymentMethod === "KHALTI") {
        // Initiate Khalti payment
        const khaltiResponse = await fetch("/api/payments/khalti/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId }),
        });

        const khaltiData = await khaltiResponse.json();

        if (!khaltiResponse.ok) {
          throw new Error(
            khaltiData.error || "Failed to initiate Khalti payment",
          );
        }

        // Redirect to Khalti payment page
        window.location.href = khaltiData.paymentUrl;
        return;
      } else {
        // For card payments, move to details step
        setStep("details");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initiate payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get payment ID
      const paymentResponse = await fetch(`/api/bookings/${booking.id}`);
      const paymentData = await paymentResponse.json();

      if (!paymentData.booking?.payment) {
        throw new Error("Payment not found");
      }

      const paymentId = paymentData.booking.payment.id;

      // Generate mock transaction ID (in real app, this comes from payment gateway)
      const mockTransactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Confirm payment
      const confirmResponse = await fetch(
        `/api/payments/${paymentId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: mockTransactionId,
          }),
        },
      );

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmData.error || "Failed to confirm payment");
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/renter/bookings");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm payment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg border p-6 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
      >
        Payment
      </h2>

      {/* Booking Summary */}
      <div
        className={`mb-6 p-4 rounded-lg ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
      >
        <h3
          className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
        </h3>
        <div
          className={`text-sm space-y-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
        >
          <p>From: {new Date(booking.startDate).toLocaleDateString()}</p>
          <p>To: {new Date(booking.endDate).toLocaleDateString()}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-neutral-700">
          <p
            className={`text-2xl font-bold ${isDark ? "text-amber-500" : "text-blue-600"}`}
          >
            Rs.{booking.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Payment Method Selection */}
      {step === "method" && (
        <form onSubmit={handlePaymentMethodSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
            >
              Select Payment Method
            </label>
            <div className="space-y-2">
              {[
                { value: "CREDIT_CARD", label: "Credit Card" },
                { value: "DEBIT_CARD", label: "Debit Card" },
                { value: "ESEWA", label: "eSewa" },
                { value: "KHALTI", label: "Khalti" },
                { value: "BANK_TRANSFER", label: "Bank Transfer" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? isDark
                        ? "border-amber-500 bg-amber-600/10"
                        : "border-blue-500 bg-blue-50"
                      : isDark
                        ? "border-neutral-600 hover:border-neutral-500"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md border font-medium transition-colors ${
                  isDark
                    ? "border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Payment Details */}
      {step === "details" && (
        <form onSubmit={handlePaymentConfirm} className="space-y-4">
          {(paymentMethod === "CREDIT_CARD" ||
            paymentMethod === "DEBIT_CARD") && (
            <>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {(paymentMethod === "ESEWA" || paymentMethod === "KHALTI") && (
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98XXXXXXXX"
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-neutral-900 border-neutral-600 text-white focus:ring-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
              />
              <p
                className={`mt-2 text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                You will receive a payment request on your {paymentMethod} app
              </p>
            </div>
          )}

          {paymentMethod === "BANK_TRANSFER" && (
            <div
              className={`p-4 rounded-lg ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}
            >
              <p
                className={`text-sm mb-2 ${isDark ? "text-neutral-300" : "text-gray-700"}`}
              >
                Please transfer the amount to:
              </p>
              <div
                className={`text-sm space-y-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}
              >
                <p>Bank: Example Bank</p>
                <p>Account: 1234567890</p>
                <p>Account Name: RentRide Platform</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setStep("method")}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md border font-medium transition-colors ${
                isDark
                  ? "border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading
                ? "Processing..."
                : `Pay Rs.${booking.totalPrice.toFixed(2)}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
