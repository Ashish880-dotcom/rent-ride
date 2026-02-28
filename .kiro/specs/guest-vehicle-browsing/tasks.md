# Implementation Plan: Guest Vehicle Browsing

## Overview

This implementation plan breaks down the guest vehicle browsing feature into discrete coding tasks. The feature enables unauthenticated users to browse vehicles and view details before signing in, while maintaining security for booking and payment operations. Implementation follows a 6-phase approach: middleware/API updates, public pages, authentication flow, SEO optimization, testing, and documentation.

## Tasks

- [x] 1. Update middleware to allow public vehicle routes
  - Modify `src/middleware.ts` to exclude `/vehicles`, `/vehicles/[id]`, and GET requests to `/api/vehicles` and `/api/vehicles/[id]` from authentication requirements
  - Add logic to allow GET requests while protecting POST, PATCH, DELETE operations
  - Ensure all booking, payment, and profile routes remain protected
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 1.1 Write property test for protected routes
  - **Property 7: Protected routes remain protected**
  - **Validates: Requirements 6.5, 7.1, 7.2, 7.3, 7.7**

- [-] 2. Implement conditional authentication in vehicle API
  - [x] 2.1 Update GET /api/vehicles to return APPROVED vehicles for unauthenticated requests
    - Modify `app/api/vehicles/route.ts` GET handler to check for session
    - If no session, query only vehicles with status APPROVED
    - Maintain existing authenticated logic for role-based filtering
    - _Requirements: 5.1, 1.5_

  - [x] 2.2 Write property test for guest API requests
    - **Property 1: Guest API requests return only approved vehicles**
    - **Validates: Requirements 1.5, 5.1**

  - [x] 2.3 Update GET /api/vehicles/[id] to return APPROVED vehicles for unauthenticated requests
    - Modify `app/api/vehicles/[id]/route.ts` GET handler to check for session
    - If no session, query vehicle with status APPROVED filter
    - Return 404 if vehicle not found or not APPROVED
    - Maintain existing authenticated logic
    - _Requirements: 5.2, 5.3_

  - [-] 2.4 Write property test for non-approved vehicle hiding
    - **Property 2: Non-approved vehicles are hidden from guests**
    - **Validates: Requirements 5.2, 5.3, 10.2**

  - [x] 2.5 Add input validation for filter parameters
    - Create Zod schema for location, minPrice, maxPrice parameters
    - Validate and sanitize all query parameters
    - Return 400 error for invalid inputs
    - _Requirements: 1.3_

  - [x] 2.6 Ensure vehicle data format consistency
    - Verify response format is identical for authenticated and unauthenticated requests
    - Include vehicle details, owner info (sanitized), and feedback
    - _Requirements: 5.5_

  - [ ] 2.7 Write property test for data format consistency
    - **Property 6: Vehicle data format consistency**
    - **Validates: Requirements 5.5**

  - [x] 2.8 Enforce authentication for mutation operations
    - Ensure POST, PATCH, DELETE operations check for session
    - Return 401 Unauthorized if no session present
    - _Requirements: 5.4, 7.4, 7.5, 7.6_

  - [ ] 2.9 Write property test for mutation authentication
    - **Property 5: Mutation operations require authentication**
    - **Validates: Requirements 5.4, 6.6, 7.4, 7.5, 7.6**

- [ ] 3. Checkpoint - Ensure API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 4. Update public vehicle collection page
  - [x] 4.1 Modify app/vehicles/page.tsx to work without authentication
    - Remove authentication requirement from page component
    - Fetch vehicles from /api/vehicles without auth header
    - Display vehicle cards with image, make, model, year, price, location
    - _Requirements: 1.1, 1.2_

  - [x] 4.2 Implement filtering functionality for guests
    - Add filter controls for location and price range
    - Update API calls with filter parameters
    - _Requirements: 1.3_

  - [ ] 4.3 Write property test for filtering
    - **Property 11: Filtering returns matching vehicles**
    - **Validates: Requirements 1.3**

  - [ ] 4.4 Implement sorting functionality for guests
    - Add sort controls for price and year
    - Update API calls with sort parameters
    - _Requirements: 1.4_

  - [ ] 4.5 Write property test for sorting
    - **Property 12: Sorting orders vehicles correctly**
    - **Validates: Requirements 1.4**

  - [x] 4.6 Add error handling for empty results
    - Display "No vehicles found" message when filters return no results
    - Add "Clear filters" button
    - _Requirements: 10.4_

  - [ ] 4.7 Write property test for vehicle collection display
    - **Property 8: Vehicle collection displays required fields**
    - **Validates: Requirements 1.2**

- [-] 5. Create public vehicle detail page
  - [x] 5.1 Create app/vehicles/[id]/page.tsx for public vehicle details
    - Implement server-side data fetching without authentication
    - Fetch vehicle details from /api/vehicles/[id]
    - Handle 404 for non-existent or non-APPROVED vehicles
    - _Requirements: 2.1, 2.5_

  - [x] 5.2 Display complete vehicle information
    - Render vehicle images, specifications, pricing, location, availability
    - Display feedback list with ratings and comments
    - Calculate and display average rating
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ] 5.3 Write property test for vehicle detail display
    - **Property 9: Vehicle detail displays complete information**
    - **Validates: Requirements 2.2, 2.3**

  - [ ] 5.4 Write property test for average rating calculation
    - **Property 10: Average rating calculation**
    - **Validates: Requirements 2.4**

  - [x] 5.5 Add error handling for vehicle not found
    - Display 404 page with link to vehicle collection
    - Handle API failures with retry option
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 6. Implement SignInToBookButton component
  - [x] 6.1 Create src/features/vehicles/components/SignInToBookButton.tsx
    - Accept vehicleId as prop
    - Display "Sign in to book" text with primary styling
    - Build login URL with returnUrl parameter
    - Navigate to login page on click
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 6.2 Implement conditional rendering in vehicle detail page
    - Check session state using useSession or server-side auth
    - Render SignInToBookButton for guests
    - Render BookingForm for authenticated users
    - _Requirements: 3.1, 3.3_

  - [x] 6.3 Write property test for conditional rendering
    - **Property 3: Conditional booking interface rendering**
    - **Validates: Requirements 3.1, 3.3, 9.2**

- [ ] 7. Checkpoint - Ensure UI tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement return URL handling in authentication flow
  - [x] 8.1 Update login page to accept returnUrl parameter
    - Modify app/(auth)/login/page.tsx to read returnUrl from query params
    - Store returnUrl in component state or form data
    - _Requirements: 4.1_

  - [x] 8.2 Update authentication callback to redirect to returnUrl
    - After successful authentication, check for returnUrl
    - Redirect to returnUrl if present, otherwise redirect to default page
    - Ensure returnUrl is validated to prevent open redirect vulnerabilities
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 8.3 Write property test for return URL preservation
    - **Property 4: Return URL preservation through authentication**
    - **Validates: Requirements 4.1, 4.2, 4.4**

- [x] 9. Implement SEO optimization for vehicle collection page
  - [x] 9.1 Add static meta tags to app/vehicles/page.tsx
    - Define metadata export with title, description, Open Graph, Twitter Card
    - Include canonical URL
    - _Requirements: 8.1_

  - [x] 9.2 Ensure server-side rendering for vehicle collection
    - Verify page uses server components for initial render
    - Confirm vehicle data is included in initial HTML response
    - _Requirements: 8.4_

- [~] 10. Implement SEO optimization for vehicle detail page
  - [x] 10.1 Add dynamic meta tags to app/vehicles/[id]/page.tsx
    - Implement generateMetadata function to create vehicle-specific meta tags
    - Include vehicle make, model, year, price in title and description
    - Add Open Graph and Twitter Card images from vehicle images
    - Include canonical URL with vehicle ID
    - _Requirements: 8.2, 8.5_

  - [x] 10.2 Add structured data markup for vehicle listings
    - Create generateStructuredData function for Schema.org Product markup
    - Include vehicle name, description, images, brand, offers, and aggregate rating
    - Render JSON-LD script tag in page component
    - _Requirements: 8.3_

  - [ ] 10.3 Write property test for dynamic meta tags
    - **Property 13: Dynamic meta tags contain vehicle information**
    - **Validates: Requirements 8.2**

  - [~] 10.4 Write property test for server-side rendering
    - **Property 14: Server-side rendering includes content**
    - **Validates: Requirements 8.4**

- [x] 11. Generate sitemap and robots.txt
  - [x] 11.1 Create app/sitemap.ts for dynamic sitemap generation
    - Query all APPROVED vehicles from database
    - Generate sitemap entries for /vehicles and /vehicles/[id] routes
    - Include lastModified, changeFrequency, and priority
    - _Requirements: 8.5_

  - [x] 11.2 Create app/robots.ts for search engine directives
    - Allow all public routes
    - Disallow /renter/, /owner/, /admin/, /api/ routes
    - Include sitemap URL
    - _Requirements: 8.5_

- [~] 12. Implement rate limiting for public API endpoints
  - Create rate limiting utility function
  - Apply rate limiting to /api/vehicles and /api/vehicles/[id] for unauthenticated requests
  - Use IP-based throttling with 100 requests per 15 minutes
  - Return 429 Too Many Requests when limit exceeded
  - _Requirements: Security consideration_

- [x] 13. Add error logging for guest browsing operations
  - [x] 13.1 Create centralized error logging utility
    - Implement logError function with context parameters
    - Log to console and monitoring service
    - Include userId, vehicleId, operation, isGuest, timestamp
    - _Requirements: 10.5_

  - [x] 13.2 Add error logging to API routes
    - Wrap API operations in try-catch blocks
    - Log errors with appropriate context
    - Return generic error messages to clients
    - _Requirements: 10.5_

  - [x] 13.3 Write property test for error logging
    - **Property 16: Error logging**
    - **Validates: Requirements 10.5**

- [~] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 15. Verify authenticated user experience preservation
  - [-] 15.1 Test authenticated vehicle collection access
    - Verify /renter/vehicles continues to work for authenticated users
    - Verify role-based filtering (OWNER sees own vehicles, RENTER sees APPROVED)
    - _Requirements: 9.1, 9.3_

  - [-] 15.2 Test authenticated vehicle detail access
    - Verify /renter/vehicles/[id] displays BookingForm for authenticated users
    - Verify existing navigation patterns work
    - _Requirements: 9.2, 9.4_

  - [-] 15.3 Write property test for authenticated user experience
    - **Property 15: Authenticated user experience preservation**
    - **Validates: Requirements 9.1, 9.3, 9.5**

- [~] 16. Write unit tests for edge cases
  - Test vehicle with empty images array shows placeholder
  - Test vehicle with no feedback shows 0.0 rating
  - Test long vehicle description truncation in card view
  - Test special characters in location are properly encoded
  - Test login without returnUrl redirects to default page
  - Test non-existent vehicle returns 404 with link to collection
  - Test API failure shows retry button
  - Test empty filter results show clear filters button

- [~] 17. Write integration tests for protected operations
  - Test booking creation requires authentication (401)
  - Test payment operations require authentication (401)
  - Test profile operations require authentication (401)
  - Test vehicle creation requires authentication (401)
  - Test vehicle modification requires authentication (401)
  - Test vehicle deletion requires authentication (401)

- [~] 18. Final checkpoint - Complete testing and validation
  - Run full test suite (unit, property, integration)
  - Verify all 16 correctness properties pass
  - Verify all acceptance criteria are met
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript with Next.js App Router
- All public routes use server-side rendering for SEO optimization
- Rate limiting and error logging ensure security and observability
