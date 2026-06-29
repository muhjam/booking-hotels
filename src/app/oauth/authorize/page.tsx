"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";

function AuthorizeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!user) {
      const currentUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${currentUrl}`);
    }
  }, [user, router]);

  const handleAuthorize = async () => {
    if (!user || !clientId || !redirectUri) return;

    setLoading(true);
    try {
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          clientId,
        }),
      });

      const data = await res.json();
      if (data.code) {
        const url = new URL(redirectUri);
        url.searchParams.set("code", data.code);
        if (state) url.searchParams.set("state", state);
        window.location.href = url.toString();
      } else {
        alert("Failed to authorize");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authorize App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The app <span className="font-semibold text-blue-600">{clientId}</span> wants to access your Hotels account.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              This will allow the app to:
            </p>
            <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>View your bookings</li>
              <li>Search for hotels on your behalf</li>
              <li>Make new bookings</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Authorizing..." : "Authorize"}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Logged in as <span className="font-medium text-gray-900">{user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthorizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthorizeContent />
    </Suspense>
  );
}
