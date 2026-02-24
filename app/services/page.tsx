"use client";

import Link from "next/link";

const services = [
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
    title: "Fully Insured",
    description: "Comprehensive coverage for complete peace of mind",
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "24/7 Support",
    description: "Round-the-clock assistance whenever you need it",
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
    title: "Best Prices",
    description: "Competitive rates with no hidden fees",
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Instant Booking",
    description: "Book and drive in minutes, not hours",
  },
];

const vehicleTypes = [
  {
    title: "Premium Cars",
    description:
      "Experience luxury with our collection of high-end sedans, SUVs, and sports cars. From business meetings to special occasions, we have the perfect vehicle for every need.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  },
  {
    title: "Motorcycles & Bikes",
    description:
      "Feel the thrill of the open road with our range of sport bikes, cruisers, and touring motorcycles. Perfect for solo adventures or weekend getaways.",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
  },
  {
    title: "Scooters",
    description:
      "Navigate city streets with ease using our fuel-efficient and eco-friendly scooters. Ideal for daily commutes and quick errands around town.",
    image:
      "https://cdn.pixabay.com/photo/2020/08/22/01/27/vespa-5507329_640.jpg",
  },
  {
    title: "Latest Models",
    description:
      "Stay ahead with our monthly updated fleet featuring the newest releases from top manufacturers. Be among the first to experience cutting-edge automotive technology.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    image:
      "https://m.media-amazon.com/images/M/MV5BNjUzYzQxYTYtMDU4Ny00MjYzLTgzMmYtNmUxZTc1ZTY2Yzc3XkEyXkFqcGc@.jpg",
    rating: 5,
    text: "Outstanding service! I rented a BMW for my business trip and the experience was seamless. The car was in perfect condition and the booking process was incredibly smooth.",
  },
  {
    name: "Priya Sharma",
    role: "Travel Enthusiast",
    image:
      "https://daphnejackson.org/wp-content/uploads/2024/10/Dr-Priya-Sharma.jpg",
    rating: 5,
    text: "RentRide made my road trip unforgettable. Great selection of vehicles, fair prices, and excellent customer support. Highly recommended for anyone looking for quality rentals!",
  },
  {
    name: "Amit Thapa",
    role: "Software Engineer",
    image:
      "https://www.dramitthapa.com.np/uploads/gallery/13629387996717c0582dc7d6.79783626_DSC03371%20(1).jpeg",
    rating: 5,
    text: "Perfect for special occasions. The luxury vehicles are well-maintained and the staff is professional. I've used their service multiple times and never been disappointed.",
  },
];

export default function ServicesPage() {
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
              className="text-amber-500 transition-colors text-sm tracking-wide uppercase font-medium"
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
              href="/contact"
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
      <div className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Our Services
        </h1>
        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
          Discover premium vehicle rental services tailored to your needs
        </p>
      </div>

      {/* Service Features */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-amber-600 transition-colors"
            >
              <div className="w-14 h-14 bg-amber-600 rounded-lg flex items-center justify-center text-neutral-900 mb-4">
                {service.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Types Section */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Our Fleet Collection
            </h2>
            <p className="text-neutral-400 text-lg">
              From luxury cars to eco-friendly scooters, we have it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vehicleTypes.map((type, index) => (
              <div
                key={index}
                className="bg-neutral-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-3">
                    {type.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-6 pb-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-neutral-400 text-lg">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-neutral-800 rounded-lg p-6 border border-neutral-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-300 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-neutral-400 text-lg mb-8">
            Join over 50,000 happy customers and experience the future of
            vehicle rental today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vehicles"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded flex items-center justify-center gap-2"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse All Vehicles
            </Link>
            <Link
              href="tel:+1234567890"
              className="px-8 py-4 border-2 border-neutral-600 hover:border-white text-neutral-300 hover:text-white font-bold text-sm tracking-wide uppercase transition-colors rounded flex items-center justify-center gap-2"
            >
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
