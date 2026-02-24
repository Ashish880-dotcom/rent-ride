"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
}) => {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  className="font-medium text-gray-900"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format the label (capitalize and replace hyphens)
    const label = formatLabel(segment);

    // Don't link the last segment (current page)
    const href = index < segments.length - 1 ? currentPath : undefined;

    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
}

// Helper function to format segment labels
function formatLabel(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    admin: "Admin",
    owner: "Owner",
    renter: "Renter",
    kyc: "KYC",
    vehicles: "Vehicles",
    bookings: "Bookings",
    users: "Users",
    profile: "Profile",
    new: "New",
  };

  if (specialCases[segment.toLowerCase()]) {
    return specialCases[segment.toLowerCase()];
  }

  // Default: capitalize first letter and replace hyphens with spaces
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

Breadcrumb.displayName = "Breadcrumb";
