import React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "circular" ? width : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <Skeleton variant="rectangular" height={200} className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" className="mb-4" />
      <Skeleton variant="text" width="100%" className="mb-2" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
};

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <Skeleton variant="text" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton variant="text" width="90%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export interface VehicleCardSkeletonProps {
  className?: string;
}

export const VehicleCardSkeleton: React.FC<VehicleCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <Skeleton variant="rectangular" height={200} />
      <div className="p-4">
        <Skeleton variant="text" width="70%" className="mb-2" />
        <Skeleton variant="text" width="50%" className="mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width={80} height={32} />
        </div>
      </div>
    </div>
  );
};

export interface StatsCardSkeletonProps {
  className?: string;
}

export const StatsCardSkeleton: React.FC<StatsCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" height={36} />
    </div>
  );
};

Skeleton.displayName = "Skeleton";
CardSkeleton.displayName = "CardSkeleton";
TableSkeleton.displayName = "TableSkeleton";
VehicleCardSkeleton.displayName = "VehicleCardSkeleton";
StatsCardSkeleton.displayName = "StatsCardSkeleton";
