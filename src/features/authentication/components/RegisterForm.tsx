"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/core/utils/validation";
import { z } from "zod";

type Role = "OWNER" | "USER";

interface ValidationError {
  field: string;
  message: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setGeneralError("");
    setIsLoading(true);

    // Client-side validation using Zod
    try {
      RegisterSchema.parse({ email, password, role });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: ValidationError[] = err.issues.map((error) => ({
          field: error.path[0] as string,
          message: error.message,
        }));
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Validation errors
          setErrors(data.details);
        } else if (data.error) {
          // General error (e.g., email already registered)
          setGeneralError(data.error);
        }
        setIsLoading(false);
        return;
      }

      // Registration successful, redirect to login
      router.push("/login?registered=true");
    } catch (err) {
      setGeneralError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((err) => err.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => prev.filter((err) => err.field !== "email"));
          }}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("email")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          disabled={isLoading}
        />
        {getFieldError("email") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("email")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => prev.filter((err) => err.field !== "password"));
          }}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("password")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          disabled={isLoading}
        />
        {getFieldError("password") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("password")}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          At least 8 characters with letters and numbers
        </p>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          I want to
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="USER">Rent Vehicles</option>
          <option value="OWNER">List My Vehicles for Rent</option>
        </select>
        {getFieldError("role") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("role")}</p>
        )}
      </div>

      {generalError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {generalError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
