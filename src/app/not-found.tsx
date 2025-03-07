"use client";

import { useRouter } from "next/navigation";
import { RocketIcon } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6 text-blue-800">
        <RocketIcon size={80} />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-blue-800">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-8 max-w-md">
        Oops! It seems like the page you&apos;re looking for has launched into
        space.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
