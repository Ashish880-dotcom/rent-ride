"use client";

import { ThemeProvider } from "@/core/contexts/ThemeContext";
import { Navbar, NavItem } from "@/core/components/Navbar";
import { useTheme } from "@/core/contexts/ThemeContext";

interface DashboardWrapperProps {
  userRole: string;
  userEmail: string;
  navItems: NavItem[];
  isAdminPanel: boolean;
  children: React.ReactNode;
}

function DashboardContent({
  userRole,
  userEmail,
  navItems,
  isAdminPanel,
  children,
}: DashboardWrapperProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-neutral-900" : "bg-gray-50"
      }`}
    >
      <Navbar
        userRole={userRole}
        userEmail={userEmail}
        navItems={navItems}
        isAdminPanel={isAdminPanel}
      />
      <main>{children}</main>
    </div>
  );
}

export function DashboardWrapper(props: DashboardWrapperProps) {
  return (
    <ThemeProvider>
      <DashboardContent {...props} />
    </ThemeProvider>
  );
}
