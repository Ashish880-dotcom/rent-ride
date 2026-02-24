# Admin Registration Restriction

## Overview

The ADMIN role has been removed from public registration to ensure only one administrator exists in the system. Admin accounts must be created manually through the database.

## Changes Made

### 1. Registration Form Updated

**File:** `src/features/authentication/components/RegisterForm.tsx`

**Changes:**

- Removed "Administrator" option from role dropdown
- Updated role type to only include `OWNER` and `USER`
- Changed label from "Role" to "I want to"
- Updated options to be more user-friendly:
  - "Rent Vehicles" (USER)
  - "List My Vehicles for Rent" (OWNER)

**Before:**

```typescript
type Role = "ADMIN" | "OWNER" | "USER";

<option value="USER">Renter</option>
<option value="OWNER">Vehicle Owner</option>
<option value="ADMIN">Administrator</option>
```

**After:**

```typescript
type Role = "OWNER" | "USER";

<option value="USER">Rent Vehicles</option>
<option value="OWNER">List My Vehicles for Rent</option>
```

---

### 2. Validation Schema Updated

**File:** `src/core/utils/validation.ts`

**Changes:**

- Updated `RegisterSchema` to only accept `OWNER` or `USER` roles
- Added custom error message for invalid roles

**Before:**

```typescript
export const RegisterSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
  role: RoleSchema, // Allows ADMIN, OWNER, USER
});
```

**After:**

```typescript
export const RegisterSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
  role: z.enum(["OWNER", "USER"], {
    errorMap: () => ({ message: "Role must be either OWNER or USER" }),
  }),
});
```

---

### 3. API Endpoint Protection

**File:** `app/api/auth/register/route.ts`

**Changes:**

- Added extra security check to prevent ADMIN role registration
- Returns 403 Forbidden if someone tries to register as ADMIN

**Added Code:**

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

## Security Layers

### Layer 1: Frontend Validation

- ADMIN option not visible in registration form
- TypeScript type only allows `OWNER` or `USER`

### Layer 2: Schema Validation

- Zod schema rejects any role other than `OWNER` or `USER`
- Custom error message for invalid roles

### Layer 3: API Validation

- Extra check in registration endpoint
- Returns 403 Forbidden for ADMIN role attempts
- Prevents direct API calls from bypassing frontend

---

## How to Create Admin Accounts

Since ADMIN cannot be registered through the public registration form, admin accounts must be created manually.

### Method 1: Database Seeding (Recommended)

Create a seed script to add the admin user:

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("your-secure-password", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rentride.com" },
    update: {},
    create: {
      email: "admin@rentride.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:

```bash
npx prisma db seed
```

### Method 2: Direct Database Insert

Use a database client (pgAdmin, DBeaver, etc.) to insert directly:

```sql
INSERT INTO "User" (id, email, "passwordHash", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@rentride.com',
  '$2a$10$...',  -- Use bcrypt to hash your password
  'ADMIN',
  NOW(),
  NOW()
);
```

### Method 3: Prisma Studio

1. Run `npx prisma studio`
2. Open the User model
3. Click "Add record"
4. Fill in:
   - email: admin@rentride.com
   - passwordHash: (use bcrypt to hash)
   - role: ADMIN
5. Save

---

## Available Roles for Public Registration

### USER (Renter)

**Purpose:** Rent vehicles from the platform

**Capabilities:**

- Browse available vehicles
- Book vehicles
- View booking history
- Leave reviews

**Dashboard:** `/renter`

### OWNER (Vehicle Owner)

**Purpose:** List vehicles for rent

**Capabilities:**

- Submit KYC verification
- List vehicles for rent
- Manage vehicle listings
- Accept/reject bookings
- View earnings

**Dashboard:** `/owner`

---

## Testing the Restriction

### Test 1: Registration Form

1. Go to `/register`
2. Check the "I want to" dropdown
3. ✅ Should only see:
   - "Rent Vehicles"
   - "List My Vehicles for Rent"
4. ❌ Should NOT see "Administrator"

### Test 2: API Direct Call

Try to register as ADMIN via API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

Expected Response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "role",
      "message": "Role must be either OWNER or USER"
    }
  ]
}
```

### Test 3: Schema Validation

The Zod schema will reject ADMIN role before it reaches the database.

---

## Migration Notes

### Existing Admin Accounts

- Existing ADMIN accounts are NOT affected
- They can still login and access the admin panel
- Only NEW registrations are restricted

### Future Admin Accounts

- Must be created manually through database
- Cannot be created through public registration
- Recommended to use database seeding for consistency

---

## Summary

✅ ADMIN role removed from registration form
✅ Only OWNER and USER can register publicly
✅ Three-layer security validation
✅ Existing admin accounts unaffected
✅ Clear documentation for creating admin accounts
✅ User-friendly role selection labels

The system now ensures only authorized administrators can access admin features, with a single admin account created manually by the system owner.
