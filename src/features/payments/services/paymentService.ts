import { prisma } from "@/core/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@/generated/prisma";

interface CreatePaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

interface UpdatePaymentData {
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentGateway?: string;
  paymentDetails?: string;
  paidAt?: Date;
}

export async function createPayment(data: CreatePaymentData) {
  const payment = await prisma.payment.create({
    data: {
      bookingId: data.bookingId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
    },
    include: {
      booking: {
        include: {
          vehicle: true,
          renter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return payment;
}

export async function getPaymentByBookingId(bookingId: string) {
  return await prisma.payment.findUnique({
    where: { bookingId },
    include: {
      booking: {
        include: {
          vehicle: true,
          renter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function updatePaymentStatus(
  paymentId: string,
  data: UpdatePaymentData,
) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data,
  });
}

export async function confirmPayment(paymentId: string, transactionId: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      paymentStatus: PaymentStatus.COMPLETED,
      transactionId,
      paidAt: new Date(),
    },
  });
}

export async function getUserPayments(userId: string) {
  return await prisma.payment.findMany({
    where: {
      booking: {
        renterId: userId,
      },
    },
    include: {
      booking: {
        include: {
          vehicle: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
