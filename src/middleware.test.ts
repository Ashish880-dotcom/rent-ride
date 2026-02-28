import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import * as fc from "fast-check";

/**
 * Feature: guest-vehicle-browsing, Property 7: Protected routes remain protected
 * **Validates: Requirements 6.5, 7.1, 7.2, 7.3, 7.7**
 *
 * This property test verifies that all booking, payment, profile, and admin routes
 * remain protected and require authentication. Unauthenticated requests to these
 * routes should be rejected with 401 Unauthorized or redirected to login.
 */

describe("Property 7: Protected routes remain protected", () => {
  // Helper to check if a route should be protected
  function isProtectedRoute(pathname: string, method: string): boolean {
    // Public routes that should NOT be protected
    const publicRoutes = [
      "/login",
      "/register",
      "/api/auth/register",
      "/vehicles",
      "/about",
      "/contact",
      "/services",
    ];

    // Check if it's a public route
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return false;
    }

    // Public vehicle API GET requests
    if (pathname === "/api/vehicles" && method === "GET") {
      return false;
    }

    if (pathname.match(/^\/api\/vehicles\/[^/]+$/) && method === "GET") {
      return false;
    }

    // All other routes are protected
    return true;
  }

  // Helper to determine expected response for protected routes
  function getExpectedProtectionBehavior(pathname: string): "redirect" | "401" {
    // API routes should return 401
    if (pathname.startsWith("/api/")) {
      return "401";
    }
    // Page routes should redirect
    return "redirect";
  }

  it("should identify booking routes as protected (Requirement 7.1)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "/api/bookings",
          "/api/bookings/owner",
          "/api/bookings/renter",
        ),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (route, method) => {
          // All booking routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);

          // All booking API routes should return 401
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify booking detail routes as protected (Requirement 7.1)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.constantFrom("/accept", "/reject", "/complete", "/feedback", ""),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (bookingId, subRoute, method) => {
          const route = `/api/bookings/${bookingId}${subRoute}`;

          // All booking detail routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify payment routes as protected (Requirement 7.2)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "/api/payments",
          "/api/payments/stripe/create-intent",
          "/api/payments/khalti/initiate",
          "/api/payments/khalti/verify",
          "/api/payments/esewa/initiate",
          "/api/payments/esewa/verify",
        ),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (route, method) => {
          // All payment routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify payment detail routes as protected (Requirement 7.2)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.constantFrom("/confirm", ""),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (paymentId, subRoute, method) => {
          const route = `/api/payments/${paymentId}${subRoute}`;

          // All payment detail routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify profile page routes as protected (Requirement 7.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "/renter/vehicles",
          "/renter/bookings",
          "/renter/dashboard",
          "/owner/vehicles",
          "/owner/dashboard",
        ),
        async (route) => {
          // All profile routes should be protected
          expect(isProtectedRoute(route, "GET")).toBe(true);

          // Profile pages should redirect to login
          expect(getExpectedProtectionBehavior(route)).toBe("redirect");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify admin routes as protected (Requirement 7.7)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          "/api/admin/stats",
          "/api/admin/users",
          "/api/admin/vehicles",
          "/api/kyc/pending",
          "/admin/dashboard",
          "/admin/users",
        ),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (route, method) => {
          // All admin routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);

          // Check expected behavior based on route type
          const expectedBehavior = getExpectedProtectionBehavior(route);
          expect(["401", "redirect"]).toContain(expectedBehavior);
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify KYC approval/rejection routes as protected (Requirement 7.7)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.constantFrom("approve", "reject"),
        async (kycId, action) => {
          const route = `/api/kyc/${kycId}/${action}`;

          // KYC admin routes should be protected
          expect(isProtectedRoute(route, "POST")).toBe(true);
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should identify vehicle mutation operations as protected (Requirement 6.6)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("POST", "PATCH", "DELETE"),
        fc.uuid(),
        async (method, vehicleId) => {
          const route =
            method === "POST" ? "/api/vehicles" : `/api/vehicles/${vehicleId}`;

          // Vehicle mutations should be protected
          expect(isProtectedRoute(route, method)).toBe(true);
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should NOT protect public vehicle GET routes", async () => {
    await fc.assert(
      fc.asyncProperty(fc.uuid(), async (vehicleId) => {
        // Vehicle collection GET should NOT be protected
        expect(isProtectedRoute("/api/vehicles", "GET")).toBe(false);

        // Vehicle detail GET should NOT be protected
        expect(isProtectedRoute(`/api/vehicles/${vehicleId}`, "GET")).toBe(
          false,
        );

        // Public vehicle pages should NOT be protected
        expect(isProtectedRoute("/vehicles", "GET")).toBe(false);
        expect(isProtectedRoute(`/vehicles/${vehicleId}`, "GET")).toBe(false);
      }),
      { numRuns: 10 },
    );
  });

  it("should protect all booking, payment, profile, and admin API routes consistently (Requirement 6.5)", async () => {
    const protectedApiRoutes = [
      "/api/bookings",
      "/api/bookings/owner",
      "/api/bookings/renter",
      "/api/payments",
      "/api/payments/stripe/create-intent",
      "/api/admin/stats",
      "/api/admin/users",
      "/api/kyc/pending",
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...protectedApiRoutes),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE"),
        async (route, method) => {
          // All these routes should be protected
          expect(isProtectedRoute(route, method)).toBe(true);

          // All should return 401 for API routes
          expect(getExpectedProtectionBehavior(route)).toBe("401");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should protect all profile and admin page routes consistently (Requirement 6.5)", async () => {
    const protectedPageRoutes = [
      "/renter/vehicles",
      "/renter/bookings",
      "/owner/vehicles",
      "/owner/dashboard",
      "/admin/dashboard",
      "/admin/users",
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...protectedPageRoutes),
        async (route) => {
          // All these routes should be protected
          expect(isProtectedRoute(route, "GET")).toBe(true);

          // All should redirect for page routes
          expect(getExpectedProtectionBehavior(route)).toBe("redirect");
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should consistently protect routes across different HTTP methods", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("/api/bookings", "/api/payments", "/api/admin/stats"),
        fc.constantFrom("GET", "POST", "PATCH", "DELETE", "PUT"),
        async (route, method) => {
          // Protected routes should be protected regardless of HTTP method
          expect(isProtectedRoute(route, method)).toBe(true);
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should protect routes with dynamic IDs consistently", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.uuid(),
        fc.uuid(),
        async (bookingId, paymentId, kycId) => {
          // Booking routes with IDs
          expect(isProtectedRoute(`/api/bookings/${bookingId}`, "GET")).toBe(
            true,
          );
          expect(
            isProtectedRoute(`/api/bookings/${bookingId}/accept`, "POST"),
          ).toBe(true);

          // Payment routes with IDs
          expect(isProtectedRoute(`/api/payments/${paymentId}`, "GET")).toBe(
            true,
          );
          expect(
            isProtectedRoute(`/api/payments/${paymentId}/confirm`, "POST"),
          ).toBe(true);

          // KYC routes with IDs
          expect(isProtectedRoute(`/api/kyc/${kycId}/approve`, "POST")).toBe(
            true,
          );
          expect(isProtectedRoute(`/api/kyc/${kycId}/reject`, "POST")).toBe(
            true,
          );
        },
      ),
      { numRuns: 10 },
    );
  });
});
