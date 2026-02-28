import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/core/lib/auth";
import SignInToBookButton from "@/features/vehicles/components/SignInToBookButton";
import BookingForm from "@/features/vehicles/components/BookingForm";

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description?: string;
  images: string[];
  status: string;
  owner: {
    id: string;
    email: string;
  };
  feedbacks: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    renter: {
      id: string;
      email: string;
    };
  }>;
}

async function getVehicleData(vehicleId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/vehicles/${vehicleId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getVehicleData(id);

  if (!data?.vehicle) {
    return {
      title: "Vehicle Not Found | RentRide",
      description: "The vehicle you're looking for is not available.",
    };
  }

  const vehicle = data.vehicle as Vehicle;
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - Rent Now | RentRide`;
  const description = `Rent a ${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.location}. Starting at Rs.${vehicle.pricePerDay}/day. ${vehicle.description || "Premium vehicle rental."}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://rentride.com/vehicles/${id}`,
      images: [
        {
          url:
            vehicle.images[0] ||
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=630",
          width: 1200,
          height: 630,
          alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        vehicle.images[0] ||
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=630",
      ],
    },
    alternates: {
      canonical: `https://rentride.com/vehicles/${id}`,
    },
  };
}

function generateStructuredData(vehicle: Vehicle, averageRating: number) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: vehicle.description,
    image: vehicle.images,
    brand: {
      "@type": "Brand",
      name: vehicle.make,
    },
    offers: {
      "@type": "Offer",
      price: vehicle.pricePerDay,
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: vehicle.feedbacks.length,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const data = await getVehicleData(id);

  if (!data?.vehicle) {
    notFound();
  }

  const vehicle = data.vehicle as Vehicle;
  const averageRating = data.averageRating || 0;
  const structuredData = generateStructuredData(vehicle, averageRating);

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

          <div className="flex items-center gap-4">
            <Link
              href="/vehicles"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Back to Vehicles
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-8">
          <Link href="/vehicles" className="hover:text-white transition-colors">
            Vehicles
          </Link>
          <span>/</span>
          <span className="text-white">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-6">
              <img
                src={
                  vehicle.images[0] ||
                  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200"
                }
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Image Gallery */}
            {vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {vehicle.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            {/* Vehicle Details */}
            <div className="bg-neutral-800 rounded-lg p-8 mb-8 border border-neutral-700">
              <h1 className="text-4xl font-bold text-white mb-4">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-neutral-400 text-sm uppercase tracking-wide mb-2">
                    Year
                  </p>
                  <p className="text-white text-xl font-bold">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm uppercase tracking-wide mb-2">
                    Make
                  </p>
                  <p className="text-white text-xl font-bold">{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm uppercase tracking-wide mb-2">
                    Model
                  </p>
                  <p className="text-white text-xl font-bold">
                    {vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm uppercase tracking-wide mb-2">
                    Location
                  </p>
                  <p className="text-white text-xl font-bold flex items-center gap-2">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {vehicle.location}
                  </p>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Description
                  </h2>
                  <p className="text-neutral-300 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}
            </div>

            {/* Ratings and Feedback */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating)
                            ? "text-amber-500"
                            : "text-neutral-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-neutral-400">
                    ({vehicle.feedbacks.length} reviews)
                  </span>
                </div>
              </div>

              {vehicle.feedbacks.length > 0 ? (
                <div className="space-y-6">
                  {vehicle.feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-b border-neutral-700 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold">
                            {feedback.renter.email.split("@")[0]}
                          </p>
                          <p className="text-neutral-400 text-sm">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating
                                  ? "text-amber-500"
                                  : "text-neutral-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-300">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 text-center py-8">
                  No reviews yet. Be the first to review this vehicle!
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 sticky top-24">
              {/* Price */}
              <div className="mb-8">
                <p className="text-neutral-400 text-sm uppercase tracking-wide mb-2">
                  Price per day
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-amber-500">
                    Rs.{vehicle.pricePerDay}
                  </span>
                  <span className="text-neutral-400">/day</span>
                </div>
              </div>

              {/* Booking Section */}
              {session?.user ? (
                <BookingForm vehicleId={vehicle.id} />
              ) : (
                <SignInToBookButton vehicleId={vehicle.id} />
              )}

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-neutral-700 space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-white font-semibold">
                      Free Cancellation
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Cancel up to 24 hours before pickup
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-white font-semibold">Secure Payment</p>
                    <p className="text-neutral-400 text-sm">
                      Multiple payment options available
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-white font-semibold">24/7 Support</p>
                    <p className="text-neutral-400 text-sm">
                      We're here to help anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
