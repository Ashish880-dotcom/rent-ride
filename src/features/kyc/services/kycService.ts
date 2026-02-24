import prisma from "@/core/lib/prisma";
import { KYCStatus } from "@/generated/prisma";

export interface KYCSubmissionData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  documentImage: string;
}

/**
 * Submit KYC information for a user
 * Creates a new KYC record with PENDING status
 * Requirements: 3.1, 3.2, 3.3
 */
export async function submitKYC(userId: string, data: KYCSubmissionData) {
  // Check if user already has approved KYC
  const existing = await prisma.kYC.findUnique({
    where: { userId },
  });

  if (existing && existing.status === KYCStatus.APPROVED) {
    throw new Error("User already has approved KYC");
  }

  // Create or update KYC submission with PENDING status
  const kyc = await prisma.kYC.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
      status: KYCStatus.PENDING,
    },
    update: {
      ...data,
      status: KYCStatus.PENDING,
    },
  });

  return kyc;
}

/**
 * Check if a user has approved KYC status
 * Requirements: 3.7
 */
export async function getUserKYCStatus(userId: string) {
  const kyc = await prisma.kYC.findUnique({
    where: { userId },
    select: { status: true },
  });

  return kyc?.status || null;
}

/**
 * Get all pending KYC submissions for admin review
 * Requirements: 3.4
 */
export async function getPendingSubmissions() {
  const submissions = await prisma.kYC.findMany({
    where: {
      status: KYCStatus.PENDING,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return submissions;
}

/**
 * Approve a KYC submission
 * Updates status to APPROVED
 * Requirements: 3.5
 */
export async function approveKYC(kycId: string) {
  const kyc = await prisma.kYC.update({
    where: { id: kycId },
    data: {
      status: KYCStatus.APPROVED,
    },
  });

  return kyc;
}

/**
 * Reject a KYC submission
 * Updates status to REJECTED
 * Requirements: 3.6
 */
export async function rejectKYC(kycId: string) {
  const kyc = await prisma.kYC.update({
    where: { id: kycId },
    data: {
      status: KYCStatus.REJECTED,
    },
  });

  return kyc;
}
