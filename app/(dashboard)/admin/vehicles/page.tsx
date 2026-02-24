"use client";

import { useState } from "react";
import { VehicleReviewPanel } from "@/features/vehicles/components/VehicleReviewPanel";
import { AdminAddVehicleForm } from "@/features/vehicles/components/AdminAddVehicleForm";
import { AdminAllVehicles } from "@/features/vehicles/components/AdminAllVehicles";
import Link from "next/link";

type TabView = "review" | "add" | "all";

export default function AdminVehiclesPage() {
  const [activeTab, setActiveTab] = useState<TabView>("all");

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-amber-500 hover:text-amber-400 font-medium flex items-center gap-2"
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
            Back to Admin Dashboard
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-neutral-800">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-amber-600 text-amber-500"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              All Vehicles
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "review"
                  ? "border-amber-600 text-amber-500"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              Review & Manage
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "add"
                  ? "border-amber-600 text-amber-500"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              Add Vehicle for Owner
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "all" && <AdminAllVehicles />}
        {activeTab === "review" && <VehicleReviewPanel />}
        {activeTab === "add" && <AdminAddVehicleForm />}
      </div>
    </div>
  );
}
