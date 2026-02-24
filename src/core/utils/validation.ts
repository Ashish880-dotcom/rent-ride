import { z } from "zod";
import { sanitizeHtml, sanitizeText } from "./sanitization";

// ============================================================================
// Enum Schemas
// ============================================================================

export const RoleSchema = z.enum(["ADMIN", "OWNER", "USER"]);

export const KYCStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const VehicleStatusSchema = z.enum([
  "PENDING",
  "AWAITING_PAYMENT",
  "APPROVED",
  "REJECTED",
]);

export const BookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "COMPLETED",
]);

// ============================================================================
// Custom Validators
// ============================================================================

/**
 * Validates email format
 */
export const emailValidator = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required")
  .max(255, "Email must be less than 255 characters");

/**
 * Validates password strength
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * Validates price is positive
 */
export const priceValidator = z
  .number()
  .positive("Price must be greater than 0")
  .max(100000, "Price must be less than 100,000");

/**
 * Validates year is within valid range
 */
export const yearValidator = z
  .number()
  .int("Year must be an integer")
  .min(1900, "Year must be 1900 or later")
  .max(new Date().getFullYear() + 1, "Year cannot be in the future");

/**
 * Validates rating is between 1 and 5
 */
export const ratingValidator = z
  .number()
  .int("Rating must be an integer")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating must be at most 5");

/**
 * Validates date is in the future
 */
export const futureDateValidator = z.coerce
  .date()
  .refine((date) => date > new Date(), {
    message: "Date must be in the future",
  });

/**
 * Validates date range (start date before end date)
 */
export const dateRangeValidator = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

// ============================================================================
// Authentication Schemas
// ============================================================================

export const RegisterSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
  role: z.enum(["OWNER", "USER"], {
    errorMap: () => ({ message: "Role must be either OWNER or USER" }),
  }),
});

export const LoginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1, "Password is required"),
});

// ============================================================================
// KYC Schemas
// ============================================================================

export const KYCSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces")
    .transform(sanitizeText),
  documentType: z
    .string()
    .min(1, "Document type is required")
    .max(50, "Document type must be less than 50 characters")
    .transform(sanitizeText),
  documentNumber: z
    .string()
    .min(5, "Document number must be at least 5 characters")
    .max(50, "Document number must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Document number must contain only letters, numbers, and hyphens",
    )
    .transform(sanitizeText),
  documentImage: z
    .string()
    .url("Document image must be a valid URL")
    .max(500, "Document image URL must be less than 500 characters"),
});

export const KYCApprovalSchema = z.object({
  id: z.string().cuid("Invalid KYC ID format"),
});

// ============================================================================
// Vehicle Schemas
// ============================================================================

export const VehicleListingSchema = z.object({
  make: z
    .string()
    .min(2, "Make must be at least 2 characters")
    .max(50, "Make must be less than 50 characters")
    .transform(sanitizeText),
  model: z
    .string()
    .min(1, "Model must be at least 1 character")
    .max(50, "Model must be less than 50 characters")
    .transform(sanitizeText),
  year: yearValidator,
  pricePerDay: priceValidator,
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .transform(sanitizeText),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : undefined)),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});

export const VehicleFilterSchema = z.object({
  status: VehicleStatusSchema.optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
});

export const VehicleIdSchema = z.object({
  id: z.string().cuid("Invalid vehicle ID format"),
});

// ============================================================================
// Booking Schemas
// ============================================================================

export const BookingRequestSchema = z
  .object({
    vehicleId: z.string().cuid("Invalid vehicle ID format"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate > new Date(), {
    message: "Start date must be in the future",
    path: ["startDate"],
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export const BookingIdSchema = z.object({
  id: z.string().cuid("Invalid booking ID format"),
});

export const BookingFilterSchema = z.object({
  status: BookingStatusSchema.optional(),
  vehicleId: z.string().cuid().optional(),
  renterId: z.string().cuid().optional(),
});

// ============================================================================
// Feedback Schemas
// ============================================================================

export const FeedbackSubmissionSchema = z.object({
  bookingId: z.string().cuid("Invalid booking ID format"),
  rating: ratingValidator,
  comment: z
    .string()
    .max(500, "Comment must be less than 500 characters")
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : undefined)),
});

export const FeedbackFilterSchema = z.object({
  vehicleId: z.string().cuid("Invalid vehicle ID format"),
});

// ============================================================================
// Admin Schemas
// ============================================================================

export const UserFilterSchema = z.object({
  role: RoleSchema.optional(),
  kycStatus: KYCStatusSchema.optional(),
  search: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type KYCSubmissionInput = z.infer<typeof KYCSubmissionSchema>;
export type VehicleListingInput = z.infer<typeof VehicleListingSchema>;
export type VehicleFilterInput = z.infer<typeof VehicleFilterSchema>;
export type BookingRequestInput = z.infer<typeof BookingRequestSchema>;
export type BookingFilterInput = z.infer<typeof BookingFilterSchema>;
export type FeedbackSubmissionInput = z.infer<typeof FeedbackSubmissionSchema>;
export type UserFilterInput = z.infer<typeof UserFilterSchema>;
