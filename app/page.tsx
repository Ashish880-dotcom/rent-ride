import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Top Banner */}
      <div className="bg-neutral-950 text-neutral-400 text-center py-2 text-xs tracking-widest uppercase">
        Premium Vehicle Rentals — Trusted Since 2026
      </div>

      {/* Navigation */}
      <nav className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              RentRide
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/vehicles"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Vehicles
            </Link>
            <Link
              href="/services"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070')",
            filter: "brightness(0.4)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-6 font-light">
            Est. 2026 — Premium Vehicle Rentals
          </p>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-4 leading-tight">
            Every Journey Tells
          </h1>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-amber-500 mb-8">
            a Story
          </h2>

          <p className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            From sleek city bikes to luxury cars. Discover premium vehicles
            curated for the discerning traveler.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group px-8 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-medium tracking-wide uppercase text-sm transition-all duration-300 flex items-center gap-2"
            >
              Explore Collection
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-neutral-400 hover:border-white text-neutral-300 hover:text-white font-medium tracking-wide uppercase text-sm transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-neutral-900 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-white">
              Premium Experience
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-600/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-500"
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
              <h3 className="text-xl font-serif text-white mb-3">
                Verified Vehicles
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Every vehicle undergoes rigorous inspection to ensure your
                safety and comfort.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-600/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">
                Instant Booking
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Book your perfect ride in minutes with our streamlined rental
                process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-600/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">
                24/7 Support
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Our dedicated team is always ready to assist you on your
                journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-neutral-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-amber-100 tracking-wide">
              RentRide
            </span>
          </Link>
          <p className="text-neutral-500 text-sm">
            © 2026 RentRide. Crafted with passion for travelers.
          </p>
        </div>
      </footer>
    </div>
  );
}
