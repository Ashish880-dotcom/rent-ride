import { MetadataRoute } from "next";
import { prisma } from "@/core/lib/prisma";
import { VehicleStatus } from "@/generated/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Query all APPROVED vehicles from database
    const vehicles = await prisma.vehicle.findMany({
      where: { status: VehicleStatus.APPROVED },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    // Generate sitemap entries for individual vehicle pages
    const vehicleUrls = vehicles.map((vehicle) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com"}/vehicles/${vehicle.id}`,
      lastModified: vehicle.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // Return sitemap with main pages and vehicle pages
    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com"}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com"}/vehicles`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      },
      ...vehicleUrls,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return minimal sitemap on error
    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com"}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com"}/vehicles`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      },
    ];
  }
}
