# Role Separation in RentRide Platform

## Overview

The platform has three distinct roles with separate responsibilities and access levels. Each role is stored in the database and enforced throughout the application.

## Role Definitions

### 1. ADMIN (Administrator)

**Database Value:** `Role.ADMIN`

**Description:** The head administrator with full system access and control.

**Capabilities:**

- View all users, vehicles, and bookings in the system
- Review and approve/reject KYC submissions
- Review and approve/reject vehicle listings from owners
- Manage payment confirmations for vehicle listings
- Add vehicles on behalf of owners (through `/api/admin/vehicles`)
- Delete any vehicle from the system
- View comprehensive statistics and analytics
- Access admin-only endpoints and dashboards

**Dashboard:** `/admin`

**Key Endpoints:**

- `POST /api/admin/vehicles` - Add vehicle for any owner
- `DELETE /api/vehicles/[id]` - Delete any vehicle
- `PATCH /api/vehicles/[id]/accept-payment` - Accept vehicle for payment
- `PATCH /api/vehicles/[id]/confirm-payment` - Confirm payment and approve
- `PATCH /api/vehicles/[id]/reject` - Reject vehicle listing
- `GET /api/admin/stats` - View system statistics
- `GET /api/admin/users` - View all users
- `PATCH /api/kyc/[id]/approve` - Approve KYC
- `PATCH /api/kyc/[id]/reject` - Reject KYC

**KYC Requirement:** No (admins don't need KYC)

---

### 2. OWNER (Vehicle Owner)

**Database Value:** `Role.OWNER`

**Description:** Users who own vehicles and want to list them for rent on the platform.

**Capabilities:**

- Submit KYC documents for verification
- List their own vehicles for rent (after KYC approval)
- View and manage their own vehicle listings
- View bookings for their vehicles
- Accept or reject booking requests
- View earnings and statistics for their vehicles
- Cannot access admin features
- Cannot view other owners' vehicles or data

**Dashboard:** `/owner`

**Key Endpoints:**

- `POST /api/vehicles` - Create vehicle listing (OWNER only)
- `GET /api/vehicles` - View own vehicles
- `POST /api/kyc` - Submit KYC documents
- `GET /api/kyc/status` - Check KYC status
- `GET /api/bookings/owner` - View bookings for their vehicles
- `PATCH /api/bookings/[id]/accept` - Accept booking
- `PATCH /api/bookings/[id]/reject` - Reject booking
- `GET /api/owner/stats` - View own statistics

**KYC Requirement:** Yes (must have approved KYC to list vehicles)

---

### 3. USER (Vehicle Renter)

**Database Value:** `Role.USER`

**Description:** Regular users who want to rent vehicles from the platform.

**Capabilities:**

- Browse approved vehicles
- Search and filter vehicles by location, price, etc.
- View vehicle details and reviews
- Book vehicles for specific dates
- View their own bookings
- Leave feedback/reviews after completed rentals
- Cannot list vehicles
- Cannot access owner or admin features

**Dashboard:** `/renter`

**Key Endpoints:**

- `GET /api/vehicles` - Browse approved vehicles
- `GET /api/vehicles/[id]` - View vehicle details
- `POST /api/bookings` - Create booking
- `GET /api/bookings/renter` - View own bookings
- `POST /api/bookings/[id]/feedback` - Leave feedback

**KYC Requirement:** No (renters don't need KYC)

---

## Database Schema

```prisma
enum Role {
  ADMIN   // Administrator
  OWNER   // Vehicle Owner
  USER    // Vehicle Renter
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      // One of: ADMIN, OWNER, USER
  // ... other fields
}
```

## Role Enforcement

### API Level

All API endpoints check the user's role before allowing access:

```typescript
// Example: Owner-only endpoint
if (session.user.role !== Role.OWNER) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Example: Admin-only endpoint
if (session.user.role !== Role.ADMIN) {
  return NextResponse.json({ error: "Admin access required" }, { status: 403 });
}
```

### Dashboard Level

Each role has a separate dashboard with role-specific navigation:

- **Admin Dashboard:** `/admin` - Full system management
- **Owner Dashboard:** `/owner` - Vehicle and booking management
- **Renter Dashboard:** `/renter` - Browse and book vehicles

### Middleware Protection

The authentication middleware redirects users to their appropriate dashboard based on role.

## Key Differences

| Feature           | ADMIN           | OWNER         | USER               |
| ----------------- | --------------- | ------------- | ------------------ |
| View all vehicles | ✅              | ❌ (own only) | ❌ (approved only) |
| Add vehicles      | ✅ (for others) | ✅ (own)      | ❌                 |
| Delete vehicles   | ✅ (any)        | ❌            | ❌                 |
| Approve vehicles  | ✅              | ❌            | ❌                 |
| Approve KYC       | ✅              | ❌            | ❌                 |
| Book vehicles     | ❌              | ❌            | ✅                 |
| List vehicles     | ❌              | ✅            | ❌                 |
| Needs KYC         | ❌              | ✅            | ❌                 |
| View all users    | ✅              | ❌            | ❌                 |
| System stats      | ✅              | ❌ (own only) | ❌                 |

## Workflow Examples

### Owner Lists a Vehicle

1. Owner registers with `role: OWNER`
2. Owner submits KYC documents
3. Admin reviews and approves KYC
4. Owner creates vehicle listing via `POST /api/vehicles`
5. Vehicle status: `PENDING`
6. Admin reviews vehicle
7. Admin accepts for payment via `PATCH /api/vehicles/[id]/accept-payment`
8. Vehicle status: `AWAITING_PAYMENT`
9. Owner makes payment
10. Admin confirms payment via `PATCH /api/vehicles/[id]/confirm-payment`
11. Vehicle status: `APPROVED`
12. Vehicle now visible to renters

### Admin Adds Vehicle for Owner

1. Admin logs into admin dashboard
2. Admin navigates to "Add Vehicle for Owner" tab
3. Admin selects owner from dropdown (must have approved KYC)
4. Admin fills vehicle details
5. Admin submits via `POST /api/admin/vehicles`
6. Vehicle status: `APPROVED` (auto-approved, bypasses review)
7. Vehicle immediately visible to renters

### User Rents a Vehicle

1. User registers with `role: USER`
2. User browses vehicles at `/renter/vehicles`
3. User views vehicle details
4. User creates booking via `POST /api/bookings`
5. Booking status: `PENDING`
6. Owner reviews and accepts booking
7. Booking status: `CONFIRMED`
8. After rental, user leaves feedback

## Security Notes

- Roles are immutable after account creation (cannot be changed by users)
- All role checks happen server-side (never trust client-side role checks)
- Each API endpoint validates the user's role before processing
- Admins cannot impersonate other users (separate admin actions)
- Owner vehicles are isolated (owners can only see/manage their own)
- KYC is required for owners but not for admins or renters

## Registration

Users select their role during registration:

- **Want to rent vehicles?** → Register as USER
- **Want to list vehicles for rent?** → Register as OWNER
- **System administrator?** → Created manually with ADMIN role

Admins are typically created through database seeding or manual database insertion, not through public registration.
