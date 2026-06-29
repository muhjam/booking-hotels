import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // ChatGPT sends these as form-data or JSON
    let body;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      body = await req.json();
    }

    const { grant_type, code, client_id, client_secret } = body;

    if (grant_type !== "authorization_code") {
      return NextResponse.json({ error: "Unsupported grant type" }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Find the token record with this code
    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!tokenRecord || (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date())) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Generate access token
    const accessToken = "at_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const refreshToken = "rt_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Update the record with tokens and clear the code
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: {
        code: null,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 30 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error("OAuth Token Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
