import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp?: string;
}

/**
 * Prisma error codes
 */
export enum PrismaErrorCode {
  UNIQUE_CONSTRAINT = "P2002",
  FOREIGN_KEY_CONSTRAINT = "P2003",
  RECORD_NOT_FOUND = "P2025",
  DEPENDENT_RECORDS = "P2014",
}

/**
 * Sanitize error message for client display
 * Removes sensitive information and provides user-friendly messages
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Remove stack traces and sensitive paths
    const message = error.message.split("\n")[0];

    // Replace technical terms with user-friendly messages
    if (message.includes("ECONNREFUSED")) {
      return "Unable to connect to the database. Please try again later.";
    }

    if (message.includes("ETIMEDOUT")) {
      return "Request timed out. Please try again.";
    }

    if (message.includes("Invalid `prisma")) {
      return "A database error occurred. Please try again.";
    }

    // Return sanitized message (first line only)
    return message;
  }

  return "An unexpected error occurred";
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ErrorResponse> {
  const details = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return NextResponse.json(
    {
      error: "Validation failed",
      details,
      timestamp: new Date().toISOString(),
    },
    { status: 400 },
  );
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(
  error: any,
): NextResponse<ErrorResponse> | null {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }

  const prismaError = error as { code: string; meta?: any };

  switch (prismaError.code) {
    case PrismaErrorCode.UNIQUE_CONSTRAINT:
      const target = prismaError.meta?.target;
      const field = Array.isArray(target) ? target[0] : "field";
      return NextResponse.json(
        {
          error: `A record with this ${field} already exists`,
          timestamp: new Date().toISOString(),
        },
        { status: 409 },
      );

    case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT:
      return NextResponse.json(
        {
          error: "Invalid reference: Related record not found",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );

    case PrismaErrorCode.RECORD_NOT_FOUND:
      return NextResponse.json(
        {
          error: "Record not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );

    case PrismaErrorCode.DEPENDENT_RECORDS:
      return NextResponse.json(
        {
          error: "Cannot delete record with dependent records",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );

    default:
      return null;
  }
}

/**
 * Log error for debugging (server-side only)
 */
export function logError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, any>,
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[${timestamp}] Error in ${context}:`, {
    message: errorMessage,
    stack,
    ...additionalInfo,
  });
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: Array<{ field: string; message: string }>,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: sanitizeErrorMessage(message),
      details,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Handle all errors in a standardized way
 * This is the main error handler to use in API routes
 */
export function handleApiError(
  error: unknown,
  context: string,
): NextResponse<ErrorResponse> {
  // Log the error for debugging
  logError(context, error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // Handle Prisma errors
  const prismaResponse = handlePrismaError(error);
  if (prismaResponse) {
    return prismaResponse;
  }

  // Handle known application errors
  if (error instanceof Error) {
    // Authentication/Authorization errors
    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("unauthorized")
    ) {
      return createErrorResponse("Unauthorized", 401);
    }

    if (
      error.message.includes("Forbidden") ||
      error.message.includes("forbidden") ||
      error.message.includes("not allowed")
    ) {
      return createErrorResponse(error.message, 403);
    }

    // Not found errors
    if (
      error.message.includes("not found") ||
      error.message.includes("Not found")
    ) {
      return createErrorResponse(error.message, 404);
    }

    // Conflict errors
    if (
      error.message.includes("already exists") ||
      error.message.includes("conflict") ||
      error.message.includes("Conflict")
    ) {
      return createErrorResponse(error.message, 409);
    }

    // Validation errors
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required") ||
      error.message.includes("must be")
    ) {
      return createErrorResponse(error.message, 400);
    }

    // Return sanitized error message
    return createErrorResponse(error.message, 500);
  }

  // Unknown error
  return createErrorResponse("An unexpected error occurred", 500);
}

/**
 * Sanitize user-generated content to prevent XSS attacks
 * Requirements: 17.6
 */
export function sanitizeUserContent(content: string): string {
  if (!content) return "";

  // Remove HTML tags
  let sanitized = content.replace(/<[^>]*>/g, "");

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized;
}

/**
 * Validate and sanitize URL to prevent XSS
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid URL protocol");
    }

    return parsed.toString();
  } catch {
    throw new Error("Invalid URL format");
  }
}
