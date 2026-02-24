import { auth } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { Navbar, NavItem } from "@/core/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { role, email } = session.user;

  // Define role-based navigation items
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [];

    if (role === "ADMIN") {
      return [
        { label: "Dashboard", href: "/admin", roles: ["ADMIN"] },
        { label: "KYC Review", href: "/admin/kyc", roles: ["ADMIN"] },
        { label: "Vehicles", href: "/admin/vehicles", roles: ["ADMIN"] },
        { label: "Users", href: "/admin/users", roles: ["ADMIN"] },
      ];
    }

    if (role === "OWNER") {
      return [
        { label: "Dashboard", href: "/owner", roles: ["OWNER"] },
        { label: "My Vehicles", href: "/owner/vehicles", roles: ["OWNER"] },
        { label: "Bookings", href: "/owner/bookings", roles: ["OWNER"] },
        { label: "Add Vehicle", href: "/owner/vehicles/new", roles: ["OWNER"] },
      ];
    }

    // USER/Renter role
    return [
      { label: "Dashboard", href: "/renter", roles: ["USER"] },
      { label: "Browse Vehicles", href: "/renter/vehicles", roles: ["USER"] },
      { label: "My Bookings", href: "/renter/bookings", roles: ["USER"] },
      { label: "Profile", href: "/renter/profile", roles: ["USER"] },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={role} userEmail={email} navItems={navItems} />
      <main>{children}</main>
    </div>
  );
}
