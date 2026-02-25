"use client";

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

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicleId: string) => void;
}

export function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {vehicle.images.length > 0 && (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">
          {vehicle.make} {vehicle.model}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Year:</span> {vehicle.year}
          </p>
          <p>
            <span className="font-medium">Location:</span> {vehicle.location}
          </p>
          <p className="text-lg font-bold text-blue-600">
            Rs.{vehicle.pricePerDay.toFixed(2)} / day
          </p>
        </div>

        {vehicle.description && (
          <p className="mt-3 text-sm text-gray-700 line-clamp-2">
            {vehicle.description}
          </p>
        )}

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(vehicle.id)}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
