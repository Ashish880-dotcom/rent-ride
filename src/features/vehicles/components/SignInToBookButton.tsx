"use client";

import Link from "next/link";

interface SignInToBookButtonProps {
  vehicleId: string;
}

export default function SignInToBookButton({
  vehicleId,
}: SignInToBookButtonProps) {
  const returnUrl = `/vehicles/${vehicleId}`;
  const loginUrl = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <div className="space-y-4">
      <Link
        href={loginUrl}
        className="w-full block text-center px-6 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-lg rounded-lg transition-colors uppercase tracking-wide"
      >
        Sign in to Book
      </Link>
      <p className="text-neutral-400 text-sm text-center">
        Create an account to start booking premium vehicles
      </p>
    </div>
  );
}
