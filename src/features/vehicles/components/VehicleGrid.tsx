"use client";

import { useState, useEffect } from "react";
import { VehicleCard } from "./VehicleCard";

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
}

interface VehicleFilters {
  location: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

interface VehicleGridProps {
  vehicles?: Vehicle[];
}

export function VehicleGrid({ vehicles: propVehicles }: VehicleGridProps = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(propVehicles || []);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(
    propVehicles || [],
  );
  const [loading, setLoading] = useState(!propVehicles);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<VehicleFilters>({
    location: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  useEffect(() => {
    // Only fetch if vehicles weren't provided as props
    if (!propVehicles) {
      fetchVehicles();
    }
  }, [propVehicles]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((vehicle) =>
        vehicle.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    // Price range filter
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter((vehicle) => vehicle.pricePerDay >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter((vehicle) => vehicle.pricePerDay <= maxPrice);
    }

    // Search filter (make or model)
    if (filters.search) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
  };

  const handleViewDetails = (vehicleId: string) => {
    window.location.href = `/vehicles/${vehicleId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading vehicles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filter Vehicles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search (Make/Model)
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="e.g., Toyota, Camry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium mb-1"
            >
              Min Price ($)
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium mb-1"
            >
              Max Price ($)
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="1000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No vehicles found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
