"use client";

import { useState } from "react";
import Link from "next/link";

const vehicles = [
  {
    id: 1,
    name: "Tesla Model S",
    category: "Electric Luxury",
    type: "LUXURY",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
    rating: 4.9,
    seats: 5,
    transmission: "Auto",
    features: ["Autopilot", "Supercharging"],
    price: 149,
    originalPrice: 175,
    popular: true,
  },
  {
    id: 2,
    name: "BMW X5 M Sport",
    category: "Luxury SUV",
    type: "SUVS",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    rating: 4.8,
    seats: 7,
    transmission: "Auto",
    features: ["All-Wheel Drive", "Panoramic Roof"],
    price: 129,
    originalPrice: 155,
    popular: false,
  },
  {
    id: 3,
    name: "Mercedes C-Class AMG",
    category: "Premium Sedan",
    type: "LUXURY",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    rating: 4.9,
    seats: 5,
    transmission: "Auto",
    features: ["AMG Performance", "MBUX System"],
    price: 119,
    originalPrice: 145,
    popular: false,
  },
  {
    id: 4,
    name: "Porsche 911 Carrera",
    category: "Sports Car",
    type: "SPORTS",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    rating: 5.0,
    seats: 2,
    transmission: "Manual/Auto",
    features: ["Sport Chrono", "PASM"],
    price: 299,
    originalPrice: 349,
    popular: true,
  },
  {
    id: 5,
    name: "Range Rover Evoque",
    category: "Compact SUV",
    type: "SUVS",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    rating: 4.7,
    seats: 5,
    transmission: "Auto",
    features: ["Terrain Response", "Meridian Audio"],
    price: 99,
    originalPrice: 125,
    popular: false,
  },
  {
    id: 6,
    name: "Ducati Panigale V4",
    category: "Sport Bike",
    type: "BIKES",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    rating: 4.9,
    seats: 2,
    transmission: "Manual",
    features: ["Racing Mode", "Quick Shifter"],
    price: 179,
    originalPrice: 210,
    popular: false,
  },
  {
    id: 7,
    name: "Harley-Davidson Street 750",
    category: "Cruiser Bike",
    type: "BIKES",
    image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800",
    rating: 4.7,
    seats: 2,
    transmission: "Manual",
    features: ["Cruise Control", "ABS"],
    price: 89,
    originalPrice: 115,
    popular: false,
  },
  {
    id: 8,
    name: "Toyota Prius Hybrid",
    category: "Eco-Friendly",
    type: "ECONOMY",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    rating: 4.4,
    seats: 5,
    transmission: "CVT",
    features: ["Hybrid System", "Eco Mode"],
    price: 59,
    originalPrice: 75,
    popular: false,
  },
  {
    id: 9,
    name: "Vespa Primavera 150",
    category: "Classic Scooter",
    type: "SCOOTERS",
    image:
      "https://cdn.pixabay.com/photo/2020/08/22/01/27/vespa-5507329_640.jpg",
    rating: 4.6,
    seats: 2,
    transmission: "Auto",
    features: ["Fuel Efficient", "USB Charging"],
    price: 35,
    originalPrice: 45,
    popular: false,
  },
  {
    id: 10,
    name: "Honda Activa 6G",
    category: "City Scooter",
    type: "SCOOTERS",
    image:
      "https://cdn.pixabay.com/photo/2014/02/26/11/05/motor-scooter-275017_640.jpg",
    rating: 4.5,
    seats: 2,
    transmission: "Auto",
    features: ["LED Lights", "Digital Console"],
    price: 25,
    originalPrice: 35,
    popular: false,
  },
  {
    id: 11,
    name: "Honda CB350",
    category: "Standard Bike",
    type: "BIKES",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
    rating: 4.6,
    seats: 2,
    transmission: "Manual",
    features: ["Classic Design", "Comfortable Ride"],
    price: 45,
    originalPrice: 60,
    popular: false,
  },
  {
    id: 12,
    name: "Yamaha MT-15",
    category: "Street Fighter",
    type: "BIKES",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
    rating: 4.7,
    seats: 2,
    transmission: "Manual",
    features: ["Sporty Design", "ABS"],
    price: 55,
    originalPrice: 70,
    popular: false,
  },
  {
    id: 13,
    name: "Honda City",
    category: "Sedan",
    type: "ECONOMY",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    rating: 4.5,
    seats: 5,
    transmission: "Auto",
    features: ["Spacious", "Fuel Efficient"],
    price: 65,
    originalPrice: 80,
    popular: false,
  },
  {
    id: 14,
    name: "Hyundai Creta",
    category: "Compact SUV",
    type: "SUVS",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    rating: 4.6,
    seats: 5,
    transmission: "Auto",
    features: ["Sunroof", "Touchscreen"],
    price: 85,
    originalPrice: 105,
    popular: false,
  },
  {
    id: 15,
    name: "TVS Jupiter",
    category: "Family Scooter",
    type: "SCOOTERS",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    rating: 4.4,
    seats: 2,
    transmission: "Auto",
    features: ["Storage Space", "Smooth Ride"],
    price: 30,
    originalPrice: 40,
    popular: false,
  },
  {
    id: 16,
    name: "Maruti Swift",
    category: "Hatchback",
    type: "ECONOMY",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    rating: 4.5,
    seats: 5,
    transmission: "Manual/Auto",
    features: ["Compact", "Easy Parking"],
    price: 50,
    originalPrice: 65,
    popular: false,
  },
];

const categories = [
  { id: "ALL", label: "ALL VEHICLES", count: 16 },
  { id: "LUXURY", label: "LUXURY", count: 2 },
  { id: "SUVS", label: "SUVS", count: 3 },
  { id: "SPORTS", label: "SPORTS", count: 1 },
  { id: "BIKES", label: "BIKES", count: 4 },
  { id: "SCOOTERS", label: "SCOOTERS", count: 3 },
  { id: "ECONOMY", label: "ECONOMY", count: 3 },
];

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredVehicles =
    selectedCategory === "ALL"
      ? vehicles
      : vehicles.filter((v) => v.type === selectedCategory);

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
              className="text-amber-500 transition-colors text-sm tracking-wide uppercase font-medium"
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
          Our Premium Fleet
        </h1>
        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
          Choose from our extensive collection of luxury vehicles, sports cars,
          and premium SUVs
        </p>
      </div>

      {/* Advanced Search Bar */}
      <div className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Pickup Location */}
              <div className="relative">
                <label className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or airport"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Pickup Date */}
              <div className="relative">
                <label className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Pickup Time */}
              <div className="relative">
                <label className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4"
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
                  Pickup Time
                </label>
                <input
                  type="time"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Return Date */}
              <div className="relative">
                <label className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Return Date
                </label>
                <input
                  type="date"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide">
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
                  Search Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-6 mb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded font-medium text-sm tracking-wide uppercase transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-600 text-neutral-900"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-neutral-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {vehicle.popular && (
                  <div className="absolute top-3 left-3 bg-amber-600 text-neutral-900 px-3 py-1 rounded text-xs font-bold uppercase">
                    Popular
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-neutral-900/80 px-2 py-1 rounded">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-sm font-semibold">
                    {vehicle.rating}
                  </span>
                </div>
                <button className="absolute bottom-3 right-3 w-8 h-8 bg-neutral-900/80 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-1">
                  {vehicle.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-4">
                  {vehicle.category}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-700 text-amber-500 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 text-neutral-400 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{vehicle.seats}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-2xl font-bold">
                        Rs.{vehicle.price}
                      </span>
                      <span className="text-neutral-500 text-sm line-through">
                        Rs.{vehicle.originalPrice}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-xs">/day</span>
                  </div>
                  <Link
                    href={`/renter/vehicles/${vehicle.id}`}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm rounded transition-colors flex items-center gap-1"
                  >
                    VIEW
                    <svg
                      className="w-4 h-4"
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
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center pb-16">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded transition-colors flex items-center gap-2 mx-auto"
        >
          VIEW ALL VEHICLES
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
        </button>
      </div>
    </div>
  );
}
