import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes - allow access without authentication
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/vehicles") || // Public vehicle browsing pages
    (pathname === "/api/vehicles" && request.method === "GET") || // Public vehicle list API
    (pathname.match(/^\/api\/vehicles\/[^/]+$/) && request.method === "GET") // Public vehicle detail API
  ) {
    return NextResponse.next();
  }

  // For vehicle API mutations (POST, PATCH, DELETE), require authentication
  if (pathname.startsWith("/api/vehicles") && request.method !== "GET") {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
  }

  // Authentication check - redirect to login if no session
  if (!token) {
    // For API routes, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = token.role as string;
  const kycStatus = token.kycStatus as string | null;

  // Admin routes - ADMIN only
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Owner routes - OWNER and ADMIN
  if (pathname.startsWith("/owner")) {
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Renter routes - all authenticated users can access
  if (pathname.startsWith("/renter")) {
    // No additional role check needed, authentication is sufficient
  }

  // Vehicle creation API - OWNER and ADMIN with approved KYC
  if (pathname.startsWith("/api/vehicles") && request.method === "POST") {
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (kycStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "KYC approval required to list vehicles" },
        { status: 403 },
      );
    }
  }

  // Vehicle admin actions - ADMIN only
  if (
    pathname.match(
      /^\/api\/vehicles\/[^/]+\/(accept-payment|confirm-payment|reject)$/,
    )
  ) {
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  // Booking routes - require approved KYC for creation
  if (pathname.startsWith("/api/bookings")) {
    // POST to create booking requires USER role and approved KYC
    if (request.method === "POST" && pathname === "/api/bookings") {
      if (kycStatus !== "APPROVED") {
        return NextResponse.json(
          { error: "KYC approval required to make bookings" },
          { status: 403 },
        );
      }
    }
    // Other booking operations (accept, reject, complete) require ownership validation
    // which will be handled in the API route handlers
  }

  // KYC admin routes - ADMIN only
  if (
    pathname.startsWith("/api/kyc/pending") ||
    pathname.match(/^\/api\/kyc\/[^/]+\/(approve|reject)$/)
  ) {
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/renter/:path*",
    "/vehicles/:path*", // Include public vehicle pages in matcher
    "/api/kyc/:path*",
    "/api/vehicles/:path*",
    "/api/bookings/:path*",
    "/api/admin/:path*",
  ],
};
