import prisma from "@/core/lib/prisma";
import { VehicleStatus } from "@/generated/prisma";

export interface CreateVehicleData {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description?: string;
  images: string[];
}

export interface VehicleFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: VehicleStatus;
}

export const vehicleService = {
  async createVehicle(ownerId: string, data: CreateVehicleData) {
    return await prisma.vehicle.create({
      data: {
        ownerId,
        make: data.make,
        model: data.model,
        year: data.year,
        pricePerDay: data.pricePerDay,
        location: data.location,
        description: data.description,
        images: data.images,
        status: VehicleStatus.PENDING,
      },
    });
  },

  async getApprovedVehicles(filters?: VehicleFilters) {
    const where: any = {
      status: VehicleStatus.APPROVED,
    };

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: "insensitive",
      };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.pricePerDay = {};
      if (filters.minPrice !== undefined) {
        where.pricePerDay.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.pricePerDay.lte = filters.maxPrice;
      }
    }

    return await prisma.vehicle.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getOwnerVehicles(ownerId: string) {
    return await prisma.vehicle.findMany({
      where: {
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getPendingVehicles() {
    return await prisma.vehicle.findMany({
      where: {
        status: {
          in: [VehicleStatus.PENDING, VehicleStatus.AWAITING_PAYMENT],
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async acceptForPayment(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.status !== VehicleStatus.PENDING) {
      throw new Error(
        `Invalid transition: acceptForPayment from ${vehicle.status}`,
      );
    }

    return await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.AWAITING_PAYMENT,
      },
    });
  },

  async confirmPayment(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.status !== VehicleStatus.AWAITING_PAYMENT) {
      throw new Error(
        `Invalid transition: confirmPayment from ${vehicle.status}`,
      );
    }

    return await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.APPROVED,
      },
    });
  },

  async rejectVehicle(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    if (
      vehicle.status !== VehicleStatus.PENDING &&
      vehicle.status !== VehicleStatus.AWAITING_PAYMENT
    ) {
      throw new Error(`Invalid transition: reject from ${vehicle.status}`);
    }

    return await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.REJECTED,
      },
    });
  },

  async getVehicleById(vehicleId: string) {
    return await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        feedbacks: {
          include: {
            renter: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  async getVehicleFeedback(vehicleId: string) {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        vehicleId,
      },
      include: {
        renter: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalFeedbacks = feedbacks.length;
    const averageRating =
      totalFeedbacks > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
        : 0;

    return {
      feedbacks: feedbacks.map((f) => ({
        id: f.id,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt,
        renterName: f.renter.email.split("@")[0], // Use email prefix as name
      })),
      averageRating,
      totalFeedbacks,
    };
  },

  async deleteVehicle(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Delete the vehicle (cascading deletes will handle related records)
    return await prisma.vehicle.delete({
      where: { id: vehicleId },
    });
  },
};
