import { Metadata } from "next";
import VehiclesPageClient from "./vehicles-client";

export const metadata: Metadata = {
  title: "Browse Premium Vehicles | RentRide",
  description:
    "Explore our extensive collection of luxury vehicles, sports cars, and premium SUVs available for rent. Find the perfect vehicle for your next journey.",
  keywords: [
    "car rental",
    "vehicle rental",
    "luxury cars",
    "sports cars",
    "SUV rental",
  ],
  openGraph: {
    title: "Browse Premium Vehicles | RentRide",
    description:
      "Explore our extensive collection of luxury vehicles, sports cars, and premium SUVs available for rent.",
    type: "website",
    url: "https://rentride.com/vehicles",
    siteName: "RentRide",
    images: [
      {
        url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "Premium vehicles available for rent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Premium Vehicles | RentRide",
    description:
      "Explore our extensive collection of luxury vehicles, sports cars, and premium SUVs available for rent.",
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=630",
    ],
  },
  alternates: {
    canonical: "https://rentride.com/vehicles",
  },
};

async function getInitialVehicles() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/vehicles`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.vehicles || [];
  } catch (error) {
    console.error("Error fetching initial vehicles:", error);
    return [];
  }
}

export default async function VehiclesPage() {
  const initialVehicles = await getInitialVehicles();
  return <VehiclesPageClient initialVehicles={initialVehicles} />;
}
