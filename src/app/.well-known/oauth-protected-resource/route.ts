import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
  
  return NextResponse.json({
    resource: `${baseUrl}/`,
    authorization_servers: [`${baseUrl}/`],
    resource_name: "Hotels MCP"
  });
}
