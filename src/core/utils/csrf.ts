import { NextRequest } from "next/server";
import { auth } from "@/core/lib/auth";

/**
 * Validates CSRF protection for state-changing operations
 *
 * NextAuth v5 provides built-in CSRF protection through:
 * 1. CSRF tokens in cookies
 * 2. SameSite cookie attributes
 * 3. Origin header validation
 *
 * This utility provides additional validation for API routes
 */
export async function validateCSRF(request: NextRequest): Promise<boolean> {
  // Check if user is authenticated (NextAuth handles CSRF for authenticated requests)
  const session = await auth();
  if (!session) {
    return false;
  }

  // Validate Origin header matches the request URL for state-changing operations
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    const originUrl = new URL(origin);
    // Allow requests from same origin
    if (originUrl.host !== host) {
      return false;
    }
  }

  // Validate Referer header for additional protection
  const referer = request.headers.get("referer");
  if (referer && host) {
    const refererUrl = new URL(referer);
    // Allow requests from same origin
    if (refererUrl.host !== host) {
      return false;
    }
  }

  return true;
}

/**
 * Validates that the request is a state-changing operation (POST, PUT, PATCH, DELETE)
 * and performs CSRF validation
 */
export async function requireCSRFProtection(
  request: NextRequest,
): Promise<void> {
  const method = request.method;

  // Only validate state-changing operations
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const isValid = await validateCSRF(request);

    if (!isValid) {
      throw new Error("CSRF validation failed");
    }
  }
}

/**
 * Middleware helper to add CSRF validation to API routes
 * Usage: Wrap your API route handler with this function
 */
export function withCSRFProtection<T>(
  handler: (request: NextRequest, context?: any) => Promise<T>,
) {
  return async (request: NextRequest, context?: any): Promise<T> => {
    try {
      await requireCSRFProtection(request);
      return await handler(request, context);
    } catch (error) {
      throw error;
    }
  };
}
