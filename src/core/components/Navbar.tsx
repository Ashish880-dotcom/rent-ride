"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/core/contexts/ThemeContext";

export interface NavItem {
  label: string;
  href: string;
  roles?: string[];
}

export interface NavbarProps {
  userRole?: string;
  userEmail?: string;
  navItems: NavItem[];
  isAdminPanel?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  userEmail,
  navItems,
  isAdminPanel = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole || ""),
  );

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={`border-b shadow-sm transition-colors duration-200 ${
        isDark
          ? "bg-neutral-950 border-neutral-800"
          : "bg-white border-gray-200"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className={`flex items-center gap-3 ${
                  isDark ? "text-white" : "text-blue-600"
                }`}
              >
                {isDark && (
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-neutral-900"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>
                )}
                <span
                  className={`text-xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  RentRide
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? isDark
                        ? "text-amber-500 bg-amber-600/10"
                        : "text-blue-600 bg-blue-50"
                      : isDark
                        ? "text-neutral-300 hover:text-white hover:bg-neutral-800"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700 hover:border-amber-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 border border-gray-300"
              }`}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                // Moon icon for dark mode
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Sun icon for light mode
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark ? "focus:ring-amber-500" : "focus:ring-blue-500"
                }`}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${
                    isDark
                      ? "bg-amber-600 text-neutral-900"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {userEmail?.charAt(0).toUpperCase() || "U"}
                </div>
                <svg
                  className={`ml-2 h-4 w-4 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div
                  className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-opacity-5 z-50 ${
                    isDark
                      ? "bg-neutral-800 ring-neutral-700"
                      : "bg-white ring-black"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div
                      className={`px-4 py-2 border-b ${
                        isDark ? "border-neutral-700" : "border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {userEmail}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-neutral-400" : "text-gray-500"
                        }`}
                      >
                        Role: <span className="font-medium">{userRole}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDark
                          ? "text-neutral-300 hover:bg-neutral-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Theme Toggle Button - Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-neutral-300 hover:text-white hover:bg-neutral-800"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              }`}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset ${
                isDark
                  ? "text-neutral-300 hover:text-white hover:bg-neutral-800 focus:ring-amber-500"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:ring-blue-500"
              }`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className={`sm:hidden border-t ${
            isDark ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                  isActive(item.href)
                    ? isDark
                      ? "text-amber-500 bg-amber-600/10 border-amber-600"
                      : "text-blue-600 bg-blue-50 border-blue-600"
                    : isDark
                      ? "text-neutral-300 hover:text-white hover:bg-neutral-800 border-transparent"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-transparent"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div
            className={`pt-4 pb-3 border-t ${
              isDark ? "border-neutral-800" : "border-gray-200"
            }`}
          >
            <div className="px-4">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {userEmail}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-neutral-400" : "text-gray-500"
                }`}
              >
                Role: {userRole}
              </p>
            </div>
            <div className="mt-3">
              <button
                onClick={handleSignOut}
                className={`block w-full text-left px-4 py-2 text-base font-medium ${
                  isDark
                    ? "text-neutral-300 hover:text-white hover:bg-neutral-800"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.displayName = "Navbar";
