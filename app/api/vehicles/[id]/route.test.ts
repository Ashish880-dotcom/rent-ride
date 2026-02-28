import { describe, it, expect, jest, afterEach } from "@jest/globals";
import * as fc from "fast-check";
import { VehicleStatus } from "@/generated/prisma";
import { prisma } from "@/core/lib/prisma";

// Mock all dependencies BEFORE importing the route
jest.mock("@/core/lib/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/core/utils/cache", () => ({
  withCache: jest.fn((key, fn) => fn()),
  CacheTTL: {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
  },
  cache: {
    invalidatePattern: jest.fn(),
  },
}));

jest.mock("@/core/utils/sanitization", () => ({
  sanitizeHtml: jest.fn((text) => text),
  sanitizeText: jest.fn((text) => text),
}));

// Import after mocking
import { auth } from "@/core/lib/auth";
import { GET } from "./route";
import { NextRequest } from "next/server";

/**
 * Feature: guest-vehicle-browsing, Property 2: Non-approved vehicles are hidden from guests
 * **Validates: Requirements 5.2, 5.3, 10.2**
 *
 * This property test verifies that for any vehicle with status other than APPROVED,
 * when a guest user requests that vehicle via the API, the system returns a 404 Not Found error.
 * This ensures that guests cannot access vehicles that are pending approval, rejected, or awaiting payment.
 */

describe("Property 2: Non-approved vehicles are hidden from guests", () => {
  // Helper to create a test owner user
  async function createTestOwner() {
    return await prisma.user.create({
      data: {
        email: `owner-${Date.now()}-${Math.random()}@test.com`,
        password: "hashedpassword",
        role: "OWNER",
      },
    });
  }

  // Helper to create a vehicle with specific status
  async function createTestVehicle(status: VehicleStatus, ownerId: string) {
    return await prisma.vehicle.create({
      data: {
        make: "Test Make",
        model: `Model-${Math.random()}`,
        year: 2020,
        pricePerDay: 100,
        location: "Test Location",
        description: "Test Description",
        images: ["test-image.jpg"],
        status,
        ownerId,
      },
    });
  }

  // Clean up test data after each test
  afterEach(async () => {
    await prisma.vehicle.deleteMany({
      where: {
        OR: [{ make: "Test Make" }, { model: { startsWith: "Model-" } }],
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: { contains: "@test.com" },
      },
    });
  });

  it("should return 404 for non-APPROVED vehicles when accessed by guests", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate non-APPROVED vehicle statuses
        fc.constantFrom(
          VehicleStatus.PENDING,
          VehicleStatus.REJECTED,
          VehicleStatus.AWAITING_PAYMENT,
        ),
        async (nonApprovedStatus) => {
          // Mock unauthenticated request (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create a vehicle with non-APPROVED status
          const vehicle = await createTestVehicle(nonApprovedStatus, owner.id);

          // Create a mock request for the specific vehicle
          const request = new NextRequest(
            `http://localhost:3000/api/vehicles/${vehicle.id}`,
          );

          // Call the GET handler
          const response = await GET(request, {
            params: Promise.resolve({ id: vehicle.id }),
          });
          const data = await response.json();

          // Property: Non-APPROVED vehicles MUST return 404 for guest requests
          expect(response.status).toBe(404);
          expect(data).toHaveProperty("error");
          expect(data.error).toBe("Vehicle not found");

          // Clean up
          await prisma.vehicle.delete({ where: { id: vehicle.id } });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 20 },
    );
  });

  it("should return 200 for APPROVED vehicles when accessed by guests", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate vehicle data
        fc.record({
          make: fc.constantFrom("Toyota", "Honda", "Ford", "Tesla"),
          model: fc.constantFrom("Camry", "Accord", "F-150", "Model 3"),
          year: fc.integer({ min: 2015, max: 2024 }),
          pricePerDay: fc.float({ min: 50, max: 500 }),
          location: fc.constantFrom("New York", "Los Angeles", "Chicago"),
        }),
        async (vehicleData) => {
          // Mock unauthenticated request (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create an APPROVED vehicle
          const vehicle = await prisma.vehicle.create({
            data: {
              make: vehicleData.make,
              model: vehicleData.model,
              year: vehicleData.year,
              pricePerDay: vehicleData.pricePerDay,
              location: vehicleData.location,
              description: "Test Description",
              images: ["test-image.jpg"],
              status: VehicleStatus.APPROVED,
              ownerId: owner.id,
            },
          });

          // Create a mock request for the specific vehicle
          const request = new NextRequest(
            `http://localhost:3000/api/vehicles/${vehicle.id}`,
          );

          // Call the GET handler
          const response = await GET(request, {
            params: Promise.resolve({ id: vehicle.id }),
          });
          const data = await response.json();

          // Property: APPROVED vehicles MUST return 200 for guest requests
          expect(response.status).toBe(200);
          expect(data).toHaveProperty("vehicle");
          expect(data.vehicle.id).toBe(vehicle.id);
          expect(data.vehicle.status).toBe(VehicleStatus.APPROVED);
          expect(data).toHaveProperty("averageRating");

          // Clean up
          await prisma.vehicle.delete({ where: { id: vehicle.id } });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 20 },
    );
  });

  it("should consistently return 404 for the same non-APPROVED vehicle across multiple guest requests", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          VehicleStatus.PENDING,
          VehicleStatus.REJECTED,
          VehicleStatus.AWAITING_PAYMENT,
        ),
        fc.integer({ min: 2, max: 5 }),
        async (nonApprovedStatus, requestCount) => {
          // Mock unauthenticated request (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create a vehicle with non-APPROVED status
          const vehicle = await createTestVehicle(nonApprovedStatus, owner.id);

          // Make multiple requests to the same vehicle
          const responses = await Promise.all(
            Array.from({ length: requestCount }, async () => {
              const request = new NextRequest(
                `http://localhost:3000/api/vehicles/${vehicle.id}`,
              );
              return await GET(request, {
                params: Promise.resolve({ id: vehicle.id }),
              });
            }),
          );

          // Property: ALL requests MUST consistently return 404
          const allReturn404 = responses.every((res) => res.status === 404);
          expect(allReturn404).toBe(true);

          // Verify all responses have the same error message
          const responseData = await Promise.all(
            responses.map((res) => res.json()),
          );
          const allHaveSameError = responseData.every(
            (data) => data.error === "Vehicle not found",
          );
          expect(allHaveSameError).toBe(true);

          // Clean up
          await prisma.vehicle.delete({ where: { id: vehicle.id } });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 20 },
    );
  });

  it("should return 404 for non-existent vehicle IDs", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random non-existent vehicle IDs
        fc.uuid(),
        async (nonExistentId) => {
          // Mock unauthenticated request (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a mock request for a non-existent vehicle
          const request = new NextRequest(
            `http://localhost:3000/api/vehicles/${nonExistentId}`,
          );

          // Call the GET handler
          const response = await GET(request, {
            params: Promise.resolve({ id: nonExistentId }),
          });
          const data = await response.json();

          // Property: Non-existent vehicles MUST return 404
          expect(response.status).toBe(404);
          expect(data).toHaveProperty("error");
          expect(data.error).toBe("Vehicle not found");
        },
      ),
      { numRuns: 20 },
    );
  });
});
