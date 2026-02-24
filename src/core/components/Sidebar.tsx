"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, className = "" }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 ${className}`}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      <nav className="h-full overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <div className="flex items-center">
                  {item.icon && (
                    <span className="mr-3 shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                    aria-label={`${item.badge} items`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.displayName = "Sidebar";
