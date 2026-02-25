"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description?: string | null;
  images: string[];
  status: string;
  owner?: {
    id: string;
    email: string;
  };
  createdAt?: string;
}

// Featured vehicles from landing page as fallback
const featuredVehicles: Vehicle[] = [
  {
    id: "featured-1",
    make: "Tesla",
    model: "Model S",
    year: 2024,
    pricePerDay: 149,
    location: "San Francisco, CA",
    description:
      "Electric luxury sedan with Autopilot and Supercharging capabilities",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-2",
    make: "BMW",
    model: "X5 M Sport",
    year: 2024,
    pricePerDay: 129,
    location: "Los Angeles, CA",
    description: "Luxury SUV with All-Wheel Drive and Panoramic Roof",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
    status: "APPROVED",
  },
  {
    id: "featured-3",
    make: "Mercedes",
    model: "C-Class AMG",
    year: 2024,
    pricePerDay: 119,
    location: "Miami, FL",
    description: "Premium sedan with AMG Performance and MBUX System",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-4",
    make: "Porsche",
    model: "911 Carrera",
    year: 2024,
    pricePerDay: 299,
    location: "New York, NY",
    description: "Iconic sports car with Sport Chrono and PASM",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-5",
    make: "Range Rover",
    model: "Evoque",
    year: 2024,
    pricePerDay: 99,
    location: "Seattle, WA",
    description: "Compact luxury SUV with Terrain Response and Meridian Audio",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-6",
    make: "Ducati",
    model: "Panigale V4",
    year: 2024,
    pricePerDay: 179,
    location: "Austin, TX",
    description:
      "High-performance sport bike with Racing Mode and Quick Shifter",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800"],
    status: "APPROVED",
  },
  {
    id: "featured-7",
    make: "Harley-Davidson",
    model: "Street 750",
    year: 2023,
    pricePerDay: 89,
    location: "Chicago, IL",
    description: "Classic cruiser bike with Cruise Control and ABS",
    images: ["https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800"],
    status: "APPROVED",
  },
  {
    id: "featured-8",
    make: "Toyota",
    model: "Prius Hybrid",
    year: 2024,
    pricePerDay: 59,
    location: "Portland, OR",
    description: "Eco-friendly hybrid with excellent fuel economy",
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"],
    status: "APPROVED",
  },
  {
    id: "featured-9",
    make: "Vespa",
    model: "Primavera 150",
    year: 2024,
    pricePerDay: 35,
    location: "San Diego, CA",
    description: "Classic Italian scooter, fuel efficient with USB charging",
    images: [
      "https://cdn.pixabay.com/photo/2020/08/22/01/27/vespa-5507329_640.jpg",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-10",
    make: "Honda",
    model: "Activa 6G",
    year: 2024,
    pricePerDay: 25,
    location: "Phoenix, AZ",
    description: "Reliable city scooter with LED lights and digital console",
    images: [
      "https://cdn.pixabay.com/photo/2014/02/26/11/05/motor-scooter-275017_640.jpg",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-11",
    make: "Honda",
    model: "CB350",
    year: 2023,
    pricePerDay: 45,
    location: "Denver, CO",
    description: "Standard bike with classic design and comfortable ride",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-12",
    make: "Yamaha",
    model: "MT-15",
    year: 2024,
    pricePerDay: 55,
    location: "Boston, MA",
    description: "Street fighter with sporty design and ABS",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-13",
    make: "Honda",
    model: "City",
    year: 2024,
    pricePerDay: 65,
    location: "Dallas, TX",
    description: "Spacious sedan with excellent fuel efficiency",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-14",
    make: "Hyundai",
    model: "Creta",
    year: 2024,
    pricePerDay: 85,
    location: "Atlanta, GA",
    description: "Compact SUV with sunroof and touchscreen infotainment",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    ],
    status: "APPROVED",
  },
  {
    id: "featured-15",
    make: "TVS",
    model: "Jupiter",
    year: 2024,
    pricePerDay: 30,
    location: "Las Vegas, NV",
    description: "Family scooter with ample storage space and smooth ride",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
    status: "APPROVED",
  },
  {
    id: "featured-16",
    make: "Maruti",
    model: "Swift",
    year: 2024,
    pricePerDay: 50,
    location: "Orlando, FL",
    description: "Compact hatchback, easy to park and fuel efficient",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"],
    status: "APPROVED",
  },
];

export function AdminAllVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");

      if (response.ok) {
        const data = await response.json();
        const dbVehicles = data.vehicles || [];

        // Combine database vehicles with featured vehicles
        const allVehicles =
          dbVehicles.length > 0
            ? [...dbVehicles, ...featuredVehicles]
            : featuredVehicles;

        setVehicles(allVehicles);
      } else {
        // If API fails, use featured vehicles
        setVehicles(featuredVehicles);
      }
    } catch (err) {
      // On error, use featured vehicles as fallback
      setVehicles(featuredVehicles);
      setError(null); // Don't show error, just use featured vehicles
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-neutral-400">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">
          All Available Vehicles
        </h2>
        <p className="text-neutral-400">
          {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-all group"
          >
            {/* Vehicle Image */}
            <div className="relative h-48 bg-neutral-900 overflow-hidden">
              {vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="h-20 w-20 text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    vehicle.status === "APPROVED"
                      ? "bg-green-600 text-white"
                      : vehicle.status === "PENDING"
                        ? "bg-yellow-600 text-neutral-900"
                        : vehicle.status === "AWAITING_PAYMENT"
                          ? "bg-orange-600 text-white"
                          : "bg-red-600 text-white"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-neutral-400 mb-2">{vehicle.year}</p>

              {vehicle.owner && (
                <p className="text-xs text-neutral-500 mb-3">
                  Owner: {vehicle.owner.email}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3 text-neutral-400 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{vehicle.location}</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-500">
                    Rs.{vehicle.pricePerDay}
                  </span>
                  <span className="text-neutral-500 text-sm">/day</span>
                </div>
              </div>

              {/* View Details Button */}
              <Link
                href={`/renter/vehicles/${vehicle.id}`}
                className="block w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-center font-medium rounded-md transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
