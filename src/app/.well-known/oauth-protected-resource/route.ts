import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Metadata ini memberitahu AI Host (seperti ChatGPT) 
  // di mana letak server otorisasi kita secara otomatis.
  return NextResponse.json({
    resource: baseUrl,
    authorization_servers: [`${baseUrl}`],
    // Ini adalah bagian "magic" - kita bisa mendefinisikan 
    // konfigurasi auth di sini agar AI Host bisa membacanya.
    scopes_supported: ["read", "write"],
    auth_type: "oauth2",
    oauth2_config: {
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/api/oauth/token`,
      // Dengan menyediakan metadata ini, beberapa AI Host 
      // bisa melakukan auto-discovery.
    }
  });
}
