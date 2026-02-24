# CSRF Protection

## Overview

The RentRide application implements comprehensive Cross-Site Request Forgery (CSRF) protection through multiple layers:

1. **NextAuth Built-in Protection**: Automatic CSRF token management
2. **Cookie Security**: Secure cookie attributes (HttpOnly, SameSite, Secure)
3. **Origin Validation**: Request origin and referer header validation
4. **Session-based Protection**: All state-changing operations require authentication

## How It Works

### 1. NextAuth CSRF Tokens

NextAuth v5 automatically generates and validates CSRF tokens for all authentication-related operations:

- CSRF tokens are stored in HTTP-only cookies
- Tokens are validated on every state-changing request
- Tokens are automatically rotated on each request

### 2. Cookie Configuration

```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
    options: {
      httpOnly: true,        // Prevents JavaScript access
      sameSite: "lax",       // Prevents cross-site request forgery
      path: "/",
      secure: true,          // HTTPS only in production
    },
  },
  csrfToken: {
    name: `${process.env.NODE_ENV === "production" ? "__Host-" : ""}next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
    },
  },
}
```

### 3. Origin and Referer Validation

The `validateCSRF` utility performs additional checks:

```typescript
// Validates Origin header
const origin = request.headers.get("origin");
const host = request.headers.get("host");
if (origin && host) {
  const originUrl = new URL(origin);
  if (originUrl.host !== host) {
    return false; // Reject cross-origin requests
  }
}

// Validates Referer header
const referer = request.headers.get("referer");
if (referer && host) {
  const refererUrl = new URL(referer);
  if (refererUrl.host !== host) {
    return false; // Reject requests from different origins
  }
}
```

## Protected Operations

All state-changing HTTP methods are protected:

- **POST**: Creating new resources (vehicles, bookings, feedback, KYC)
- **PUT**: Updating entire resources
- **PATCH**: Partial updates (approving KYC, accepting bookings, vehicle status changes)
- **DELETE**: Deleting resources

## Implementation

### Automatic Protection

All API routes that use NextAuth's `auth()` function automatically benefit from CSRF protection:

```typescript
import { auth } from "@/core/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth(); // CSRF validation happens here

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your route logic here
}
```

### Manual Validation (Optional)

For additional protection, you can use the CSRF utility:

```typescript
import { requireCSRFProtection } from "@/core/utils/csrf";

export async function POST(request: NextRequest) {
  try {
    await requireCSRFProtection(request);
    // Your route logic here
  } catch (error) {
    return NextResponse.json(
      { error: "CSRF validation failed" },
      { status: 403 },
    );
  }
}
```

### Using the Wrapper

You can wrap your entire route handler:

```typescript
import { withCSRFProtection } from "@/core/utils/csrf";

async function handlePost(request: NextRequest) {
  // Your route logic here
}

export const POST = withCSRFProtection(handlePost);
```

## Client-Side Considerations

### Form Submissions

When using NextAuth's `signIn` function, CSRF tokens are automatically included:

```typescript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

### API Calls

For API calls from client components, ensure you're making same-origin requests:

```typescript
const response = await fetch("/api/vehicles", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
  credentials: "same-origin", // Important: includes cookies
});
```

## Testing CSRF Protection

### Valid Request

```bash
curl -X POST https://yourapp.com/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -H "Origin: https://yourapp.com" \
  -d '{"make":"Toyota","model":"Camry",...}'
```

### Invalid Request (Different Origin)

```bash
curl -X POST https://yourapp.com/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -H "Origin: https://malicious-site.com" \
  -d '{"make":"Toyota","model":"Camry",...}'
```

This request will be rejected due to origin mismatch.

## Security Best Practices

1. **Always use HTTPS in production**: Set `secure: true` for cookies
2. **Use SameSite cookies**: Prevents CSRF attacks from external sites
3. **Validate Origin and Referer**: Additional layer of protection
4. **Require authentication**: All state-changing operations need valid sessions
5. **Use HTTP-only cookies**: Prevents XSS attacks from stealing tokens

## Troubleshooting

### CSRF Validation Fails

1. **Check cookie settings**: Ensure cookies are being sent with requests
2. **Verify Origin header**: Make sure requests are same-origin
3. **Check HTTPS**: In production, ensure all requests use HTTPS
4. **Browser extensions**: Some extensions may interfere with cookies

### Development vs Production

- Development: Uses non-secure cookies for localhost
- Production: Uses `__Secure-` and `__Host-` prefixed cookies with secure flag

## References

- [NextAuth.js CSRF Protection](https://next-auth.js.org/configuration/options#cookies)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
