/**
 * Centralized error logging utility for guest browsing operations
 * Logs errors to console and monitoring service with context
 */

export interface ErrorContext {
  userId?: string;
  vehicleId?: string;
  operation: string;
  isGuest: boolean;
  timestamp?: string;
}

/**
 * Log an error with context information
 * Includes userId, vehicleId, operation, isGuest, and timestamp
 * Logs to console and monitoring service (in production)
 */
export function logError(error: Error | unknown, context: ErrorContext): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const timestamp = context.timestamp || new Date().toISOString();

  const logEntry = {
    message: errorMessage,
    stack: errorStack,
    userId: context.userId,
    vehicleId: context.vehicleId,
    operation: context.operation,
    isGuest: context.isGuest,
    timestamp,
  };

  // Log to console
  console.error(`[${context.operation}]`, logEntry);

  // Send to monitoring service in production
  if (process.env.NODE_ENV === "production") {
    try {
      // This would be replaced with actual monitoring service integration
      // e.g., Sentry, DataDog, etc.
      if (typeof window === "undefined") {
        // Server-side only
        // monitoringService.captureException(error, logEntry);
      }
    } catch (monitoringError) {
      console.error(
        "Failed to send error to monitoring service:",
        monitoringError,
      );
    }
  }
}

/**
 * Create a context object for error logging
 */
export function createErrorContext(
  operation: string,
  isGuest: boolean,
  userId?: string,
  vehicleId?: string,
): ErrorContext {
  return {
    operation,
    isGuest,
    userId,
    vehicleId,
    timestamp: new Date().toISOString(),
  };
}
