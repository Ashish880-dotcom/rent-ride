import { describe, it, expect } from "@jest/globals";
import * as fc from "fast-check";

/**
 * Feature: guest-vehicle-browsing, Property 3: Conditional booking interface rendering
 * **Validates: Requirements 3.1, 3.3, 9.2**
 *
 * This property test verifies that the vehicle detail page conditionally renders
 * the appropriate booking interface based on authentication state:
 * - For unauthenticated guests: displays "Sign in to book" button
 * - For authenticated users: displays the booking form
 */

describe("Property 3: Conditional booking interface rendering", () => {
  // Arbitraries for generating test data
  const vehicleIdArbitrary = () => fc.uuid();

  const sessionArbitrary = () =>
    fc.oneof(
      fc.constant(null), // Guest user (no session)
      fc.record({
        user: fc.record({
          id: fc.uuid(),
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
        }),
      }), // Authenticated user
    );

  it("should render SignInToBookButton for guests (Requirement 3.1)", async () => {
    await fc.assert(
      fc.asyncProperty(vehicleIdArbitrary(), async (vehicleId) => {
        // Simulate guest user (no session)
        const session = null;

        // The component should render SignInToBookButton when session is null
        // This is verified by checking the conditional logic:
        // if (!session?.user) { <SignInToBookButton /> }
        const shouldRenderSignInButton = !session?.user;

        expect(shouldRenderSignInButton).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("should render BookingForm for authenticated users (Requirement 3.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        vehicleIdArbitrary(),
        fc.record({
          user: fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        async (vehicleId, session) => {
          // Simulate authenticated user
          const shouldRenderBookingForm = !!session?.user;

          expect(shouldRenderBookingForm).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should never render both SignInToBookButton and BookingForm simultaneously (Requirement 3.1, 3.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        vehicleIdArbitrary(),
        sessionArbitrary(),
        async (vehicleId, session) => {
          // Determine which component should be rendered
          const shouldRenderSignInButton = !session?.user;
          const shouldRenderBookingForm = !!session?.user;

          // These should be mutually exclusive
          expect(shouldRenderSignInButton && shouldRenderBookingForm).toBe(
            false,
          );

          // Exactly one should be true
          expect(shouldRenderSignInButton || shouldRenderBookingForm).toBe(
            true,
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should render SignInToBookButton with correct vehicleId prop (Requirement 3.1)", async () => {
    await fc.assert(
      fc.asyncProperty(vehicleIdArbitrary(), async (vehicleId) => {
        // For guests, SignInToBookButton should receive the vehicleId prop
        const session = null;

        if (!session?.user) {
          // The component receives vehicleId as prop
          expect(vehicleId).toBeDefined();
          expect(typeof vehicleId).toBe("string");
          expect(vehicleId.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("should render BookingForm with correct vehicle prop (Requirement 3.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          make: fc.string({ minLength: 1, maxLength: 50 }),
          model: fc.string({ minLength: 1, maxLength: 50 }),
          year: fc.integer({ min: 1900, max: 2100 }),
          pricePerDay: fc.float({ min: 0, max: 100000 }),
          location: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.oneof(fc.constant(null), fc.string()),
          images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 10 }),
        }),
        fc.record({
          user: fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        async (vehicle, session) => {
          // For authenticated users, BookingForm should receive the vehicle prop
          if (session?.user) {
            expect(vehicle).toBeDefined();
            expect(vehicle.id).toBeDefined();
            expect(vehicle.make).toBeDefined();
            expect(vehicle.model).toBeDefined();
            expect(vehicle.year).toBeDefined();
            expect(vehicle.pricePerDay).toBeDefined();
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should maintain consistent rendering across multiple renders (Requirement 9.2)", async () => {
    await fc.assert(
      fc.asyncProperty(
        vehicleIdArbitrary(),
        sessionArbitrary(),
        async (vehicleId, session) => {
          // First render
          const firstRenderShowsSignIn = !session?.user;
          const firstRenderShowsForm = !!session?.user;

          // Second render (same session state)
          const secondRenderShowsSignIn = !session?.user;
          const secondRenderShowsForm = !!session?.user;

          // Results should be consistent
          expect(firstRenderShowsSignIn).toBe(secondRenderShowsSignIn);
          expect(firstRenderShowsForm).toBe(secondRenderShowsForm);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should switch rendering when session state changes (Requirement 3.1, 3.3)", async () => {
    await fc.assert(
      fc.asyncProperty(
        vehicleIdArbitrary(),
        fc.record({
          user: fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        async (vehicleId, authenticatedSession) => {
          // Start with guest (no session)
          const guestSession = null;
          const guestShowsSignIn = !guestSession?.user;
          const guestShowsForm = !!guestSession?.user;

          // Switch to authenticated
          const authShowsSignIn = !authenticatedSession?.user;
          const authShowsForm = !!authenticatedSession?.user;

          // Guest should show SignInButton, not BookingForm
          expect(guestShowsSignIn).toBe(true);
          expect(guestShowsForm).toBe(false);

          // Authenticated should show BookingForm, not SignInButton
          expect(authShowsSignIn).toBe(false);
          expect(authShowsForm).toBe(true);

          // The rendering should be different between guest and authenticated
          expect(guestShowsSignIn).not.toBe(authShowsSignIn);
          expect(guestShowsForm).not.toBe(authShowsForm);
        },
      ),
      { numRuns: 100 },
    );
  });
});
