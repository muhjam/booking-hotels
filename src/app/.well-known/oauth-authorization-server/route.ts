import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
  
  return NextResponse.json({
    issuer: `${baseUrl}/`,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint: `${baseUrl}/api/oauth/token`,
    token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
    grant_types_supported: ["authorization_code", "refresh_token"]
  });
}
