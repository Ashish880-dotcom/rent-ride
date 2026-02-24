import Link from "next/link";
import { RegisterForm } from "@/features/authentication/components/RegisterForm";
import { auth } from "@/core/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
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
            "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')",
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
          <h1 className="text-5xl font-bold mb-4 leading-tight">START YOUR</h1>
          <h1 className="text-5xl font-bold mb-6 leading-tight">JOURNEY</h1>
          <div className="w-20 h-1 bg-amber-600 mb-8"></div>

          <p className="text-neutral-300 text-lg mb-12">
            Join thousands of satisfied customers and get access to premium
            vehicles at your fingertips.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center shrink-0">
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
                  Book your vehicle in seconds with our streamlined process
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center shrink-0">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Best Prices</h3>
                <p className="text-neutral-400 text-sm">
                  Competitive rates with no hidden fees
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center shrink-0">
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
                <p className="text-neutral-400 text-sm">
                  Our team is always here to help you
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-neutral-500 text-sm">
          © 2026 RentRide. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-center p-8">
        <div className="w-full bg-neutral-800/90 backdrop-blur-md rounded-2xl p-8 border border-neutral-700 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              CREATE ACCOUNT
            </h2>
            <p className="text-neutral-400 text-sm">
              Fill in your details to get started
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
