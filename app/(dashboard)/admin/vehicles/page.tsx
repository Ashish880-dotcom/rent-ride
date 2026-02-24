import { VehicleReviewPanel } from "@/features/vehicles/components/VehicleReviewPanel";
import Link from "next/link";

export default function AdminVehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <VehicleReviewPanel />
    </div>
  );
}
