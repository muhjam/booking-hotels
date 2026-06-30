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

  // Debugging state
  const [debug, setDebug] = useState<string[]>([]);
  const addLog = (msg: string) => setDebug(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  useEffect(() => {
    addLog("Authorize page mounted");
    setIsHydrated(true);
    addLog("Hydration finished");
  }, []);

  const clientId = searchParams.get("client_id") || "mcp-default-client";
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const responseType = searchParams.get("response_type");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");

  useEffect(() => {
    if (isHydrated) {
      addLog(`User status: ${user ? "Logged in (" + user.email + ")" : "Not logged in"}`);
      if (!user) {
        addLog("Redirecting to login...");
        const currentUrl = encodeURIComponent(window.location.href);
        setTimeout(() => {
          router.push(`/login?callbackUrl=${currentUrl}`);
        }, 1000);
      }
    }
  }, [isHydrated, user, router]);

  const handleAuthorize = async () => {
    if (!user || !clientId || !redirectUri) {
      addLog("Cannot authorize: missing user, client_id, or redirect_uri");
      return;
    }

    setLoading(true);
    addLog("Requesting authorization code...");
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
        addLog("Code received, redirecting back to ChatGPT...");
        const url = new URL(redirectUri);
        url.searchParams.set("code", data.code);
        if (state) url.searchParams.set("state", state);
        window.location.href = url.toString();
      } else {
        addLog(`Error from API: ${data.error || "Unknown error"}`);
        alert("Failed to authorize: " + (data.error || "Unknown error"));
      }
    } catch (error: any) {
      addLog(`Fetch error: ${error.message}`);
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
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
            The app <span className="font-semibold text-blue-600">{clientId || "Unknown"}</span> wants to access your Hotels account.
          </p>
        </div>
        
        {!user ? (
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-800">You need to be logged in to authorize this app.</p>
            <button 
              onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`)}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        ) : !clientId || !redirectUri ? (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-800 font-bold">Invalid OAuth Request</p>
            <p className="text-xs text-red-600 mt-1">Missing client_id or redirect_uri.</p>
            <div className="mt-4 p-2 bg-gray-100 rounded text-[10px] font-mono break-all text-left">
              URL: {window.location.search}
            </div>
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

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Debug Logs:</p>
          <div className="bg-gray-900 text-green-400 p-3 rounded-md text-[10px] font-mono h-32 overflow-y-auto">
            {debug.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>

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
