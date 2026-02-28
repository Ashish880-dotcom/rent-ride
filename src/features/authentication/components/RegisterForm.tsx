"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setGeneralError("");
    setIsLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrors([
        { field: "confirmPassword", message: "Passwords do not match" },
      ]);
      setIsLoading(false);
      return;
    }

    // Client-side validation using Zod
    try {
      RegisterSchema.parse({ name, email, password, role });
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
        body: JSON.stringify({ name, email, password, role }),
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

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
      });

      if (result?.error) {
        setGeneralError("Failed to sign up with Google");
        setIsGoogleLoading(false);
        return;
      }

      if (result?.ok) {
        // Get session to determine role-based redirect
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        // Redirect based on role
        if (session?.user?.role) {
          const userRole = session.user.role;
          if (userRole === "ADMIN") {
            router.push("/admin");
          } else if (userRole === "OWNER") {
            router.push("/owner");
          } else {
            router.push("/renter");
          }
        } else {
          router.push("/renter");
        }
      }
    } catch (err) {
      setGeneralError("An unexpected error occurred");
      setIsGoogleLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((err) => err.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => prev.filter((err) => err.field !== "name"));
          }}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-700 text-white shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("name")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-600 focus:border-amber-500 focus:ring-amber-500"
          }`}
          disabled={isLoading || isGoogleLoading}
        />
        {getFieldError("name") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("name")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
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
          className={`mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-700 text-white shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("email")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-600 focus:border-amber-500 focus:ring-amber-500"
          }`}
          disabled={isLoading || isGoogleLoading}
        />
        {getFieldError("email") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("email")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
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
          className={`mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-700 text-white shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("password")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-600 focus:border-amber-500 focus:ring-amber-500"
          }`}
          disabled={isLoading || isGoogleLoading}
        />
        {getFieldError("password") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("password")}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          At least 8 characters with letters and numbers
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-300"
        >
          Re-type Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) =>
              prev.filter((err) => err.field !== "confirmPassword"),
            );
          }}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-700 text-white shadow-sm focus:outline-none focus:ring-1 ${
            getFieldError("confirmPassword")
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-600 focus:border-amber-500 focus:ring-amber-500"
          }`}
          disabled={isLoading || isGoogleLoading}
        />
        {getFieldError("confirmPassword") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("confirmPassword")}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-300"
        >
          I want to
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="mt-1 block w-full rounded-md border border-neutral-600 px-3 py-2 bg-neutral-700 text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
          disabled={isLoading || isGoogleLoading}
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
        disabled={isLoading || isGoogleLoading}
        className="w-full rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-neutral-800 px-2 text-neutral-400">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Google Sign-Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-neutral-800 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isGoogleLoading ? "Signing up..." : "Google"}
      </button>
    </form>
  );
}
