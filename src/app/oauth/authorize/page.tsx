"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";

function AuthorizeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const clientId = searchParams.get("client_id") || "mcp-default-client";
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");

  useEffect(() => {
    if (isHydrated && !user) {
      const currentUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${currentUrl}`);
    }
  }, [isHydrated, user, router]);

  const handleAuthorize = async () => {
    if (!user || !redirectUri) return;

    setLoading(true);
    try {
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          clientId,
          codeChallenge,
          codeChallengeMethod,
        }),
      });

      const data = await res.json();
      if (data.code) {
        const url = new URL(redirectUri);
        url.searchParams.set("code", data.code);
        if (state) url.searchParams.set("state", state);
        window.location.href = url.toString();
      } else {
        alert("Failed to authorize: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || (!user && isHydrated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isHydrated ? "Initializing..." : "Redirecting to login..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authorize App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The app <span className="font-semibold text-blue-600">{clientId}</span> wants to access your Hotels account.
          </p>
        </div>
        
        {!redirectUri ? (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-800 font-bold">Invalid OAuth Request</p>
            <p className="text-xs text-red-600 mt-1">Missing redirect_uri.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-semibold">Permissions:</p>
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
        )}

        {user && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Logged in as <span className="font-medium text-gray-900">{user.email}</span>
            </p>
          </div>
        )}
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
