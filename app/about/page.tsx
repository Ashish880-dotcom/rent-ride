import Link from "next/link";

const stats = [
  { number: "500+", label: "Premium Vehicles" },
  { number: "10K+", label: "Happy Customers" },
  { number: "50+", label: "Cities Covered" },
  { number: "24/7", label: "Customer Support" },
];

const values = [
  {
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    title: "Trust & Safety",
    description:
      "Every vehicle is thoroughly inspected and insured. Your safety is our top priority.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    title: "Quality Excellence",
    description:
      "Premium vehicles maintained to the highest standards for your comfort and satisfaction.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    title: "Fair Pricing",
    description:
      "Transparent pricing with no hidden fees. Get the best value for your money.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    title: "Customer First",
    description:
      "Dedicated support team available 24/7 to ensure your journey is smooth and enjoyable.",
  },
];

const team = [
  {
    name: "Shyam Gautam",
    role: "Founder & CEO",
    image: "/team/shyam-gautam.jpg",
    description: "Visionary leader with 15+ years in automotive industry",
  },
  {
    name: "Koshish Thapa",
    role: "Head of Operations",
    image: "/team/koshish-thapa.jpg",
    description: "Expert in fleet management and customer experience",
  },
  {
    name: "Ashish Chaudhary",
    role: "Lead Developer & Technology Director",
    image: "/team/ashish-chaudhary.jpg",
    description: "Tech innovator building seamless rental experiences",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
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
              className="text-amber-500 transition-colors text-sm tracking-wide uppercase font-medium"
            >
              About
            </Link>
            <Link
              href="/#contact"
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
      <div className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920')",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            About RentRide
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Redefining Vehicle Rentals
          </h1>
          <p className="text-neutral-300 text-xl leading-relaxed">
            Since 2026, we've been committed to providing premium vehicle rental
            experiences that combine luxury, convenience, and exceptional
            service.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 text-center hover:border-amber-600 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-400 uppercase tracking-wide text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="px-6 py-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-neutral-300 leading-relaxed">
                <p>
                  RentRide was born from a simple vision: to make premium
                  vehicle rentals accessible, transparent, and hassle-free for
                  everyone. Founded in 2026, we recognized the need for a modern
                  rental platform that puts customers first.
                </p>
                <p>
                  What started as a small fleet of luxury cars has grown into a
                  comprehensive collection of over 500 premium vehicles,
                  including sports cars, SUVs, motorcycles, and eco-friendly
                  options. We've served over 10,000 satisfied customers across
                  50+ cities.
                </p>
                <p>
                  Our commitment to excellence, safety, and customer
                  satisfaction has made us a trusted name in the vehicle rental
                  industry. Every vehicle in our fleet is meticulously
                  maintained and fully insured, ensuring you have a safe and
                  enjoyable journey.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
                alt="Luxury cars"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-neutral-400 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-amber-600 transition-all hover:transform hover:scale-105"
              >
                <div className="w-14 h-14 bg-amber-600/20 rounded-lg flex items-center justify-center text-amber-500 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-neutral-400 text-lg">
              The passionate people behind RentRide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden hover:border-amber-600 transition-all hover:transform hover:scale-105"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-500 text-sm font-medium mb-3 uppercase tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-neutral-400 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Our Mission
          </h2>
          <p className="text-neutral-300 text-xl leading-relaxed mb-8">
            To revolutionize the vehicle rental experience by providing seamless
            access to premium vehicles, backed by exceptional service and
            cutting-edge technology. We believe everyone deserves to drive their
            dream vehicle, whether for business, leisure, or special occasions.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
          >
            Explore Our Fleet
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-neutral-400 text-lg mb-8">
            Join thousands of satisfied customers and experience the RentRide
            difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
            >
              Get Started
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 border-2 border-neutral-600 hover:border-white text-neutral-300 hover:text-white font-bold text-sm tracking-wide uppercase transition-colors rounded"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
