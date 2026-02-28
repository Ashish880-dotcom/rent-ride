"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description: string | null;
  images: string[];
  status: string;
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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      const dbVehicles = data.vehicles || [];

      // If no vehicles from database, use featured vehicles
      if (dbVehicles.length === 0) {
        setVehicles(featuredVehicles);
      } else {
        setVehicles(dbVehicles);
      }
    } catch (err) {
      // On error, show featured vehicles as fallback
      setVehicles(featuredVehicles);
      setError(null); // Don't show error, just use featured vehicles
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
    });
    // Refetch without filters
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/vehicles`);
        if (response.ok) {
          const data = await response.json();
          const dbVehicles = data.vehicles || [];
          setVehicles(dbVehicles.length > 0 ? dbVehicles : featuredVehicles);
        } else {
          setVehicles(featuredVehicles);
        }
      } catch {
        setVehicles(featuredVehicles);
      }
    }, 0);
  };

  const sortedVehicles = Array.isArray(vehicles)
    ? [...vehicles].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.pricePerDay - b.pricePerDay;
          case "price-high":
            return b.pricePerDay - a.pricePerDay;
          case "year-new":
            return b.year - a.year;
          default:
            return 0;
        }
      })
    : [];

  // Apply client-side filters for featured vehicles
  const filteredVehicles = sortedVehicles.filter((vehicle) => {
    if (
      filters.location &&
      !vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.minPrice &&
      vehicle.pricePerDay < parseFloat(filters.minPrice)
    ) {
      return false;
    }
    if (
      filters.maxPrice &&
      vehicle.pricePerDay > parseFloat(filters.maxPrice)
    ) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow animate-pulse"
              >
                <div className="h-56 bg-gray-200 dark:bg-neutral-700 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Browse Vehicles
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredVehicles.length} vehicle
                {filteredVehicles.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <Link
              href="/renter"
              className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium"
                >
                  Clear
                </button>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min ($)"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max ($)"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition-colors"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Newest First</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Vehicle Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No vehicles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or check back later for new
                  listings.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-56 bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                      {vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="h-20 w-20 text-gray-300 dark:text-gray-600"
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
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {vehicle.year}
                      </p>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg
                          className="w-4 h-4 text-gray-300 dark:text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          (4.0)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            Rs.{vehicle.pricePerDay}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          per day
                        </p>
                      </div>

                      {/* Quick View Button */}
                      <Link
                        href={`/renter/vehicles/${vehicle.id}`}
                        className="block w-full py-2.5 bg-gray-900 dark:bg-amber-600 hover:bg-gray-800 dark:hover:bg-amber-700 text-white text-center font-semibold rounded-md transition-colors"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-neutral-800 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                handleSearch(e);
                setShowFilters(false);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Enter location"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min ($)"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max ($)"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClearFilters();
                    setShowFilters(false);
                  }}
                  className="w-full py-2.5 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-700 dark:text-white font-semibold rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
