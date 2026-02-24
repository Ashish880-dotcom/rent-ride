import React from "react";
import { Navbar, NavItem } from "./Navbar";
import { Sidebar, SidebarItem } from "./Sidebar";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userEmail?: string;
  navItems?: NavItem[];
  sidebarItems?: SidebarItem[];
  showSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
  userEmail,
  navItems = [],
  sidebarItems = [],
  showSidebar = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar userRole={userRole} userEmail={userEmail} navItems={navItems} />

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar (optional) */}
        {showSidebar && sidebarItems.length > 0 && (
          <div className="hidden lg:block">
            <Sidebar items={sidebarItems} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export interface DashboardStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
      value: string;
      isPositive: boolean;
    };
  }>;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              {stat.icon && (
                <div className="shrink-0 mr-4">
                  <div className="rounded-md bg-blue-50 p-3 text-blue-600">
                    {stat.icon}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
                {stat.trend && (
                  <dd className="mt-1 flex items-center text-sm">
                    <span
                      className={`font-medium ${
                        stat.trend.isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.trend.value}
                    </span>
                  </dd>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

DashboardLayout.displayName = "DashboardLayout";
DashboardHeader.displayName = "DashboardHeader";
DashboardStats.displayName = "DashboardStats";
