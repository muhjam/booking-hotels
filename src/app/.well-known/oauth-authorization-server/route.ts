import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  return NextResponse.json({
    issuer: `${baseUrl}/`,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint: `${baseUrl}/api/oauth/token`,
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post", "none"],
    grant_types_supported: ["authorization_code", "refresh_token"]
  });
}
