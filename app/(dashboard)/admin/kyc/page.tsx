import KYCReviewPanel from "@/features/kyc/components/KYCReviewPanel";
import Link from "next/link";

export default function AdminKYCPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
          zIndex: -1,
        }}
      />
      <div className="fixed inset-0 bg-neutral-900/90" style={{ zIndex: -1 }} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        <KYCReviewPanel />
      </div>
    </div>
  );
}
