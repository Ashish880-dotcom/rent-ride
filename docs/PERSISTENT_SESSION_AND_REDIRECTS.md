# Persistent Sessions and Authentication Redirects

## Overview

The RentRide platform now implements persistent sessions that keep users logged in for 30 days and automatically redirects authenticated users away from public pages.

## Features Implemented

### 1. Persistent Sessions (30 Days)

Users remain logged in for 30 days unless they explicitly click the logout button.

**Configuration:**

- Session strategy: JWT
- Session duration: 30 days (2,592,000 seconds)
- Cookie max age: 30 days
- Secure cookies in production
- HTTP-only cookies for security

**File:** `src/core/lib/auth.ts`

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
},
cookies: {
  sessionToken: {
    options: {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
}
```

---

### 2. Automatic Dashboard Redirects

#### Landing Page (`/`)

Authenticated users are automatically redirected to their role-specific dashboard:

- **ADMIN** → `/admin`
- **OWNER** → `/owner`
- **USER** → `/renter`

**File:** `app/page.tsx`

```typescript
export default async function Home() {
  const session = await auth();

  if (session?.user) {
    const role = session.user.role;
    if (role === "ADMIN") {
      redirect("/admin");
    } else if (role === "OWNER") {
      redirect("/owner");
    } else {
      redirect("/renter");
    }
  }
  // ... landing page content
}
```

#### Login Page (`/login`)

Already logged-in users are redirected to their dashboard instead of seeing the login form.

**File:** `app/(auth)/login/page.tsx`

#### Register Page (`/register`)

Already logged-in users are redirected to their dashboard instead of seeing the registration form.

**File:** `app/(auth)/register/page.tsx`

---

### 3. Logout Functionality

Users can logout by clicking the "Sign out" button in the navbar.

**Location:** User profile dropdown in the top-right corner

**Behavior:**

- Clears the session
- Redirects to `/login`
- User must login again to access the platform

**Implementation:**

```typescript
const handleSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
};
```

**File:** `src/core/components/Navbar.tsx`

---

## User Flow

### First Time Login

1. User visits `/login`
2. Enters credentials
3. Successfully authenticates
4. Redirected to role-specific dashboard
5. Session cookie created (30-day expiration)

### Returning User (Within 30 Days)

1. User visits any page
2. Session is automatically validated
3. If visiting `/`, `/login`, or `/register`:
   - Automatically redirected to dashboard
4. If visiting dashboard pages:
   - Access granted immediately
5. No need to login again

### After 30 Days

1. Session expires automatically
2. User is redirected to `/login`
3. Must authenticate again

### Manual Logout

1. User clicks profile dropdown
2. Clicks "Sign out"
3. Session is cleared
4. Redirected to `/login`
5. Must authenticate to access platform again

---

## Protected Routes

### Public Routes (Unauthenticated Only)

These routes redirect authenticated users to their dashboard:

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/about` - About page
- `/services` - Services page
- `/contact` - Contact page
- `/vehicles` - Public vehicle listing

### Protected Routes (Authenticated Only)

These routes require authentication:

- `/admin/*` - Admin panel (ADMIN role only)
- `/owner/*` - Owner panel (OWNER role only)
- `/renter/*` - Renter panel (USER role only)

**Middleware:** `app/(dashboard)/layout.tsx`

```typescript
export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  // ... render dashboard
}
```

---

## Security Features

### Session Security

✅ HTTP-only cookies (cannot be accessed by JavaScript)
✅ Secure cookies in production (HTTPS only)
✅ SameSite: Lax (CSRF protection)
✅ JWT strategy (stateless, scalable)
✅ 30-day expiration (automatic cleanup)

### CSRF Protection

✅ Enabled by default in NextAuth v5
✅ CSRF tokens for state-changing operations
✅ Secure cookie configuration

### Role-Based Access

✅ Server-side role validation
✅ Automatic redirect based on role
✅ Protected API endpoints
✅ Dashboard-level access control

---

## Testing the Implementation

### Test Persistent Session

1. Login to the platform
2. Close the browser completely
3. Reopen the browser
4. Visit the site
5. ✅ You should still be logged in
6. Try accessing `/` or `/login`
7. ✅ You should be redirected to your dashboard

### Test Logout

1. While logged in, click your profile icon
2. Click "Sign out"
3. ✅ You should be redirected to `/login`
4. Try accessing dashboard pages
5. ✅ You should be redirected to `/login`

### Test Role-Based Redirects

1. Login as OWNER
2. ✅ Redirected to `/owner`
3. Try visiting `/`
4. ✅ Redirected back to `/owner`
5. Logout and login as USER
6. ✅ Redirected to `/renter`

### Test Session Expiration

1. Login to the platform
2. Wait 30 days (or manually delete cookies)
3. Try accessing any page
4. ✅ You should be redirected to `/login`

---

## Configuration Options

### Change Session Duration

Edit `src/core/lib/auth.ts`:

```typescript
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // Change to 7 days
},
```

### Change Logout Redirect

Edit `src/core/components/Navbar.tsx`:

```typescript
const handleSignOut = async () => {
  await signOut({ callbackUrl: "/" }); // Redirect to landing page
};
```

### Disable Auto-Redirect from Landing Page

Edit `app/page.tsx` and remove the redirect logic if you want authenticated users to see the landing page.

---

## Browser Compatibility

✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari
✅ Mobile browsers (iOS Safari, Chrome Mobile)

Sessions persist across:

- Browser restarts
- Tab closures
- Device restarts (cookies are saved to disk)

---

## Summary

✅ Users stay logged in for 30 days
✅ Automatic redirect to dashboard when logged in
✅ Cannot access landing page while authenticated
✅ Must click logout to sign out
✅ Secure session management with HTTP-only cookies
✅ Role-based dashboard redirects
✅ CSRF protection enabled
✅ Server-side authentication validation

The platform now provides a seamless, persistent authentication experience while maintaining security best practices!
