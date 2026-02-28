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
 * Feature: guest-vehicle-browsing, Property 1: Guest API requests return only approved vehicles
 * **Validates: Requirements 1.5, 5.1**
 *
 * This property test verifies that for any unauthenticated GET request to the vehicle
 * collection API, all returned vehicles have status APPROVED. This ensures that guests
 * can only see quality-controlled, approved vehicles while browsing without authentication.
 */

describe("Property 1: Guest API requests return only approved vehicles", () => {
  // Helper to create a vehicle with specific status
  async function createTestVehicle(status: VehicleStatus, ownerId: string) {
    return await prisma.vehicle.create({
      data: {
        make: "Test Make",
        model: "Test Model",
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

  it("should return only APPROVED vehicles for unauthenticated requests", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of vehicle statuses with at least one of each type
        fc.array(
          fc.constantFrom(
            VehicleStatus.APPROVED,
            VehicleStatus.PENDING,
            VehicleStatus.REJECTED,
            VehicleStatus.AWAITING_PAYMENT,
          ),
          { minLength: 4, maxLength: 20 },
        ),
        async (statuses) => {
          // Mock unauthenticated request (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create vehicles with different statuses
          const vehicles = await Promise.all(
            statuses.map((status) => createTestVehicle(status, owner.id)),
          );

          // Create a mock request
          const request = new NextRequest("http://localhost:3000/api/vehicles");

          // Call the GET handler
          const response = await GET(request);
          const data = await response.json();

          // Verify response is successful
          expect(response.status).toBe(200);
          expect(data).toHaveProperty("vehicles");
          expect(Array.isArray(data.vehicles)).toBe(true);

          // Property: ALL returned vehicles MUST have status APPROVED
          const allApproved = data.vehicles.every(
            (v: any) => v.status === VehicleStatus.APPROVED,
          );
          expect(allApproved).toBe(true);

          // Verify that only APPROVED vehicles are returned
          const approvedCount = statuses.filter(
            (s) => s === VehicleStatus.APPROVED,
          ).length;
          expect(data.vehicles.length).toBe(approvedCount);

          // Clean up
          await prisma.vehicle.deleteMany({
            where: { id: { in: vehicles.map((v) => v.id) } },
          });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should return only APPROVED vehicles with location filter for unauthenticated requests", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate vehicles with different locations and statuses
        fc.array(
          fc.record({
            status: fc.constantFrom(
              VehicleStatus.APPROVED,
              VehicleStatus.PENDING,
              VehicleStatus.REJECTED,
            ),
            location: fc.constantFrom("New York", "Los Angeles", "Chicago"),
          }),
          { minLength: 5, maxLength: 15 },
        ),
        fc.constantFrom("New York", "Los Angeles", "Chicago"),
        async (vehicleConfigs, filterLocation) => {
          // Mock unauthenticated request
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create vehicles with different locations and statuses
          const vehicles = await Promise.all(
            vehicleConfigs.map((config) =>
              prisma.vehicle.create({
                data: {
                  make: "Test Make",
                  model: `Model-${Math.random()}`,
                  year: 2020,
                  pricePerDay: 100,
                  location: config.location,
                  description: "Test Description",
                  images: ["test-image.jpg"],
                  status: config.status,
                  ownerId: owner.id,
                },
              }),
            ),
          );

          // Create a mock request with location filter
          const request = new NextRequest(
            `http://localhost:3000/api/vehicles?location=${encodeURIComponent(filterLocation)}`,
          );

          // Call the GET handler
          const response = await GET(request);
          const data = await response.json();

          // Verify response is successful
          expect(response.status).toBe(200);
          expect(data).toHaveProperty("vehicles");

          // Property: ALL returned vehicles MUST have status APPROVED
          const allApproved = data.vehicles.every(
            (v: any) => v.status === VehicleStatus.APPROVED,
          );
          expect(allApproved).toBe(true);

          // Property: ALL returned vehicles MUST match the location filter
          const allMatchLocation = data.vehicles.every((v: any) =>
            v.location.toLowerCase().includes(filterLocation.toLowerCase()),
          );
          expect(allMatchLocation).toBe(true);

          // Clean up
          await prisma.vehicle.deleteMany({
            where: { id: { in: vehicles.map((v) => v.id) } },
          });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should return only APPROVED vehicles with price range filter for unauthenticated requests", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate vehicles with different prices and statuses
        fc.array(
          fc.record({
            status: fc.constantFrom(
              VehicleStatus.APPROVED,
              VehicleStatus.PENDING,
              VehicleStatus.REJECTED,
            ),
            pricePerDay: fc.float({ min: 50, max: 500 }),
          }),
          { minLength: 5, maxLength: 15 },
        ),
        fc.float({ min: 50, max: 300 }),
        fc.float({ min: 300, max: 500 }),
        async (vehicleConfigs, minPrice, maxPrice) => {
          // Ensure minPrice <= maxPrice
          const actualMinPrice = Math.min(minPrice, maxPrice);
          const actualMaxPrice = Math.max(minPrice, maxPrice);

          // Mock unauthenticated request
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create vehicles with different prices and statuses
          const vehicles = await Promise.all(
            vehicleConfigs.map((config) =>
              prisma.vehicle.create({
                data: {
                  make: "Test Make",
                  model: `Model-${Math.random()}`,
                  year: 2020,
                  pricePerDay: config.pricePerDay,
                  location: "Test Location",
                  description: "Test Description",
                  images: ["test-image.jpg"],
                  status: config.status,
                  ownerId: owner.id,
                },
              }),
            ),
          );

          // Create a mock request with price range filter
          const request = new NextRequest(
            `http://localhost:3000/api/vehicles?minPrice=${actualMinPrice}&maxPrice=${actualMaxPrice}`,
          );

          // Call the GET handler
          const response = await GET(request);
          const data = await response.json();

          // Verify response is successful
          expect(response.status).toBe(200);
          expect(data).toHaveProperty("vehicles");

          // Property: ALL returned vehicles MUST have status APPROVED
          const allApproved = data.vehicles.every(
            (v: any) => v.status === VehicleStatus.APPROVED,
          );
          expect(allApproved).toBe(true);

          // Property: ALL returned vehicles MUST be within the price range
          const allWithinPriceRange = data.vehicles.every(
            (v: any) =>
              v.pricePerDay >= actualMinPrice &&
              v.pricePerDay <= actualMaxPrice,
          );
          expect(allWithinPriceRange).toBe(true);

          // Clean up
          await prisma.vehicle.deleteMany({
            where: { id: { in: vehicles.map((v) => v.id) } },
          });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 10 },
    );
  });

  it("should never return PENDING, REJECTED, or AWAITING_PAYMENT vehicles for unauthenticated requests", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          VehicleStatus.PENDING,
          VehicleStatus.REJECTED,
          VehicleStatus.AWAITING_PAYMENT,
        ),
        fc.integer({ min: 1, max: 10 }),
        async (nonApprovedStatus, count) => {
          // Mock unauthenticated request
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Create a test owner
          const owner = await createTestOwner();

          // Create multiple vehicles with non-APPROVED status
          const vehicles = await Promise.all(
            Array.from({ length: count }, () =>
              createTestVehicle(nonApprovedStatus, owner.id),
            ),
          );

          // Create a mock request
          const request = new NextRequest("http://localhost:3000/api/vehicles");

          // Call the GET handler
          const response = await GET(request);
          const data = await response.json();

          // Verify response is successful
          expect(response.status).toBe(200);
          expect(data).toHaveProperty("vehicles");

          // Property: NONE of the created non-APPROVED vehicles should be in the response
          const createdVehicleIds = vehicles.map((v) => v.id);
          const returnedVehicleIds = data.vehicles.map((v: any) => v.id);
          const hasNonApprovedVehicles = createdVehicleIds.some((id) =>
            returnedVehicleIds.includes(id),
          );
          expect(hasNonApprovedVehicles).toBe(false);

          // Clean up
          await prisma.vehicle.deleteMany({
            where: { id: { in: vehicles.map((v) => v.id) } },
          });
          await prisma.user.delete({ where: { id: owner.id } });
        },
      ),
      { numRuns: 10 },
    );
  });
});

/**
 * Feature: guest-vehicle-browsing, Property 16: Error logging
 * **Validates: Requirements 10.5**
 *
 * This property test verifies that for any error that occurs during vehicle browsing
 * operations, the system writes an error log entry containing the error details.
 * This ensures proper monitoring and debugging of guest browsing operations.
 */

describe("Property 16: Error logging", () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should log errors with context when vehicle fetch fails", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (errorMessage) => {
          // Mock auth to return a guest user (no session)
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Mock prisma to throw an error
          const originalFindMany = prisma.vehicle.findMany;
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockRejectedValueOnce(new Error(errorMessage));

          // Spy on console.error to verify logging
          const consoleErrorSpy = jest.spyOn(console, "error");

          // Create a mock request
          const request = new NextRequest("http://localhost:3000/api/vehicles");

          // Call the GET handler
          const response = await GET(request);

          // Verify error response
          expect(response.status).toBe(500);
          const data = await response.json();
          expect(data.error).toBe("Internal server error");

          // Property: Error should be logged with context
          expect(consoleErrorSpy).toHaveBeenCalled();
          const logCall = consoleErrorSpy.mock.calls.find((call) =>
            call[0]?.includes("vehicle_list_fetch"),
          );
          expect(logCall).toBeDefined();

          // Verify log contains context information
          if (logCall) {
            const logEntry = logCall[1];
            expect(logEntry).toHaveProperty("operation", "vehicle_list_fetch");
            expect(logEntry).toHaveProperty("isGuest", true);
            expect(logEntry).toHaveProperty("timestamp");
            expect(logEntry).toHaveProperty("message");
          }

          consoleErrorSpy.mockRestore();
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockImplementation(originalFindMany);
        },
      ),
      { numRuns: 5 },
    );
  });

  it("should log errors with userId when authenticated user fetch fails", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (errorMessage) => {
          // Mock auth to return an authenticated user
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue({
            user: {
              id: "test-user-id",
              email: "test@example.com",
              role: "USER",
            },
          } as any);

          // Mock prisma to throw an error
          const originalFindMany = prisma.vehicle.findMany;
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockRejectedValueOnce(new Error(errorMessage));

          // Spy on console.error to verify logging
          const consoleErrorSpy = jest.spyOn(console, "error");

          // Create a mock request
          const request = new NextRequest("http://localhost:3000/api/vehicles");

          // Call the GET handler
          const response = await GET(request);

          // Verify error response
          expect(response.status).toBe(500);

          // Property: Error should be logged with userId
          expect(consoleErrorSpy).toHaveBeenCalled();
          const logCall = consoleErrorSpy.mock.calls.find((call) =>
            call[0]?.includes("vehicle_list_fetch"),
          );
          expect(logCall).toBeDefined();

          // Verify log contains userId
          if (logCall) {
            const logEntry = logCall[1];
            expect(logEntry).toHaveProperty("userId", "test-user-id");
            expect(logEntry).toHaveProperty("isGuest", false);
          }

          consoleErrorSpy.mockRestore();
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockImplementation(originalFindMany);
        },
      ),
      { numRuns: 5 },
    );
  });

  it("should log errors with operation context", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("vehicle_creation", "vehicle_list_fetch"),
        async (operation) => {
          // Mock auth
          (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

          // Mock prisma to throw an error
          const originalFindMany = prisma.vehicle.findMany;
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockRejectedValueOnce(new Error("Test error"));

          // Spy on console.error
          const consoleErrorSpy = jest.spyOn(console, "error");

          // Create a mock request
          const request = new NextRequest("http://localhost:3000/api/vehicles");

          // Call the GET handler
          const response = await GET(request);

          // Property: Error log should include operation context
          expect(consoleErrorSpy).toHaveBeenCalled();
          const logCall = consoleErrorSpy.mock.calls.find((call) =>
            call[0]?.includes("vehicle_list_fetch"),
          );
          expect(logCall).toBeDefined();

          if (logCall) {
            const logEntry = logCall[1];
            expect(logEntry).toHaveProperty("operation");
            expect(typeof logEntry.operation).toBe("string");
            expect(logEntry.operation.length).toBeGreaterThan(0);
          }

          consoleErrorSpy.mockRestore();
          jest
            .spyOn(prisma.vehicle, "findMany")
            .mockImplementation(originalFindMany);
        },
      ),
      { numRuns: 5 },
    );
  });

  it("should log errors with timestamp", async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        // Mock auth
        (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(null);

        // Mock prisma to throw an error
        const originalFindMany = prisma.vehicle.findMany;
        jest
          .spyOn(prisma.vehicle, "findMany")
          .mockRejectedValueOnce(new Error("Test error"));

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, "error");

        // Create a mock request
        const request = new NextRequest("http://localhost:3000/api/vehicles");

        // Call the GET handler
        const response = await GET(request);

        // Property: Error log should include timestamp
        expect(consoleErrorSpy).toHaveBeenCalled();
        const logCall = consoleErrorSpy.mock.calls.find((call) =>
          call[0]?.includes("vehicle_list_fetch"),
        );
        expect(logCall).toBeDefined();

        if (logCall) {
          const logEntry = logCall[1];
          expect(logEntry).toHaveProperty("timestamp");
          // Verify timestamp is a valid ISO string
          const timestamp = new Date(logEntry.timestamp);
          expect(timestamp.getTime()).toBeGreaterThan(0);
        }

        consoleErrorSpy.mockRestore();
        jest
          .spyOn(prisma.vehicle, "findMany")
          .mockImplementation(originalFindMany);
      }),
      { numRuns: 5 },
    );
  });
});
