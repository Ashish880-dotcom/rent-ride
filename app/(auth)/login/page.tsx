import Link from "next/link";
import { LoginForm } from "@/features/authentication/components/LoginForm";
import { auth } from "@/core/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Check if user is already authenticated
  const session = await auth();

  // Redirect authenticated users to their dashboard
  if (session?.user) {
    const role = session.user.role;
    if (role === "ADMIN") {
      redirect("/admin");
    } else if (role === "OWNER") {
      redirect("/owner");
    } else {
      redirect("/renter");
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-900 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920')",
          filter: "brightness(0.3)",
        }}
      />

      {/* Left Side - Welcome Section */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-12 text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-neutral-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">RENTRIDE</span>
        </Link>

        {/* Welcome Text */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            WELCOME BACK
          </h1>
          <p className="text-neutral-300 text-lg mb-12">
            Access your premium vehicle collection and manage your bookings with
            ease.
          </p>

          {/* Features */}
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Platform</h3>
                <p className="text-neutral-400 text-sm">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Instant Booking</h3>
                <p className="text-neutral-400 text-sm">
                  Book your dream vehicle in seconds
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
              <div className="text-3xl font-bold text-amber-500 mb-1">500+</div>
              <div className="text-neutral-400 text-sm uppercase tracking-wide">
                Premium Vehicles
              </div>
            </div>
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
              <div className="text-3xl font-bold text-amber-500 mb-1">10K+</div>
              <div className="text-neutral-400 text-sm uppercase tracking-wide">
                Happy Customers
              </div>
            </div>
          </div>
        </div>

        <div className="text-neutral-500 text-sm">
          © 2026 RentRide. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-center p-8">
        <div className="w-full bg-neutral-800/90 backdrop-blur-md rounded-2xl p-8 border border-neutral-700 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">SIGN IN</h2>
            <p className="text-neutral-400 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
