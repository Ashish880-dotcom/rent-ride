# Admin Vehicle Management Features

## Overview

The admin panel now includes comprehensive vehicle management capabilities that allow administrators to manage the entire vehicle lifecycle on the platform.

## Features

### 1. Vehicle Review & Approval Workflow

Admins can review vehicle submissions from owners through a two-step approval process:

- **Pending Review**: Initial review of vehicle details, images, and information
- **Accept for Payment**: Move vehicle to awaiting payment status
- **Awaiting Payment**: Owner makes payment for listing
- **Confirm Payment & Approve**: Final approval after payment confirmation
- **Reject**: Reject vehicle at any stage with reason

**Access**: `/admin/vehicles` → "Review & Manage Vehicles" tab

### 2. View All Vehicles

Admins can toggle between two views:

- **Pending Review**: Shows only vehicles awaiting approval or payment
- **All Vehicles**: Shows all vehicles in the system regardless of status

**Access**: Toggle buttons at the top of the vehicle list

### 3. Delete Vehicles

Admins can permanently delete any vehicle from the system:

- Available in "All Vehicles" view
- Confirmation dialog prevents accidental deletion
- Cascading delete removes all related bookings and feedback

**Access**: "Delete Vehicle" button in "All Vehicles" view

### 4. Add Vehicles on Behalf of Owners

Admins can add vehicles directly for vehicle owners:

- Select from approved vehicle owners (must have approved KYC)
- Fill in vehicle details (make, model, year, price, location, images)
- Vehicles are automatically approved (bypass review process)
- Useful for bulk imports or assisting owners

**Access**: `/admin/vehicles` → "Add Vehicle for Owner" tab

## API Endpoints

### Admin Vehicle Management

- `POST /api/admin/vehicles` - Add vehicle for owner (admin only)
- `DELETE /api/vehicles/[id]` - Delete vehicle (admin only)
- `PATCH /api/vehicles/[id]/accept-payment` - Accept vehicle for payment
- `PATCH /api/vehicles/[id]/confirm-payment` - Confirm payment and approve
- `PATCH /api/vehicles/[id]/reject` - Reject vehicle

### Vehicle Queries

- `GET /api/vehicles?status=PENDING` - Get pending vehicles
- `GET /api/vehicles?status=AWAITING_PAYMENT` - Get vehicles awaiting payment
- `GET /api/vehicles` - Get all vehicles (admin view)

## Workflow

### Owner Submits Vehicle

1. Owner submits vehicle through `/owner/vehicles/new`
2. Vehicle status: `PENDING`
3. Admin receives notification

### Admin Reviews Vehicle

1. Admin views vehicle in "Pending Review"
2. Reviews details, images, pricing
3. Options:
   - Accept for Payment → Status: `AWAITING_PAYMENT`
   - Reject → Status: `REJECTED`

### Owner Makes Payment

1. Owner makes payment for listing fee
2. Status remains: `AWAITING_PAYMENT`

### Admin Confirms Payment

1. Admin verifies payment received
2. Confirms payment → Status: `APPROVED`
3. Vehicle now visible to renters

### Admin Adds Vehicle Directly

1. Admin selects owner from dropdown
2. Fills vehicle details
3. Submits → Status: `APPROVED` (auto-approved)
4. Vehicle immediately available to renters

## Security

- All admin endpoints require authentication
- Role-based access control (ADMIN role required)
- Owner must have approved KYC to have vehicles added
- Cascading deletes prevent orphaned records
- Input validation using Zod schemas

## UI Components

### VehicleReviewPanel

- Location: `src/features/vehicles/components/VehicleReviewPanel.tsx`
- Features: View toggle, approve/reject actions, delete functionality

### AdminAddVehicleForm

- Location: `src/features/vehicles/components/AdminAddVehicleForm.tsx`
- Features: Owner selection, vehicle form, image management

## Database Schema

```prisma
enum VehicleStatus {
  PENDING           // Initial submission
  AWAITING_PAYMENT  // Accepted, waiting for payment
  APPROVED          // Payment confirmed, live on platform
  REJECTED          // Rejected by admin
}
```

## Future Enhancements

- Bulk vehicle import from CSV
- Vehicle edit functionality for admins
- Payment integration for automated approval
- Email notifications for status changes
- Vehicle analytics and performance metrics
