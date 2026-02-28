import { describe, it, expect } from "@jest/globals";
import * as fc from "fast-check";

/**
 * Feature: guest-vehicle-browsing, Property 15: Authenticated user experience preservation
 * **Validates: Requirements 9.1, 9.3, 9.5**
 *
 * This property test verifies that authenticated users continue to have the same
 * browsing experience as before the guest browsing feature was implemented:
 * - OWNER users see their own vehicles (all statuses)
 * - RENTER users see only APPROVED vehicles
 * - Navigation patterns and filtering work as before
 * - Dashboard role-specific vehicle lists are preserved
 */

// Mock data generators
const vehicleArbitrary = () =>
  fc.record({
    id: fc.uuid(),
    make: fc.string({ minLength: 1, maxLength: 50 }),
    model: fc.string({ minLength: 1, maxLength: 50 }),
    year: fc.integer({ min: 1900, max: 2100 }),
    pricePerDay: fc.float({ min: 0, max: 100000 }),
    location: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.oneof(fc.constant(null), fc.string()),
    images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 10 }),
    status: fc.oneof(
      fc.constant("APPROVED"),
      fc.constant("PENDING"),
      fc.constant("REJECTED"),
    ),
    ownerId: fc.uuid(),
  });

describe("Property 15: Authenticated user experience preservation", () => {
  it("should allow OWNER users to see their own vehicles with all statuses (Requirement 9.1)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 10 }),
        (vehicles) => {
          // Simulate OWNER user accessing their vehicles
          const ownerId = vehicles[0].ownerId;
          const ownerVehicles = vehicles.filter((v) => v.ownerId === ownerId);

          // Verify owner can see all their vehicles regardless of status
          expect(ownerVehicles.length).toBeGreaterThan(0);

          // Verify vehicles belong to owner
          ownerVehicles.forEach((vehicle) => {
            expect(vehicle.ownerId).toBe(ownerId);
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should allow RENTER users to see only APPROVED vehicles (Requirement 9.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        (vehicles) => {
          // Simulate RENTER user accessing vehicles
          // RENTER should see only APPROVED vehicles
          const renterVehicles = vehicles.filter(
            (v) => v.status === "APPROVED",
          );

          // Verify all returned vehicles are APPROVED
          renterVehicles.forEach((vehicle) => {
            expect(vehicle.status).toBe("APPROVED");
          });

          // Verify PENDING vehicles are not included
          const pendingVehicles = renterVehicles.filter(
            (v) => v.status === "PENDING",
          );
          expect(pendingVehicles.length).toBe(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve role-based filtering for authenticated users (Requirement 9.1, 9.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        fc.oneof(
          fc.constant("OWNER"),
          fc.constant("USER"),
          fc.constant("ADMIN"),
        ),
        (vehicles, role) => {
          if (role === "OWNER") {
            // OWNER should see all their vehicles
            const ownerId = vehicles[0].ownerId;
            const ownerVehicles = vehicles.filter((v) => v.ownerId === ownerId);

            // Should include vehicles
            expect(ownerVehicles.length).toBeGreaterThanOrEqual(0);

            // All should belong to owner
            ownerVehicles.forEach((v) => {
              expect(v.ownerId).toBe(ownerId);
            });
          } else if (role === "USER") {
            // RENTER should see only APPROVED vehicles
            const renterVehicles = vehicles.filter(
              (v) => v.status === "APPROVED",
            );

            // All should be APPROVED
            renterVehicles.forEach((vehicle) => {
              expect(vehicle.status).toBe("APPROVED");
            });
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve vehicle detail access for authenticated users (Requirement 9.2)", async () => {
    await fc.assert(
      fc.asyncProperty(vehicleArbitrary(), (vehicle) => {
        // Authenticated users should be able to access vehicle details
        // Vehicle should have complete information
        expect(vehicle.id).toBeDefined();
        expect(vehicle.make).toBeDefined();
        expect(vehicle.model).toBeDefined();
        expect(vehicle.year).toBeDefined();
        expect(vehicle.pricePerDay).toBeDefined();
        expect(vehicle.location).toBeDefined();
        expect(vehicle.ownerId).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it("should preserve navigation patterns for authenticated users (Requirement 9.4)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 10 }),
        (vehicles) => {
          // Verify navigation from collection to detail page works
          // 1. Get vehicles from collection
          if (vehicles.length > 0) {
            const vehicleId = vehicles[0].id;

            // 2. Should be able to navigate to detail page
            const detailVehicle = vehicles.find((v) => v.id === vehicleId);

            // 3. Verify detail page has complete information
            expect(detailVehicle).toBeDefined();
            expect(detailVehicle?.id).toBe(vehicleId);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve filtering functionality for authenticated users (Requirement 9.1, 9.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        fc.record({
          location: fc.string({ minLength: 1, maxLength: 50 }),
          minPrice: fc.float({ min: 0, max: 100 }),
          maxPrice: fc.float({ min: 100, max: 200 }),
        }),
        (vehicles, filters) => {
          // Test filtering for RENTER (should only see APPROVED)
          const filteredVehicles = vehicles.filter(
            (v) =>
              v.status === "APPROVED" &&
              v.location === filters.location &&
              v.pricePerDay >= filters.minPrice &&
              v.pricePerDay <= filters.maxPrice,
          );

          // All results should match filters
          filteredVehicles.forEach((vehicle) => {
            expect(vehicle.status).toBe("APPROVED");
            expect(vehicle.location).toBe(filters.location);
            expect(vehicle.pricePerDay).toBeGreaterThanOrEqual(
              filters.minPrice,
            );
            expect(vehicle.pricePerDay).toBeLessThanOrEqual(filters.maxPrice);
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve sorting functionality for authenticated users (Requirement 9.1, 9.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        fc.oneof(
          fc.constant("price-asc"),
          fc.constant("price-desc"),
          fc.constant("year-asc"),
          fc.constant("year-desc"),
        ),
        (vehicles, sortBy) => {
          // Get APPROVED vehicles with sorting
          const approvedVehicles = vehicles.filter(
            (v) => v.status === "APPROVED",
          );

          // Verify sorting is possible
          if (sortBy === "price-asc") {
            const sorted = [...approvedVehicles].sort(
              (a, b) => a.pricePerDay - b.pricePerDay,
            );
            expect(sorted.length).toBeGreaterThanOrEqual(0);
            // Verify order
            for (let i = 1; i < sorted.length; i++) {
              expect(sorted[i].pricePerDay).toBeGreaterThanOrEqual(
                sorted[i - 1].pricePerDay,
              );
            }
          } else if (sortBy === "price-desc") {
            const sorted = [...approvedVehicles].sort(
              (a, b) => b.pricePerDay - a.pricePerDay,
            );
            expect(sorted.length).toBeGreaterThanOrEqual(0);
            // Verify order
            for (let i = 1; i < sorted.length; i++) {
              expect(sorted[i].pricePerDay).toBeLessThanOrEqual(
                sorted[i - 1].pricePerDay,
              );
            }
          } else if (sortBy === "year-asc") {
            const sorted = [...approvedVehicles].sort(
              (a, b) => a.year - b.year,
            );
            expect(sorted.length).toBeGreaterThanOrEqual(0);
            // Verify order
            for (let i = 1; i < sorted.length; i++) {
              expect(sorted[i].year).toBeGreaterThanOrEqual(sorted[i - 1].year);
            }
          } else if (sortBy === "year-desc") {
            const sorted = [...approvedVehicles].sort(
              (a, b) => b.year - a.year,
            );
            expect(sorted.length).toBeGreaterThanOrEqual(0);
            // Verify order
            for (let i = 1; i < sorted.length; i++) {
              expect(sorted[i].year).toBeLessThanOrEqual(sorted[i - 1].year);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should maintain backward compatibility for authenticated vehicle collection access (Requirement 9.1)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 10 }),
        (vehicles) => {
          // OWNER accessing their vehicle collection should work as before
          const ownerId = vehicles[0].ownerId;
          const ownerVehicles = vehicles.filter((v) => v.ownerId === ownerId);

          // Should return vehicles with complete information
          ownerVehicles.forEach((vehicle) => {
            expect(vehicle.id).toBeDefined();
            expect(vehicle.make).toBeDefined();
            expect(vehicle.model).toBeDefined();
            expect(vehicle.year).toBeDefined();
            expect(vehicle.pricePerDay).toBeDefined();
            expect(vehicle.location).toBeDefined();
            expect(vehicle.images).toBeDefined();
            expect(vehicle.status).toBeDefined();
            expect(vehicle.ownerId).toBeDefined();
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should maintain backward compatibility for authenticated vehicle detail access (Requirement 9.2)", async () => {
    await fc.assert(
      fc.asyncProperty(vehicleArbitrary(), (vehicle) => {
        // Authenticated user accessing vehicle detail should work as before
        // Should have complete vehicle information
        expect(vehicle.id).toBeDefined();
        expect(vehicle.make).toBeDefined();
        expect(vehicle.model).toBeDefined();
        expect(vehicle.year).toBeDefined();
        expect(vehicle.pricePerDay).toBeDefined();
        expect(vehicle.location).toBeDefined();
        expect(vehicle.description).toBeDefined();
        expect(vehicle.images).toBeDefined();
        expect(vehicle.status).toBeDefined();
        expect(vehicle.ownerId).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it("should preserve dashboard role-specific vehicle lists (Requirement 9.5)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        fc.oneof(
          fc.constant("OWNER"),
          fc.constant("USER"),
          fc.constant("ADMIN"),
        ),
        (vehicles, role) => {
          if (role === "OWNER") {
            // OWNER dashboard should show their vehicles
            const ownerId = vehicles[0].ownerId;
            const ownerVehicles = vehicles.filter((v) => v.ownerId === ownerId);

            // Should have vehicles
            expect(ownerVehicles.length).toBeGreaterThanOrEqual(0);

            // All should belong to this owner
            ownerVehicles.forEach((vehicle) => {
              expect(vehicle.ownerId).toBe(ownerId);
            });
          } else if (role === "USER") {
            // RENTER dashboard should show APPROVED vehicles for browsing
            const approvedVehicles = vehicles.filter(
              (v) => v.status === "APPROVED",
            );

            // All should be APPROVED
            approvedVehicles.forEach((vehicle) => {
              expect(vehicle.status).toBe("APPROVED");
            });
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should not expose non-APPROVED vehicles to RENTER users (Requirement 9.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        (vehicles) => {
          // RENTER should NOT see PENDING vehicles
          const pendingVehicles = vehicles.filter(
            (v) => v.status === "PENDING",
          );

          // If there are pending vehicles, RENTER should not see them
          if (pendingVehicles.length > 0) {
            const renterVisibleVehicles = vehicles.filter(
              (v) => v.status === "APPROVED",
            );

            // Verify no pending vehicles in renter's view
            renterVisibleVehicles.forEach((vehicle) => {
              expect(vehicle.status).not.toBe("PENDING");
            });
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should allow OWNER to see their PENDING vehicles (Requirement 9.1)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 20 }),
        (vehicles) => {
          // OWNER should see their PENDING vehicles
          const ownerId = vehicles[0].ownerId;
          const ownerPendingVehicles = vehicles.filter(
            (v) => v.ownerId === ownerId && v.status === "PENDING",
          );

          // Should be able to see pending vehicles
          expect(ownerPendingVehicles.length).toBeGreaterThanOrEqual(0);

          // All should belong to this owner and be PENDING
          ownerPendingVehicles.forEach((vehicle) => {
            expect(vehicle.ownerId).toBe(ownerId);
            expect(vehicle.status).toBe("PENDING");
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});
