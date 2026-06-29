import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, clientId } = await req.json();

    if (!userId || !clientId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Generate a random authorization code
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Store the code in the database
    await prisma.oAuthToken.create({
      data: {
        userId,
        code,
        // Set an expiry for the code (e.g., 10 minutes)
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ code });
  } catch (error) {
    console.error("OAuth Authorization Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
