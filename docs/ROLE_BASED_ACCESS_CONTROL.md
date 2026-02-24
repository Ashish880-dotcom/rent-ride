# Role-Based Access Control (RBAC) Documentation

## Overview

The RentRide platform implements a three-tier role-based access control system with distinct permissions for each role type.

## Role Types

### 1. USER (Renter)

**Purpose**: Regular users who rent vehicles

**Permissions**:

- ✅ Browse approved vehicles
- ✅ Create booking requests
- ✅ View their own bookings
- ✅ Provide feedback on completed rentals
- ✅ View their profile and statistics
- ❌ Cannot add vehicles
- ❌ Cannot remove vehicles
- ❌ Cannot access admin features
- ❌ Cannot access owner features

**Registration**: Available through public registration form

**Dashboard**: `/renter`

---

### 2. OWNER (Vehicle Owner)

**Purpose**: Users who list their vehicles for rent

**Permissions**:

- ✅ Add their own vehicles (requires KYC approval)
- ✅ Remove/edit their own vehicles
- ✅ View booking requests for their vehicles
- ✅ Accept/reject booking requests
- ✅ Complete bookings
- ✅ View their vehicle statistics
- ❌ Cannot add vehicles for other owners
- ❌ Cannot remove other owners' vehicles
- ❌ Cannot access admin features
- ❌ Cannot rent vehicles (owner-specific role)

**Registration**: Available through public registration form

**Requirements**:

- Must complete KYC verification before listing vehicles
- Vehicles must be approved by admin before becoming visible to renters

**Dashboard**: `/owner`

**Vehicle Approval Flow**:

1. Owner submits vehicle listing → Status: `PENDING`
2. Admin reviews and approves → Status: `AWAITING_PAYMENT` (if payment required)
3. Admin confirms payment → Status: `APPROVED`
4. Vehicle becomes visible to renters

---

### 3. ADMIN (Administrator)

**Purpose**: Platform administrators with full control

**Permissions**:

- ✅ Review and approve/reject KYC submissions
- ✅ Review and approve/reject vehicle listings
- ✅ Add vehicles on behalf of owners (auto-approved)
- ✅ Delete any vehicle
- ✅ View all users
- ✅ View all bookings
- ✅ Access platform statistics
- ✅ Full system access

**Registration**: ❌ NOT available through public registration

**Creation**: Must be created directly in the database or through admin tools

**Dashboard**: `/admin`

---

## Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      // ADMIN | OWNER | USER
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  kyc           KYC?
  vehicles      Vehicle[]  // Only populated for OWNER role
  bookings      Booking[]  // Only populated for USER role
  feedbacks     Feedback[]
}
```

### Role Enum

```prisma
enum Role {
  ADMIN   // Platform administrator
  OWNER   // Vehicle owner
  USER    // Vehicle renter
}
```

---

## API Endpoint Access Control

### Registration Endpoint

**POST** `/api/auth/register`

**Allowed Roles**: OWNER, USER only

**Validation**:

```typescript
// Extra security: Prevent ADMIN role registration
if (role === "ADMIN") {
  return NextResponse.json(
    { error: "Cannot register as administrator through public registration" },
    { status: 403 },
  );
}
```

---

### Vehicle Creation Endpoint

**POST** `/api/vehicles`

**Allowed Roles**: OWNER only

**Validation**:

```typescript
// Check if user has OWNER role
if (session.user.role !== Role.OWNER) {
  return NextResponse.json(
    { error: "Only vehicle owners can list vehicles through this endpoint" },
    { status: 403 },
  );
}

// Check if user has APPROVED KYC
const userKYC = await prisma.kYC.findUnique({
  where: { userId: session.user.id },
});

if (!userKYC || userKYC.status !== KYCStatus.APPROVED) {
  return NextResponse.json(
    { error: "KYC approval required to list vehicles" },
    { status: 403 },
  );
}
```

---

### Admin Vehicle Creation Endpoint

**POST** `/api/admin/vehicles`

**Allowed Roles**: ADMIN only

**Features**:

- Can add vehicles on behalf of any owner
- Vehicles are auto-approved (skip approval workflow)
- No KYC check required

---

### Vehicle Retrieval Endpoint

**GET** `/api/vehicles`

**Access Control**:

- **USER**: Returns only APPROVED vehicles
- **OWNER**: Returns only their own vehicles (all statuses)
- **ADMIN**: Returns all vehicles (can filter by status)
- **Unauthenticated**: Returns only APPROVED vehicles

---

## Frontend Access Control

### Dashboard Routing

```typescript
// app/(dashboard)/layout.tsx
const getNavItems = (): NavItem[] => {
  if (role === "ADMIN") {
    return [
      { label: "Dashboard", href: "/admin" },
      { label: "KYC Review", href: "/admin/kyc" },
      { label: "Vehicles", href: "/admin/vehicles" },
      { label: "Users", href: "/admin/users" },
    ];
  }

  if (role === "OWNER") {
    return [
      { label: "Owner Dashboard", href: "/owner" },
      { label: "Owner Profile", href: "/owner/profile" },
      { label: "Add Your Vehicles", href: "/owner/vehicles/new" },
      { label: "My Vehicles", href: "/owner/vehicles" },
      { label: "Bookings", href: "/owner/bookings" },
    ];
  }

  // USER/Renter role
  return [
    { label: "Dashboard", href: "/renter" },
    { label: "Browse Vehicles", href: "/renter/vehicles" },
    { label: "My Bookings", href: "/renter/bookings" },
    { label: "Profile", href: "/renter/profile" },
  ];
};
```

---

## Security Measures

### 1. Registration Security

- ✅ ADMIN role cannot be registered through public form
- ✅ Frontend validation prevents ADMIN selection
- ✅ Backend validation rejects ADMIN registration attempts
- ✅ Schema validation enforces role constraints

### 2. Vehicle Management Security

- ✅ Only OWNER role can create vehicles via `/api/vehicles`
- ✅ Only ADMIN role can create vehicles via `/api/admin/vehicles`
- ✅ Owners can only manage their own vehicles
- ✅ KYC approval required before listing vehicles
- ✅ Admin approval required before vehicles become visible

### 3. API Security

- ✅ All protected endpoints check authentication
- ✅ Role-based authorization on all sensitive operations
- ✅ Owner ID verification for vehicle operations
- ✅ Renter ID verification for booking operations

---

## Key Differences Between Roles

| Feature                 | USER | OWNER | ADMIN |
| ----------------------- | ---- | ----- | ----- |
| Register via form       | ✅   | ✅    | ❌    |
| Browse vehicles         | ✅   | ✅    | ✅    |
| Rent vehicles           | ✅   | ❌    | ❌    |
| Add own vehicles        | ❌   | ✅    | ✅    |
| Add vehicles for others | ❌   | ❌    | ✅    |
| Delete own vehicles     | ❌   | ✅    | ✅    |
| Delete any vehicle      | ❌   | ❌    | ✅    |
| Approve vehicles        | ❌   | ❌    | ✅    |
| Approve KYC             | ❌   | ❌    | ✅    |
| View all users          | ❌   | ❌    | ✅    |
| Requires KYC            | ❌   | ✅    | ❌    |

---

## Summary

The system is properly configured with three distinct roles:

1. **USER (Renter)**: Can only browse and rent vehicles
2. **OWNER**: Can add and manage their own vehicles (with KYC and admin approval)
3. **ADMIN**: Full platform control, cannot be registered publicly

All role-based restrictions are enforced at multiple levels:

- Database schema (Role enum)
- API validation (role checks)
- Frontend routing (role-based navigation)
- Business logic (KYC requirements, approval workflows)

This ensures that users cannot access features outside their role permissions, and the system maintains proper separation of concerns between renters, owners, and administrators.
