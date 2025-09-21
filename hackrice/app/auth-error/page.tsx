"use client"

import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">
          Oops! Something went wrong while trying to log you in.
        </p>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
