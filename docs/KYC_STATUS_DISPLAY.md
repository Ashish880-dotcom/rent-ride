# KYC Status Display on Owner Profile

## Overview

The owner profile page (`/owner/profile`) displays the KYC verification status with different views based on the current status.

## Implementation Date

February 24, 2026

## Status Display Logic

### 1. No KYC Submitted (kycData is null)

**Display**:

- Icon: Document icon (gray)
- Heading: "No KYC Submitted"
- Message: "You need to complete KYC verification to list vehicles."
- Action Button: "Submit KYC Documents" → Links to `/owner/kyc`

**When This Shows**:

- User has never submitted KYC documents
- First time owner visiting the profile page

---

### 2. KYC Status: PENDING

**Display**:

- Status Badge: Yellow badge with "PENDING" text
- Alert Box: Yellow warning box with clock icon
- Message: "Your KYC verification is under review. You'll be notified once it's approved."
- Details Shown:
  - Full Name
  - Document Type
  - Document Number
  - Submitted On (date)

**When This Shows**:

- User has submitted KYC documents
- Admin has not yet reviewed the submission
- Waiting for admin approval

---

### 3. KYC Status: APPROVED ✅

**Display**:

- Status Badge: Green badge with "APPROVED" text
- Alert Box: Green success box with checkmark icon
- Message: "Your KYC verification is approved. You can now list vehicles on the platform."
- Details Shown:
  - Full Name
  - Document Type
  - Document Number
  - Submitted On (date)
  - **Approved On (date)** ← Shows when approval happened

**When This Shows**:

- Admin has approved the KYC submission
- User can now list vehicles on the platform
- Full access to vehicle management features

**Important**:

- Does NOT show "Submit KYC Documents" button
- Shows complete KYC details with approval date
- User can proceed to add vehicles

---

### 4. KYC Status: REJECTED ❌

**Display**:

- Status Badge: Red badge with "REJECTED" text
- Alert Box: Red error box with X icon
- Message: "Your KYC verification was rejected. Please submit new documents."
- Details Shown:
  - Full Name
  - Document Type
  - Document Number
  - Submitted On (date)
  - **Action Button**: "Resubmit KYC" → Links to `/owner/kyc`

**When This Shows**:

- Admin has rejected the KYC submission
- Documents were invalid or incomplete
- User needs to submit new documents

---

## API Endpoint

**GET /api/kyc/status**

**Request**:

```
GET /api/kyc/status
Authorization: Bearer <session-token>
```

**Response**:

```json
{
  "kyc": {
    "id": "clx...",
    "userId": "clx...",
    "fullName": "John Doe",
    "documentType": "passport",
    "documentNumber": "AB1234567",
    "documentImage": "data:image/jpeg;base64,...",
    "status": "APPROVED",
    "createdAt": "2026-02-24T10:30:00.000Z",
    "updatedAt": "2026-02-24T15:45:00.000Z"
  }
}
```

**Response (No KYC)**:

```json
{
  "kyc": null
}
```

---

## Component Logic

### State Management

```typescript
const [kycData, setKycData] = useState<KYCData | null>(null);
const [loading, setLoading] = useState(true);
```

### Fetch KYC Status

```typescript
const fetchKYCStatus = async () => {
  try {
    const response = await fetch("/api/kyc/status");
    if (response.ok) {
      const data = await response.json();
      setKycData(data.kyc); // Will be null if no KYC submitted
    }
  } catch (error) {
    console.error("Error fetching KYC:", error);
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering

```typescript
{kycData ? (
  // Show KYC details with status-specific alerts
  <div>
    <StatusBadge status={kycData.status} />
    {kycData.status === "APPROVED" && <ApprovedAlert />}
    {kycData.status === "PENDING" && <PendingAlert />}
    {kycData.status === "REJECTED" && <RejectedAlert />}
    <KYCDetails data={kycData} />
  </div>
) : (
  // Show "Submit KYC Documents" prompt
  <NoKYCPrompt />
)}
```

---

## Theme Support

Both light and dark modes are supported:

**Light Mode**:

- Background: white
- Text: gray-900
- Borders: gray-200
- Status badges: colored backgrounds (green/yellow/red)

**Dark Mode**:

- Background: neutral-800
- Text: white
- Borders: neutral-700
- Status badges: colored backgrounds (green/yellow/red)
- Accent color: amber-500

---

## User Flow

### First Time Owner

1. Visits `/owner/profile`
2. Sees "No KYC Submitted" message
3. Clicks "Submit KYC Documents"
4. Redirected to `/owner/kyc`
5. Submits KYC form
6. Returns to profile → Sees "PENDING" status

### After Admin Approval

1. Admin approves KYC at `/admin/kyc`
2. Owner refreshes `/owner/profile` (or navigates back)
3. Sees "APPROVED" status with green checkmark
4. Views complete KYC details including approval date
5. Can now add vehicles at `/owner/vehicles/new`

### If Rejected

1. Admin rejects KYC at `/admin/kyc`
2. Owner refreshes `/owner/profile`
3. Sees "REJECTED" status with red X
4. Clicks "Resubmit KYC" button
5. Redirected to `/owner/kyc` to submit new documents

---

## Key Features

1. **Real-time Status**: Shows current KYC status from database
2. **Status-Specific Alerts**: Different colored alerts for each status
3. **Conditional Actions**:
   - No KYC → Submit button
   - Rejected → Resubmit button
   - Approved → No action needed (shows approval date)
4. **Complete Details**: Shows all submitted KYC information
5. **Theme Aware**: Adapts to light/dark mode
6. **Responsive**: Works on mobile and desktop

---

## Security

- **Authentication Required**: Must be logged in to view
- **User Isolation**: Can only see own KYC data
- **No Document Image Display**: Document image not shown on profile (security)
- **Read-Only**: Cannot edit KYC from profile page

---

## Related Pages

- `/owner/kyc` - Submit/resubmit KYC documents
- `/admin/kyc` - Admin KYC review panel
- `/owner/vehicles/new` - Add vehicle (requires approved KYC)
- `/owner` - Owner dashboard

---

## Testing Checklist

- [x] No KYC shows "Submit KYC Documents" button
- [x] PENDING status shows yellow alert with details
- [x] APPROVED status shows green alert with details
- [x] APPROVED status shows "Approved On" date
- [x] REJECTED status shows red alert with "Resubmit" button
- [x] Theme toggle works correctly
- [x] All links navigate to correct pages
- [x] API returns correct data structure
- [x] Loading state displays properly
- [x] Error handling works

---

## Conclusion

The owner profile page correctly displays KYC status based on the current state:

- **No KYC**: Prompts to submit
- **PENDING**: Shows waiting message
- **APPROVED**: Shows success with approval date (does NOT ask to submit again)
- **REJECTED**: Shows error with resubmit option

When KYC is approved, the profile page clearly shows the approved status with all details and does not ask the user to submit KYC again.
