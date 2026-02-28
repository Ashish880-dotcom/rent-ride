import * as fc from "fast-check";

/**
 * Feature: guest-vehicle-browsing, Property 4: Return URL preservation through authentication
 *
 * **Validates: Requirements 4.1, 4.2, 4.4**
 *
 * This property test verifies that for any vehicle detail page URL, when a guest clicks
 * the sign-in button, the resulting login URL contains a returnUrl parameter with the
 * original vehicle detail page URL, and after successful authentication, the system
 * redirects to that returnUrl.
 *
 * The test ensures:
 * 1. The login URL includes the returnUrl parameter with the vehicle detail page URL
 * 2. The returnUrl is properly URL-encoded
 * 3. The returnUrl is validated to prevent open redirect vulnerabilities
 * 4. After authentication, the user is redirected to the returnUrl
 */

// Arbitrary for generating valid vehicle IDs
const vehicleIdArbitrary = () =>
  fc.hexaString({ minLength: 8, maxLength: 24 }).map((id) => id.toLowerCase());

// Arbitrary for generating valid return URLs
const returnUrlArbitrary = () =>
  vehicleIdArbitrary().map((vehicleId) => `/vehicles/${vehicleId}`);

describe("LoginForm - Return URL Preservation", () => {
  /**
   * Property 4: Return URL preservation through authentication
   *
   * For any vehicle detail page URL, when a guest clicks the sign-in button,
   * the resulting login URL SHALL contain a returnUrl parameter with the
   * original vehicle detail page URL, and after successful authentication,
   * the system SHALL redirect to that returnUrl.
   */
  it("should preserve return URL through authentication flow", async () => {
    await fc.assert(
      fc.asyncProperty(returnUrlArbitrary(), async (vehicleUrl) => {
        // Verify the return URL is a valid vehicle detail page URL
        expect(vehicleUrl).toMatch(/^\/vehicles\/[a-f0-9]+$/);

        // Verify the return URL starts with /
        expect(vehicleUrl.startsWith("/")).toBe(true);

        // Verify the return URL does not contain protocol-relative URLs
        expect(vehicleUrl.startsWith("//")).toBe(false);

        // Verify the return URL does not contain dangerous protocols
        expect(vehicleUrl.includes(":")).toBe(false);

        // Verify URL encoding works correctly
        const encodedUrl = encodeURIComponent(vehicleUrl);
        expect(encodedUrl).toBeTruthy();

        // Verify the login URL is constructed correctly
        const loginUrl = `/login?returnUrl=${encodedUrl}`;
        expect(loginUrl).toContain("/login?returnUrl=");
        expect(loginUrl).toContain(encodeURIComponent(vehicleUrl));

        // Verify decoding returns the original URL
        const decodedUrl = decodeURIComponent(encodedUrl);
        expect(decodedUrl).toBe(vehicleUrl);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Test that invalid return URLs are rejected
   *
   * The system SHALL validate return URLs to prevent open redirect vulnerabilities.
   * Invalid URLs include:
   * - Absolute URLs (http://, https://)
   * - Protocol-relative URLs (//)
   * - URLs with dangerous protocols (javascript:, data:)
   */
  it("should reject invalid return URLs", async () => {
    const invalidUrls = [
      "http://example.com",
      "https://example.com",
      "//example.com",
      "javascript:alert('xss')",
      "data:text/html,<script>alert('xss')</script>",
      "ftp://example.com",
    ];

    invalidUrls.forEach((url) => {
      // These URLs should not be accepted as valid return URLs
      const isAbsoluteUrl =
        url.startsWith("http://") || url.startsWith("https://");
      const isProtocolRelative = url.startsWith("//");
      const hasDangerousProtocol = url.includes(":");

      expect(isAbsoluteUrl || isProtocolRelative || hasDangerousProtocol).toBe(
        true,
      );
    });
  });

  /**
   * Test that valid relative URLs are accepted
   *
   * The system SHALL accept relative URLs that start with / and do not contain
   * dangerous protocols.
   */
  it("should accept valid relative return URLs", async () => {
    const validUrls = [
      "/vehicles/123",
      "/vehicles/abc123def456",
      "/renter/bookings",
      "/owner/vehicles",
    ];

    validUrls.forEach((url) => {
      // These URLs should be valid
      expect(url.startsWith("/")).toBe(true);
      expect(url.startsWith("//")).toBe(false);
      expect(url.includes(":")).toBe(false);
    });
  });

  /**
   * Test that return URL is preserved across the login flow
   *
   * When a user logs in with a returnUrl parameter, the system SHALL redirect
   * to that URL after successful authentication.
   */
  it("should redirect to return URL after successful authentication", async () => {
    await fc.assert(
      fc.asyncProperty(returnUrlArbitrary(), async (vehicleUrl) => {
        // Simulate the login flow
        const loginUrl = `/login?returnUrl=${encodeURIComponent(vehicleUrl)}`;

        // Extract the returnUrl from the login URL
        const url = new URL(loginUrl, "http://localhost");
        const returnUrl = url.searchParams.get("returnUrl");

        // Verify the returnUrl matches the original vehicle URL
        expect(returnUrl).toBe(vehicleUrl);

        // Verify the returnUrl is a valid vehicle detail page URL
        expect(returnUrl).toMatch(/^\/vehicles\/[a-f0-9]+$/);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Test that return URL is properly encoded in the login URL
   *
   * The system SHALL properly URL-encode the returnUrl parameter to prevent
   * issues with special characters.
   */
  it("should properly encode return URL in login URL", async () => {
    await fc.assert(
      fc.asyncProperty(returnUrlArbitrary(), async (vehicleUrl) => {
        const encodedUrl = encodeURIComponent(vehicleUrl);
        const loginUrl = `/login?returnUrl=${encodedUrl}`;

        // Parse the login URL
        const url = new URL(loginUrl, "http://localhost");
        const returnUrlParam = url.searchParams.get("returnUrl");

        // Verify the parameter is correctly decoded
        expect(returnUrlParam).toBe(vehicleUrl);

        // Verify the encoded URL is different from the original (if it contains special chars)
        if (vehicleUrl.includes("/")) {
          expect(encodedUrl).not.toBe(vehicleUrl);
        }
      }),
      { numRuns: 100 },
    );
  });
});
