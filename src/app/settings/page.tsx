"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchApiKey();
  }, [user, router]);

  const fetchApiKey = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/api-key", {
        headers: { "x-user-id": user.id }
      });
      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error("Failed to fetch API Key", error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/user/api-key", { 
        method: "POST",
        headers: { "x-user-id": user.id }
      });
      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error("Failed to generate API Key", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">MCP API Key</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Use this key to connect your Hotels account to ChatGPT or other MCP clients. 
          In ChatGPT, select <strong>API Key</strong> as the authentication method and paste this key.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm break-all">
            {apiKey || "No API Key generated yet."}
          </div>
          <button
            onClick={generateApiKey}
            disabled={generating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {generating ? "Generating..." : apiKey ? "Regenerate Key" : "Generate Key"}
          </button>
        </div>
        
        {apiKey && (
          <p className="mt-4 text-xs text-red-500 font-medium">
            Keep this key secret. Anyone with this key can access your account data via MCP.
          </p>
        )}
      </div>
    </div>
  );
}
